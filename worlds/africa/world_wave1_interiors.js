window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  // =========================================================================
  // WAVE 1 — AFRICA INTERIORS (Studio Ghibli Edition)
  // 1) egypt_chamber  — Golden Pyramid Chamber (Torch-lit Royal Vault!)
  // 2) marrakech_riad — Moroccan Riad Rooftop Suite (Live 3D Decor Terrace!)
  // Strictly ZERO extra WebGL lights (uses engine's 4-light Ghibli rig).
  // =========================================================================

  function makeCanvasTex(w, h, drawFn, repX, repY) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    drawFn(c.getContext('2d'), w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if (repX || repY) tex.repeat.set(repX || 1, repY || 1);
    tex.anisotropy = 8;
    tex.encoding = THREE.sRGBEncoding;
    tex.needsUpdate = true;
    return tex;
  }

  function createChamberFloorTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#e6c585';
      ctx.fillRect(0, 0, w, h);
      const tile = 64;
      for (let r = 0; r < h / tile; r++) {
        for (let c = 0; c < w / tile; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#edd096' : '#dcba78';
          ctx.fillRect(c * tile + 2, r * tile + 2, tile - 4, tile - 4);
          ctx.strokeStyle = 'rgba(154, 102, 42, 0.35)';
          ctx.lineWidth = 2;
          ctx.strokeRect(c * tile + 2, r * tile + 2, tile - 4, tile - 4);
        }
      }
      // Gold & lapis lotus rosette accents
      for (let y = 64; y < h; y += 128) {
        for (let x = 64; x < w; x += 128) {
          ctx.fillStyle = '#1f4f94';
          ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#f6c945';
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
        }
      }
    }, 3, 3);
  }

  function createChamberMuralTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#e5c17d';
      ctx.fillRect(0, 0, w, h);
      const bandCols = ['#1f4e8c', '#1fa6a6', '#c84b31', '#f4c44e'];
      for (let i = 0; i < 16; i++) {
        ctx.fillStyle = bandCols[i % 4];
        ctx.fillRect(i * 32, 0, 30, 34);
        ctx.fillRect(i * 32, h - 34, 30, 34);
      }
      ctx.strokeStyle = '#9c6826';
      ctx.lineWidth = 4;
      [44, 185, 326, 466].forEach(y => {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      });
      ctx.font = 'bold 52px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const rows = [
        ['☀️', '☥', '🪲', '👁️', '🪷'],
        ['🐱', '🔺', '☀️', '🌊', '☥'],
        ['🦅', '🪷', '🪲', '🐱', '☀️']
      ];
      const cols = ['#1d4e89', '#198d8d', '#b83d27', '#8a5a18'];
      rows.forEach((row, r) => {
        const cy = 114 + r * 140;
        row.forEach((sym, c) => {
          const cx = 56 + c * 100;
          ctx.strokeStyle = '#f4c44e';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(cx - 32, cy - 40, 64, 80, 20);
          ctx.stroke();
          ctx.fillStyle = cols[(r + c) % cols.length];
          ctx.fillText(sym, cx, cy + 2);
        });
      });
    }, 2, 1);
  }

  function createZelligeTerraceTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#f3e3c6';
      ctx.fillRect(0, 0, w, h);
      const s = 64;
      for (let r = 0; r < h / s; r++) {
        for (let c = 0; c < w / s; c++) {
          const x = c * s, y = r * s;
          ctx.fillStyle = (r + c) % 2 === 0 ? '#f7ebd4' : '#ebd3ae';
          ctx.fillRect(x + 2, y + 2, s - 4, s - 4);
          ctx.fillStyle = (r + c) % 2 === 0 ? '#1f5692' : '#1e8a7a';
          ctx.beginPath();
          ctx.moveTo(x + s / 2, y + 10);
          ctx.lineTo(x + s - 10, y + s / 2);
          ctx.lineTo(x + s / 2, y + s - 10);
          ctx.lineTo(x + 10, y + s / 2);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#f4be44';
          ctx.beginPath();
          ctx.arc(x + s / 2, y + s / 2, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }, 3, 3);
  }

  function createRiadRugTex(primaryHex, accentHex) {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = primaryHex || '#1f5692';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = accentHex || '#f4be44';
      ctx.lineWidth = 18;
      ctx.strokeRect(22, 22, w - 44, h - 44);
      ctx.strokeStyle = '#fff8e7';
      ctx.lineWidth = 6;
      ctx.strokeRect(46, 46, w - 92, h - 92);
      // Berber geometric diamonds across the rug
      for (let y = 110; y <= h - 110; y += 96) {
        for (let x = 110; x <= w - 110; x += 96) {
          ctx.fillStyle = accentHex || '#f4be44';
          ctx.beginPath();
          ctx.moveTo(x, y - 28); ctx.lineTo(x + 28, y); ctx.lineTo(x, y + 28); ctx.lineTo(x - 28, y);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#fff8e7';
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
        }
      }
    }, 1, 1);
  }

  // =========================================================================
  // 1. GOLDEN PYRAMID CHAMBER (`egypt_chamber`)
  // =========================================================================
  LS.registerWorld('egypt_chamber', {
    build: function (worldGroup) {
      const W = {
        id: 'egypt_chamber',
        isInterior: true,
        skyMesh: null,
        colliders: [],
        zones: [],
        hiddenAnimals: [],
        torches: [],
        scarabGem: null,
        guardianCat: null,
        chestLid: null,
        mochiStartPos: new THREE.Vector3(2.8, 0, 2.5)
      };

      function addCollider(x, z, hw, hd) {
        W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
      }

      const floorMat = LS.makeSurfaceMat(createChamberFloorTex(), { roughness: 0.78 });
      const muralMat = LS.makeSurfaceMat(createChamberMuralTex(), { roughness: 0.80 });
      const sandstoneMat = LS.makeToonMat(0xdcb472);
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xf6c945, roughness: 0.25, metalness: 0.6 });
      const lapisMat = LS.makeToonMat(0x1f4f94);
      const turqMat = LS.makeToonMat(0x1ea3a3);

      // Warm torchlit interior backdrop dome
      W.skyMesh = new THREE.Mesh(
        new THREE.SphereGeometry(55, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0x3b2615, side: THREE.BackSide, fog: false })
      );
      worldGroup.add(W.skyMesh);

      // Chamber floor (13.6m wide x 12.2m deep)
      const floor = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.24, 12.6), floorMat);
      floor.position.y = -0.12;
      floor.receiveShadow = true;
      worldGroup.add(floor);

      // Painted Hieroglyph Sandstone Walls (North, West, East + South framing)
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(14.0, 5.8, 0.35), muralMat);
      backWall.position.set(0, 2.9, -6.1);
      backWall.receiveShadow = true;
      worldGroup.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.8, 12.6), muralMat);
      leftWall.position.set(-6.85, 2.9, 0);
      leftWall.receiveShadow = true;
      worldGroup.add(leftWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.8, 12.6), muralMat);
      rightWall.position.set(6.85, 2.9, 0);
      rightWall.receiveShadow = true;
      worldGroup.add(rightWall);

      // Sloped Golden Pyramid Ceiling Vault
      const vault = new THREE.Mesh(new THREE.ConeGeometry(10.5, 4.4, 4), sandstoneMat);
      vault.rotation.y = Math.PI / 4;
      vault.position.set(0, 7.6, 0);
      worldGroup.add(vault);

      // 4 Fluted Papyrus-Bud Columns with Gold Bands
      [[-4.4, -3.4], [4.4, -3.4], [-4.4, 2.6], [4.4, 2.6]].forEach(cp => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.50, 5.2, 16), sandstoneMat);
        col.position.set(cp[0], 2.6, cp[1]);
        col.castShadow = true;
        worldGroup.add(col);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.42, 0.72, 16), turqMat);
        cap.position.set(cp[0], 5.35, cp[1]);
        worldGroup.add(cap);
        const band = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.06, 8, 18), goldMat);
        band.rotation.x = Math.PI / 2;
        band.position.set(cp[0], 4.85, cp[1]);
        worldGroup.add(band);
        addCollider(cp[0], cp[1], 0.65, 0.65);
      });

      // 6 Glowing Wall Torches (Emissive flames + glow sprite halos — 0 extra WebGL lights!)
      const torchPositions = [
        [-6.45, 2.6, -3.2], [-6.45, 2.6, 2.2],
        [6.45, 2.6, -3.2], [6.45, 2.6, 2.2],
        [-3.2, 2.9, -5.75], [3.2, 2.9, -5.75]
      ];
      torchPositions.forEach((tp, idx) => {
        const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.65, 8), goldMat);
        holder.position.set(tp[0], tp[1] - 0.3, tp[2]);
        worldGroup.add(holder);
        const flame = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 10, 8),
          LS.makeEmissiveMat(0xfff4b0, 0xff922b, 1.0)
        );
        flame.scale.set(0.85, 1.45, 0.85);
        flame.position.set(tp[0], tp[1] + 0.14, tp[2]);
        worldGroup.add(flame);
        let halo = null;
        if (LS.createGlowSprite) {
          halo = LS.createGlowSprite(0xffbe55, 2.2);
          halo.position.copy(flame.position);
          worldGroup.add(halo);
        }
        W.torches.push({ flame, halo, phase: idx * 1.1 });
      });

      // Royal Lapis Dais & Gleaming Pharaoh's Golden Treasure Chest (North Center!)
      const dais = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.38, 3.2), lapisMat);
      dais.position.set(0, 0.19, -3.8);
      dais.receiveShadow = true;
      worldGroup.add(dais);
      const daisTrim = new THREE.Mesh(new THREE.BoxGeometry(5.76, 0.10, 3.36), goldMat);
      daisTrim.position.set(0, 0.38, -3.8);
      worldGroup.add(daisTrim);

      const chestGroup = new THREE.Group();
      chestGroup.position.set(0, 0.42, -3.8);
      const chestBase = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.82, 1.15), goldMat);
      chestBase.position.y = 0.41;
      chestBase.castShadow = true;
      chestGroup.add(chestBase);
      const chestBand = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.16, 1.22), lapisMat);
      chestBand.position.y = 0.66;
      chestGroup.add(chestBand);
      // Open tilted lid revealing sparkling jewels & golden scarab!
      const lidPivot = new THREE.Group();
      lidPivot.position.set(0, 0.82, -0.56);
      lidPivot.rotation.x = -0.62;
      const lid = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.24, 1.18), goldMat);
      lid.position.set(0, 0.12, 0.56);
      lidPivot.add(lid);
      chestGroup.add(lidPivot);
      W.chestLid = lidPivot;

      // Sparkling turquoise, ruby & emerald treasure gems piled inside
      const gemCols = [0x22d3ee, 0xfb7185, 0x34d399, 0xfacc15, 0x60a5fa];
      for (let g = 0; g < 10; g++) {
        const gem = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.14, 0),
          LS.makeEmissiveMat(gemCols[g % 5], gemCols[g % 5], 0.8)
        );
        gem.position.set(-0.52 + (g % 5) * 0.26, 0.90 + Math.floor(g / 5) * 0.12, -0.18 + Math.floor(g / 5) * 0.34);
        chestGroup.add(gem);
      }
      if (LS.createGlowSprite) {
        const chestGlow = LS.createGlowSprite(0xffe066, 2.8);
        chestGlow.position.set(0, 1.25, 0);
        chestGroup.add(chestGlow);
      }
      worldGroup.add(chestGroup);
      addCollider(0, -3.8, 2.4, 1.4);

      // Twin Golden Winged Scarab Statues on Lapis Pedestals
      [-2.1, 2.1].forEach(sx => {
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.05, 12), lapisMat);
        ped.position.set(sx, 0.92, -4.1);
        worldGroup.add(ped);
        const scarab = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 10), goldMat);
        scarab.scale.set(0.85, 0.65, 1.25);
        scarab.position.set(sx, 1.62, -4.1);
        worldGroup.add(scarab);
      });

      // Smiling Royal Guardian Mau Cat resting on a crimson velvet pillow!
      const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.64, 0.22, 16), LS.makeToonMat(0xc83e37));
      cushion.position.set(2.8, 0.11, -1.6);
      worldGroup.add(cushion);
      if (LS.createCatModel) {
        const gCat = LS.createCatModel(0xe6d3b3, 0x7c6449);
        gCat.root.position.set(2.8, 0.22, -1.6);
        gCat.root.rotation.y = -0.65;
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.032, 8, 16), LS.makeEmissiveMat(0x22c7c7, 0xffd166, 0.5));
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, 0.34, 0.16);
        gCat.root.add(collar);
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Guardian Bastet 🐱👑', 'Purr~ Welcome to the Golden Pyramid Chamber, brave explorers! ✨');
          sb.position.set(0, 1.45, 0);
          gCat.root.add(sb);
        }
        worldGroup.add(gCat.root);
        W.guardianCat = gCat;
      }

      // Chamber Hieroglyph Pedestal on the West side
      const hPed = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.72, 1.08, 16), turqMat);
      hPed.position.set(-3.2, 0.54, -0.6);
      worldGroup.add(hPed);
      const hOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), LS.makeEmissiveMat(0x5ef5ed, 0x22d3ee, 0.9));
      hOrb.position.set(-3.2, 1.42, -0.6);
      worldGroup.add(hOrb);
      W.scarabGem = hOrb;
      addCollider(-3.2, -0.6, 0.75, 0.75);

      // Chamber Title Banner on Back Wall
      const banner = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 1.05, 0.16),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture('👑 GOLDEN PYRAMID CHAMBER ✨', {
            bg: '#1c4478', border: '#f6c945', color: '#fff8db', font: 'bold 34px sans-serif', width: 640, height: 100
          })
        })
      );
      banner.position.set(0, 4.35, -5.82);
      worldGroup.add(banner);

      // Glowing South Exit Arch back to Ancient Egypt
      const exitMat = LS.makeEmissiveMat(0xffe9a3, 0xffb703, 0.65);
      const exitPad = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.5), exitMat);
      exitPad.rotation.x = -Math.PI / 2;
      exitPad.position.set(0, 0.04, 5.25);
      worldGroup.add(exitPad);

      // Room wall colliders
      addCollider(0, -6.2, 7.2, 0.6);
      addCollider(-6.9, 0, 0.6, 6.6);
      addCollider(6.9, 0, 0.6, 6.6);
      addCollider(0, 6.3, 7.2, 0.6);

      W.zones.push(
        { id: 'egypt_treasure_chest', label: "Open the Pharaoh's Golden Treasure Chest 👑💎", pos: new THREE.Vector3(0, 0, -2.0), radius: 2.6 },
        { id: 'egypt_hieroglyphs', label: 'Decode the Chamber Hieroglyph Altar 🔺📜', pos: new THREE.Vector3(-2.6, 0, 0.4), radius: 2.4 },
        { id: 'exit_interior', label: 'Step Back Outside to Ancient Egypt ☀️🚪', pos: new THREE.Vector3(0, 0, 5.1), radius: 2.3 }
      );

      W.getZoneLabel = function () { return 'Golden Pyramid Chamber 👑✨'; };

      W.update = function (dt, elapsed) {
        W.torches.forEach(t => {
          const fl = 1.0 + Math.sin(elapsed * 9.5 + t.phase) * 0.14;
          t.flame.scale.set(0.85 * fl, 1.45 * fl, 0.85 * fl);
          if (t.halo) t.halo.scale.setScalar(2.1 + Math.sin(elapsed * 7.2 + t.phase) * 0.25);
        });
        if (W.scarabGem) {
          W.scarabGem.rotation.y += dt * 1.4;
          W.scarabGem.position.y = 1.42 + Math.sin(elapsed * 2.4) * 0.12;
        }
        if (W.guardianCat && W.guardianCat.tail) {
          W.guardianCat.tail.rotation.z = Math.sin(elapsed * 3.2) * 0.3;
        }
      };

      W.drawMiniMap = function (ctx, cw, ch) {
        ctx.fillStyle = '#c89b52';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#1f4f94';
        ctx.fillRect(cw * 0.28, ch * 0.14, cw * 0.44, ch * 0.18);
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff7d6';
        ctx.fillText('👑 TREASURE', cw * 0.5, ch * 0.26);
        ctx.fillText('🚪 EXIT', cw * 0.5, ch * 0.88);
      };

      return W;
    }
  });

  // =========================================================================
  // 2. MOROCCAN RIAD ROOFTOP SUITE (`marrakech_riad`) — Live 3D Decorator!
  // =========================================================================
  LS.registerWorld('marrakech_riad', {
    build: function (worldGroup) {
      const W = {
        id: 'marrakech_riad',
        isInterior: true,
        isOpenRooftop: true,
        skyMesh: null,
        colliders: [],
        zones: [],
        hiddenAnimals: [],
        riadRugMesh: null,
        riadCushionMeshes: [],
        riadLanternMeshes: [],
        riadLanternHalos: [],
        lanternPivots: [],
        fountainDrops: [],
        mochiStartPos: new THREE.Vector3(3.2, 0, 2.4)
      };

      function addCollider(x, z, hw, hd) {
        W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
      }

      // Open-Air Marrakech Sunset / Sunlit Sky Dome!
      W.skyMesh = new THREE.Mesh(
        new THREE.SphereGeometry(210, 28, 18),
        new THREE.MeshBasicMaterial({
          map: LS.createSkyTexture(LS.state.timeMode, 'marrakech'),
          side: THREE.BackSide,
          fog: false
        })
      );
      worldGroup.add(W.skyMesh);

      const terraceMat = LS.makeSurfaceMat(createZelligeTerraceTex(), { roughness: 0.72 });
      const plasterMat = LS.makeToonMat(0xdc8866);
      const creamMat = LS.makeToonMat(0xf8e9d2);
      const cedarMat = LS.makeToonMat(0x7c4829);
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.28, metalness: 0.65 });
      const cobaltMat = LS.makeToonMat(0x1f5692);

      // Rooftop Zellige Terrace Floor (14.4m wide x 12.6m deep)
      const floor = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.3, 12.8), terraceMat);
      floor.position.y = -0.15;
      floor.receiveShadow = true;
      worldGroup.add(floor);

      // Low Carved Terracotta Parapet Walls overlooking Marrakech & the Atlas Mountains!
      const northWall = new THREE.Mesh(new THREE.BoxGeometry(14.6, 1.15, 0.45), plasterMat);
      northWall.position.set(0, 0.58, -6.2); worldGroup.add(northWall);
      const northCap = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.14, 0.56), creamMat);
      northCap.position.set(0, 1.2, -6.2); worldGroup.add(northCap);

      [-7.1, 7.1].forEach(wx => {
        const sw = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.15, 12.8), plasterMat);
        sw.position.set(wx, 0.58, 0); worldGroup.add(sw);
        const sc = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.14, 12.9), creamMat);
        sc.position.set(wx, 1.2, 0); worldGroup.add(sc);
      });

      // Decorative Moroccan Pergola Pillars & Overhead Cedar Beams supporting glowing lanterns
      [[-6.2, -5.4], [6.2, -5.4], [-6.2, 5.2], [6.2, 5.2]].forEach(p => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 4.4, 14), creamMat);
        col.position.set(p[0], 2.2, p[1]); col.castShadow = true; worldGroup.add(col);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.68), cobaltMat);
        cap.position.set(p[0], 4.45, p[1]); worldGroup.add(cap);
      });
      [-2.8, 0.2, 3.2].forEach(bz => {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.18, 0.22), cedarMat);
        beam.position.set(0, 4.48, bz); worldGroup.add(beam);
      });
      [-6.2, 6.2].forEach(bx => {
        const sideBeam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 11.2), cedarMat);
        sideBeam.position.set(bx, 4.48, -0.1); worldGroup.add(sideBeam);
      });

      // Distant Ghibli Panorama: Marrakech Medina Rooftops, Koutoubia Minaret & Snow-Dusted Atlas Mountains!
      const atlasMat = LS.makeToonMat(0x8e7aa8);
      const snowMat = LS.makeToonMat(0xfff5ec);
      [[-45, -75, 24, 20], [-12, -88, 30, 26], [24, -82, 26, 22], [58, -74, 22, 18]].forEach(m => {
        const peak = new THREE.Mesh(new THREE.ConeGeometry(m[2], m[3], 6), atlasMat);
        peak.position.set(m[0], m[3] * 0.5 - 6, m[1]);
        worldGroup.add(peak);
        const snow = new THREE.Mesh(new THREE.ConeGeometry(m[2] * 0.34, m[3] * 0.34, 6), snowMat);
        snow.position.set(m[0], m[3] * 0.83 - 6, m[1]);
        worldGroup.add(snow);
      });
      // Distant Koutoubia Minaret silhouette on the North-West skyline
      const kMin = new THREE.Group();
      kMin.position.set(-18, -8, -42);
      const kShaft = new THREE.Mesh(new THREE.BoxGeometry(4.6, 22, 4.6), LS.makeToonMat(0xd47d5a));
      kShaft.position.y = 11; kMin.add(kShaft);
      const kLantern = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.4, 2.6), LS.makeToonMat(0xe29774));
      kLantern.position.y = 24.2; kMin.add(kLantern);
      const kDome = new THREE.Mesh(new THREE.SphereGeometry(1.3, 12, 10), brassMat);
      kDome.position.y = 27.2; kMin.add(kDome);
      worldGroup.add(kMin);
      // Warm glowing Medina rooftops below the terrace
      for (let i = 0; i < 14; i++) {
        const ang = -Math.PI * 0.85 + (i / 13) * Math.PI * 0.7;
        const dist = 26 + (i % 3) * 8;
        const house = new THREE.Mesh(
          new THREE.BoxGeometry(5 + (i % 3) * 2, 7 + (i % 4) * 2, 5 + ((i + 1) % 3) * 2),
          LS.makeToonMat(i % 2 === 0 ? 0xd98462 : 0xe5a47d)
        );
        house.position.set(Math.sin(ang) * dist, -5.5, -Math.cos(ang) * dist);
        worldGroup.add(house);
      }

      // Customizable Center Carpet (Updates live with W.applyRiadDecor!)
      const rugMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(7.2, 5.4),
        LS.makeSurfaceMat(createRiadRugTex('#1f5692', '#f4be44'), { roughness: 0.88 })
      );
      rugMesh.rotation.x = -Math.PI / 2;
      rugMesh.position.set(0, 0.04, -0.5);
      rugMesh.receiveShadow = true;
      worldGroup.add(rugMesh);
      W.riadRugMesh = rugMesh;

      // Hammered Brass Tea Table & Silver Moroccan Mint Teapot
      const teaTable = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.05, 0.56, 20), brassMat);
      teaTable.position.set(0, 0.28, -0.5);
      teaTable.castShadow = true;
      worldGroup.add(teaTable);
      const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), LS.makeToonMat(0xe2e8f0));
      teapot.position.set(-0.32, 0.76, -0.45);
      worldGroup.add(teapot);
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.08, 16), LS.makeToonMat(0xfff4d8));
      plate.position.set(0.35, 0.60, -0.55);
      worldGroup.add(plate);
      addCollider(0, -0.5, 1.35, 1.35);

      // 4 Customizable Plush Moroccan Velvet Floor Poufs!
      [[-2.2, -0.5], [2.2, -0.5], [0, -2.5], [0, 1.5]].forEach(pp => {
        const poufMat = LS.makeToonMat(0xf4be44);
        const pouf = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.60, 0.34, 18), poufMat);
        pouf.position.set(pp[0], 0.17, pp[1]);
        pouf.castShadow = true;
        worldGroup.add(pouf);
        W.riadCushionMeshes.push(pouf);
      });

      // 5 Customizable Overhead Stained-Glass Brass Lanterns!
      const lanternSpots = [[-3.6, -2.8], [0, -2.8], [3.6, -2.8], [-2.4, 0.2], [2.4, 0.2]];
      lanternSpots.forEach((lp, idx) => {
        const piv = new THREE.Group();
        piv.position.set(lp[0], 4.42, lp[1]);
        const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 6), brassMat);
        chain.position.y = -0.45;
        piv.add(chain);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.30, 0.28, 6), brassMat);
        cap.position.y = -0.95;
        piv.add(cap);
        const glassMat = LS.makeEmissiveMat(0xffd166, 0xffb703, 0.95);
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.52, 6), glassMat);
        glass.position.y = -1.32;
        piv.add(glass);
        W.riadLanternMeshes.push(glass);
        if (LS.createGlowSprite) {
          const halo = LS.createGlowSprite(0xffb703, 2.0);
          halo.position.set(0, -1.32, 0);
          piv.add(halo);
          W.riadLanternHalos.push(halo);
        }
        worldGroup.add(piv);
        W.lanternPivots.push({ piv, phase: idx * 0.95 });
      });

      // Potted Seville Orange Trees in the 4 Corners
      const leafMat = LS.makeToonMat(0x2f8545);
      const orangeMat = LS.makeToonMat(0xff8c24);
      [[-5.2, -4.4], [5.2, -4.4], [-5.2, 4.2], [5.2, 4.2]].forEach(tp => {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.36, 0.65, 12), cobaltMat);
        pot.position.set(tp[0], 0.33, tp[1]); worldGroup.add(pot);
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 1.3, 8), cedarMat);
        trunk.position.set(tp[0], 1.25, tp[1]); worldGroup.add(trunk);
        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.76, 14, 10), leafMat);
        crown.position.set(tp[0], 2.15, tp[1]); crown.castShadow = true; worldGroup.add(crown);
        for (let o = 0; o < 5; o++) {
          const ang = (o / 5) * Math.PI * 2;
          const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), orangeMat);
          fruit.position.set(tp[0] + Math.cos(ang) * 0.68, 2.1 + (o % 2) * 0.25, tp[1] + Math.sin(ang) * 0.68);
          worldGroup.add(fruit);
        }
        addCollider(tp[0], tp[1], 0.65, 0.65);
      });

      // Rooftop Sign Banner
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(6.6, 0.9, 0.14),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture('🕌 MARRAKECH RIAD ROOFTOP ✨', {
            bg: '#1c5d52', border: '#f4be44', color: '#fff8e2', font: 'bold 30px sans-serif', width: 600, height: 90
          })
        })
      );
      sign.position.set(0, 4.95, -5.4);
      worldGroup.add(sign);

      // Glowing Exit Stairway Pad on the South side
      const exitPad = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.5), LS.makeEmissiveMat(0xffd27d, 0xf59e0b, 0.65));
      exitPad.rotation.x = -Math.PI / 2;
      exitPad.position.set(0, 0.04, 5.4);
      worldGroup.add(exitPad);

      // Parapet Colliders
      addCollider(0, -6.3, 7.5, 0.6);
      addCollider(-7.2, 0, 0.6, 6.8);
      addCollider(7.2, 0, 0.6, 6.8);
      addCollider(0, 6.4, 7.5, 0.6);

      W.applyRiadDecor = function () {
        const rugObj = (LS.RIAD_RUGS || []).find(r => r.id === LS.state.riadRug) || (LS.RIAD_RUGS && LS.RIAD_RUGS[0]);
        if (rugObj && W.riadRugMesh) {
          W.riadRugMesh.material.map = createRiadRugTex(rugObj.color, rugObj.accent);
          W.riadRugMesh.material.needsUpdate = true;
        }
        const cushObj = (LS.RIAD_CUSHIONS || []).find(c => c.id === LS.state.riadCushion) || (LS.RIAD_CUSHIONS && LS.RIAD_CUSHIONS[0]);
        if (cushObj) {
          W.riadCushionMeshes.forEach(m => {
            m.material.color.setHex(cushObj.hex);
          });
        }
        const lantObj = (LS.RIAD_LANTERNS || []).find(l => l.id === LS.state.riadLantern) || (LS.RIAD_LANTERNS && LS.RIAD_LANTERNS[0]);
        if (lantObj) {
          W.riadLanternMeshes.forEach(m => {
            m.material.color.setHex(lantObj.hex);
            if (m.material.emissive) m.material.emissive.setHex(lantObj.hex);
          });
          W.riadLanternHalos.forEach(h => {
            if (h.material && h.material.color) h.material.color.setHex(lantObj.hex);
          });
        }
      };
      W.applyRiadDecor();

      W.zones.push(
        { id: 'decorate_marrakech_riad', label: 'Decorate the Moroccan Riad Rooftop 🏮🧶✨', pos: new THREE.Vector3(-2.6, 0, 1.8), radius: 2.8 },
        { id: 'exit_interior', label: 'Return Downstairs to Marrakech Bazaar 🏮🚪', pos: new THREE.Vector3(0, 0, 5.2), radius: 2.4 }
      );

      W.getZoneLabel = function () { return 'Moroccan Riad Rooftop Suite 🕌🌅'; };

      W.update = function (dt, elapsed) {
        W.lanternPivots.forEach(lp => {
          lp.piv.rotation.z = Math.sin(elapsed * 1.4 + lp.phase) * 0.06;
          lp.piv.rotation.x = Math.cos(elapsed * 1.1 + lp.phase) * 0.04;
        });
      };

      W.drawMiniMap = function (ctx, cw, ch) {
        ctx.fillStyle = '#e5c18e';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#1f5692';
        ctx.fillRect(cw * 0.25, ch * 0.28, cw * 0.5, ch * 0.36);
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff7e0';
        ctx.fillText('🏮 RIAD ROOF', cw * 0.5, ch * 0.5);
        ctx.fillText('🚪 EXIT', cw * 0.5, ch * 0.88);
      };

      return W;
    }
  });
})(window.LailaSalma);
