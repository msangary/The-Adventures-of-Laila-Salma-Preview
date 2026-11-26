window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  let scene, camera, renderer, hemiLight, dirLight, streetLight, accentLight;
  let worldGroup = null;
  let hdCloudsGroup = null;
  let hdMotes = null;
  let hdPetals = null;
  let sparkleSystem = null;
  let sparkleIdx = 0;
  let starBurstGroup = null;
  let starBurstTimer = 0;
  let resetCheckAccum = 0;

  const clock = new THREE.Clock();
  const keys = {};
  const joy = { x: 0, y: 0, active: false };

  // Smooth damped orbit camera state (auto-follow, pinch-zoom, keyboard orbit & wall-clip spring arm)
  let camYaw = Math.PI;
  let targetCamYaw = Math.PI;
  let camPitch = 0.30;
  let targetCamPitch = 0.30;
  let camDist = 6.6;
  let targetCamDist = 6.6;
  let effectiveCamDist = 6.6;
  let manualCamCooldown = 0;
  const camTarget = new THREE.Vector3();
  const lastMoveInput = { x: 0, z: 0, moving: false };
  const activePointers = new Map();
  let lastPinchDist = null;
  let camOccluderBoxes = [];
  const camRay = new THREE.Ray();
  const camRayDir = new THREE.Vector3();
  const camRayHit = new THREE.Vector3();
  let camSnapNext = true;

  let velY = 0;
  let grounded = true;
  let salmaVelY = 0;
  let salmaGrounded = true;
  let miniMapCompact = false;
  let miniMapBgCanvas = null;
  let zoneBeacons = [];

  // Reusable per-frame scratch vectors (zero GC allocations during movement & camera loops)
  const _fwd = new THREE.Vector3();
  const _right = new THREE.Vector3();
  const _moveVec = new THREE.Vector3();
  const _desiredTarget = new THREE.Vector3();
  const _chasePos = new THREE.Vector3();
  const _chaseLook = new THREE.Vector3();
  const _frontPos = new THREE.Vector3();
  const _frontLook = new THREE.Vector3();

  LS.activeWorld = null;
  LS.getScene = function () { return scene; };
  LS.getEngineStats = function () {
    return {
      zoneBeacons: zoneBeacons.length,
      miniMapCached: !!miniMapBgCanvas,
      camOccluders: camOccluderBoxes.length
    };
  };
  LS.getCameraState = function () {
    return {
      yaw: camYaw,
      targetYaw: targetCamYaw,
      pitch: camPitch,
      dist: effectiveCamDist,
      targetDist: targetCamDist,
      mode: LS.runtime.camMode,
      occluders: camOccluderBoxes.length
    };
  };

  function wrapAngleDelta(from, to) {
    let d = (to - from) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  function buildCamOccluders() {
    camOccluderBoxes = [];
    if (!worldGroup) return;
    worldGroup.updateMatrixWorld(true);
    const box = new THREE.Box3();
    const size = new THREE.Vector3();
    worldGroup.traverse(obj => {
      if (!obj.isMesh || obj.isInstancedMesh || !obj.visible) return;
      if (obj.userData && (obj.userData.isOutline || obj.userData.noCamClip)) return;
      const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
      if (mat && mat.transparent && (mat.opacity === undefined || mat.opacity < 0.85)) return;
      if (!obj.geometry) return;
      const gType = obj.geometry.type || '';
      if (gType === 'PlaneGeometry' || gType === 'RingGeometry' || gType === 'CircleGeometry') return;
      box.setFromObject(obj);
      if (box.isEmpty()) return;
      box.getSize(size);
      // Include solid tall buildings & walls while skipping flat ground/water, low bridges, thin poles, and high tree canopies
      if (box.min.y <= 1.2 && box.max.y >= 2.5 && size.y >= 1.8 &&
          size.x >= 2.0 && size.z >= 2.0 && size.x <= 24.0 && size.z <= 24.0) {
        camOccluderBoxes.push(box.clone());
      }
    });
  }

  function showError(msg) {
    const ov = document.getElementById('error-overlay');
    const el = document.getElementById('error-message');
    if (el) el.textContent = msg;
    if (ov) ov.classList.remove('hidden');
  }

  function applyTimeOfDay() {
    const mode = LS.state.timeMode;
    const wid = LS.state.currentWorld;
    const meta = LS.WORLDS[wid] || LS.WORLDS.home_neighborhood;
    const btn = document.getElementById('btn-time');

    const isOpenAir = !meta.isInterior || wid === 'marrakech_riad';
    if (hdCloudsGroup) hdCloudsGroup.visible = isOpenAir;
    if (hdMotes) hdMotes.visible = isOpenAir;
    if (hdPetals) hdPetals.visible = !meta.isInterior && (wid === 'tokyo' || wid === 'kyoto');

    if (meta.isInterior && wid !== 'marrakech_riad') {
      scene.fog.color.setHex(
        wid === 'egypt_chamber' ? 0x4a3118
          : (wid === 'kyoto_room' ? 0x3b2c26 : (wid === 'safari_tent' ? 0x5c3e26 : 0xffeef4))
      );
      dirLight.color.setHex(wid === 'egypt_chamber' ? 0xffe4a0 : 0xfff1d6);
      dirLight.intensity = LS.isHD ? 0.85 : 0.62;
      hemiLight.color.setHex(0xfff4e2);
      hemiLight.groundColor.setHex(0x9a7d60);
      streetLight.intensity = wid === 'egypt_chamber' ? 0.65 : 0.32;
      accentLight.intensity = wid === 'egypt_chamber' ? 0.58 : 0.28;
      return;
    }

    const isWarmAfrica = wid === 'safari' || wid === 'egypt' || wid === 'marrakech' || wid === 'marrakech_riad';
    if (mode === 1) {
      scene.fog.color.setHex(wid === 'marrakech' ? 0xe07658 : (isWarmAfrica ? 0xe88b4f : (wid === 'kyoto' ? 0xeb9b6c : 0xf2a772)));
      dirLight.color.setHex(0xffa054);
      dirLight.intensity = LS.isHD ? 1.28 : 1.05;
      hemiLight.color.setHex(0xffc99e);
      hemiLight.groundColor.setHex(0x523f5c);
      streetLight.intensity = 0.72;
      accentLight.intensity = 0.85;
      if (btn) btn.textContent = '🌇';
    } else if (mode === 2) {
      scene.fog.color.setHex(wid === 'marrakech' ? 0x261e45 : 0x25355a);
      dirLight.color.setHex(0x88a8e6);
      dirLight.intensity = LS.isHD ? 0.72 : 0.62;
      hemiLight.color.setHex(0x50689c);
      hemiLight.groundColor.setHex(0x1f2536);
      streetLight.intensity = 1.05;
      accentLight.intensity = 1.15;
      if (btn) btn.textContent = '🌙';
    } else {
      scene.fog.color.setHex(wid === 'egypt' ? 0xf2dfb8 : (wid === 'marrakech' ? 0xf2d3be : (wid === 'safari' ? 0xeddcb8 : (LS.isHD ? 0xd8e8f5 : (wid === 'kyoto' ? 0xc8e4f2 : 0xcbe6f7)))));
      dirLight.color.setHex(isWarmAfrica ? 0xffe4a8 : (LS.isHD ? 0xffe4b3 : 0xfff1d0));
      dirLight.intensity = LS.isHD ? 1.26 : 1.14;
      hemiLight.color.setHex(isWarmAfrica ? 0xb4d8ff : (LS.isHD ? 0x9ac8ff : 0xbbe2ff));
      hemiLight.groundColor.setHex(wid === 'marrakech' ? 0x8f5b42 : (isWarmAfrica ? 0x8a6d3b : (LS.isHD ? 0x4f637a : 0x74855c)));
      streetLight.intensity = 0.25;
      accentLight.intensity = 0.35;
      if (btn) btn.textContent = '🌤️';
    }
    if (LS.hdPost && LS.hdPost.setTimeMode) LS.hdPost.setTimeMode(mode);

    if (hdCloudsGroup) {
      const topCol = mode === 1 ? 0xffe0b8 : (mode === 2 ? 0x6b80b0 : 0xfffdf8);
      const botCol = mode === 1 ? 0xc97b74 : (mode === 2 ? 0x384972 : 0xb8cee8);
      hdCloudsGroup.traverse(o => {
        if (o.isMesh && o.material) {
          o.material.color.setHex(o.userData && o.userData.isCloudShadow ? botCol : topCol);
        }
      });
    }
    if (hdMotes && hdMotes.material) {
      hdMotes.material.color.setHex(mode === 2 ? 0xd9ff70 : (mode === 1 ? 0xffdf80 : 0xfff8cc));
      hdMotes.material.opacity = mode === 2 ? 0.92 : (mode === 1 ? 0.78 : 0.55);
      hdMotes.material.size = mode === 2 ? 0.34 : 0.22;
    }

    if (LS.activeWorld && LS.activeWorld.skyMesh) {
      LS.activeWorld.skyMesh.material.map = LS.createSkyTexture(mode, wid);
      LS.activeWorld.skyMesh.material.needsUpdate = true;
    }
  }
  LS.applyTimeOfDay = applyTimeOfDay;

  let questTrailSystem = null;

  function getLeader() {
    if (LS.state && LS.state.activeLeader === 'salma' && LS.chars.salma) return LS.chars.salma;
    return LS.chars.laila;
  }

  function getCompanion() {
    if (LS.state && LS.state.activeLeader === 'salma' && LS.chars.salma) return LS.chars.laila;
    return LS.chars.salma;
  }

  LS.swapActiveSister = function () {
    if (LS.runtime.eating || LS.runtime.modalOpen || LS.runtime.traveling || LS.runtime.bikeRide || LS.runtime.safariRide || LS.runtime.balloonRide) return;
    LS.state.activeLeader = LS.state.activeLeader === 'salma' ? 'laila' : 'salma';
    LS.saveState();
    LS.playSFX('correct');
    const isSalma = LS.state.activeLeader === 'salma';
    LS.setSalmaBubbleText(isSalma
      ? 'Lead the way, Salma! Big sister Laila is right behind you! 💖'
      : 'Yay! Laila is leading the adventure again! 🌸', 3600);
    if (LS.refreshSpeechBubblesForLeader) LS.refreshSpeechBubblesForLeader();
    LS.showToast(isSalma ? '🧒 Now playing as Salma! (Laila follows)' : '👧 Now playing as Laila! (Salma follows)');
    if (LS.completeCozyMission) LS.completeCozyMission('swap');
    LS.updateHUD();
  };

  LS.dismissTitleScreen = function () {
    LS.runtime.titleScreenActive = false;
    if (LS.unlockAudio) LS.unlockAudio();
    const ts = document.getElementById('title-screen');
    if (ts) ts.classList.add('title-hidden');
    document.body.classList.remove('on-title-screen');
    // Place Laila & Salma cleanly at the active world's spawn point!
    const meta = LS.WORLDS[LS.state.currentWorld] || LS.WORLDS.home_neighborhood;
    const sp = meta.spawn;
    const baseH = getGroundH(sp.x, sp.z);
    if (LS.chars.laila) {
      LS.chars.laila.root.position.set(sp.x, baseH, sp.z);
      LS.chars.laila.root.rotation.y = sp.rotY;
    }
    if (LS.chars.salma) {
      LS.chars.salma.root.position.set(sp.x - 1.1, baseH, sp.z + 1.1);
      LS.chars.salma.root.rotation.y = sp.rotY;
    }
    camYaw = sp.rotY;
    targetCamYaw = sp.rotY;
    camPitch = meta.isInterior ? 0.38 : 0.30;
    targetCamPitch = camPitch;
    camDist = meta.isInterior ? 4.8 : 6.8;
    targetCamDist = camDist;
    camSnapNext = true;
    LS.playSFX('levelup');
    LS.showToast("🌸 Welcome home, Laila & Salma! Explore your Apartment, School, Gedo Mahmoud's House & Gray Qashqai!");
  };

  function initSparklesAndStars() {
    const count = 48;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) pos[i * 3 + 1] = -999;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffd6f0, size: 0.24, transparent: true, opacity: 0.92 });
    sparkleSystem = new THREE.Points(geo, mat);
    scene.add(sparkleSystem);

    // Golden Quest Guide Trail sparkles leading gently toward the next Story Chapter target!
    const qCount = 14;
    const qGeo = new THREE.BufferGeometry();
    const qPos = new Float32Array(qCount * 3);
    for (let i = 0; i < qCount; i++) qPos[i * 3 + 1] = -999;
    qGeo.setAttribute('position', new THREE.BufferAttribute(qPos, 3));
    const qMat = new THREE.PointsMaterial({ color: 0xffe066, size: 0.32, transparent: true, opacity: 0.82 });
    questTrailSystem = new THREE.Points(qGeo, qMat);
    scene.add(questTrailSystem);

    // 3D Star Particle Burst for Synchronized Sister High-Five!
    starBurstGroup = new THREE.Group();
    const starC = document.createElement('canvas');
    starC.width = 64; starC.height = 64;
    const sctx = starC.getContext('2d');
    sctx.font = 'bold 48px sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('⭐', 32, 48);
    const starTex = new THREE.CanvasTexture(starC);
    for (let i = 0; i < 12; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex, transparent: true }));
      sp.scale.set(0.42, 0.42, 1);
      sp.userData = {
        vx: Math.cos((i / 12) * Math.PI * 2) * (1.2 + (i % 3) * 0.4),
        vy: 1.8 + (i % 4) * 0.45,
        vz: Math.sin((i / 12) * Math.PI * 2) * (1.2 + (i % 3) * 0.4)
      };
      starBurstGroup.add(sp);
    }
    starBurstGroup.visible = false;
    scene.add(starBurstGroup);
  }

  function triggerStarBurst(origin) {
    if (!starBurstGroup) return;
    starBurstGroup.position.copy(origin).add(new THREE.Vector3(0, 1.4, 0));
    starBurstGroup.children.forEach(sp => {
      sp.position.set(0, 0, 0);
      sp.material.opacity = 1;
    });
    starBurstGroup.visible = true;
    starBurstTimer = 1.3;
  }

  function updateSparklesAndStars(dt, elapsed) {
    const leader = getLeader();
    if (sparkleSystem && leader) {
      const pos = sparkleSystem.geometry.attributes.position;
      const active = (LS.runtime.sparkleUntil && Date.now() < LS.runtime.sparkleUntil) ||
                     (LS.runtime.piggybackUntil && Date.now() < LS.runtime.piggybackUntil);
      if (active) {
        const lp = leader.root.position;
        const i = sparkleIdx % pos.count;
        pos.setXYZ(
          i,
          lp.x + (Math.random() - 0.5) * 0.9,
          lp.y + 0.4 + Math.random() * 1.1,
          lp.z + (Math.random() - 0.5) * 0.9
        );
        sparkleIdx++;
      }
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i);
        if (y > -50) {
          y += dt * 0.55;
          if (!active && y > 4.5) y = -999;
          pos.setY(i, y);
        }
      }
      pos.needsUpdate = true;
    }

    // Update Golden Story Quest Guide Trail
    if (questTrailSystem && leader && LS.activeWorld && LS.activeWorld.zones) {
      const qPos = questTrailSystem.geometry.attributes.position;
      const activeQ = (!LS.runtime.titleScreenActive && LS.getActiveStoryStep) ? LS.getActiveStoryStep(LS.state.currentWorld) : null;
      const targetZ = activeQ ? LS.activeWorld.zones.find(z => z.id === activeQ.targetZoneId) : null;
      if (targetZ && leader.root.position.distanceTo(targetZ.pos) > 3.2) {
        const lp = leader.root.position;
        const tp = targetZ.pos;
        const tBase = (elapsed || 0) * 0.45;
        for (let i = 0; i < qPos.count; i++) {
          const frac = ((i / qPos.count) + tBase) % 1.0;
          const x = lp.x + (tp.x - lp.x) * frac;
          const z = lp.z + (tp.z - lp.z) * frac;
          const gy = getGroundH(x, z);
          const y = gy + 0.55 + Math.sin(frac * Math.PI) * 0.55;
          qPos.setXYZ(i, x, y, z);
        }
        questTrailSystem.visible = true;
        qPos.needsUpdate = true;
      } else {
        questTrailSystem.visible = false;
      }
    }

    if (starBurstTimer > 0 && starBurstGroup) {
      starBurstTimer -= dt;
      starBurstGroup.children.forEach(sp => {
        sp.position.x += sp.userData.vx * dt;
        sp.position.y += sp.userData.vy * dt;
        sp.position.z += sp.userData.vz * dt;
        sp.userData.vy -= 2.2 * dt;
        sp.material.opacity = Math.max(0, starBurstTimer / 1.3);
      });
      if (starBurstTimer <= 0) starBurstGroup.visible = false;
    }
  }

  function clearWorldGroup() {
    if (LS.hdPost && LS.hdPost.clearAnimatedUniforms) {
      LS.hdPost.clearAnimatedUniforms();
    }
    zoneBeacons = [];
    if (!worldGroup) return;
    while (worldGroup.children.length > 0) {
      worldGroup.remove(worldGroup.children[0]);
    }
  }

  function buildZoneBeacons() {
    zoneBeacons = [];
    if (!LS.activeWorld || !LS.activeWorld.zones || !worldGroup) return;
    const outerGeo = new THREE.RingGeometry(0.92, 1.16, 28);
    const innerGeo = new THREE.RingGeometry(0.46, 0.56, 24);
    LS.activeWorld.zones.forEach((z, idx) => {
      if (!z || !z.id || z.id.startsWith('animal:')) return;
      const g = new THREE.Group();
      const gy = z.pos.y > 0.05 ? z.pos.y : getGroundH(z.pos.x, z.pos.z);
      g.position.set(z.pos.x, gy + 0.048, z.pos.z);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0xffd166, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false
      });
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xfff3b0, transparent: true, opacity: 0.34, side: THREE.DoubleSide, depthWrite: false
      });
      const outer = new THREE.Mesh(outerGeo, outerMat);
      outer.rotation.x = -Math.PI / 2;
      outer.userData.noCamClip = true;
      const inner = new THREE.Mesh(innerGeo, innerMat);
      inner.rotation.x = -Math.PI / 2;
      inner.userData.noCamClip = true;
      g.add(outer);
      g.add(inner);
      worldGroup.add(g);
      zoneBeacons.push({ id: z.id, group: g, outerMat, innerMat, phase: idx * 0.7 });
    });
  }

  function updateZoneBeacons(elapsed) {
    if (zoneBeacons.length === 0) return;
    const activeId = LS.runtime.nearZone ? LS.runtime.nearZone.id : null;
    for (let i = 0; i < zoneBeacons.length; i++) {
      const b = zoneBeacons[i];
      const isNear = b.id === activeId;
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * (isNear ? 5.2 : 2.6) + b.phase);
      const sc = isNear ? (1.10 + pulse * 0.14) : (0.94 + pulse * 0.09);
      b.group.scale.set(sc, 1, sc);
      b.outerMat.opacity = isNear ? (0.68 + pulse * 0.24) : (0.28 + pulse * 0.18);
      b.innerMat.opacity = isNear ? (0.55 + pulse * 0.25) : (0.18 + pulse * 0.16);
      b.outerMat.color.setHex(isNear ? 0xfff08a : 0xffd166);
    }
  }

  function cacheMiniMapBackground() {
    miniMapBgCanvas = null;
    if (!LS.activeWorld || !LS.activeWorld.drawMiniMap) return;
    const liveCanvas = document.getElementById('minimap-canvas');
    const W = liveCanvas ? liveCanvas.width : 176;
    const H = liveCanvas ? liveCanvas.height : 176;
    const mb = LS.WORLDS[LS.state.currentWorld] && LS.WORLDS[LS.state.currentWorld].mapBounds;
    if (!mb) return;
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const octx = off.getContext('2d');
    const toMapX = wx => ((wx - mb.minX) / (mb.maxX - mb.minX)) * W;
    const toMapY = wz => ((wz - mb.minZ) / (mb.maxZ - mb.minZ)) * H;
    LS.activeWorld.drawMiniMap(octx, W, H, toMapX, toMapY);
    miniMapBgCanvas = off;
  }

  LS.loadWorld = function (worldId, viaTrain, customSpawn) {
    const meta = LS.WORLDS[worldId];
    const builder = LS.worldBuilders[worldId];
    if (!meta || !builder) return;

    // Auto-check 2-hour Hide-and-Seek animal reset when entering outdoor worlds!
    let didResetAnimals = false;
    if (worldId === 'home_neighborhood' || worldId === 'tokyo' || worldId === 'kyoto' || worldId === 'safari' || worldId === 'egypt' || worldId === 'marrakech') {
      didResetAnimals = LS.checkAnimalReset(worldId);
    }

    if (LS.runtime.eating) LS.finishEatingAnimation(scene);
    LS.runtime.mochiGame = null;
    LS.runtime.parkActivity = null;
    if (LS.runtime.ngscActivity && LS.finishNGSCActivity) LS.finishNGSCActivity(true);
    LS.runtime.ngscActivity = null;
    if (LS.runtime.wave1Anim && LS.finishWave1Anim) LS.finishWave1Anim(true);
    LS.runtime.wave1Anim = null;
    LS.runtime.safariRide = null;
    LS.runtime.balloonRide = null;
    LS.runtime.cheetahRace = null;
    LS.runtime.watchtowerTimer = 0;
    LS.runtime.prideRoarTimer = 0;
    LS.runtime.bikeRide = null;
    const bikeBan = document.getElementById('bike-banner');
    if (bikeBan) bikeBan.classList.add('hidden');
    const balBan = document.getElementById('balloon-banner');
    if (balBan) balBan.classList.add('hidden');
    const chBan = document.getElementById('cheetah-banner');
    if (chBan) chBan.classList.add('hidden');
    const camBtn = document.getElementById('btn-safari-camera');
    if (camBtn) camBtn.classList.toggle('hidden', worldId !== 'safari');
    LS.runtime.nearZone = null;
    LS.runtime.piggybackUntil = 0;
    LS.closeAllModals();

    LS.state.currentWorld = worldId;
    if (!meta.isInterior) LS.saveState();

    LS.runtime.dynamicBubbles = [];
    clearWorldGroup();

    scene.fog.near = meta.fogNear || 55;
    scene.fog.far = meta.fogFar || 185;

    if (meta.isInterior) {
      const sh = worldId === 'home_apartment' ? 14 : 10;
      dirLight.position.set(4, 9, 5);
      dirLight.shadow.camera.left = -sh;
      dirLight.shadow.camera.right = sh;
      dirLight.shadow.camera.top = sh;
      dirLight.shadow.camera.bottom = -sh;
      dirLight.shadow.camera.updateProjectionMatrix();
      streetLight.position.set(0, 3.8, 0);
      accentLight.position.set(-3, 2.5, -2);
    } else if (worldId === 'safari') {
      dirLight.position.set(36, 28, 22);
      dirLight.shadow.camera.left = -64;
      dirLight.shadow.camera.right = 64;
      dirLight.shadow.camera.top = 56;
      dirLight.shadow.camera.bottom = -60;
      dirLight.shadow.camera.updateProjectionMatrix();
      streetLight.position.set(0, 5.4, 12);
      accentLight.position.set(-24.0, 4.2, -26.0);
    } else if (worldId === 'kyoto') {
      dirLight.position.set(28, 24, 20);
      dirLight.shadow.camera.left = -74;
      dirLight.shadow.camera.right = 74;
      dirLight.shadow.camera.top = 58;
      dirLight.shadow.camera.bottom = -64;
      dirLight.shadow.camera.updateProjectionMatrix();
      streetLight.position.set(0, 5.2, -10);
      accentLight.position.set(-22.0, 3.6, -27.5);
    } else if (worldId === 'home_neighborhood') {
      dirLight.position.set(30, 26, 20);
      dirLight.shadow.camera.left = -56;
      dirLight.shadow.camera.right = 56;
      dirLight.shadow.camera.top = 50;
      dirLight.shadow.camera.bottom = -50;
      dirLight.shadow.camera.updateProjectionMatrix();
      streetLight.position.set(0, 5.2, 4);
      accentLight.position.set(24.0, 4.2, -8.0);
    } else {
      dirLight.position.set(34, 24, 18);
      dirLight.shadow.camera.left = -74;
      dirLight.shadow.camera.right = 74;
      dirLight.shadow.camera.top = 58;
      dirLight.shadow.camera.bottom = -64;
      dirLight.shadow.camera.updateProjectionMatrix();
      streetLight.position.set(0, 5.2, -6);
      accentLight.position.set(24.0, 4.2, 16.0);
    }

    LS.activeWorld = builder.build(worldGroup, scene);
    buildCamOccluders();
    buildZoneBeacons();
    cacheMiniMapBackground();

    const sp = customSpawn || (viaTrain ? meta.arrivalSpawn : meta.spawn);
    const baseH = LS.activeWorld.getGroundHeight ? LS.activeWorld.getGroundHeight(sp.x, sp.z) : 0;
    LS.chars.laila.root.position.set(sp.x, baseH, sp.z);
    LS.chars.laila.root.rotation.y = sp.rotY;
    LS.chars.salma.root.position.set(sp.x - (meta.isInterior ? 1.25 : 1.1), baseH, sp.z + (meta.isInterior ? -0.45 : 1.1));
    LS.chars.salma.root.rotation.y = sp.rotY;
    grounded = true;
    salmaGrounded = true;
    velY = 0;
    salmaVelY = 0;

    if (LS.chars.mochi) {
      LS.chars.mochi.visible = !meta.isInterior;
      if (LS.activeWorld.mochiStartPos) {
        LS.chars.mochi.position.copy(LS.activeWorld.mochiStartPos);
      }
    }

    camYaw = sp.rotY;
    targetCamYaw = sp.rotY;
    camPitch = meta.isInterior ? 0.38 : 0.30;
    targetCamPitch = camPitch;
    camDist = meta.isInterior ? 5.2 : 6.8;
    targetCamDist = camDist;
    effectiveCamDist = camDist;
    manualCamCooldown = 0;
    camTarget.set(sp.x, baseH + 1.25, sp.z);
    camSnapNext = true;
    const initOffX = -Math.sin(camYaw) * Math.cos(camPitch) * camDist;
    const initOffY = Math.sin(camPitch) * camDist + 1.35;
    const initOffZ = -Math.cos(camYaw) * Math.cos(camPitch) * camDist;
    camera.position.set(sp.x + initOffX, baseH + initOffY, sp.z + initOffZ);
    camera.lookAt(camTarget);

    const legendAnimal = document.getElementById('mm-animal-label');
    if (legendAnimal) {
      legendAnimal.innerHTML = (worldId === 'home_neighborhood' || worldId === 'home_apartment')
        ? '<i class="mm-dot mm-cat"></i>Pups'
        : ((worldId === 'safari' || worldId === 'safari_tent')
          ? '<i class="mm-dot mm-cat"></i>Cubs'
          : ((worldId === 'kyoto' || worldId === 'kyoto_room' || worldId === 'marrakech' || worldId === 'marrakech_riad')
            ? '<i class="mm-dot mm-cat"></i>Foxes'
            : '<i class="mm-dot mm-cat"></i>Cats'));
    }
    const mmCard = document.getElementById('minimap-card');
    if (mmCard) mmCard.title = meta.title + ' Mini-Map (M to toggle)';

    if (worldId === 'home_apartment') {
      LS.setSalmaBubbleText('Home sweet home! Kitchen snacks, Laila\'s Piano, TV games, & our Magic Globe! 🎹🌍', 4500);
    } else if (worldId === 'egypt_chamber') {
      LS.setSalmaBubbleText("Whoa Laila!! Look at the Pharaoh's glowing Treasure Chest & Guardian Bastet!! 👑💎", 5000);
    } else if (worldId === 'marrakech_riad') {
      LS.setSalmaBubbleText('Look at the Atlas Mountains from our Riad Rooftop!! Let us decorate the carpets & lanterns!! 🕌🏮', 5000);
    } else if (meta.isInterior) {
      LS.setSalmaBubbleText(worldId === 'safari_tent'
        ? 'Whoa! Our cozy Safari Glamping Tent! Let us decorate the rug & cushions! ⛺✨'
        : 'Yay! Walk to the Decorate desk to redecorate our room in 3D! 🎨', 4200);
      if (worldId === 'safari_tent') LS.unlockStamp('safari_tent_decor');
      else if (worldId === 'tokyo_room' || worldId === 'kyoto_room') LS.unlockStamp('room_decorator');
    } else if (worldId === 'home_neighborhood') {
      LS.setSalmaBubbleText("Our Gated Community! Visit our Apartment, School, Gedo Mahmoud & Nana Omaima's House, or hop in the Gray Qashqai! 🏡🚙", 0);
    } else if (worldId === 'dest_eatery') {
      LS.setSalmaBubbleText('Yay, Eatery! Let us eat warm Rice, Molokhia & Chicken or creamy Pasta! 🍲🍝', 4800);
    } else if (worldId === 'dest_yiwan') {
      LS.setSalmaBubbleText('Mmm, Yiwan! Dumplings, Sweet & Sour Chicken, Jasmine Rice — or a Combo Feast! 🥟🍗', 4800);
    } else if (worldId === 'dest_cosmo_city') {
      LS.setSalmaBubbleText('Woohoo, Cosmo City Arcade! Let us try Space Meteors, Color Memory & the Claw Machine! 🚀🕹️', 4800);
    } else if (worldId === 'dest_grandparents') {
      LS.setSalmaBubbleText("Nano & Gedo's house! Nano is watching her soap opera & news, and Gedo is drinking tea by the window! 💛🫖", 4800);
    } else if (worldId === 'dest_mai_mostafa') {
      LS.setSalmaBubbleText("Whoa, Mai & Mostafa's Home overlooking the river!! Lasagna with Mai & board games with Nouzi & Bibo! 🏙️🌊🎲", 5500);
    } else if (worldId === 'dest_ngsc') {
      LS.setSalmaBubbleText('Woohoo, NGSC Sports Club! Laila can play squash and we can BOTH swim in the sparkling pool! 🎾🏊‍♀️💦', 5500);
    } else if (worldId === 'dest_gedo_mahmoud') {
      LS.setSalmaBubbleText("Yay, Gedo Mahmoud & Nana Omaima's house! Come give them big hugs and taste Nana's yummy treats! 🏡💛", 5200);
    } else if (worldId === 'safari') {
      LS.setSalmaBubbleText('Whoa, African Safari!! Quiz with Dr. Kofi, ride the Balloon or Jeep, & snap wildlife [F]! 🎈🦒', 0);
      LS.unlockStamp('safari_arrival');
    } else if (worldId === 'egypt') {
      LS.setSalmaBubbleText('Whoa, Ancient Egypt!! Look at the Great Pyramids, smiling Sphinx & white-sailed Nile Feluccas! 🐪⛵🔺', 0);
      LS.unlockStamp('egypt_arrival');
    } else if (worldId === 'marrakech') {
      LS.setSalmaBubbleText('Ooh, Marrakech Lantern Bazaar!! Craft glowing stained-glass lanterns, sip mint tea & find Fennec Foxes! 🏮🦊🫖', 0);
      LS.unlockStamp('marrakech_arrival');
    } else if (worldId === 'dest_airport') {
      LS.setSalmaBubbleText('Ooh, Sunnyside International Airport! Look at that huge blue airplane outside Gate A1! ✈️✨', 0);
    } else if (worldId === 'kyoto') {
      LS.setSalmaBubbleText('Whoa, expanded Kyoto! Explore Gion Lantern Street, quiz with Sensei Kenji & feed the koi! ⛩️🦊', 0);
      LS.unlockStamp('kyoto_arrival');
    } else {
      LS.setSalmaBubbleText('Yay, expanded Tokyo! Quiz with Sensei Haruka, visit Harajuku Crêpes & Cat Café Street! 🌸🐱', 0);
    }

    applyTimeOfDay();
    LS.updateHUD();

    if (didResetAnimals) {
      setTimeout(() => {
        LS.showToast(worldId === 'home_neighborhood'
          ? '🐶 2 hours passed! All 5 Community Puppies hid in brand-new spots!'
          : (worldId === 'safari'
            ? '🦁 2 hours passed! All 5 Safari Lion Cubs hid in brand-new spots!'
            : (worldId === 'egypt'
              ? '🐱 2 hours passed! All 5 Royal Egyptian Mau Cats hid in brand-new spots!'
              : (worldId === 'marrakech'
                ? '🦊 2 hours passed! All 5 Sahara Fennec Foxes hid in brand-new spots!'
                : (worldId === 'kyoto'
                  ? '🦊 2 hours passed! All 5 Kyoto Kitsune hid in brand-new spots!'
                  : '🐱 2 hours passed! All 5 Tokyo Cats hid in brand-new spots!')))));
      }, 600);
    }
  };

  LS.enterInterior = function (roomId) {
    LS.playSFX('door');
    LS.loadWorld(roomId, false);
    const toastMap = {
      home_apartment: "🏡 Welcome inside Laila & Salma's 4-Room Home Apartment!",
      safari_tent: "⛺ Welcome inside Laila & Salma's Safari Glamping Tent!",
      kyoto_room: "🏮 Welcome inside Laila & Salma's Kyoto Ryokan Suite!",
      egypt_chamber: '👑 Welcome inside the Golden Pyramid Chamber! Watch for glowing torches & treasure!',
      marrakech_riad: '🕌✨ Welcome to the Moroccan Riad Rooftop Suite! Decorate your sunset terrace!'
    };
    LS.showToast(toastMap[roomId] || "🏡 Welcome inside Laila & Salma's Cozy Room!");
  };

  LS.exitInterior = function () {
    const meta = LS.WORLDS[LS.state.currentWorld];
    if (!meta || !meta.isInterior) return;
    LS.playSFX('door');
    LS.loadWorld(meta.parentWorld, false, meta.exitPos);
  };

  // Animated Storybook World Map for traveling out of Home Town (Plane ✈️ or Shinkansen Train 🚄!)
  let travelMapRaf = null;
  function stopWorldMapAnimation() {
    if (travelMapRaf) { cancelAnimationFrame(travelMapRaf); travelMapRaf = null; }
  }

  LS.playWorldMapAnimation = function (fromWorldId, toWorldId, vehicleMode, durationMs) {
    stopWorldMapAnimation();
    const canvas = document.getElementById('travel-map-canvas');
    if (!canvas) return;
    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    function normId(id) {
      if (id === 'home_apartment' || id === 'home_neighborhood' || id.indexOf('dest_') === 0) return 'home';
      if (id === 'tokyo' || id === 'tokyo_room') return 'tokyo';
      if (id === 'kyoto' || id === 'kyoto_room') return 'kyoto';
      if (id === 'safari' || id === 'safari_tent') return 'safari';
      if (id === 'egypt' || id === 'egypt_chamber') return 'egypt';
      if (id === 'marrakech' || id === 'marrakech_riad') return 'marrakech';
      return 'home';
    }
    const pins = {
      home: { x: 274, y: 112, label: '🏡 Home (Egypt)' },
      egypt: { x: 280, y: 120, label: '🐪 Ancient Egypt' },
      marrakech: { x: 230, y: 114, label: '🏮 Marrakech' },
      safari: { x: 294, y: 168, label: '🦁 Safari (Kenya)' },
      kyoto: { x: 422, y: 108, label: '⛩️ Kyoto' },
      tokyo: { x: 454, y: 98, label: '🗼 Tokyo' }
    };
    const pFrom = pins[normId(fromWorldId)] || pins.home;
    const pTo = pins[normId(toWorldId)] || pins.safari;

    // Curved control point arching gracefully above the route
    const mx = (pFrom.x + pTo.x) * 0.5;
    const dist = Math.hypot(pTo.x - pFrom.x, pTo.y - pFrom.y);
    const my = Math.min(pFrom.y, pTo.y) - Math.min(62, Math.max(24, dist * 0.32));

    function drawContinents() {
      // Soft storybook parchment ocean
      const og = ctx.createLinearGradient(0, 0, 0, H);
      og.addColorStop(0, '#bfe6f5'); og.addColorStop(1, '#9fd4eb');
      ctx.fillStyle = og; ctx.fillRect(0, 0, W, H);

      // Subtle nautical grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 1;
      for (let gx = 40; gx < W; gx += 65) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 40; gy < H; gy += 55) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

      // Hand-painted stylized Ghibli continents
      const drawBlob = (pts, fill) => {
        ctx.fillStyle = fill;
        ctx.strokeStyle = '#6f9c63'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
        ctx.closePath(); ctx.fill(); ctx.stroke();
      };
      // Americas (left)
      drawBlob([[32, 46], [116, 40], [134, 78], [104, 110], [82, 114], [52, 88]], '#b6d99a');
      drawBlob([[98, 124], [138, 134], [148, 174], [122, 214], [104, 188], [94, 152]], '#a9d18e');
      // Europe (top-center)
      drawBlob([[220, 44], [282, 36], [300, 62], [278, 86], [234, 88], [216, 68]], '#b8db9a');
      // Africa (center)
      drawBlob([[230, 96], [286, 94], [312, 128], [302, 178], [274, 212], [250, 184], [236, 138], [218, 116]], '#e2cfa3');
      // Asia + Middle East (center-right)
      drawBlob([[294, 46], [420, 44], [442, 86], [406, 128], [362, 134], [336, 112], [302, 118], [288, 92]], '#b5d999');
      // Japan Islands (far right)
      drawBlob([[418, 112], [434, 102], [456, 86], [468, 96], [448, 112], [426, 118]], '#f2b5c4');
      // Australia (bottom right)
      drawBlob([[412, 168], [462, 164], [474, 194], [448, 212], [414, 198]], '#dfca9c');

      // Vintage Compass Rose in bottom-left corner
      ctx.save();
      ctx.translate(42, H - 36);
      ctx.strokeStyle = '#7c5530'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#c94c4c';
      ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(4, 0); ctx.lineTo(-4, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#7c5530';
      ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(4, 0); ctx.lineTo(-4, 0); ctx.closePath(); ctx.fill();
      ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('N', 0, -18);
      ctx.restore();
    }

    const startTime = performance.now();
    const dur = durationMs || 2100;

    function frame(now) {
      const raw = Math.min(1, (now - startTime) / dur);
      // Smooth ease-in-out
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;

      drawContinents();

      // Dashed planned full route arc
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pFrom.x, pFrom.y);
      ctx.quadraticCurveTo(mx, my, pTo.x, pTo.y);
      ctx.stroke();
      ctx.restore();

      // Glowing completed golden travel trail up to t!
      ctx.save();
      ctx.strokeStyle = vehicleMode === 'train' ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 3.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const u = (i / 28) * t;
        const bx = (1 - u) * (1 - u) * pFrom.x + 2 * (1 - u) * u * mx + u * u * pTo.x;
        const by = (1 - u) * (1 - u) * pFrom.y + 2 * (1 - u) * u * my + u * u * pTo.y;
        if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
      }
      ctx.stroke();
      ctx.restore();

      // Draw Origin & Destination Pins + Labels
      [pFrom, pTo].forEach((pt, idx) => {
        ctx.fillStyle = idx === 0 ? '#2563eb' : '#e11d48';
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.font = 'bold 11px sans-serif';
        const tw = ctx.measureText(pt.label).width;
        const lx = Math.max(tw / 2 + 8, Math.min(W - tw / 2 - 8, pt.x));
        const ly = idx === 0 ? pt.y + 20 : pt.y - 14;
        ctx.fillStyle = 'rgba(255,250,240,0.92)';
        ctx.fillRect(lx - tw / 2 - 5, ly - 11, tw + 10, 15);
        ctx.fillStyle = '#3b2516'; ctx.textAlign = 'center';
        ctx.fillText(pt.label, lx, ly);
      });

      // Current vehicle position & tangent angle along the quadratic Bezier curve!
      const vx = (1 - t) * (1 - t) * pFrom.x + 2 * (1 - t) * t * mx + t * t * pTo.x;
      const vy = (1 - t) * (1 - t) * pFrom.y + 2 * (1 - t) * t * my + t * t * pTo.y;
      const dx = 2 * (1 - t) * (mx - pFrom.x) + 2 * t * (pTo.x - mx);
      const dy = 2 * (1 - t) * (my - pFrom.y) + 2 * t * (pTo.y - my);
      const ang = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(vx, vy);
      ctx.rotate(ang);
      if (vehicleMode === 'train') {
        // Sleek White & Blue Shinkansen Bullet Train!
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-16, -5); ctx.lineTo(10, -5); ctx.quadraticCurveTo(20, 0, 10, 5); ctx.lineTo(-16, 5); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#2563eb'; ctx.fillRect(-14, -1.5, 24, 3);
      } else {
        // Sleek Studio Ghibli Airplane!
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
        // Fuselage
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Swept Wings
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(2, -3); ctx.lineTo(-6, -15); ctx.lineTo(-10, -14); ctx.lineTo(-5, -3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, 3); ctx.lineTo(-6, 15); ctx.lineTo(-10, 14); ctx.lineTo(-5, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Tail Fin
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(-10, -2); ctx.lineTo(-15, -8); ctx.lineTo(-16, -2); ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      // Arrival sparkle burst at the end!
      if (raw > 0.88) {
        const pulse = (raw - 0.88) / 0.12;
        ctx.strokeStyle = 'rgba(250, 204, 21, ' + (1 - pulse) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(pTo.x, pTo.y, 8 + pulse * 22, 0, Math.PI * 2); ctx.stroke();
      }

      if (raw < 1) {
        travelMapRaf = requestAnimationFrame(frame);
      }
    }
    travelMapRaf = requestAnimationFrame(frame);
  };

  LS.travelToWorld = function (targetWorldId, travelMode) {
    if (LS.runtime.traveling || !LS.WORLDS[targetWorldId]) return;
    if (LS.isWorldEnabled && !LS.isWorldEnabled(targetWorldId)) {
      LS.showToast('✨ Coming in a future wave!');
      return;
    }
    if (targetWorldId === LS.state.currentWorld) {
      LS.closeAllModals();
      LS.showToast('You are already in ' + LS.WORLDS[targetWorldId].title + '!');
      return;
    }

    LS.closeAllModals();
    LS.runtime.traveling = true;
    const fromId = LS.state.currentWorld;
    const fromMeta = LS.WORLDS[fromId];
    const toMeta = LS.WORLDS[targetWorldId];
    const leader = LS.getLeaderName ? LS.getLeaderName() : 'Laila';
    const isBook = travelMode === 'book';
    const isShinkansen = !isBook && ((fromId === 'tokyo' && targetWorldId === 'kyoto') || (fromId === 'kyoto' && targetWorldId === 'tokyo'));
    const vehicleMode = isShinkansen ? 'train' : 'plane';

    const overlay = document.getElementById('travel-overlay');
    const animEl = overlay ? overlay.querySelector('.train-anim') : null;
    const titleEl = document.getElementById('travel-title');
    const subEl = document.getElementById('travel-sub');
    const mapCanvas = document.getElementById('travel-map-canvas');
    if (animEl) animEl.textContent = isBook ? '📖✨' : (isShinkansen ? '🚅💨' : '✈️🌍');
    if (titleEl) {
      titleEl.textContent = isBook
        ? ('📖 Enchanted Storybook Portal → ' + toMeta.title)
        : ((isShinkansen ? '🚅 Shinkansen Express: ' : '✈️ International Flight: ') + fromMeta.title + ' → ' + toMeta.title);
    }
    if (subEl) {
      subEl.textContent = isBook
        ? ('Turning the glowing pages for ' + leader + '... Stepping right into ' + toMeta.title + '! ✨')
        : (isShinkansen
          ? ('All aboard, ' + leader + '! Zooming across Japan on the bullet train at 300 km/h...')
          : ('Fasten seatbelts, ' + leader + '! Flying across the world map straight to ' + toMeta.title + '!'));
    }
    if (overlay) overlay.classList.remove('hidden');
    if (isBook) {
      stopWorldMapAnimation();
      if (mapCanvas) mapCanvas.classList.add('hidden');
    } else if (LS.playWorldMapAnimation) {
      LS.playWorldMapAnimation(fromId, targetWorldId, vehicleMode, 2150);
    }

    LS.playSFX(isBook ? 'levelup' : 'train');

    setTimeout(() => {
      LS.loadWorld(targetWorldId, !isBook);
    }, 1150);

    setTimeout(() => {
      stopWorldMapAnimation();
      if (overlay) overlay.classList.add('hidden');
      LS.runtime.traveling = false;
      LS.showToast(toMeta.emoji + ' Welcome to ' + toMeta.title + ', ' + leader + ' — ' + toMeta.subtitle + '!');
    }, 2300);
  };

  LS.driveQashqaiTo = function (targetWorldId) {
    if (LS.runtime.traveling || !LS.WORLDS[targetWorldId]) return;
    if (targetWorldId === LS.state.currentWorld) {
      LS.closeAllModals();
      LS.showToast('🚙 You are already at ' + LS.WORLDS[targetWorldId].title + '!');
      return;
    }
    LS.closeAllModals();
    stopWorldMapAnimation();
    const mapCanvas = document.getElementById('travel-map-canvas');
    if (mapCanvas) mapCanvas.classList.add('hidden');
    LS.runtime.traveling = true;
    const toMeta = LS.WORLDS[targetWorldId];
    const leader = LS.getLeaderName ? LS.getLeaderName() : 'Laila';
    const overlay = document.getElementById('travel-overlay');
    const animEl = overlay ? overlay.querySelector('.train-anim') : null;
    const titleEl = document.getElementById('travel-title');
    const subEl = document.getElementById('travel-sub');
    if (animEl) animEl.textContent = '🚙💨';
    if (titleEl) titleEl.textContent = 'Gray Nissan Qashqai → ' + toMeta.title;
    if (subEl) {
      subEl.textContent = targetWorldId === 'dest_airport'
        ? ('Buckle up, ' + leader + '! Driving the gray Qashqai to Sunnyside International Airport for your flight! ✈️')
        : (targetWorldId === 'dest_mai_mostafa'
          ? ('Buckle up, ' + leader + "! Driving the gray Qashqai & riding the elevator up to Mai & Mostafa's Home!")
          : (targetWorldId === 'dest_ngsc'
            ? ('Buckle up, ' + leader + '! Driving the gray Qashqai to NGSC Sports Club for squash & swimming!')
            : (targetWorldId === 'home_neighborhood'
              ? ('Driving the gray Nissan Qashqai back home to Sunnyside Gated Community for ' + leader + '...')
              : ('Buckle up, ' + leader + '! Cruising in the gray Nissan Qashqai to ' + toMeta.title + '...'))));
    }
    if (overlay) overlay.classList.remove('hidden');
    LS.playSFX('train');

    setTimeout(() => {
      if (targetWorldId === 'home_neighborhood') {
        LS.loadWorld('home_neighborhood', false, { x: -2.0, y: 0, z: 30.8, rotY: Math.PI });
      } else {
        LS.loadWorld(targetWorldId, false);
      }
    }, 750);

    setTimeout(() => {
      if (overlay) overlay.classList.add('hidden');
      LS.runtime.traveling = false;
      LS.showToast('🚙 Arrived at ' + toMeta.emoji + ' ' + toMeta.title + '!');
    }, 1550);
  };

  function getGroundH(x, z) {
    if (LS.activeWorld && LS.activeWorld.getGroundHeight) {
      return LS.activeWorld.getGroundHeight(x, z);
    }
    return 0;
  }

  LS.ringBikeBell = function () {
    LS.playTone(1567.98, 0.14, 'sine', 0.16);
    setTimeout(() => LS.playTone(1975.53, 0.18, 'sine', 0.16), 95);
    LS.showToast('🔔 Ring-ring! Coming through, Tokyo!');
  };

  LS.mountYellowBike = function () {
    if (LS.runtime.bikeRide || LS.runtime.modalOpen || LS.runtime.eating || LS.runtime.traveling) return;
    if (!LS.activeWorld || !LS.activeWorld.rideableBike || !LS.chars.laila) return;
    const bike = LS.activeWorld.rideableBike;
    const laila = LS.chars.laila;
    LS.runtime.bikeRide = { bike, speed: 0, pedalPhase: 0, lean: 0 };
    LS.runtime.nearZone = null;
    laila.root.position.set(bike.position.x, getGroundH(bike.position.x, bike.position.z) + 0.34, bike.position.z);
    laila.root.rotation.y = bike.rotation.y;
    const bBeacon = zoneBeacons.find(b => b.id === 'tokyo_yellow_bike');
    if (bBeacon) bBeacon.group.visible = false;
    const prompt = document.getElementById('interact-prompt');
    const mobBtn = document.getElementById('btn-interact-mobile');
    if (prompt) prompt.classList.add('hidden');
    if (mobBtn) mobBtn.classList.add('hidden');
    const bikeBan = document.getElementById('bike-banner');
    if (bikeBan) bikeBan.classList.remove('hidden');
    LS.ringBikeBell();
    LS.setSalmaBubbleText('Wheee!! I love riding on the back of your yellow bike, Laila! 🚲💛', 3800);
    LS.showToast('🚲 Hopped on the Yellow Bicycle! Use WASD/Arrows to ride, Space for bell, E to park!');
  };

  LS.dismountYellowBike = function () {
    if (!LS.runtime.bikeRide || !LS.chars.laila) return;
    const bike = LS.runtime.bikeRide.bike;
    const laila = LS.chars.laila;
    const salma = LS.chars.salma;
    const yaw = bike.rotation.y;
    bike.rotation.z = 0;
    const gy = getGroundH(bike.position.x, bike.position.z);
    bike.position.y = gy;

    // Step Laila & Salma smoothly to the side of the parked bicycle
    const sideX = Math.cos(yaw), sideZ = -Math.sin(yaw);
    laila.root.position.set(bike.position.x + sideX * 0.95, gy, bike.position.z + sideZ * 0.95);
    resolveCollisions(laila.root.position, 0.45);
    laila.root.position.y = getGroundH(laila.root.position.x, laila.root.position.z);
    laila.leftLeg.rotation.x = 0; laila.rightLeg.rotation.x = 0;
    laila.leftArm.rotation.x = 0; laila.rightArm.rotation.x = 0; laila.rightArm.rotation.z = 0;
    laila.bodyPivot.rotation.z = 0;

    if (salma) {
      salma.root.position.set(bike.position.x - sideX * 0.95, gy, bike.position.z - sideZ * 0.95);
      resolveCollisions(salma.root.position, 0.4);
      salma.root.position.y = getGroundH(salma.root.position.x, salma.root.position.z);
      salma.leftLeg.rotation.x = 0; salma.rightLeg.rotation.x = 0;
      salma.leftArm.rotation.x = 0; salma.rightArm.rotation.x = 0; salma.rightArm.rotation.z = 0;
      salma.bodyPivot.rotation.z = 0;
    }

    // Move the interactive zone & golden welcome ring right to the new parked spot!
    if (LS.activeWorld && LS.activeWorld.zones) {
      const bz = LS.activeWorld.zones.find(z => z.id === 'tokyo_yellow_bike');
      if (bz) bz.pos.set(bike.position.x, gy, bike.position.z);
    }
    const bBeacon = zoneBeacons.find(b => b.id === 'tokyo_yellow_bike');
    if (bBeacon) {
      bBeacon.group.position.set(bike.position.x, gy + 0.048, bike.position.z);
      bBeacon.group.visible = true;
    }

    LS.runtime.bikeRide = null;
    grounded = true;
    salmaGrounded = true;
    const bikeBan = document.getElementById('bike-banner');
    if (bikeBan) bikeBan.classList.add('hidden');
    LS.playSFX('jump');
    LS.showToast('🅿️ Parked the yellow bicycle! Press E near it anytime to ride again!');
  };

  function triggerJump() {
    if (LS.runtime.bikeRide) {
      LS.ringBikeBell();
      return;
    }
    if (grounded && !LS.runtime.eating && !LS.runtime.modalOpen && !LS.runtime.traveling && !LS.runtime.parkActivity) {
      const superJump = LS.runtime.superJumpUntil && Date.now() < LS.runtime.superJumpUntil;
      velY = superJump ? 10.2 : 6.4;
      grounded = false;
      LS.playSFX('jump');
      if (salmaGrounded && !(LS.runtime.piggybackUntil && Date.now() < LS.runtime.piggybackUntil)) {
        setTimeout(() => {
          if (salmaGrounded && !LS.runtime.eating) {
            salmaVelY = 6.1;
            salmaGrounded = false;
          }
        }, 120);
      }
    }
  }

  function triggerSisterPose() {
    if (LS.runtime.eating || LS.runtime.modalOpen || LS.runtime.traveling) return;
    if (LS.runtime.bikeRide) {
      LS.ringBikeBell();
      return;
    }
    LS.runtime.poseTimer = 2.4;
    const nearSalma = LS.chars.salma &&
      LS.chars.laila.root.position.distanceTo(LS.chars.salma.root.position) < 4.0;
    if (nearSalma) {
      // Synchronized Jump High-Five + 3D Floating Star Particles + 12s Piggyback Boost + Animal Hint!
      LS.runtime.highFiveTimer = 1.3;
      LS.runtime.piggybackUntil = Date.now() + 12000;
      LS.runtime.buff = {
        name: 'Sister Piggyback Boost',
        short: 'Piggyback⚡',
        speedMult: 1.32,
        infiniteStamina: true,
        expiresAt: Date.now() + 12000
      };
      if (grounded) { velY = 5.4; grounded = false; }
      triggerStarBurst(LS.chars.laila.root.position);
      LS.playSFX('correct');
      LS.showToast('⭐🙌 Jump High-Five & Piggyback Boost! Salma hops on & listens for hidden friends!');
      LS.showSalmaAnimalHint();
    } else {
      LS.playTone(523.25, 0.1);
      LS.playTone(659.25, 0.14, 'sine', 0.1);
      LS.showToast('👋 Laila & Salma wave hello to ' + LS.WORLDS[LS.state.currentWorld].title + '!');
    }
  }

  function setCameraMode(mode) {
    LS.runtime.camMode = mode;
    const btn = document.getElementById('btn-front-cam');
    const banner = document.getElementById('front-view-banner');
    const label = document.getElementById('front-view-label');
    if (LS.runtime.camMode === 0) {
      if (btn) btn.classList.remove('active');
      if (banner) banner.classList.add('hidden');
    } else if (LS.runtime.camMode === 1) {
      if (btn) btn.classList.add('active');
      if (label) label.textContent = "📷 Laila's Front View";
      if (banner) banner.classList.remove('hidden');
    } else {
      if (btn) btn.classList.add('active');
      if (label) label.textContent = "📷 Salma's Front View";
      if (banner) banner.classList.remove('hidden');
    }
  }

  function cycleCameraMode() {
    setCameraMode((LS.runtime.camMode + 1) % 3);
  }

  function recenterCamera() {
    const laila = LS.chars.laila;
    if (!laila || LS.runtime.modalOpen || LS.runtime.eating) return;
    if (LS.runtime.camMode !== 0) setCameraMode(0);
    const meta = LS.WORLDS[LS.state.currentWorld] || LS.WORLDS.home_neighborhood;
    targetCamYaw = camYaw + wrapAngleDelta(camYaw, laila.root.rotation.y);
    targetCamPitch = meta.isInterior ? 0.38 : 0.30;
    manualCamCooldown = 0;
  }

  function toggleMiniMap() {
    miniMapCompact = !miniMapCompact;
    const canvas = document.getElementById('minimap-canvas');
    const legend = document.querySelector('.minimap-legend');
    if (canvas) canvas.classList.toggle('hidden', miniMapCompact);
    if (legend) legend.classList.toggle('hidden', miniMapCompact);
  }

  function toggleRunButton() {
    LS.runtime.runToggle = !LS.runtime.runToggle;
    document.getElementById('btn-run').classList.toggle('active', LS.runtime.runToggle);
  }

  function ensureSquashRacket(laila) {
    if (!laila || !laila.rightArm) return null;
    if (laila._ngscRacket) return laila._ngscRacket;
    const rg = new THREE.Group();
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.42, 8), LS.makeToonMat(0x1e3a5f));
    grip.position.set(0, -0.42, 0.14);
    grip.rotation.x = Math.PI * 0.35;
    rg.add(grip);
    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.028, 8, 18), LS.makeToonMat(0xf59e0b));
    frame.scale.set(0.82, 1.15, 1.0);
    frame.position.set(0, -0.58, 0.34);
    frame.rotation.x = Math.PI * 0.35;
    rg.add(frame);
    const strings = new THREE.Mesh(
      new THREE.CircleGeometry(0.15, 14),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    strings.scale.set(0.82, 1.15, 1.0);
    strings.position.copy(frame.position);
    strings.rotation.copy(frame.rotation);
    rg.add(strings);
    rg.visible = false;
    laila.rightArm.add(rg);
    laila._ngscRacket = rg;
    return rg;
  }

  LS.startNGSCActivity = function (mode) {
    if (LS.runtime.ngscActivity) return;
    LS.closeAllModals();
    const laila = LS.chars.laila;
    if (!laila) return;

    LS.runtime.ngscActivity = { type: mode, timer: 7.5, duration: 7.5 };
    LS.runtime.nearZone = null;
    const pEl = document.getElementById('interact-prompt');
    const mEl = document.getElementById('btn-interact-mobile');
    if (pEl) pEl.classList.add('hidden');
    if (mEl) mEl.classList.add('hidden');
    LS.playSFX('jump');

    if (mode === 'squash') {
      const rack = ensureSquashRacket(laila);
      if (rack) rack.visible = true;
      LS.setSalmaBubbleText('Go Laila!! Awesome forehand squash rally!! 🎾🏆', 7200);
      LS.showToast('🎾 Laila steps onto the NGSC Squash Court for a live rally!');
      targetCamYaw = Math.PI;
      targetCamPitch = 0.28;
    } else {
      LS.setSalmaBubbleText('Splash!! Swimming together in the NGSC Olympic Pool! 🏊‍♀️💦', 7200);
      LS.showToast('🏊‍♀️ Laila & Salma dive into the sparkling NGSC Swimming Pool together!');
      targetCamYaw = Math.PI * 0.85;
      targetCamPitch = 0.34;
    }

    const ban = document.getElementById('eating-banner');
    const st = document.getElementById('eating-status');
    const skipBtn = document.getElementById('btn-skip-eat');
    if (st) {
      st.textContent = mode === 'squash'
        ? '🎾 Laila is playing a championship Squash rally while Salma cheers!'
        : '🏊‍♀️ Laila & Salma are swimming freestyle laps together in the NGSC Pool! 💦';
    }
    if (ban) ban.classList.remove('hidden');
    if (skipBtn) {
      skipBtn.onclick = () => {
        if (LS.runtime.ngscActivity) LS.finishNGSCActivity(false);
        else if (LS.runtime.eating) LS.finishEatingAnimation(scene);
      };
    }
  };

  LS.finishNGSCActivity = function (silent) {
    const na = LS.runtime.ngscActivity;
    if (!na) return;
    const mode = na.type;
    LS.runtime.ngscActivity = null;

    const laila = LS.chars.laila;
    const salma = LS.chars.salma;
    if (laila) {
      if (laila._ngscRacket) laila._ngscRacket.visible = false;
      if (laila.bodyPivot) laila.bodyPivot.rotation.set(0, 0, 0);
      laila.leftArm.rotation.set(0, 0, 0);
      laila.rightArm.rotation.set(0, 0, 0);
      laila.leftLeg.rotation.set(0, 0, 0);
      laila.rightLeg.rotation.set(0, 0, 0);
      if (!silent) {
        laila.root.position.set(mode === 'squash' ? -7.6 : 6.2, 0, 5.2);
        laila.root.rotation.y = Math.PI;
      }
    }
    if (salma) {
      if (salma.bodyPivot) salma.bodyPivot.rotation.set(0, 0, 0);
      salma.leftArm.rotation.set(0, 0, 0);
      salma.rightArm.rotation.set(0, 0, 0);
      salma.leftLeg.rotation.set(0, 0, 0);
      salma.rightLeg.rotation.set(0, 0, 0);
      if (!silent) {
        salma.root.position.set(mode === 'squash' ? -6.2 : 7.8, 0, 5.4);
        salma.root.rotation.y = Math.PI;
      }
    }
    if (LS.activeWorld && LS.activeWorld.swimSplashes) {
      LS.activeWorld.swimSplashes.forEach(r => { r.visible = false; });
    }
    const ban = document.getElementById('eating-banner');
    if (ban) ban.classList.add('hidden');

    if (!silent) {
      LS.addCoins(30);
      LS.addXP(28);
      LS.runtime.stamina = 100;
      LS.unlockStamp('dest_ngsc');
      if (LS.completeCozyMission) LS.completeCozyMission('play');
      LS.playSFX('correct');
      if (mode === 'swim') {
        LS.runtime.buff = { name: 'NGSC Swim Refresh', short: 'Swim💦', speedMult: 1.25, infiniteStamina: true, expiresAt: Date.now() + 90000 };
        LS.showToast('🏆 Woohoo! Laila & Salma finished their NGSC swim laps! (+30c, +28 XP & Swim Boost!)');
      } else {
        LS.showToast('🏆 Awesome Squash match, Laila! Coach Karim & Salma cheer! (+30c & +28 XP!)');
      }
    }
  };

  // =========================================================================
  // LIVE 3D WAVE 1 (AFRICA) ANIMATIONS:
  // 1) egypt_felucca   — Laila & Salma sail a white-sailed Felucca down the Nile!
  // 2) egypt_camel     — Laila & Salma ride Habibi & Shams around the Oasis!
  // 3) marrakech_tea   — Laila & Salma sit in the Riad while Rashid high-pours tea!
  // 4) marrakech_drums — Laila & Salma jam in Hassan's Sunset Drum Circle!
  // =========================================================================
  LS.startWave1Anim = function (mode) {
    if (LS.runtime.wave1Anim || LS.runtime.ngscActivity) return;
    LS.closeAllModals();
    const laila = LS.chars.laila;
    if (!laila) return;

    const dur = (mode === 'egypt_felucca' || mode === 'egypt_camel') ? 8.2 : 7.4;
    LS.runtime.wave1Anim = { mode: mode, timer: dur, duration: dur, drumBeatTimer: 0 };
    LS.runtime.nearZone = null;
    const pEl = document.getElementById('interact-prompt');
    const mEl = document.getElementById('btn-interact-mobile');
    if (pEl) pEl.classList.add('hidden');
    if (mEl) mEl.classList.add('hidden');
    LS.playSFX(mode === 'egypt_felucca' ? 'splash' : 'jump');

    const bannerCopy = {
      egypt_felucca: '⛵ Laila & Salma are sailing a white-sailed Nile Felucca past the Great Pyramids! 🪷',
      egypt_camel: '🐪 Laila & Salma are riding Habibi & Shams around the Golden Date-Palm Oasis! 🌴',
      marrakech_tea: '🫖 Tea Master Rashid is high-pouring sparkling golden Mint Tea for Laila & Salma! 🍊',
      marrakech_drums: '🥁 Laila & Salma are jamming in Hassan\'s Sunset Bazaar Drum Circle! ✨'
    };
    const bubbles = {
      egypt_felucca: 'Look Laila!! The Great Pyramids & floating Nile lotuses from our boat!! ⛵🪷',
      egypt_camel: 'Wheee!! Habibi & Shams are so gentle and tall!! 🐪🌴✨',
      marrakech_tea: 'Whoa!! Look how high Rashid pours the sparkling golden mint tea!! 🫖✨',
      marrakech_drums: 'Boom-tat-boom!! Everyone is dancing under the Marrakech lanterns!! 🥁🏮'
    };
    LS.setSalmaBubbleText(bubbles[mode] || 'Yay!! What a magical adventure!! ✨', dur * 1000 - 200);
    LS.showToast(bannerCopy[mode] || '✨ Adventure time!');

    if (mode === 'egypt_felucca') {
      targetCamYaw = -Math.PI * 0.62;
      targetCamPitch = 0.24;
    } else if (mode === 'egypt_camel') {
      targetCamYaw = Math.PI * 0.25;
      targetCamPitch = 0.28;
    } else if (mode === 'marrakech_tea') {
      targetCamYaw = 0.0;
      targetCamPitch = 0.26;
      if (LS.activeWorld && LS.activeWorld.teaPourGroup) LS.activeWorld.teaPourGroup.visible = true;
    } else if (mode === 'marrakech_drums') {
      targetCamYaw = Math.PI * 0.12;
      targetCamPitch = 0.28;
    }

    const ban = document.getElementById('eating-banner');
    const st = document.getElementById('eating-status');
    const skipBtn = document.getElementById('btn-skip-eat');
    if (st) st.textContent = bannerCopy[mode] || '✨ Live Adventure!';
    if (ban) ban.classList.remove('hidden');
    if (skipBtn) {
      skipBtn.onclick = () => {
        if (LS.runtime.wave1Anim) LS.finishWave1Anim(false);
        else if (LS.runtime.ngscActivity) LS.finishNGSCActivity(false);
        else if (LS.runtime.eating) LS.finishEatingAnimation(scene);
      };
    }
  };

  LS.finishWave1Anim = function (silent) {
    const wa = LS.runtime.wave1Anim;
    if (!wa) return;
    const mode = wa.mode;
    LS.runtime.wave1Anim = null;

    const laila = LS.chars.laila;
    const salma = LS.chars.salma;
    const w = LS.activeWorld;

    [laila, salma].forEach(ch => {
      if (!ch) return;
      if (ch.bodyPivot) {
        ch.bodyPivot.rotation.set(0, 0, 0);
        ch.bodyPivot.position.y = 0;
      }
      if (ch.leftArm) ch.leftArm.rotation.set(0, 0, 0);
      if (ch.rightArm) ch.rightArm.rotation.set(0, 0, 0);
      if (ch.leftLeg) ch.leftLeg.rotation.set(0, 0, 0);
      if (ch.rightLeg) ch.rightLeg.rotation.set(0, 0, 0);
      if (ch.leftKnee) ch.leftKnee.rotation.set(0, 0, 0);
      if (ch.rightKnee) ch.rightKnee.rotation.set(0, 0, 0);
    });

    if (mode === 'egypt_felucca') {
      if (w && w.rideFelucca) {
        w.rideFelucca.obj.root.position.copy(w.rideFelucca.dockPos);
        w.rideFelucca.obj.root.rotation.set(0, w.rideFelucca.dockRotY, 0);
      }
      if (!silent) {
        if (laila) { laila.root.position.set(20.6, 0, 2.8); laila.root.rotation.y = -Math.PI / 2; }
        if (salma) { salma.root.position.set(20.2, 0, 4.1); salma.root.rotation.y = -Math.PI / 2; }
      }
    } else if (mode === 'egypt_camel') {
      if (w && w.camels) {
        w.camels.forEach(c => {
          if (c.basePos) c.obj.root.position.copy(c.basePos);
          if (typeof c.baseRotY === 'number') c.obj.root.rotation.set(0, c.baseRotY, 0);
        });
      }
      if (!silent) {
        if (laila) { laila.root.position.set(-13.4, 0, 11.4); laila.root.rotation.y = Math.PI / 2; }
        if (salma) { salma.root.position.set(-13.4, 0, 10.0); salma.root.rotation.y = Math.PI / 2; }
      }
    } else if (mode === 'marrakech_tea') {
      if (w && w.teaPourGroup) w.teaPourGroup.visible = false;
      if (w && w.teaRashid) {
        w.teaRashid.ch.root.position.copy(w.teaRashid.basePos);
        w.teaRashid.ch.root.rotation.y = w.teaRashid.baseRotY;
        if (w.teaRashid.ch.rightArm) w.teaRashid.ch.rightArm.rotation.set(0, 0, 0);
      }
      if (!silent) {
        if (laila) { laila.root.position.set(-1.0, 0, -13.6); laila.root.rotation.y = 0; }
        if (salma) { salma.root.position.set(0.8, 0, -13.6); salma.root.rotation.y = 0; }
      }
    } else if (mode === 'marrakech_drums') {
      if (w && w.drumNotes) w.drumNotes.forEach(dn => { dn.mesh.visible = false; });
      if (!silent) {
        if (laila) { laila.root.position.set(-10.5, 0, 18.8); laila.root.rotation.y = 0; }
        if (salma) { salma.root.position.set(-9.1, 0, 19.2); salma.root.rotation.y = 0; }
      }
    }

    const ban = document.getElementById('eating-banner');
    if (ban) ban.classList.add('hidden');

    if (!silent) {
      LS.addCoins(35);
      LS.addXP(30);
      LS.runtime.stamina = 100;
      LS.playSFX('correct');
      if (mode === 'egypt_felucca') {
        LS.unlockStamp('egypt_felucca');
        LS.advanceStoryStep('egypt', 'egypt_felucca');
        LS.showToast('⛵✨ Glorious Nile Felucca Voyage complete! Captain Tarek cheers! (+35c & +30 XP!)');
      } else if (mode === 'egypt_camel') {
        LS.unlockStamp('egypt_camel');
        if (LS.completeCozyMission) LS.completeCozyMission('play');
        LS.showToast('🐪🌴 Wonderful Oasis Camel Caravan ride with Habibi & Shams! (+35c & +30 XP!)');
      } else if (mode === 'marrakech_tea') {
        LS.unlockStamp('marrakech_tea');
        LS.advanceStoryStep('marrakech', 'marrakech_tea');
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.runtime.buff = { name: 'Riad Mint Tea Refresh', short: 'MintTea🫖', speedMult: 1.26, infiniteStamina: true, expiresAt: Date.now() + 90000 };
        LS.showToast('🫖🍊 Delicious high-poured Mint Tea & Tagine feast! (+35c, +30 XP & Speed Boost!)');
      } else if (mode === 'marrakech_drums') {
        LS.unlockStamp('marrakech_drums');
        if (LS.completeCozyMission) LS.completeCozyMission('music');
        LS.showToast('🥁✨ What a joyous Sunset Bazaar Drum Circle jam! (+35c & +30 XP!)');
      }
      LS.updateHUD();
    }
  };

  function triggerInteract() {
    if (LS.runtime.titleScreenActive || LS.runtime.modalOpen || LS.runtime.eating || LS.runtime.traveling || LS.runtime.ngscActivity || LS.runtime.wave1Anim) return;
    if (LS.unlockAudio) LS.unlockAudio();
    if (LS.runtime.bikeRide) {
      LS.dismountYellowBike();
      return;
    }
    const leader = getLeader();
    if (!LS.runtime.nearZone && LS.chars.mochi && LS.chars.mochi.visible &&
        leader.root.position.distanceTo(LS.chars.mochi.position) < 2.6) {
      LS.openMochiModal();
      return;
    }
    if (!LS.runtime.nearZone) return;
    const zid = LS.runtime.nearZone.id;
    if (zid === 'tokyo_yellow_bike') LS.mountYellowBike();
    else if (zid === 'enter_home_apartment') LS.enterInterior('home_apartment');
    else if (zid === 'enter_gedo_mahmoud') LS.enterInterior('dest_gedo_mahmoud');
    else if (zid === 'enter_egypt_chamber') LS.enterInterior('egypt_chamber');
    else if (zid === 'enter_marrakech_riad') LS.enterInterior('marrakech_riad');
    else if (zid === 'home_kitchen_snack') LS.openKitchenModal();
    else if (zid === 'home_piano') LS.openPianoModal();
    else if (zid === 'home_tv_room') LS.openTvGameModal();
    else if (zid === 'magic_globe') LS.openGlobeModal();
    else if (zid === 'magic_bookshelf') LS.openBookshelfModal();
    else if (zid === 'airport_departures') LS.openAirportModal();
    else if (zid === 'home_school') LS.openSchoolModal('home_neighborhood');
    else if (zid === 'home_restaurant') LS.openHomeRestaurantModal();
    else if (zid === 'home_qashqai') LS.openQashqaiModal();
    else if (zid === 'eatery_order') LS.openEateryModal();
    else if (zid === 'yiwan_order') LS.openYiwanModal();
    else if (zid === 'cosmo_meteors') LS.openCosmoGameModal('meteors');
    else if (zid === 'cosmo_memory') LS.openCosmoGameModal('memory');
    else if (zid === 'cosmo_claw') LS.openCosmoGameModal('claw');
    else if (zid === 'ngsc_squash') LS.startNGSCActivity('squash');
    else if (zid === 'ngsc_swim') LS.startNGSCActivity('swim');
    else if (zid === 'egypt_teacher_quiz') LS.openSchoolModal('egypt');
    else if (zid === 'marrakech_teacher_quiz') LS.openSchoolModal('marrakech');
    else if (zid === 'egypt_felucca' || zid === 'egypt_camel' || zid === 'marrakech_tea' || zid === 'marrakech_drums') {
      LS.startWave1Anim(zid);
    } else if (zid === 'egypt_boutique') {
      LS.openShopModal('egypt');
    } else if (zid === 'marrakech_boutique') {
      LS.openShopModal('marrakech');
    } else if (zid === 'decorate_marrakech_riad') {
      LS.openRiadDecorModal();
    } else if (zid === 'egypt_treasure_chest') {
      LS.addCoins(55);
      LS.addXP(45);
      LS.unlockStamp('egypt_chamber');
      LS.runtime.sparkleUntil = Math.max(LS.runtime.sparkleUntil || 0, Date.now() + 60000);
      LS.playSFX('levelup');
      LS.showToast("👑💎 Pharaoh's Golden Treasure Chest opened! Sparkling lapis & gold! (+55c, +45 XP & Sparkle Aura!)");
    } else if (
      zid === 'egypt_hieroglyphs' || zid === 'egypt_bakery' ||
      zid === 'marrakech_lantern' || zid === 'marrakech_rug'
    ) LS.openWave1Activity(zid);
    else if (zid === 'visit_gedo_mahmoud') {
      LS.addCoins(18); LS.addXP(22);
      LS.unlockStamp('home_dinner');
      LS.playSFX('correct');
      LS.showToast('☕💛 Gedo Mahmoud gives Laila & Salma huge hugs and shares a favorite family story! +18c & +22 XP!');
    } else if (zid === 'visit_nana_omaima') {
      LS.addCoins(20); LS.addXP(26);
      LS.runtime.stamina = 100;
      LS.runtime.buff = { name: "Nana Omaima's Feast", short: 'Feast🍲', speedMult: 1.28, infiniteStamina: true, expiresAt: Date.now() + 120000 };
      LS.unlockStamp('home_dinner');
      if (LS.completeCozyMission) LS.completeCozyMission('meal');
      LS.playSFX('correct');
      LS.showToast('🍲🍯 Nana Omaima serves her delicious homemade feast & warm basbousa! +20c, +26 XP & Speed Boost!');
    } else if (zid === 'visit_nano_tv') {
      LS.addCoins(15); LS.addXP(20);
      LS.unlockStamp('dest_grandparents');
      LS.playSFX('correct');
      const tv = LS.activeWorld && LS.activeWorld.tvObj;
      if (tv && tv.toggleChannel) {
        const ch = tv.currentChannel || 'soap';
        if (ch === 'soap') {
          LS.showToast('📺🎭 Nano gasps at her dramatic soap opera with Laila & Salma — then flips to check the News! +15c & +20 XP!');
          tv.toggleChannel(LS.runtime.elapsed || 0);
        } else {
          LS.showToast('📺🗞️ Laila & Salma watch the Breaking News with Nano — then she switches back to her soap opera! +15c & +20 XP!');
          tv.toggleChannel(LS.runtime.elapsed || 0);
        }
      } else {
        LS.showToast('📺🎭 Laila & Salma snuggle up on the sofa and watch Nano’s soap opera & the news! +15c & +20 XP!');
      }
    } else if (zid === 'visit_gedo_tea') {
      LS.addCoins(15); LS.addXP(20);
      LS.unlockStamp('dest_grandparents');
      LS.runtime.buff = { name: "Gedo's Mint Tea", short: 'Tea☕', speedMult: 1.24, infiniteStamina: true, expiresAt: Date.now() + 90000 };
      LS.playSFX('correct');
      LS.showToast('☕☀️ Gedo pours warm sweet mint tea by his sunny window and shares a funny story! +15c, +20 XP & Speed Boost!');
    } else if (zid === 'mai_lasagna') LS.openMaiLasagnaModal();
    else if (zid === 'kids_board_game') LS.openBoardGameModal();
    else if (zid === 'tokyo_teacher_quiz' || zid === 'school') LS.openSchoolModal('tokyo');
    else if (zid === 'kyoto_teacher_quiz' || zid === 'kyoto_academy') LS.openSchoolModal('kyoto');
    else if (zid === 'ramen') LS.openRamenModal();
    else if (zid === 'sushi_stand') LS.openSushiModal();
    else if (zid === 'tea_house') LS.openTeaHouseModal();
    else if (zid === 'shop') LS.openShopModal('tokyo');
    else if (zid === 'kimono_shop') LS.openShopModal('kyoto');
    else if (zid === 'gachapon') LS.openGachaponModal('tokyo');
    else if (zid === 'kyoto_gachapon') LS.openGachaponModal('kyoto');
    else if (zid === 'toy_shelf_view') LS.openGachaponModal('all');
    else if (zid === 'drink_vending') LS.openDrinkVendingModal();
    else if (zid === 'clubhouse') LS.enterInterior('tokyo_room');
    else if (zid === 'kyoto_ryokan') LS.enterInterior('kyoto_room');
    else if (zid === 'enter_safari_tent') LS.enterInterior('safari_tent');
    else if (zid === 'decorate_tokyo_room') LS.openClubhouseModal();
    else if (zid === 'decorate_ryokan') LS.openRyokanModal();
    else if (zid === 'decorate_safari_tent') LS.openSafariTentModal();
    else if (zid === 'exit_interior') LS.exitInterior();
    else if (zid === 'shrine_omikuji') LS.openShrineModal();
    else if (zid === 'koi_dock') LS.feedKoiAndDucks();
    else if (zid === 'shinkansen_station') LS.openShinkansenModal();
    else if (zid === 'airport_gate' || zid === 'safari_airstrip') LS.openAirportModal();
    else if (zid === 'safari_academy') LS.openSchoolModal('safari');
    else if (zid === 'safari_shop') LS.openShopModal('safari');
    else if (zid === 'safari_stickers') LS.openGachaponModal('safari');
    else if (
      zid === 'safari_cafe' || zid === 'safari_crafts' || zid === 'sakura_bakery' || zid === 'sunny_florist' ||
      zid === 'cozy_bookshop' || zid === 'kyoto_pottery' || zid === 'kyoto_fans' ||
      zid === 'tokyo_crepes' || zid === 'tokyo_cat_cafe' || zid === 'tokyo_origami' || zid === 'kyoto_wagashi'
    ) LS.openLocalShopModal(zid);
    else if (zid === 'safari_jeep') LS.startSafariJeepRide();
    else if (zid === 'safari_balloon') LS.startBalloonRide();
    else if (zid === 'safari_campfire') LS.openSafariCampfireModal();
    else if (zid === 'safari_cheetah_race') LS.startCheetahRace();
    else if (zid === 'safari_watchtower') LS.triggerWatchtowerLookout();
    else if (zid === 'safari_pride_roar') LS.triggerPrideRockRoar();
    else if (zid === 'safari_feed_giraffe') LS.feedSafariAnimals('giraffe');
    else if (zid === 'safari_feed_elephant') LS.feedSafariAnimals('elephant');
    else if (zid === 'mochi') LS.openMochiModal();
    else if (zid === 'park_slide') {
      LS.runtime.parkActivity = { type: 'slide', timer: 2.4, duration: 2.4 };
      LS.addXP(10);
      LS.playSFX('jump');
      if (LS.completeCozyMission) LS.completeCozyMission('play');
      LS.showToast('🛝 Wheee! Laila & Salma slide down together! +10 XP');
    } else if (zid === 'park_swing') {
      LS.runtime.parkActivity = { type: 'swing', timer: 3.8, duration: 3.8 };
      LS.addXP(10);
      LS.playSFX('jump');
      if (LS.completeCozyMission) LS.completeCozyMission('play');
      LS.showToast('🎠 Swinging high together on the park swing! +10 XP');
    } else if (zid === 'park_hopscotch') {
      LS.runtime.parkActivity = { type: 'hopscotch', timer: 2.2, duration: 2.2 };
      LS.addCoins(20);
      LS.addXP(12);
      LS.playSFX('coin');
      if (LS.completeCozyMission) LS.completeCozyMission('play');
      LS.showToast('🎯 Hopscotch cleared together! +20c & +12 XP!');
    } else if (zid.startsWith('animal:')) {
      LS.petHiddenAnimal(zid.slice(7));
    }
  }

  function setupInputs() {
    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      keys[k] = true;
      if (LS.runtime.titleScreenActive) {
        if (k === 'enter' || k === ' ') LS.dismissTitleScreen();
        return;
      }
      if (LS.runtime.modalOpen) {
        if (k === 'escape') LS.closeAllModals();
        return;
      }
      if (LS.unlockAudio) LS.unlockAudio();
      if (k === 'c') cycleCameraMode();
      if (k === 'q') recenterCamera();
      if (k === 'v') triggerSisterPose();
      if (k === 't') LS.swapActiveSister();
      if (k === 'b') { if (LS.openQuestModal) LS.openQuestModal(); }
      if (k === 'm') toggleMiniMap();
      if (k === 'h') toggleHudCard();
      if (k === 'p') LS.openPassportModal();
      if (k === 'f' && LS.state.currentWorld === 'safari' && LS.snapSafariWildlifePhoto) LS.snapSafariWildlifePhoto();
      if (k === 'r') toggleRunButton();
      if (k === 'e') triggerInteract();
      if (k === ' ') triggerJump();
    });

    window.addEventListener('keyup', e => {
      keys[e.key.toLowerCase()] = false;
    });

    const containerEl = document.getElementById('game-container');
    const dom = renderer.domElement;

    const getZoomBounds = () => {
      const meta = LS.WORLDS[LS.state.currentWorld];
      return (meta && meta.isInterior) ? { min: 2.8, max: 7.4 } : { min: 3.2, max: 13.5 };
    };

    const releasePointer = pointerId => {
      activePointers.delete(pointerId);
      if (activePointers.size < 2) lastPinchDist = null;
      if (activePointers.size === 0 && containerEl) containerEl.classList.remove('cam-dragging');
    };

    window.addEventListener('blur', () => {
      Object.keys(keys).forEach(k => { keys[k] = false; });
      activePointers.clear();
      lastPinchDist = null;
      if (containerEl) containerEl.classList.remove('cam-dragging');
    });

    dom.addEventListener('contextmenu', e => e.preventDefault());
    dom.addEventListener('dblclick', () => recenterCamera());

    dom.addEventListener('pointerdown', e => {
      if (LS.runtime.modalOpen || LS.runtime.titleScreenActive) return;
      if (LS.unlockAudio) LS.unlockAudio();
      if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) return;
      if (LS.runtime.camMode !== 0) setCameraMode(0);
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (dom.setPointerCapture) {
        try { dom.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (containerEl) containerEl.classList.add('cam-dragging');
      if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        lastPinchDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      }
    });

    window.addEventListener('pointermove', e => {
      if (LS.runtime.modalOpen || LS.runtime.titleScreenActive || !activePointers.has(e.pointerId)) return;
      const prev = activePointers.get(e.pointerId);
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 1) {
        const yawSens = e.pointerType === 'touch' ? 0.0068 : 0.0056;
        const pitchSens = e.pointerType === 'touch' ? 0.0048 : 0.0042;
        targetCamYaw -= dx * yawSens;
        targetCamPitch = Math.max(0.06, Math.min(1.12, targetCamPitch + dy * pitchSens));
        manualCamCooldown = 1.8;
      } else if (activePointers.size >= 2) {
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        if (lastPinchDist !== null) {
          const zb = getZoomBounds();
          targetCamDist = Math.max(zb.min, Math.min(zb.max, targetCamDist - (dist - lastPinchDist) * 0.025));
        }
        lastPinchDist = dist;
        targetCamYaw -= dx * 0.0022;
        manualCamCooldown = 1.8;
      }
    });

    window.addEventListener('pointerup', e => releasePointer(e.pointerId));
    window.addEventListener('pointercancel', e => releasePointer(e.pointerId));

    dom.addEventListener('wheel', e => {
      if (LS.runtime.modalOpen || LS.runtime.titleScreenActive) return;
      e.preventDefault();
      if (LS.runtime.camMode !== 0) setCameraMode(0);
      const zb = getZoomBounds();
      targetCamDist = Math.max(zb.min, Math.min(zb.max, targetCamDist + e.deltaY * 0.0045));
      manualCamCooldown = 1.2;
    }, { passive: false });

    const playAdvBtn = document.getElementById('btn-play-adventure');
    if (playAdvBtn) playAdvBtn.addEventListener('click', LS.dismissTitleScreen);

    document.getElementById('btn-passport').addEventListener('click', LS.openPassportModal);
    const questBtn = document.getElementById('btn-quests');
    if (questBtn) questBtn.addEventListener('click', () => { if (LS.openQuestModal) LS.openQuestModal(); });
    const questHint = document.getElementById('hud-quest-hint');
    if (questHint) questHint.addEventListener('click', () => { if (LS.openQuestModal) LS.openQuestModal(); });

    const swapBtn = document.getElementById('btn-swap-sister');
    if (swapBtn) swapBtn.addEventListener('click', LS.swapActiveSister);

    document.getElementById('btn-time').addEventListener('click', () => {
      LS.state.timeMode = (LS.state.timeMode + 1) % 3;
      LS.saveState();
      applyTimeOfDay();
    });

    const grainBtn = document.getElementById('btn-grain');
    const grainEl = document.getElementById('grain-overlay');
    grainEl.classList.toggle('grain-active', LS.state.grainEnabled);
    grainBtn.classList.toggle('active', LS.state.grainEnabled);
    grainBtn.addEventListener('click', () => {
      LS.state.grainEnabled = !LS.state.grainEnabled;
      LS.saveState();
      grainEl.classList.toggle('grain-active', LS.state.grainEnabled);
      grainBtn.classList.toggle('active', LS.state.grainEnabled);
    });

    const soundBtn = document.getElementById('btn-sound');
    soundBtn.textContent = LS.state.soundEnabled ? '🔊' : '🔇';
    soundBtn.addEventListener('click', () => {
      if (LS.unlockAudio) LS.unlockAudio();
      LS.state.soundEnabled = !LS.state.soundEnabled;
      LS.saveState();
      soundBtn.textContent = LS.state.soundEnabled ? '🔊' : '🔇';
      if (LS.state.soundEnabled) LS.playSFX('coin');
    });

    document.getElementById('btn-front-cam').addEventListener('click', cycleCameraMode);
    document.getElementById('btn-pose').addEventListener('click', triggerSisterPose);
    const hudCard = document.getElementById('hud-left');
    const hudHdr = document.getElementById('hud-left-header');
    function applyHudCollapsed(collapsed) {
      if (!hudCard) return;
      hudCard.classList.toggle('collapsed', collapsed);
      const btn = document.getElementById('btn-hud-collapse');
      if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
    function toggleHudCard() {
      if (!hudCard) return;
      const next = !hudCard.classList.contains('collapsed');
      applyHudCollapsed(next);
      try { localStorage.setItem('laila_salma_hud_collapsed', next ? '1' : '0'); } catch (e) {}
    }
    try {
      if (localStorage.getItem('laila_salma_hud_collapsed') === '1') applyHudCollapsed(true);
    } catch (e) {}
    if (hudHdr) hudHdr.addEventListener('click', toggleHudCard);

    const mmCard = document.getElementById('minimap-card');
    if (mmCard) mmCard.addEventListener('click', toggleMiniMap);
    document.getElementById('btn-run').addEventListener('click', toggleRunButton);
    document.getElementById('btn-jump').addEventListener('click', triggerJump);
    document.getElementById('interact-prompt').addEventListener('click', triggerInteract);
    document.getElementById('btn-interact-mobile').addEventListener('click', triggerInteract);
    const bikeBellBtn = document.getElementById('btn-bike-bell');
    if (bikeBellBtn) bikeBellBtn.addEventListener('click', () => LS.ringBikeBell());
    const bikeDismountBtn = document.getElementById('btn-bike-dismount');
    if (bikeDismountBtn) bikeDismountBtn.addEventListener('click', () => LS.dismountYellowBike());

    const jZone = document.getElementById('joystick-zone');
    const jKnob = document.getElementById('joystick-knob');
    if (jZone) {
      let jId = null;
      const updateJoy = (clientX, clientY) => {
        const rect = jZone.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = (clientX - cx) / 36;
        let dy = (clientY - cy) / 36;
        const mag = Math.hypot(dx, dy);
        if (mag > 1) { dx /= mag; dy /= mag; }
        joy.x = dx;
        joy.y = dy;
        jKnob.style.left = (33 + dx * 30) + 'px';
        jKnob.style.top = (33 + dy * 30) + 'px';
      };
      jZone.addEventListener('pointerdown', e => {
        e.stopPropagation();
        jId = e.pointerId;
        joy.active = true;
        jZone.setPointerCapture(jId);
        updateJoy(e.clientX, e.clientY);
      });
      jZone.addEventListener('pointermove', e => {
        if (joy.active && e.pointerId === jId) updateJoy(e.clientX, e.clientY);
      });
      const resetJoy = () => {
        joy.active = false;
        joy.x = 0; joy.y = 0;
        jKnob.style.left = '33px';
        jKnob.style.top = '33px';
      };
      jZone.addEventListener('pointerup', resetJoy);
      jZone.addEventListener('pointercancel', resetJoy);
    }
  }

  function resolveCollisions(pos, radius) {
    const meta = LS.WORLDS[LS.state.currentWorld];
    const b = meta.bounds;
    pos.x = Math.max(b.minX, Math.min(b.maxX, pos.x));
    pos.z = Math.max(b.minZ, Math.min(b.maxZ, pos.z));
    const r = radius || 0.45;
    const cols = LS.activeWorld ? LS.activeWorld.colliders : [];
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i];
      if (pos.x + r > c.minX && pos.x - r < c.maxX && pos.z + r > c.minZ && pos.z - r < c.maxZ) {
        const dL = Math.abs((pos.x + r) - c.minX);
        const dR = Math.abs(c.maxX - (pos.x - r));
        const dT = Math.abs((pos.z + r) - c.minZ);
        const dB = Math.abs(c.maxZ - (pos.z - r));
        const m = Math.min(dL, dR, dT, dB);
        if (m === dL) pos.x = c.minX - r;
        else if (m === dR) pos.x = c.maxX + r;
        else if (m === dT) pos.z = c.minZ - r;
        else pos.z = c.maxZ + r;
      }
    }
  }

  function updateSalmaCompanion(dt, elapsed, isRunning, speed) {
    const leader = getLeader();
    const follower = getCompanion();
    if (!leader || !follower) return;

    const lp = leader.root.position;
    const sp = follower.root.position;

    // Piggyback Ride mode! Companion happily rides behind Laila's shoulders when Laila leads!
    if (LS.state.activeLeader !== 'salma' && LS.runtime.piggybackUntil && Date.now() < LS.runtime.piggybackUntil && LS.runtime.highFiveTimer <= 0) {
      const backX = -Math.sin(leader.root.rotation.y) * 0.34;
      const backZ = -Math.cos(leader.root.rotation.y) * 0.34;
      sp.set(lp.x + backX, lp.y + 0.62, lp.z + backZ);
      follower.root.rotation.y = leader.root.rotation.y;
      follower.leftLeg.rotation.x = -0.95 + Math.sin(elapsed * 9) * 0.22;
      follower.rightLeg.rotation.x = -0.95 - Math.sin(elapsed * 9) * 0.22;
      follower.leftArm.rotation.x = -0.85;
      follower.rightArm.rotation.x = -0.85;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(follower, 0, 'sit', elapsed);
      return;
    }

    const sideOffset = LS.runtime.poseTimer > 0 ? 1.05 : 0.68;
    const backOffset = LS.runtime.poseTimer > 0 ? 0.15 : 1.15;

    const behindX = -Math.sin(leader.root.rotation.y) * backOffset - Math.cos(leader.root.rotation.y) * sideOffset;
    const behindZ = -Math.cos(leader.root.rotation.y) * backOffset + Math.sin(leader.root.rotation.y) * sideOffset;
    const targetX = lp.x + behindX;
    const targetZ = lp.z + behindZ;

    const dx = targetX - sp.x;
    const dz = targetZ - sp.z;
    const dist = Math.hypot(dx, dz);

    if (dist > 12) {
      sp.set(targetX, getGroundH(targetX, targetZ), targetZ);
    } else if (dist > 0.25) {
      const followSpeed = Math.max(speed * 1.04, dist * 3.4);
      const step = Math.min(dist, followSpeed * dt);
      sp.x += (dx / dist) * step;
      sp.z += (dz / dist) * step;
      resolveCollisions(sp, 0.36);

      const targetRot = Math.atan2(dx, dz);
      let diff = targetRot - follower.root.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      follower.root.rotation.y += diff * Math.min(1, dt * 12);

      const sprinting = isRunning || dist > 2.2;
      const freq = sprinting ? 14.5 : 9.5;
      const amp = sprinting ? 0.82 : 0.52;
      const swing = Math.sin(elapsed * freq + 0.8) * amp;
      follower.leftLeg.rotation.x = swing;
      follower.rightLeg.rotation.x = -swing;
      follower.leftArm.rotation.x = -swing * 0.85;
      if (LS.runtime.poseTimer <= 0) follower.rightArm.rotation.x = swing * 0.85;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(follower, swing, sprinting ? 'run' : 'walk', elapsed);
    } else {
      let diff = leader.root.rotation.y - follower.root.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      follower.root.rotation.y += diff * Math.min(1, dt * 8);

      follower.leftLeg.rotation.x *= 0.82;
      follower.rightLeg.rotation.x *= 0.82;
      follower.leftArm.rotation.x *= 0.82;
      if (LS.runtime.poseTimer <= 0) follower.rightArm.rotation.x *= 0.82;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(follower, 0, 'idle', elapsed + 0.7);
    }

    const groundY = getGroundH(sp.x, sp.z);
    if (!salmaGrounded) {
      salmaVelY -= 17.5 * dt;
      sp.y += salmaVelY * dt;
      if (sp.y <= groundY) {
        sp.y = groundY;
        salmaVelY = 0;
        salmaGrounded = true;
      }
    } else {
      sp.y += (groundY - sp.y) * Math.min(1, dt * 14);
    }
  }

  function updatePlayer(dt, elapsed) {
    const laila = LS.chars.laila;
    const salma = LS.chars.salma;
    if (!laila || !LS.activeWorld) return;

    // LIVE 3D TITLE SCREEN ATTRACT MODE: Laila & Salma happily running & waving around the sunny Ghibli plaza!
    if (LS.runtime.titleScreenActive) {
      const cx = 0;
      const cz = LS.state.currentWorld === 'home_neighborhood' ? 3.0 : 12.0;
      const rad = LS.state.currentWorld === 'home_neighborhood' ? 5.6 : 4.2;
      const angL = elapsed * 0.78;
      const angS = angL - 0.52;
      const lx = cx + Math.sin(angL) * rad;
      const lz = cz + Math.cos(angL) * rad;
      const ly = getGroundH(lx, lz) + Math.abs(Math.sin(elapsed * 5.2)) * 0.14;
      laila.root.position.set(lx, ly, lz);
      laila.root.rotation.y = Math.atan2(Math.cos(angL) * rad, -Math.sin(angL) * rad);
      const swL = Math.sin(elapsed * 11.5) * 0.72;
      laila.leftLeg.rotation.x = swL; laila.rightLeg.rotation.x = -swL;
      laila.leftArm.rotation.x = -swL * 0.8; laila.rightArm.rotation.x = -0.32;
      laila.rightArm.rotation.z = 1.95 + Math.sin(elapsed * 6.5) * 0.35;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(laila, swL, 'run', elapsed);

      if (salma) {
        const sx = cx + Math.sin(angS) * (rad + 0.9);
        const sz = cz + Math.cos(angS) * (rad + 0.9);
        const sy = getGroundH(sx, sz) + Math.abs(Math.sin(elapsed * 6.0 + 0.7)) * 0.18;
        salma.root.position.set(sx, sy, sz);
        salma.root.rotation.y = Math.atan2(Math.cos(angS) * rad, -Math.sin(angS) * rad);
        const swS = Math.sin(elapsed * 13.0 + 0.5) * 0.78;
        salma.leftLeg.rotation.x = swS; salma.rightLeg.rotation.x = -swS;
        salma.leftArm.rotation.x = -swS * 0.85; salma.rightArm.rotation.x = -0.35;
        salma.rightArm.rotation.z = 2.05 + Math.sin(elapsed * 7.2) * 0.38;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(salma, swS, 'run', elapsed + 0.4);
      }
      return;
    }

    // Periodic 2-hour Hide-and-Seek reset check (every 10s)
    resetCheckAccum += dt;
    if (resetCheckAccum > 10) {
      resetCheckAccum = 0;
      const wid = LS.state.currentWorld;
      if ((wid === 'home_neighborhood' || wid === 'tokyo' || wid === 'kyoto' || wid === 'safari' || wid === 'egypt' || wid === 'marrakech') && LS.checkAnimalReset(wid)) {
        const curLead = getLeader();
        LS.loadWorld(wid, false, {
          x: curLead.root.position.x,
          y: curLead.root.position.y,
          z: curLead.root.position.z,
          rotY: curLead.root.rotation.y
        });
        LS.showToast(wid === 'home_neighborhood'
          ? '🐶 2 hours passed! All 5 Community Puppies hid in brand-new spots!'
          : (wid === 'safari'
            ? '🦁 2 hours passed! All 5 Safari Lion Cubs hid in brand-new spots!'
            : (wid === 'egypt'
              ? '🐱 2 hours passed! All 5 Royal Egyptian Mau Cats hid in brand-new spots!'
              : (wid === 'marrakech'
                ? '🦊 2 hours passed! All 5 Sahara Fennec Foxes hid in brand-new spots!'
                : (wid === 'kyoto'
                  ? '🦊 2 hours passed! All 5 Kyoto Kitsune hid in brand-new spots!'
                  : '🐱 2 hours passed! All 5 Tokyo Cats hid in brand-new spots!')))));
        return;
      }
    }

    if (LS.runtime.eating) {
      const eat = LS.runtime.eating;
      eat.timer += dt;
      laila.rightArm.rotation.x = -1.25 + Math.sin(elapsed * 5.2) * 0.35;
      laila.headGroup.rotation.x = Math.sin(elapsed * 5.2) * 0.14;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(laila, 0, 'sit', elapsed);
      eat.bowlObj.sticks.position.y = 0.28 + Math.max(0, Math.sin(elapsed * 5.2)) * 0.18;

      if (salma) {
        salma.rightArm.rotation.x = -1.25 + Math.sin(elapsed * 5.8 + 0.9) * 0.35;
        salma.headGroup.rotation.x = Math.sin(elapsed * 5.8 + 0.9) * 0.16;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(salma, 0, 'sit', elapsed);
        if (eat.bowlObj.salmaSticks) {
          eat.bowlObj.salmaSticks.position.y = 0.28 + Math.max(0, Math.sin(elapsed * 5.8 + 0.9)) * 0.18;
        }
      }

      eat.bowlObj.oishii.position.y = eat.bowlObj.baseOishiiY + Math.sin(elapsed * 3.5) * 0.12;
      if (eat.timer >= eat.duration) LS.finishEatingAnimation(scene);
      return;
    }

    if (LS.runtime.modalOpen || LS.runtime.traveling) return;

    // Guided Zebra-Striped Safari Jeep Tour across the golden Savanna!
    if (LS.runtime.safariRide && LS.activeWorld && LS.activeWorld.jeepPath && LS.activeWorld.safariJeep) {
      const sr = LS.runtime.safariRide;
      sr.t += dt / sr.duration;
      const jeep = LS.activeWorld.safariJeep;
      const curve = LS.activeWorld.jeepPath;
      const u = Math.min(1, sr.t);
      const pos = curve.getPointAt(u);
      const ahead = curve.getPointAt(Math.min(1, u + 0.015));
      const yaw = Math.atan2(ahead.x - pos.x, ahead.z - pos.z);
      const bounce = Math.sin(elapsed * 14) * 0.035;
      jeep.position.set(pos.x, bounce, pos.z);
      jeep.rotation.y = yaw;
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      laila.root.position.set(pos.x + cosY * 0.34 - sinY * 0.22, 0.72 + bounce, pos.z - sinY * 0.34 - cosY * 0.22);
      laila.root.rotation.y = yaw;
      laila.leftLeg.rotation.x = -1.05; laila.rightLeg.rotation.x = -1.05;
      laila.rightArm.rotation.x = -0.3; laila.rightArm.rotation.z = 1.9 + Math.sin(elapsed * 6) * 0.25;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(laila, 0, 'sit', elapsed);
      if (salma) {
        salma.root.position.set(pos.x - cosY * 0.34 - sinY * 0.22, 0.72 + bounce, pos.z + sinY * 0.34 - cosY * 0.22);
        salma.root.rotation.y = yaw;
        salma.leftLeg.rotation.x = -1.05; salma.rightLeg.rotation.x = -1.05;
        salma.rightArm.rotation.x = -0.35; salma.rightArm.rotation.z = 2.0 + Math.sin(elapsed * 6.5) * 0.28;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(salma, 0, 'sit', elapsed);
      }
      if (sr.t >= 1.0) {
        if (LS.activeWorld.jeepHome) {
          jeep.position.copy(LS.activeWorld.jeepHome.pos);
          jeep.rotation.y = LS.activeWorld.jeepHome.rotY;
          laila.root.position.set(LS.activeWorld.jeepHome.exit.x, 0, LS.activeWorld.jeepHome.exit.z);
          if (salma) salma.root.position.set(LS.activeWorld.jeepHome.exit.x - 1.0, 0, LS.activeWorld.jeepHome.exit.z + 0.4);
        }
        laila.leftLeg.rotation.x = 0; laila.rightLeg.rotation.x = 0; laila.rightArm.rotation.z = 0;
        if (salma) { salma.leftLeg.rotation.x = 0; salma.rightLeg.rotation.x = 0; salma.rightArm.rotation.z = 0; }
        LS.runtime.safariRide = null;
        LS.addCoins(25);
        LS.addXP(20);
        LS.unlockStamp('safari_jeep');
        LS.playSFX('correct');
        LS.showToast('🚙🎉 Amazing Safari Jeep Tour! +25c & +20 XP!');
      }
      return;
    }

    // Scenic Hot Air Balloon Sunrise Flight over Pride Rock, Elephant Oasis & Mt. Kilimanjaro!
    if (LS.runtime.balloonRide && LS.activeWorld && LS.activeWorld.hotAirBalloon) {
      const br = LS.runtime.balloonRide;
      br.t += dt / br.duration;
      const bal = LS.activeWorld.hotAirBalloon;
      const home = LS.activeWorld.balloonHome ? LS.activeWorld.balloonHome.pos : new THREE.Vector3(12.5, 0, -3.5);
      const u = Math.min(1, br.t);
      // Smooth takeoff (0..0.22), high panoramic drift loop (0.22..0.78), gentle landing (0.78..1.0)
      const altEnv = Math.sin(u * Math.PI);
      const yAlt = Math.pow(altEnv, 0.72) * 19.5;
      const driftEnv = Math.sin(u * Math.PI);
      const bx = home.x - Math.sin(u * Math.PI * 2) * 16.0 * driftEnv;
      const bz = home.z - (1 - Math.cos(u * Math.PI * 2)) * 12.0 * driftEnv;
      bal.position.set(bx, yAlt, bz);
      bal.rotation.y = Math.sin(u * Math.PI * 2) * 0.45;
      bal.rotation.z = Math.sin(elapsed * 1.1) * 0.03;

      // Stand Laila & Salma happily inside the wicker basket looking out & waving!
      laila.root.position.set(bx - 0.32, yAlt + 0.25, bz + 0.15);
      laila.root.rotation.y = Math.PI + Math.sin(elapsed * 0.6) * 0.4;
      laila.leftLeg.rotation.x = 0; laila.rightLeg.rotation.x = 0;
      laila.rightArm.rotation.x = -0.35; laila.rightArm.rotation.z = 2.0 + Math.sin(elapsed * 5.5) * 0.28;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(laila, 0, 'idle', elapsed);
      if (salma) {
        salma.root.position.set(bx + 0.34, yAlt + 0.25, bz - 0.12);
        salma.root.rotation.y = Math.PI - Math.sin(elapsed * 0.6) * 0.4;
        salma.leftLeg.rotation.x = 0; salma.rightLeg.rotation.x = 0;
        salma.rightArm.rotation.x = -0.4; salma.rightArm.rotation.z = 2.1 + Math.sin(elapsed * 6.2) * 0.3;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(salma, 0, 'idle', elapsed + 0.4);
      }

      if (br.t >= 1.0 && LS.finishBalloonRide) {
        LS.finishBalloonRide(false);
      }
      return;
    }

    // Watchtower panoramic lookout countdown (Laila & Salma admire the view from the watchtower!)
    if (LS.runtime.watchtowerTimer > 0) {
      LS.runtime.watchtowerTimer = Math.max(0, LS.runtime.watchtowerTimer - dt);
    }

    // Interactive Pocket Park Activities (Slide, Swing, Hopscotch) — works in BOTH Tokyo & Kyoto!
    if (LS.runtime.parkActivity) {
      const pa = LS.runtime.parkActivity;
      pa.timer -= dt;
      const t = Math.max(0, Math.min(1, 1 - (pa.timer / pa.duration)));
      if (pa.type === 'slide' && LS.activeWorld.slideStartPos && LS.activeWorld.slideEndPos) {
        laila.root.position.lerpVectors(LS.activeWorld.slideStartPos, LS.activeWorld.slideEndPos, t);
        laila.leftLeg.rotation.x = -1.1;
        laila.rightLeg.rotation.x = -1.1;
        if (salma) {
          const st = Math.max(0, Math.min(1, (t - 0.18) / 0.82));
          salma.root.position.lerpVectors(LS.activeWorld.slideStartPos, LS.activeWorld.slideEndPos, st);
          salma.leftLeg.rotation.x = -1.1;
          salma.rightLeg.rotation.x = -1.1;
        }
      } else if (pa.type === 'swing' && LS.activeWorld.swingSeatPos) {
        const sw = Math.sin(elapsed * 4.5);
        const base = LS.activeWorld.swingSeatPos;
        laila.root.position.set(base.x, base.y + Math.abs(sw) * 0.42, base.z + sw * 0.85);
        laila.leftLeg.rotation.x = -1.15;
        laila.rightLeg.rotation.x = -1.15;
        if (salma) {
          salma.root.position.set(base.x - 0.9, 0 + Math.abs(Math.sin(elapsed * 7)) * 0.25, base.z + 0.6);
        }
      } else if (pa.type === 'hopscotch' && LS.activeWorld.hopscotchPos) {
        const hp = LS.activeWorld.hopscotchPos;
        const hopZ = hp.z + 1.1 - t * 2.2;
        const hopY = Math.abs(Math.sin(t * Math.PI * 5)) * 0.55;
        laila.root.position.set(hp.x, hopY, hopZ);
        if (salma) {
          salma.root.position.set(hp.x + 0.65, Math.abs(Math.sin(t * Math.PI * 5 + 0.5)) * 0.48, hopZ + 0.35);
        }
      }
      if (pa.timer <= 0) {
        laila.root.position.y = getGroundH(laila.root.position.x, laila.root.position.z);
        laila.leftLeg.rotation.x = 0;
        laila.rightLeg.rotation.x = 0;
        if (salma) {
          salma.root.position.y = getGroundH(salma.root.position.x, salma.root.position.z);
          salma.leftLeg.rotation.x = 0;
          salma.rightLeg.rotation.x = 0;
        }
        LS.runtime.parkActivity = null;
      }
      return;
    }

    // Live 3D NGSC Sports Club Animations (Laila Playing Squash & Laila + Salma Swimming!)
    if (LS.runtime.ngscActivity) {
      const na = LS.runtime.ngscActivity;
      na.timer -= dt;
      const t = Math.max(0, Math.min(1, 1 - (na.timer / na.duration)));
      const w = LS.activeWorld;

      if (na.type === 'squash') {
        // Laila rallies dynamically across the hardwood Squash Court holding a 3D racket!
        const rallyPhase = elapsed * 2.5;
        const lx = -7.6 + Math.sin(rallyPhase) * 2.15;
        const lz = 0.25 + Math.cos(rallyPhase * 0.72) * 0.85;
        const hop = Math.abs(Math.sin(rallyPhase * 2.0)) * 0.14;
        laila.root.position.set(lx, 0.13 + hop, lz);
        laila.root.rotation.y = Math.PI + Math.cos(rallyPhase) * 0.28;
        if (laila.bodyPivot) laila.bodyPivot.rotation.x = 0.08;
        const runSwing = Math.sin(rallyPhase * 4.0) * 0.65;
        laila.leftLeg.rotation.x = runSwing;
        laila.rightLeg.rotation.x = -runSwing;
        // Rhythmic forehand/backhand squash racket swing synced to ball bounce!
        const ballCycle = (elapsed * 1.45) % 1.0; // 0 = hit from Laila -> 0.5 = wall impact -> 1.0 = back to Laila
        const swingAmt = ballCycle < 0.22 ? Math.sin((ballCycle / 0.22) * Math.PI) : 0;
        laila.rightArm.rotation.x = -0.85 - swingAmt * 1.45;
        laila.rightArm.rotation.z = -0.35 + swingAmt * 0.65;
        laila.leftArm.rotation.x = 0.25;
        laila.leftArm.rotation.z = 0.35;

        // Sync 3D squash ball directly between Laila's racket & the front white wall!
        if (w && w.squashBall) {
          const arc = ballCycle < 0.5 ? (ballCycle * 2.0) : ((1.0 - ballCycle) * 2.0); // 0 = at Laila, 1 = at front wall
          const localLx = lx - (-7.6);
          const localLz = lz - (-2.0);
          const bx = localLx * (1 - arc) + (Math.sin(rallyPhase + 1.0) * 1.6) * arc;
          const bz = (localLz - 0.55) * (1 - arc) + (-4.62) * arc;
          const by = 0.95 + Math.sin(arc * Math.PI) * 1.35 + arc * 0.65;
          w.squashBall.position.set(bx, by, bz);
        }

        // Salma cheers & hops happily right outside the clear glass back wall!
        if (salma) {
          salma.root.position.set(-6.0, Math.abs(Math.sin(elapsed * 7.5)) * 0.24, 4.15);
          salma.root.rotation.y = Math.PI - 0.18;
          if (salma.bodyPivot) salma.bodyPivot.rotation.x = 0;
          salma.leftArm.rotation.z = 2.45 + Math.sin(elapsed * 9.0) * 0.35;
          salma.rightArm.rotation.z = -2.45 - Math.sin(elapsed * 9.0) * 0.35;
          salma.leftLeg.rotation.x = 0;
          salma.rightLeg.rotation.x = 0;
        }
      } else if (na.type === 'swim') {
        // BOTH Laila (Lane 1) & Salma (Lane 2) swim freestyle side-by-side in the NGSC pool!
        const lapT = (elapsed * 0.26) % 2.0; // 0..1 north toward starting blocks, 1..2 south back
        const goingNorth = lapT < 1.0;
        const u = goingNorth ? lapT : (2.0 - lapT);
        const swimZ = 1.9 - u * 6.8;
        const salmaU = ((elapsed * 0.26 + 0.08) % 2.0);
        const sNorth = salmaU < 1.0;
        const su = sNorth ? salmaU : (2.0 - salmaU);
        const salmaZ = 1.9 - su * 6.8;

        const strokeL = elapsed * 6.8;
        const strokeS = elapsed * 7.2 + 1.1;

        // Laila freestyle in Lane 1 (X = +4.7)
        laila.root.position.set(4.7, 0.34 + Math.sin(strokeL) * 0.03, swimZ);
        laila.root.rotation.y = goingNorth ? Math.PI : 0;
        if (laila.bodyPivot) laila.bodyPivot.rotation.x = Math.PI * 0.44;
        laila.leftArm.rotation.x = -strokeL;
        laila.rightArm.rotation.x = -(strokeL + Math.PI);
        laila.leftArm.rotation.z = 0.18;
        laila.rightArm.rotation.z = -0.18;
        laila.leftLeg.rotation.x = Math.sin(strokeL * 2.1) * 0.38;
        laila.rightLeg.rotation.x = -Math.sin(strokeL * 2.1) * 0.38;

        // Salma freestyle in Lane 2 (X = +7.4)
        if (salma) {
          salma.root.position.set(7.4, 0.32 + Math.sin(strokeS) * 0.03, salmaZ);
          salma.root.rotation.y = sNorth ? Math.PI : 0;
          if (salma.bodyPivot) salma.bodyPivot.rotation.x = Math.PI * 0.44;
          salma.leftArm.rotation.x = -strokeS;
          salma.rightArm.rotation.x = -(strokeS + Math.PI);
          salma.leftArm.rotation.z = 0.18;
          salma.rightArm.rotation.z = -0.18;
          salma.leftLeg.rotation.x = Math.sin(strokeS * 2.1) * 0.42;
          salma.rightLeg.rotation.x = -Math.sin(strokeS * 2.1) * 0.42;
        }

        // Animated sparkling white water-splash rings trailing behind both sisters!
        if (w && w.swimSplashes) {
          const sp0 = w.swimSplashes[0];
          if (sp0) {
            sp0.visible = true;
            sp0.position.set(4.7, 0.22, swimZ + (goingNorth ? 0.55 : -0.55));
            const sc0 = 0.85 + ((elapsed * 2.2) % 1.0) * 0.75;
            sp0.scale.setScalar(sc0);
            sp0.material.opacity = (1 - ((elapsed * 2.2) % 1.0)) * 0.75;
          }
          const sp1 = w.swimSplashes[1];
          if (sp1 && salma) {
            sp1.visible = true;
            sp1.position.set(7.4, 0.22, salmaZ + (sNorth ? 0.55 : -0.55));
            const sc1 = 0.85 + ((elapsed * 2.2 + 0.45) % 1.0) * 0.75;
            sp1.scale.setScalar(sc1);
            sp1.material.opacity = (1 - ((elapsed * 2.2 + 0.45) % 1.0)) * 0.75;
          }
        }
      }

      if (na.timer <= 0) {
        LS.finishNGSCActivity(false);
      }
      return;
    }

    // Live 3D Wave 1 (Africa) Animations: Felucca Sail, Camel Caravan, High-Pour Tea & Drum Circle!
    if (LS.runtime.wave1Anim) {
      const wa = LS.runtime.wave1Anim;
      wa.timer -= dt;
      const t = Math.max(0, Math.min(1, 1 - (wa.timer / wa.duration)));
      const w = LS.activeWorld;

      if (wa.mode === 'egypt_felucca') {
        // Glide smoothly out from Lotus Pier down the shimmering Nile past lotuses & Great Pyramids!
        const loopU = Math.sin(t * Math.PI); // 0 -> 1 -> 0 smooth round trip
        const boatX = 29.8 + loopU * 4.2 + Math.sin(elapsed * 0.9) * 0.6;
        const boatZ = 3.0 - loopU * 23.0;
        const boatY = 0.10 + Math.sin(elapsed * 2.4) * 0.06;
        const roll = Math.sin(elapsed * 1.8) * 0.05;
        const heading = t < 0.5 ? Math.PI : 0;

        if (w && w.rideFelucca && w.rideFelucca.obj) {
          w.rideFelucca.obj.root.position.set(boatX, boatY, boatZ);
          w.rideFelucca.obj.root.rotation.set(0, heading, roll);
        }
        // Laila & Salma stand happily on the sunlit wooden Felucca deck waving at the Pyramids!
        laila.root.position.set(boatX - 0.35, boatY + 0.62, boatZ - (t < 0.5 ? 0.85 : -0.85));
        laila.root.rotation.y = heading - 0.55;
        laila.leftArm.rotation.z = 2.15 + Math.sin(elapsed * 6.5) * 0.32;
        laila.rightArm.rotation.z = -0.25;
        laila.leftLeg.rotation.x = 0; laila.rightLeg.rotation.x = 0;

        if (salma) {
          salma.root.position.set(boatX + 0.42, boatY + 0.62, boatZ + (t < 0.5 ? 0.55 : -0.55));
          salma.root.rotation.y = heading + 0.45;
          salma.rightArm.rotation.z = -2.25 - Math.sin(elapsed * 7.2 + 0.6) * 0.35;
          salma.leftArm.rotation.z = 0.25;
          salma.leftLeg.rotation.x = 0; salma.rightLeg.rotation.x = 0;
        }
      } else if (wa.mode === 'egypt_camel') {
        // Laila mounts Habibi (crimson saddle) & Salma mounts Shams (turquoise saddle) in an Oasis loop!
        const ang = -0.35 + t * Math.PI * 2;
        const cx = -13.5, cz = 4.2, rx = 4.8, rz = 8.4;
        const bob1 = Math.abs(Math.sin(elapsed * 5.2)) * 0.09;
        const bob2 = Math.abs(Math.sin(elapsed * 5.2 + 1.1)) * 0.09;

        const c1x = cx + Math.cos(ang) * rx;
        const c1z = cz + Math.sin(ang) * rz;
        const c1rot = Math.atan2(-Math.sin(ang) * rx, Math.cos(ang) * rz);

        const ang2 = ang - 0.38;
        const c2x = cx + Math.cos(ang2) * rx;
        const c2z = cz + Math.sin(ang2) * rz;
        const c2rot = Math.atan2(-Math.sin(ang2) * rx, Math.cos(ang2) * rz);

        if (w && w.camels && w.camels[0]) {
          w.camels[0].obj.root.position.set(c1x, bob1, c1z);
          w.camels[0].obj.root.rotation.set(0, c1rot, Math.sin(elapsed * 5.2) * 0.03);
        }
        if (w && w.camels && w.camels[1]) {
          w.camels[1].obj.root.position.set(c2x, bob2, c2z);
          w.camels[1].obj.root.rotation.set(0, c2rot, Math.sin(elapsed * 5.2 + 1.1) * 0.03);
        }

        laila.root.position.set(c1x, 2.28 + bob1, c1z);
        laila.root.rotation.y = c1rot;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(laila, 0, 'chair_sit', elapsed);
        laila.rightArm.rotation.z = -2.2 - Math.sin(elapsed * 6.0) * 0.25;

        if (salma) {
          salma.root.position.set(c2x, 2.26 + bob2, c2z);
          salma.root.rotation.y = c2rot;
          if (LS.applyArticulatedPose) LS.applyArticulatedPose(salma, 0, 'chair_sit', elapsed + 0.8);
          salma.leftArm.rotation.z = 2.2 + Math.sin(elapsed * 6.4) * 0.25;
        }
      } else if (wa.mode === 'marrakech_tea') {
        // Laila & Salma sit cleanly on top of the plush Riad velvet poufs while Rashid high-pours sparkling golden tea!
        laila.root.position.set(-0.95, 0.70, -18.35);
        laila.root.rotation.y = Math.PI + 0.22;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(laila, 0, 'chair_sit', elapsed);
        laila.rightArm.rotation.x = -0.65 + Math.sin(elapsed * 3.0) * 0.14;

        if (salma) {
          salma.root.position.set(0.95, 0.70, -18.35);
          salma.root.rotation.y = Math.PI - 0.22;
          if (LS.applyArticulatedPose) LS.applyArticulatedPose(salma, 0, 'chair_sit', elapsed + 0.5);
          salma.leftArm.rotation.x = -0.65 + Math.sin(elapsed * 3.2 + 0.6) * 0.14;
        }

        if (w && w.teaRashid && w.teaRashid.ch) {
          w.teaRashid.ch.root.position.set(0.0, 0.34, -22.05);
          w.teaRashid.ch.root.rotation.y = 0;
          w.teaRashid.ch.rightArm.rotation.x = -2.15 + Math.sin(elapsed * 2.2) * 0.14;
          w.teaRashid.ch.leftArm.rotation.x = -0.55;
        }
        if (w && w.teaPourGroup) {
          w.teaPourGroup.visible = true;
          w.teaPourGroup.rotation.y = Math.sin(elapsed * 1.4) * 0.28;
        }
      } else if (wa.mode === 'marrakech_drums') {
        // Laila & Salma jam rhythmically on Hassan's woven sunset drum carpet with floating golden notes!
        const beat = Math.sin(elapsed * 7.5);
        laila.root.position.set(-11.55, Math.abs(beat) * 0.12, 21.1);
        laila.root.rotation.y = 0.55;
        laila.leftArm.rotation.x = -0.95 + Math.sin(elapsed * 9.5) * 0.42;
        laila.rightArm.rotation.x = -0.95 + Math.sin(elapsed * 9.5 + Math.PI) * 0.42;
        laila.leftLeg.rotation.x = 0; laila.rightLeg.rotation.x = 0;

        if (salma) {
          salma.root.position.set(-9.45, Math.abs(Math.sin(elapsed * 7.5 + 0.8)) * 0.16, 21.1);
          salma.root.rotation.y = -0.55;
          salma.leftArm.rotation.x = -0.95 + Math.sin(elapsed * 10.0 + 0.4) * 0.45;
          salma.rightArm.rotation.x = -0.95 + Math.sin(elapsed * 10.0 + Math.PI + 0.4) * 0.45;
          salma.leftLeg.rotation.x = 0; salma.rightLeg.rotation.x = 0;
        }

        wa.drumBeatTimer -= dt;
        if (wa.drumBeatTimer <= 0 && LS.playDjembeSound) {
          wa.drumBeatTimer = 0.62;
          const kinds = ['bass', 'tone', 'slap', 'tone'];
          LS.playDjembeSound(kinds[Math.floor(elapsed * 2) % kinds.length]);
        }
      }

      if (wa.timer <= 0) {
        LS.finishWave1Anim(false);
      }
      return;
    }

    // Free-roam Yellow Bicycle riding around Tokyo (Laila pedals, Salma cheers on the rear rack!)
    if (LS.runtime.bikeRide && LS.runtime.bikeRide.bike) {
      const br = LS.runtime.bikeRide;
      const bike = br.bike;

      let inX = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
      let inZ = (keys['s'] || keys['arrowdown'] ? 1 : 0) - (keys['w'] || keys['arrowup'] ? 1 : 0);
      if (joy.active) { inX = joy.x; inZ = joy.y; }

      const moving = Math.hypot(inX, inZ) > 0.08;
      lastMoveInput.x = inX;
      lastMoveInput.z = inZ;
      lastMoveInput.moving = moving;

      // Pedaling restores stamina & gives a breezy cycling pace!
      LS.runtime.stamina = Math.min(100, LS.runtime.stamina + dt * 22);
      const wantsBoost = (keys['shift'] || LS.runtime.runToggle) && moving;
      const buffMult = (LS.runtime.buff && Date.now() < LS.runtime.buff.expiresAt) ? LS.runtime.buff.speedMult : 1.0;
      const targetSpeed = moving ? (wantsBoost ? 13.8 : 10.2) * buffMult : 0;
      br.speed += (targetSpeed - br.speed) * Math.min(1, dt * (moving ? 5.5 : 7.5));

      let turnDelta = 0;
      if (moving) {
        const len = Math.hypot(inX, inZ);
        inX /= len; inZ /= len;
        _fwd.set(Math.sin(camYaw), 0, Math.cos(camYaw));
        _right.set(-_fwd.z, 0, _fwd.x);
        _moveVec.set(0, 0, 0)
          .addScaledVector(_fwd, -inZ)
          .addScaledVector(_right, inX)
          .normalize();

        const targetRot = Math.atan2(_moveVec.x, _moveVec.z);
        turnDelta = wrapAngleDelta(bike.rotation.y, targetRot);
        bike.rotation.y += turnDelta * Math.min(1, dt * 7.5);
      }

      if (br.speed > 0.08) {
        const bx = Math.sin(bike.rotation.y);
        const bz = Math.cos(bike.rotation.y);
        bike.position.x += bx * br.speed * dt;
        bike.position.z += bz * br.speed * dt;
        resolveCollisions(bike.position, 0.58);
        br.pedalPhase += dt * (4.5 + br.speed * 0.72);
      }

      // Gentle lean into curves & bridge ground height tracking
      const targetLean = Math.max(-0.24, Math.min(0.24, -turnDelta * 0.28));
      br.lean += (targetLean - br.lean) * Math.min(1, dt * 8.0);
      const gy = getGroundH(bike.position.x, bike.position.z);
      bike.position.y += (gy - bike.position.y) * Math.min(1, dt * 14);
      bike.rotation.z = br.lean;

      const sinY = Math.sin(bike.rotation.y);
      const cosY = Math.cos(bike.rotation.y);
      const bounce = br.speed > 0.5 ? Math.sin(br.pedalPhase * 2) * 0.022 : 0;

      // Seat Laila right on the saddle (-0.18m back) holding the handlebars & pedaling!
      laila.root.position.set(
        bike.position.x - sinY * 0.16,
        bike.position.y + 0.34 + bounce,
        bike.position.z - cosY * 0.16
      );
      laila.root.rotation.y = bike.rotation.y;
      laila.bodyPivot.rotation.z = br.lean * 0.85;
      laila.leftArm.rotation.x = -1.06;
      laila.rightArm.rotation.x = -1.06;
      laila.rightArm.rotation.z = 0;
      const pSin = Math.sin(br.pedalPhase);
      laila.leftLeg.rotation.x = -0.68 + pSin * 0.48;
      laila.rightLeg.rotation.x = -0.68 - pSin * 0.48;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(laila, pSin, 'bike_pedal', elapsed);

      // Seat Salma happily on the rear carrier rack (-0.56m back) cheering & waving!
      if (salma) {
        salma.root.position.set(
          bike.position.x - sinY * 0.56,
          bike.position.y + 0.26 + bounce * 1.15,
          bike.position.z - cosY * 0.56
        );
        salma.root.rotation.y = bike.rotation.y;
        salma.bodyPivot.rotation.z = br.lean * 0.85;
        salma.leftLeg.rotation.x = -1.08 + Math.sin(elapsed * 5.0) * 0.14;
        salma.rightLeg.rotation.x = -1.08 - Math.sin(elapsed * 5.0) * 0.14;
        salma.leftArm.rotation.x = -0.92;
        salma.rightArm.rotation.x = -0.36;
        salma.rightArm.rotation.z = br.speed > 1.5 ? (2.05 + Math.sin(elapsed * 7.5) * 0.26) : 0.35;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(salma, 0, 'sit', elapsed);
      }

      const zoneEl = document.getElementById('compass-zone');
      if (zoneEl && LS.activeWorld.getZoneLabel) {
        zoneEl.textContent = LS.activeWorld.getZoneLabel(bike.position.x, bike.position.z);
      }
      return;
    }

    let inX = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
    let inZ = (keys['s'] || keys['arrowdown'] ? 1 : 0) - (keys['w'] || keys['arrowup'] ? 1 : 0);
    if (joy.active) { inX = joy.x; inZ = joy.y; }

    const moving = Math.hypot(inX, inZ) > 0.08;
    lastMoveInput.x = inX;
    lastMoveInput.z = inZ;
    lastMoveInput.moving = moving;
    if (moving) LS.runtime.poseTimer = 0;

    const wantsRun = (keys['shift'] || LS.runtime.runToggle) && moving;
    const infStam = LS.runtime.buff && LS.runtime.buff.infiniteStamina && Date.now() < LS.runtime.buff.expiresAt;
    const isRunning = wantsRun && (LS.runtime.stamina > 2 || infStam);

    if (isRunning && !infStam) {
      LS.runtime.stamina = Math.max(0, LS.runtime.stamina - dt * 24);
    } else {
      LS.runtime.stamina = Math.min(100, LS.runtime.stamina + dt * 16);
    }

    const buffMult = (LS.runtime.buff && Date.now() < LS.runtime.buff.expiresAt) ? LS.runtime.buff.speedMult : 1.0;
    const speed = (isRunning ? 8.8 : 5.0) * buffMult;

    const leader = getLeader();
    const follower = getCompanion();

    if (moving) {
      const len = Math.hypot(inX, inZ);
      inX /= len; inZ /= len;
      _fwd.set(Math.sin(camYaw), 0, Math.cos(camYaw));
      _right.set(-_fwd.z, 0, _fwd.x);
      _moveVec.set(0, 0, 0)
        .addScaledVector(_fwd, -inZ)
        .addScaledVector(_right, inX)
        .normalize();

      leader.root.position.addScaledVector(_moveVec, speed * dt);
      resolveCollisions(leader.root.position, 0.45);

      const targetRot = Math.atan2(_moveVec.x, _moveVec.z);
      let diff = targetRot - leader.root.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      leader.root.rotation.y += diff * Math.min(1, dt * 12);

      const freq = isRunning ? 12.5 : 8.0;
      const amp = isRunning ? 0.78 : 0.48;
      const swing = Math.sin(elapsed * freq) * amp;
      leader.leftLeg.rotation.x = swing;
      leader.rightLeg.rotation.x = -swing;
      leader.leftArm.rotation.x = -swing * 0.8;
      leader.rightArm.rotation.x = swing * 0.8;
      leader.rightArm.rotation.z = 0;
      if (follower) follower.rightArm.rotation.z = 0;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(leader, swing, isRunning ? 'run' : 'walk', elapsed);
    } else {
      leader.leftLeg.rotation.x *= 0.82;
      leader.rightLeg.rotation.x *= 0.82;
      leader.leftArm.rotation.x *= 0.82;
      if (LS.applyArticulatedPose) LS.applyArticulatedPose(leader, 0, 'idle', elapsed);

      if (LS.runtime.poseTimer > 0) {
        LS.runtime.poseTimer -= dt;
        leader.rightArm.rotation.x = -0.38;
        leader.rightArm.rotation.z = 2.15 + Math.sin(elapsed * 9.5) * 0.34;
        if (leader.rightElbow) leader.rightElbow.rotation.x = -0.32;
        leader.headGroup.rotation.z = -0.08 + Math.sin(elapsed * 4.5) * 0.06;
        if (follower) {
          follower.rightArm.rotation.x = -0.42;
          follower.rightArm.rotation.z = 2.22 + Math.sin(elapsed * 10.0 + 0.5) * 0.38;
          if (follower.rightElbow) follower.rightElbow.rotation.x = -0.32;
          follower.headGroup.rotation.z = 0.08 - Math.sin(elapsed * 4.5) * 0.08;
        }
      } else {
        leader.rightArm.rotation.x *= 0.82;
        leader.rightArm.rotation.z *= 0.8;
        leader.headGroup.rotation.z *= 0.8;
        if (follower) {
          follower.rightArm.rotation.z *= 0.8;
          follower.headGroup.rotation.z *= 0.8;
        }
      }
    }

    const groundY = getGroundH(leader.root.position.x, leader.root.position.z);
    if (!grounded) {
      velY -= 17.5 * dt;
      leader.root.position.y += velY * dt;
      if (leader.root.position.y <= groundY) {
        leader.root.position.y = groundY;
        velY = 0;
        grounded = true;
      }
    } else {
      leader.root.position.y += (groundY - leader.root.position.y) * Math.min(1, dt * 14);
    }

    updateSalmaCompanion(dt, elapsed, isRunning, speed);

    if (LS.runtime.highFiveTimer > 0) {
      LS.runtime.highFiveTimer -= dt;
      leader.rightArm.rotation.x = -0.35;
      leader.rightArm.rotation.z = 2.45;
      if (follower) {
        follower.rightArm.rotation.x = -0.35;
        follower.rightArm.rotation.z = 2.45;
        const sg = getGroundH(follower.root.position.x, follower.root.position.z);
        follower.root.position.y = sg + Math.abs(Math.sin(elapsed * 10)) * 0.52;
      }
    }

    if (LS.runtime.mochiGame && LS.chars.mochi) {
      const mg = LS.runtime.mochiGame;
      mg.timeLeft -= dt;
      const mp = LS.chars.mochi.position;
      const lp = leader.root.position;
      const minX = -3.4, maxX = 3.4;
      const minZ = LS.state.currentWorld === 'kyoto' ? -36 : -28;
      const maxZ = 22;

      if (mg.mode === 'fetch') {
        if (mg.state === 'to_target') {
          const dx = mg.ballPos.x - mp.x;
          const dz = mg.ballPos.z - mp.z;
          const d = Math.hypot(dx, dz);
          if (d > 0.25) {
            mp.x += (dx / d) * 7.2 * dt;
            mp.z += (dz / d) * 7.2 * dt;
            mp.y = getGroundH(mp.x, mp.z);
            mp.rotation.y = Math.atan2(dx, dz);
          } else {
            mg.state = 'returning';
          }
        } else {
          const dx = lp.x - mp.x;
          const dz = lp.z - mp.z;
          const d = Math.hypot(dx, dz);
          if (d > 1.0) {
            mp.x += (dx / d) * 6.8 * dt;
            mp.z += (dz / d) * 6.8 * dt;
            mp.y = getGroundH(mp.x, mp.z);
            mp.rotation.y = Math.atan2(dx, dz);
            if (LS.activeWorld.mochiBall) LS.activeWorld.mochiBall.position.set(mp.x, mp.y + 0.25, mp.z);
          } else {
            mg.score += 1;
            LS.runtime.mochiHeartTimer = 1.6;
            LS.playSFX('coin');
            mg.state = 'to_target';
            mg.ballPos.set(minX + Math.random() * (maxX - minX), 0.14, minZ + Math.random() * (maxZ - minZ));
            if (LS.activeWorld.mochiBall) LS.activeWorld.mochiBall.position.copy(mg.ballPos);
          }
        }
      } else {
        const dPlayer = lp.distanceTo(mp);
        if (dPlayer < 1.8) {
          mg.score += 1;
          LS.runtime.mochiHeartTimer = 1.5;
          LS.playSFX('coin');
          mp.x = Math.max(minX, Math.min(maxX, lp.x + (Math.random() - 0.5) * 9));
          mp.z = Math.max(minZ, Math.min(maxZ, lp.z + (Math.random() - 0.5) * 9));
        } else {
          mp.x = Math.max(minX, Math.min(maxX, mp.x + Math.sin(elapsed * 2.2) * 3.5 * dt));
          mp.z = Math.max(minZ, Math.min(maxZ, mp.z + Math.cos(elapsed * 1.9) * 3.5 * dt));
        }
        mp.y = getGroundH(mp.x, mp.z);
      }
      if (mg.timeLeft <= 0) LS.finishMochiMiniGame();
    }

    // Cheetah Sprint Challenge Race update!
    if (LS.runtime.cheetahRace && LS.activeWorld && LS.activeWorld.cheetahObj && LS.activeWorld.cheetahTrack) {
      const cr = LS.runtime.cheetahRace;
      const tr = LS.activeWorld.cheetahTrack;
      const ch = LS.activeWorld.cheetahObj;
      const banner = document.getElementById('cheetah-banner');
      if (cr.phase === 'countdown') {
        cr.countdown -= dt;
        const n = Math.ceil(cr.countdown);
        if (banner) {
          banner.textContent = n > 0 ? ('🐆 Cheetah Sprint! Get Ready: ' + n + '...') : '🐆 GO!! Sprint to the Finish Arch! (Hold Shift / Run!)';
          banner.classList.remove('hidden');
        }
        ch.position.set(tr.start.x, 0, tr.start.z + 1.1);
        ch.rotation.y = tr.yaw;
        if (cr.countdown <= 0) {
          cr.phase = 'racing';
          LS.playSFX('coin');
          LS.showToast('🐆🏁 GO! Sprint through the golden gates to beat the Cheetah!');
        }
      } else if (cr.phase === 'racing') {
        cr.elapsed += dt;
        cr.cheetahProg = Math.min(1, cr.cheetahProg + dt / 4.8);
        const cx = tr.start.x + (tr.end.x - tr.start.x) * cr.cheetahProg;
        const cz = tr.start.z + 1.1 + (tr.end.z - tr.start.z) * cr.cheetahProg;
        const boundY = Math.abs(Math.sin(elapsed * 16)) * 0.42;
        ch.position.set(cx, boundY, cz);
        ch.rotation.y = tr.yaw;
        ch.rotation.x = Math.cos(elapsed * 16) * 0.14;

        const lp = leader.root.position;
        const playerDistToFinish = Math.hypot(lp.x - tr.end.x, lp.z - tr.end.z);
        if (banner) {
          banner.textContent = '🐆 Sprint to Finish: ' + Math.max(0, Math.round(playerDistToFinish)) + 'm • Time: ' + cr.elapsed.toFixed(1) + 's';
          banner.classList.remove('hidden');
        }
        if (playerDistToFinish < 3.2) {
          if (LS.finishCheetahRace) LS.finishCheetahRace(true, cr.elapsed);
        } else if (cr.cheetahProg >= 1.0 && cr.elapsed > 5.8) {
          if (LS.finishCheetahRace) LS.finishCheetahRace(false, cr.elapsed);
        }
      }
    }

    // Zone proximity check (from active leader!)
    let found = null;
    const zones = LS.activeWorld.zones || [];
    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      if (leader.root.position.distanceTo(z.pos) < z.radius) {
        found = z;
        break;
      }
    }
    if (!found && LS.chars.mochi && LS.chars.mochi.visible && leader.root.position.distanceTo(LS.chars.mochi.position) < 2.5) {
      found = { id: 'mochi', label: 'Play with Mochi (Fetch / Tag / Pet)' };
    }
    LS.runtime.nearZone = found;

    const prompt = document.getElementById('interact-prompt');
    const mobBtn = document.getElementById('btn-interact-mobile');
    if (found) {
      document.getElementById('interact-label').textContent = found.label;
      prompt.classList.remove('hidden');
      mobBtn.classList.remove('hidden');
    } else {
      prompt.classList.add('hidden');
      mobBtn.classList.add('hidden');
    }

    const zoneEl = document.getElementById('compass-zone');
    if (zoneEl && LS.activeWorld.getZoneLabel) {
      zoneEl.textContent = LS.activeWorld.getZoneLabel(leader.root.position.x, leader.root.position.z);
    }
  }

  function computeSafeCamDist(origin, dir, maxDist, meta) {
    let safeDist = maxDist;
    if (meta && meta.isInterior && meta.bounds) {
      const b = meta.bounds;
      if (dir.x > 1e-4) safeDist = Math.min(safeDist, (b.maxX - 0.15 - origin.x) / dir.x);
      else if (dir.x < -1e-4) safeDist = Math.min(safeDist, (b.minX + 0.15 - origin.x) / dir.x);
      if (dir.z > 1e-4) safeDist = Math.min(safeDist, (b.maxZ - 0.15 - origin.z) / dir.z);
      else if (dir.z < -1e-4) safeDist = Math.min(safeDist, (b.minZ + 0.15 - origin.z) / dir.z);
      if (dir.y > 1e-4) safeDist = Math.min(safeDist, (4.1 - origin.y) / dir.y);
      return Math.max(1.4, safeDist);
    }
    if (camOccluderBoxes.length > 0) {
      camRay.set(origin, dir);
      for (let i = 0; i < camOccluderBoxes.length; i++) {
        const box = camOccluderBoxes[i];
        if (box.containsPoint(origin)) continue;
        if (camRay.intersectBox(box, camRayHit)) {
          const hitDist = origin.distanceTo(camRayHit) - 0.38;
          if (hitDist < safeDist) safeDist = hitDist;
        }
      }
    }
    return Math.max(1.5, safeDist);
  }

  function updateCamera(dt, elapsed) {
    const laila = LS.chars.laila;
    const salma = LS.chars.salma;
    if (!laila) return;

    // Sweeping Studio Ghibli Title Screen Camera overlooking Laila & Salma running around!
    if (LS.runtime.titleScreenActive) {
      const cz = LS.state.currentWorld === 'home_neighborhood' ? 3.0 : 12.0;
      const t = (elapsed || 0) * 0.22;
      const cx = Math.sin(t) * 6.4;
      const camZ = cz + 10.2 + Math.cos(t) * 1.3;
      camera.position.set(cx, 3.25 + Math.sin(t * 1.3) * 0.22, camZ);
      camTarget.set(0, 1.35, cz - 2.0);
      camera.lookAt(camTarget);
      camSnapNext = true;
      return;
    }

    const leader = getLeader();
    const meta = LS.WORLDS[LS.state.currentWorld] || LS.WORLDS.home_neighborhood;
    const minDist = meta.isInterior ? 2.8 : 3.2;
    const maxDist = meta.isInterior ? 7.4 : 13.5;

    if (!LS.runtime.modalOpen && !LS.runtime.eating) {
      const yawKey = (keys['j'] || keys['['] ? 1 : 0) - (keys['l'] || keys[']'] ? 1 : 0);
      const pitchKey = (keys['k'] ? 1 : 0) - (keys['i'] ? 1 : 0);
      const zoomKey = (keys['-'] || keys['_'] ? 1 : 0) - (keys['='] || keys['+'] ? 1 : 0);
      if (yawKey !== 0 || pitchKey !== 0 || zoomKey !== 0) {
        if (LS.runtime.camMode !== 0) setCameraMode(0);
        targetCamYaw += yawKey * 2.15 * dt;
        targetCamPitch = Math.max(0.06, Math.min(1.12, targetCamPitch + pitchKey * 1.25 * dt));
        targetCamDist = Math.max(minDist, Math.min(maxDist, targetCamDist + zoomKey * 6.5 * dt));
        manualCamCooldown = 1.8;
      }
    }

    if (activePointers.size === 0 && manualCamCooldown > 0) {
      manualCamCooldown = Math.max(0, manualCamCooldown - dt);
    }

    if (LS.runtime.camMode === 0 && !LS.runtime.eating && !LS.runtime.modalOpen &&
        activePointers.size === 0 && manualCamCooldown <= 0 &&
        lastMoveInput.moving && Math.abs(lastMoveInput.x) > 0.15 && lastMoveInput.z < 0.72) {
      const followDelta = wrapAngleDelta(targetCamYaw, leader.root.rotation.y);
      const followRate = 0.95 + Math.min(1, Math.abs(lastMoveInput.x)) * 0.85;
      targetCamYaw += followDelta * Math.min(1, dt * followRate);
    }

    const damp = Math.min(1, dt * 12);
    camYaw += wrapAngleDelta(camYaw, targetCamYaw) * damp;
    camPitch += (targetCamPitch - camPitch) * damp;
    camDist += (targetCamDist - camDist) * damp;

    const p = leader.root.position;

    if (LS.runtime.eating && LS.runtime.eating.camPos) {
      camera.position.lerp(LS.runtime.eating.camPos, Math.min(1, dt * 8.5));
      camTarget.lerp(LS.runtime.eating.camLook, Math.min(1, dt * 10));
      camera.lookAt(camTarget);
      camSnapNext = false;
      return;
    }

    if (LS.runtime.safariRide && LS.activeWorld && LS.activeWorld.safariJeep) {
      const jp = LS.activeWorld.safariJeep.position;
      const jy = LS.activeWorld.safariJeep.rotation.y;
      _chasePos.set(
        jp.x - Math.sin(jy) * 7.8 + Math.cos(jy) * 3.4,
        jp.y + 4.2,
        jp.z - Math.cos(jy) * 7.8 - Math.sin(jy) * 3.4
      );
      _chaseLook.set(jp.x + Math.sin(jy) * 2.5, jp.y + 1.5, jp.z + Math.cos(jy) * 2.5);
      camera.position.lerp(_chasePos, Math.min(1, dt * 5.0));
      camTarget.lerp(_chaseLook, Math.min(1, dt * 7.0));
      camera.lookAt(camTarget);
      camSnapNext = false;
      return;
    }

    // Sweeping Aerial Sunrise Hot Air Balloon Panorama Camera!
    if (LS.runtime.balloonRide && LS.activeWorld && LS.activeWorld.hotAirBalloon) {
      const bp = LS.activeWorld.hotAirBalloon.position;
      const ang = LS.runtime.balloonRide.t * Math.PI * 1.4 + 0.55;
      _chasePos.set(bp.x + Math.sin(ang) * 14.5, bp.y + 6.8, bp.z + Math.cos(ang) * 14.5);
      _chaseLook.set(bp.x * 0.72, bp.y + 3.2, bp.z * 0.72 - 12.0);
      camera.position.lerp(_chasePos, Math.min(1, dt * 4.0));
      camTarget.lerp(_chaseLook, Math.min(1, dt * 5.5));
      camera.lookAt(camTarget);
      camSnapNext = false;
      return;
    }

    // Elevated Timber Ranger Watchtower 360-degree Panoramic Lookout Camera!
    if (LS.runtime.watchtowerTimer > 0 && LS.activeWorld && LS.activeWorld.watchtowerPos) {
      const wp = LS.activeWorld.watchtowerPos;
      const sweep = (1 - LS.runtime.watchtowerTimer / 6.0) * Math.PI * 2.0;
      _chasePos.set(wp.x + Math.sin(sweep) * 1.6, wp.y + 1.2, wp.z + Math.cos(sweep) * 1.6);
      _chaseLook.set(wp.x + Math.sin(sweep) * 24.0, 2.2, wp.z + Math.cos(sweep) * 24.0);
      camera.position.lerp(_chasePos, Math.min(1, dt * 4.5));
      camTarget.lerp(_chaseLook, Math.min(1, dt * 5.5));
      camera.lookAt(camTarget);
      camSnapNext = false;
      return;
    }

    if (LS.runtime.camMode === 1) {
      _fwd.set(Math.sin(laila.root.rotation.y), 0, Math.cos(laila.root.rotation.y));
      _frontPos.copy(p).addScaledVector(_fwd, 2.25);
      _frontPos.y += 1.32;
      _frontLook.set(p.x, p.y + 1.18, p.z);
      camera.position.lerp(_frontPos, Math.min(1, dt * 8.5));
      camTarget.lerp(_frontLook, Math.min(1, dt * 12));
      camera.lookAt(camTarget);
      camSnapNext = false;
      return;
    }

    if (LS.runtime.camMode === 2 && salma) {
      const sp = salma.root.position;
      _fwd.set(Math.sin(salma.root.rotation.y), 0, Math.cos(salma.root.rotation.y));
      _frontPos.copy(sp).addScaledVector(_fwd, 1.95);
      _frontPos.y += 1.1;
      _frontLook.set(sp.x, sp.y + 0.95, sp.z);
      camera.position.lerp(_frontPos, Math.min(1, dt * 8.5));
      camTarget.lerp(_frontLook, Math.min(1, dt * 12));
      camera.lookAt(camTarget);
      camSnapNext = false;
      return;
    }

    // Standard 3rd-person orbit: smooth pivot target + crisp circular arc + anti-clip spring arm!
    _desiredTarget.set(p.x, p.y + 1.25, p.z);
    if (camSnapNext) {
      camTarget.copy(_desiredTarget);
      effectiveCamDist = camDist;
      camSnapNext = false;
    } else {
      camTarget.lerp(_desiredTarget, Math.min(1, dt * 12));
    }

    camRayDir.set(
      -Math.sin(camYaw) * Math.cos(camPitch),
      Math.sin(camPitch),
      -Math.cos(camYaw) * Math.cos(camPitch)
    ).normalize();

    const safeDist = computeSafeCamDist(camTarget, camRayDir, camDist, meta);
    const armRate = safeDist < effectiveCamDist ? 18.0 : 5.5;
    effectiveCamDist += (safeDist - effectiveCamDist) * Math.min(1, dt * armRate);

    const camX = camTarget.x + camRayDir.x * effectiveCamDist;
    const camZ = camTarget.z + camRayDir.z * effectiveCamDist;
    const groundFloor = getGroundH(camX, camZ) + 0.55;
    const camY = Math.max(groundFloor, camTarget.y + camRayDir.y * effectiveCamDist + 0.15);

    camera.position.set(camX, camY, camZ);
    camera.lookAt(camTarget);
  }

  function updateMiniMap() {
    if (miniMapCompact || !LS.activeWorld || !LS.chars.laila) return;
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const mb = LS.WORLDS[LS.state.currentWorld].mapBounds;
    const toMapX = wx => ((wx - mb.minX) / (mb.maxX - mb.minX)) * W;
    const toMapY = wz => ((wz - mb.minZ) / (mb.maxZ - mb.minZ)) * H;

    if (miniMapBgCanvas) {
      ctx.drawImage(miniMapBgCanvas, 0, 0);
    } else if (LS.activeWorld.drawMiniMap) {
      LS.activeWorld.drawMiniMap(ctx, W, H, toMapX, toMapY);
    }

    if (LS.activeWorld.hiddenAnimals) {
      LS.activeWorld.hiddenAnimals.forEach(a => {
        if (a.found) return;
        const cx = toMapX(a.mesh.position.x);
        const cy = toMapY(a.mesh.position.z);
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.arc(cx, cy, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
    }

    if (LS.activeWorld.rideableBike && !LS.runtime.bikeRide) {
      const bp = LS.activeWorld.rideableBike.position;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(toMapX(bp.x), toMapY(bp.z), 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    const leader = getLeader();
    const companion = getCompanion();
    if (companion) {
      const sp = companion.root.position;
      ctx.fillStyle = LS.state.activeLeader === 'salma' ? '#e63946' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(toMapX(sp.x), toMapY(sp.z), 4.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    if (leader) {
      const lp = leader.root.position;
      const lx = toMapX(lp.x);
      const ly = toMapY(lp.z);
      const yaw = leader.root.rotation.y;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(-yaw);
      ctx.fillStyle = LS.state.activeLeader === 'salma' ? '#f59e0b' : '#e63946';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 6.2);
      ctx.lineTo(-4.5, -4.5);
      ctx.lineTo(0, -2.3);
      ctx.lineTo(4.5, -4.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  function initHDAtmosphere() {
    if (!LS.isHD) return;

    // 1. Procedural Sky PMREM Environment Map for realistic water, glass, ceramic & wood sheen (0 extra lights!)
    try {
      if (THREE.PMREMGenerator) {
        const pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        const envScene = new THREE.Scene();
        const envDome = new THREE.Mesh(
          new THREE.SphereGeometry(40, 20, 14),
          new THREE.MeshBasicMaterial({ map: LS.createSkyTexture(0, 'tokyo'), side: THREE.BackSide })
        );
        envScene.add(envDome);
        const envFloor = new THREE.Mesh(
          new THREE.CircleGeometry(38, 16),
          new THREE.MeshBasicMaterial({ color: 0x6ea35a })
        );
        envFloor.rotation.x = -Math.PI / 2;
        envFloor.position.y = -6;
        envScene.add(envFloor);
        scene.environment = pmrem.fromScene(envScene, 0.04).texture;
        pmrem.dispose();
      }
    } catch (e) {
      console.warn('[HD PMREM]', e);
    }

    // 2. Two-Tone Volumetric Shinkai Cumulus Clouds (sunlit cream crown + cool sky-lavender underside!)
    hdCloudsGroup = new THREE.Group();
    const cloudTopMat = new THREE.MeshBasicMaterial({ color: 0xfffdf8, transparent: true, opacity: 0.90 });
    const cloudBotMat = new THREE.MeshBasicMaterial({ color: 0xb8cee8, transparent: true, opacity: 0.84 });
    const cloudLayout = [
      [-65, 42, -78, 1.35], [22, 46, -92, 1.65], [88, 39, -58, 1.25],
      [-92, 37, 10, 1.2], [75, 43, 35, 1.45], [-25, 48, 62, 1.3], [10, 44, -22, 1.1]
    ];
    cloudLayout.forEach((c, idx) => {
      const cg = new THREE.Group();
      cg.position.set(c[0], c[1], c[2]);
      cg.scale.setScalar(c[3]);
      // Soft shaded cloud underside puffs
      [[-3.8, -1.6, 0.5, 3.8], [0.2, -1.5, 0.2, 4.7], [4.0, -1.4, -0.3, 3.8]].forEach(p => {
        const sp = new THREE.Mesh(new THREE.SphereGeometry(p[3], 12, 8), cloudBotMat);
        sp.scale.set(1.38, 0.54, 1.05);
        sp.position.set(p[0], p[1], p[2]);
        sp.userData.isCloudShadow = true;
        cg.add(sp);
      });
      // Sunlit billowing cream tops
      [[0, 0.4, 0, 5.2], [-4.4, -0.2, 0.7, 3.7], [4.5, -0.1, -0.4, 3.9], [-1.7, 2.5, -0.3, 3.6], [2.4, 2.1, 0.5, 3.3]].forEach(p => {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(p[3], 12, 10), cloudTopMat);
        puff.scale.set(1.28, 0.74, 1.0);
        puff.position.set(p[0], p[1], p[2]);
        cg.add(puff);
      });
      cg.userData = { speed: 0.45 + (idx % 3) * 0.22, baseY: c[1], phase: idx * 1.3 };
      hdCloudsGroup.add(cg);
    });
    scene.add(hdCloudsGroup);

    // 3. Soft Glowing Meadow Pollen / Fireflies (circular bokeh glow orb — never harsh squares!)
    const mCount = 95;
    const mGeo = new THREE.BufferGeometry();
    const mPos = new Float32Array(mCount * 3);
    for (let i = 0; i < mCount; i++) {
      mPos[i * 3] = -58 + Math.random() * 116;
      mPos[i * 3 + 1] = 0.6 + Math.random() * 4.5;
      mPos[i * 3 + 2] = -52 + Math.random() * 94;
    }
    mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));
    const moteC = document.createElement('canvas');
    moteC.width = 64; moteC.height = 64;
    const mctx = moteC.getContext('2d');
    const mg = mctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    mg.addColorStop(0, 'rgba(255,255,235,1)');
    mg.addColorStop(0.4, 'rgba(255,244,180,0.55)');
    mg.addColorStop(1, 'rgba(255,235,150,0)');
    mctx.fillStyle = mg; mctx.fillRect(0, 0, 64, 64);
    const mMat = new THREE.PointsMaterial({
      color: 0xfff8cc, size: 0.34, map: new THREE.CanvasTexture(moteC),
      transparent: true, opacity: 0.68,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    hdMotes = new THREE.Points(mGeo, mMat);
    scene.add(hdMotes);

    // 4. Gently Fluttering Sakura Cherry Blossom Petals drifting across Tokyo & Kyoto!
    const pCount = 72;
    const pGeo = new THREE.PlaneGeometry(0.16, 0.11);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffc8dc, side: THREE.DoubleSide, transparent: true, opacity: 0.86 });
    hdPetals = new THREE.InstancedMesh(pGeo, pMat, pCount);
    hdPetals.userData.items = [];
    const pDummy = new THREE.Object3D();
    for (let i = 0; i < pCount; i++) {
      const it = {
        x: -48 + Math.random() * 96,
        y: 1.2 + Math.random() * 8.5,
        z: -44 + Math.random() * 88,
        speedY: 0.42 + Math.random() * 0.38,
        driftX: 0.55 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2
      };
      hdPetals.userData.items.push(it);
      pDummy.position.set(it.x, it.y, it.z);
      pDummy.updateMatrix();
      hdPetals.setMatrixAt(i, pDummy.matrix);
    }
    hdPetals.instanceMatrix.needsUpdate = true;
    hdPetals.frustumCulled = false;
    scene.add(hdPetals);
  }

  const _petalDummy = new THREE.Object3D();

  function updateHDAtmosphere(dt, elapsed) {
    if (!LS.isHD) return;
    // Gently drift volumetric clouds
    if (hdCloudsGroup && hdCloudsGroup.visible) {
      hdCloudsGroup.children.forEach(cg => {
        cg.position.x += cg.userData.speed * dt;
        cg.position.y = cg.userData.baseY + Math.sin(elapsed * 0.25 + cg.userData.phase) * 0.5;
        if (cg.position.x > 125) cg.position.x = -125;
      });
    }
    // Gently float sunlit motes / fireflies
    if (hdMotes && hdMotes.visible) {
      const pos = hdMotes.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i) + Math.sin(elapsed * 0.7 + i * 1.7) * dt * 0.35;
        let y = pos.getY(i) + Math.cos(elapsed * 0.9 + i * 2.3) * dt * 0.18;
        if (y < 0.45) y = 4.5;
        if (y > 5.2) y = 0.8;
        pos.setXY(i, x, y);
      }
      pos.needsUpdate = true;
    }
    // Gently flutter 3D sakura petals on the breeze in Tokyo & Kyoto
    if (hdPetals && hdPetals.visible && hdPetals.userData.items) {
      const items = hdPetals.userData.items;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        it.x += (it.driftX + Math.sin(elapsed * 1.1 + it.phase) * 0.45) * dt;
        it.y -= it.speedY * dt;
        it.z += Math.cos(elapsed * 0.9 + it.phase) * 0.32 * dt;
        if (it.y < 0.15) {
          it.y = 8.8 + (i % 4) * 0.6;
          it.x = -46 + ((i * 19.3) % 92);
        }
        if (it.x > 52) it.x = -52;
        _petalDummy.position.set(it.x, it.y, it.z);
        _petalDummy.rotation.set(elapsed * 1.4 + it.phase, elapsed * 1.1 + it.phase, Math.sin(elapsed * 2.0 + it.phase) * 0.8);
        _petalDummy.updateMatrix();
        hdPetals.setMatrixAt(i, _petalDummy.matrix);
      }
      hdPetals.instanceMatrix.needsUpdate = true;
    }
    // Gently scroll flowing stream & lake water ripples
    const wTex = LS.getWaterTexture ? LS.getWaterTexture() : null;
    if (wTex) {
      wTex.offset.y = (wTex.offset.y - dt * 0.12) % 1;
    }
  }

  function applyQualitySettings(reloadWorld) {
    const qCfg = (LS.ghibli && LS.ghibli.getQualityConfig) ? LS.ghibli.getQualityConfig(LS.state.quality) : { maxDpr: 1.5, shadowSize: 1024, label: '⚖️ Balanced' };
    if (renderer) {
      const pr = Math.min(window.devicePixelRatio || 1, qCfg.maxDpr);
      renderer.setPixelRatio(pr);
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (LS.hdPost) {
        LS.hdPost.applyQuality(LS.state.quality);
        LS.hdPost.setSize(window.innerWidth, window.innerHeight, pr);
      }
    }
    const btn = document.getElementById('btn-graphics-mode');
    if (btn) {
      btn.textContent = qCfg.label;
      btn.title = 'Graphics Quality: ' + qCfg.label + ' (Tap to cycle High / Balanced / Lite for Android)';
      btn.classList.add('hd-active');
    }
    if (reloadWorld && LS.state.currentWorld) {
      const lead = getLeader();
      const pos = lead ? { x: lead.root.position.x, y: lead.root.position.y, z: lead.root.position.z, rotY: lead.root.rotation.y } : null;
      LS.loadWorld(LS.state.currentWorld, false, pos);
    }
  }

  function initGraphicsSwitcher() {
    document.body.classList.add('hd-mode');
    const badge = document.getElementById('hd-badge');
    if (badge) {
      badge.textContent = 'GHIBLI';
      badge.classList.remove('hidden');
    }
    const btn = document.getElementById('btn-graphics-mode');
    applyQualitySettings(false);
    if (btn) {
      btn.addEventListener('click', () => {
        const order = ['high', 'balanced', 'lite'];
        const nextIdx = (order.indexOf(LS.state.quality) + 1) % order.length;
        LS.state.quality = order[nextIdx];
        LS.saveState();
        applyQualitySettings(true);
        const qCfg = LS.ghibli.getQualityConfig(LS.state.quality);
        LS.showToast('🎨 Graphics Quality set to ' + qCfg.label + '!');
      });
    }
  }

  function init() {
    if (typeof THREE === 'undefined') {
      showError('Three.js failed to load. Please check your internet connection and reload.');
      return;
    }

    const qCfg = (LS.ghibli && LS.ghibli.getQualityConfig) ? LS.ghibli.getQualityConfig(LS.state.quality) : { maxDpr: 1.5, shadowSize: 1024 };

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcbe6f7, 58, 185);

    camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 340);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, qCfg.maxDpr));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    LS.maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 4);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // STRICT 4-LIGHT WEBGL BUDGET!
    hemiLight = new THREE.HemisphereLight(0xbbe2ff, 0x74855c, 0.72);
    scene.add(hemiLight);

    dirLight = new THREE.DirectionalLight(0xfff1d0, 1.24);
    dirLight.position.set(22, 38, 18);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = qCfg.shadowSize;
    dirLight.shadow.mapSize.height = qCfg.shadowSize;
    dirLight.shadow.bias = -0.00028;
    dirLight.shadow.normalBias = 0.025;
    scene.add(dirLight);

    streetLight = new THREE.PointLight(0xffd79a, 0.3, 30);
    streetLight.position.set(0, 5.2, -6);
    scene.add(streetLight);

    accentLight = new THREE.PointLight(0xffcf88, 0.4, 26);
    accentLight.position.set(-22.0, 3.6, -27.5);
    scene.add(accentLight);

    initHDAtmosphere();
    if (LS.hdPost) {
      LS.hdPost.init(renderer, scene, camera);
    }

    worldGroup = new THREE.Group();
    scene.add(worldGroup);

    initSparklesAndStars();
    LS.initCoreCharacters(scene);
    LS.initGameplayUI(scene);
    initGraphicsSwitcher();
    setupInputs();

    if (document.getElementById('title-screen')) {
      LS.runtime.titleScreenActive = true;
      document.body.classList.add('on-title-screen');
    } else {
      LS.runtime.titleScreenActive = false;
    }

    // Auto-collapse HUD card on narrow Android phone screens so >80% of the 3D world stays crystal clear!
    if (window.innerWidth <= 760) {
      const hudCard = document.getElementById('hud-left');
      if (hudCard && !localStorage.getItem('laila_salma_hud_collapsed')) {
        hudCard.classList.add('collapsed');
      }
    }

    const startWorld = LS.WORLDS[LS.state.currentWorld] && !LS.WORLDS[LS.state.currentWorld].isInterior
      ? LS.state.currentWorld : 'home_neighborhood';

    let animStarted = false;
    function animate() {
      requestAnimationFrame(animate);
      try {
        const dt = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.elapsedTime;
        updatePlayer(dt, elapsed);
        const leader = getLeader();
        if (leader) {
          LS.updateCharacters(dt, elapsed, leader.root.position);
        }
        if (LS.activeWorld && LS.activeWorld.update) {
          LS.activeWorld.update(dt, elapsed);
        }
        if (LS.tickGhibliMusic) LS.tickGhibliMusic(dt);
        if (LS.tickSafariAmbience) LS.tickSafariAmbience(dt);
        updateZoneBeacons(elapsed);
        updateHDAtmosphere(dt, elapsed);
        if (LS.hdPost && LS.hdPost.update) LS.hdPost.update(elapsed);
        updateSparklesAndStars(dt, elapsed);
        updateCamera(dt, elapsed);
        LS.updateHUD();
        updateMiniMap();
        if (!LS.hdPost || !LS.hdPost.render()) {
          renderer.render(scene, camera);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const bootWorld = () => {
      if (LS.refreshMochiHD) LS.refreshMochiHD();
      LS.loadWorld(startWorld, false);
      if (!animStarted) {
        animStarted = true;
        clock.getDelta();
        animate();
      }
    };

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (LS.hdPost) LS.hdPost.setSize(window.innerWidth, window.innerHeight, renderer.getPixelRatio());
    });

    if (LS.hdAssets && LS.hdAssets.preloadAll) {
      LS.hdAssets.preloadAll().then(bootWorld);
    } else {
      bootWorld();
    }
  }

  async function sha256Hex(str) {
    if (window.crypto && window.crypto.subtle) {
      const buf = new TextEncoder().encode(str);
      const hash = await window.crypto.subtle.digest('SHA-256', buf);
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return str;
  }

  function applyReleaseBranding() {
    const enabled = LS.getEnabledOutdoorWorlds ? LS.getEnabledOutdoorWorlds() : ['home_neighborhood', 'safari'];
    const taglineEl = document.querySelector('.title-tagline');
    if (taglineEl) {
      const parts = enabled.map(wid => {
        if (wid === 'tokyo') return '🇯🇵 Japan';
        const w = LS.WORLDS[wid];
        return w ? (w.emoji + ' ' + w.title) : wid;
      });
      taglineEl.textContent = (LS.isPreviewBuild && LS.isPreviewBuild() ? '🔧 PREVIEW BUILD • ' : '') + parts.join(' • ');
    }
    const prevBadge = document.getElementById('preview-mode-badge');
    if (prevBadge) prevBadge.classList.toggle('hidden', !(LS.isPreviewBuild && LS.isPreviewBuild()));
    if (LS.isPreviewBuild && LS.isPreviewBuild()) {
      document.title = '[PREVIEW] ' + document.title;
    }
  }

  function startGameSafely() {
    try {
      init();
    } catch (err) {
      showError(err && err.message ? err.message : String(err));
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    applyReleaseBranding();
    const cfg = LS.RELEASE_CONFIG;
    if (cfg && cfg.isPreview) {
      const storageKey = cfg.previewAuthStorageKey || 'laila_salma_preview_unlocked_v1';
      let alreadyUnlocked = false;
      try { alreadyUnlocked = localStorage.getItem(storageKey) === '1' || sessionStorage.getItem(storageKey) === '1'; } catch (e) {}
      if (!alreadyUnlocked) {
        const gate = document.getElementById('preview-gate-overlay');
        const form = document.getElementById('preview-gate-form');
        const input = document.getElementById('preview-gate-input');
        const rem = document.getElementById('preview-gate-remember');
        const errEl = document.getElementById('preview-gate-error');
        if (gate && form && input) {
          gate.classList.remove('hidden');
          setTimeout(() => { try { input.focus(); } catch (e) {} }, 80);
          form.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            const val = (input.value || '').trim();
            const digest = await sha256Hex(val);
            if (digest === cfg.previewPasscodeSha256) {
              try {
                sessionStorage.setItem(storageKey, '1');
                if (rem && rem.checked) localStorage.setItem(storageKey, '1');
              } catch (e) {}
              gate.classList.add('hidden');
              startGameSafely();
            } else {
              if (errEl) {
                errEl.textContent = 'Incorrect passcode — please try again.';
                errEl.classList.remove('hidden');
              }
              input.value = '';
              input.focus();
            }
          });
          return;
        }
      }
    }
    startGameSafely();
  });
})(window.LailaSalma);
