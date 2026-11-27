window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  /**
   * Animated HD-2D Studio Ghibli Watercolor Character System
   * Replaces procedural primitive bodies with hand-painted 4-direction watercolor
   * sprites (Front / Right / Left / Back) that react to real 3D scene lighting,
   * cast true alpha-masked silhouette shadows, and animate with Paper-Mario style
   * flip-eases, walk/run stride hops, squash-and-stretch, and sitting offsets.
   */
  LS.HD2D_ENABLED = true;

  // Cell dimensions of assets/ghibli_showcase/hd2d/*_strip.png: 4 cells of 512x720
  const STRIP_ASPECT = 512 / 720;

  LS.HD2D_CHARACTER_CONFIG = {
    laila:        { strip: 'assets/ghibli_showcase/hd2d/laila_strip.png',        height: 1.24, ready: true },
    salma:        { strip: 'assets/ghibli_showcase/hd2d/salma_strip.png',        height: 1.04, ready: true },
    mom:          { strip: 'assets/ghibli_showcase/hd2d/mom_strip.png',          height: 1.58, ready: true },
    dad:          { strip: 'assets/ghibli_showcase/hd2d/dad_strip.png',          height: 1.72, ready: true },
    gedo_mahmoud: { strip: 'assets/ghibli_showcase/hd2d/gedo_mahmoud_strip.png', height: 1.68, ready: true },
    nana_omaima:  { strip: 'assets/ghibli_showcase/hd2d/nana_omaima_strip.png',  height: 1.54, ready: true },
    bibo:         { strip: 'assets/ghibli_showcase/hd2d/bibo_strip.png',         height: 0.99, ready: true },
    nouzi:        { strip: 'assets/ghibli_showcase/hd2d/nouzi_strip.png',        height: 1.22, ready: true },
    mai:          { strip: 'assets/ghibli_showcase/hd2d/mai_strip.png',          height: 1.56, ready: true },
    mostafa:      { strip: 'assets/ghibli_showcase/hd2d/mostafa_strip.png',      height: 1.72, ready: true }
  };

  const textureLoader = new THREE.TextureLoader();
  const baseTextureCache = {};
  const activeHD2DRigs = new Set();
  const _worldPos = new THREE.Vector3();
  const _camPos = new THREE.Vector3();
  const _worldQuat = new THREE.Quaternion();
  const _worldEuler = new THREE.Euler(0, 0, 0, 'YXZ');

  function getStripTextureInstance(stripUrl) {
    // Share the decoded image across clones while giving each character its own UV offset!
    if (!baseTextureCache[stripUrl]) {
      const base = textureLoader.load(stripUrl);
      base.encoding = THREE.sRGBEncoding;
      base.minFilter = THREE.LinearMipmapLinearFilter;
      base.magFilter = THREE.LinearFilter;
      base.wrapS = THREE.ClampToEdgeWrapping;
      base.wrapT = THREE.ClampToEdgeWrapping;
      baseTextureCache[stripUrl] = base;
    }
    const base = baseTextureCache[stripUrl];
    const tex = base.clone();
    tex.image = base.image;
    tex.encoding = THREE.sRGBEncoding;
    tex.repeat.set(0.25, 1.0);
    tex.offset.set(0.0, 0.0);
    tex.needsUpdate = true;

    // Ensure cloned texture uploads once base image finishes loading
    if (!base.image) {
      const checkReady = () => {
        if (base.image) {
          tex.image = base.image;
          tex.needsUpdate = true;
        } else {
          setTimeout(checkReady, 60);
        }
      };
      setTimeout(checkReady, 60);
    }
    return tex;
  }

  /**
   * Create a standalone Animated HD-2D Character Rig (used both in-game and in showcase_hd2d.html).
   */
  LS.createHD2DRig = function (styleKey, opts) {
    const cfg = LS.HD2D_CHARACTER_CONFIG[styleKey];
    if (!cfg || !cfg.ready) return null;

    const options = opts || {};
    const heightM = options.height || cfg.height || 1.24;
    const widthM = heightM * STRIP_ASPECT;
    const tex = getStripTextureInstance(cfg.strip);

    const group = new THREE.Group();
    group.name = 'hd2d_rig_' + styleKey;

    const pivot = new THREE.Group();
    pivot.name = 'hd2d_billboard_pivot';
    group.add(pivot);

    const geo = new THREE.PlaneGeometry(widthM, heightM);
    // Shift geometry so local y = 0 sits right at the soles of the shoes (for clean squash-and-stretch!)
    geo.translate(0, heightM * 0.5, 0);

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.30,
      roughness: 0.94,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.userData.noOutline = true;
    mesh.userData.noCamClip = true;

    // True alpha-masked silhouette shadow so dresses, hair, and shoes cast exact shadows
    mesh.customDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: tex,
      alphaTest: 0.30
    });

    pivot.add(mesh);

    let currentCol = 0;       // 0: Front, 1: Right, 2: Left, 3: Back
    let flipTimer = 0;        // Paper-Mario quick card-turn squash when changing facing
    let walkPhase = Math.random() * Math.PI * 2;
    let mode = 'idle';
    let lastX = null;
    let lastZ = null;
    let smoothSpeed = 0;

    const rig = {
      styleKey,
      group,
      pivot,
      mesh,
      tex,
      heightM,
      setMode(m) {
        mode = m || 'idle';
      },
      getMode() {
        return mode;
      },
      getFacingCol() {
        return currentCol;
      },
      update(dt, elapsed, camera, externalSpeed) {
        const safeDt = Math.min(dt || 0.016, 0.05);
        const t = elapsed !== undefined ? elapsed : performance.now() * 0.001;

        // 1. Measure world position & automatic movement speed
        group.getWorldPosition(_worldPos);
        let speed = 0;
        if (externalSpeed !== undefined && externalSpeed !== null) {
          speed = externalSpeed;
        } else if (lastX !== null && safeDt > 0.0001) {
          const dist = Math.hypot(_worldPos.x - lastX, _worldPos.z - lastZ);
          speed = Math.min(8.0, dist / safeDt);
        }
        lastX = _worldPos.x;
        lastZ = _worldPos.z;
        smoothSpeed += (speed - smoothSpeed) * Math.min(1, safeDt * 12);

        // 2. Billboard Y cleanly toward camera & select Front / Right / Left / Back frame
        if (camera) {
          camera.getWorldPosition(_camPos);
          const dx = _camPos.x - _worldPos.x;
          const dz = _camPos.z - _worldPos.z;
          const camAngle = Math.atan2(dx, dz);

          // Determine parent's world Y rotation so billboard stays upright & camera-facing
          let parentYaw = 0;
          if (group.parent) {
            group.parent.getWorldQuaternion(_worldQuat);
            _worldEuler.setFromQuaternion(_worldQuat, 'YXZ');
            parentYaw = _worldEuler.y;
          }
          pivot.rotation.y = camAngle - parentYaw;

          // Relative angle between where character faces (parentYaw) and where camera looks from (camAngle)
          let rel = camAngle - parentYaw;
          while (rel > Math.PI) rel -= Math.PI * 2;
          while (rel < -Math.PI) rel += Math.PI * 2;

          let nextCol = 0;
          if (Math.abs(rel) < Math.PI * 0.28) nextCol = 0;       // Front (slightly generous front arc)
          else if (Math.abs(rel) > Math.PI * 0.74) nextCol = 3;  // Back
          else if (rel > 0) nextCol = 2;                         // Character facing Left relative to camera
          else nextCol = 1;                                      // Character facing Right relative to camera

          if (nextCol !== currentCol) {
            currentCol = nextCol;
            tex.offset.x = currentCol * 0.25;
            flipTimer = 0.12;
          }
        }

        // 3. Paper-Mario flip-ease on direction change
        let flipScaleX = 1.0;
        if (flipTimer > 0) {
          flipTimer = Math.max(0, flipTimer - safeDt);
          const u = flipTimer / 0.12; // 1 -> 0
          flipScaleX = 1.0 - Math.sin(u * Math.PI) * 0.36;
        }

        // 4. Expressive Studio Ghibli storybook motion (Walk / Run / Sit / Wave / Idle)
        const isSittingChair = mode === 'chair_sit' || mode === 'sit';
        const isSittingFloor = mode === 'floor_sit';
        const isWalking = smoothSpeed > 0.22 || mode === 'walk' || mode === 'run';
        const isRunning = smoothSpeed > 3.1 || mode === 'run';

        let posY = 0;
        let tiltZ = 0;
        let sx = flipScaleX;
        let sy = 1.0;

        if (isSittingChair) {
          posY = -heightM * 0.17;
          sy = 0.94 + Math.sin(t * 2.0) * 0.008;
          sx = flipScaleX * 1.03;
          tiltZ = Math.sin(t * 1.5) * 0.014;
        } else if (isSittingFloor) {
          posY = -heightM * 0.26;
          sy = 0.90 + Math.sin(t * 2.0) * 0.008;
          sx = flipScaleX * 1.04;
        } else if (isWalking) {
          const strideRate = isRunning ? 13.5 : 9.4;
          walkPhase += safeDt * strideRate;
          const hop = Math.abs(Math.sin(walkPhase));
          const stride = Math.sin(walkPhase);
          posY = hop * (isRunning ? 0.095 : 0.062);
          tiltZ = stride * (isRunning ? 0.075 : 0.052);
          // Subtle bouncy squash at foot plant, gentle stretch at hop apex
          const stretch = (hop - 0.5) * (isRunning ? 0.065 : 0.042);
          sy = 1.0 + stretch;
          sx = flipScaleX * (1.0 - stretch * 0.55);
        } else {
          // Gentle alive breathing + subtle warm storybook sway
          const breath = Math.sin(t * 2.3 + (styleKey.length * 0.7));
          sy = 1.0 + breath * 0.011;
          sx = flipScaleX * (1.0 - breath * 0.005);
          tiltZ = Math.sin(t * 1.4 + styleKey.length) * 0.012;
        }

        mesh.position.y = posY;
        mesh.rotation.z = tiltZ;
        mesh.scale.set(sx, sy, 1);
      },
      dispose() {
        activeHD2DRigs.delete(rig);
        geo.dispose();
        mat.dispose();
        mesh.customDepthMaterial.dispose();
        tex.dispose();
      }
    };

    return rig;
  };

  /**
   * Attach an Animated HD-2D Watercolor rig onto an existing LS.createAnimeCharacter object.
   * Preserves root transforms, contact shadows, speech bubbles, and collisions seamlessly.
   */
  LS.attachHD2DIfConfigured = function (charObj, portraitStyle) {
    if (!LS.HD2D_ENABLED || !charObj || !charObj.root || !portraitStyle) return null;
    if (charObj.glbRig) return null; // Never override an active .glb rig
    const cfg = LS.HD2D_CHARACTER_CONFIG[portraitStyle];
    if (!cfg || !cfg.ready) return null;

    const rig = LS.createHD2DRig(portraitStyle, { height: cfg.height });
    if (!rig) return null;

    // Compensate for root.scale so every character renders at their exact real-world meter height
    const rootScale = charObj.root.scale.x > 0.01 ? charObj.root.scale.x : 1.0;
    rig.group.scale.setScalar(1.0 / rootScale);
    charObj.root.add(rig.group);

    if (charObj.bodyPivot) {
      charObj.bodyPivot.visible = false;
    }

    charObj.hd2dRig = rig;
    charObj.hd2dStyle = portraitStyle;
    activeHD2DRigs.add(rig);
    return rig;
  };

  /**
   * Update every active in-game HD-2D character against the live scene camera.
   */
  LS.updateHD2DCharacters = function (dt, elapsed, camera) {
    const cam = camera || (LS.getCamera ? LS.getCamera() : null);
    activeHD2DRigs.forEach(rig => {
      if (rig && rig.group && rig.group.parent) {
        rig.update(dt, elapsed, cam);
      } else {
        activeHD2DRigs.delete(rig);
      }
    });
  };
})(window.LailaSalma);
