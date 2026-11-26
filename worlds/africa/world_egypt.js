window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  // =========================================================================
  // WAVE 1 — ANCIENT EGYPT (Studio Ghibli Edition)
  // Golden Pyramids, Great Sphinx, Painted Temple Pylon, Shimmering Nile &
  // Felucca Boats, Emerald Date-Palm Oasis, Camels, Bakery & 5 Royal Mau Cats!
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

  function createDesertSandTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#f3d295');
      g.addColorStop(0.5, '#eac07a');
      g.addColorStop(1, '#f0cc8c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // Soft wind-sculpted desert sand ripples
      for (let y = 8; y < h; y += 22) {
        ctx.strokeStyle = 'rgba(255, 245, 214, 0.42)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 16) {
          const yy = y + Math.sin(x * 0.025 + y * 0.1) * 5;
          if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.stroke();
        ctx.strokeStyle = 'rgba(184, 126, 58, 0.18)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 16) {
          const yy = y + 5 + Math.sin(x * 0.025 + y * 0.1) * 5;
          if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      // Subtle painterly sand speckles
      for (let i = 0; i < 600; i++) {
        const sx = (i * 97) % w;
        const sy = (i * 193) % h;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,250,232,0.22)' : 'rgba(165,108,46,0.12)';
        ctx.fillRect(sx, sy, 2, 2);
      }
    }, 14, 14);
  }

  function createPyramidStoneTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#e5bd73';
      ctx.fillRect(0, 0, w, h);
      const rowH = 32;
      for (let row = 0; row < h / rowH; row++) {
        const y = row * rowH;
        const offset = (row % 2) * 32;
        for (let x = -32; x < w + 32; x += 64) {
          const shade = ((row * 7 + x) % 3);
          ctx.fillStyle = shade === 0 ? '#ebd093' : (shade === 1 ? '#dfb56b' : '#e6c27e');
          ctx.fillRect(x + offset + 2, y + 2, 60, rowH - 4);
          // Warm sunlit top highlight on each limestone course
          ctx.fillStyle = 'rgba(255, 248, 224, 0.34)';
          ctx.fillRect(x + offset + 2, y + 2, 60, 4);
          // Soft ochre shadow along bottom ledge
          ctx.fillStyle = 'rgba(138, 88, 34, 0.25)';
          ctx.fillRect(x + offset + 2, y + rowH - 5, 60, 3);
        }
      }
    }, 6, 6);
  }

  function createSandstonePlazaTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#eed4a2';
      ctx.fillRect(0, 0, w, h);
      const tile = 64;
      for (let r = 0; r < h / tile; r++) {
        for (let c = 0; c < w / tile; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#f3ddb0' : '#e8c98e';
          ctx.fillRect(c * tile + 2, r * tile + 2, tile - 4, tile - 4);
          ctx.strokeStyle = 'rgba(170, 120, 62, 0.28)';
          ctx.lineWidth = 2;
          ctx.strokeRect(c * tile + 2, r * tile + 2, tile - 4, tile - 4);
        }
      }
      // Subtle turquoise & lapis diamond inlays at corners
      ctx.fillStyle = 'rgba(34, 152, 162, 0.32)';
      for (let y = 0; y <= h; y += 128) {
        for (let x = 0; x <= w; x += 128) {
          ctx.beginPath();
          ctx.moveTo(x, y - 8); ctx.lineTo(x + 8, y); ctx.lineTo(x, y + 8); ctx.lineTo(x - 8, y);
          ctx.closePath(); ctx.fill();
        }
      }
    }, 6, 6);
  }

  function createHieroglyphMuralTex() {
    return makeCanvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#e9c88a';
      ctx.fillRect(0, 0, w, h);
      // Colorful Egyptian painted cornice stripes (lapis, turquoise, carnelian, gold)
      const bandCols = ['#1f4e8c', '#269e9e', '#c84b31', '#e8b339'];
      for (let i = 0; i < 16; i++) {
        ctx.fillStyle = bandCols[i % 4];
        ctx.fillRect(i * 32, 0, 30, 36);
        ctx.fillRect(i * 32, h - 36, 30, 36);
      }
      // Gold horizontal register lines
      ctx.strokeStyle = '#9e6b2b';
      ctx.lineWidth = 4;
      [44, 155, 266, 377, 470].forEach(y => {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      });
      // Painted stylized Egyptian symbols (Sun Disc, Ankh, Lotus, Eye, Waves)
      ctx.font = 'bold 46px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const rows = [
        ['☀️', '☥', '🪷', '👁️', '🪲', '☥'],
        ['🌊', '🦅', '☀️', '🐱', '🪷', '🌊'],
        ['☥', '👁️', '🔺', '☀️', '🪲', '🦅'],
        ['🪷', '🐱', '☥', '🌊', '☀️', '👁️']
      ];
      const colors = ['#1d4e89', '#1b8a8a', '#b83d27', '#8a5a18'];
      rows.forEach((row, rIdx) => {
        const cy = 100 + rIdx * 110;
        row.forEach((sym, cIdx) => {
          const cx = 44 + cIdx * 84;
          // Cartouche frame
          ctx.strokeStyle = colors[(rIdx + cIdx) % colors.length];
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(cx - 28, cy - 34, 56, 68, 18);
          ctx.stroke();
          ctx.fillStyle = colors[(rIdx + cIdx) % colors.length];
          ctx.fillText(sym, cx, cy + 2);
        });
      });
    }, 1, 1);
  }

  // Smooth sculpted Ghibli Date Palm builder (curved trunk + arching lush frond crown + dates!)
  function createDatePalm(scale) {
    const s = scale || 1.0;
    const g = new THREE.Group();
    const trunkMat = LS.makeToonMat(0x8c623d);
    const ringMat = LS.makeToonMat(0x704b2d);
    const frondA = LS.makeToonMat(0x3f8f46);
    const frondB = LS.makeToonMat(0x58ab4f);
    const dateMat = LS.makeToonMat(0xd4822a);

    let px = 0, py = 0;
    const segs = 9;
    const segH = 0.72 * s;
    for (let i = 0; i < segs; i++) {
      const t = i / (segs - 1);
      const rBot = (0.30 - t * 0.12) * s;
      const rTop = (0.27 - t * 0.11) * s;
      const tilt = 0.08 + t * 0.12;
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, segH * 1.05, 10), i % 2 === 0 ? trunkMat : ringMat);
      seg.position.set(px, py + segH * 0.5, 0);
      seg.rotation.z = -tilt;
      seg.castShadow = true;
      g.add(seg);
      px += Math.sin(tilt) * segH;
      py += Math.cos(tilt) * segH;
    }

    const crown = new THREE.Group();
    crown.position.set(px, py, 0);
    g.add(crown);

    // Golden hanging date clusters
    for (let d = 0; d < 4; d++) {
      const ang = (d / 4) * Math.PI * 2 + 0.4;
      const cl = new THREE.Mesh(new THREE.SphereGeometry(0.24 * s, 10, 8), dateMat);
      cl.scale.set(0.75, 1.35, 0.75);
      cl.position.set(Math.cos(ang) * 0.36 * s, -0.25 * s, Math.sin(ang) * 0.36 * s);
      crown.add(cl);
    }

    // 10 gracefully arching multi-segment palm fronds
    for (let f = 0; f < 10; f++) {
      const ang = (f / 10) * Math.PI * 2;
      const fg = new THREE.Group();
      fg.rotation.y = ang;
      const mat = f % 2 === 0 ? frondA : frondB;
      const basePitch = f % 2 === 0 ? 0.35 : 0.62;
      for (let k = 0; k < 4; k++) {
        const len = (0.85 - k * 0.12) * s;
        const w = (0.48 - k * 0.09) * s;
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06 * s, len), mat);
        const dist = (0.45 + k * 0.68) * s;
        const drop = Math.sin(basePitch) * dist - k * k * 0.16 * s;
        leaf.position.set(0, drop + 0.15 * s, dist);
        leaf.rotation.x = -basePitch + k * 0.34;
        leaf.castShadow = true;
        fg.add(leaf);
      }
      crown.add(fg);
    }

    return { root: g, crown };
  }

  // Smooth sculpted Ghibli Camel with colorful woven saddle blanket!
  function createDesertCamel(saddleHex) {
    const g = new THREE.Group();
    const fur = LS.makeToonMat(0xdca96c);
    const furDark = LS.makeToonMat(0xb98245);
    const hoof = LS.makeToonMat(0x593d26);
    const saddle = LS.makeToonMat(saddleHex || 0xc83e37);
    const gold = LS.makeToonMat(0xf4c44e);
    const eyeMat = LS.makeToonMat(0x1f1916);

    // Sculpted rounded torso + hump
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.88, 18, 14), fur);
    body.scale.set(0.82, 0.85, 1.48);
    body.position.set(0, 1.55, 0);
    body.castShadow = true;
    g.add(body);

    const hump = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 12), fur);
    hump.scale.set(0.85, 1.05, 1.0);
    hump.position.set(0, 2.22, -0.05);
    hump.castShadow = true;
    g.add(hump);

    // Colorful woven saddle blanket & golden tassels
    const blanket = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.78, 0.72, 16), saddle);
    blanket.scale.set(0.95, 1.0, 1.35);
    blanket.position.set(0, 2.02, -0.05);
    g.add(blanket);
    const trim = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.055, 8, 22), gold);
    trim.rotation.x = Math.PI / 2;
    trim.scale.set(0.95, 1.32, 1.0);
    trim.position.set(0, 1.72, -0.05);
    g.add(trim);

    // 4 slender articulated legs
    [[-0.36, 0.72], [0.36, 0.72], [-0.36, -0.78], [0.36, -0.78]].forEach(lp => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 1.32, 10), furDark);
      leg.position.set(lp[0], 0.68, lp[1]);
      leg.castShadow = true;
      g.add(leg);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.12, 10), hoof);
      foot.position.set(lp[0], 0.06, lp[1]);
      g.add(foot);
    });

    // Graceful curved neck & gentle head pivot
    const neckPivot = new THREE.Group();
    neckPivot.position.set(0, 1.65, 1.05);
    g.add(neckPivot);

    const neckLow = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.26, 0.85, 12), fur);
    neckLow.position.set(0, 0.18, 0.30);
    neckLow.rotation.x = 0.72;
    neckPivot.add(neckLow);

    const neckUp = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 0.92, 12), fur);
    neckUp.position.set(0, 0.84, 0.56);
    neckUp.rotation.x = -0.18;
    neckPivot.add(neckUp);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 12), fur);
    head.scale.set(0.86, 0.82, 1.38);
    head.position.set(0, 1.26, 0.74);
    neckPivot.add(head);

    [-0.14, 0.14].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), furDark);
      ear.position.set(ex, 1.44, 0.58);
      neckPivot.add(ear);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
      eye.position.set(ex * 1.15, 1.32, 0.86);
      neckPivot.add(eye);
    });

    // Red-and-gold bridle ring
    const bridle = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.03, 8, 16), saddle);
    bridle.position.set(0, 1.22, 0.92);
    neckPivot.add(bridle);

    return { root: g, neckPivot };
  }

  // Graceful Nile Felucca Sailboat (smooth curved wooden hull + billowing white triangular lateen sail!)
  function createNileFelucca(stripeHex) {
    const g = new THREE.Group();
    const hullMat = LS.makeToonMat(0x9a6234);
    const deckMat = LS.makeToonMat(0xd4a46a);
    const stripeMat = LS.makeToonMat(stripeHex || 0x1e8896);
    const sailMat = new THREE.MeshStandardMaterial({
      color: 0xfffaf0, roughness: 0.72, metalness: 0.0, side: THREE.DoubleSide
    });
    const mastMat = LS.makeToonMat(0x6d4524);

    // Smooth curved boat hull
    const hull = new THREE.Mesh(new THREE.SphereGeometry(1.75, 22, 14), hullMat);
    hull.scale.set(0.95, 0.45, 2.35);
    hull.position.y = 0.28;
    hull.castShadow = true;
    g.add(hull);

    const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.38, 0.14, 20), deckMat);
    deck.scale.set(1.0, 1.0, 2.25);
    deck.position.y = 0.56;
    g.add(deck);

    // Colorful turquoise/crimson gunwale stripe & woven seat cushions
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.10, 10, 24), stripeMat);
    rim.rotation.x = Math.PI / 2;
    rim.scale.set(0.98, 2.28, 1.0);
    rim.position.y = 0.64;
    g.add(rim);

    // Tall wooden mast & diagonal yardarm
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 5.2, 10), mastMat);
    mast.position.set(0, 3.1, 0.35);
    g.add(mast);

    const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 6.2, 10), mastMat);
    yard.position.set(0, 4.1, -0.15);
    yard.rotation.x = -0.68;
    g.add(yard);

    // Iconic billowing triangular lateen sail
    const sailShape = new THREE.Shape();
    sailShape.moveTo(0, 0);
    sailShape.quadraticCurveTo(0.65, 2.1, 0.1, 4.5);
    sailShape.lineTo(-2.9, 1.1);
    sailShape.quadraticCurveTo(-1.3, 0.25, 0, 0);
    const sailGeo = new THREE.ShapeGeometry(sailShape, 16);
    const sail = new THREE.Mesh(sailGeo, sailMat);
    sail.rotation.y = Math.PI / 2;
    sail.position.set(0.18, 1.35, 1.45);
    sail.castShadow = true;
    g.add(sail);

    // Small lantern at the bow
    const bowLantern = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), LS.makeEmissiveMat(0xfff4c2, 0xffb84d, 0.95));
    bowLantern.position.set(0, 1.15, 3.35);
    g.add(bowLantern);
    if (LS.createGlowSprite) {
      const halo = LS.createGlowSprite(0xffd27a, 1.35);
      halo.position.copy(bowLantern.position);
      g.add(halo);
    }

    return { root: g, sail };
  }

  // Royal Egyptian Mau Cat with sparkling turquoise-and-gold pharaoh collar!
  function createMauCat(coatHex, collarHex) {
    const cat = LS.createCatModel ? LS.createCatModel(coatHex || 0xd6c3a5, 0x7c6449) : { root: new THREE.Group(), tail: null };
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.145, 0.032, 8, 16),
      LS.makeEmissiveMat(collarHex || 0x22c7c7, 0xffd166, 0.45)
    );
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.34, 0.16);
    cat.root.add(collar);
    return cat;
  }

  LS.registerWorld('egypt', {
    build: function (worldGroup) {
      const W = {
        id: 'egypt',
        isInterior: false,
        skyMesh: null,
        colliders: [],
        zones: [],
        hiddenAnimals: [],
        palms: [],
        camels: [],
        feluccas: [],
        rideFelucca: null,
        birds: [],
        butterflies: [],
        breadSteam: [],
        lotuses: [],
        strollers: [],
        swayers: [],
        nileFish: [],
        wadingIbises: [],
        mochiStartPos: new THREE.Vector3(2.2, 0, 16.5)
      };

      function safeRun(name, fn) {
        try { fn(); } catch (e) { console.warn('[Egypt:' + name + ']', e); }
      }

      function addCollider(x, z, hw, hd) {
        W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
      }

      const desertTex = createDesertSandTex();
      const pyramidTex = createPyramidStoneTex();
      const plazaTex = createSandstonePlazaTex();
      const muralTex = createHieroglyphMuralTex();

      const sandMat = LS.makeSurfaceMat(desertTex, { roughness: 0.94 });
      const pyramidMat = LS.makeSurfaceMat(pyramidTex, { roughness: 0.86 });
      const plazaMat = LS.makeSurfaceMat(plazaTex, { roughness: 0.82 });
      const muralMat = LS.makeSurfaceMat(muralTex, { roughness: 0.78 });
      const limestoneMat = LS.makeToonMat(0xe8c78a);
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xf6c945, roughness: 0.28, metalness: 0.55 });
      const lapisMat = LS.makeToonMat(0x1f4f94);
      const turquoiseMat = LS.makeToonMat(0x1e9b9b);

      // ---------------------------------------------------------------------
      // 1. Studio Ghibli Sky Dome, Sunlit Desert Terrain & Sandstone Plaza
      // ---------------------------------------------------------------------
      safeRun('terrain', () => {
        W.skyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(210, 28, 18),
          new THREE.MeshBasicMaterial({
            map: LS.createSkyTexture(LS.state.timeMode, 'egypt'),
            side: THREE.BackSide,
            fog: false
          })
        );
        worldGroup.add(W.skyMesh);

        const ground = new THREE.Mesh(new THREE.PlaneGeometry(280, 280), sandMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        worldGroup.add(ground);

        // Central Inlaid Sandstone Plaza & Temple Processional Avenue
        const plaza = new THREE.Mesh(new THREE.CircleGeometry(15.5, 36), plazaMat);
        plaza.rotation.x = -Math.PI / 2;
        plaza.position.set(0, 0.03, 8.5);
        plaza.receiveShadow = true;
        worldGroup.add(plaza);

        const avenue = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 32), plazaMat);
        avenue.rotation.x = -Math.PI / 2;
        avenue.position.set(0, 0.035, -10.5);
        avenue.receiveShadow = true;
        worldGroup.add(avenue);

        // Path east to Nile Lotus Dock & west to Palm Oasis
        const dockPath = new THREE.Mesh(new THREE.PlaneGeometry(18, 5.2), plazaMat);
        dockPath.rotation.x = -Math.PI / 2;
        dockPath.position.set(11.5, 0.032, 3.0);
        worldGroup.add(dockPath);

        const oasisPath = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.8), plazaMat);
        oasisPath.rotation.x = -Math.PI / 2;
        oasisPath.position.set(-14.5, 0.032, 10.0);
        worldGroup.add(oasisPath);

        // Smooth rolling Ghibli desert dunes ringing the distant horizon
        const duneMat = LS.makeToonMat(0xe7bc72);
        [
          [-68, -42, 34, 9.5, 22], [62, -55, 38, 10.5, 26], [-72, 12, 30, 7.5, 32],
          [-55, 48, 36, 7.2, 22], [0, -76, 56, 11.5, 24], [-42, -68, 42, 9.8, 22]
        ].forEach(d => {
          const dune = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), duneMat);
          dune.scale.set(d[2], d[3], d[4]);
          dune.position.set(d[0], -1.8, d[1]);
          worldGroup.add(dune);
        });
      });

      // ---------------------------------------------------------------------
      // 2. Majestic Great Pyramids of Giza (North Skyline!)
      // ---------------------------------------------------------------------
      safeRun('pyramids', () => {
        function addPyramid(x, z, baseR, height, withGoldTip) {
          const pg = new THREE.Group();
          pg.position.set(x, 0, z);
          const body = new THREE.Mesh(new THREE.ConeGeometry(baseR, height, 4), pyramidMat);
          body.position.y = height * 0.5;
          body.rotation.y = Math.PI / 4;
          body.castShadow = true;
          body.receiveShadow = true;
          pg.add(body);

          if (withGoldTip) {
            const capH = height * 0.14;
            const cap = new THREE.Mesh(new THREE.ConeGeometry(baseR * 0.145, capH, 4), goldMat);
            cap.position.y = height - capH * 0.5 + 0.08;
            cap.rotation.y = Math.PI / 4;
            pg.add(cap);
            if (LS.createGlowSprite) {
              const glint = LS.createGlowSprite(0xfff0a8, 4.8);
              glint.position.set(0, height + 0.5, 0);
              pg.add(glint);
            }
          }
          worldGroup.add(pg);
        }

        // Great Pyramid of Khufu, Khafre & Menkaure silhouette!
        addPyramid(-16, -46, 22, 27, true);
        addPyramid(14, -52, 18, 22, true);
        addPyramid(-42, -48, 12.5, 14.5, false);
      });

      // ---------------------------------------------------------------------
      // 3. Smiling Studio Ghibli Great Sphinx (Northwest X=-17, Z=-12)
      // ---------------------------------------------------------------------
      safeRun('sphinx', () => {
        const sg = new THREE.Group();
        sg.position.set(-17.5, 0, -12.5);
        sg.rotation.y = 0.52;

        // Stepped sandstone pedestal
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.75, 12.5), pyramidMat);
        plinth.position.y = 0.375; plinth.receiveShadow = true; sg.add(plinth);

        // Smooth recumbent lion body
        const torso = new THREE.Mesh(new THREE.SphereGeometry(2.65, 22, 16), limestoneMat);
        torso.scale.set(0.88, 0.85, 1.92);
        torso.position.set(0, 2.35, -0.6);
        torso.castShadow = true;
        sg.add(torso);

        // Two outstretched front lion paws
        [-1.35, 1.35].forEach(px => {
          const pawArm = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 4.6, 14), limestoneMat);
          pawArm.rotation.x = Math.PI / 2;
          pawArm.position.set(px, 1.25, 3.6);
          pawArm.castShadow = true;
          sg.add(pawArm);
          const pawTip = new THREE.Mesh(new THREE.SphereGeometry(0.68, 14, 10), limestoneMat);
          pawTip.scale.set(1.0, 0.72, 1.25);
          pawTip.position.set(px, 1.18, 5.75);
          sg.add(pawTip);
        });

        // Royal striped Nemes headdress (gold & lapis blue!)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 4.55, 2.25);
        sg.add(headGroup);

        const nemes = new THREE.Mesh(new THREE.ConeGeometry(2.35, 3.4, 18), goldMat);
        nemes.scale.set(1.15, 1.0, 0.85);
        nemes.position.set(0, -0.35, -0.35);
        nemes.castShadow = true;
        headGroup.add(nemes);

        // Lapis stripes wrapping the headdress
        for (let i = 0; i < 4; i++) {
          const stripe = new THREE.Mesh(new THREE.TorusGeometry(1.42 + i * 0.22, 0.10, 8, 22), lapisMat);
          stripe.rotation.x = Math.PI / 2;
          stripe.scale.set(1.12, 0.85, 1.0);
          stripe.position.set(0, 0.35 - i * 0.52, -0.35);
          headGroup.add(stripe);
        }

        // Gentle sculpted Sphinx face
        const face = new THREE.Mesh(new THREE.SphereGeometry(1.18, 18, 14), limestoneMat);
        face.scale.set(0.92, 1.08, 0.95);
        face.position.set(0, 0.15, 0.45);
        headGroup.add(face);

        // Friendly eyes, smile & golden cobra uraeus crest
        const eyeMat = LS.makeToonMat(0x2c2018);
        [-0.42, 0.42].forEach(ex => {
          const eye = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), eyeMat);
          eye.position.set(ex, 0.35, 1.48);
          headGroup.add(eye);
        });
        const uraeus = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), goldMat);
        uraeus.scale.set(0.7, 1.4, 0.7);
        uraeus.position.set(0, 1.25, 1.22);
        headGroup.add(uraeus);

        // Dream Stele tablet between the paws
        const stele = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.9, 0.28), muralMat);
        stele.position.set(0, 1.65, 3.6);
        sg.add(stele);

        worldGroup.add(sg);
        addCollider(-17.5, -12.5, 4.4, 6.2);
      });

      // ---------------------------------------------------------------------
      // 4. Painted Karnak Temple Pylon, Lotus Colonnade & Hieroglyph Altar!
      // ---------------------------------------------------------------------
      safeRun('temple', () => {
        const tg = new THREE.Group();
        tg.position.set(0, 0, -24.5);

        // Twin sloping Pylon Towers with painted hieroglyphs
        [-6.2, 6.2].forEach(tx => {
          const tower = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.1, 10.5, 4), muralMat);
          tower.rotation.y = Math.PI / 4;
          tower.position.set(tx, 5.25, 0);
          tower.castShadow = true;
          tower.receiveShadow = true;
          tg.add(tower);

          const cornice = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.72, 6.0), turquoiseMat);
          cornice.position.set(tx, 10.6, 0);
          tg.add(cornice);

          // Tall slender Hieroglyph Obelisk in front of each tower
          const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.65, 9.2, 4), limestoneMat);
          ob.rotation.y = Math.PI / 4;
          ob.position.set(tx * 0.78, 4.6, 5.2);
          ob.castShadow = true;
          tg.add(ob);
          const tip = new THREE.Mesh(new THREE.ConeGeometry(0.54, 1.15, 4), goldMat);
          tip.rotation.y = Math.PI / 4;
          tip.position.set(tx * 0.78, 9.75, 5.2);
          tg.add(tip);
          addCollider(tx * 0.78, -19.3, 0.85, 0.85);
        });

        // Grand Winged Sun-Disc Lintel spanning the temple gateway
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(10.8, 2.2, 3.2), limestoneMat);
        lintel.position.set(0, 7.6, 0);
        tg.add(lintel);

        const templeSign = new THREE.Mesh(
          new THREE.BoxGeometry(7.6, 1.15, 0.22),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture('🔺 TEMPLE OF HIEROGLYPHS ☀️', {
              bg: '#1c4478', border: '#f4c44e', color: '#fff7dd', font: 'bold 34px sans-serif', width: 640, height: 110
            })
          })
        );
        templeSign.position.set(0, 7.6, 1.72);
        tg.add(templeSign);

        // Glowing Golden Secret Chamber Doorway + Interactive Pedestal
        const portal = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 6.4), LS.makeEmissiveMat(0xffe9a3, 0xffb703, 0.72));
        portal.position.set(0, 3.2, 0.2);
        tg.add(portal);

        const altar = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.92, 1.15, 16), lapisMat);
        altar.position.set(0, 0.58, 4.2);
        tg.add(altar);
        const scarabOrb = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 12), LS.makeEmissiveMat(0x4ef0e8, 0x22d3ee, 0.85));
        scarabOrb.position.set(0, 1.48, 4.2);
        tg.add(scarabOrb);
        if (LS.createGlowSprite) {
          const halo = LS.createGlowSprite(0x5ef5ed, 2.2);
          halo.position.copy(scarabOrb.position);
          tg.add(halo);
        }

        // Fluted Papyrus-Bud Colonnade flanking the processional avenue!
        [-6.2, 6.2].forEach(cx => {
          [10.5, 16.5, 22.5].forEach(cz => {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.68, 5.4, 16), limestoneMat);
            col.position.set(cx, 2.7, cz);
            col.castShadow = true;
            tg.add(col);
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.56, 0.95, 16), turquoiseMat);
            cap.position.set(cx, 5.85, cz);
            tg.add(cap);
            const band = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.08, 8, 18), goldMat);
            band.rotation.x = Math.PI / 2;
            band.position.set(cx, 5.25, cz);
            tg.add(band);
            addCollider(cx, -24.5 + cz, 0.9, 0.9);
          });
        });

        worldGroup.add(tg);
        addCollider(-6.2, -24.5, 3.8, 3.8);
        addCollider(6.2, -24.5, 3.8, 3.8);

        W.zones.push(
          {
            id: 'egypt_hieroglyphs',
            label: 'Crack the Temple Hieroglyph Code-Breaker 🔺📜',
            pos: new THREE.Vector3(0, 0, -18.4),
            radius: 2.9
          },
          {
            id: 'enter_egypt_chamber',
            label: 'Enter the Golden Pyramid Chamber 👑✨',
            pos: new THREE.Vector3(0, 0, -22.6),
            radius: 2.9
          }
        );
      });

      // ---------------------------------------------------------------------
      // 5. Shimmering Emerald-Turquoise Nile River, Lotus Dock & Feluccas!
      // ---------------------------------------------------------------------
      safeRun('nile_river', () => {
        const waterMat = LS.makeWaterMat(0.92);
        const river = new THREE.Mesh(new THREE.PlaneGeometry(42, 180), waterMat);
        river.rotation.x = -Math.PI / 2;
        river.position.set(41.0, 0.08, -4);
        river.renderOrder = -1;
        worldGroup.add(river);

        // Lush green Nile reed riverbank & sandstone quay wall
        const bankMat = LS.makeToonMat(0x5aa34e);
        const bank = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.34, 140), bankMat);
        bank.position.set(20.5, 0.14, -4);
        worldGroup.add(bank);

        // Wooden Lotus Pier jutting smoothly over the Nile (X=19..27, Z=3)
        const woodMat = LS.makeToonMat(0x9a673a);
        const pier = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.32, 4.4), woodMat);
        pier.position.set(23.2, 0.24, 3.0);
        pier.castShadow = true;
        pier.receiveShadow = true;
        worldGroup.add(pier);

        // Mooring posts with glowing amber dock lanterns
        [[27.0, 1.1], [27.0, 4.9], [22.0, 1.1], [22.0, 4.9]].forEach(mp => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 1.65, 10), woodMat);
          post.position.set(mp[0], 0.85, mp[1]);
          worldGroup.add(post);
          const orb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), LS.makeEmissiveMat(0xfff4c2, 0xffb84d, 0.9));
          orb.position.set(mp[0], 1.78, mp[1]);
          worldGroup.add(orb);
        });

        // Floating Nile Lotus flowers & lily pads
        const padMat = LS.makeToonMat(0x3a9148);
        const lotusColors = [0x60c5f1, 0xff9ebb, 0xfff3b0];
        for (let i = 0; i < 16; i++) {
          const lx = 24.5 + (i % 4) * 3.8 + Math.sin(i * 2.1) * 1.1;
          const lz = -28 + i * 4.2;
          if (Math.abs(lz - 3.0) < 3.6 && lx < 29.5) continue;
          const lg = new THREE.Group();
          lg.position.set(lx, 0.11, lz);
          const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 12), padMat);
          lg.add(pad);
          const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.20, 10, 8), LS.makeToonMat(lotusColors[i % 3]));
          bloom.position.y = 0.12;
          lg.add(bloom);
          worldGroup.add(lg);
          W.lotuses.push({ mesh: lg, phase: i * 0.7 });
        }

        // Dedicated Rideable Hero Felucca docked right beside the Wooden Lotus Pier!
        const heroFel = createNileFelucca(0xf4c44e);
        heroFel.root.position.set(29.8, 0.08, 3.0);
        heroFel.root.rotation.y = Math.PI;
        worldGroup.add(heroFel.root);
        W.rideFelucca = { obj: heroFel, dockPos: new THREE.Vector3(29.8, 0.08, 3.0), dockRotY: Math.PI };

        // Two Graceful Sailing Nile Feluccas cruising the far channel!
        const fel1 = createNileFelucca(0x1e8896);
        fel1.root.position.set(35.8, 0.08, -6.0);
        worldGroup.add(fel1.root);
        W.feluccas.push({ obj: fel1, baseX: 35.8, baseZ: -6.0, speed: 0.24, range: 16, phase: 0 });

        const fel2 = createNileFelucca(0xd1493f);
        fel2.root.position.set(44.0, 0.08, -14.0);
        worldGroup.add(fel2.root);
        W.feluccas.push({ obj: fel2, baseX: 44.0, baseZ: -14.0, speed: -0.19, range: 20, phase: 2.2 });

        // 3 Leaping Silver Nile Fish arcing out of the sparkling turquoise river!
        const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2f4ff, roughness: 0.22, metalness: 0.55 });
        [[31.5, -10.5], [34.2, 11.0], [29.8, -19.5]].forEach((fp, idx) => {
          const fg = new THREE.Group();
          const fBody = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), silverMat);
          fBody.scale.set(0.55, 0.72, 1.85);
          fg.add(fBody);
          const fTail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 4), silverMat);
          fTail.rotation.x = Math.PI / 2;
          fTail.position.z = -0.38;
          fg.add(fTail);
          fg.position.set(fp[0], -0.4, fp[1]);
          worldGroup.add(fg);
          W.nileFish.push({ mesh: fg, baseX: fp[0], baseZ: fp[1], phase: idx * 2.15 });
        });

        // 3 Wading White Nile Ibises stepping gently along the green riverbank!
        const ibisWhite = LS.makeToonMat(0xfffef8);
        const ibisDark = LS.makeToonMat(0x2a2420);
        [[21.2, -10.2], [21.6, 9.8], [21.0, -18.5]].forEach((ip, idx) => {
          const ig = new THREE.Group();
          const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), ibisWhite);
          body.scale.set(0.8, 0.85, 1.45);
          body.position.y = 0.62;
          ig.add(body);
          const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.42, 8), ibisDark);
          neck.position.set(0, 0.88, 0.25);
          neck.rotation.x = 0.25;
          ig.add(neck);
          const beak = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.34, 6), ibisDark);
          beak.rotation.x = Math.PI * 0.65;
          beak.position.set(0, 0.98, 0.44);
          ig.add(beak);
          [-0.08, 0.08].forEach(lx => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 6), ibisDark);
            leg.position.set(lx, 0.28, 0);
            ig.add(leg);
          });
          ig.position.set(ip[0], 0.22, ip[1]);
          ig.rotation.y = Math.PI * 0.45 + idx * 0.4;
          worldGroup.add(ig);
          W.wadingIbises.push({ mesh: ig, baseY: 0.22, phase: idx * 1.4 });
        });

        // Captain Tarek welcoming Laila & Salma at the Nile Pier
        const cap = LS.createAnimeCharacter({
          scale: 1.05, hairColor: 0x261d17, skinColor: 0xc99262,
          topColor: 0xf7f2e7, bottomColor: 0x1e6091, pants: true,
          faceOpts: { mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        cap.root.position.set(21.4, 0.36, 1.4);
        cap.root.rotation.y = -Math.PI / 2;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Captain Tarek ⛵', 'Ahlan! Hop aboard my white-sailed Felucca for a Nile sail! ⛵🪷');
          sb.position.set(0, 2.38, 0); cap.root.add(sb);
        }
        worldGroup.add(cap.root);

        // Keep players safely on the dry bank / pier
        addCollider(38.0, -4.0, 16.0, 75.0);

        W.zones.push({
          id: 'egypt_felucca',
          label: 'Sail a Nile Felucca with Captain Tarek ⛵🪷',
          pos: new THREE.Vector3(21.5, 0, 3.0),
          radius: 3.8
        });
      });

      // ---------------------------------------------------------------------
      // 6. Emerald Date-Palm Oasis, Adorned Camels & Ancient Honey Bakery!
      // ---------------------------------------------------------------------
      safeRun('oasis_and_bakery', () => {
        // Crystal Turquoise Oasis Pool (West X=-26, Z=+10)
        const rim = new THREE.Mesh(new THREE.TorusGeometry(6.2, 0.55, 10, 32), limestoneMat);
        rim.rotation.x = Math.PI / 2; rim.position.set(-26, 0.16, 10); worldGroup.add(rim);
        const oasisWater = new THREE.Mesh(new THREE.CircleGeometry(6.0, 32), LS.makeWaterMat(0.92));
        oasisWater.rotation.x = -Math.PI / 2; oasisWater.position.set(-26, 0.10, 10); worldGroup.add(oasisWater);
        const grassRing = new THREE.Mesh(new THREE.RingGeometry(6.0, 9.8, 32), LS.makeToonMat(0x52a34b));
        grassRing.rotation.x = -Math.PI / 2; grassRing.position.set(-26, 0.04, 10); worldGroup.add(grassRing);
        addCollider(-26, 10, 5.2, 5.2);

        // Lush ring of gracefully curved Date Palms around the Oasis & Nile!
        const palmSpots = [
          [-33.5, 6.5, 1.15], [-32.0, 15.8, 1.0], [-20.0, 17.5, 1.12], [-20.5, 3.2, 0.95],
          [18.2, -14.0, 1.18], [18.5, -4.5, 1.05], [18.4, 11.5, 1.12], [18.2, 20.5, 1.0],
          [-12.0, -25.0, 1.08], [12.5, -24.5, 1.12]
        ];
        palmSpots.forEach((p, idx) => {
          const palm = createDatePalm(p[2]);
          palm.root.position.set(p[0], 0, p[1]);
          palm.root.rotation.y = idx * 1.15;
          worldGroup.add(palm.root);
          W.palms.push({ obj: palm, phase: idx * 0.65 });
          addCollider(p[0], p[1], 0.55, 0.55);
        });

        // Two Adorned Desert Camels + Guide Karim!
        const cam1 = createDesertCamel(0xc83e37);
        cam1.root.position.set(-16.2, 0, 13.4);
        cam1.root.rotation.y = 1.05;
        worldGroup.add(cam1.root);
        W.camels.push({ obj: cam1, phase: 0, basePos: new THREE.Vector3(-16.2, 0, 13.4), baseRotY: 1.05 });
        addCollider(-16.2, 13.4, 1.2, 1.6);

        const cam2 = createDesertCamel(0x1e8896);
        cam2.root.position.set(-18.2, 0, 8.2);
        cam2.root.rotation.y = 0.45;
        worldGroup.add(cam2.root);
        W.camels.push({ obj: cam2, phase: 1.9, basePos: new THREE.Vector3(-18.2, 0, 8.2), baseRotY: 0.45 });
        addCollider(-18.2, 8.2, 1.2, 1.6);

        const karim = LS.createAnimeCharacter({
          scale: 1.04, hairColor: 0x241c16, skinColor: 0xc28a5c,
          topColor: 0xf4e3c1, bottomColor: 0x7c5334, pants: true,
          faceOpts: { eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        karim.root.position.set(-14.2, 0, 10.8);
        karim.root.rotation.y = Math.PI / 2;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Guide Karim 🐪', 'Meet Habibi & Shams — ready for a Golden Oasis Camel Ride? 🐪🌴');
          sb.position.set(0, 2.38, 0); karim.root.add(sb);
        }
        worldGroup.add(karim.root);

        W.zones.push({
          id: 'egypt_camel',
          label: 'Ride a Golden Oasis Camel 🐪🌴',
          pos: new THREE.Vector3(-14.0, 0, 11.2),
          radius: 3.6
        });

        // Ancient Nile Honey-Date Bakery & Pomegranate Stall (X=-12.5, Z=+22.5)
        const bg = new THREE.Group();
        bg.position.set(-12.5, 0, 22.5);
        bg.rotation.y = 0.55;

        const oven = new THREE.Mesh(new THREE.SphereGeometry(1.75, 18, 12), LS.makeToonMat(0xd69663));
        oven.scale.set(1.0, 1.15, 1.0);
        oven.position.set(-1.5, 1.1, -0.8);
        oven.castShadow = true;
        bg.add(oven);
        const ovenGlow = new THREE.Mesh(new THREE.CircleGeometry(0.55, 16), LS.makeEmissiveMat(0xffd066, 0xff7b29, 1.0));
        ovenGlow.position.set(-1.5, 0.95, 0.88);
        bg.add(ovenGlow);

        // Reed-shaded wooden stall & colorful awning
        const stallCounter = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.05, 1.4), LS.makeToonMat(0xb67b48));
        stallCounter.position.set(1.2, 0.52, 0.4);
        stallCounter.castShadow = true;
        bg.add(stallCounter);
        const awning = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.16, 2.6), LS.makeToonMat(0xc84b31));
        awning.position.set(1.2, 2.85, 0.2);
        awning.rotation.x = 0.18;
        bg.add(awning);
        [-1.1, 3.5].forEach(px => {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 2.9, 8), LS.makeToonMat(0x7c5334));
          p.position.set(px, 1.45, 1.1);
          bg.add(p);
        });

        // Flatbreads, golden honey jars & ruby pomegranates!
        for (let b = 0; b < 4; b++) {
          const loaf = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.08, 14), LS.makeToonMat(0xe8b76b));
          loaf.position.set(0.0 + b * 0.15, 1.10 + b * 0.08, 0.45);
          bg.add(loaf);
        }
        for (let p = 0; p < 5; p++) {
          const pom = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), LS.makeToonMat(0xc8324b));
          pom.position.set(1.5 + (p % 3) * 0.28, 1.18 + Math.floor(p / 3) * 0.18, 0.42);
          bg.add(pom);
        }
        const honeyJar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.42, 12), goldMat);
        honeyJar.position.set(2.6, 1.26, 0.42);
        bg.add(honeyJar);

        const bakerySign = new THREE.Mesh(
          new THREE.BoxGeometry(3.8, 0.78, 0.14),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture('🍯 ANCIENT BAKERY & FRUIT', {
              bg: '#fff3d6', border: '#c84b31', color: '#5c2d16', font: 'bold 28px sans-serif', width: 480, height: 100
            })
          })
        );
        bakerySign.position.set(1.2, 3.25, 1.2);
        bg.add(bakerySign);

        // Gentle bread-steam puffs
        for (let i = 0; i < 4; i++) {
          const puff = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 8, 6),
            new THREE.MeshBasicMaterial({ color: 0xfff8eb, transparent: true, opacity: 0.4 })
          );
          puff.userData = { baseX: -14.0, baseY: 2.6, baseZ: 21.8, phase: i * 0.25 };
          worldGroup.add(puff);
          W.breadSteam.push(puff);
        }

        worldGroup.add(bg);
        addCollider(-12.5, 22.5, 3.2, 2.2);

        const baker = LS.createAnimeCharacter({
          scale: 0.96, hairColor: 0x1d1613, skinColor: 0xce966a,
          topColor: 0xfdf5e6, bottomColor: 0x229999, hairBun: true,
          faceOpts: { eyeColor: '#3a2216', eyeHighlight: '#b07246', blush: 'rgba(226,114,98,0.4)' }
        });
        baker.root.position.set(-10.2, 0, 21.4);
        baker.root.rotation.y = 0.85;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Baker Nefertari 🍯', 'Warm honey Aish Baladi flatbread & pomegranate juice! 🍯✨');
          sb.position.set(0, 2.25, 0); baker.root.add(sb);
        }
        worldGroup.add(baker.root);

        W.zones.push({
          id: 'egypt_bakery',
          label: 'Taste Warm Honey Flatbread & Pomegranate Juice 🍯🫓',
          pos: new THREE.Vector3(-10.2, 0, 22.8),
          radius: 3.4
        });
      });

      // ---------------------------------------------------------------------
      // 7. Scribe Imhotep (Local Teacher!) & Magic World Globe Pedestal
      // ---------------------------------------------------------------------
      safeRun('teacher_and_globe', () => {
        const imhotep = LS.createAnimeCharacter({
          scale: 1.06, hairColor: 0x2c2420, skinColor: 0xc78f60,
          topColor: 0xfff8e7, bottomColor: 0x1f4f94, pants: true,
          faceOpts: { glasses: true, mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        imhotep.root.position.set(-5.8, 0, 9.2);
        imhotep.root.rotation.y = 0.65;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Scribe Imhotep 📜', 'Welcome to Ancient Egypt! Ready for a fun Pyramids & Nile Quiz? 📜☀️');
          sb.position.set(0, 2.4, 0); imhotep.root.add(sb);
        }
        worldGroup.add(imhotep.root);

        W.zones.push({
          id: 'egypt_teacher_quiz',
          label: "Take Scribe Imhotep's Ancient Egypt Quiz 📜☀️",
          pos: new THREE.Vector3(-5.8, 0, 9.2),
          radius: 3.4
        });

        // Glowing Magic World Globe Pedestal on the South Plaza!
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.82, 1.1, 16), lapisMat);
        ped.position.set(8.2, 0.55, 13.5);
        worldGroup.add(ped);
        const globe = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 14), LS.makeEmissiveMat(0x4cc9f0, 0x2ec4b6, 0.55));
        globe.position.set(8.2, 1.65, 13.5);
        worldGroup.add(globe);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.06, 10, 24), goldMat);
        ring.position.set(8.2, 1.65, 13.5);
        ring.rotation.x = 0.55;
        worldGroup.add(ring);
        W.magicGlobe = globe;
        W.magicRing = ring;
        addCollider(8.2, 13.5, 0.9, 0.9);

        W.zones.push({
          id: 'magic_globe',
          label: 'Spin the Magic World Globe (Travel Anywhere!) 🌍✨',
          pos: new THREE.Vector3(8.2, 0, 13.5),
          radius: 3.4
        });
      });

      // ---------------------------------------------------------------------
      // 8. 5 Hiding Royal Egyptian Mau Cats (Golden Collars!)
      // ---------------------------------------------------------------------
      safeRun('hidden_mau_cats', () => {
        const spotPool = [
          { pos: [-12.2, 0, -6.5], hint: 'Sunbathing near the smiling Great Sphinx paws!' },
          { pos: [17.2, 0, -8.2], hint: 'Watching white-sailed feluccas along the Nile palms!' },
          { pos: [-22.5, 0, 18.8], hint: 'Cooling off beside the emerald Date-Palm Oasis!' },
          { pos: [8.8, 0, -16.8], hint: 'Peeking from behind the painted Temple Colonnade!' },
          { pos: [-7.5, 0, 24.5], hint: 'Sniffing warm honey bread near Nefertari\'s Bakery!' },
          { pos: [15.8, 0, 14.5], hint: 'Napping under the southern Nile date palms!' },
          { pos: [-8.2, 0, -21.0], hint: 'Hiding behind a golden-tipped temple obelisk!' }
        ];
        const names = ['Bastet', 'Cleo', 'Nile', 'Saffron', 'Anubis'];
        const coats = [0xd6c3a5, 0xc9a87a, 0xe8d8be, 0xb89672, 0xdcc7a4];
        const collars = [0x22c7c7, 0xffd166, 0x3b82f6, 0xf472b6, 0x34d399];

        const chosen = LS.pickRoundSpots(spotPool, LS.state.egyptCatsRound || 0, 5);
        const foundList = LS.state.foundEgyptCats || [];

        chosen.forEach((spot, idx) => {
          const id = 'egypt_cat_' + idx;
          const cat = createMauCat(coats[idx], collars[idx]);
          cat.root.position.set(spot.pos[0], 0, spot.pos[2]);
          cat.root.rotation.y = idx * 1.25;
          const already = foundList.includes(id);
          cat.root.visible = !already;
          worldGroup.add(cat.root);

          W.hiddenAnimals.push({
            id: id,
            kind: 'egypt_cat',
            name: names[idx] + ' the Royal Mau Cat',
            hint: spot.hint,
            mesh: cat.root,
            tail: cat.tail,
            found: already
          });
          if (!already) {
            W.zones.push({
              id: 'animal:' + id,
              label: 'Befriend ' + names[idx] + ' the Royal Mau Cat 🐱👑',
              pos: new THREE.Vector3(spot.pos[0], 0, spot.pos[2]),
              radius: 2.8
            });
          }
        });
      });

      // ---------------------------------------------------------------------
      // 9. Soaring Nile Ibises & Oasis Butterflies (Studio Ghibli Life!)
      // ---------------------------------------------------------------------
      safeRun('ambient_life', () => {
        const whiteMat = LS.makeToonMat(0xfffdf8);
        for (let i = 0; i < 6; i++) {
          const bg = new THREE.Group();
          const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), whiteMat);
          body.scale.set(0.8, 0.7, 2.0);
          bg.add(body);
          const lw = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.24), whiteMat);
          lw.position.x = -0.36; bg.add(lw);
          const rw = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.24), whiteMat);
          rw.position.x = 0.36; bg.add(rw);
          worldGroup.add(bg);
          W.birds.push({ root: bg, lw, rw, r: 16 + i * 4.5, h: 12 + (i % 3) * 3.5, spd: 0.22 + i * 0.03, phase: i * 1.1 });
        }

        const bfCols = [0x38bdf8, 0xfacc15, 0xfb7185, 0x34d399];
        for (let i = 0; i < 8; i++) {
          const bf = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), LS.makeEmissiveMat(bfCols[i % 4], bfCols[i % 4], 0.5));
          worldGroup.add(bf);
          W.butterflies.push({ mesh: bf, cx: -24 + (i % 4) * 5, cz: 8 + Math.floor(i / 4) * 6, phase: i * 0.9 });
        }
      });

      // ---------------------------------------------------------------------
      // 10. Papyrus & Pottery Market Alley, Royal Boutique & 10+ Lively NPCs!
      // ---------------------------------------------------------------------
      safeRun('nile_bazaar_and_crowd', () => {
        const woodMat = LS.makeToonMat(0x8e5c34);
        const terracottaMat = LS.makeToonMat(0xc85b37);
        const clothTurq = LS.makeToonMat(0x1f9c9c);
        const clothGold = LS.makeToonMat(0xf4be44);
        const clothLapis = LS.makeToonMat(0x1f4f94);

        // Market Alley Pergola (East of Avenue: X=12.4, Z=-9.5)
        const mg = new THREE.Group();
        mg.position.set(12.4, 0, -9.5);
        mg.rotation.y = -Math.PI / 2;

        // 2 Timber Market Counters (Pottery & Papyrus + Royal Linen Boutique)
        [-3.4, 3.4].forEach((sx, idx) => {
          const counter = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.02, 1.45), woodMat);
          counter.position.set(sx, 0.51, 0); counter.castShadow = true; counter.receiveShadow = true; mg.add(counter);
          const canopy = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.16, 2.9), idx === 0 ? clothTurq : clothLapis);
          canopy.position.set(sx, 3.05, 0.25); canopy.rotation.x = 0.16; canopy.castShadow = true; mg.add(canopy);
          [-2.3, 2.3].forEach(px => {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 3.05, 8), woodMat);
            post.position.set(sx + px, 1.52, 0.72); mg.add(post);
          });
        });

        // Painted Terracotta Amphorae & Rolled Golden Papyrus Scrolls on Left Stall!
        for (let a = 0; a < 5; a++) {
          const amp = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), a % 2 === 0 ? terracottaMat : clothTurq);
          amp.scale.set(0.82, 1.38, 0.82);
          amp.position.set(-5.0 + a * 0.72, 1.35, 0.1);
          mg.add(amp);
          const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.22, 10), goldMat);
          neck.position.set(-5.0 + a * 0.72, 1.74, 0.1);
          mg.add(neck);
        }
        for (let s = 0; s < 4; s++) {
          const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.56, 10), LS.makeToonMat(0xf5e1b0));
          scroll.rotation.z = Math.PI / 2;
          scroll.position.set(-1.9 + s * 0.18, 1.12 + (s % 2) * 0.14, 0.25);
          mg.add(scroll);
        }

        // Royal Egyptian Gold-Collar Outfits & Turquoise Jewel Display on Right Stall!
        [1.8, 3.4, 5.0].forEach((bx, idx) => {
          const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 0.92, 12), idx === 1 ? clothGold : LS.makeToonMat(0xfffaf0));
          stand.position.set(bx, 1.48, 0.08); mg.add(stand);
          const collar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 8, 16), goldMat);
          collar.rotation.x = Math.PI / 2;
          collar.position.set(bx, 1.88, 0.08); mg.add(collar);
        });

        const marketSign = new THREE.Mesh(
          new THREE.BoxGeometry(5.2, 0.82, 0.14),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture('🏺 PAPYRUS & POTTERY SOUK', {
              bg: '#fff3d6', border: '#1f9c9c', color: '#1b3d54', font: 'bold 26px sans-serif', width: 500, height: 92
            })
          })
        );
        marketSign.position.set(-3.4, 3.48, 1.25); mg.add(marketSign);

        const boutiqueSign = new THREE.Mesh(
          new THREE.BoxGeometry(5.2, 0.82, 0.14),
          new THREE.MeshBasicMaterial({
            map: LS.createSignTexture('👑 ROYAL EGYPT BOUTIQUE ✨', {
              bg: '#1c4478', border: '#f4c44e', color: '#fff8db', font: 'bold 26px sans-serif', width: 500, height: 92
            })
          })
        );
        boutiqueSign.position.set(3.4, 3.48, 1.25); mg.add(boutiqueSign);

        worldGroup.add(mg);
        addCollider(12.4, -9.5, 1.8, 6.2);

        // 1) Potter Amenhotep beside the Pottery Stall
        const amenhotep = LS.createAnimeCharacter({
          scale: 1.02, hairColor: 0x221b17, skinColor: 0xc28a5e,
          topColor: 0xf7ecd4, bottomColor: 0x9c4a2b, pants: true,
          faceOpts: { mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#8c623d' }
        });
        amenhotep.root.position.set(10.0, 0, -12.6);
        amenhotep.root.rotation.y = -Math.PI / 2;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Potter Amenhotep 🏺', 'Hand-painted Nile clay jars & golden lotus amphorae! 🏺✨');
          sb.position.set(0, 2.36, 0); amenhotep.root.add(sb);
        }
        worldGroup.add(amenhotep.root);

        // 2) Royal Tailor & Papyrus Artist Merit at the Egyptian Boutique!
        const merit = LS.createAnimeCharacter({
          scale: 0.96, hairColor: 0x1a1412, skinColor: 0xd09a70,
          topColor: 0xfff8e7, bottomColor: 0x1f4f94, longHair: true,
          faceOpts: { eyeColor: '#3a2216', eyeHighlight: '#b07246', blush: 'rgba(226,114,98,0.4)' }
        });
        merit.root.position.set(10.0, 0, -6.2);
        merit.root.rotation.y = -Math.PI / 2;
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Artist Merit 👑', 'Try on our Royal Gold-Collar Linen Outfits for Laila & Salma! 👗✨');
          sb.position.set(0, 2.26, 0); merit.root.add(sb);
        }
        worldGroup.add(merit.root);

        W.zones.push({
          id: 'egypt_boutique',
          label: 'Try On Royal Ancient Egyptian Outfits 👑👗✨',
          pos: new THREE.Vector3(9.4, 0, -6.2),
          radius: 3.4
        });

        // 3) Water-Jar Carrier Hapi walking peacefully along the Nile bank!
        const hapi = LS.createAnimeCharacter({
          scale: 0.95, hairColor: 0x1d1613, skinColor: 0xc89166,
          topColor: 0x229999, bottomColor: 0xf7ecd4, hairBun: true
        });
        const headJar = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), terracottaMat);
        headJar.scale.set(0.85, 1.3, 0.85);
        headJar.position.set(0, 1.88, 0);
        hapi.root.add(headJar);
        if (LS.createSpeechBubbleSprite) {
          const sb = LS.createSpeechBubbleSprite('Hapi (Nile Carrier) 🏺', 'Fresh cool Nile water for our palm oasis gardens! 🪷💧');
          sb.position.set(0, 2.45, 0); hapi.root.add(sb);
        }
        worldGroup.add(hapi.root);
        W.strollers.push({ ch: hapi, rx: 1.6, rz: 10.5, cx: 16.5, cz: -4.0, speed: 0.22, phase: 0.4 });

        // 4 & 5) Two Egyptian Harp & Tambourine Musicians swaying on the Sunlit Plaza!
        const plazaMusicians = [
          { x: 5.8, z: 12.2, rotY: -0.75, cfg: { scale: 1.0, hairColor: 0x241a15, skinColor: 0xc28a5c, topColor: 0xf4c44e, bottomColor: 0x1f4f94, pants: true } },
          { x: 4.2, z: 13.8, rotY: -0.35, cfg: { scale: 0.94, hairColor: 0x1b1411, skinColor: 0xd19b72, topColor: 0x1e9b9b, bottomColor: 0xfff3d6, hairBun: true } }
        ];
        plazaMusicians.forEach((pm, idx) => {
          const ch = LS.createAnimeCharacter(pm.cfg);
          ch.root.position.set(pm.x, 0, pm.z);
          ch.root.rotation.y = pm.rotY;
          worldGroup.add(ch.root);
          W.swayers.push({ ch, phase: idx * 1.4 });
        });

        // 6–10) Five Animated Strolling Ancient Egyptian Families & Explorers!
        const egyptStrollers = [
          { rx: 8.8, rz: 7.4, cx: 0.0, cz: 7.5, speed: 0.23, phase: 0.0, cfg: { scale: 0.98, hairColor: 0x241a15, skinColor: 0xc99166, topColor: 0xfff8e7, bottomColor: 0xc84b31, pants: true } },
          { rx: 9.8, rz: 8.2, cx: -1.0, cz: 8.0, speed: -0.20, phase: 1.8, cfg: { scale: 0.94, hairColor: 0x1d1411, skinColor: 0xd29c74, topColor: 0x229999, bottomColor: 0xf7ecd4, longHair: true } },
          { rx: 5.5, rz: 9.5, cx: -9.5, cz: 3.5, speed: 0.21, phase: 3.1, cfg: { scale: 0.86, hairColor: 0x2b1f18, skinColor: 0xc78f64, topColor: 0xf4be44, bottomColor: 0x1f4f94, pants: true } },
          { rx: 10.6, rz: 6.4, cx: 1.5, cz: 9.2, speed: 0.18, phase: 4.5, cfg: { scale: 0.95, hairColor: 0x221712, skinColor: 0xce966c, topColor: 0xe05780, bottomColor: 0xfff5e0, hairBun: true } },
          { rx: 6.8, rz: 6.8, cx: -1.5, cz: -5.5, speed: -0.24, phase: 5.6, cfg: { scale: 1.01, hairColor: 0x2a201a, skinColor: 0xc0885c, topColor: 0xf5e6c8, bottomColor: 0x1e6091, pants: true } }
        ];
        egyptStrollers.forEach(sd => {
          const ch = LS.createAnimeCharacter(sd.cfg);
          worldGroup.add(ch.root);
          W.strollers.push({ ch, rx: sd.rx, rz: sd.rz, cx: sd.cx, cz: sd.cz, speed: sd.speed, phase: sd.phase });
        });
      });

      W.getZoneLabel = function (x, z) {
        if (z < -16) return 'Painted Temple & Pyramid Chamber 🔺👑';
        if (x < -11 && z < -4) return 'Great Sphinx Terrace 🦁';
        if (x > 7 && z < -2 && x <= 16) return 'Papyrus, Pottery & Royal Boutique 🏺👑';
        if (x > 16) return 'Shimmering Nile Lotus Dock ⛵';
        if (x < -14 && z > 2 && z < 19) return 'Emerald Date-Palm Oasis 🐪';
        if (x < -7 && z >= 19) return 'Ancient Honey-Date Bakery 🍯';
        return 'Sunlit Pyramid Plaza ☀️';
      };

      W.update = function (dt, elapsed) {
        if (W.magicGlobe) W.magicGlobe.rotation.y += dt * 0.7;
        if (W.magicRing) W.magicRing.rotation.z += dt * 0.45;
        W.palms.forEach(p => {
          p.obj.crown.rotation.z = Math.sin(elapsed * 1.2 + p.phase) * 0.045;
          p.obj.crown.rotation.x = Math.cos(elapsed * 0.9 + p.phase) * 0.03;
        });
        const isCamelRiding = LS.runtime && LS.runtime.wave1Anim && LS.runtime.wave1Anim.mode === 'egypt_camel';
        W.camels.forEach(c => {
          c.obj.neckPivot.rotation.x = Math.sin(elapsed * (isCamelRiding ? 3.2 : 1.4) + c.phase) * 0.09;
          c.obj.neckPivot.rotation.y = Math.sin(elapsed * 0.7 + c.phase) * 0.12;
        });
        const isFeluccaSailing = LS.runtime && LS.runtime.wave1Anim && LS.runtime.wave1Anim.mode === 'egypt_felucca';
        if (W.rideFelucca && !isFeluccaSailing) {
          W.rideFelucca.obj.root.position.set(
            W.rideFelucca.dockPos.x,
            0.08 + Math.sin(elapsed * 2.0) * 0.05,
            W.rideFelucca.dockPos.z
          );
          W.rideFelucca.obj.root.rotation.set(0, W.rideFelucca.dockRotY, Math.sin(elapsed * 1.5) * 0.04);
        }
        W.feluccas.forEach(f => {
          const z = f.baseZ + Math.sin(elapsed * f.speed + f.phase) * f.range;
          f.obj.root.position.set(f.baseX + Math.cos(elapsed * 0.4 + f.phase) * 1.2, 0.08 + Math.sin(elapsed * 2.2 + f.phase) * 0.05, z);
          f.obj.root.rotation.z = Math.sin(elapsed * 1.6 + f.phase) * 0.045;
          f.obj.root.rotation.y = Math.cos(elapsed * f.speed + f.phase) >= 0 ? 0 : Math.PI;
        });
        W.nileFish.forEach(nf => {
          const cyc = (elapsed * 0.42 + nf.phase) % 2.8;
          if (cyc < 1.0) {
            nf.mesh.visible = true;
            const y = Math.sin(cyc * Math.PI) * 1.45 - 0.15;
            nf.mesh.position.set(nf.baseX, y, nf.baseZ + (cyc - 0.5) * 2.2);
            nf.mesh.rotation.x = -(0.5 - cyc) * 1.4;
          } else {
            nf.mesh.visible = false;
          }
        });
        W.wadingIbises.forEach(ib => {
          ib.mesh.position.y = ib.baseY + Math.abs(Math.sin(elapsed * 1.6 + ib.phase)) * 0.05;
          ib.mesh.rotation.x = Math.max(0, Math.sin(elapsed * 1.2 + ib.phase) - 0.65) * 0.9;
        });
        W.strollers.forEach(st => {
          const a = elapsed * st.speed + st.phase;
          const nx = st.cx + Math.cos(a) * st.rx;
          const nz = st.cz + Math.sin(a) * st.rz;
          const dx = -Math.sin(a) * st.rx * st.speed;
          const dz = Math.cos(a) * st.rz * st.speed;
          st.ch.root.position.set(nx, 0, nz);
          st.ch.root.rotation.y = Math.atan2(dx, dz);
          const sw = Math.sin(elapsed * 6.2 + st.phase) * 0.46;
          st.ch.leftLeg.rotation.x = sw;
          st.ch.rightLeg.rotation.x = -sw;
          st.ch.leftArm.rotation.x = -sw * 0.65;
          st.ch.rightArm.rotation.x = sw * 0.65;
        });
        W.swayers.forEach(sw => {
          sw.ch.leftArm.rotation.x = -0.68 + Math.sin(elapsed * 4.8 + sw.phase) * 0.22;
          sw.ch.rightArm.rotation.x = -0.68 + Math.sin(elapsed * 4.8 + sw.phase + 0.5) * 0.22;
          sw.ch.root.position.y = Math.abs(Math.sin(elapsed * 2.4 + sw.phase)) * 0.04;
        });
        W.lotuses.forEach(l => {
          l.mesh.position.y = 0.11 + Math.sin(elapsed * 2.0 + l.phase) * 0.025;
        });
        W.breadSteam.forEach(p => {
          const t = (elapsed * 0.4 + p.userData.phase) % 1.0;
          p.position.set(p.userData.baseX + Math.sin(elapsed * 2 + p.userData.phase * 6) * 0.25, p.userData.baseY + t * 2.2, p.userData.baseZ);
          p.scale.setScalar(0.6 + t * 1.1);
          p.material.opacity = (1 - t) * 0.38;
        });
        W.birds.forEach(b => {
          const a = elapsed * b.spd + b.phase;
          b.root.position.set(Math.cos(a) * b.r, b.h + Math.sin(elapsed * 1.8 + b.phase) * 0.6, -24 + Math.sin(a) * b.r * 0.75);
          b.root.rotation.y = -a;
          const flap = Math.sin(elapsed * 7.5 + b.phase) * 0.42;
          b.lw.rotation.z = flap;
          b.rw.rotation.z = -flap;
        });
        W.butterflies.forEach(b => {
          b.mesh.position.set(
            b.cx + Math.sin(elapsed * 1.4 + b.phase) * 2.2,
            1.2 + Math.sin(elapsed * 3.8 + b.phase) * 0.45,
            b.cz + Math.cos(elapsed * 1.1 + b.phase) * 2.2
          );
        });
        W.hiddenAnimals.forEach((a, idx) => {
          if (!a.found && a.tail) a.tail.rotation.z = Math.sin(elapsed * 3.8 + idx) * 0.32;
        });
      };

      W.drawMiniMap = function (ctx, cw, ch, toMapX, toMapY) {
        ctx.fillStyle = '#f0cc8c';
        ctx.fillRect(0, 0, cw, ch);
        // Shimmering Nile River along East edge
        ctx.fillStyle = '#38b2ac';
        ctx.fillRect(toMapX(21), 0, cw - toMapX(21), ch);
        // Sandstone Plaza & Avenue
        ctx.fillStyle = '#e5bc78';
        ctx.beginPath(); ctx.arc(toMapX(0), toMapY(8.5), 19, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(toMapX(-4.5), toMapY(-24), toMapX(4.5) - toMapX(-4.5), toMapY(8) - toMapY(-24));
        // Oasis Pool
        ctx.fillStyle = '#2dd4bf';
        ctx.beginPath(); ctx.arc(toMapX(-26), toMapY(10), 9, 0, Math.PI * 2); ctx.fill();
        // Landmarks
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#7c4a12';
        ctx.fillText('🔺 PYRAMIDS', toMapX(0), toMapY(-46));
        ctx.fillText('CHAMBER 👑', toMapX(0), toMapY(-24));
        ctx.fillText('SPHINX', toMapX(-18), toMapY(-12));
        ctx.fillText('SOUK 🏺', toMapX(12), toMapY(-10));
        ctx.fillText('OASIS 🐪', toMapX(-26), toMapY(11));
        ctx.fillText('BAKERY 🍯', toMapX(-12), toMapY(26));
        ctx.fillStyle = '#0f5156';
        ctx.fillText('NILE ⛵', toMapX(28), toMapY(4));
      };

      return W;
    }
  });
})(window.LailaSalma);
