window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  function createDeparturesBoardTex() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0f2338';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 240);

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('✈️ INTERNATIONAL DEPARTURES', 28, 46);

    ctx.strokeStyle = 'rgba(125,211,252,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(24, 60); ctx.lineTo(488, 60); ctx.stroke();

    const showUpcoming = Boolean(LS.shouldShowUpcomingWorlds && LS.shouldShowUpcomingWorlds());
    const rows = [
      { gate: 'A1', dest: 'AFRICAN SAFARI (SERENGETI)', status: 'BOARDING', col: '#6ee7b7' },
      { gate: 'A2', dest: 'MARRAKECH (MOROCCO)', status: 'BOARDING', col: '#6ee7b7' }
    ];
    if (LS.isWorldEnabled && LS.isWorldEnabled('tokyo')) {
      rows.push({ gate: 'J1', dest: 'TOKYO & KYOTO (JAPAN)', status: 'BOARDING', col: '#6ee7b7' });
    } else if (showUpcoming) {
      rows.push({ gate: 'B1', dest: 'TOKYO & KYOTO (JAPAN)', status: 'WAVE 2A', col: '#fde68a' });
    } else {
      rows.push({ gate: 'H0', dest: 'SUNNYSIDE HOME COMMUNITY', status: 'ARRIVALS', col: '#93c5fd' });
    }
    if (showUpcoming) {
      rows.push({ gate: 'B2', dest: 'CHINA • PARIS • LONDON', status: 'UPCOMING', col: '#93c5fd' });
    } else {
      rows.push({ gate: 'G1', dest: 'CHECK IN AT GATE A1 DESK', status: 'OPEN NOW', col: '#fde68a' });
    }
    ctx.font = 'bold 20px monospace';
    rows.forEach((r, i) => {
      const y = 98 + i * 38;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(r.gate, 28, y);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(r.dest, 72, y);
      ctx.fillStyle = r.col;
      ctx.fillText(r.status, 386, y);
    });
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function createAirportSignTex(title, sub) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#0369a1');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 496, 112);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 62);
    ctx.fillStyle = '#fef08a';
    ctx.font = '600 20px sans-serif';
    ctx.fillText(sub, 256, 98);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function createMarbleFloorTex() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f3ece0';
    ctx.fillRect(0, 0, 512, 512);
    const tile = 64;
    for (let r = 0; r < 8; r++) {
      for (let col = 0; col < 8; col++) {
        ctx.fillStyle = (r + col) % 2 === 0 ? '#f7f1e6' : '#ebe2d1';
        ctx.fillRect(col * tile + 2, r * tile + 2, tile - 4, tile - 4);
      }
    }
    ctx.strokeStyle = 'rgba(180, 160, 130, 0.25)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += tile) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 4);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function buildGhibliAirliner() {
    const g = new THREE.Group();
    const ivory = LS.makeToonMat(0xfdfaf3);
    const skyBlue = LS.makeToonMat(0x2892d7);
    const gold = LS.makeToonMat(0xf4be44);
    const darkGlass = LS.makeToonMat(0x1e3a5f);
    const silver = LS.makeToonMat(0xcbd5e1);
    const tire = LS.makeToonMat(0x272b33);

    // Main fuselage cylinder + rounded nose & tapered tail cone
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 13.5, 18), ivory);
    body.rotation.z = Math.PI / 2;
    body.position.set(0, 2.85, 0);
    body.castShadow = true;
    g.add(body);

    const belly = new THREE.Mesh(new THREE.CylinderGeometry(1.47, 1.47, 13.4, 18, 1, false, Math.PI * 0.65, Math.PI * 0.7), skyBlue);
    belly.rotation.z = Math.PI / 2;
    belly.position.set(0, 2.83, 0);
    g.add(belly);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.22, 2.94), gold);
    stripe.position.set(0, 2.82, 0);
    g.add(stripe);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(1.45, 16, 12), ivory);
    nose.scale.set(1.65, 0.96, 0.98);
    nose.position.set(6.75, 2.80, 0);
    nose.castShadow = true;
    g.add(nose);

    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1.12, 12, 8), darkGlass);
    cockpit.scale.set(1.15, 0.45, 0.92);
    cockpit.position.set(7.25, 3.22, 0);
    g.add(cockpit);

    const tailCone = new THREE.Mesh(new THREE.ConeGeometry(1.45, 4.6, 16), ivory);
    tailCone.rotation.z = Math.PI / 2;
    tailCone.position.set(-9.0, 2.92, 0);
    g.add(tailCone);

    // Tall turquoise-and-gold tailfin + horizontal stabilizers
    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.8, 0.28), skyBlue);
    tailFin.position.set(-8.6, 5.15, 0);
    tailFin.rotation.z = 0.28;
    tailFin.castShadow = true;
    g.add(tailFin);

    const finStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), LS.makeEmissiveMat(0xffe066, 0xffc300, 0.45));
    finStar.position.set(-8.65, 5.55, 0.16);
    g.add(finStar);
    const finStarB = finStar.clone();
    finStarB.position.z = -0.16;
    g.add(finStarB);

    const hStab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 6.2), silver);
    hStab.position.set(-8.9, 3.18, 0);
    g.add(hStab);

    // Swept main wings + twin turbofan engines + glowing wingtip beacons
    [-1, 1].forEach(side => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.26, 8.8), silver);
      wing.position.set(0.4, 2.38, side * 5.2);
      wing.rotation.y = side * -0.22;
      wing.rotation.x = side * -0.05;
      wing.castShadow = true;
      g.add(wing);

      const wingTip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.95, 0.16), skyBlue);
      wingTip.position.set(-0.6, 2.95, side * 9.35);
      wingTip.rotation.x = side * 0.22;
      g.add(wingTip);

      const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.56, 2.1, 14), skyBlue);
      eng.rotation.z = Math.PI / 2;
      eng.position.set(1.4, 1.72, side * 3.85);
      eng.castShadow = true;
      g.add(eng);

      const intake = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.50, 0.14, 12), darkGlass);
      intake.rotation.z = Math.PI / 2;
      intake.position.set(2.42, 1.72, side * 3.85);
      g.add(intake);
    });

    // Illuminated cabin windows along both sides
    const winMat = LS.makeEmissiveMat(0xdcf4ff, 0x93c5fd, 0.38);
    for (let i = 0; i < 9; i++) {
      const wx = -4.8 + i * 1.18;
      [-1.44, 1.44].forEach(wz => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.08), winMat);
        win.position.set(wx, 3.22, wz);
        g.add(win);
      });
    }

    // Landing gear struts & tires
    [[5.5, 0], [-0.4, -1.7], [-0.4, 1.7]].forEach(gp => {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.45, 8), silver);
      strut.position.set(gp[0], 0.95, gp[1]);
      g.add(strut);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.24, 12), tire);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(gp[0], 0.38, gp[1]);
      g.add(wheel);
    });

    // Wingtip navigation beacons
    const redBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), LS.makeEmissiveMat(0xff4d6d, 0xff2a55, 0.95));
    redBeacon.position.set(-0.5, 3.45, -9.45);
    g.add(redBeacon);
    const greenBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), LS.makeEmissiveMat(0x4ade80, 0x22c55e, 0.95));
    greenBeacon.position.set(-0.5, 3.45, 9.45);
    g.add(greenBeacon);

    // Boarding airstairs rolled up to the forward cabin door!
    const stairG = new THREE.Group();
    stairG.position.set(4.1, 0, 2.45);
    for (let s = 0; s < 8; s++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 0.34), silver);
      step.position.set(0, 0.22 + s * 0.28, 1.35 - s * 0.22);
      stairG.add(step);
    }
    const stairRailL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 2.2), skyBlue);
    stairRailL.position.set(-0.52, 1.55, 0.65);
    stairRailL.rotation.x = 0.78;
    stairG.add(stairRailL);
    const stairRailR = stairRailL.clone();
    stairRailR.position.x = 0.52;
    stairG.add(stairRailR);
    g.add(stairG);

    return { root: g, redBeacon: redBeacon, greenBeacon: greenBeacon };
  }

  function buildAirport(worldGroup) {
    const W = {
      id: 'dest_airport',
      isInterior: false,
      skyMesh: null,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      suitcases: [],
      clouds: [],
      radarDish: null,
      windsock: null,
      airliner: null
    };

    function addCol(x, z, hw, hd) {
      W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    }

    // 1. Sunlit Studio Ghibli Sky Dome + Soft Drifting Clouds + Distant Hills
    W.skyMesh = new THREE.Mesh(
      new THREE.SphereGeometry(220, 24, 16),
      new THREE.MeshBasicMaterial({
        map: LS.createSkyTexture(LS.state ? LS.state.timeMode : 0, 'tokyo'),
        side: THREE.BackSide,
        fog: false
      })
    );
    worldGroup.add(W.skyMesh);

    const cloudMat = LS.makeToonMat(0xfffdf8);
    [[-46, 36, -68, 1.5], [32, 42, -82, 1.8], [-12, 46, -98, 1.4], [64, 34, -54, 1.25]].forEach((cp, idx) => {
      const cl = new THREE.Group();
      [[0, 0, 0, 5.2], [4.2, -0.5, 0.6, 4.0], [-4.4, -0.7, -0.4, 3.8], [1.4, 1.6, -0.5, 3.4]].forEach(b => {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(b[3], 10, 8), cloudMat);
        puff.scale.set(1.25, 0.68, 0.9);
        puff.position.set(b[0], b[1], b[2]);
        cl.add(puff);
      });
      cl.position.set(cp[0], cp[1], cp[2]);
      cl.scale.setScalar(cp[3]);
      cl.userData = { baseX: cp[0], y: cp[1], z: cp[2], speed: 0.75 + idx * 0.22 };
      worldGroup.add(cl);
      W.clouds.push(cl);
    });

    // Surrounding verdant green meadow ground
    const grassGround = new THREE.Mesh(
      new THREE.PlaneGeometry(260, 260),
      LS.makeSurfaceMat(LS.createGrassTexture('tokyo'), { roughness: 0.92 })
    );
    grassGround.rotation.x = -Math.PI / 2;
    grassGround.receiveShadow = true;
    worldGroup.add(grassGround);

    // 2. Runway & Tarmac Apron (North, Z = -32..-6)
    const tarmacMat = LS.makeToonMat(0x475569);
    const tarmac = new THREE.Mesh(new THREE.PlaneGeometry(110, 32), tarmacMat);
    tarmac.rotation.x = -Math.PI / 2;
    tarmac.position.set(0, 0.025, -21);
    tarmac.receiveShadow = true;
    worldGroup.add(tarmac);

    const stripeMat = LS.makeToonMat(0xfef08a);
    for (let sx = -44; sx <= 44; sx += 8) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.42), stripeMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(sx, 0.032, -26);
      worldGroup.add(dash);
    }

    // Parked 3D Studio Ghibli Passenger Airliner right outside Gate A1!
    const airliner = buildGhibliAirliner();
    airliner.root.position.set(-1.5, 0.03, -15.2);
    airliner.root.rotation.y = 0.14;
    worldGroup.add(airliner.root);
    W.airliner = airliner;

    // Air Traffic Control Tower on the East Tarmac Edge!
    const towerG = new THREE.Group();
    towerG.position.set(22.5, 0, -18.5);
    const tShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 2.0, 12.5, 10), LS.makeToonMat(0xf5efe6));
    tShaft.position.y = 6.25; tShaft.castShadow = true; towerG.add(tShaft);
    const tCabBase = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 1.9, 1.3, 12), LS.makeToonMat(0x0284c7));
    tCabBase.position.y = 12.6; towerG.add(tCabBase);
    const tCabGlass = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.05, 1.9, 12), LS.makeEmissiveMat(0x7dd3fc, 0x38bdf8, 0.25));
    tCabGlass.position.y = 14.1; towerG.add(tCabGlass);
    const tRoof = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.4, 0.55, 12), LS.makeToonMat(0xf5efe6));
    tRoof.position.y = 15.3; towerG.add(tRoof);
    const radarGroup = new THREE.Group();
    radarGroup.position.set(0, 16.3, 0);
    const rPole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.2, 8), LS.makeToonMat(0x64748b));
    radarGroup.add(rPole);
    const rDish = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.72, 0.22), LS.makeToonMat(0xf8fafc));
    rDish.position.y = 0.65;
    radarGroup.add(rDish);
    towerG.add(radarGroup);
    W.radarDish = radarGroup;
    worldGroup.add(towerG);

    // Windsock pole on the West Tarmac Edge!
    const sockPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 5.2, 8), LS.makeToonMat(0xe2e8f0));
    sockPole.position.set(-20.5, 2.6, -15.0);
    worldGroup.add(sockPole);
    const sockCone = new THREE.Mesh(new THREE.ConeGeometry(0.45, 2.1, 10, 1, true), LS.makeToonMat(0xf97316, { side: THREE.DoubleSide }));
    sockCone.rotation.z = -Math.PI / 2;
    sockCone.position.set(-19.4, 4.95, -15.0);
    worldGroup.add(sockCone);
    W.windsock = sockCone;

    // 3. Sunlit Studio Ghibli Open-Air International Terminal Pavilion (Z = -6.8..7.5)
    const marbleMat = LS.makeSurfaceMat(createMarbleFloorTex(), { roughness: 0.55 });
    const termFloor = new THREE.Mesh(new THREE.BoxGeometry(36, 0.14, 15.0), marbleMat);
    termFloor.position.set(0, 0.05, 0.5);
    termFloor.receiveShadow = true;
    worldGroup.add(termFloor);

    // Departures Curb & Drop-Off Road (South, Z = 7.8..15.5)
    const curbWalk = new THREE.Mesh(new THREE.BoxGeometry(36, 0.12, 4.4), LS.makeToonMat(0xe8dfd0));
    curbWalk.position.set(0, 0.04, 10.0);
    curbWalk.receiveShadow = true;
    worldGroup.add(curbWalk);

    const dropRoad = new THREE.Mesh(new THREE.PlaneGeometry(90, 6.2), LS.makeToonMat(0x525a66));
    dropRoad.rotation.x = -Math.PI / 2;
    dropRoad.position.set(0, 0.025, 14.8);
    worldGroup.add(dropRoad);

    // Fluted Cream Terminal Pillars & Arched Skylight Roof Beams
    const creamMat = LS.makeToonMat(0xf8f2e6);
    const tealMat = LS.makeToonMat(0x0284c7);
    const goldMat = LS.makeToonMat(0xf4be44);
    const glassMat = new THREE.MeshLambertMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.42, side: THREE.DoubleSide });

    [-15.5, -8.5, 8.5, 15.5].forEach(px => {
      [-5.8, 6.8].forEach(pz => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 6.8, 12), creamMat);
        col.position.set(px, 3.45, pz);
        col.castShadow = true;
        worldGroup.add(col);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.38, 0.32, 12), goldMat);
        cap.position.set(px, 6.75, pz);
        worldGroup.add(cap);
        addCol(px, pz, 0.55, 0.55);
      });
    });

    // Elevated Sunlit Studio Ghibli Pitched Terminal Canopy (high overhead at Y=7.0..8.6 — clear panoramic camera view!)
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(36.6, 0.48, 14.2), creamMat);
    fascia.position.set(0, 7.12, 0.5);
    worldGroup.add(fascia);
    [-1, 1].forEach(side => {
      const slope = new THREE.Mesh(new THREE.BoxGeometry(37.2, 0.24, 7.8), tealMat);
      slope.position.set(0, 8.05, 0.5 + side * 3.55);
      slope.rotation.x = side * 0.22;
      worldGroup.add(slope);
    });
    const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(37.4, 0.30, 0.72), goldMat);
    ridgeCap.position.set(0, 8.88, 0.5);
    worldGroup.add(ridgeCap);
    // Warm cream architectural ceiling beams spanning across the terminal
    [-14, -7, 0, 7, 14].forEach(bx => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 13.4), creamMat);
      beam.position.set(bx, 6.82, 0.5);
      worldGroup.add(beam);
    });

    // Panoramic North Observation Glass Fence overlooking the Airliner
    [-11.8, 11.8].forEach(gx => {
      const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(10.8, 1.65, 0.14), glassMat);
      glassPanel.position.set(gx, 0.95, -6.5);
      worldGroup.add(glassPanel);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.12, 0.22), goldMat);
      rail.position.set(gx, 1.80, -6.5);
      worldGroup.add(rail);
    });

    // Grand South Entrance Welcome Arch Sign (mounted cleanly along the upper canopy fascia!)
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(11.6, 1.95, 0.28),
      new THREE.MeshBasicMaterial({ map: createAirportSignTex('✈️ SUNNYSIDE INTL AIRPORT', 'Present-Day Flights Around the World!') })
    );
    signBoard.position.set(0, 7.65, 7.65);
    worldGroup.add(signBoard);

    // 4. GATE A1 — INTERNATIONAL DEPARTURES DESK & GLOWING BOARD (North Center, Z = -5.2)
    const gateDeskG = new THREE.Group();
    gateDeskG.position.set(0, 0, -5.2);
    const deskBase = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.08, 1.35), tealMat);
    deskBase.position.y = 0.54; deskBase.castShadow = true; gateDeskG.add(deskBase);
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.12, 1.48), creamMat);
    deskTop.position.y = 1.12; gateDeskG.add(deskTop);
    const gateSign = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 3.1, 0.22),
      new THREE.MeshBasicMaterial({ map: createDeparturesBoardTex() })
    );
    gateSign.position.set(0, 3.65, -0.55);
    gateDeskG.add(gateSign);
    // Glowing boarding arch pillars flanking Gate A1
    [-3.5, 3.5].forEach(ax => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.2, 10), goldMat);
      post.position.set(ax, 2.6, -0.55);
      gateDeskG.add(post);
    });
    // Blue carpet runner leading up to Gate A1
    const runner = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 7.6), LS.makeToonMat(0x0ea5e9));
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.135, 3.6);
    gateDeskG.add(runner);
    worldGroup.add(gateDeskG);
    addCol(0, -5.2, 3.6, 0.9);

    W.zones.push({
      id: 'airport_departures',
      label: 'Gate A1 — Board Flight to Present-Day Destinations ✈️🌍',
      pos: new THREE.Vector3(0, 0, -3.2),
      radius: 3.4
    });

    // 5. Animated Spinning Baggage Carousel (West Hall, X = -10.5, Z = 1.0)
    const carG = new THREE.Group();
    carG.position.set(-10.5, 0, 1.0);
    const carBase = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.35, 0.52, 20), LS.makeToonMat(0x475569));
    carBase.position.y = 0.26; carBase.castShadow = true; carG.add(carBase);
    const carCenter = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.7, 1.1, 16), tealMat);
    carCenter.position.y = 0.65; carG.add(carCenter);
    const carTop = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 8), LS.makeEmissiveMat(0xfef08a, 0xfacc15, 0.45));
    carTop.position.y = 1.45; carG.add(carTop);
    const bagCols = [0xff6b8b, 0xffd166, 0x38bdf8, 0xa855f7, 0x4ade80, 0xfb923c];
    for (let i = 0; i < 6; i++) {
      const bag = new THREE.Group();
      const bBody = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.52, 0.42), LS.makeToonMat(bagCols[i]));
      bBody.position.y = 0.26; bag.add(bBody);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 6, 10, Math.PI), LS.makeToonMat(0x1e293b));
      handle.position.y = 0.52; bag.add(handle);
      bag.userData = { angle: (i / 6) * Math.PI * 2, radius: 2.35 };
      carG.add(bag);
      W.suitcases.push(bag);
    }
    worldGroup.add(carG);
    addCol(-10.5, 1.0, 3.4, 3.4);

    // 6. Cozy Skyview Airport Lounge & Seating (East Hall, X = 10.5, Z = 1.0)
    const loungeMat = LS.makeToonMat(0xb67d52);
    [[9.5, -0.5], [9.5, 2.5], [13.2, 1.0]].forEach(bp => {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.46, 0.85), loungeMat);
      bench.position.set(bp[0], 0.32, bp[1]); bench.castShadow = true; worldGroup.add(bench);
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.14), tealMat);
      back.position.set(bp[0], 0.78, bp[1] - 0.36); worldGroup.add(back);
      addCol(bp[0], bp[1], 1.15, 0.55);
    });

    // Lush Studio Ghibli Potted Trees flanking the Airport Curb & Lounge!
    const treeSpots = [[-14.5, 9.8, 0.82], [14.5, 9.8, 0.82], [-16.2, -3.5, 0.78], [16.2, -3.5, 0.78]];
    treeSpots.forEach(ts => {
      const tr = (LS.ghibli && LS.ghibli.buildOrangeTree)
        ? LS.ghibli.buildOrangeTree(ts[2], { potHex: 0x0284c7, rimHex: 0xf4be44, bandHex: 0x38bdf8, fruitHex: null, withBlossoms: false })
        : new THREE.Group();
      tr.position.set(ts[0], 0, ts[1]);
      worldGroup.add(tr);
      addCol(ts[0], ts[1], 0.65, 0.65);
    });

    // 7. Parked Gray Nissan Qashqai waiting at Departures Curb to drive Home or anywhere local!
    if (LS.createNissanQashqai) {
      const suv = LS.createNissanQashqai();
      suv.position.set(-5.6, 0.04, 12.2);
      suv.rotation.y = Math.PI * 0.5;
      worldGroup.add(suv);
      addCol(-5.6, 12.2, 2.3, 1.15);
    }
    W.zones.push({
      id: 'home_qashqai',
      label: 'Hop in Gray Nissan Qashqai (Drive Home or Elsewhere) 🚙',
      pos: new THREE.Vector3(-4.2, 0, 10.2),
      radius: 3.1
    });

    // 8. Friendly Airport Crew & Travelers (7 Lively NPCs with Alternating Leader-Aware Phrases!)
    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Captain Omar 👨‍✈️',
        line: 'Welcome aboard, {leader}! Our plane at Gate A1 is fueled and ready for takeoff! ✈️🌍',
        lines: [
          'Welcome aboard, {leader}! Our plane at Gate A1 is fueled and ready for takeoff! ✈️🌍',
          'Clear blue skies on the radar today, {leader} — smooth flying ahead! ☀️✈️',
          'Step right up to Gate A1 whenever you and {companion} want to board, {leader}! 🛫'
        ],
        pos: new THREE.Vector3(-2.6, 0.08, -3.8),
        baseRot: 0.32,
        waveOnNear: true,
        char: { scale: 0.98, skinColor: 0xd69f7e, hairColor: 0x1e1815, topColor: 0x1e3a5f, bottomColor: 0x0f172a, pants: true, hatType: 'cap', hatColor: 0x1e3a5f }
      },
      {
        name: 'Attendant Hana ✈️',
        line: 'Hi {leader}! Check the Departures Board at Gate A1 to fly to present-day countries! ✈️🌍',
        lines: [
          'Hi {leader}! Check the Departures Board at Gate A1 to fly to present-day countries! ✈️🌍',
          'Need a magical trip you can\'t take by plane, {leader}? Try the Bookshelf in your Apartment! 📚✨',
          'Your passport stamps look amazing, {leader} — bon voyage! 🛂💛'
        ],
        pos: new THREE.Vector3(2.8, 0.08, -3.8),
        baseRot: -0.32,
        waveOnNear: true,
        char: { scale: 0.92, skinColor: 0xe4b292, hairColor: 0x261a14, topColor: 0x0284c7, bottomColor: 0x1e3a5f, longHair: true }
      },
      {
        name: 'Ziad (Plane Spotter) 🛩️',
        line: 'Whoa, {leader}! Look through the glass at that huge blue-and-gold airplane! ✈️✨',
        lines: [
          'Whoa, {leader}! Look through the glass at that huge blue-and-gold airplane! ✈️✨',
          'Watch the flashing red and green lights on the wingtips, {leader}! 🌟',
          'I want to fly a jumbo jet just like Captain Omar one day, {leader}! 👨‍✈️'
        ],
        pos: new THREE.Vector3(7.6, 0.08, -5.2),
        baseRot: Math.PI,
        waveOnNear: true,
        char: { scale: 0.74, skinColor: 0xdeb08f, hairColor: 0x241914, topColor: 0xf59e0b, bottomColor: 0x1e3a5f, pants: true }
      },
      {
        name: 'Nadia (Traveler Mom) 🧳',
        line: 'Excited for your next adventure, {leader}? Airports are so much fun! ✈️💛',
        lines: [
          'Excited for your next adventure, {leader}? Airports are so much fun! ✈️💛',
          'Ziad can\'t stop staring at the airliner and the spinning radar tower, {leader}! 📡',
          'Safe travels to you and {companion}, {leader}! 🌍✨'
        ],
        pos: new THREE.Vector3(9.1, 0.08, -4.6),
        baseRot: -Math.PI * 0.7,
        waveOnNear: true,
        char: { scale: 0.92, skinColor: 0xe4b292, hairColor: 0x2b1d17, topColor: 0xec4899, bottomColor: 0x334155, longHair: true }
      },
      {
        name: 'Sami (Baggage Crew) 🧳',
        line: 'Hi {leader}! All the colorful suitcases are gliding smoothly on the carousel! 🧳✨',
        lines: [
          'Hi {leader}! All the colorful suitcases are gliding smoothly on the carousel! 🧳✨',
          'Don\'t worry, {leader} — your outfits and passport stamps always travel safely with you! 🎒',
          'Every suitcase gets a first-class spin before takeoff, {leader}! 😄'
        ],
        pos: new THREE.Vector3(-6.4, 0.08, 1.2),
        baseRot: Math.PI * 0.45,
        waveOnNear: true,
        char: { scale: 0.96, skinColor: 0xcf9b78, hairColor: 0x1f1916, topColor: 0xf97316, bottomColor: 0x1e293b, pants: true, hatType: 'cap', hatColor: 0xf97316 }
      },
      {
        name: 'Rami (Skyview Lounge) ☕',
        line: 'Welcome to the Skyview Travelers Lounge, {leader}! Have a cozy seat before boarding! ☕✨',
        lines: [
          'Welcome to the Skyview Travelers Lounge, {leader}! Have a cozy seat before boarding! ☕✨',
          'Fresh warm croissants and apple juice for every young explorer, {leader}! 🥐🍎',
          'You can see the Air Traffic Control tower spinning right from here, {leader}! 🗼'
        ],
        pos: new THREE.Vector3(11.4, 0.08, 3.6),
        baseRot: -Math.PI * 0.4,
        waveOnNear: true,
        char: { scale: 0.94, skinColor: 0xdca886, hairColor: 0x221915, topColor: 0x0d9488, bottomColor: 0x1e293b, pants: true }
      },
      {
        name: 'Layla (Jet-Setter) 🌍',
        line: 'Hi {leader}! Are you flying to Marrakech or the African Safari today? 🦁🕌',
        lines: [
          'Hi {leader}! Are you flying to Marrakech or the African Safari today? 🦁🕌',
          'I just flew back from Morocco — the mint tea and orange trees were dreamy, {leader}! 🍊🫖',
          'Don\'t forget the gray Qashqai is parked right outside whenever you head home, {leader}! 🚙'
        ],
        pos: new THREE.Vector3(2.5, 0.08, 4.6),
        baseRot: Math.PI * 0.5,
        patrol: { axis: 'x', center: 2.5, range: 5.5, speed: 1.05 },
        char: { scale: 0.91, skinColor: 0xe6b898, hairColor: 0x3b2418, topColor: 0xa855f7, bottomColor: 0x1e293b, longHair: true, hatType: 'sunhat', hatColor: 0xfde68a }
      }
    ]);

    W.getZoneLabel = function (x, z) {
      if (z < -1.5) return 'Gate A1 — International Departures ✈️';
      if (x < -5.5 && z < 6.5) return 'Baggage Claim Carousel 🧳';
      if (x > 5.5 && z < 6.5) return 'Skyview Travelers Lounge ☕';
      if (z >= 7.5) return 'Departures Curb & Gray Qashqai 🚙';
      return 'Sunnyside International Airport ✈️';
    };

    W.update = function (dt, elapsed) {
      // Smoothly revolve suitcases around the baggage carousel!
      W.suitcases.forEach(bag => {
        const u = bag.userData;
        const a = u.angle + elapsed * 0.55;
        bag.position.set(Math.cos(a) * u.radius, 0.52, Math.sin(a) * u.radius);
        bag.rotation.y = -a;
      });
      // Spin Air Traffic Control radar dish & flutter windsock!
      if (W.radarDish) W.radarDish.rotation.y = elapsed * 1.15;
      if (W.windsock) {
        W.windsock.rotation.y = Math.sin(elapsed * 2.2) * 0.25;
        W.windsock.rotation.z = -Math.PI / 2 + Math.sin(elapsed * 3.5) * 0.08;
      }
      // Gently blink airplane wingtip navigation lights
      if (W.airliner) {
        const pulse = Math.sin(elapsed * 5.0) > 0.2 ? 1.15 : 0.3;
        if (W.airliner.redBeacon && W.airliner.redBeacon.material) W.airliner.redBeacon.material.emissiveIntensity = pulse;
        if (W.airliner.greenBeacon && W.airliner.greenBeacon.material) W.airliner.greenBeacon.material.emissiveIntensity = pulse;
      }
      // Drift fluffy Studio Ghibli clouds overhead
      W.clouds.forEach(cl => {
        const u = cl.userData;
        const span = 180;
        const cx = ((u.baseX + elapsed * u.speed + span / 2) % span + span) % span - span / 2;
        cl.position.set(cx, u.y + Math.sin(elapsed * 0.35 + u.baseX) * 0.3, u.z);
      });
    };

    W.drawMiniMap = function (ctx, Wpx, Hpx, toX, toY) {
      ctx.fillStyle = '#90c878'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#475569'; ctx.fillRect(toX(-18), toY(-16.5), toX(18) - toX(-18), toY(-6.5) - toY(-16.5));
      ctx.fillStyle = '#f3ece0'; ctx.fillRect(toX(-17), toY(-6.5), toX(17) - toX(-17), toY(7.8) - toY(-6.5));
      ctx.fillStyle = '#525a66'; ctx.fillRect(toX(-18), toY(11.5), toX(18) - toX(-18), toY(14.5) - toY(11.5));
      ctx.fillStyle = '#0284c7'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('✈️ GATE A1', toX(0), toY(-4.5));
      ctx.fillStyle = '#334155';
      ctx.fillText('BAGGAGE', toX(-10.5), toY(1.2));
      ctx.fillText('LOUNGE', toX(10.5), toY(1.2));
      ctx.fillText('🚙 QASHQAI', toX(-4.5), toY(10.2));
    };

    return W;
  }

  LS.registerWorld('dest_airport', { build: buildAirport });
})(window.LailaSalma);
