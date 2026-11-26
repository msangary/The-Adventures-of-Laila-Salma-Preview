window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  // Organic meandering Serengeti Safari Jeep dirt loop & footpaths
  const SAFARI_LOOP_PTS = [
    [-4.8, 7.8], [-12.5, 4.5], [-16.0, -4.5], [-14.0, -16.5],
    [-10.5, -24.5], [0.0, -25.5], [14.0, -23.0], [23.5, -13.0],
    [24.5, 0.5], [19.5, 11.5], [8.5, 11.0], [-4.8, 7.8]
  ];
  const SAFARI_SOUTH_TRAIL = [
    [0.0, 29.0], [0.0, 20.0], [0.0, 12.0], [-4.8, 7.8]
  ];
  const SAFARI_AIRSTRIP_TRAIL = [
    [8.5, 11.0], [16.5, 17.5], [22.5, 24.5], [27.0, 28.0]
  ];
  const SAFARI_GIRAFFE_TRAIL = [
    [-12.5, 4.5], [-17.5, 3.2], [-21.2, 2.0]
  ];
  const SAFARI_PLAY_TRAIL = [
    [0.0, 20.0], [-10.0, 23.5], [-18.5, 26.5]
  ];

  function strokeMapSpline(ctx, pts, toMapX, toMapY, color, width) {
    const sp = LS.scenery.sampleSpline(pts, 6);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    sp.forEach((p, idx) => {
      const mx = toMapX(p[0]), my = toMapY(p[1]);
      if (idx === 0) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    });
    ctx.stroke();
  }

  LS.registerWorld('safari', {
    build: function (worldGroup, scene) {
      const SC = LS.scenery;
      const W = {
        id: 'safari',
        isInterior: false,
        skyMesh: null,
        colliders: [],
        zones: [],
        hiddenAnimals: [],
        giraffes: [],
        elephants: [],
        flamingos: [],
        zebras: [],
        hippos: [],
        meerkats: [],
        sprayDrops: [],
        hippoBubbles: [],
        campfireFlames: [],
        savannaBirds: [],
        butterflies: [],
        fireflies: [],
        wildlifePhotoTargets: [],
        splashRings: [],
        windsock: null,
        propeller: null,
        safariJeep: null,
        jeepPath: null,
        jeepHome: null,
        hotAirBalloon: null,
        balloonFlame: null,
        balloonHome: null,
        kingLionMesh: null,
        roarRing: null,
        cheetahObj: null,
        cheetahTrack: null,
        watchtowerPos: new THREE.Vector3(-7.5, 6.2, -9.0),
        mochiStartPos: new THREE.Vector3(2.2, 0, 15.8),
        slideStartPos: new THREE.Vector3(-22.8, 2.1, 25.0),
        slideEndPos: new THREE.Vector3(-22.8, 0.15, 29.0),
        swingSeatPos: new THREE.Vector3(-17.8, 0.72, 29.8),
        hopscotchPos: new THREE.Vector3(-16.0, 0, 24.8)
      };

      function safeRun(name, fn) {
        try { fn(); } catch (e) { console.warn('[Safari:' + name + ']', e); }
      }

      function addCollider(x, z, hw, hd) {
        W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
      }

      // Smooth walkable height for Giraffe Feeding Deck + Arched Wooden Rope Suspension Bridge!
      W.getGroundHeight = function (x, z) {
        // Gentle east ramp ascending from X=-20.0 (y=0) up to X=-22.2 (y=0.85)
        if (x <= -19.8 && x >= -22.2 && z >= 0.4 && z <= 3.6) {
          const t = Math.max(0, Math.min(1, (-19.8 - x) / 2.4));
          return t * 0.85;
        }
        // Flat elevated Giraffe Feeding Deck platform
        if (x < -22.2 && x >= -26.8 && z >= -0.6 && z <= 4.6) {
          return 0.85;
        }
        // Arched Wooden Rope Suspension Bridge spanning the Savanna Stream (X=1.6..4.8, Z=-26.8..-32.8)
        if (x >= 1.55 && x <= 4.85 && z >= -32.8 && z <= -26.8) {
          const t = (z + 32.8) / 6.0; // 0..1 across span
          return Math.sin(t * Math.PI) * 0.86;
        }
        return 0;
      };

      // Procedural & HD Tree Builders (Umbrella Acacia + Majestic Baobab with Crisp Miyazaki Leaf Cards!)
      function addAcacia(x, z, scale, noCol) {
        const s = scale || 1.0;
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        g.rotation.y = x * 0.73 + z * 0.41;
        if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_acacia')) {
          const m = LS.hdAssets.clone('anime_acacia');
          m.scale.setScalar(s * 1.12);
          g.add(m);
        } else {
          const barkTex = (LS.ghibli && LS.ghibli.getBarkTexture) ? LS.ghibli.getBarkTexture() : null;
          const bark = LS.makeToonMat(0x7c5838, barkTex ? { map: barkTex } : undefined);
          const leafA = LS.makeToonMat(0x6b8e3e), leafB = LS.makeToonMat(0x94ad48);
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * s, 0.34 * s, 2.8 * s, 8), bark);
          trunk.position.y = 1.4 * s; trunk.rotation.z = 0.06; trunk.castShadow = true; g.add(trunk);
          [[0.85, 0.3, -0.58], [-0.9, -0.2, 0.62], [0.15, -0.85, -0.1]].forEach(br => {
            const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * s, 0.14 * s, 2.1 * s, 6), bark);
            b.position.set(br[0] * s, 3.0 * s, br[1] * s); b.rotation.z = br[2]; g.add(b);
          });
          [[0, 4.15, 0, 2.9, 0.48, leafA], [1.2, 4.0, 0.4, 1.9, 0.40, leafB], [-1.3, 4.05, -0.35, 2.0, 0.42, leafB]].forEach(c => {
            const cap = new THREE.Mesh(new THREE.SphereGeometry(c[3] * s, 12, 8), c[5]);
            cap.scale.set(1.0, c[4] / c[3], 1.0);
            cap.position.set(c[0] * s, c[1] * s, c[2] * s);
            cap.castShadow = true; g.add(cap);
          });
        }
        // Feathery olive-emerald Miyazaki alpha-cutout leaf cards fringing the flat umbrella acacia crown!
        if (LS.ghibli && LS.ghibli.addLeafCardShell) {
          const shell = new THREE.Group();
          LS.ghibli.addLeafCardShell(shell, [
            [0.0, 4.25, 0.0, 1.15, 1, 1, 1, 'sun'],
            [1.65, 4.10, 0.55, 0.95, 1, 1, 1, 'sun'],
            [-1.70, 4.15, -0.45, 0.95, 1, 1, 1, 'mid'],
            [0.45, 4.05, -1.55, 0.90, 1, 1, 1, 'shade'],
            [-0.55, 4.08, 1.55, 0.90, 1, 1, 1, 'mid']
          ], { sunHex: 0xaed062, midHex: 0x6f9840, shadeHex: 0x3e622b, style: 'leaf', cardsPerCluster: 2, cardScale: 1.55, cacheKey: 'safari_acacia_v1' });
          shell.scale.setScalar(s);
          g.add(shell);
        }
        worldGroup.add(g);
        if (!noCol) addCollider(x, z, 0.55 * s, 0.55 * s);
      }

      function addBaobab(x, z, scale) {
        const s = scale || 1.0;
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        g.rotation.y = x * 0.5 + z * 0.3;
        if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_baobab')) {
          const m = LS.hdAssets.clone('anime_baobab');
          m.scale.setScalar(s * 1.15);
          g.add(m);
        } else {
          const barkTex = (LS.ghibli && LS.ghibli.getBarkTexture) ? LS.ghibli.getBarkTexture() : null;
          const bark = LS.makeToonMat(0x8c684c, barkTex ? { map: barkTex } : undefined);
          const leaf = LS.makeToonMat(0x558c42);
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.1 * s, 1.45 * s, 3.8 * s, 12), bark);
          trunk.position.y = 1.9 * s; trunk.castShadow = true; g.add(trunk);
          for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            const br = new THREE.Mesh(new THREE.CylinderGeometry(0.14 * s, 0.28 * s, 2.2 * s, 6), bark);
            br.position.set(Math.cos(ang) * 0.9 * s, 4.3 * s, Math.sin(ang) * 0.9 * s);
            br.rotation.z = -Math.cos(ang) * 0.55; br.rotation.x = Math.sin(ang) * 0.55; g.add(br);
            const puff = new THREE.Mesh(new THREE.SphereGeometry(1.05 * s, 10, 8), leaf);
            puff.scale.set(1.2, 0.72, 1.2);
            puff.position.set(Math.cos(ang) * 1.65 * s, 5.2 * s, Math.sin(ang) * 1.65 * s);
            puff.castShadow = true; g.add(puff);
          }
        }
        if (LS.ghibli && LS.ghibli.addLeafCardShell) {
          const shell = new THREE.Group();
          const bCenters = [];
          for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            bCenters.push([Math.cos(ang) * 1.7, 5.45, Math.sin(ang) * 1.7, 0.95, 1, 1, 1, i % 2 === 0 ? 'sun' : 'mid']);
          }
          LS.ghibli.addLeafCardShell(shell, bCenters, { sunHex: 0x8ed15e, midHex: 0x4f8c3e, shadeHex: 0x2c5c2d, style: 'leaf', cardsPerCluster: 2, cardScale: 1.55, cacheKey: 'safari_baobab_v1' });
          shell.scale.setScalar(s);
          g.add(shell);
        }
        worldGroup.add(g);
        addCollider(x, z, 1.45 * s, 1.45 * s);
      }

      // 1. Golden Savanna Sky Dome, Terrain, Dirt Trails & Mt. Kilimanjaro Horizon
      safeRun('terrain_and_horizon', () => {
        const skyGeo = new THREE.SphereGeometry(225, 24, 16);
        W.skyMesh = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({
          map: LS.createSkyTexture(LS.state.timeMode, 'safari'),
          side: THREE.BackSide,
          fog: false
        }));
        worldGroup.add(W.skyMesh);

        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(280, 280),
          LS.makeSurfaceMat(LS.createGrassTexture('safari'), { roughness: 0.92 })
        );
        ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; worldGroup.add(ground);

        SC.addCurvedPath(worldGroup, SAFARI_LOOP_PTS, 4.2, 'lane_safari', 0.030);
        SC.addCurvedPath(worldGroup, SAFARI_SOUTH_TRAIL, 3.6, 'lane_safari', 0.028);
        SC.addCurvedPath(worldGroup, SAFARI_AIRSTRIP_TRAIL, 3.0, 'lane_safari', 0.026);
        SC.addCurvedPath(worldGroup, SAFARI_GIRAFFE_TRAIL, 2.6, 'lane_safari', 0.025);
        SC.addCurvedPath(worldGroup, SAFARI_PLAY_TRAIL, 2.4, 'lane_safari', 0.024);

        // Warm ochre base camp courtyard pad
        const campPad = new THREE.Mesh(
          new THREE.CircleGeometry(10.5, 24),
          LS.makeSurfaceMat(LS.createVillageLaneTexture('safari'), { roughness: 0.90 })
        );
        campPad.rotation.x = -Math.PI / 2; campPad.position.set(0, 0.022, 17.5); campPad.receiveShadow = true; worldGroup.add(campPad);

        // Distant Snow-Capped Mt. Kilimanjaro on the northern savanna horizon!
        const kili = new THREE.Group(); kili.position.set(-18, -1, -138);
        const kBase = new THREE.Mesh(new THREE.ConeGeometry(46, 36, 14), LS.makeToonMat(0x7c7482));
        kBase.position.y = 18; kBase.scale.set(1.35, 1.0, 0.95); kili.add(kBase);
        const kFlat = new THREE.Mesh(new THREE.CylinderGeometry(11.5, 18.5, 8.5, 14), LS.makeToonMat(0x908998));
        kFlat.position.y = 32; kili.add(kFlat);
        const kSnow = new THREE.Mesh(new THREE.CylinderGeometry(11.6, 15.2, 4.2, 14), LS.makeToonMat(0xf8f9fc));
        kSnow.position.y = 35.8; kili.add(kSnow);
        worldGroup.add(kili);

        // 360-degree Savanna Horizon Mesas
        if (LS.isHD && LS.hdAssets && LS.hdAssets.addMountainRange) {
          LS.hdAssets.addMountainRange(worldGroup, 'safari');
        } else {
          const mesaMat = LS.makeToonMat(0xb88655);
          [[-86, -72, 18, 9], [78, -68, 22, 11], [94, 10, 20, 8], [-92, 18, 18, 9], [10, 96, 24, 9]].forEach(h => {
            const m = new THREE.Mesh(new THREE.CylinderGeometry(h[2] * 0.72, h[2], h[3], 10), mesaMat);
            m.position.set(h[0], h[3] * 0.45, h[1]); worldGroup.add(m);
          });
        }
        // Distant Savanna Horizon Wildlife & Acacia Silhouettes along the Kilimanjaro ridge
        const silMat = LS.makeToonMat(0x6b5344);
        [[-52, -96, 1.3], [-36, -104, 1.1], [24, -102, 1.4], [48, -94, 1.15]].forEach(sa => {
          const sg = new THREE.Group(); sg.position.set(sa[0], 0, sa[1]);
          const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * sa[2], 0.55 * sa[2], 5.2 * sa[2], 6), silMat);
          tr.position.y = 2.6 * sa[2]; sg.add(tr);
          const cp = new THREE.Mesh(new THREE.CylinderGeometry(4.6 * sa[2], 3.4 * sa[2], 1.1 * sa[2], 8), silMat);
          cp.position.y = 5.4 * sa[2]; sg.add(cp);
          worldGroup.add(sg);
        });
        [[-44, -95], [-40, -96.5], [32, -98]].forEach(gd => {
          const gg = new THREE.Group(); gg.position.set(gd[0], 0, gd[1]);
          const b = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 2.0), silMat); b.position.y = 2.2; gg.add(b);
          const n = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.2, 0.55), silMat); n.position.set(0, 4.1, 0.8); n.rotation.x = 0.2; gg.add(n);
          worldGroup.add(gg);
        });
      });

      // 2. Safari Base Camp (Welcome Arch, Outfitter Boutique, Ranger Academy, Photo Sticker Booth, Mango Cafe, Safari Jeep, Glamping Tent, Craft Market, Campfire Circle)
      safeRun('base_camp', () => {
        const timber = LS.makeSurfaceMat(LS.createCedarPlankTexture(), { roughness: 0.78 });
        const thatch = LS.makeSurfaceMat(LS.createThatchTexture(), { roughness: 0.88, bumpScale: 0.09 });
        const canvas = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture('#f4ead3') });
        const mud = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture('#e4c08e') });

        // Grand Timber Savanna Welcome Arch (X=0, Z=12.0)
        const arch = new THREE.Group(); arch.position.set(0, 0, 12.0);
        [-3.4, 3.4].forEach(px => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 4.6, 10), timber);
          post.position.set(px, 2.3, 0); post.castShadow = true; arch.add(post);
          addCollider(px, 12.0, 0.45, 0.45);
        });
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 7.6, 10), timber);
        beam.rotation.z = Math.PI / 2; beam.position.y = 4.45; arch.add(beam);
        // Festive savanna bunting flags & warm hanging camp lanterns under the Welcome Arch!
        const flagCols = [0xf59e0b, 0xe76f51, 0x2a9d8f, 0xe9c46a, 0xd62828, 0x38bdf8];
        for (let fi = 0; fi < 9; fi++) {
          const fx = -2.8 + fi * 0.7;
          const sag = Math.sin((fi / 8) * Math.PI) * 0.28;
          const flag = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.36, 3), LS.makeToonMat(flagCols[fi % flagCols.length]));
          flag.rotation.x = Math.PI; flag.position.set(fx, 4.18 - sag, 0.08); arch.add(flag);
        }
        [-3.05, 3.05].forEach(lx => {
          const lan = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.34, 8), new THREE.MeshBasicMaterial({ color: 0xffe29a }));
          lan.position.set(lx, 3.92, 0.22); arch.add(lan);
          if (LS.isHD && LS.createGlowSprite) {
            const halo = LS.createGlowSprite(0xffcf70, 1.55);
            halo.position.copy(lan.position); arch.add(halo);
          }
        });
        const wSign = new THREE.Mesh(
          new THREE.BoxGeometry(6.2, 1.15, 0.20),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🦁 AFRICAN SAFARI & WILDLIFE ZOO', { bg: '#5c3416', border: '#f5b841', color: '#fff8e8', font: 'bold 31px sans-serif', width: 640 }) })
        );
        wSign.position.set(0, 4.75, 0.12); arch.add(wSign);
        worldGroup.add(arch);

        // Helper for cozy thatched Safari Lodges / Tents
        function buildSafariLodge(cx, cz, rotY, opts) {
          const g = new THREE.Group(); g.position.set(cx, 0, cz); g.rotation.y = rotY;
          const wall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.0, 4.4), opts.isTent ? canvas : mud);
          wall.position.y = 1.5; wall.castShadow = true; wall.receiveShadow = true; g.add(wall);
          const roof = new THREE.Mesh(new THREE.ConeGeometry(4.3, 2.2, 4), thatch);
          roof.rotation.y = Math.PI / 4; roof.position.y = 4.0; roof.castShadow = true; g.add(roof);
          const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.1, 0.12), timber);
          door.position.set(0, 1.05, 2.22); g.add(door);
          [-1.55, 1.55].forEach(wx => {
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.12), LS.makeEmissiveMat(0xffe6a7, 0xffc86b, 0.48));
            win.position.set(wx, 1.85, 2.22); g.add(win);
          });
          // Warm camp porch lantern (+ HD glow halo)
          const lLan = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.28, 8), new THREE.MeshBasicMaterial({ color: 0xffe29a }));
          lLan.position.set(1.02, 2.28, 2.38); g.add(lLan);
          if (LS.isHD && LS.createGlowSprite) {
            const halo = LS.createGlowSprite(0xffcf70, 1.35);
            halo.position.copy(lLan.position); g.add(halo);
          }
          const sign = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 0.72, 0.14),
            new THREE.MeshBasicMaterial({ map: LS.createSignTexture(opts.sign, { bg: opts.bg, border: '#f5b841', color: '#fff8eb', font: 'bold 30px sans-serif', width: 512 }) })
          );
          sign.position.set(0, 3.25, 2.38); g.add(sign);
          worldGroup.add(g);
          addCollider(cx, cz, 2.75, 2.45);
        }

        // West Base Camp: Safari Outfitter Boutique
        buildSafariLodge(-11.5, 14.5, Math.PI * 0.32, { isTent: true, sign: '🎒 SAFARI OUTFITTER', bg: '#6b4c28' });
        W.zones.push({ id: 'safari_shop', label: 'Visit Safari Outfitter Boutique 🎒', pos: new THREE.Vector3(-8.6, 0, 16.0), radius: 3.4 });

        // East Base Camp: Savanna Ranger Academy
        buildSafariLodge(11.5, 14.5, -Math.PI * 0.32, { isTent: false, sign: '📚 RANGER ACADEMY', bg: '#234232' });
        W.zones.push({ id: 'safari_academy', label: 'Take a Wildlife Quiz with Dr. Kofi 👨‍🏫🦁', pos: new THREE.Vector3(8.6, 0, 16.0), radius: 3.4 });

        // West Camp Grove: Enterable 3D Luxury Safari Glamping Tent (Laila & Salma's Savanna Lodge!)
        const glamp = new THREE.Group();
        glamp.position.set(-18.2, 0, 16.5);
        glamp.rotation.y = Math.PI * 0.45;
        const gDeck = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.24, 6.2), timber);
        gDeck.position.set(0, 0.12, 0.45); gDeck.receiveShadow = true; gDeck.castShadow = true; glamp.add(gDeck);
        const gWall = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.55, 4.4), canvas);
        gWall.position.set(0, 1.48, -0.15); gWall.castShadow = true; gWall.receiveShadow = true; glamp.add(gWall);
        // Pitched double-fly safari tent roof canopy
        const gRoofMat = LS.makeToonMat(0xd9b382);
        const gStripeMat = LS.makeToonMat(0x9c4221);
        const gRoofL = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.14, 5.9), gRoofMat);
        gRoofL.position.set(-1.35, 3.35, 0.3); gRoofL.rotation.z = 0.48; gRoofL.castShadow = true; glamp.add(gRoofL);
        const gRoofR = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.14, 5.9), gRoofMat);
        gRoofR.position.set(1.35, 3.35, 0.3); gRoofR.rotation.z = -0.48; gRoofR.castShadow = true; glamp.add(gRoofR);
        const gRidge = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 6.0, 8), timber);
        gRidge.rotation.x = Math.PI / 2; gRidge.position.set(0, 4.02, 0.3); glamp.add(gRidge);
        // Rolled tent doorway + warm glowing interior entrance + veranda poles & lanterns
        const gOpen = new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.05, 0.12), LS.makeEmissiveMat(0xffdf99, 0xf59e0b, 0.55));
        gOpen.position.set(0, 1.25, 2.07); glamp.add(gOpen);
        [-0.95, 0.95].forEach(fx => {
          const flap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 2.1, 8), gStripeMat);
          flap.position.set(fx, 1.28, 2.12); glamp.add(flap);
        });
        [-2.4, 2.4].forEach(px => {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.10, 2.75, 8), timber);
          pole.position.set(px, 1.5, 3.05); pole.castShadow = true; glamp.add(pole);
          const lan = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.28, 8), new THREE.MeshBasicMaterial({ color: 0xffe29a }));
          lan.position.set(px, 2.55, 3.05); glamp.add(lan);
          if (LS.isHD && LS.createGlowSprite) {
            const halo = LS.createGlowSprite(0xffcf70, 1.45);
            halo.position.copy(lan.position); glamp.add(halo);
          }
        });
        const gSign = new THREE.Mesh(
          new THREE.BoxGeometry(4.0, 0.72, 0.14),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture("⛺ SISTERS' GLAMPING TENT", { bg: '#6c3416', border: '#facc15', color: '#fffbeb', font: 'bold 28px sans-serif', width: 512 }) })
        );
        gSign.position.set(0, 3.25, 2.98); glamp.add(gSign);
        worldGroup.add(glamp);
        addCollider(-18.2, 16.5, 2.8, 2.6);
        W.zones.push({ id: 'enter_safari_tent', label: "Enter Laila & Salma's 3D Safari Glamping Tent ⛺", pos: new THREE.Vector3(-14.6, 0, 17.6), radius: 3.3 });

        // Southwest Base Camp: Wildlife Photo Sticker Booth
        const booth = new THREE.Group(); booth.position.set(-9.6, 0, 23.2); booth.rotation.y = Math.PI * 0.22;
        const bBody = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.4, 2.0), LS.makeToonMat(0xd97706));
        bBody.position.y = 1.2; bBody.castShadow = true; booth.add(bBody);
        const bRoof = new THREE.Mesh(new THREE.ConeGeometry(2.3, 1.1, 4), thatch);
        bRoof.rotation.y = Math.PI / 4; bRoof.position.y = 2.9; booth.add(bRoof);
        const bSign = new THREE.Mesh(
          new THREE.BoxGeometry(2.6, 0.62, 0.14),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('📸 WILDLIFE STICKERS', { bg: '#7c2d12', border: '#fcd34d', color: '#fffbeb', font: 'bold 28px sans-serif' }) })
        );
        bSign.position.set(0, 2.55, 1.08); booth.add(bSign);
        worldGroup.add(booth); addCollider(-9.6, 23.2, 1.55, 1.25);
        W.zones.push({ id: 'safari_stickers', label: 'Wildlife Photo Sticker Booth 📸 (15c)', pos: new THREE.Vector3(-7.6, 0, 24.4), radius: 3.1 });

        // Southeast Base Camp: Mama Nia's Mango Smoothie Cafe
        const cafe = new THREE.Group(); cafe.position.set(9.6, 0, 23.2); cafe.rotation.y = -Math.PI * 0.22;
        const cCounter = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.05, 1.5), timber);
        cCounter.position.y = 0.52; cCounter.castShadow = true; cafe.add(cCounter);
        [[-1.6, -0.6], [1.6, -0.6], [-1.6, 0.6], [1.6, 0.6]].forEach(p => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 2.7, 6), timber);
          post.position.set(p[0], 1.35, p[1]); cafe.add(post);
        });
        // Colorful tropical smoothie pitchers & mango basket on the counter!
        [0xffb703, 0xff5d8f, 0x52b788].forEach((sc, idx) => {
          const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.10, 0.34, 8), LS.makeToonMat(sc));
          jar.position.set(-0.95 + idx * 0.42, 1.22, 0.28); cafe.add(jar);
        });
        [0xf59e0b, 0xfb923c, 0xfacc15].forEach((mc, idx) => {
          const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), LS.makeToonMat(mc));
          fruit.position.set(0.62 + idx * 0.26, 1.16, 0.22); cafe.add(fruit);
        });
        const cLan = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.26, 8), new THREE.MeshBasicMaterial({ color: 0xffe29a }));
        cLan.position.set(-1.35, 2.25, 0.72); cafe.add(cLan);
        if (LS.isHD && LS.createGlowSprite) {
          const halo = LS.createGlowSprite(0xffcf70, 1.3);
          halo.position.copy(cLan.position); cafe.add(halo);
        }
        const cRoof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 1.25, 4), thatch);
        cRoof.rotation.y = Math.PI / 4; cRoof.position.y = 3.15; cRoof.castShadow = true; cafe.add(cRoof);
        const cSign = new THREE.Mesh(
          new THREE.BoxGeometry(3.2, 0.64, 0.14),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🥭 MANGO SMOOTHIE CAFE', { bg: '#9a3412', border: '#fde047', color: '#fffbeb', font: 'bold 28px sans-serif' }) })
        );
        cSign.position.set(0, 2.68, 0.85); cafe.add(cSign);
        worldGroup.add(cafe); addCollider(9.6, 23.2, 1.9, 1.0);
        W.zones.push({ id: 'safari_cafe', label: "Visit Mama Nia's Mango Smoothie Cafe 🥭", pos: new THREE.Vector3(7.6, 0, 24.4), radius: 3.2 });

        // East Camp Plaza: Maasai-Inspired Craft & Beadwork Market Stalls!
        const market = new THREE.Group();
        market.position.set(16.2, 0, 26.8);
        market.rotation.y = -Math.PI * 0.62;
        const mCounter = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.02, 1.6), timber);
        mCounter.position.y = 0.51; mCounter.castShadow = true; market.add(mCounter);
        [[-2.0, -0.68], [2.0, -0.68], [-2.0, 0.68], [2.0, 0.68]].forEach(p => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 2.85, 6), timber);
          post.position.set(p[0], 1.42, p[1]); market.add(post);
        });
        // Vibrant crimson, cobalt & ochre striped market awning
        const awnCols = [0xc83e37, 0xf59e0b, 0x1d4ed8, 0xfef3c7, 0xc83e37, 0x2a9d8f];
        for (let ai = 0; ai < 6; ai++) {
          const strip = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.10, 2.35), LS.makeToonMat(awnCols[ai]));
          strip.position.set(-1.9 + ai * 0.76, 2.90, 0.05); strip.rotation.x = 0.14; strip.castShadow = true; market.add(strip);
        }
        // Colorful hand-beaded necklaces, painted gourds & woven baskets on display!
        [0xe63946, 0x3b82f6, 0xfacc15, 0x10b981].forEach((bc, idx) => {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 7, 14), LS.makeToonMat(bc));
          ring.position.set(-1.45 + idx * 0.56, 1.24, 0.35); ring.rotation.x = 0.55; market.add(ring);
        });
        [0xd97706, 0xb45309, 0xe76f51].forEach((gc, idx) => {
          const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.36, 10), LS.makeToonMat(gc));
          basket.position.set(0.75 + idx * 0.52, 1.20, 0.05); market.add(basket);
        });
        const mSign = new THREE.Mesh(
          new THREE.BoxGeometry(3.8, 0.66, 0.14),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🎨 MAASAI BEAD & CRAFT MARKET', { bg: '#7f1d1d', border: '#facc15', color: '#fffbeb', font: 'bold 26px sans-serif', width: 512 }) })
        );
        mSign.position.set(0, 2.66, 1.18); market.add(mSign);
        worldGroup.add(market);
        addCollider(16.2, 26.8, 2.2, 1.4);
        W.zones.push({ id: 'safari_crafts', label: 'Browse Maasai Bead & Craft Market 🎨', pos: new THREE.Vector3(13.8, 0, 25.4), radius: 3.3 });

        // Southern Base Camp: Glowing Djembe Campfire Drum Circle! (Zero extra WebGL lights!)
        const fireGrp = new THREE.Group();
        fireGrp.position.set(0, 0, 28.0);
        const stoneMat = LS.makeToonMat(0x7c7065);
        for (let si = 0; si < 12; si++) {
          const ang = (si / 12) * Math.PI * 2;
          const st = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), stoneMat);
          st.scale.set(1.15, 0.65, 1.0);
          st.position.set(Math.cos(ang) * 0.96, 0.12, Math.sin(ang) * 0.96);
          fireGrp.add(st);
        }
        // Crossed firewood logs + glowing ember bed
        for (let li = 0; li < 4; li++) {
          const log = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 1.15, 6), timber);
          log.position.y = 0.16; log.rotation.z = Math.PI / 2 - 0.16; log.rotation.y = (li / 4) * Math.PI;
          fireGrp.add(log);
        }
        const ember = new THREE.Mesh(new THREE.CircleGeometry(0.75, 14), LS.makeEmissiveMat(0xff6b2b, 0xff4500, 0.92));
        ember.rotation.x = -Math.PI / 2; ember.position.y = 0.06; fireGrp.add(ember);
        // Animated layered campfire flames + HD warm halo
        [
          [0, 0.56, 0, 0.34, 0.95, 0xff6b1a],
          [0.14, 0.44, 0.10, 0.24, 0.72, 0xffa62b],
          [-0.14, 0.42, -0.08, 0.22, 0.68, 0xffe066]
        ].forEach((fl, fi) => {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(fl[3], fl[4], 7), new THREE.MeshBasicMaterial({ color: fl[5], transparent: true, opacity: 0.92 }));
          cone.position.set(fl[0], fl[1], fl[2]);
          fireGrp.add(cone);
          W.campfireFlames.push({ mesh: cone, baseY: fl[1], phase: fi * 1.9 });
        });
        if (LS.isHD && LS.createGlowSprite) {
          const fHalo = LS.createGlowSprite(0xff9b3d, 3.6);
          fHalo.position.set(0, 0.75, 0);
          fireGrp.add(fHalo);
        }
        // Carved wooden savanna stools & Djembe drums arranged around the campfire
        const drumWood = LS.makeToonMat(0x7c4a21), drumHead = LS.makeToonMat(0xf5e6c8), drumRope = LS.makeToonMat(0xb91c1c);
        for (let di = 0; di < 4; di++) {
          const ang = (di / 4) * Math.PI * 2 + Math.PI * 0.25;
          const sx = Math.cos(ang) * 2.25, sz = Math.sin(ang) * 2.25;
          const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.42, 8), timber);
          stool.position.set(sx, 0.21, sz); stool.castShadow = true; fireGrp.add(stool);
          // Djembe drum goblet right beside each stool!
          const dx = Math.cos(ang + 0.32) * 1.95, dz = Math.sin(ang + 0.32) * 1.95;
          const dBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.34, 8), drumWood);
          dBase.position.set(dx, 0.17, dz); fireGrp.add(dBase);
          const dBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.11, 0.28, 10), drumWood);
          dBowl.position.set(dx, 0.46, dz); dBowl.castShadow = true; fireGrp.add(dBowl);
          const dTop = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.04, 10), drumHead);
          dTop.position.set(dx, 0.61, dz); fireGrp.add(dTop);
          const dTrim = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 5, 10), drumRope);
          dTrim.rotation.x = Math.PI / 2; dTrim.position.set(dx, 0.56, dz); fireGrp.add(dTrim);
        }
        const fSign = new THREE.Mesh(
          new THREE.BoxGeometry(2.5, 0.56, 0.12),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🥁 DJEMBE CAMPFIRE', { bg: '#5c2018', border: '#fbbf24', color: '#fffbeb', font: 'bold 28px sans-serif' }) })
        );
        fSign.position.set(0, 1.38, 2.55); fireGrp.add(fSign);
        const fPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.25, 6), timber);
        fPost.position.set(0, 0.62, 2.55); fireGrp.add(fPost);
        worldGroup.add(fireGrp);
        addCollider(0, 28.0, 1.05, 1.05);
        W.zones.push({ id: 'safari_campfire', label: 'Play Djembe Drums & Roast Marshmallows 🥁🔥', pos: new THREE.Vector3(0, 0, 25.8), radius: 3.4 });

        // Parked Zebra-Striped Safari Jeep (Interactive Guided Savanna Tour!)
        let jeep;
        if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_safari_jeep')) {
          jeep = LS.hdAssets.clone('anime_safari_jeep');
          jeep.scale.setScalar(1.08);
        } else {
          jeep = new THREE.Group();
          const bodyM = LS.makeToonMat(0xf4e8c8), stripeM = LS.makeToonMat(0x282420), khakiM = LS.makeToonMat(0xc4aa78), tireM = LS.makeToonMat(0x222226);
          const hull = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.72, 3.8), bodyM); hull.position.y = 0.82; hull.castShadow = true; jeep.add(hull);
          for (let s = -1.4; s <= 1.4; s += 0.56) {
            const st = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.62, 0.16), stripeM); st.position.set(0, 0.84, s); jeep.add(st);
          }
          const roof = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.12, 2.35), khakiM); roof.position.set(0, 2.08, -0.55); jeep.add(roof);
          [[-0.82, 0.5], [0.82, 0.5], [-0.82, -1.6], [0.82, -1.6]].forEach(p => {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 6), stripeM); post.position.set(p[0], 1.56, p[1]); jeep.add(post);
          });
          [[-0.95, 1.2], [0.95, 1.2], [-0.95, -1.15], [0.95, -1.15]].forEach(w => {
            const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.24, 12), tireM);
            wh.rotation.z = Math.PI / 2; wh.position.set(w[0], 0.42, w[1]); jeep.add(wh);
          });
        }
        jeep.position.set(-4.8, 0, 7.8);
        jeep.rotation.y = -Math.PI * 0.65;
        worldGroup.add(jeep);
        W.safariJeep = jeep;
        W.jeepHome = { pos: new THREE.Vector3(-4.8, 0, 7.8), rotY: -Math.PI * 0.65, exit: new THREE.Vector3(-2.4, 0, 8.8) };
        W.jeepPath = new THREE.CatmullRomCurve3(SAFARI_LOOP_PTS.map(p => new THREE.Vector3(p[0], 0, p[1])), false, 'catmullrom', 0.45);
        W.zones.push({ id: 'safari_jeep', label: 'Ride Safari Jeep Guided Tour! 🚙 (+25c)', pos: new THREE.Vector3(-4.8, 0, 7.8), radius: 3.4 });
      });

      // 3. Giraffe & Acacia Feeding Sanctuary (West: X=-44..-20, Z=-10..12)
      safeRun('giraffe_sanctuary', () => {
        const plankMat = LS.makeSurfaceMat(LS.createCedarPlankTexture(), { roughness: 0.78 });
        const railMat = LS.makeToonMat(0x6e472c);

        // Elevated Cedar Giraffe Feeding Deck (X=-26.6..-22.2, Z=-0.6..4.6, Y=0.85) + East Ramp
        const deck = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.22, 5.2), plankMat);
        deck.position.set(-24.4, 0.78, 2.0); deck.castShadow = true; deck.receiveShadow = true; worldGroup.add(deck);
        [[-26.4, -0.3], [-22.4, -0.3], [-26.4, 4.3], [-22.4, 4.3]].forEach(p => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.85, 8), railMat);
          leg.position.set(p[0], 0.42, p[1]); worldGroup.add(leg);
        });
        // Smooth East Ramp ascending from X=-19.8 to -22.2
        for (let i = 0; i < 6; i++) {
          const t = (i + 0.5) / 6;
          const step = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.16, 3.2), plankMat);
          step.position.set(-19.8 - t * 2.4, t * 0.85 - 0.04, 2.0);
          step.rotation.z = -Math.atan2(0.85, 2.4); step.receiveShadow = true; worldGroup.add(step);
        }
        // Open cedar post-and-rail safety fences along North, South, and West deck edges + solid railing colliders!
        const addDeckRail = (x1, z1, x2, z2) => {
          const len = Math.hypot(x2 - x1, z2 - z1);
          const cx = (x1 + x2) * 0.5, cz = (z1 + z2) * 0.5;
          const rot = Math.atan2(x2 - x1, z2 - z1);
          [1.26, 1.68].forEach(ry => {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, len), railMat);
            bar.position.set(cx, ry, cz); bar.rotation.y = rot; bar.castShadow = true; worldGroup.add(bar);
          });
          const posts = Math.max(2, Math.round(len / 1.5));
          for (let i = 0; i <= posts; i++) {
            const t = i / posts;
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.96, 0.14), railMat);
            post.position.set(x1 + (x2 - x1) * t, 1.32, z1 + (z2 - z1) * t); post.castShadow = true; worldGroup.add(post);
          }
        };
        addDeckRail(-26.65, -0.55, -26.65, 4.55);
        addDeckRail(-26.65, -0.55, -22.20, -0.55);
        addDeckRail(-26.65, 4.55, -22.20, 4.55);
        addCollider(-26.75, 2.0, 0.28, 2.75);
        addCollider(-24.4, -0.65, 2.45, 0.28);
        addCollider(-24.4, 4.65, 2.45, 0.28);

        const gSign = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.65, 2.1),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🦒 FEED GIRAFFES', { bg: '#fef3c7', border: '#d97706', color: '#78350f', font: 'bold 34px sans-serif' }) })
        );
        gSign.position.set(-26.6, 1.88, -0.2); worldGroup.add(gSign);
        W.zones.push({ id: 'safari_feed_giraffe', label: 'Feed Tall Giraffes Acacia Leaves 🦒 (+15c)', pos: new THREE.Vector3(-25.2, 0.85, 2.0), radius: 2.8 });

        // Helper to build a giraffe (HD GLB or Classic multi-part!)
        function buildGiraffe(x, z, rotY, sc) {
          const wrap = new THREE.Group();
          wrap.position.set(x, 0, z); wrap.rotation.y = rotY;
          let inner;
          if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_giraffe')) {
            inner = LS.hdAssets.clone('anime_giraffe');
          } else {
            inner = new THREE.Group();
            const hideM = LS.makeToonMat(0xffffff, { map: LS.createGiraffeHideTexture() }), spotM = LS.makeToonMat(0x8d4e24), creamM = LS.makeToonMat(0xf8ebd0), darkM = LS.makeToonMat(0x281e18);
            const body = new THREE.Mesh(new THREE.SphereGeometry(0.68, 12, 8), hideM); body.scale.set(0.82, 0.85, 1.5); body.position.y = 2.05; body.castShadow = true; inner.add(body);
            [[-0.3, 0.58], [0.3, 0.58], [-0.28, -0.62], [0.28, -0.62]].forEach(l => {
              const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.0, 8), creamM); leg.position.set(l[0], 1.0, l[1]); inner.add(leg);
            });
            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.30, 2.35, 10), hideM); neck.position.set(0, 3.25, 0.92); neck.rotation.x = 0.22; neck.castShadow = true; inner.add(neck);
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), hideM); head.position.set(0, 4.42, 1.32); inner.add(head);
            const snout = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), creamM); snout.scale.set(0.8, 0.75, 1.35); snout.position.set(0, 4.35, 1.62); inner.add(snout);
            [-0.1, 0.1].forEach(ox => {
              const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 6), spotM); horn.position.set(ox, 4.72, 1.24); inner.add(horn);
              const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), darkM); eye.position.set(ox * 1.7, 4.46, 1.48); inner.add(eye);
            });
          }
          inner.scale.setScalar(sc);
          wrap.add(inner);
          worldGroup.add(wrap);
          addCollider(x, z, 0.95 * sc, 0.95 * sc);
          W.giraffes.push({ root: wrap, inner, baseRot: rotY, phase: x * 0.4 + z * 0.3 });
          W.wildlifePhotoTargets.push({ species: 'giraffe', pos: wrap.position });
        }

        buildGiraffe(-29.2, 2.2, Math.PI * 0.5, 1.08);
        buildGiraffe(-32.8, -1.8, Math.PI * 0.32, 1.0);
        buildGiraffe(-30.5, 6.2, Math.PI * 0.72, 0.72); // Baby giraffe calf!
        addAcacia(-35.5, 2.8, 1.25);
        addAcacia(-31.0, -7.2, 1.05);
      });

      // 4. Elephant Oasis, Flamingo Watering Hole, Lily-Pad Hippo Lagoon & Savanna Stream
      safeRun('elephant_oasis', () => {
        // Sandy shoreline verge + sunlit turquoise savanna watering hole right above ground!
        const shoreSand = new THREE.Mesh(new THREE.CircleGeometry(12.8, 32), LS.makeToonMat(0xc49c64));
        shoreSand.rotation.x = -Math.PI / 2; shoreSand.position.set(-29.5, 0.028, -28.5); shoreSand.receiveShadow = true; worldGroup.add(shoreSand);
        const deepBed = new THREE.Mesh(new THREE.CircleGeometry(11.6, 32), LS.makeToonMat(0x1f6270));
        deepBed.rotation.x = -Math.PI / 2; deepBed.position.set(-29.5, 0.042, -28.5); worldGroup.add(deepBed);
        const pondMat = (LS.isHD && LS.createAAAPondWaterMaterial)
          ? LS.createAAAPondWaterMaterial()
          : LS.makeWaterMat(0.86, THREE.DoubleSide);
        const water = new THREE.Mesh(new THREE.CircleGeometry(11.3, 32), pondMat);
        water.rotation.x = -Math.PI / 2; water.position.set(-29.5, 0.075, -28.5); worldGroup.add(water);
        // Solid water collider keeping player safely on shore/boardwalk!
        addCollider(-29.5, -28.5, 10.6, 10.6);

        // Warm ochre shoreline boulders + papyrus reeds
        const rockMats = [LS.makeToonMat(0x9a7554), LS.makeToonMat(0xb2875e), LS.makeToonMat(0x7c5e44)];
        for (let i = 0; i < 22; i++) {
          const ang = (i / 22) * Math.PI * 2;
          if (Math.abs(ang) < 0.34) continue; // Keep east boardwalk clear
          if (ang > 0.72 && ang < 1.55) continue; // Keep south Hippo Lagoon channel open
          const rx = -29.5 + Math.cos(ang) * (11.5 + (i % 3) * 0.45);
          const rz = -28.5 + Math.sin(ang) * (11.5 + ((i + 1) % 3) * 0.45);
          const rk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75 + (i % 3) * 0.25, 0), rockMats[i % rockMats.length]);
          rk.scale.set(1.25, 0.58, 1.05); rk.position.set(rx, 0.12, rz); rk.castShadow = true; worldGroup.add(rk);
          if (i % 2 === 0) SC.addTallGrass(worldGroup, rx + Math.cos(ang) * 0.55, rz + Math.sin(ang) * 0.55, 1.35);
        }

        // East Elephant Viewing & Feeding Boardwalk (X=-18.8..-16.2, Z=-28.5) with open cedar rails!
        const plankMat = LS.makeSurfaceMat(LS.createCedarPlankTexture(), { roughness: 0.78 });
        const railMat = LS.makeToonMat(0x6e472c);
        const bw = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.16, 4.4), plankMat);
        bw.position.set(-17.6, 0.12, -28.5); bw.receiveShadow = true; worldGroup.add(bw);
        [0.48, 0.88].forEach(ry => {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, 4.4), railMat);
          bar.position.set(-18.92, ry, -28.5); bar.castShadow = true; worldGroup.add(bar);
        });
        [-30.6, -29.2, -27.8, -26.4].forEach(pz => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.92, 0.14), railMat);
          post.position.set(-18.92, 0.54, pz); post.castShadow = true; worldGroup.add(post);
        });
        const eSign = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.65, 2.1),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🐘 ELEPHANT OASIS', { bg: '#e0f2fe', border: '#0284c7', color: '#0c4a6e', font: 'bold 34px sans-serif' }) })
        );
        eSign.position.set(-18.9, 1.25, -26.4); worldGroup.add(eSign);
        W.zones.push({ id: 'safari_feed_elephant', label: 'Feed Gentle Elephants Melons 🐘 (+15c)', pos: new THREE.Vector3(-17.4, 0, -28.5), radius: 3.1 });

        // Splash water rings around the baby elephant
        for (let r = 0; r < 3; r++) {
          const ring = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.64, 20), new THREE.MeshBasicMaterial({ color: 0xe6f9ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
          ring.rotation.x = -Math.PI / 2; ring.position.set(-24.2, 0.10, -27.5); worldGroup.add(ring);
          W.splashRings.push(ring);
        }

        // Animated Sparkling Baby Elephant Water-Spray Fountain Arc!
        const dropMat = new THREE.MeshBasicMaterial({ color: 0xbef2ff, transparent: true, opacity: 0.85 });
        for (let d = 0; d < 14; d++) {
          const drop = new THREE.Mesh(new THREE.SphereGeometry(0.08 + (d % 3) * 0.025, 6, 5), dropMat);
          drop.position.set(-23.2, 1.2, -27.5);
          worldGroup.add(drop);
          W.sprayDrops.push({ mesh: drop, phase: d / 14, spread: ((d % 5) - 2) * 0.14 });
        }

        // 3 Gentle Elephants (2 adults + 1 splashing calf!)
        function buildElephant(x, y, z, rotY, sc) {
          const wrap = new THREE.Group(); wrap.position.set(x, y, z); wrap.rotation.y = rotY;
          let inner;
          if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_elephant')) {
            inner = LS.hdAssets.clone('anime_elephant');
          } else {
            inner = new THREE.Group();
            const hideM = LS.makeToonMat(0x8e939c), ivoryM = LS.makeToonMat(0xfbf6e8), darkM = LS.makeToonMat(0x1f1d1c);
            const body = new THREE.Mesh(new THREE.SphereGeometry(1.12, 14, 10), hideM); body.scale.set(0.9, 0.85, 1.2); body.position.y = 1.65; body.castShadow = true; inner.add(body);
            [[-0.5, 0.6], [0.5, 0.6], [-0.48, -0.7], [0.48, -0.7]].forEach(l => {
              const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.30, 1.45, 8), hideM); leg.position.set(l[0], 0.72, l[1]); inner.add(leg);
            });
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.68, 12, 10), hideM); head.position.set(0, 2.25, 1.05); inner.add(head);
            [-0.85, 0.85].forEach(ex => {
              const ear = new THREE.Mesh(new THREE.SphereGeometry(0.58, 10, 8), hideM); ear.scale.set(0.95, 1.15, 0.22); ear.position.set(ex, 2.22, 0.82); inner.add(ear);
            });
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 1.25, 8), hideM); trunk.position.set(0, 1.55, 1.68); trunk.rotation.x = 0.28; inner.add(trunk);
            [-0.28, 0.28].forEach(tx => {
              const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.65, 6), ivoryM); tusk.position.set(tx, 1.72, 1.62); tusk.rotation.x = 1.15; inner.add(tusk);
              const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 6, 6), darkM); eye.position.set(tx * 1.55, 2.36, 1.54); inner.add(eye);
            });
          }
          inner.scale.setScalar(sc); wrap.add(inner); worldGroup.add(wrap);
          W.elephants.push({ root: wrap, baseY: y, baseRot: rotY, phase: x * 0.5 + z * 0.2 });
          W.wildlifePhotoTargets.push({ species: 'elephant', pos: wrap.position });
        }

        buildElephant(-26.8, -0.08, -32.2, Math.PI * 0.35, 1.08);
        buildElephant(-33.5, -0.10, -25.8, Math.PI * 0.62, 1.02);
        buildElephant(-24.2, -0.12, -27.5, Math.PI * 0.48, 0.64); // Playful baby elephant wading in water!

        // 6 Graceful Pink Flamingos wading in the watering hole shallows!
        const flamMat = LS.makeToonMat(0xff7aa2), flamDark = LS.makeToonMat(0x281e1c), flamLeg = LS.makeToonMat(0xe8658c);
        [[-34.0, -33.2], [-35.5, -31.4], [-32.2, -35.0], [-27.8, -21.2], [-25.6, -22.5], [-30.0, -20.8]].forEach((fp, idx) => {
          const fg = new THREE.Group(); fg.position.set(fp[0], 0.04, fp[1]); fg.rotation.y = idx * 1.1;
          if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_flamingo')) {
            const mdl = LS.hdAssets.clone('anime_flamingo');
            mdl.scale.setScalar(0.95 + (idx % 3) * 0.06);
            fg.add(mdl);
          } else {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.78, 5), flamLeg); leg.position.y = 0.39; fg.add(leg);
            const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), flamMat); body.scale.set(0.75, 0.72, 1.35); body.position.y = 0.85; fg.add(body);
            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.65, 6), flamMat); neck.position.set(0, 1.24, 0.22); neck.rotation.x = 0.16; fg.add(neck);
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.095, 8, 6), flamMat); head.position.set(0, 1.56, 0.28); fg.add(head);
            const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 5), flamDark); beak.position.set(0, 1.52, 0.38); beak.rotation.x = 1.9; fg.add(beak);
          }
          worldGroup.add(fg);
          W.flamingos.push({ root: fg, phase: idx * 0.9 });
          if (idx < 2) W.wildlifePhotoTargets.push({ species: 'flamingo', pos: fg.position });
        });

        // Lily-Pad Hippo Lagoon Extension (South-Southeast lobe of the Oasis: X=-25.0, Z=-15.5)
        const hShore = new THREE.Mesh(new THREE.CircleGeometry(7.0, 26), LS.makeToonMat(0xc49c64));
        hShore.rotation.x = -Math.PI / 2; hShore.position.set(-25.0, 0.026, -15.5); hShore.receiveShadow = true; worldGroup.add(hShore);
        const hBed = new THREE.Mesh(new THREE.CircleGeometry(6.1, 26), LS.makeToonMat(0x1f6270));
        hBed.rotation.x = -Math.PI / 2; hBed.position.set(-25.0, 0.040, -15.5); worldGroup.add(hBed);
        const hWater = new THREE.Mesh(new THREE.CircleGeometry(5.9, 26), pondMat);
        hWater.rotation.x = -Math.PI / 2; hWater.position.set(-25.0, 0.073, -15.5); worldGroup.add(hWater);
        addCollider(-25.0, -15.5, 5.2, 5.2);

        // Floating green lily pads & rosy savanna water lilies
        const lilyMat = LS.makeToonMat(0x4d9e48), flowerMat = LS.makeToonMat(0xff9eb5);
        [[-28.2, -13.5], [-21.8, -17.2], [-27.4, -18.0], [-21.0, -13.2], [-24.5, -11.5], [-29.0, -16.2]].forEach((lp, li) => {
          const pad = new THREE.Mesh(new THREE.CircleGeometry(0.46 + (li % 2) * 0.12, 10, 0, Math.PI * 1.82), lilyMat);
          pad.rotation.x = -Math.PI / 2; pad.rotation.z = li * 1.1; pad.position.set(lp[0], 0.092, lp[1]); worldGroup.add(pad);
          if (li % 2 === 0) {
            const fl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 5), flowerMat);
            fl.scale.set(1.0, 0.55, 1.0); fl.position.set(lp[0] + 0.08, 0.14, lp[1]); worldGroup.add(fl);
          }
        });
        // Hippo Lagoon wooden sign
        const hSign = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 0.58, 0.12),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🦛 HIPPO LAGOON', { bg: '#1e3a5f', border: '#67e8f9', color: '#ecfeff', font: 'bold 30px sans-serif' }) })
        );
        hSign.position.set(-19.2, 1.32, -14.2); hSign.rotation.y = Math.PI * 0.35; worldGroup.add(hSign);
        const hPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.15, 6), railMat);
        hPost.position.set(-19.2, 0.58, -14.2); worldGroup.add(hPost);

        // 2 Bobbing Savanna River Hippos (HD GLB + Classic procedural fallback!)
        function buildHippo(x, z, rotY, sc) {
          const wrap = new THREE.Group(); wrap.position.set(x, -0.32, z); wrap.rotation.y = rotY;
          if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_hippo')) {
            const m = LS.hdAssets.clone('anime_hippo');
            m.scale.setScalar(sc);
            wrap.add(m);
          } else {
            const hMat = LS.makeToonMat(0x7c707e), pinkM = LS.makeToonMat(0xc49ba8), darkM = LS.makeToonMat(0x1f1a1f);
            const body = new THREE.Mesh(new THREE.SphereGeometry(0.88, 12, 10), hMat);
            body.scale.set(0.95, 0.78, 1.45); body.position.y = 0.78; body.castShadow = true; wrap.add(body);
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.50, 10, 8), hMat);
            head.scale.set(0.95, 0.85, 1.15); head.position.set(0, 0.96, 1.15); wrap.add(head);
            const snout = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.44, 0.62), pinkM);
            snout.position.set(0, 0.86, 1.62); wrap.add(snout);
            [-0.28, 0.28].forEach(ex => {
              const ear = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 5), pinkM); ear.position.set(ex, 1.38, 1.05); wrap.add(ear);
              const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 5), darkM); eye.position.set(ex * 0.85, 1.15, 1.48); wrap.add(eye);
            });
            wrap.scale.setScalar(sc);
          }
          worldGroup.add(wrap);
          const ring = new THREE.Mesh(new THREE.RingGeometry(0.65, 0.88, 20), new THREE.MeshBasicMaterial({ color: 0xe6f9ff, transparent: true, opacity: 0.48, side: THREE.DoubleSide }));
          ring.rotation.x = -Math.PI / 2; ring.position.set(x, 0.095, z); worldGroup.add(ring);
          W.hippos.push({ root: wrap, ring, baseY: -0.32, baseRot: rotY, phase: x * 0.45 + z * 0.3 });
          W.wildlifePhotoTargets.push({ species: 'hippo', pos: wrap.position });
          // Playful rising water bubbles right near hippo nostrils!
          for (let b = 0; b < 3; b++) {
            const bub = new THREE.Mesh(new THREE.SphereGeometry(0.08 + b * 0.025, 6, 5), new THREE.MeshBasicMaterial({ color: 0xe0faff, transparent: true, opacity: 0.75 }));
            bub.position.set(x + Math.sin(rotY) * 1.2, 0.12, z + Math.cos(rotY) * 1.2);
            worldGroup.add(bub);
            W.hippoBubbles.push({ mesh: bub, anchorX: x + Math.sin(rotY) * 1.2, anchorZ: z + Math.cos(rotY) * 1.2, phase: b * 0.33 + sc });
          }
        }
        buildHippo(-26.0, -15.8, Math.PI * 0.38, 1.04);
        buildHippo(-22.8, -14.2, Math.PI * 0.75, 0.74);

        // Shimmering Savanna Stream flowing east from Elephant Oasis south of Pride Rock (seamless curved ribbon!)
        const streamPts = [[-18.8, -31.2], [-10.0, -30.5], [3.2, -29.8], [14.0, -28.8], [20.5, -26.2]];
        const streamSp = SC.sampleSpline(streamPts, 10);
        const buildRibbon = (pts, halfW, yPos, mat) => {
          const verts = [], uvs = [], indices = [];
          let dist = 0;
          for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            const prev = pts[Math.max(0, i - 1)];
            const next = pts[Math.min(pts.length - 1, i + 1)];
            if (i > 0) dist += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
            let tx = next[0] - prev[0], tz = next[1] - prev[1];
            const tl = Math.hypot(tx, tz) || 1;
            tx /= tl; tz /= tl;
            const nx = -tz, nz = tx;
            verts.push(p[0] - nx * halfW, yPos, p[1] - nz * halfW);
            verts.push(p[0] + nx * halfW, yPos, p[1] + nz * halfW);
            uvs.push(0, dist * 0.25, 1, dist * 0.25);
            if (i > 0) {
              const b = (i - 1) * 2;
              indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
            }
          }
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
          geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
          geo.setIndex(indices);
          geo.computeVertexNormals();
          const m = new THREE.Mesh(geo, mat);
          m.receiveShadow = true;
          worldGroup.add(m);
        };
        buildRibbon(streamSp, 2.35, 0.025, LS.makeToonMat(0xc49c64));
        buildRibbon(streamSp, 1.65, 0.042, LS.makeToonMat(0x1f6270));
        buildRibbon(streamSp, 1.58, 0.068, LS.makeWaterMat(0.86, THREE.DoubleSide));
        // Decorative river stones & reed tufts along the stream banks (keeping bridge at X=1.6..4.8 clear)
        for (let ri = 0; ri < streamSp.length; ri += 3) {
          const sp = streamSp[ri];
          if (sp[0] > 0.6 && sp[0] < 5.8) continue;
          const rk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38 + (ri % 2) * 0.16, 0), rockMats[ri % rockMats.length]);
          rk.scale.set(1.3, 0.55, 1.0);
          rk.position.set(sp[0], 0.10, sp[1] + (ri % 2 === 0 ? 1.95 : -1.95));
          worldGroup.add(rk);
          if (ri % 6 === 0) SC.addTallGrass(worldGroup, sp[0] + 0.4, sp[1] + (ri % 2 === 0 ? -2.2 : 2.2), 1.2);
        }

        // Walkable Arched Wooden Rope Suspension Bridge over the Savanna Stream (X=1.6..4.8, Z=-26.8..-32.8)
        const bridgeGrp = new THREE.Group();
        const ropeMat = LS.makeToonMat(0xc8a46e);
        const numPlanks = 18;
        for (let pi = 0; pi < numPlanks; pi++) {
          const t = (pi + 0.5) / numPlanks;
          const bz = -32.8 + t * 6.0;
          const by = Math.sin(t * Math.PI) * 0.86;
          const nextBy = Math.sin(Math.min(1, t + 0.03) * Math.PI) * 0.86;
          const slope = Math.atan2(nextBy - by, 0.18);
          const plank = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.10, 0.28), plankMat);
          plank.position.set(3.2, by - 0.03, bz);
          plank.rotation.x = -slope;
          plank.castShadow = true; plank.receiveShadow = true;
          bridgeGrp.add(plank);
        }
        // Sturdy timber bridge towers & suspension cables on both sides
        [1.62, 4.78].forEach(bx => {
          [-32.7, -26.9].forEach(bz => {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 1.95, 8), railMat);
            post.position.set(bx, 0.96, bz); post.castShadow = true; bridgeGrp.add(post);
          });
          // Curved rope handrail segments & vertical rope ties
          for (let ri = 0; ri < 12; ri++) {
            const t0 = ri / 12, t1 = (ri + 1) / 12;
            const z0 = -32.7 + t0 * 5.8, z1 = -32.7 + t1 * 5.8;
            const y0 = Math.sin(t0 * Math.PI) * 0.86 + 0.92 + Math.pow(t0 - 0.5, 2) * 0.65;
            const y1 = Math.sin(t1 * Math.PI) * 0.86 + 0.92 + Math.pow(t1 - 0.5, 2) * 0.65;
            const segLen = Math.hypot(z1 - z0, y1 - y0);
            const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, segLen, 5), ropeMat);
            seg.position.set(bx, (y0 + y1) * 0.5, (z0 + z1) * 0.5);
            seg.rotation.x = Math.PI / 2 - Math.atan2(y1 - y0, z1 - z0);
            bridgeGrp.add(seg);
            if (ri > 0 && ri % 2 === 0) {
              const deckY = Math.sin(t0 * Math.PI) * 0.86;
              const vRope = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, Math.max(0.2, y0 - deckY), 4), ropeMat);
              vRope.position.set(bx, (y0 + deckY) * 0.5, z0);
              bridgeGrp.add(vRope);
            }
          }
        });
        worldGroup.add(bridgeGrp);
      });

      // 5. Pride Rock Kopje, Resting King Lion / Lioness & Roar Pedestal (North: X=-6..14, Z=-48..-32)
      safeRun('pride_rock', () => {
        const sandTex = LS.createSandstoneTexture();
        const rockA = LS.makeSurfaceMat(sandTex, { color: 0xe6cca8, roughness: 0.88, bumpScale: 0.09 });
        const rockB = LS.makeSurfaceMat(sandTex, { color: 0xc4a078, roughness: 0.90, bumpScale: 0.10 });
        const rockC = LS.makeSurfaceMat(sandTex, { color: 0xf4dcba, roughness: 0.85, bumpScale: 0.08 });
        const kopje = new THREE.Group(); kopje.position.set(3.0, 0, -40.5);
        // Sculpted angular granite kopje crags + iconic jutting Pride Rock promontory!
        [
          [0.0, 1.2, -1.8, 5.8, 1.35, 0.62, 1.05, 0.2, rockB],
          [-4.2, 1.8, -1.2, 3.6, 1.15, 0.85, 0.95, 0.7, rockA],
          [4.0, 1.5, -2.0, 3.8, 1.20, 0.72, 0.92, -0.5, rockB],
          [-1.5, 3.4, -2.2, 3.4, 1.15, 0.88, 0.95, 0.4, rockA],
          [1.8, 2.8, -0.8, 3.0, 1.05, 0.78, 0.95, -0.3, rockC]
        ].forEach(c => {
          const crag = new THREE.Mesh(new THREE.DodecahedronGeometry(c[3], 0), c[8]);
          crag.scale.set(c[4], c[5], c[6]); crag.rotation.y = c[7];
          crag.position.set(c[0], c[1], c[2]); crag.castShadow = true; crag.receiveShadow = true; kopje.add(crag);
        });
        const ledge = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.05, 7.6), rockC);
        ledge.position.set(0.4, 3.65, 2.2); ledge.rotation.x = -0.22; ledge.castShadow = true; kopje.add(ledge);
        worldGroup.add(kopje);
        addCollider(3.0, -40.5, 7.6, 6.2);

        // Majestic Resting King Lion + Lioness perched atop Pride Rock (clearly visible from road & Jeep!)
        const king = new THREE.Group(); king.position.set(3.4, 4.48, -35.6); king.rotation.y = 0.08;
        if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_lion_king')) {
          const kMdl = LS.hdAssets.clone('anime_lion_king');
          kMdl.scale.setScalar(1.16);
          king.add(kMdl);
        } else {
          const furM = LS.makeToonMat(0xe5a94c), maneM = LS.makeToonMat(0x7c3e18), creamM = LS.makeToonMat(0xfbe8c2), darkM = LS.makeToonMat(0x1e1612);
          const kBody = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 8), furM); kBody.scale.set(0.82, 0.75, 1.55); kBody.position.y = 0.45; kBody.castShadow = true; king.add(kBody);
          const kMane = new THREE.Mesh(new THREE.DodecahedronGeometry(0.74, 1), maneM); kMane.position.set(0, 0.94, 0.72); kMane.castShadow = true; king.add(kMane);
          const kHead = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), furM); kHead.position.set(0, 0.96, 0.98); king.add(kHead);
          const kSnout = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), creamM); kSnout.scale.set(1.05, 0.78, 1.15); kSnout.position.set(0, 0.88, 1.34); king.add(kSnout);
          const kNose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), darkM); kNose.position.set(0, 0.94, 1.54); king.add(kNose);
          [-0.28, 0.28].forEach(ex => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), furM); ear.position.set(ex, 1.32, 0.90); king.add(ear);
            const paw = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), furM); paw.scale.set(0.85, 0.55, 1.6); paw.position.set(ex * 1.1, 0.14, 1.05); king.add(paw);
          });
          [-0.17, 0.17].forEach(ex => {
            const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), darkM); e.position.set(ex, 1.04, 1.35); king.add(e);
          });
          const kTail = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.85, 6), furM);
          kTail.rotation.x = 1.18; kTail.position.set(0.18, 0.36, -1.05); king.add(kTail);
          const kTuft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), maneM); kTuft.position.set(0.26, 0.22, -1.42); king.add(kTuft);
        }
        worldGroup.add(king);
        W.kingLionMesh = king;
        W.wildlifePhotoTargets.push({ species: 'lion', pos: king.position });

        // Golden Pride Rock Roar Aura Ring (expands dramatically when Laila & Salma trigger the Roar!)
        const roarRing = new THREE.Mesh(
          new THREE.RingGeometry(0.75, 1.15, 24),
          new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
        );
        roarRing.position.set(3.4, 5.45, -34.2);
        worldGroup.add(roarRing);
        W.roarRing = roarRing;

        // Interactive Pride Rock Roar Viewing Boulder right across the Suspension Bridge!
        const roarPed = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.65, 8), rockC);
        roarPed.position.set(3.2, 0.32, -33.6); roarPed.castShadow = true; worldGroup.add(roarPed);
        const rSign = new THREE.Mesh(
          new THREE.BoxGeometry(2.3, 0.56, 0.12),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🦁 PRIDE ROCK ROAR', { bg: '#78350f', border: '#facc15', color: '#fef9c3', font: 'bold 28px sans-serif' }) })
        );
        rSign.position.set(3.2, 1.15, -33.6); worldGroup.add(rSign);
        W.zones.push({ id: 'safari_pride_roar', label: 'Hear King Lion Roar on Pride Rock! 🦁 (+10c)', pos: new THREE.Vector3(3.2, 0, -33.1), radius: 2.8 });

        const queen = new THREE.Group(); queen.position.set(1.5, 4.18, -36.8); queen.rotation.y = 0.28;
        if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_lioness')) {
          const qMdl = LS.hdAssets.clone('anime_lioness');
          qMdl.scale.setScalar(1.12);
          queen.add(qMdl);
        } else {
          const furM = LS.makeToonMat(0xe5a94c), maneM = LS.makeToonMat(0x7c3e18), creamM = LS.makeToonMat(0xfbe8c2), darkM = LS.makeToonMat(0x1e1612);
          const qBody = new THREE.Mesh(new THREE.SphereGeometry(0.52, 10, 8), furM); qBody.scale.set(0.78, 0.72, 1.48); qBody.position.y = 0.38; qBody.castShadow = true; queen.add(qBody);
          const qHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), furM); qHead.position.set(0, 0.78, 0.74); queen.add(qHead);
          const qSnout = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), creamM); qSnout.position.set(0, 0.72, 1.02); queen.add(qSnout);
          const qNose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), darkM); qNose.position.set(0, 0.77, 1.16); queen.add(qNose);
          [-0.22, 0.22].forEach(ex => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), furM); ear.position.set(ex, 1.06, 0.68); queen.add(ear);
            const paw = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), furM); paw.scale.set(0.85, 0.55, 1.55); paw.position.set(ex * 1.1, 0.12, 0.85); queen.add(paw);
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.048, 6, 6), darkM); eye.position.set(ex * 0.65, 0.84, 1.04); queen.add(eye);
          });
          const qTail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.72, 6), furM);
          qTail.rotation.x = 1.22; qTail.position.set(-0.15, 0.28, -0.88); queen.add(qTail);
          const qTuft = new THREE.Mesh(new THREE.SphereGeometry(0.095, 8, 6), maneM); qTuft.position.set(-0.22, 0.18, -1.18); queen.add(qTuft);
        }
        worldGroup.add(queen);

        // Friendly resting Savanna Lioness sunbathing at the grassy eastern base of Pride Rock!
        const sunLioness = new THREE.Group(); sunLioness.position.set(8.6, 0, -33.6); sunLioness.rotation.y = -0.52;
        if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_lioness')) {
          const sMdl = LS.hdAssets.clone('anime_lioness');
          sMdl.scale.setScalar(1.08);
          sunLioness.add(sMdl);
          worldGroup.add(sunLioness);
          addCollider(8.6, -33.6, 1.1, 1.1);
          W.wildlifePhotoTargets.push({ species: 'lion', pos: sunLioness.position });
        }

        addBaobab(-9.5, -42.0, 1.15);
        addBaobab(16.5, -38.5, 1.05);
      });

      // 6. Zebra Open Savanna Meadow & Meerkat Lookout Burrow (East: X=20..48, Z=-24..8)
      safeRun('zebra_meadow', () => {
        const coatMat = LS.makeToonMat(0xffffff, { map: LS.createZebraHideTexture() });
        const wMat = LS.makeToonMat(0xf8f6f0), bMat = LS.makeToonMat(0x232022);
        const zebraCoords = [
          [31.0, -14.0, 0.6, 1.06, 2.2], [35.5, -9.5, -0.8, 1.02, 0], [39.0, -16.5, 1.9, 0.98, 2.4], [33.5, -2.5, -1.4, 1.04, 0], [41.5, -5.0, 2.5, 0.78, 0]
        ];
        zebraCoords.forEach((zc, idx) => {
          const zg = new THREE.Group(); zg.position.set(zc[0], 0, zc[1]); zg.rotation.y = zc[2];
          let neckPivot = null;
          let inner = null;
          if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_zebra')) {
            inner = LS.hdAssets.clone('anime_zebra');
            inner.scale.setScalar(zc[3]);
            zg.add(inner);
          } else {
            inner = new THREE.Group();
            const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), coatMat); body.scale.set(0.80, 0.80, 1.52); body.position.y = 1.05; body.castShadow = true; inner.add(body);
            [[-0.24, 0.45], [0.24, 0.45], [-0.24, -0.45], [0.24, -0.45]].forEach(l => {
              const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.84, 8), coatMat); leg.position.set(l[0], 0.50, l[1]); inner.add(leg);
              const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.12, 8), bMat); hoof.position.set(l[0], 0.06, l[1]); inner.add(hoof);
            });
            const zTail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.032, 0.48, 5), wMat);
            zTail.position.set(0, 0.88, -0.86); zTail.rotation.x = 0.35; inner.add(zTail);
            const zTuft = new THREE.Mesh(new THREE.SphereGeometry(0.075, 6, 6), bMat);
            zTuft.position.set(0, 0.65, -0.96); inner.add(zTuft);

            neckPivot = new THREE.Group(); neckPivot.position.set(0, 1.25, 0.58);
            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.68, 8), coatMat); neck.position.set(0, 0.28, 0.14); neck.rotation.x = 0.35; neckPivot.add(neck);
            const mane = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.56, 0.16), bMat); mane.position.set(0, 0.36, 0.02); mane.rotation.x = 0.35; neckPivot.add(mane);
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), coatMat); head.scale.set(0.75, 0.82, 1.45); head.position.set(0, 0.58, 0.36); neckPivot.add(head);
            const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), bMat); muzzle.position.set(0, 0.54, 0.62); neckPivot.add(muzzle);
            [-0.12, 0.12].forEach(ex => {
              const ear = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.20, 6), wMat); ear.position.set(ex, 0.80, 0.26); ear.rotation.z = -ex * 1.4; neckPivot.add(ear);
              const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 6, 6), bMat); eye.position.set(ex * 1.15, 0.62, 0.44); neckPivot.add(eye);
            });
            inner.add(neckPivot);
            inner.scale.setScalar(zc[3]);
            zg.add(inner);
          }
          worldGroup.add(zg);
          if (!zc[4]) addCollider(zc[0], zc[1], 0.85 * zc[3], 0.85 * zc[3]);
          W.zebras.push({ root: zg, inner, neck: neckPivot, baseX: zc[0], baseZ: zc[1], baseRot: zc[2], trotRadius: zc[4], phase: idx * 1.3 });
          W.wildlifePhotoTargets.push({ species: 'zebra', pos: zg.position });
        });

        // Sculpted organic red-ochre multi-chimney Savanna Termite Mounds (textured terracotta clay!)
        const moundM = LS.makeSurfaceMat(LS.createTermiteClayTexture(), { roughness: 0.90, bumpScale: 0.08 });
        [[28.5, -22.5, 1.2], [44.0, -12.0, 1.45], [37.5, 4.5, 1.05]].forEach((tm, idx) => {
          const mg = new THREE.Group(); mg.position.set(tm[0], 0, tm[1]); mg.rotation.y = idx * 1.1;
          const s = tm[2];
          const base = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95 * s, 1), moundM);
          base.scale.set(1.15, 0.72, 1.05); base.position.y = 0.45 * s; base.castShadow = true; base.receiveShadow = true; mg.add(base);
          const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * s, 0.54 * s, 2.05 * s, 9), moundM);
          spire.position.set(-0.08 * s, 1.15 * s, 0.04 * s); spire.castShadow = true; mg.add(spire);
          const cap = new THREE.Mesh(new THREE.SphereGeometry(0.24 * s, 8, 6), moundM);
          cap.scale.set(1.0, 1.25, 1.0); cap.position.set(-0.08 * s, 2.18 * s, 0.04 * s); mg.add(cap);
          [[0.46, 0.75, 0.22, 0.34, 1.35], [-0.42, 0.58, -0.25, 0.28, 1.05], [0.18, 0.48, -0.42, 0.24, 0.88]].forEach(ch => {
            const cMesh = new THREE.Mesh(new THREE.CylinderGeometry(ch[3] * 0.45 * s, ch[3] * s, ch[4] * s, 8), moundM);
            cMesh.position.set(ch[0] * s, ch[1] * s, ch[2] * s); cMesh.castShadow = true; mg.add(cMesh);
            const cTop = new THREE.Mesh(new THREE.SphereGeometry(ch[3] * 0.48 * s, 7, 6), moundM);
            cTop.position.set(ch[0] * s, (ch[1] + ch[4] * 0.5) * s, ch[2] * s); mg.add(cTop);
          });
          worldGroup.add(mg); addCollider(tm[0], tm[1], 1.0 * s, 1.0 * s);
        });

        // 4 Playful Sentinel Meerkats popping up from burrows near the red Termite Mound!
        const holeMat = LS.makeToonMat(0x4a311e), rimMat = LS.makeToonMat(0xb87b48);
        [[27.2, -19.2, 0.4], [28.6, -18.4, -0.5], [29.8, -19.6, -1.1], [26.8, -20.5, 0.8]].forEach((mk, mi) => {
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.11, 6, 10), rimMat);
          rim.rotation.x = Math.PI / 2; rim.position.set(mk[0], 0.05, mk[1]); worldGroup.add(rim);
          const hole = new THREE.Mesh(new THREE.CircleGeometry(0.27, 10), holeMat);
          hole.rotation.x = -Math.PI / 2; hole.position.set(mk[0], 0.04, mk[1]); worldGroup.add(hole);
          const mg = new THREE.Group();
          mg.position.set(mk[0], 0, mk[1]);
          mg.rotation.y = mk[2];
          if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_meerkat')) {
            const mdl = LS.hdAssets.clone('anime_meerkat');
            mdl.scale.setScalar(1.05 + (mi % 2) * 0.12);
            mg.add(mdl);
          } else {
            const furM = LS.makeToonMat(0xd6a874), bellyM = LS.makeToonMat(0xf5e2c4), darkM = LS.makeToonMat(0x281e18);
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.56, 8), furM);
            body.position.y = 0.30; body.castShadow = true; mg.add(body);
            const belly = new THREE.Mesh(new THREE.SphereGeometry(0.13, 7, 6), bellyM);
            belly.scale.set(0.85, 1.5, 0.65); belly.position.set(0, 0.30, 0.08); mg.add(belly);
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), furM);
            head.position.set(0, 0.66, 0.03); mg.add(head);
            [-0.065, 0.065].forEach(ex => {
              const patch = new THREE.Mesh(new THREE.SphereGeometry(0.048, 6, 5), darkM); patch.position.set(ex, 0.68, 0.14); mg.add(patch);
              const ear = new THREE.Mesh(new THREE.SphereGeometry(0.04, 5, 5), darkM); ear.position.set(ex * 1.9, 0.75, 0.01); mg.add(ear);
            });
          }
          worldGroup.add(mg);
          W.meerkats.push({ root: mg, x: mk[0], z: mk[1], baseRot: mk[2], phase: mi * 1.6 });
          if (mi === 0) W.wildlifePhotoTargets.push({ species: 'meerkat', pos: mg.position });
        });
      });

      // 7. Savanna Kids' Nature Playground (Southwest: X=-25..-14, Z=23..32)
      safeRun('savanna_playground', () => {
        const wood = LS.makeToonMat(0x8c5a32), slideCol = LS.makeToonMat(0xe76f51);
        const sTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 1.4), wood); sTop.position.set(-22.8, 1.0, 24.8); sTop.castShadow = true; worldGroup.add(sTop);
        const chute = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.14, 4.2), slideCol); chute.position.set(-22.8, 1.1, 27.1); chute.rotation.x = 0.50; chute.castShadow = true; worldGroup.add(chute);
        addCollider(-22.8, 24.8, 0.85, 0.85);
        W.zones.push({ id: 'park_slide', label: 'Slide Down Safari Lookout Slide 🛝', pos: new THREE.Vector3(-22.8, 0, 26.8), radius: 2.6 });

        [-19.2, -16.4].forEach(sx => {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 2.9, 6), wood); p.position.set(sx, 1.45, 29.8); worldGroup.add(p);
        });
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.0, 6), wood); bar.rotation.z = Math.PI / 2; bar.position.set(-17.8, 2.85, 29.8); worldGroup.add(bar);
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.10, 0.42), slideCol); seat.position.set(-17.8, 0.72, 29.8); worldGroup.add(seat);
        W.zones.push({ id: 'park_swing', label: 'Swing Under the Acacia Tree 🎠', pos: new THREE.Vector3(-17.8, 0, 29.8), radius: 2.4 });

        for (let h = 0; h < 5; h++) {
          const sq = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.68), LS.makeToonMat(h % 2 === 0 ? 0xffd166 : 0xf4a261));
          sq.rotation.x = -Math.PI / 2; sq.position.set(-16.0, 0.035, 23.6 + h * 0.75); worldGroup.add(sq);
        }
        W.zones.push({ id: 'park_hopscotch', label: 'Play Savanna Paw Hopscotch 🎯 (+20c)', pos: new THREE.Vector3(-16.0, 0, 24.8), radius: 2.2 });
      });

      // 8. Safari Airstrip & Bush Propeller Plane (Southeast: X=24..52, Z=18..42)
      safeRun('safari_airstrip', () => {
        const dirtStrip = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 42), LS.makeToonMat(0x9a6d45));
        dirtStrip.rotation.x = -Math.PI / 2; dirtStrip.position.set(42.5, 0.025, 26.0); dirtStrip.receiveShadow = true; worldGroup.add(dirtStrip);
        const whiteM = LS.makeToonMat(0xfef9ee);
        for (let rz = 9; rz <= 43; rz += 6) {
          const mk = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 2.8), whiteM); mk.position.set(42.5, 0.038, rz); worldGroup.add(mk);
        }
        // Fluttering orange windsock
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.2, 6), LS.makeToonMat(0x52525b));
        pole.position.set(35.0, 2.1, 20.5); worldGroup.add(pole);
        const sock = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.35, 8), LS.makeToonMat(0xf97316));
        sock.rotation.z = -Math.PI / 2; sock.position.set(35.7, 3.95, 20.5); worldGroup.add(sock);
        W.windsock = sock;

        // Timber Safari Airstrip Terminal Gate Sign
        const gate = new THREE.Group(); gate.position.set(30.5, 0, 27.5);
        [-2.2, 2.2].forEach(gz => {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 3.6, 8), LS.makeToonMat(0x6e472c));
          p.position.set(0, 1.8, gz); gate.add(p);
        });
        const aSign = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 1.05, 5.4),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('✈️ SERENGETI AIRSTRIP → TOKYO', { bg: '#0f2544', border: '#f5b841', color: '#ffffff', font: 'bold 30px sans-serif', width: 640 }) })
        );
        aSign.position.set(0, 3.5, 0); gate.add(aSign);
        worldGroup.add(gate); addCollider(30.5, 27.5, 0.45, 2.6);

        // Charming Painted Safari Bush Propeller Plane!
        const plane = new THREE.Group(); plane.position.set(42.0, 1.15, 27.0); plane.rotation.y = Math.PI;
        const pCream = LS.makeToonMat(0xfef3c7), pRed = LS.makeToonMat(0xdc2626), pGlass = LS.makeToonMat(0x38bdf8), pDark = LS.makeToonMat(0x1f2937);
        const fuse = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.42, 6.2, 12), pCream); fuse.rotation.x = Math.PI / 2; fuse.castShadow = true; plane.add(fuse);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 5.4), pRed); plane.add(stripe);
        const wing = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.16, 1.55), pCream); wing.position.set(0, 0.62, 0.6); wing.castShadow = true; plane.add(wing);
        const tailV = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.45, 1.1), pRed); tailV.position.set(0, 0.72, -2.7); plane.add(tailV);
        const tailH = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.75), pCream); tailH.position.set(0, 0.25, -2.75); plane.add(tailH);
        const cab = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.55, 1.6), pGlass); cab.position.set(0, 0.35, 0.85); plane.add(cab);
        const prop = new THREE.Group(); prop.position.set(0, 0, 3.22);
        prop.add(new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.14, 0.05), pDark));
        prop.add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.75, 0.05), pDark));
        plane.add(prop); W.propeller = prop;
        worldGroup.add(plane); addCollider(42.0, 27.0, 4.6, 3.4);

        W.zones.push({ id: 'safari_airstrip', label: 'Board Safari Charter Flight to Tokyo / Kyoto ✈️', pos: new THREE.Vector3(28.0, 0, 27.5), radius: 3.8 });
      });

      // 8B. Grand Savanna Landmarks: Hot Air Balloon Launch Pad, Timber Ranger Watchtower & Cheetah Sprint Track!
      safeRun('grand_safari_landmarks', () => {
        const timber = LS.makeSurfaceMat(LS.createCedarPlankTexture(), { roughness: 0.78 });
        const thatch = LS.makeSurfaceMat(LS.createThatchTexture(), { roughness: 0.88, bumpScale: 0.09 });
        const railMat = LS.makeToonMat(0x6e472c);

        // 1) Hot Air Balloon Sunrise Launch Pad (Central-East Clearing: X=12.5, Z=-3.5)
        const padMat = LS.makeToonMat(0xc49c64);
        const launchPad = new THREE.Mesh(new THREE.CircleGeometry(3.8, 22), padMat);
        launchPad.rotation.x = -Math.PI / 2; launchPad.position.set(12.5, 0.028, -3.5); launchPad.receiveShadow = true; worldGroup.add(launchPad);
        const padRing = new THREE.Mesh(new THREE.RingGeometry(3.35, 3.65, 24), new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide }));
        padRing.rotation.x = -Math.PI / 2; padRing.position.set(12.5, 0.036, -3.5); worldGroup.add(padRing);

        const balloon = new THREE.Group();
        balloon.position.set(12.5, 0, -3.5);
        const wickerM = LS.makeToonMat(0xa6713f), wickerTrim = LS.makeToonMat(0x6e472c);
        const basket = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.15, 1.75), wickerM);
        basket.position.y = 0.62; basket.castShadow = true; balloon.add(basket);
        const bRim = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.14, 1.88), wickerTrim);
        bRim.position.y = 1.22; balloon.add(bRim);
        // 4 sturdy steel support ropes & overhead brass burner frame
        [[-0.78, -0.78], [0.78, -0.78], [-0.78, 0.78], [0.78, 0.78]].forEach(p => {
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 2.55, 6), LS.makeToonMat(0x52525b));
          rod.position.set(p[0], 2.45, p[1]); balloon.add(rod);
        });
        const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.24, 8), LS.makeToonMat(0xb45309));
        burner.position.y = 2.85; balloon.add(burner);
        const bFlame = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.68, 7), new THREE.MeshBasicMaterial({ color: 0xffb703 }));
        bFlame.position.y = 3.25; balloon.add(bFlame);
        W.balloonFlame = bFlame;
        // Striped colorful hot-air balloon envelope (8 vibrant vertical gores!)
        const envGroup = new THREE.Group();
        envGroup.position.y = 6.95;
        const stripeCols = [0xe63946, 0xf59e0b, 0x2a9d8f, 0xfacc15, 0x3b82f6, 0xf97316, 0xec4899, 0xfef3c7];
        for (let gi = 0; gi < 8; gi++) {
          const a0 = (gi / 8) * Math.PI * 2;
          const gore = new THREE.Mesh(
            new THREE.SphereGeometry(3.05, 12, 12, a0, Math.PI / 4 + 0.02, 0, Math.PI * 0.84),
            LS.makeToonMat(stripeCols[gi])
          );
          gore.scale.set(1.0, 1.22, 1.0);
          gore.castShadow = true;
          envGroup.add(gore);
        }
        const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 0.92, 1.15, 14), LS.makeToonMat(0xfef3c7));
        skirt.position.y = -3.15; envGroup.add(skirt);
        balloon.add(envGroup);
        worldGroup.add(balloon);
        W.hotAirBalloon = balloon;
        W.balloonHome = { pos: new THREE.Vector3(12.5, 0, -3.5), exit: new THREE.Vector3(9.4, 0, -3.2) };

        const balSign = new THREE.Mesh(
          new THREE.BoxGeometry(2.6, 0.62, 0.12),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🎈 SUNRISE BALLOON RIDE', { bg: '#991b1b', border: '#fde047', color: '#fffbeb', font: 'bold 26px sans-serif', width: 512 }) })
        );
        balSign.position.set(9.2, 1.42, -1.6); balSign.rotation.y = -0.35; worldGroup.add(balSign);
        const balPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.25, 6), railMat);
        balPost.position.set(9.2, 0.62, -1.6); worldGroup.add(balPost);
        W.zones.push({ id: 'safari_balloon', label: 'Soar in the Hot Air Balloon! 🎈 (+30c)', pos: new THREE.Vector3(12.5, 0, -3.5), radius: 3.6 });

        // 2) Tall Timber Ranger Watchtower Lookout Deck (Central-West Clearing: X=-7.5, Z=-9.0)
        const tower = new THREE.Group();
        tower.position.set(-7.5, 0, -9.0);
        [[-1.35, -1.35], [1.35, -1.35], [-1.35, 1.35], [1.35, 1.35]].forEach(p => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 6.6, 8), timber);
          leg.position.set(p[0], 3.3, p[1]); leg.castShadow = true; tower.add(leg);
        });
        // Cross braces & mid-tier wooden deck + top lookout deck at Y=4.8
        [2.2, 4.75].forEach(ty => {
          const deck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 3.2), timber);
          deck.position.y = ty; deck.castShadow = true; deck.receiveShadow = true; tower.add(deck);
        });
        // Safety railings on top deck
        [[-1.5, 0, 0.10, 3.1], [1.5, 0, 0.10, 3.1], [0, -1.5, 3.1, 0.10], [0, 1.5, 3.1, 0.10]].forEach(rb => {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(rb[2], 0.10, rb[3]), railMat);
          bar.position.set(rb[0], 5.65, rb[1]); tower.add(bar);
        });
        // Thatched pagoda watchtower canopy roof
        const tRoof = new THREE.Mesh(new THREE.ConeGeometry(2.85, 1.65, 4), thatch);
        tRoof.rotation.y = Math.PI / 4; tRoof.position.y = 7.35; tRoof.castShadow = true; tower.add(tRoof);
        // Angled timber ladder climbing up the south face
        [-0.36, 0.36].forEach(lx => {
          const side = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 5.2, 6), railMat);
          side.position.set(lx, 2.4, 1.85); side.rotation.x = -0.18; tower.add(side);
        });
        for (let r = 0; r < 10; r++) {
          const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.74, 6), railMat);
          rung.rotation.z = Math.PI / 2; rung.position.set(0, 0.45 + r * 0.46, 2.24 - r * 0.082); tower.add(rung);
        }
        // Brass tripod binoculars mounted on the north railing!
        const bMat = LS.makeToonMat(0xd4a33a);
        const tri = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.05, 6), railMat);
        tri.position.set(0, 5.35, -1.25); tower.add(tri);
        [-0.09, 0.09].forEach(bx => {
          const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.46, 8), bMat);
          tube.rotation.x = Math.PI / 2; tube.position.set(bx, 5.92, -1.32); tower.add(tube);
        });
        const tSign = new THREE.Mesh(
          new THREE.BoxGeometry(2.6, 0.60, 0.12),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🔭 SAVANNA WATCHTOWER', { bg: '#1e3a2f', border: '#fbbf24', color: '#fef9c3', font: 'bold 26px sans-serif', width: 512 }) })
        );
        tSign.position.set(0, 2.75, 1.72); tower.add(tSign);
        worldGroup.add(tower);
        addCollider(-7.5, -9.0, 1.85, 1.85);
        W.zones.push({ id: 'safari_watchtower', label: 'Climb Ranger Watchtower & Spot Lion Cubs 🔭', pos: new THREE.Vector3(-7.5, 0, -6.4), radius: 3.1 });

        // 3) Cheetah Sprint Challenge Track (Northeast Savanna Straightaway: X=27..-35.5 -> X=49..-31.0)
        const trackStart = new THREE.Vector3(27.0, 0, -35.5);
        const trackEnd = new THREE.Vector3(49.0, 0, -31.0);
        const trackDir = new THREE.Vector3().subVectors(trackEnd, trackStart);
        const trackLen = trackDir.length();
        const trackYaw = Math.atan2(trackDir.x, trackDir.z);

        // Compact sandy savanna sprint lane
        const lane = new THREE.Mesh(new THREE.PlaneGeometry(4.2, trackLen + 2.5), LS.makeToonMat(0xb8844c));
        lane.rotation.x = -Math.PI / 2;
        lane.rotation.z = -trackYaw;
        lane.position.set((trackStart.x + trackEnd.x) * 0.5, 0.025, (trackStart.z + trackEnd.z) * 0.5);
        lane.receiveShadow = true;
        worldGroup.add(lane);

        // 4 Striped Savanna Sprint Gates + Checkered Finish Arch!
        const gatePositions = [];
        for (let gi = 0; gi < 4; gi++) {
          const frac = (gi + 1) / 4;
          const gp = new THREE.Vector3().lerpVectors(trackStart, trackEnd, frac);
          gatePositions.push(gp);
          const gGrp = new THREE.Group();
          gGrp.position.copy(gp);
          gGrp.rotation.y = trackYaw;
          const isFinish = gi === 3;
          const postCol = isFinish ? LS.makeToonMat(0xdc2626) : LS.makeToonMat(0xf59e0b);
          [-2.1, 2.1].forEach(gx => {
            const p = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, isFinish ? 3.8 : 2.9, 8), postCol);
            p.position.set(gx, isFinish ? 1.9 : 1.45, 0); p.castShadow = true; gGrp.add(p);
          });
          if (isFinish) {
            const fBanner = new THREE.Mesh(
              new THREE.BoxGeometry(4.4, 0.85, 0.14),
              new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🏁 CHEETAH FINISH LINE!', { bg: '#111827', border: '#facc15', color: '#ffffff', font: 'bold 30px sans-serif', width: 512 }) })
            );
            fBanner.position.set(0, 3.65, 0); gGrp.add(fBanner);
          } else {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.22, 0.10), LS.makeToonMat(0xfacc15));
            bar.position.set(0, 2.85, 0); gGrp.add(bar);
          }
          worldGroup.add(gGrp);
        }

        // Start Sign + Friendly Spotted Cheetah (`anime_cheetah` HD GLB or Classic fallback!)
        const cSign = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 0.64, 0.12),
          new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🐆 CHEETAH SPRINT RACE', { bg: '#92400e', border: '#fde047', color: '#fffbeb', font: 'bold 26px sans-serif', width: 512 }) })
        );
        cSign.position.set(25.2, 1.45, -37.2); cSign.rotation.y = trackYaw - 0.3; worldGroup.add(cSign);
        const cPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.25, 6), railMat);
        cPost.position.set(25.2, 0.62, -37.2); worldGroup.add(cPost);

        const cheetah = new THREE.Group();
        cheetah.position.set(trackStart.x, 0, trackStart.z + 1.1);
        cheetah.rotation.y = trackYaw;
        if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_cheetah')) {
          const cm = LS.hdAssets.clone('anime_cheetah');
          cm.scale.setScalar(1.06);
          cheetah.add(cm);
        } else {
          const furM = LS.makeToonMat(0xebb44c), spotM = LS.makeToonMat(0x281e18), creamM = LS.makeToonMat(0xfaf0d7);
          const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 8), furM);
          body.scale.set(0.75, 0.80, 1.95); body.position.y = 0.88; body.castShadow = true; cheetah.add(body);
          [[-0.18, 0.56], [0.18, 0.56], [-0.18, -0.58], [0.18, -0.58]].forEach(l => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.85, 6), furM);
            leg.position.set(l[0], 0.42, l[1]); cheetah.add(leg);
          });
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), furM);
          head.position.set(0, 1.24, 0.82); cheetah.add(head);
          const muz = new THREE.Mesh(new THREE.SphereGeometry(0.12, 7, 6), creamM);
          muz.position.set(0, 1.18, 1.02); cheetah.add(muz);
          [-0.10, 0.10].forEach(ex => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.042, 6, 5), spotM); eye.position.set(ex, 1.28, 0.99); cheetah.add(eye);
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.065, 6, 5), furM); ear.position.set(ex * 1.6, 1.42, 0.78); cheetah.add(ear);
          });
          const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.042, 0.95, 6), furM);
          tail.rotation.x = 1.05; tail.position.set(0, 0.76, -1.05); cheetah.add(tail);
        }
        worldGroup.add(cheetah);
        W.cheetahObj = cheetah;
        W.cheetahTrack = { start: trackStart, end: trackEnd, yaw: trackYaw, gates: gatePositions };
        W.zones.push({ id: 'safari_cheetah_race', label: 'Race the Spotted Cheetah! 🐆🏁 (+35c)', pos: new THREE.Vector3(26.6, 0, -35.5), radius: 3.4 });

        // 4) Living Savanna Sky & Meadow Ecosystem: Soaring Birds, Butterflies & Evening Fireflies!
        const birdMat = LS.makeToonMat(0x4a3b32);
        for (let bi = 0; bi < 10; bi++) {
          const bg = new THREE.Group();
          const wL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.22), birdMat);
          wL.position.x = -0.32; bg.add(wL);
          const wR = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.22), birdMat);
          wR.position.x = 0.32; bg.add(wR);
          worldGroup.add(bg);
          W.savannaBirds.push({
            root: bg, wL, wR,
            cx: (bi % 3 - 1) * 18, cz: -14 + (bi % 2) * 18,
            radius: 14 + (bi % 4) * 5.5, height: 15.5 + (bi % 4) * 2.2,
            speed: 0.24 + (bi % 3) * 0.07, phase: bi * 0.72
          });
        }

        const bfCols = [0xfacc15, 0x38bdf8, 0xfb7185, 0xf97316, 0xa855f7];
        const bfAnchors = [[-16, 15], [-4, 22], [10, 21], [-22, -12], [-24, 3], [28, -14], [4, -27], [14, -3]];
        for (let fi = 0; fi < 16; fi++) {
          const an = bfAnchors[fi % bfAnchors.length];
          const bfg = new THREE.Group();
          const col = LS.makeToonMat(bfCols[fi % bfCols.length]);
          const lWing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.12), col); lWing.position.x = -0.07; bfg.add(lWing);
          const rWing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.12), col); rWing.position.x = 0.07; bfg.add(rWing);
          worldGroup.add(bfg);
          W.butterflies.push({ root: bfg, lWing, rWing, ax: an[0], az: an[1], phase: fi * 1.15, rad: 1.8 + (fi % 3) * 0.8 });
        }

        const ffMat = new THREE.MeshBasicMaterial({ color: 0xeaff7a, transparent: true, opacity: 0.0 });
        for (let ffi = 0; ffi < 24; ffi++) {
          const ff = new THREE.Mesh(new THREE.SphereGeometry(0.065, 5, 4), ffMat);
          const fx = -28 + (ffi * 23) % 62;
          const fz = -34 + (ffi * 19) % 66;
          ff.position.set(fx, 1.1 + (ffi % 3) * 0.55, fz);
          worldGroup.add(ff);
          W.fireflies.push({ mesh: ff, bx: fx, bz: fz, by: ff.position.y, phase: ffi * 0.85 });
        }
        W.fireflyMat = ffMat;
      });

      // 9. Lush Scattered Umbrella Acacias, Baobabs & Wild Savanna Flora
      safeRun('savanna_trees', () => {
        [
          [-18.5, -8.8, 1.05], [-38.0, 14.0, 1.18], [-44.0, -8.0, 1.25], [-42.0, -34.0, 1.12],
          [-16.0, -45.0, 1.15], [19.5, -40.5, 1.22], [46.5, -22.2, 1.18], [46.0, 4.0, 1.15],
          [26.0, 14.0, 1.02], [-8.0, 34.0, 1.14], [14.0, 36.0, 1.10], [-36.0, 28.0, 1.20]
        ].forEach(t => addAcacia(t[0], t[1], t[2]));
        addBaobab(33.5, -24.2, 1.12);
        addBaobab(-38.0, 20.0, 1.08);
      });

      // 10. 5 Playful Hiding Lion Cubs (Reset every 2h across 16 curated savanna hiding spots!)
      safeRun('hidden_lion_cubs', () => {
        const cubPool = [
          { pos: new THREE.Vector3(-19.5, 0, 11.5), hint: 'near the Giraffe Sanctuary acacia trees' },
          { pos: new THREE.Vector3(-34.5, 0, 9.5), hint: 'behind the tall giraffes on the west meadow' },
          { pos: new THREE.Vector3(-16.2, 0, -20.5), hint: 'near the Elephant Oasis boardwalk' },
          { pos: new THREE.Vector3(-42.5, 0, -24.5), hint: 'around the far side of the Flamingo Watering Hole' },
          { pos: new THREE.Vector3(-12.5, 0, -38.5), hint: 'beside the ancient Baobab next to Pride Rock' },
          { pos: new THREE.Vector3(14.5, 0, -34.0), hint: 'near the east boulder slope of Pride Rock' },
          { pos: new THREE.Vector3(29.0, 0, -20.0), hint: 'by the Meerkat Burrows and red termite mound' },
          { pos: new THREE.Vector3(42.5, 0, -10.5), hint: 'playing near the grazing Zebras' },
          { pos: new THREE.Vector3(36.0, 0, 6.5), hint: 'under an umbrella acacia east of Base Camp' },
          { pos: new THREE.Vector3(24.5, 0, 17.5), hint: 'along the dirt trail to the Safari Airstrip' },
          { pos: new THREE.Vector3(32.5, 0, 34.5), hint: 'beside the Serengeti Airstrip runway' },
          { pos: new THREE.Vector3(-24.0, 0, 31.5), hint: 'behind the Savanna Kids Playground slide' },
          { pos: new THREE.Vector3(-14.0, 0, 21.0), hint: 'between the Glamping Tent and Sticker Booth' },
          { pos: new THREE.Vector3(14.2, 0, 21.5), hint: 'behind Mama Nia’s Mango Smoothie Cafe' },
          { pos: new THREE.Vector3(-5.2, 0, -26.2), hint: 'watching Pride Rock near the Savanna Stream' },
          { pos: new THREE.Vector3(6.5, 0, 31.5), hint: 'hiding in the sunny golden grass south of the Campfire' }
        ];

        const cubMeta = [
          { id: 'cub_simba', name: 'Simba (Golden Cub)', tint: 0xf4b942 },
          { id: 'cub_nala', name: 'Nala (Cream Cub)', tint: 0xffe4a8 },
          { id: 'cub_zuri', name: 'Zuri (Honey Cub)', tint: 0xe89c3c },
          { id: 'cub_kopa', name: 'Kopa (Sunny Cub)', tint: 0xf7c552 },
          { id: 'cub_asha', name: 'Asha (Amber Cub)', tint: 0xe68a38 }
        ];

        const chosenSpots = LS.pickRoundSpots(cubPool, LS.state.lionCubsRound || 0, 5);
        cubMeta.forEach((cm, idx) => {
          const spot = chosenSpots[idx];
          const found = LS.state.foundLionCubs && LS.state.foundLionCubs.includes(cm.id);
          const cg = new THREE.Group();
          cg.position.copy(spot.pos);
          cg.rotation.y = idx * 1.25;
          let tailRef = null;

          if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_lion_cub')) {
            const mdl = LS.hdAssets.clone('anime_lion_cub');
            mdl.scale.setScalar(1.38);
            cg.add(mdl);
          } else {
            const furM = LS.makeToonMat(cm.tint), creamM = LS.makeToonMat(0xfdf3d8), tuftM = LS.makeToonMat(0x7c4a21), darkM = LS.makeToonMat(0x1e1612);
            const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), furM); body.scale.set(0.85, 0.82, 1.3); body.position.y = 0.30; body.castShadow = true; cg.add(body);
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), furM); head.position.set(0, 0.56, 0.22); cg.add(head);
            const muz = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), creamM); muz.position.set(0, 0.50, 0.42); cg.add(muz);
            [-0.18, 0.18].forEach(ex => {
              const ear = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 6), furM); ear.position.set(ex, 0.74, 0.18); cg.add(ear);
              const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), darkM); eye.position.set(ex * 0.55, 0.59, 0.42); cg.add(eye);
            });
            tailRef = new THREE.Group(); tailRef.position.set(0, 0.34, -0.30);
            const tStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.36, 6), furM); tStem.rotation.x = -0.85; tStem.position.set(0, 0.08, -0.14); tailRef.add(tStem);
            const tTip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 6, 6), tuftM); tTip.position.set(0, 0.18, -0.28); tailRef.add(tTip);
            cg.add(tailRef);
          }

          const marker = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.20, 0),
            new THREE.MeshBasicMaterial({ color: 0xffd166 })
          );
          marker.position.y = 1.48;
          marker.visible = !found;
          cg.add(marker);
          worldGroup.add(cg);

          W.hiddenAnimals.push({
            id: cm.id, name: cm.name, kind: 'lion_cub', mesh: cg, tail: tailRef,
            marker, found, hint: spot.hint
          });
          if (!found) {
            W.zones.push({ id: 'animal:' + cm.id, label: 'Pet ' + cm.name + ' 🦁', pos: spot.pos.clone(), radius: 2.5 });
          }
        });
      });

      // 11. Friendly Safari NPCs (9 Lively Rangers, Photographers & Explorers with Alternating Phrases!)
      safeRun('safari_npcs', () => {
        LS.spawnWorldNPCs(worldGroup, [
          { name: 'Ranger Amara', pos: new THREE.Vector3(3.4, 0, 13.8), baseRot: -0.35, waveOnNear: true,
            line: 'Jambo, {leader}! Ride the Hot Air Balloon, snap wildlife photos, or hop in our Safari Jeep!',
            lines: [
              'Jambo, {leader}! Ride the Hot Air Balloon, snap wildlife photos, or hop in our Safari Jeep!',
              'Look how golden the Serengeti grass waves in the warm wind today, {leader}! 🌾☀️',
              'Have you and {companion} heard the lion king roar from Pride Rock yet, {leader}? 🦁'
            ],
            char: { scale: 0.98, hairColor: 0x1b1514, skinColor: 0x9c6644, topColor: 0xd4a359, bottomColor: 0x5c5346, pants: true, hatType: 'kinder', hatColor: 0xb08968,
              faceOpts: { eyeColor: '#3a2214', eyeHighlight: '#a66d3c', blush: 'rgba(214, 108, 92, 0.35)' } } },
          { name: 'Dr. Kofi', pos: new THREE.Vector3(7.6, 0, 15.2), baseRot: -Math.PI * 0.42, waveOnNear: true,
            line: 'Welcome to Savanna Ranger Academy, {leader}! Test your wildlife knowledge for coins & XP!',
            lines: [
              'Welcome to Savanna Ranger Academy, {leader}! Test your wildlife knowledge for coins & XP!',
              'Did you know giraffes have the same number of neck bones as humans, {leader}? 🦒✨',
              'You make an amazing Junior Wildlife Ranger, {leader}! 🌿🏆'
            ],
            char: { scale: 1.0, hairColor: 0x1e1b18, skinColor: 0x8d5524, topColor: 0x4a7c59, bottomColor: 0x3b3a36, pants: true,
              faceOpts: { glasses: true, mustache: true, eyeColor: '#2c1e16', eyeHighlight: '#7c5c42', blush: 'rgba(196, 102, 88, 0.25)' } } },
          { name: 'Mama Nia', pos: new THREE.Vector3(7.2, 0, 23.6), baseRot: -Math.PI * 0.35, waveOnNear: true,
            line: 'Fresh Mango Sunrise Smoothies, {leader}! One sip gives you super savanna speed!',
            lines: [
              'Fresh Mango Sunrise Smoothies, {leader}! One sip gives you super savanna speed!',
              'Sweet golden mangoes picked right under the savanna sun for you, {leader}! 🥭☀️',
              'Perfect fuel before racing the speedy Cheetah Sprint, {leader}! 🐆⚡'
            ],
            char: { scale: 0.94, hairColor: 0x1c1412, skinColor: 0x945b36, topColor: 0xe76f51, bottomColor: 0xf4a261, hairBun: true,
              faceOpts: { eyeColor: '#422416', eyeHighlight: '#b56e3e', blush: 'rgba(226, 114, 98, 0.42)' } } },
          { name: 'Keeper Zara', pos: new THREE.Vector3(-20.8, 0, 4.8), baseRot: Math.PI * 0.4, waveOnNear: true,
            line: 'Walk right up the cedar ramp to our giraffe feeding deck, {leader}!',
            lines: [
              'Walk right up the cedar ramp to our giraffe feeding deck, {leader}!',
              'The tall giraffes love munching fresh acacia leaves from up on the deck, {leader}! 🦒🌿',
              'Don\'t forget to visit the splashing Hippo Lagoon just north of here, {leader}! 🦛💦'
            ],
            char: { scale: 0.94, hairColor: 0x241814, skinColor: 0xa66e48, topColor: 0xe9c46a, bottomColor: 0x6b705c, pants: true, hatType: 'cap', hatColor: 0x4a7c59,
              faceOpts: { eyeColor: '#2a4c36', eyeHighlight: '#6cc48c', blush: 'rgba(224, 118, 102, 0.38)' } } },
          { name: 'Photographer Jabari 📷', pos: new THREE.Vector3(-12.5, 0, 12.0), baseRot: 0.5, patrol: { axis: 'z', center: 12.0, range: 5.5, speed: 1.0 },
            line: 'Hi {leader}! Use the Wildlife Camera to snap amazing photos of elephants and flamingos! 📷🦩',
            lines: [
              'Hi {leader}! Use the Wildlife Camera to snap amazing photos of elephants and flamingos! 📷🦩',
              'The golden sunlight on Mt. Kilimanjaro looks like a painting today, {leader}! 🏔️✨',
              'Watch closely behind the umbrella acacias for hiding lion cubs, {leader}! 🦁'
            ],
            char: { scale: 0.96, hairColor: 0x1a1412, skinColor: 0x8d5524, topColor: 0xc9a259, bottomColor: 0x4b5563, pants: true, hatType: 'sunhat', hatColor: 0xb08968 } },
          { name: 'Balloon Pilot Makena 🎈', pos: new THREE.Vector3(16.8, 0, 12.2), baseRot: -0.6, waveOnNear: true,
            line: 'Ready to soar above the treetops in our rainbow Hot Air Balloon, {leader}? 🎈☀️',
            lines: [
              'Ready to soar above the treetops in our rainbow Hot Air Balloon, {leader}? 🎈☀️',
              'From way up high you can see the entire Serengeti and zebras galloping below, {leader}! 🦓',
              'The savanna breeze is super gentle for floating today, {leader}! 🌤️'
            ],
            char: { scale: 0.93, hairColor: 0x1c1412, skinColor: 0x9b6440, topColor: 0xef4444, bottomColor: 0x334155, longHair: true } },
          { name: 'Birdwatcher Tunde 🔭', pos: new THREE.Vector3(-6.2, 0, -5.8), baseRot: 0.25, waveOnNear: true,
            line: 'Jambo {leader}! Climb the wooden Watchtower to spot pink flamingos and wild zebras! 🔭🦩',
            lines: [
              'Jambo {leader}! Climb the wooden Watchtower to spot pink flamingos and wild zebras! 🔭🦩',
              'Listen to the songbirds whistling from the giant baobab branches, {leader}! 🌳🎶',
              'Can you count how many hippos are blowing bubbles in the lagoon, {leader}? 🦛'
            ],
            char: { scale: 0.97, hairColor: 0x1e1a18, skinColor: 0x7c4824, topColor: 0x2a9d8f, bottomColor: 0x3b3a36, pants: true, faceOpts: { glasses: true } } },
          { name: 'Junior Explorer Aisha 🧭', pos: new THREE.Vector3(-15.5, 0, 22.8), baseRot: -0.4, patrol: { axis: 'x', center: -15.5, range: 4.0, speed: 1.15 },
            line: 'Hi {leader}! Try the wooden savanna swing and slide by the camp playground! 🛝✨',
            lines: [
              'Hi {leader}! Try the wooden savanna swing and slide by the camp playground! 🛝✨',
              'I already found 3 playful lion cubs hiding in the tall grass, {leader}! 🦁🌾',
              'Let\'s go see the baby elephants splashing in the waterhole, {leader}! 🐘💧'
            ],
            char: { scale: 0.76, hairColor: 0x1d1412, skinColor: 0x9c6644, topColor: 0xfbbf24, bottomColor: 0x2563eb, pigtails: true } },
          { name: 'Airstrip Pilot Samira ✈️', pos: new THREE.Vector3(24.5, 0, 24.5), baseRot: -Math.PI * 0.65, waveOnNear: true,
            line: 'Hello {leader}! Whenever you\'re ready to fly home or to Marrakech, our Safari Airstrip is open! ✈️',
            lines: [
              'Hello {leader}! Whenever you\'re ready to fly home or to Marrakech, our Safari Airstrip is open! ✈️',
              'The striped windsock shows a smooth tailwind for takeoff, {leader}! 🌬️🛫',
              'Come back to visit the giraffes and lion cubs anytime, {leader}! 🦒💛'
            ],
            char: { scale: 0.94, hairColor: 0x1e1612, skinColor: 0x945b36, topColor: 0x0284c7, bottomColor: 0x1e293b, pants: true, hatType: 'cap', hatColor: 0x1e3a5f } }
        ]);
      });

      // 12. 16,000 Wind-Swept Golden Savanna Grass Tufts in HD Mode!
      safeRun('hd_savanna_grass', () => {
        if (!LS.isHD || !LS.hdAssets || !LS.hdAssets.addInstancedGrass) return;
        const loopSp = SC.sampleSpline(SAFARI_LOOP_PTS, 5);
        const sSp = SC.sampleSpline(SAFARI_SOUTH_TRAIL, 4);
        const aSp = SC.sampleSpline(SAFARI_AIRSTRIP_TRAIL, 4);
        const nearSp = (sp, x, z, r2) => {
          for (let i = 0; i < sp.length; i++) {
            const dx = x - sp[i][0], dz = z - sp[i][1];
            if (dx * dx + dz * dz < r2) return true;
          }
          return false;
        };
        LS.hdAssets.addInstancedGrass(worldGroup, { minX: -58, maxX: 58, minZ: -54, maxZ: 46 }, (x, z) => {
          if (Math.hypot(x, z - 17.5) < 10.6) return false; // Base camp courtyard
          if (Math.hypot(x, z - 28.0) < 3.4) return false; // Djembe campfire circle
          if (Math.hypot(x + 18.2, z - 16.5) < 4.5) return false; // Glamping tent deck
          if (Math.hypot(x - 16.2, z - 26.8) < 3.8) return false; // Maasai Craft Market
          if (Math.hypot(x - 12.5, z + 3.5) < 4.4) return false; // Hot Air Balloon launch pad
          if (Math.hypot(x + 7.5, z + 9.0) < 3.0) return false; // Ranger Watchtower base
          if (Math.hypot(x + 29.5, z + 28.5) < 12.8) return false; // Elephant watering hole
          if (Math.hypot(x + 25.0, z + 15.5) < 7.2) return false; // Hippo Lagoon
          if (x > -20.0 && x < 21.5 && z > -33.2 && z < -25.8) return false; // Savanna Stream & Bridge
          if (x > 25.0 && x < 51.0 && z > -38.5 && z < -28.5) return false; // Cheetah Sprint Track
          if (x > 36.5 && x < 48.5 && z > 4.0 && z < 48.0) return false; // Dirt airstrip
          if (x < -19.5 && x > -27.5 && z > -1.2 && z < 5.2) return false; // Giraffe feeding deck
          if (nearSp(loopSp, x, z, 3.0 * 3.0)) return false;
          if (nearSp(sSp, x, z, 2.5 * 2.5)) return false;
          if (nearSp(aSp, x, z, 2.3 * 2.3)) return false;
          for (let c = 0; c < W.colliders.length; c++) {
            const b = W.colliders[c];
            if (x > b.minX - 0.5 && x < b.maxX + 0.5 && z > b.minZ - 0.5 && z < b.maxZ + 0.5) return false;
          }
          return true;
        }, 'safari');
      });

      // 5 Animated Strolling Safari Visitors & Junior Rangers exploring Base Camp & Acacia Trails!
      W.strollers = [];
      safeRun('safari_strollers', () => {
        const visitorDefs = [
          { cx: 1.0, cz: 15.5, rx: 9.5, rz: 7.5, speed: 0.21, phase: 0.0, name: 'Ranger Amina 🌿', line: 'Look out for playful lion cubs peeking behind the acacias! 🦁', cfg: { scale: 0.96, hairColor: 0x1e1612, skinColor: 0x9b6440, topColor: 0xd9b37c, bottomColor: 0x5c4632, pants: true } },
          { cx: 4.5, cz: 19.0, rx: 7.2, rz: 6.2, speed: -0.19, phase: 1.6, cfg: { scale: 0.92, hairColor: 0x3b2618, skinColor: 0xdba57e, topColor: 0x4f8a5b, bottomColor: 0xc29a68, hairBun: true } },
          { cx: -12.0, cz: 8.5, rx: 5.5, rz: 6.8, speed: 0.22, phase: 3.1, cfg: { scale: 0.88, hairColor: 0x261a14, skinColor: 0xaa6f48, topColor: 0xf4a236, bottomColor: 0x3b5c42, pants: true } },
          { cx: 11.5, cz: 6.0, rx: 6.4, rz: 5.8, speed: -0.20, phase: 4.4, cfg: { scale: 0.95, hairColor: 0x2c2018, skinColor: 0xcf976f, topColor: 0xe07a5f, bottomColor: 0x4a3b2c, longHair: true } },
          { cx: -3.5, cz: 22.0, rx: 8.2, rz: 5.4, speed: 0.18, phase: 5.3, cfg: { scale: 0.99, hairColor: 0x1a1412, skinColor: 0x8d5836, topColor: 0xc8a46e, bottomColor: 0x4b5b3c, pants: true, faceOpts: { glasses: true } } }
        ];
        visitorDefs.forEach(vd => {
          const ch = LS.createAnimeCharacter(vd.cfg);
          if (vd.name && vd.line && LS.createSpeechBubbleSprite) {
            const sb = LS.createSpeechBubbleSprite(vd.name, vd.line);
            sb.position.set(0, 2.34, 0);
            ch.root.add(sb);
          }
          worldGroup.add(ch.root);
          W.strollers.push({ ch, cx: vd.cx, cz: vd.cz, rx: vd.rx, rz: vd.rz, speed: vd.speed, phase: vd.phase });
        });
      });

      W.getMochiIdleAnchor = function () { return { pos: new THREE.Vector3(2.2, 0, 15.8), rotY: -Math.PI * 0.25 }; };

      W.getZoneLabel = function (px, pz) {
        if (px > 26 && pz > 14) return 'Serengeti Airstrip';
        if (px > 23 && pz < -27) return 'Cheetah Sprint Track';
        if (px < -15 && pz < -10 && pz > -21) return 'Lily-Pad Hippo Lagoon';
        if (px < -15 && pz <= -21) return 'Elephant & Flamingo Oasis';
        if (px < -16 && pz >= -10 && pz <= 13) return 'Giraffe Sanctuary';
        if (pz < -28 && px >= -14 && px <= 22) return 'Pride Rock Kopje';
        if (px > 18 && pz < 12) return 'Zebra Meadow & Meerkats';
        if (px < -12 && pz > 20) return 'Savanna Kids Park';
        if (Math.hypot(px - 12.5, pz + 3.5) < 7.5) return 'Sunrise Balloon Pad';
        if (Math.hypot(px + 7.5, pz + 9.0) < 6.0) return 'Ranger Watchtower';
        return 'Safari Base Camp';
      };

      W.update = function (dt, elapsed) {
        if (LS.runtime.safariFeedTimer > 0) LS.runtime.safariFeedTimer = Math.max(0, LS.runtime.safariFeedTimer - dt);
        const feeding = LS.runtime.safariFeedTimer > 0;

        // Animated Strolling Safari Visitors & Junior Rangers
        W.strollers.forEach(st => {
          const a = elapsed * st.speed + st.phase;
          const nx = st.cx + Math.cos(a) * st.rx;
          const nz = st.cz + Math.sin(a) * st.rz;
          const dx = -Math.sin(a) * st.rx * st.speed;
          const dz = Math.cos(a) * st.rz * st.speed;
          st.ch.root.position.set(nx, 0, nz);
          st.ch.root.rotation.y = Math.atan2(dx, dz);
          const sw = Math.sin(elapsed * 6.0 + st.phase) * 0.45;
          st.ch.leftLeg.rotation.x = sw;
          st.ch.rightLeg.rotation.x = -sw;
          st.ch.leftArm.rotation.x = -sw * 0.65;
          st.ch.rightArm.rotation.x = sw * 0.65;
        });

        // Gentle Giraffe grazing & happy feeding nod!
        W.giraffes.forEach(g => {
          g.root.rotation.y = g.baseRot + Math.sin(elapsed * 0.65 + g.phase) * 0.14;
          g.inner.rotation.x = feeding ? (0.14 + Math.sin(elapsed * 5.2 + g.phase) * 0.08) : (Math.sin(elapsed * 1.1 + g.phase) * 0.035);
        });

        // Gentle Elephants swaying & splashing!
        W.elephants.forEach(e => {
          e.root.rotation.y = e.baseRot + Math.sin(elapsed * 0.55 + e.phase) * 0.12;
          e.root.position.y = e.baseY + (feeding ? Math.abs(Math.sin(elapsed * 4.5 + e.phase)) * 0.14 : Math.sin(elapsed * 1.2 + e.phase) * 0.025);
        });

        // Watering hole splash ripples + Baby Elephant sparkling water-spray arc!
        W.splashRings.forEach((ring, i) => {
          const cyc = (elapsed * (feeding ? 1.35 : 0.62) + i * 0.33) % 1;
          const sc = 0.6 + cyc * 3.4;
          ring.scale.set(sc, sc, 1);
          ring.material.opacity = (1 - cyc) * (feeding ? 0.72 : 0.38);
        });
        W.sprayDrops.forEach(d => {
          const cyc = (elapsed * (feeding ? 1.55 : 0.92) + d.phase) % 1;
          const arcY = 1.15 + Math.sin(cyc * Math.PI) * (feeding ? 2.45 : 1.75) - cyc * 0.95;
          d.mesh.position.set(-23.25 + cyc * 2.15, Math.max(0.08, arcY), -27.5 + d.spread * cyc * 2.2);
          const sc = 0.55 + Math.sin(cyc * Math.PI) * 0.75;
          d.mesh.scale.setScalar(sc);
        });

        // Bobbing Savanna Hippos + expanding ripples + nostril bubbles!
        W.hippos.forEach(h => {
          h.root.position.y = h.baseY + Math.sin(elapsed * 1.1 + h.phase) * 0.14;
          h.root.rotation.y = h.baseRot + Math.sin(elapsed * 0.48 + h.phase) * 0.12;
          const rc = (elapsed * 0.45 + h.phase) % 1;
          h.ring.scale.setScalar(0.85 + rc * 1.85);
          h.ring.material.opacity = (1 - rc) * 0.42;
        });
        W.hippoBubbles.forEach(b => {
          const cyc = (elapsed * 0.85 + b.phase) % 1;
          b.mesh.position.set(b.anchorX + Math.sin(elapsed * 3 + b.phase) * 0.12, 0.08 + cyc * 0.52, b.anchorZ);
          b.mesh.scale.setScalar(0.4 + cyc * 0.85);
        });

        // Playful Sentinel Meerkats popping up and ducking down based on Laila's proximity!
        const lPos = (LS.chars && LS.chars.laila) ? LS.chars.laila.root.position : null;
        W.meerkats.forEach(m => {
          const dist = lPos ? Math.hypot(lPos.x - m.x, lPos.z - m.z) : 99;
          const shy = dist < 3.6;
          const bob = shy ? -0.44 : (Math.sin(elapsed * 1.65 + m.phase) > -0.25 ? 0.02 : -0.34);
          m.root.position.y += (bob - m.root.position.y) * Math.min(1, dt * 6.5);
          m.root.rotation.y = m.baseRot + Math.sin(elapsed * 2.1 + m.phase) * 0.42;
        });

        // Pink Flamingos bobbing gently
        W.flamingos.forEach(f => {
          f.root.rotation.z = Math.sin(elapsed * 1.4 + f.phase) * 0.06;
        });

        // Zebras grazing & gentle meadow trotting loops (works smoothly in HD & Classic!)
        W.zebras.forEach(z => {
          if (z.trotRadius > 0) {
            const ang = elapsed * 0.34 + z.phase;
            const nx = z.baseX + Math.cos(ang) * z.trotRadius;
            const nz = z.baseZ + Math.sin(ang) * (z.trotRadius * 0.72);
            const vx = -Math.sin(ang) * z.trotRadius;
            const vz = Math.cos(ang) * (z.trotRadius * 0.72);
            z.root.position.set(nx, Math.abs(Math.sin(elapsed * 4.5 + z.phase)) * 0.06, nz);
            z.root.rotation.y = Math.atan2(vx, vz);
          } else if (z.neck) {
            z.neck.rotation.x = 0.18 + Math.sin(elapsed * 1.3 + z.phase) * 0.24;
          } else if (z.inner) {
            z.root.rotation.y = z.baseRot + Math.sin(elapsed * 0.65 + z.phase) * 0.14;
            z.inner.rotation.x = Math.sin(elapsed * 1.2 + z.phase) * 0.045;
          }
        });

        // King Lion Pride Rock Roar head-lift & expanding golden roar ring!
        if (LS.runtime.prideRoarTimer > 0) {
          LS.runtime.prideRoarTimer = Math.max(0, LS.runtime.prideRoarTimer - dt);
          const p = 1 - LS.runtime.prideRoarTimer / 2.2;
          if (W.kingLionMesh) {
            W.kingLionMesh.rotation.x = -Math.sin(Math.min(1, p * 1.4) * Math.PI) * 0.24;
            W.kingLionMesh.position.y = 4.48 + Math.sin(Math.min(1, p * 1.4) * Math.PI) * 0.18;
          }
          if (W.roarRing) {
            W.roarRing.scale.setScalar(0.8 + p * 6.5);
            W.roarRing.material.opacity = (1 - p) * 0.78;
          }
        } else {
          if (W.kingLionMesh) { W.kingLionMesh.rotation.x = 0; W.kingLionMesh.position.y = 4.48; }
          if (W.roarRing) W.roarRing.material.opacity = 0;
        }

        // Flickering Djembe Campfire flames
        W.campfireFlames.forEach(fl => {
          const flicker = 0.85 + Math.sin(elapsed * 11.5 + fl.phase) * 0.22;
          fl.mesh.scale.set(0.92 + Math.cos(elapsed * 9 + fl.phase) * 0.12, flicker, 0.92 + Math.sin(elapsed * 8 + fl.phase) * 0.12);
          fl.mesh.position.y = fl.baseY + (flicker - 1) * 0.22;
        });

        // Idle Hot Air Balloon gentle breathing sway & burner pulse
        if (W.balloonFlame) {
          const riding = !!LS.runtime.balloonRide;
          const fs = (riding ? 1.35 : 0.75) + Math.sin(elapsed * 14) * 0.25;
          W.balloonFlame.scale.set(1, fs, 1);
        }
        if (W.hotAirBalloon && !LS.runtime.balloonRide) {
          W.hotAirBalloon.rotation.z = Math.sin(elapsed * 0.9) * 0.025;
          W.hotAirBalloon.position.y = Math.sin(elapsed * 1.2) * 0.06;
        }

        // Soaring Savanna Birds, Fluttering Butterflies & Evening Fireflies!
        W.savannaBirds.forEach(b => {
          const a = elapsed * b.speed + b.phase;
          b.root.position.set(b.cx + Math.cos(a) * b.radius, b.height + Math.sin(elapsed * 0.9 + b.phase) * 1.1, b.cz + Math.sin(a) * b.radius);
          b.root.rotation.y = -a;
          const flap = Math.sin(elapsed * 5.8 + b.phase) * 0.42;
          b.wL.rotation.z = flap;
          b.wR.rotation.z = -flap;
        });
        W.butterflies.forEach(bf => {
          const t = elapsed * 1.4 + bf.phase;
          bf.root.position.set(bf.ax + Math.cos(t * 0.7) * bf.rad, 1.05 + Math.sin(t * 2.1) * 0.42, bf.az + Math.sin(t * 0.9) * bf.rad);
          bf.root.rotation.y = -t * 0.7;
          const fl = Math.sin(elapsed * 18 + bf.phase) * 0.75;
          bf.lWing.rotation.z = fl;
          bf.rWing.rotation.z = -fl;
        });
        if (W.fireflyMat) {
          const nightBoost = LS.state.timeMode === 2 ? 0.92 : (LS.state.timeMode === 1 ? 0.48 : 0.0);
          W.fireflyMat.opacity = nightBoost * (0.65 + Math.sin(elapsed * 3.8) * 0.35);
          if (nightBoost > 0.05) {
            W.fireflies.forEach(ff => {
              ff.mesh.position.set(
                ff.bx + Math.sin(elapsed * 0.8 + ff.phase) * 1.4,
                ff.by + Math.sin(elapsed * 1.9 + ff.phase) * 0.45,
                ff.bz + Math.cos(elapsed * 0.7 + ff.phase) * 1.4
              );
            });
          }
        }

        // Bush plane propeller + windsock
        if (W.propeller) W.propeller.rotation.z += dt * 7.5;
        if (W.windsock) W.windsock.rotation.y = Math.sin(elapsed * 3.4) * 0.22;

        // Playful hiding Lion Cubs bobbing & beacon spinning
        W.hiddenAnimals.forEach((cub, idx) => {
          if (cub.tail) cub.tail.rotation.y = Math.sin(elapsed * 4.2 + idx) * 0.38;
          if (cub.marker && cub.marker.visible) {
            cub.marker.rotation.y = elapsed * 2.4 + idx;
            cub.marker.position.y = 1.48 + Math.sin(elapsed * 3.5 + idx) * 0.14;
          }
        });
      };

      W.drawMiniMap = function (ctx, cw, ch, toMapX, toMapY) {
        ctx.fillStyle = '#c8a956'; ctx.fillRect(0, 0, cw, ch);
        // Sunlit open savanna clearings
        ctx.fillStyle = '#d7ba68';
        [[34, -10, 18], [-32, 2, 15], [0, 17, 13]].forEach(m => {
          ctx.beginPath(); ctx.arc(toMapX(m[0]), toMapY(m[1]), m[2], 0, Math.PI * 2); ctx.fill();
        });
        // Elephant Oasis + Hippo Lagoon + Savanna Stream!
        ctx.fillStyle = '#2d8da0';
        ctx.beginPath(); ctx.arc(toMapX(-29.5), toMapY(-28.5), 14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(toMapX(-25.0), toMapY(-15.5), 7.5, 0, Math.PI * 2); ctx.fill();
        strokeMapSpline(ctx, [[-18.8, -31.2], [-10.0, -30.5], [3.2, -29.8], [14.0, -28.8], [20.5, -26.2]], toMapX, toMapY, '#2d8da0', 4.5);
        // Rope Suspension Bridge marker
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(toMapX(1.6), toMapY(-32.8), Math.max(3, toMapX(4.8) - toMapX(1.6)), Math.max(5, toMapY(-26.8) - toMapY(-32.8)));
        // Pride Rock Kopje
        ctx.fillStyle = '#9a7a52';
        ctx.beginPath(); ctx.ellipse(toMapX(3.0), toMapY(-40.5), 10, 7, 0, 0, Math.PI * 2); ctx.fill();
        // Cheetah Sprint Track
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(toMapX(27.0), toMapY(-35.5)); ctx.lineTo(toMapX(49.0), toMapY(-31.0)); ctx.stroke();
        // Serengeti Airstrip
        ctx.fillStyle = '#8b6340';
        ctx.fillRect(toMapX(37), toMapY(6), toMapX(48) - toMapX(37), toMapY(46) - toMapY(6));
        // Safari Jeep Loop & Footpaths
        strokeMapSpline(ctx, SAFARI_LOOP_PTS, toMapX, toMapY, '#a66e3d', 4.2);
        strokeMapSpline(ctx, SAFARI_SOUTH_TRAIL, toMapX, toMapY, '#a66e3d', 3.4);
        strokeMapSpline(ctx, SAFARI_AIRSTRIP_TRAIL, toMapX, toMapY, '#a66e3d', 2.8);
        // Landmark pins: Hot Air Balloon (red), Glamping Tent (cream), Watchtower (green), Campfire (orange)
        [[12.5, -3.5, '#ef4444'], [-18.2, 16.5, '#fef3c7'], [-7.5, -9.0, '#16a34a'], [0, 28.0, '#f97316']].forEach(p => {
          ctx.fillStyle = p[2];
          ctx.beginPath(); ctx.arc(toMapX(p[0]), toMapY(p[1]), 3.5, 0, Math.PI * 2); ctx.fill();
        });
      };

      return W;
    }
  });
})(window.LailaSalma);
