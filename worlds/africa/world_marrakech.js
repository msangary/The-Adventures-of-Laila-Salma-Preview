window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  // =========================================================================
  // WAVE 1 — MARRAKECH LANTERN BAZAAR, MOROCCO (Studio Ghibli Edition)
  // Horseshoe Moorish Arches, Glowing Stained-Glass Lanterns, Octagonal
  // Zellige Mosaic Fountain, Spice Pyramids, Berber Rugs, Riad Orange Trees,
  // Koutoubia Minaret, Atlas Mountains & 5 Big-Eared Sahara Fennec Foxes!
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

  function createTerracottaPlasterTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#e39676');
      g.addColorStop(0.5, '#d78162');
      g.addColorStop(1, '#e19070');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // Warm painterly hand-troweled adobe patches
      for (let i = 0; i < 48; i++) {
        const px = (i * 113) % w;
        const py = (i * 79) % h;
        const r = 28 + (i % 5) * 14;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 224, 198, 0.14)' : 'rgba(155, 68, 44, 0.11)';
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 420; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,235,215,0.18)' : 'rgba(130,52,32,0.12)';
        ctx.fillRect((i * 89) % w, (i * 151) % h, 2, 2);
      }
    }, 3, 3);
  }

  function createZelligeTileTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#faf3e3';
      ctx.fillRect(0, 0, w, h);
      const cell = 128;
      for (let r = 0; r < h / cell; r++) {
        for (let c = 0; c < w / cell; c++) {
          const cx = c * cell + cell * 0.5;
          const cy = r * cell + cell * 0.5;
          // Border diamond frame
          ctx.strokeStyle = '#1f5692';
          ctx.lineWidth = 4;
          ctx.strokeRect(c * cell + 4, r * cell + 4, cell - 8, cell - 8);
          // 8-pointed Moroccan Zellige star (cobalt + emerald + saffron!)
          ctx.save();
          ctx.translate(cx, cy);
          ctx.fillStyle = '#1d4f8f';
          ctx.fillRect(-30, -30, 60, 60);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = '#1d9a8c';
          ctx.fillRect(-30, -30, 60, 60);
          ctx.rotate(-Math.PI / 4);
          // Golden inner rosette
          ctx.fillStyle = '#f4be44';
          ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#faf3e3';
          ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // Corner terracotta medallions
          ctx.fillStyle = '#c84b31';
          ctx.beginPath(); ctx.arc(c * cell, r * cell, 12, 0, Math.PI * 2); ctx.fill();
        }
      }
    }, 5, 5);
  }

  function createCourtyardStoneTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#f2dec2';
      ctx.fillRect(0, 0, w, h);
      const s = 64;
      for (let r = 0; r < h / s; r++) {
        for (let c = 0; c < w / s; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#f6e4ca' : '#ebd1ae';
          ctx.fillRect(c * s + 2, r * s + 2, s - 4, s - 4);
        }
      }
      ctx.strokeStyle = 'rgba(176, 108, 66, 0.25)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= w; i += s) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
      }
    }, 10, 10);
  }

  function createBerberRugTex(bgHex, diamondHex, accentHex) {
    return makeCanvasTex(256, 512, (ctx, w, h) => {
      ctx.fillStyle = bgHex || '#c83e37';
      ctx.fillRect(0, 0, w, h);
      // Cream border stripes
      ctx.fillStyle = '#fff5e0';
      ctx.fillRect(14, 14, w - 28, h - 28);
      ctx.fillStyle = bgHex || '#c83e37';
      ctx.fillRect(28, 28, w - 56, h - 56);
      // Geometric Berber diamond lozenges
      for (let y = 76; y < h - 60; y += 92) {
        ctx.fillStyle = diamondHex || '#f4c44e';
        ctx.beginPath();
        ctx.moveTo(w / 2, y - 38); ctx.lineTo(w / 2 + 54, y);
        ctx.lineTo(w / 2, y + 38); ctx.lineTo(w / 2 - 54, y);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = accentHex || '#1e8a8a';
        ctx.beginPath();
        ctx.moveTo(w / 2, y - 18); ctx.lineTo(w / 2 + 26, y);
        ctx.lineTo(w / 2, y + 18); ctx.lineTo(w / 2 - 26, y);
        ctx.closePath(); ctx.fill();
      }
    }, 1, 1);
  }

  // Smooth Curved Moorish Horseshoe Arch Wall Segment (true curved ExtrudeGeometry!)
  function createMoorishArchWall(width, height, depth, plasterMat, trimMat) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, height);
    shape.lineTo(-width / 2, height);
    shape.closePath();

    // Smooth horseshoe arch opening cutout
    const aw = width * 0.62;
    const ar = aw * 0.52;
    const springY = height * 0.48;
    const hole = new THREE.Path();
    hole.moveTo(-aw * 0.44, 0);
    hole.lineTo(-aw * 0.44, springY - 0.15);
    hole.absarc(0, springY + 0.25, ar, Math.PI * 1.12, -Math.PI * 0.12, true);
    hole.lineTo(aw * 0.44, 0);
    hole.closePath();
    shape.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3, curveSegments: 20 });
    geo.translate(0, 0, -depth * 0.5);
    const mesh = new THREE.Mesh(geo, plasterMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const g = new THREE.Group();
    g.add(mesh);

    // Decorative Zellige top frieze strip
    if (trimMat) {
      const frieze = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.55, depth + 0.14), trimMat);
      frieze.position.y = height - 0.35;
      g.add(frieze);
    }
    return g;
  }

  // Pierced Brass & Stained-Glass Moroccan Lantern with soft Studio Ghibli Halo!
  function createMoroccanLantern(glowHex, scale) {
    const s = scale || 1.0;
    const g = new THREE.Group();
    const brass = new THREE.MeshStandardMaterial({ color: 0xd9a13b, roughness: 0.32, metalness: 0.62 });
    const glass = LS.makeEmissiveMat(glowHex, glowHex, 1.05);

    // Hanging chain
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02 * s, 0.02 * s, 0.65 * s, 6), brass);
    chain.position.y = 0.68 * s;
    g.add(chain);

    // Scalloped brass onion dome top
    const dome = new THREE.Mesh(new THREE.ConeGeometry(0.28 * s, 0.34 * s, 8), brass);
    dome.position.y = 0.28 * s;
    g.add(dome);

    // Glowing hexagonal stained-glass body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24 * s, 0.20 * s, 0.48 * s, 6), glass);
    body.position.y = -0.10 * s;
    g.add(body);

    // Brass base finial
    const base = new THREE.Mesh(new THREE.ConeGeometry(0.22 * s, 0.22 * s, 6), brass);
    base.rotation.x = Math.PI;
    base.position.y = -0.44 * s;
    g.add(base);

    if (LS.createGlowSprite) {
      const halo = LS.createGlowSprite(glowHex, 1.85 * s);
      halo.position.y = -0.08 * s;
      g.add(halo);
    }
    return g;
  }

  // Lush Potted Moroccan Seville Orange Tree!
  function createOrangeTree(scale) {
    const s = scale || 1.0;
    const g = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.56 * s, 0.42 * s, 0.68 * s, 14), LS.makeToonMat(0x1f5692));
    pot.position.y = 0.34 * s; pot.castShadow = true; g.add(pot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.56 * s, 0.06 * s, 8, 18), LS.makeToonMat(0xf4be44));
    rim.rotation.x = Math.PI / 2; rim.position.y = 0.68 * s; g.add(rim);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.10 * s, 0.15 * s, 1.65 * s, 10), LS.makeToonMat(0x7c5334));
    trunk.position.y = 1.45 * s; trunk.castShadow = true; g.add(trunk);

    const leafMat = LS.makeToonMat(0x3a8f49);
    const leafB = LS.makeToonMat(0x52a854);
    const orangeMat = LS.makeToonMat(0xff8c24);
    [[0, 2.55, 0, 1.05], [0.52, 2.35, 0.32, 0.72], [-0.52, 2.40, -0.28, 0.74], [0.1, 2.95, -0.25, 0.68]].forEach((c, i) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(c[3] * s, 14, 12), i % 2 === 0 ? leafMat : leafB);
      puff.position.set(c[0] * s, c[1] * s, c[2] * s);
      puff.castShadow = true;
      g.add(puff);
    });
    // Bright sweet Seville oranges nestled in the canopy!
    [[0.62, 2.45, 0.55], [-0.65, 2.55, 0.42], [0.25, 2.85, 0.72], [-0.22, 2.25, 0.75], [0.75, 2.20, -0.35], [-0.45, 2.75, -0.58]].forEach(op => {
      const or = new THREE.Mesh(new THREE.SphereGeometry(0.14 * s, 10, 8), orangeMat);
      or.position.set(op[0] * s, op[1] * s, op[2] * s);
      g.add(or);
    });
    return g;
  }

  // Adorable Big-Eared Sahara Fennec Fox!
  function createFennecFox(coatHex) {
    const g = new THREE.Group();
    const fur = LS.makeToonMat(coatHex || 0xf3d4a4);
    const cream = LS.makeToonMat(0xfff6e5);
    const pinkEar = LS.makeToonMat(0xf4a4a8);
    const noseMat = LS.makeToonMat(0x2c1e16);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), fur);
    body.scale.set(0.85, 0.82, 1.35);
    body.position.set(0, 0.28, 0);
    body.castShadow = true;
    g.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 12), fur);
    head.position.set(0, 0.44, 0.25);
    g.add(head);

    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.20, 10), cream);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, 0.40, 0.42);
    g.add(snout);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), noseMat);
    nose.position.set(0, 0.40, 0.52);
    g.add(nose);

    // Signature oversized cute Fennec Fox ears!!
    [-0.14, 0.14].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.34, 8), fur);
      ear.position.set(ex, 0.65, 0.22);
      ear.rotation.z = ex < 0 ? 0.38 : -0.38;
      g.add(ear);
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.26, 8), pinkEar);
      inner.position.set(ex, 0.64, 0.25);
      inner.rotation.z = ex < 0 ? 0.38 : -0.38;
      g.add(inner);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), noseMat);
      eye.position.set(ex * 0.68, 0.47, 0.39);
      g.add(eye);
    });

    // 4 tiny paws
    [[-0.10, 0.16], [0.10, 0.16], [-0.10, -0.16], [0.10, -0.16]].forEach(lp => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.20, 8), cream);
      leg.position.set(lp[0], 0.10, lp[1]);
      g.add(leg);
    });

    // Fluffy swishing tail
    const tail = new THREE.Group();
    tail.position.set(0, 0.28, -0.28);
    const tMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), fur);
    tMesh.scale.set(0.75, 0.75, 2.2);
    tMesh.position.set(0, 0.08, -0.16);
    tMesh.rotation.x = 0.45;
    tail.add(tMesh);
    g.add(tail);

    return { root: g, tail };
  }

  LS.registerWorld('marrakech', {
    build: function (worldGroup) {
      const W = {
        id: 'marrakech',
        isInterior: false,
        skyMesh: null,
        colliders: [],
        zones: [],
        hiddenAnimals: [],
        lanterns: [],
        fountainDrops: [],
        canopies: [],
        teaSteam: [],
        strollers: [],
        swayers: [],
        mochiStartPos: new THREE.Vector3(2.4, 0, 19.5)
      };

      function safeRun(name, fn) {
        try { fn(); } catch (e) { console.warn('[Marrakech:' + name + ']', e); }
      }

      function addCollider(x, z, hw, hd) {
        W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
      }

      const plasterTex = createTerracottaPlasterTex();
      const zelligeTex = createZelligeTileTex();
      const courtTex = createCourtyardStoneTex();
      const rugRedTex = createBerberRugTex('#c83e37', '#f4c44e', '#1d9a8c');
      const rugBlueTex = createBerberRugTex('#1d4f8f', '#f4c44e', '#e07a5f');
      const rugGoldTex = createBerberRugTex('#d98a2b', '#fff5e0', '#1d4f8f');

      const plasterMat = LS.makeSurfaceMat(plasterTex, { roughness: 0.88 });
      const zelligeMat = LS.makeSurfaceMat(zelligeTex, { roughness: 0.52 });
      const courtMat = LS.makeSurfaceMat(courtTex, { roughness: 0.82 });
      const cedarMat = LS.makeToonMat(0x7c4a26);
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xe2ad3b, roughness: 0.30, metalness: 0.62 });
      const cobaltMat = LS.makeToonMat(0x1f5692);
      const emeraldMat = LS.makeToonMat(0x1e8a7a);

      // ---------------------------------------------------------------------
      // 1. Studio Ghibli Sky Dome, Courtyard Tiles & Snow-Capped Atlas Peaks
      // ---------------------------------------------------------------------
      safeRun('courtyard_and_atlas', () => {
        W.skyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(210, 28, 18),
          new THREE.MeshBasicMaterial({
            map: LS.createSkyTexture(LS.state.timeMode, 'marrakech'),
            side: THREE.BackSide,
            fog: false
          })
        );
        worldGroup.add(W.skyMesh);

        const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), courtMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        worldGroup.add(ground);

        // Exquisite Zellige Mosaic Central Courtyard Carpet & Cross Paths
        const mosaicCenter = new THREE.Mesh(new THREE.CircleGeometry(12.5, 36), zelligeMat);
        mosaicCenter.rotation.x = -Math.PI / 2;
        mosaicCenter.position.set(0, 0.03, 4.0);
        mosaicCenter.receiveShadow = true;
        worldGroup.add(mosaicCenter);

        const northPath = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 24), zelligeMat);
        northPath.rotation.x = -Math.PI / 2;
        northPath.position.set(0, 0.032, -10.5);
        worldGroup.add(northPath);

        // Warm Terracotta Medina Walls enclosing the bazaar square
        const wallH = 6.2;
        [[-38, 0, 2.2, 74], [38, 0, 2.2, 74], [0, -36, 78, 2.2], [-22, 34, 34, 2.2], [22, 34, 34, 2.2]].forEach(w => {
          const wm = new THREE.Mesh(new THREE.BoxGeometry(w[2], wallH, w[3]), plasterMat);
          wm.position.set(w[0], wallH * 0.5, w[1]);
          wm.castShadow = true;
          wm.receiveShadow = true;
          worldGroup.add(wm);
        });

        // Grand Horseshoe Entrance Gate on the South side!
        const southGate = createMoorishArchWall(12.5, 7.6, 1.6, plasterMat, zelligeMat);
        southGate.position.set(0, 0, 34);
        worldGroup.add(southGate);

        const gateSign = new THREE.Mesh(
          new THREE.BoxGeometry(7.8, 1.15, 0.2),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture('🏮 MARRAKECH LANTERN BAZAAR ✨', {
              bg: '#1c4478', border: '#f4be44', color: '#fff7e0', font: 'bold 34px sans-serif', width: 640, height: 110
            })
          })
        );
        gateSign.position.set(0, 6.65, 33.1);
        worldGroup.add(gateSign);

        // Snow-Dusted High Atlas Mountains on the Northern Horizon!
        const mtnMat = LS.makeToonMat(0xb67b72);
        const snowMat = LS.makeToonMat(0xfff7f2);
        [[-52, -74, 26, 22], [-18, -82, 34, 29], [22, -78, 30, 25], [56, -72, 24, 20]].forEach(m => {
          const peak = new THREE.Mesh(new THREE.ConeGeometry(m[2], m[3], 6), mtnMat);
          peak.position.set(m[0], m[3] * 0.45, m[1]);
          worldGroup.add(peak);
          const cap = new THREE.Mesh(new THREE.ConeGeometry(m[2] * 0.38, m[3] * 0.36, 6), snowMat);
          cap.position.set(m[0], m[3] * 0.77, m[1]);
          worldGroup.add(cap);
        });

        // Towering Koutoubia-Style Terracotta Minaret (Northwest Skyline!)
        const kg = new THREE.Group();
        kg.position.set(-28, 0, -28);
        const shaft = new THREE.Mesh(new THREE.BoxGeometry(6.8, 22, 6.8), plasterMat);
        shaft.position.y = 11; shaft.castShadow = true; kg.add(shaft);
        const band = new THREE.Mesh(new THREE.BoxGeometry(7.1, 1.5, 7.1), zelligeMat);
        band.position.y = 18.8; kg.add(band);
        const lanternTop = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.5, 4.0), plasterMat);
        lanternTop.position.y = 24.2; kg.add(lanternTop);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(2.1, 18, 12), LS.makeToonMat(0xf4be44));
        dome.position.y = 26.8; kg.add(dome);
        // Iconic 3 Golden Finial Spheres atop the Minaret!
        [0.65, 0.48, 0.32].forEach((r, idx) => {
          const sp = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), brassMat);
          sp.position.y = 29.2 + idx * 0.92;
          kg.add(sp);
        });
        worldGroup.add(kg);
        addCollider(-28, -28, 4.0, 4.0);
      });

      // ---------------------------------------------------------------------
      // 2. Central Octagonal Zellige Fountain + Teacher Youssef!
      // ---------------------------------------------------------------------
      safeRun('zellige_fountain', () => {
        const fg = new THREE.Group();
        fg.position.set(0, 0, 4.0);

        const rim = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.85, 0.85, 8), zelligeMat);
        rim.position.y = 0.42; rim.castShadow = true; rim.receiveShadow = true; fg.add(rim);
        const water = new THREE.Mesh(new THREE.CylinderGeometry(3.15, 3.15, 0.72, 8), LS.makeWaterMat(0.92));
        water.position.y = 0.44; fg.add(water);
        const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 1.75, 12), LS.makeToonMat(0xfff7e8));
        tier1.position.y = 0.95; fg.add(tier1);
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 0.65, 0.45, 16), zelligeMat);
        bowl.position.y = 1.92; fg.add(bowl);
        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), brassMat);
        finial.position.y = 2.45; fg.add(finial);

        // Animated sparkling fountain water arcs!
        const dropMat = LS.makeEmissiveMat(0xcaf0f8, 0x90e0ef, 0.55);
        for (let i = 0; i < 16; i++) {
          const drop = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 6), dropMat);
          drop.userData = { angle: (i / 16) * Math.PI * 2, phase: (i % 4) * 0.25 };
          fg.add(drop);
          W.fountainDrops.push(drop);
        }

        worldGroup.add(fg);
        addCollider(0, 4.0, 3.8, 3.8);

        // Teacher Youssef greeting Laila & Salma beside the fountain!
        const youssef = LS.createAnimeCharacter({
          scale: 1.05, hairColor: 0x241c18, skinColor: 0xc9936a,
          topColor: 0xfef9ef, bottomColor: 0x1f5692, pants: true,
          faceOpts: { glasses: true, mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        youssef.root.position.set(4.8, 0, 6.2);
        youssef.root.rotation.y = -0.65;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Teacher Youssef 🕌', 'Marhaba! Ready for a fun Marrakech & Atlas Quiz? 🏮✨');
          sb.position.set(0, 2.4, 0); youssef.root.add(sb);
        }
        worldGroup.add(youssef.root);

        W.zones.push({
          id: 'marrakech_teacher_quiz',
          label: "Take Teacher Youssef's Marrakech Quiz 🕌✨",
          pos: new THREE.Vector3(4.8, 0, 6.2),
          radius: 3.4
        });
      });

      // ---------------------------------------------------------------------
      // 3. West Wing: Moorish Horseshoe-Arch Lantern Bazaar & Artisan Fatima!
      // ---------------------------------------------------------------------
      safeRun('lantern_arcade', () => {
        const lg = new THREE.Group();
        lg.position.set(-18.5, 0, 2.0);
        lg.rotation.y = Math.PI / 2;

        // Row of 4 smooth curved Horseshoe Arches!
        const archW = 5.4;
        for (let i = 0; i < 4; i++) {
          const ax = -8.1 + i * archW;
          const arch = createMoorishArchWall(archW, 5.8, 0.72, plasterMat, zelligeMat);
          arch.position.set(ax, 0, 0);
          lg.add(arch);
        }
        // Back wall & glowing workshop interior behind the arches
        const back = new THREE.Mesh(new THREE.BoxGeometry(22.2, 6.0, 0.6), plasterMat);
        back.position.set(0, 3.0, -4.4);
        lg.add(back);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(22.4, 0.4, 5.2), cedarMat);
        roof.position.set(0, 5.95, -2.2);
        lg.add(roof);

        const lanternSign = new THREE.Mesh(
          new THREE.BoxGeometry(6.8, 1.0, 0.18),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture("🏮 FATIMA'S LANTERN STUDIO ✨", {
              bg: '#2b1a3d', border: '#f4be44', color: '#fff7d6', font: 'bold 30px sans-serif', width: 560, height: 96
            })
          })
        );
        lanternSign.position.set(0, 5.2, 0.52);
        lg.add(lanternSign);

        // Hang 16 glowing stained-glass brass Moroccan lanterns inside & under the arches!
        const glowPalette = [0xffb703, 0xff5c8a, 0x38bdf8, 0x34d399, 0xfb8500, 0xc084fc];
        for (let i = 0; i < 16; i++) {
          const lx = -9.2 + i * 1.24;
          const ly = 3.85 + (i % 3) * 0.45;
          const lz = i % 2 === 0 ? 0.85 : -1.5;
          const lant = createMoroccanLantern(glowPalette[i % glowPalette.length], 0.92 + (i % 3) * 0.16);
          lant.position.set(lx, ly, lz);
          lg.add(lant);
          W.lanterns.push({ mesh: lant, phase: i * 0.55 });
        }

        // Brass display tables overflowing with glowing jewel lanterns
        [-5.2, 0.0, 5.2].forEach((tx, idx) => {
          const tbl = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.95, 1.5), cedarMat);
          tbl.position.set(tx, 0.48, -2.0);
          lg.add(tbl);
          const miniL = createMoroccanLantern(glowPalette[(idx * 2) % glowPalette.length], 0.72);
          miniL.position.set(tx, 1.38, -2.0);
          lg.add(miniL);
        });

        worldGroup.add(lg);
        addCollider(-20.8, 2.0, 3.0, 11.2);

        // Overhead Festive Lantern Strings crisscrossing the main courtyard!
        const cordMat = LS.makeToonMat(0x4a2f1d);
        [[-15, 5.8, -4, 15, 5.8, -4], [-15, 5.8, 10, 15, 5.8, 10]].forEach((s, si) => {
          const len = Math.hypot(s[3] - s[0], s[5] - s[2]);
          const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 6), cordMat);
          cord.rotation.z = Math.PI / 2;
          cord.position.set(0, s[1], s[2]);
          worldGroup.add(cord);
          for (let k = 0; k < 7; k++) {
            const x = -11.5 + k * 3.8;
            const sag = Math.sin(((k + 0.5) / 7) * Math.PI) * 0.55;
            const lant = createMoroccanLantern(glowPalette[(k + si * 3) % glowPalette.length], 0.86);
            lant.position.set(x, s[1] - 0.55 - sag, s[2]);
            worldGroup.add(lant);
            W.lanterns.push({ mesh: lant, phase: k * 0.8 + si });
          }
        });

        const fatima = LS.createAnimeCharacter({
          scale: 0.96, hairColor: 0x1d1410, skinColor: 0xcf976f,
          topColor: 0xd84339, bottomColor: 0xf4be44, hairBun: true,
          faceOpts: { eyeColor: '#3a2216', eyeHighlight: '#b07246', blush: 'rgba(226,114,98,0.4)' }
        });
        fatima.root.position.set(-15.0, 0, 2.0);
        fatima.root.rotation.y = Math.PI / 2;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Artisan Fatima 🏮', 'Design & light your own stained-glass Moroccan lantern! 🏮✨');
          sb.position.set(0, 2.25, 0); fatima.root.add(sb);
        }
        worldGroup.add(fatima.root);

        W.zones.push({
          id: 'marrakech_lantern',
          label: 'Craft a Glowing Stained-Glass Lantern 🏮✨',
          pos: new THREE.Vector3(-14.6, 0, 2.0),
          radius: 3.8
        });
      });

      // ---------------------------------------------------------------------
      // 4. East Wing: Fragrant Spice Pyramids & Berber Carpet Gallery!
      // ---------------------------------------------------------------------
      safeRun('spice_and_rugs', () => {
        const eg = new THREE.Group();
        eg.position.set(18.5, 0, 2.0);
        eg.rotation.y = -Math.PI / 2;

        // 4 Smooth Moorish Arches for Spice & Rug Stalls
        for (let i = 0; i < 4; i++) {
          const arch = createMoorishArchWall(5.4, 5.8, 0.72, plasterMat, zelligeMat);
          arch.position.set(-8.1 + i * 5.4, 0, 0);
          eg.add(arch);
        }
        const back = new THREE.Mesh(new THREE.BoxGeometry(22.2, 6.0, 0.6), plasterMat);
        back.position.set(0, 3.0, -4.4);
        eg.add(back);

        // Billowing Colorful Woven Silk Market Awnings!
        const canopyColors = [0xc83e37, 0x1e8a8a, 0xe89f2b, 0x1f5692];
        for (let i = 0; i < 4; i++) {
          const can = new THREE.Mesh(
            new THREE.BoxGeometry(5.1, 0.14, 3.2),
            LS.makeToonMat(canopyColors[i])
          );
          can.position.set(-8.1 + i * 5.4, 4.35, 1.55);
          can.rotation.x = 0.22;
          eg.add(can);
          W.canopies.push({ mesh: can, phase: i * 0.9 });
        }

        // Conical Fragrant Spice Pyramids in Hammered Brass Bowls!
        const spiceColors = [0xf59e0b, 0xdc2626, 0xeab308, 0x16a34a, 0x9333ea, 0xea580c, 0x2563eb];
        for (let i = 0; i < 7; i++) {
          const sx = -8.2 + i * 1.45;
          const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.36, 0.42, 16), brassMat);
          bowl.position.set(sx, 0.22, 1.35);
          eg.add(bowl);
          const cone = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.78, 16), LS.makeToonMat(spiceColors[i]));
          cone.position.set(sx, 0.78, 1.35);
          cone.castShadow = true;
          eg.add(cone);
        }

        // Hanging Handwoven Berber Carpets (3 vibrant patterns!)
        const rugMats = [
          LS.makeSurfaceMat(rugRedTex, { roughness: 0.92 }),
          LS.makeSurfaceMat(rugBlueTex, { roughness: 0.92 }),
          LS.makeSurfaceMat(rugGoldTex, { roughness: 0.92 })
        ];
        [3.2, 6.2, 9.2].forEach((rx, idx) => {
          const rug = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.6, 0.12), rugMats[idx]);
          rug.position.set(rx, 2.35, 0.48);
          rug.castShadow = true;
          eg.add(rug);
        });

        const rugSign = new THREE.Mesh(
          new THREE.BoxGeometry(6.8, 1.0, 0.18),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture('🧶 SPICE SOUK & BERBER RUGS 🌶️', {
              bg: '#8a2d1b', border: '#f4be44', color: '#fff7e0', font: 'bold 30px sans-serif', width: 560, height: 96
            })
          })
        );
        rugSign.position.set(0, 5.2, 0.52);
        eg.add(rugSign);

        worldGroup.add(eg);
        addCollider(20.8, 2.0, 3.0, 11.2);

        const nadia = LS.createAnimeCharacter({
          scale: 0.96, hairColor: 0x261812, skinColor: 0xd19b72,
          topColor: 0x1e8a8a, bottomColor: 0xc83e37, hairBun: true,
          faceOpts: { eyeColor: '#3a2216', eyeHighlight: '#b07246', blush: 'rgba(226,114,98,0.4)' }
        });
        nadia.root.position.set(14.8, 0, 5.2);
        nadia.root.rotation.y = -Math.PI / 2;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Weaver Nadia 🧶', 'Help me finish this colorful Berber mosaic rug pattern! 🧶✨');
          sb.position.set(0, 2.25, 0); nadia.root.add(sb);
        }
        worldGroup.add(nadia.root);

        W.zones.push({
          id: 'marrakech_rug',
          label: 'Play Berber Mosaic Rug Pattern Matcher 🧶✨',
          pos: new THREE.Vector3(14.4, 0, 5.2),
          radius: 3.8
        });
      });

      // ---------------------------------------------------------------------
      // 5. North Riad Orange-Tree Courtyard & Mint Tea / Tagine Pavilion!
      // ---------------------------------------------------------------------
      safeRun('riad_tea_courtyard', () => {
        const rg = new THREE.Group();
        rg.position.set(0, 0, -19.5);

        // Elevated tiled Riad terrace with smooth Horseshoe Pavilion
        const deck = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.34, 10.5), zelligeMat);
        deck.position.y = 0.17; deck.receiveShadow = true; rg.add(deck);

        const arch1 = createMoorishArchWall(7.6, 5.6, 0.65, plasterMat, zelligeMat);
        arch1.position.set(-3.8, 0.34, 3.8);
        rg.add(arch1);
        const arch2 = createMoorishArchWall(7.6, 5.6, 0.65, plasterMat, zelligeMat);
        arch2.position.set(3.8, 0.34, 3.8);
        rg.add(arch2);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.36, 9.2), cedarMat);
        roof.position.set(0, 6.0, -0.5);
        rg.add(roof);

        const teaSign = new THREE.Mesh(
          new THREE.BoxGeometry(7.2, 1.0, 0.18),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture('🫖 RIAD MINT TEA & TAGINE 🍊', {
              bg: '#1c5d52', border: '#f4be44', color: '#fff8e2', font: 'bold 30px sans-serif', width: 580, height: 96
            })
          })
        );
        teaSign.position.set(0, 5.2, 4.25);
        rg.add(teaSign);

        // Low Plush Cushioned Sedari Lounge & Brass Tea Table!
        const rug = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 5.6), LS.makeSurfaceMat(rugBlueTex, { roughness: 0.9 }));
        rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.36, -0.8); rg.add(rug);

        const table = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.25, 0.62, 20), brassMat);
        table.position.set(0, 0.65, -0.8); table.castShadow = true; rg.add(table);

        // Silver Moroccan Mint Teapot & Colorful Painted Tagine Cone Pot!
        const potBody = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), LS.makeToonMat(0xe2e8f0));
        potBody.position.set(-0.55, 1.15, -0.7); rg.add(potBody);
        const tagBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.16, 16), LS.makeToonMat(0xd96b43));
        tagBase.position.set(0.45, 1.04, -0.85); rg.add(tagBase);
        const tagCone = new THREE.Mesh(new THREE.ConeGeometry(0.40, 0.56, 16), LS.makeToonMat(0xc84b31));
        tagCone.position.set(0.45, 1.38, -0.85); rg.add(tagCone);

        // Plush floor poufs around the tea table
        [[-2.2, -0.8, 0xc83e37], [2.2, -0.8, 0x1e8a8a], [0, -2.5, 0xf4be44]].forEach(p => {
          const pouf = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.34, 16), LS.makeToonMat(p[2]));
          pouf.position.set(p[0], 0.52, p[1]); rg.add(pouf);
        });

        // Rising fragrant mint tea steam puffs
        for (let i = 0; i < 4; i++) {
          const puff = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 8, 6),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 })
          );
          puff.userData = { baseX: -0.55, baseY: 1.55, baseZ: -20.2, phase: i * 0.25 };
          worldGroup.add(puff);
          W.teaSteam.push(puff);
        }

        // Lush Potted Seville Orange Trees framing the Riad & Courtyard!
        [[-10.2, -14.2], [10.2, -14.2], [-10.2, 16.5], [10.2, 16.5], [-10.8, 4.0], [10.8, 4.0]].forEach((ot, idx) => {
          const tree = createOrangeTree(idx < 2 ? 1.15 : 0.96);
          tree.position.set(ot[0], 0, ot[1]);
          worldGroup.add(tree);
          addCollider(ot[0], ot[1], 0.65, 0.65);
        });

        worldGroup.add(rg);
        addCollider(0, -21.0, 8.2, 4.2);

        const rashid = LS.createAnimeCharacter({
          scale: 1.04, hairColor: 0x3b2f28, skinColor: 0xc58d64,
          topColor: 0xfff8e7, bottomColor: 0x1e7a6b, pants: true,
          faceOpts: { mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        rashid.root.position.set(-2.6, 0.34, -14.8);
        rashid.root.rotation.y = 0.28;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Tea Master Rashid 🫖', 'Sit by our orange trees for sweet mint tea & Tagine! 🫖🍊');
          sb.position.set(0, 2.38, 0); rashid.root.add(sb);
        }
        worldGroup.add(rashid.root);

        W.zones.push({
          id: 'marrakech_tea',
          label: 'Enjoy Riad Mint Tea & Warm Tagine Feast 🫖🍊',
          pos: new THREE.Vector3(0, 0, -14.2),
          radius: 4.0
        });
      });

      // ---------------------------------------------------------------------
      // 6. South Bazaar Drum Circle & Magic World Globe Pedestal!
      // ---------------------------------------------------------------------
      safeRun('drums_and_globe', () => {
        // Woven Drum Circle Carpet (Southwest X=-10, Z=+22)
        const carpet = new THREE.Mesh(new THREE.CircleGeometry(4.2, 28), LS.makeSurfaceMat(rugGoldTex, { roughness: 0.9 }));
        carpet.rotation.x = -Math.PI / 2; carpet.position.set(-10.5, 0.04, 21.5); worldGroup.add(carpet);

        // Moroccan Darbuka & Bendir drums!
        [[-12.2, 20.4], [-10.5, 19.6], [-8.8, 20.4]].forEach((dp, i) => {
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 0.68, 16), i % 2 === 0 ? cobaltMat : LS.makeToonMat(0xc84b31));
          drum.position.set(dp[0], 0.34, dp[1]); drum.castShadow = true; worldGroup.add(drum);
          const head = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 16), LS.makeToonMat(0xfff4d8));
          head.position.set(dp[0], 0.69, dp[1]); worldGroup.add(head);
        });

        const hassan = LS.createAnimeCharacter({
          scale: 1.04, hairColor: 0x221a16, skinColor: 0xbf865c,
          topColor: 0xf4be44, bottomColor: 0x6b3222, pants: true,
          faceOpts: { mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        hassan.root.position.set(-10.5, 0, 23.2);
        hassan.root.rotation.y = Math.PI;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Storyteller Hassan 🥁', 'Join the Jemaa el-Fnaa drum circle under the lanterns! 🥁✨');
          sb.position.set(0, 2.38, 0); hassan.root.add(sb);
        }
        worldGroup.add(hassan.root);

        W.zones.push({
          id: 'marrakech_drums',
          label: 'Play the Evening Bazaar Drum Circle 🥁✨',
          pos: new THREE.Vector3(-10.5, 0, 21.5),
          radius: 3.8
        });

        // Glowing Magic World Globe Pedestal (Southeast X=+10.5, Z=+22)
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.84, 1.1, 16), cobaltMat);
        ped.position.set(10.5, 0.55, 22.0); worldGroup.add(ped);
        const globe = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 14), LS.makeEmissiveMat(0x4cc9f0, 0x2ec4b6, 0.55));
        globe.position.set(10.5, 1.65, 22.0); worldGroup.add(globe);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.06, 10, 24), brassMat);
        ring.position.set(10.5, 1.65, 22.0); ring.rotation.x = 0.55; worldGroup.add(ring);
        W.magicGlobe = globe;
        W.magicRing = ring;
        addCollider(10.5, 22.0, 0.9, 0.9);

        W.zones.push({
          id: 'magic_globe',
          label: 'Spin the Magic World Globe (Travel Anywhere!) 🌍✨',
          pos: new THREE.Vector3(10.5, 0, 22.0),
          radius: 3.4
        });
      });

      // ---------------------------------------------------------------------
      // 7. 5 Hiding Big-Eared Sahara Fennec Foxes!
      // ---------------------------------------------------------------------
      safeRun('hidden_fennec_foxes', () => {
        const spotPool = [
          { pos: [-12.8, 0, -6.5], hint: 'Peeking from beneath Fatima\'s glowing stained-glass lanterns!' },
          { pos: [13.2, 0, -5.8], hint: 'Sniffing colorful saffron spice bowls in the East Souk!' },
          { pos: [-9.2, 0, -16.2], hint: 'Napping under the sweet Seville orange trees by the Riad!' },
          { pos: [9.5, 0, 15.0], hint: 'Hiding near the southern mosaic orange tree planters!' },
          { pos: [-13.5, 0, 14.5], hint: 'Listening to Hassan\'s drums near the west bazaar wall!' },
          { pos: [13.6, 0, 11.2], hint: 'Curled up beside the woven Berber carpet gallery!' },
          { pos: [8.8, 0, -15.8], hint: 'Waiting for honey pastries near the Riad Tea Courtyard!' }
        ];
        const names = ['Saffron', 'Zellige', 'Sahara', 'Noor', 'Atlas'];
        const coats = [0xf3d4a4, 0xeec68e, 0xf7dfc0, 0xe8be82, 0xf0cfa0];

        const chosen = LS.pickRoundSpots(spotPool, LS.state.marrakechFoxesRound || 0, 5);
        const foundList = LS.state.foundMarrakechFoxes || [];

        chosen.forEach((spot, idx) => {
          const id = 'marrakech_fox_' + idx;
          const fox = createFennecFox(coats[idx]);
          fox.root.position.set(spot.pos[0], 0, spot.pos[2]);
          fox.root.rotation.y = idx * 1.3;
          const already = foundList.includes(id);
          fox.root.visible = !already;
          worldGroup.add(fox.root);

          W.hiddenAnimals.push({
            id: id,
            kind: 'marrakech_fox',
            name: names[idx] + ' the Fennec Fox',
            hint: spot.hint,
            mesh: fox.root,
            tail: fox.tail,
            found: already
          });
          if (!already) {
            W.zones.push({
              id: 'animal:' + id,
              label: 'Befriend ' + names[idx] + ' the Fennec Fox 🦊✨',
              pos: new THREE.Vector3(spot.pos[0], 0, spot.pos[2]),
              radius: 2.8
            });
          }
        });
      });

      // ---------------------------------------------------------------------
      // 8. Bustling Medina Crowd: 10 More Lively Moroccan NPCs!
      //    (2 Merchants, 2 Seated Tea Guests, 2 Drum Musicians & 4 Strollers)
      // ---------------------------------------------------------------------
      safeRun('bustling_medina_npcs', () => {
        // 1) Spice Merchant Tariq beside the colorful Spice Pyramids!
        const tariq = LS.createAnimeCharacter({
          scale: 1.03, hairColor: 0x231b17, skinColor: 0xc58d64,
          topColor: 0xf4a236, bottomColor: 0x3b2a20, pants: true,
          faceOpts: { mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        tariq.root.position.set(14.8, 0, -2.6);
        tariq.root.rotation.y = -Math.PI / 2;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Spice Merchant Tariq 🌶️', 'Smell the golden saffron, sweet cinnamon & warm paprika! ✨');
          sb.position.set(0, 2.38, 0); tariq.root.add(sb);
        }
        worldGroup.add(tariq.root);

        // 2) Sweet Orange & Chebakia Pastry Seller Amina + Wooden Citrus Cart!
        const cart = new THREE.Group();
        cart.position.set(7.6, 0, 25.8);
        cart.rotation.y = -0.35;
        const cBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 1.25), cedarMat);
        cBody.position.y = 0.65; cBody.castShadow = true; cart.add(cBody);
        [-0.85, 0.85].forEach(wx => {
          const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 8, 16), cedarMat);
          wheel.position.set(wx, 0.34, 0.66); cart.add(wheel);
        });
        const orangeMat = LS.makeToonMat(0xff8c24);
        for (let i = 0; i < 8; i++) {
          const or = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), orangeMat);
          or.position.set(-0.65 + (i % 4) * 0.32, 1.20 + Math.floor(i / 4) * 0.14, -0.18 + Math.floor(i / 4) * 0.32);
          cart.add(or);
        }
        worldGroup.add(cart);
        addCollider(7.6, 25.8, 1.4, 1.0);

        const amina = LS.createAnimeCharacter({
          scale: 0.96, hairColor: 0x1d1410, skinColor: 0xd09870,
          topColor: 0xc83e37, bottomColor: 0xfff3d6, hairBun: true,
          faceOpts: { eyeColor: '#3a2216', eyeHighlight: '#b07246', blush: 'rgba(226,114,98,0.42)' }
        });
        amina.root.position.set(5.8, 0, 25.6);
        amina.root.rotation.y = -0.65;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Amina (Oranges) 🍊', 'Fresh sweet Marrakech oranges & honey pastries! 🍊🍯');
          sb.position.set(0, 2.25, 0); amina.root.add(sb);
        }
        worldGroup.add(amina.root);

        // 3 & 4) Two Cozy Guests Properly Seated at the Riad Mint Tea Table!
        const teaGuests = [
          { x: -2.2, z: -20.3, rotY: Math.PI / 2, cfg: { scale: 0.98, hairColor: 0x261d17, skinColor: 0xc68e66, topColor: 0x1f5692, bottomColor: 0xf4e8d2, pants: true } },
          { x: 2.2, z: -20.3, rotY: -Math.PI / 2, cfg: { scale: 0.94, hairColor: 0x1e1612, skinColor: 0xd49d76, topColor: 0x1e8a7a, bottomColor: 0xf4be44, hairBun: true } }
        ];
        teaGuests.forEach((tg, idx) => {
          const ch = LS.createAnimeCharacter(tg.cfg);
          ch.root.position.set(tg.x, 0.34, tg.z);
          ch.root.rotation.y = tg.rotY;
          if (LS.applyArticulatedPose) LS.applyArticulatedPose(ch, 0, 'chair_sit', idx * 1.2);
          worldGroup.add(ch.root);
          W.swayers.push({ ch, mode: 'sit', phase: idx * 1.7 });
        });

        // 5 & 6) Two Musicians Swaying & Playing at the Evening Drum Circle!
        const musicians = [
          { x: -13.2, z: 21.8, rotY: 0.9, cfg: { scale: 1.0, hairColor: 0x1d1613, skinColor: 0xb98158, topColor: 0x1f5692, bottomColor: 0xfdf3dc, pants: true, faceOpts: { mustache: true } } },
          { x: -7.8, z: 21.8, rotY: -0.9, cfg: { scale: 0.95, hairColor: 0x2a1b14, skinColor: 0xcf976f, topColor: 0xd97706, bottomColor: 0x7c2d12, hairBun: true } }
        ];
        musicians.forEach((mu, idx) => {
          const ch = LS.createAnimeCharacter(mu.cfg);
          ch.root.position.set(mu.x, 0, mu.z);
          ch.root.rotation.y = mu.rotY;
          worldGroup.add(ch.root);
          W.swayers.push({ ch, mode: 'clap', phase: idx * 1.3 });
        });

        // 7–10) Four Animated Strolling Medina Visitors Exploring the Bazaar!
        const strollerDefs = [
          { rx: 8.6, rz: 9.2, cx: 0, cz: 4.0, speed: 0.24, phase: 0.0, cfg: { scale: 0.98, hairColor: 0x2c2018, skinColor: 0xd19a72, topColor: 0x0ea5e9, bottomColor: 0x334155, pants: true } },
          { rx: 9.4, rz: 8.2, cx: 0, cz: 4.0, speed: -0.21, phase: 2.1, cfg: { scale: 0.94, hairColor: 0x1f1512, skinColor: 0xc99169, topColor: 0xf43f5e, bottomColor: 0xfef3c7, hairBun: true } },
          { rx: 11.2, rz: 10.6, cx: 0, cz: 3.5, speed: 0.18, phase: 4.2, cfg: { scale: 0.88, hairColor: 0x3b281c, skinColor: 0xd9a682, topColor: 0x10b981, bottomColor: 0x1e3a5f, pants: true } },
          { rx: 7.4, rz: 7.8, cx: 0, cz: 4.5, speed: -0.25, phase: 5.1, cfg: { scale: 0.92, hairColor: 0x261a14, skinColor: 0xc48b62, topColor: 0x8b5cf6, bottomColor: 0xfde68a, longHair: true } }
        ];
        strollerDefs.forEach(sd => {
          const ch = LS.createAnimeCharacter(sd.cfg);
          worldGroup.add(ch.root);
          W.strollers.push({ ch, rx: sd.rx, rz: sd.rz, cx: sd.cx, cz: sd.cz, speed: sd.speed, phase: sd.phase });
        });
      });

      W.getZoneLabel = function (x, z) {
        if (z < -11) return 'Riad Orange-Tree Tea Courtyard 🫖🍊';
        if (x < -10 && z < 14) return "Fatima's Lantern Bazaar Arcade 🏮";
        if (x > 10 && z < 14) return 'Spice Souk & Berber Rug Gallery 🧶';
        if (z > 16 && x < 0) return 'Jemaa el-Fnaa Drum Circle 🥁';
        return 'Octagonal Zellige Fountain Plaza ✨';
      };

      W.update = function (dt, elapsed) {
        if (W.magicGlobe) W.magicGlobe.rotation.y += dt * 0.7;
        if (W.magicRing) W.magicRing.rotation.z += dt * 0.45;
        W.lanterns.forEach(l => {
          l.mesh.rotation.z = Math.sin(elapsed * 1.45 + l.phase) * 0.06;
          l.mesh.rotation.x = Math.cos(elapsed * 1.15 + l.phase) * 0.04;
        });
        W.canopies.forEach(c => {
          c.mesh.rotation.x = 0.22 + Math.sin(elapsed * 1.8 + c.phase) * 0.03;
        });
        W.fountainDrops.forEach(d => {
          const t = (elapsed * 1.45 + d.userData.phase) % 1.0;
          const r = 0.22 + t * 2.25;
          const y = 2.15 + Math.sin(t * Math.PI) * 0.95 - t * 1.38;
          d.position.set(Math.cos(d.userData.angle) * r, Math.max(0.82, y), Math.sin(d.userData.angle) * r);
        });
        W.teaSteam.forEach(p => {
          const t = (elapsed * 0.45 + p.userData.phase) % 1.0;
          p.position.set(p.userData.baseX + Math.sin(elapsed * 2 + p.userData.phase * 6) * 0.16, p.userData.baseY + t * 1.5, p.userData.baseZ);
          p.scale.setScalar(0.55 + t * 0.95);
          p.material.opacity = (1 - t) * 0.42;
        });
        W.strollers.forEach(st => {
          const a = elapsed * st.speed + st.phase;
          const nx = st.cx + Math.cos(a) * st.rx;
          const nz = st.cz + Math.sin(a) * st.rz;
          const dx = -Math.sin(a) * st.rx * st.speed;
          const dz = Math.cos(a) * st.rz * st.speed;
          st.ch.root.position.set(nx, 0, nz);
          st.ch.root.rotation.y = Math.atan2(dx, dz);
          const sw = Math.sin(elapsed * 6.5 + st.phase) * 0.48;
          st.ch.leftLeg.rotation.x = sw;
          st.ch.rightLeg.rotation.x = -sw;
          st.ch.leftArm.rotation.x = -sw * 0.65;
          st.ch.rightArm.rotation.x = sw * 0.65;
        });
        W.swayers.forEach(sw => {
          if (sw.mode === 'clap') {
            sw.ch.leftArm.rotation.x = -0.75 + Math.sin(elapsed * 6.0 + sw.phase) * 0.28;
            sw.ch.rightArm.rotation.x = -0.75 + Math.sin(elapsed * 6.0 + sw.phase + 0.3) * 0.28;
            sw.ch.root.position.y = Math.abs(Math.sin(elapsed * 3.0 + sw.phase)) * 0.06;
          } else if (sw.ch.head) {
            sw.ch.head.rotation.y = Math.sin(elapsed * 1.1 + sw.phase) * 0.18;
          }
        });
        W.hiddenAnimals.forEach((a, idx) => {
          if (!a.found && a.tail) a.tail.rotation.y = Math.sin(elapsed * 4.5 + idx) * 0.4;
        });
      };

      W.drawMiniMap = function (ctx, cw, ch, toMapX, toMapY) {
        ctx.fillStyle = '#ebd1ae';
        ctx.fillRect(0, 0, cw, ch);
        // Mosaic Plaza Center
        ctx.fillStyle = '#269e9e';
        ctx.beginPath(); ctx.arc(toMapX(0), toMapY(4), 17, 0, Math.PI * 2); ctx.fill();
        // West Lantern Bazaar & East Spice Souk
        ctx.fillStyle = '#d78162';
        ctx.fillRect(toMapX(-24), toMapY(-10), toMapX(-16) - toMapX(-24), toMapY(14) - toMapY(-10));
        ctx.fillRect(toMapX(16), toMapY(-10), toMapX(24) - toMapX(16), toMapY(14) - toMapY(-10));
        // North Riad Tea Courtyard
        ctx.fillStyle = '#1e8a7a';
        ctx.fillRect(toMapX(-9), toMapY(-25), toMapX(9) - toMapX(-9), toMapY(-14) - toMapY(-25));
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff9e8';
        ctx.fillText('RIAD TEA 🫖', toMapX(0), toMapY(-19));
        ctx.fillStyle = '#5c2414';
        ctx.fillText('LANTERNS', toMapX(-20), toMapY(2));
        ctx.fillText('SPICES', toMapX(20), toMapY(2));
        ctx.fillText('DRUMS 🥁', toMapX(-14), toMapY(24));
        ctx.fillText('GLOBE 🌍', toMapX(14), toMapY(24));
      };

      return W;
    }
  });
})(window.LailaSalma);
