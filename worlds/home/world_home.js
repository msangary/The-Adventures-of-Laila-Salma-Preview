window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  function safeRun(name, fn) {
    try { fn(); } catch (e) { console.error('[Home:' + name + ']', e); }
  }

  // Helper: Detailed Ghibli Wooden Park Bench (slatted seat, backrest & cast-iron armrests)
  function createParkBench(woodHex, ironHex) {
    const g = new THREE.Group();
    const wood = LS.makeToonMat(woodHex || 0x9c6644);
    const iron = LS.makeToonMat(ironHex || 0x2d3a45);
    // Seat slats
    [-0.14, 0.04, 0.22].forEach(z => {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.06, 0.14), wood);
      slat.position.set(0, 0.46, z);
      slat.castShadow = true;
      g.add(slat);
    });
    // Backrest slats
    [0.68, 0.86].forEach(y => {
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.13, 0.06), wood);
      back.position.set(0, y, -0.26);
      back.rotation.x = -0.14;
      back.castShadow = true;
      g.add(back);
    });
    // Cast-iron side legs & curved armrests
    [-0.92, 0.92].forEach(x => {
      const legF = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 0.08), iron);
      legF.position.set(x, 0.23, 0.22); g.add(legF);
      const legB = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.92, 0.08), iron);
      legB.position.set(x, 0.46, -0.24); g.add(legB);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.56), iron);
      arm.position.set(x, 0.66, 0.0); g.add(arm);
    });
    return g;
  }

  // Helper: Vintage Ghibli Cast-Iron Street Lamp (0 extra WebGL lights — emissive globe + halo)
  function createStreetLamp() {
    const g = new THREE.Group();
    const iron = LS.makeToonMat(0x28363d);
    const gold = LS.makeToonMat(0xd4a359);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.65, 8), iron);
    base.position.y = 0.32; base.castShadow = true; g.add(base);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.09, 3.2, 8), iron);
    pole.position.y = 2.2; pole.castShadow = true; g.add(pole);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 0.14, 8), gold);
    collar.position.y = 3.72; g.add(collar);
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), LS.makeEmissiveMat(0xfff4cf, 0xffd57a, 0.9));
    globe.position.y = 4.0; g.add(globe);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.22, 8), iron);
    cap.position.y = 4.30; g.add(cap);
    if (LS.createGlowSprite) {
      const halo = LS.createGlowSprite(0xffe094, 1.55);
      halo.position.y = 4.0;
      g.add(halo);
    }
    return g;
  }

  // Helper: Lush Ghibli Flower Planter / Raised Garden Bed
  function createFlowerPlanter(w, d, flowerColors) {
    const g = new THREE.Group();
    const stone = LS.makeToonMat(0xe5dac8);
    const soil = LS.makeToonMat(0x5c4028);
    const bush = LS.makeToonMat(0x4b9349);
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, 0.36, d), stone);
    box.position.y = 0.18; box.castShadow = true; box.receiveShadow = true; g.add(box);
    const dirt = new THREE.Mesh(new THREE.BoxGeometry(w - 0.16, 0.08, d - 0.16), soil);
    dirt.position.y = 0.35; g.add(dirt);
    const cols = flowerColors || [0xff7aa2, 0xffd166, 0xc77dff, 0xff9f68];
    const countX = Math.max(2, Math.floor(w * 1.45));
    const countZ = d > 1.1 ? 2 : 1;
    for (let ix = 0; ix < countX; ix++) {
      for (let iz = 0; iz < countZ; iz++) {
        const fx = -w * 0.36 + (countX > 1 ? (ix / (countX - 1)) * (w * 0.72) : 0);
        const fz = countZ > 1 ? (-d * 0.24 + (iz / (countZ - 1)) * (d * 0.48)) : 0;
        const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), bush);
        leaf.scale.set(1.2, 0.78, 1.2);
        leaf.position.set(fx, 0.48, fz);
        g.add(leaf);
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 7, 6), LS.makeToonMat(cols[(ix + iz) % cols.length]));
        fl.position.set(fx + ((ix % 2) ? 0.06 : -0.06), 0.67, fz);
        g.add(fl);
      }
    }
    return g;
  }

  // Helper: Lush Studio Ghibli Potted Olive / Citrus Tree for Entrances & Patios
  function createPottedTree(potHex, leafHex, fruitHex) {
    if (LS.ghibli && LS.ghibli.buildOrangeTree) {
      return LS.ghibli.buildOrangeTree(0.56, {
        potHex: potHex || 0xc66b47,
        rimHex: potHex || 0xd4966a,
        bandHex: 0xf4e3c1,
        midHex: leafHex || 0x4f9451,
        fruitHex: fruitHex || null,
        withBlossoms: !!fruitHex
      });
    }
    const g = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.22, 0.46, 10), LS.makeToonMat(potHex || 0xc66b47));
    pot.position.y = 0.23; pot.castShadow = true; g.add(pot);
    return g;
  }

  // Helper: Detailed Ghibli Window with Mullions, Sill & Slatted Shutters
  function createDetailedWindow(w, h, winMat, frameMat, shutterHex) {
    const g = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.24, h + 0.24, 0.16), frameMat);
    g.add(frame);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.19), winMat);
    g.add(glass);
    // Cross mullions
    const mV = new THREE.Mesh(new THREE.BoxGeometry(0.07, h + 0.04, 0.22), frameMat);
    g.add(mV);
    const mH = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, 0.07, 0.22), frameMat);
    mH.position.y = 0.08; g.add(mH);
    // Sill ledge
    const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.42, 0.12, 0.34), frameMat);
    sill.position.set(0, -h * 0.5 - 0.12, 0.08); g.add(sill);
    // Wooden shutters on both sides
    if (shutterHex) {
      const shMat = LS.makeToonMat(shutterHex);
      const sw = Math.min(0.55, w * 0.34);
      [-1, 1].forEach(side => {
        const sh = new THREE.Mesh(new THREE.BoxGeometry(sw, h + 0.1, 0.08), shMat);
        sh.position.set(side * (w * 0.5 + sw * 0.5 + 0.14), 0, 0.06);
        g.add(sh);
      });
    }
    return g;
  }

  // Helper: Cute Ghibli Pastel Neighborhood Car (parked cleanly along curbs)
  function createGhibliCar(bodyHex, roofHex) {
    const g = new THREE.Group();
    const bodyMat = LS.makeToonMat(bodyHex || 0x72b6c8);
    const roofMat = LS.makeToonMat(roofHex || 0xfff8eb);
    const glassMat = LS.makeToonMat(0xb8e6ff);
    const tireMat = LS.makeToonMat(0x282c34);
    const chromeMat = LS.makeToonMat(0xe8e4dc);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.62, 3.65), bodyMat);
    chassis.position.y = 0.56; chassis.castShadow = true; g.add(chassis);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.56, 1.95), roofMat);
    cabin.position.set(0, 1.10, -0.15); cabin.castShadow = true; g.add(cabin);
    const winF = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.40, 2.0), glassMat);
    winF.position.set(0, 1.08, -0.15); g.add(winF);
    const winS = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.38, 1.65), glassMat);
    winS.position.set(0, 1.08, -0.15); g.add(winS);
    // Cute round headlights & bumpers
    [-0.58, 0.58].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), LS.makeEmissiveMat(0xfff7cc, 0xffe484, 0.6));
      hl.position.set(hx, 0.62, 1.82); g.add(hl);
      const tl = new THREE.Mesh(new THREE.SphereGeometry(0.09, 7, 6), LS.makeToonMat(0xe63946));
      tl.position.set(hx, 0.62, -1.82); g.add(tl);
    });
    const bumpF = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.14, 0.18), chromeMat);
    bumpF.position.set(0, 0.34, 1.84); g.add(bumpF);
    const bumpB = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.14, 0.18), chromeMat);
    bumpB.position.set(0, 0.34, -1.84); g.add(bumpB);
    // 4 wheels
    [[-0.86, 1.12], [0.86, 1.12], [-0.86, -1.12], [0.86, -1.12]].forEach(wp => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12), tireMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wp[0], 0.32, wp[1]); g.add(wheel);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.24, 8), chromeMat);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(wp[0], 0.32, wp[1]); g.add(hub);
    });
    return g;
  }

  // Hero Family SUV: Metallic Gray Nissan Qashqai Crossover! (used at Home Gate & Destinations)
  LS.createNissanQashqai = function () {
    const g = new THREE.Group();
    const grayBody = LS.makeToonMat(0x747d88);
    const darkTrim = LS.makeToonMat(0x2b3038);
    const silverChrome = LS.makeToonMat(0xdce2ea);
    const glassMat = LS.makeToonMat(0x3a4f66);
    const tireMat = LS.makeToonMat(0x1f2329);
    const ledMat = LS.makeEmissiveMat(0xf5fbff, 0xd8f3ff, 0.85);
    const tailMat = LS.makeEmissiveMat(0xe63946, 0xff4d5a, 0.65);

    // Sculpted SUV lower cladding + sleek metallic gray body + crossover cabin
    const lowerClad = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.28, 4.32), darkTrim);
    lowerClad.position.set(0, 0.38, 0); g.add(lowerClad);
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.66, 4.28), grayBody);
    body.position.set(0, 0.80, 0); body.castShadow = true; g.add(body);
    // Slightly sloped crossover hood & hatchback cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.64, 2.38), grayBody);
    cabin.position.set(0, 1.38, -0.34); cabin.castShadow = true; g.add(cabin);
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.50, 2.42), glassMat);
    windshield.position.set(0, 1.36, -0.34); g.add(windshield);
    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.44, 2.02), glassMat);
    sideGlass.position.set(0, 1.36, -0.34); g.add(sideGlass);

    // Silver roof rails + rear hatchback spoiler!
    [-0.66, 0.66].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.95), silverChrome);
      rail.position.set(rx, 1.74, -0.34); g.add(rail);
    });
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.09, 0.28), grayBody);
    spoiler.position.set(0, 1.66, -1.60); g.add(spoiler);

    // Side mirrors
    [-1.04, 1.04].forEach(mx => {
      const mir = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.18), grayBody);
      mir.position.set(mx, 1.16, 0.62); g.add(mir);
    });

    // Iconic Nissan V-Motion Black & Chrome Front Grille + Swept LED Headlights!
    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.36, 0.10), darkTrim);
    grille.position.set(0, 0.74, 2.14); g.add(grille);
    [-0.38, 0.38].forEach(vx => {
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.36, 0.12), silverChrome);
      vBar.position.set(vx * 0.72, 0.74, 2.16);
      vBar.rotation.z = vx > 0 ? -0.34 : 0.34;
      g.add(vBar);
    });
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.05, 12), silverChrome);
    badge.rotation.x = Math.PI / 2; badge.position.set(0, 0.78, 2.18); g.add(badge);

    [-0.68, 0.68].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.15, 0.10), ledMat);
      hl.position.set(hx, 0.84, 2.13); hl.rotation.y = hx > 0 ? -0.18 : 0.18; g.add(hl);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.16, 0.10), tailMat);
      tl.position.set(hx, 0.88, -2.13); g.add(tl);
    });

    // License plates front & back
    const plateMat = new THREE.MeshBasicMaterial({
      map: LS.createSignTexture('QASHQAI', { bg: '#ffffff', border: '#1d4ed8', color: '#111827', font: 'bold 34px sans-serif', width: 220, height: 70 })
    });
    const fPlate = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.16, 0.05), plateMat);
    fPlate.position.set(0, 0.44, 2.18); g.add(fPlate);
    const bPlate = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.16, 0.05), plateMat);
    bPlate.position.set(0, 0.56, -2.18); g.add(bPlate);

    // 4 SUV Wheels with silver alloy hubs
    [[-0.96, 1.34], [0.96, 1.34], [-0.96, -1.34], [0.96, -1.34]].forEach(wp => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.26, 14), tireMat);
      wheel.rotation.z = Math.PI / 2; wheel.position.set(wp[0], 0.38, wp[1]); wheel.castShadow = true; g.add(wheel);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.28, 10), silverChrome);
      rim.rotation.z = Math.PI / 2; rim.position.set(wp[0], 0.38, wp[1]); g.add(rim);
    });

    return g;
  };

  // Helper: Friendly Yellow Neighborhood School Mini-Bus!
  function createSchoolMiniBus() {
    const g = new THREE.Group();
    const yel = LS.makeToonMat(0xf4b942);
    const stripe = LS.makeToonMat(0x233142);
    const glass = LS.makeToonMat(0xa8e0ff);
    const tire = LS.makeToonMat(0x22262e);
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.25, 1.75, 5.2), yel);
    body.position.set(0, 1.25, 0); body.castShadow = true; g.add(body);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.95, 1.25), yel);
    hood.position.set(0, 0.86, 3.05); hood.castShadow = true; g.add(hood);
    const band = new THREE.Mesh(new THREE.BoxGeometry(2.30, 0.16, 5.24), stripe);
    band.position.set(0, 1.05, 0); g.add(band);
    const winSide = new THREE.Mesh(new THREE.BoxGeometry(2.30, 0.62, 4.4), glass);
    winSide.position.set(0, 1.62, -0.15); g.add(winSide);
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.65, 0.14), glass);
    windshield.position.set(0, 1.62, 2.58); g.add(windshield);
    const stopSign = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 8), LS.makeToonMat(0xd62828));
    stopSign.rotation.x = Math.PI / 2; stopSign.position.set(-1.32, 1.25, 2.15); g.add(stopSign);
    [-0.75, 0.75].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), LS.makeEmissiveMat(0xfff7d6, 0xffe484, 0.7));
      hl.position.set(hx, 0.78, 3.68); g.add(hl);
    });
    [[-1.08, 2.15], [1.08, 2.15], [-1.08, -1.65], [1.08, -1.65]].forEach(wp => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 12), tire);
      w.rotation.z = Math.PI / 2; w.position.set(wp[0], 0.42, wp[1]); g.add(w);
    });
    return g;
  }

  // Helper: Cute Swimming Neighborhood Pond Duck
  function createPondDuck(isDuckling) {
    const g = new THREE.Group();
    const s = isDuckling ? 0.56 : 1.0;
    const bodyMat = LS.makeToonMat(isDuckling ? 0xffe066 : 0xfff8eb);
    const headMat = LS.makeToonMat(isDuckling ? 0xffd43b : 0x2a9d8f);
    const beakMat = LS.makeToonMat(0xf48c06);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24 * s, 10, 8), bodyMat);
    body.scale.set(0.9, 0.75, 1.35); body.position.y = 0.12 * s; g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14 * s, 9, 8), headMat);
    head.position.set(0, 0.30 * s, 0.20 * s); g.add(head);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.055 * s, 0.14 * s, 6), beakMat);
    beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.28 * s, 0.35 * s); g.add(beak);
    return g;
  }

  // Cute Ghibli-style neighborhood puppy builder for Hide-and-Seek
  function createHiddenPuppy(furHex, earHex, collarHex) {
    const g = new THREE.Group();
    const furMat = LS.makeToonMat(furHex || 0xd99b52);
    const earMat = LS.makeToonMat(earHex || 0x8f562b);
    const snoutMat = LS.makeToonMat(0xf7e7ce);
    const noseMat = LS.makeToonMat(0x2b1d17);
    const collarMat = LS.makeToonMat(collarHex || 0xe63946);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), furMat);
    body.scale.set(0.95, 0.85, 1.32);
    body.position.set(0, 0.28, 0);
    body.castShadow = true;
    g.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 10), furMat);
    head.position.set(0, 0.50, 0.24);
    head.castShadow = true;
    g.add(head);

    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 8), snoutMat);
    snout.scale.set(1.0, 0.78, 1.1);
    snout.position.set(0, 0.46, 0.39);
    g.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), noseMat);
    nose.position.set(0, 0.49, 0.47);
    g.add(nose);

    [-1, 1].forEach(side => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), noseMat);
      eye.position.set(side * 0.08, 0.54, 0.39);
      g.add(eye);
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), earMat);
      ear.scale.set(0.55, 1.35, 0.8);
      ear.position.set(side * 0.19, 0.48, 0.20);
      ear.rotation.z = side * 0.28;
      g.add(ear);
    });

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.028, 8, 16), collarMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.39, 0.17);
    g.add(collar);

    [[-0.12, 0.12, 0.16], [0.12, 0.12, 0.16], [-0.12, 0.12, -0.16], [0.12, 0.12, -0.16]].forEach(p => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.24, 8), furMat);
      leg.position.set(p[0], p[1], p[2]);
      leg.castShadow = true;
      g.add(leg);
    });

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.24, 7), earMat);
    tail.position.set(0, 0.38, -0.32);
    tail.rotation.x = -0.65;
    g.add(tail);

    return { root: g, tail: tail };
  }

  // =========================================================================
  // 1. HOME GATED COMMUNITY (home_neighborhood) — HIGH-DETAIL GHIBLI EDITION
  // =========================================================================
  function buildHomeNeighborhood(worldGroup) {
    const W = {
      id: 'home_neighborhood',
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      skyMesh: null,
      mochiBall: null,
      mochiStartPos: new THREE.Vector3(-4.5, 0, 7.5),
      slideStartPos: new THREE.Vector3(24.0, 1.65, 16.4),
      slideEndPos: new THREE.Vector3(24.0, 0.12, 19.3),
      swingSeatPos: new THREE.Vector3(28.2, 0.55, 17.5),
      hopscotchPos: new THREE.Vector3(20.6, 0.065, 19.0),
      swingPivot: null,
      carouselGroup: null,
      gateArmPivot: null,
      schoolFlag: null,
      fountainDrops: [],
      ovenSmokes: [],
      butterflies: [],
      pondDucks: [],
      skyBirds: [],
      diningConfigs: {
        home_restaurant: {
          lailaSeat: new THREE.Vector3(23.5, 0.18, -8.2),
          salmaSeat: new THREE.Vector3(23.5, 0.18, -9.4),
          lailaDishPos: new THREE.Vector3(24.6, 0.78, -8.2),
          salmaDishPos: new THREE.Vector3(24.6, 0.78, -9.4),
          oishiiPos: new THREE.Vector3(24.6, 1.75, -8.8),
          seatYaw: Math.PI / 2,
          camPos: new THREE.Vector3(20.4, 2.35, -8.8),
          camLook: new THREE.Vector3(24.5, 1.05, -8.8),
          caption: 'Family Dinner! 🍽️💛',
          exitPos: new THREE.Vector3(21.5, 0, -8.8)
        }
      }
    };

    function addCollider(x, z, hw, hd) {
      W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    }

    W.getGroundHeight = function () { return 0; };

    // Sky Dome + Horizon Hills
    safeRun('sky', () => {
      const sky = new THREE.Mesh(
        new THREE.SphereGeometry(210, 28, 18),
        new THREE.MeshBasicMaterial({ map: LS.createSkyTexture(LS.state.timeMode, 'tokyo'), side: THREE.BackSide })
      );
      worldGroup.add(sky);
      W.skyMesh = sky;
      if (LS.hdAssets && LS.hdAssets.addMountainRange) {
        LS.hdAssets.addMountainRange(worldGroup, 'tokyo');
      }
    });

    // Sunlit Ghibli Meadow, Stone-Curbed Avenues, Sidewalks & Crosswalks
    safeRun('ground', () => {
      const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(180, 180),
        LS.makeSurfaceMat(LS.createGrassTexture('tokyo'))
      );
      grass.rotation.x = -Math.PI / 2;
      grass.receiveShadow = true;
      worldGroup.add(grass);

      const roadMat = LS.makeSurfaceMat(LS.createGravelPathTexture());
      const sidewalkMat = LS.makeToonMat(0xeae0cc);
      const curbMat = LS.makeToonMat(0xcbbda4);
      const stripeMat = LS.makeToonMat(0xfffaf0);

      // Main North-South Entry Boulevard (Gatehouse Z=36 -> Courtyard Z=3 -> Apartment Z=-12)
      const mainWalk = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 58), sidewalkMat);
      mainWalk.rotation.x = -Math.PI / 2; mainWalk.position.set(0, 0.014, 11); mainWalk.receiveShadow = true; worldGroup.add(mainWalk);
      const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 58), roadMat);
      mainRoad.rotation.x = -Math.PI / 2; mainRoad.position.set(0, 0.022, 11); mainRoad.receiveShadow = true; worldGroup.add(mainRoad);
      // Raised curbs along South Entry Boulevard (Z=14..35)
      [-4.25, 4.25].forEach(cx => {
        const curb = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 22), curbMat);
        curb.position.set(cx, 0.055, 25); curb.receiveShadow = true; worldGroup.add(curb);
      });

      // East-West Community Avenue (School X=-34 <-> Courtyard X=0 <-> Bella Bistro X=+34)
      const crossWalk = new THREE.Mesh(new THREE.PlaneGeometry(78, 10.6), sidewalkMat);
      crossWalk.rotation.x = -Math.PI / 2; crossWalk.position.set(0, 0.015, -4.5); crossWalk.receiveShadow = true; worldGroup.add(crossWalk);
      const crossRoad = new THREE.Mesh(new THREE.PlaneGeometry(78, 7.4), roadMat);
      crossRoad.rotation.x = -Math.PI / 2; crossRoad.position.set(0, 0.024, -4.5); crossRoad.receiveShadow = true; worldGroup.add(crossRoad);
      // Curbs on West & East Avenue segments
      [-23, 23].forEach(rx => {
        [-8.3, -0.7].forEach(rz => {
          const c = new THREE.Mesh(new THREE.BoxGeometry(26, 0.10, 0.22), curbMat);
          c.position.set(rx, 0.05, rz); worldGroup.add(c);
        });
      });

      // South Park Promenade (East to Playground & West to Community Duck Pond Garden!)
      const parkWalk = new THREE.Mesh(new THREE.PlaneGeometry(60, 4.4), sidewalkMat);
      parkWalk.rotation.x = -Math.PI / 2; parkWalk.position.set(0, 0.018, 18.0); parkWalk.receiveShadow = true; worldGroup.add(parkWalk);
      const parkPath = new THREE.Mesh(new THREE.PlaneGeometry(58, 3.2), roadMat);
      parkPath.rotation.x = -Math.PI / 2; parkPath.position.set(0, 0.024, 18.0); parkPath.receiveShadow = true; worldGroup.add(parkPath);

      // Zebra Crosswalks at School, Bistro & Gate Approach
      function addCrosswalk(x, z, rotY, width) {
        const cw = new THREE.Group();
        cw.position.set(x, 0.032, z);
        cw.rotation.y = rotY;
        const n = Math.floor(width / 1.15);
        for (let i = 0; i < n; i++) {
          const sx = -((n - 1) * 0.5) * 1.1 + i * 1.1;
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.02, 2.2), stripeMat);
          bar.position.x = sx;
          cw.add(bar);
        }
        worldGroup.add(cw);
      }
      addCrosswalk(0, 14.8, 0, 7.2);
      addCrosswalk(-15.5, -4.5, Math.PI / 2, 6.6);
      addCrosswalk(15.5, -4.5, Math.PI / 2, 6.6);

      // Central Cobblestone Fountain Courtyard Plaza with Concentric Stone Ring Border
      const plazaBorder = new THREE.Mesh(new THREE.CircleGeometry(11.35, 36), curbMat);
      plazaBorder.rotation.x = -Math.PI / 2; plazaBorder.position.set(0, 0.025, 3.0); plazaBorder.receiveShadow = true; worldGroup.add(plazaBorder);
      const plaza = new THREE.Mesh(
        new THREE.CircleGeometry(10.65, 36),
        LS.makeSurfaceMat(LS.createStonePathTexture())
      );
      plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, 0.030, 3.0); plaza.receiveShadow = true; worldGroup.add(plaza);

      // Stepping-stone garden paths in the courtyard corners
      [[-10.2, 11.2], [10.2, 11.2], [-10.2, -5.8], [10.2, -5.8]].forEach(p => {
        const fb = createFlowerPlanter(3.0, 1.45, [0xff7aa2, 0xffd166, 0x90e0ef, 0xc77dff]);
        fb.position.set(p[0], 0, p[1]);
        fb.rotation.y = Math.atan2(-p[0], 3.0 - p[1]);
        worldGroup.add(fb);
      });

      // Instanced wind-swept Ghibli grass!
      if (LS.hdAssets && LS.hdAssets.addInstancedGrass) {
        LS.hdAssets.addInstancedGrass(worldGroup, { minX: -52, maxX: 52, minZ: -46, maxZ: 42 }, (x, z) => {
          if (Math.abs(x) < 6.4 && z > -24 && z < 42) return false;
          if (Math.abs(z + 4.5) < 5.8 && Math.abs(x) < 42) return false;
          if (Math.abs(z - 18.0) < 3.0 && Math.abs(x) < 32) return false;
          if (Math.hypot(x, z - 3.0) < 12.2) return false;
          if (Math.hypot(x + 21.5, z - 25.5) < 7.8) return false; // Duck Pond Garden
          if (x > 14 && x < 35 && z > 10 && z < 26) return false;
          if (x < -19 && x > -42 && z > -24 && z < 2) return false;
          if (x > 19 && x < 42 && z > -22 && z < 2) return false;
          if (Math.abs(x) < 14 && z < -8 && z > -30) return false;
          return true;
        }, 'home');
      }
    });

    // Ornate Central Community Fountain (Scalloped Stone Rim, Brass Finial, Turquoise Water & Perched Doves!)
    safeRun('fountain', () => {
      const fg = new THREE.Group();
      fg.position.set(0, 0, 3.0);
      const stoneMat = LS.makeToonMat(0xebe3d5);
      const trimStone = LS.makeToonMat(0xd5c8b4);
      const brassMat = LS.makeToonMat(0xd4a359);

      // Stepped circular stone plinth + recessed basin floor so turquoise water gleams clearly!
      const step = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.45, 0.16, 28), trimStone);
      step.position.y = 0.08; step.receiveShadow = true; fg.add(step);

      const basinWall = new THREE.Mesh(new THREE.CylinderGeometry(2.75, 2.90, 0.36, 28), stoneMat);
      basinWall.position.y = 0.26; basinWall.castShadow = true; basinWall.receiveShadow = true; fg.add(basinWall);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.28, 10, 28), stoneMat);
      rim.rotation.x = Math.PI / 2; rim.position.y = 0.56; rim.castShadow = true; fg.add(rim);

      // Decorative stone bollards around rim
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const post = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), trimStone);
        post.position.set(Math.cos(a) * 2.75, 0.78, Math.sin(a) * 2.75);
        fg.add(post);
      }

      const water = new THREE.Mesh(new THREE.CircleGeometry(2.60, 28), LS.makeWaterMat(0.92));
      water.rotation.x = -Math.PI / 2; water.position.y = 0.54; water.renderOrder = -1; fg.add(water);

      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.54, 1.45, 14), stoneMat);
      pillar.position.y = 0.96; pillar.castShadow = true; fg.add(pillar);

      const midBasin = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 0.48, 0.34, 18), stoneMat);
      midBasin.position.y = 1.66; midBasin.castShadow = true; fg.add(midBasin);
      const midRim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.08, 8, 22), trimStone);
      midRim.rotation.x = Math.PI / 2; midRim.position.y = 1.83; fg.add(midRim);
      const midWater = new THREE.Mesh(new THREE.CircleGeometry(1.08, 16), LS.makeWaterMat(0.95));
      midWater.rotation.x = -Math.PI / 2; midWater.position.y = 1.84; midWater.renderOrder = -1; fg.add(midWater);

      const upperStem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.62, 10), stoneMat);
      upperStem.position.y = 2.08; fg.add(upperStem);
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.38, 10), brassMat);
      finial.position.y = 2.54; fg.add(finial);

      // Continuous Luminous Parabolic Water Jets (Upper Finial -> Middle Basin & Middle Basin -> Main Pool!)
      W.fountainRipples = [];
      W.fountainPetals = [];
      if (LS.ghibli && LS.ghibli.createWaterJetArc) {
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const ca = Math.cos(a), sa = Math.sin(a);
          fg.add(LS.ghibli.createWaterJetArc(
            new THREE.Vector3(ca * 0.14, 2.48, sa * 0.14),
            new THREE.Vector3(ca * 0.64, 2.78, sa * 0.64),
            new THREE.Vector3(ca * 0.88, 1.84, sa * 0.88),
            0.024
          ));
          const a2 = a + Math.PI / 8;
          const c2 = Math.cos(a2), s2 = Math.sin(a2);
          fg.add(LS.ghibli.createWaterJetArc(
            new THREE.Vector3(c2 * 1.15, 1.83, s2 * 1.15),
            new THREE.Vector3(c2 * 1.68, 2.04, s2 * 1.68),
            new THREE.Vector3(c2 * 1.98, 0.56, s2 * 1.98),
            0.032
          ));
        }
      }

      // 8 Expanding Concentric White Splash Ripple Rings on the Main Pool!
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const rMat = new THREE.MeshBasicMaterial({ color: 0xf4feff, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false });
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.10, 0.18, 14), rMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(Math.cos(a) * 1.98, 0.58, Math.sin(a) * 1.98);
        ring.renderOrder = 2;
        fg.add(ring);
        W.fountainRipples.push({ mesh: ring, phase: i * 0.27 });
      }

      // 8 Floating Sakura & Courtyard Blossom Petals drifting gently on the turquoise pool!
      const pCols = [0xffb3c6, 0xfffdf6, 0xffd166, 0xff8fab];
      for (let i = 0; i < 8; i++) {
        const pt = new THREE.Mesh(new THREE.CircleGeometry(0.085, 7), LS.makeToonMat(pCols[i % 4]));
        pt.rotation.x = -Math.PI / 2; pt.position.y = 0.57; fg.add(pt);
        W.fountainPetals.push({ mesh: pt, r: 1.35 + (i % 3) * 0.42, spd: 0.14 + (i % 3) * 0.03, phase: i * 0.78 });
      }

      // Two cute white courtyard doves perched on the fountain rim!
      const doveMat = LS.makeToonMat(0xfffdf8);
      [[2.45, 0.96, 1.15, -0.7], [-2.55, 0.96, -0.95, 2.2]].forEach(dp => {
        const d = new THREE.Group();
        const db = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), doveMat);
        db.scale.set(0.85, 0.8, 1.4); d.add(db);
        const dh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 7, 6), doveMat);
        dh.position.set(0, 0.11, 0.12); d.add(dh);
        d.position.set(dp[0], dp[1], dp[2]); d.rotation.y = dp[3];
        fg.add(d);
      });

      const dropMat = LS.makeEmissiveMat(0xe8fbff, 0x90e0ef, 0.6);
      for (let i = 0; i < 16; i++) {
        const high = i < 8;
        const drop = new THREE.Mesh(new THREE.SphereGeometry(high ? 0.06 : 0.08, 8, 6), dropMat);
        drop.userData = { angle: high ? ((i / 8) * Math.PI * 2) : (((i - 8) / 8) * Math.PI * 2 + Math.PI / 8), phase: (i % 8) * 0.29, high: high };
        fg.add(drop);
        W.fountainDrops.push(drop);
      }

      worldGroup.add(fg);
      addCollider(0, 3.0, 3.05, 3.05);
    });

    // -----------------------------------------------------------------------
    // Laila & Salma's Sunlit 3-Story Apartment Building (North Center, Z=-19.5)
    // Rich Ghibli facade: stone wainscot, shutters, wrought-iron balusters,
    // ivy vines, dormer roof windows, chimney, sconces, mailboxes & bike rack!
    // -----------------------------------------------------------------------
    safeRun('apartment_building', () => {
      const g = new THREE.Group();
      g.position.set(0, 0, -19.5);

      const creamMat = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture('#fbf1df') });
      const stoneBaseMat = LS.makeToonMat(0xd9ccb8);
      const peachTrim = LS.makeToonMat(0xe8a87c);
      const terraRoof = LS.makeToonMat(0xffffff, { map: LS.createRoofTileTexture('#c25a3c') });
      const woodMat = LS.makeToonMat(0x6e472b);
      const railMat = LS.makeToonMat(0x32404d);
      const winMat = LS.makeEmissiveMat(0x9bd3f2, 0xffe4a0, 0.34);
      const ivyMat = LS.makeToonMat(0x3f8f47);

      // Main 3-story structure + stone ground-floor base wainscot + corner pilasters
      const mainBody = new THREE.Mesh(new THREE.BoxGeometry(19.6, 11.4, 11.6), creamMat);
      mainBody.position.y = 5.7; mainBody.castShadow = true; mainBody.receiveShadow = true; g.add(mainBody);
      const stoneBase = new THREE.Mesh(new THREE.BoxGeometry(19.9, 1.35, 11.9), stoneBaseMat);
      stoneBase.position.y = 0.68; stoneBase.receiveShadow = true; g.add(stoneBase);

      // Corner decorative pilasters
      [-9.75, 9.75].forEach(px => {
        [-5.75, 5.75].forEach(pz => {
          const pil = new THREE.Mesh(new THREE.BoxGeometry(0.55, 11.5, 0.55), peachTrim);
          pil.position.set(px, 5.75, pz); g.add(pil);
        });
      });

      // Warm terracotta cornice bands between stories
      [3.8, 7.6, 11.4].forEach(y => {
        const band = new THREE.Mesh(new THREE.BoxGeometry(20.3, 0.36, 12.2), peachTrim);
        band.position.y = y; g.add(band);
      });

      // Sloped terracotta roof + Chimney + Two Cute Dormer Windows!
      const roof = new THREE.Mesh(new THREE.ConeGeometry(15.0, 3.4, 4), terraRoof);
      roof.position.y = 13.1; roof.rotation.y = Math.PI / 4; roof.scale.set(1.06, 1.0, 0.72);
      roof.castShadow = true; g.add(roof);

      const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.4, 1.15), LS.makeToonMat(0xb85842));
      chimney.position.set(-5.8, 13.5, -1.6); chimney.castShadow = true; g.add(chimney);
      const chimCap = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.4), stoneBaseMat);
      chimCap.position.set(-5.8, 14.75, -1.6); g.add(chimCap);

      [-4.2, 4.2].forEach(dx => {
        const dorm = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.5, 1.8), creamMat);
        dorm.position.set(dx, 12.45, 3.6); g.add(dorm);
        const dRoof = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.9, 4), terraRoof);
        dRoof.position.set(dx, 13.6, 3.6); dRoof.rotation.y = Math.PI / 4; g.add(dRoof);
        const dWin = createDetailedWindow(1.1, 0.85, winMat, woodMat, null);
        dWin.position.set(dx, 12.45, 4.52); g.add(dWin);
      });

      // Cozy Archway Lobby Entrance, Stone Steps, Striped Teal/Cream Awning & Brass Wall Sconces
      const steps = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.22, 1.6), stoneBaseMat);
      steps.position.set(0, 0.11, 6.4); steps.receiveShadow = true; g.add(steps);
      const lobbyFrame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.6, 0.85), peachTrim);
      lobbyFrame.position.set(0, 1.8, 5.95); g.add(lobbyFrame);

      const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(2.65, 2.85, 0.25), winMat);
      doorGlass.position.set(0, 1.52, 6.26); g.add(doorGlass);
      const doorMull = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.85, 0.30), woodMat);
      doorMull.position.set(0, 1.52, 6.30); g.add(doorMull);
      // Brass door handles
      [-0.22, 0.22].forEach(hx => {
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.08), LS.makeToonMat(0xe9c46a));
        h.position.set(hx, 1.38, 6.45); g.add(h);
      });

      // Striped awning canopy with decorative valence!
      for (let i = -3; i <= 3; i++) {
        const strip = new THREE.Mesh(
          new THREE.BoxGeometry(0.72, 0.16, 2.15),
          LS.makeToonMat(Math.abs(i) % 2 === 0 ? 0x2a9d8f : 0xfff6e5)
        );
        strip.position.set(i * 0.72, 3.62, 6.88);
        strip.rotation.x = 0.22;
        strip.castShadow = true;
        g.add(strip);
      }

      // Warm Entrance Wall Sconces (emissive + halo)
      [-2.55, 2.55].forEach(sx => {
        const sconce = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), LS.makeEmissiveMat(0xfff2c6, 0xffd166, 0.9));
        sconce.position.set(sx, 2.65, 6.32); g.add(sconce);
        if (LS.createGlowSprite) {
          const halo = LS.createGlowSprite(0xffe094, 1.15);
          halo.position.copy(sconce.position); g.add(halo);
        }
      });

      // Potted Citrus Trees flanking the Lobby Door!
      [-3.15, 3.15].forEach(px => {
        const pt = createPottedTree(0xc66b47, 0x4b9450, 0xffc83d);
        pt.position.set(px, 0, 6.75); g.add(pt);
      });

      // Signboard above lobby
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 1.05, 0.20),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture("🏡 SUNNYSIDE APARTMENTS — LAILA & SALMA'S HOME", {
            bg: '#fff8ec', border: '#2a9d8f', color: '#2b3a34', font: 'bold 20px sans-serif', width: 640, height: 110
          })
        })
      );
      sign.position.set(0, 4.62, 6.02); g.add(sign);

      // 2nd & 3rd floor detailed shuttered windows + wrought-iron baluster balconies + ivy & flower boxes!
      [-6.2, 0, 6.2].forEach((bx, bi) => {
        [5.6, 9.4].forEach((by, fi) => {
          const dw = createDetailedWindow(2.5, 1.78, winMat, woodMat, bi === 1 ? 0x2a9d8f : 0x5c8d76);
          dw.position.set(bx, by, 5.84); g.add(dw);

          if (!(bx === 0 && by < 7)) {
            const slab = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 1.45), peachTrim);
            slab.position.set(bx, by - 1.12, 6.42); slab.castShadow = true; g.add(slab);
            // Top & bottom iron rails + vertical balusters
            const topR = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.08, 0.08), railMat);
            topR.position.set(bx, by - 0.26, 7.08); g.add(topR);
            for (let rx = -1.75; rx <= 1.76; rx += 0.35) {
              const bar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.82, 0.05), railMat);
              bar.position.set(bx + rx, by - 0.68, 7.08); g.add(bar);
            }
            // Side iron rails
            [-1.85, 1.85].forEach(sr => {
              const sRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.3), railMat);
              sRail.position.set(bx + sr, by - 0.26, 6.45); g.add(sRail);
            });
            // Terracotta flower box + lush multi-color blooms + trailing ivy!
            const fbox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.32, 0.34), LS.makeToonMat(0xb86643));
            fbox.position.set(bx, by - 0.36, 7.16); g.add(fbox);
            const bColors = [0xff7aa2, 0xffd166, 0xff9f68, 0xf7a8c4];
            for (let k = -2; k <= 2; k++) {
              const bl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), LS.makeToonMat(bColors[(Math.abs(k) + bi + fi) % bColors.length]));
              bl.position.set(bx + k * 0.36, by - 0.14, 7.18); g.add(bl);
            }
            // Trailing Ghibli ivy vines!
            [-0.7, 0.7].forEach(ix => {
              const vine = new THREE.Mesh(new THREE.SphereGeometry(0.20, 7, 6), ivyMat);
              vine.scale.set(0.7, 2.0, 0.6);
              vine.position.set(bx + ix, by - 0.72, 7.18); g.add(vine);
            });
          }
        });
      });

      // Ground-floor shuttered windows + flower planters underneath!
      [-6.2, 6.2].forEach(bx => {
        const dw = createDetailedWindow(2.5, 1.7, winMat, woodMat, 0x5c8d76);
        dw.position.set(bx, 2.2, 5.84); g.add(dw);
        const fp = createFlowerPlanter(3.2, 0.95, [0xff7aa2, 0xffd166, 0x72efdd]);
        fp.position.set(bx, 0, 6.45); g.add(fp);
      });

      // Side-wall windows so the building looks great from every camera angle!
      [-1, 1].forEach(side => {
        [-2.2, 2.2].forEach(sz => {
          [5.6, 9.4].forEach(sy => {
            const sw = createDetailedWindow(2.0, 1.5, winMat, woodMat, 0x5c8d76);
            sw.rotation.y = side * Math.PI / 2;
            sw.position.set(side * 9.85, sy, sz);
            g.add(sw);
          });
        });
      });

      // Community Mailboxes (East Lobby side) & Family Bicycle Rack (West Lobby side)
      const mailG = new THREE.Group();
      mailG.position.set(8.6, 0, 7.2);
      const mPost = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.15, 0.45), LS.makeToonMat(0x2a6f68));
      mPost.position.y = 0.85; mPost.castShadow = true; mailG.add(mPost);
      const mStand = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), railMat);
      mStand.position.y = 0.3; mailG.add(mStand);
      g.add(mailG);

      // Cute parked bikes rack on West Lobby side
      const rackG = new THREE.Group();
      rackG.position.set(-8.6, 0, 7.3);
      for (let i = 0; i < 3; i++) {
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 6, 12, Math.PI), railMat);
        hoop.position.set(-0.65 + i * 0.65, 0.05, 0); rackG.add(hoop);
      }
      // Two parked miniature pastel bicycles!
      [[-0.65, 0xff7aa2], [0.0, 0x4cc9f0]].forEach(bk => {
        const w1 = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 6, 12), railMat);
        w1.rotation.y = Math.PI / 2; w1.position.set(bk[0], 0.28, -0.35); rackG.add(w1);
        const w2 = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 6, 12), railMat);
        w2.rotation.y = Math.PI / 2; w2.position.set(bk[0], 0.28, 0.35); rackG.add(w2);
        const fr = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.72), LS.makeToonMat(bk[1]));
        fr.position.set(bk[0], 0.46, 0); rackG.add(fr);
      });
      g.add(rackG);

      const mat = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 1.5), LS.makeToonMat(0xe07a5f));
      mat.position.set(0, 0.03, 7.45); g.add(mat);

      worldGroup.add(g);
      addCollider(0, -19.5, 10.2, 6.4);

      W.zones.push({
        id: 'enter_home_apartment',
        label: "Step Inside Laila & Salma's Apartment 🏡🎹",
        pos: new THREE.Vector3(0, 0, -11.2),
        radius: 3.4
      });
    });

    // -----------------------------------------------------------------------
    // Nearby Real-Life Neighborhood School — Sunny Oaks Elementary (West)
    // Portico columns, detailed clock/bell tower, flagpole, bunting, school bus!
    // -----------------------------------------------------------------------
    safeRun('home_school', () => {
      const g = new THREE.Group();
      g.position.set(-31.0, 0, -12.0);
      g.rotation.y = Math.PI / 2;

      const wallMat = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture('#f7ead4') });
      const brickMat = LS.makeToonMat(0xb85842);
      const roofMat = LS.makeToonMat(0xffffff, { map: LS.createRoofTileTexture('#3f5c78') });
      const winMat = LS.makeEmissiveMat(0x9bd3f2, 0xffe8b0, 0.34);
      const trimMat = LS.makeToonMat(0xfffaf0);
      const brassMat = LS.makeToonMat(0xe9c46a);

      // Paved School Courtyard Pad
      const yard = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.06, 8.2), LS.makeToonMat(0xe5dbc8));
      yard.position.set(0, 0.03, 7.5); yard.receiveShadow = true; g.add(yard);

      const body = new THREE.Mesh(new THREE.BoxGeometry(15.4, 7.0, 9.4), wallMat);
      body.position.y = 3.5; body.castShadow = true; body.receiveShadow = true; g.add(body);

      const baseBrick = new THREE.Mesh(new THREE.BoxGeometry(15.7, 1.5, 9.7), brickMat);
      baseBrick.position.y = 0.75; g.add(baseBrick);

      const cornice = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.34, 10.0), trimMat);
      cornice.position.y = 7.0; g.add(cornice);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(12.0, 3.0, 4), roofMat);
      roof.position.y = 8.5; roof.rotation.y = Math.PI / 4; roof.scale.set(1.06, 1.0, 0.72);
      roof.castShadow = true; g.add(roof);

      // School Clock & Open Brass Bell Tower!
      const tower = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.2, 2.8), wallMat);
      tower.position.set(0, 9.6, 2.1); tower.castShadow = true; g.add(tower);
      const tRoof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.9, 4), roofMat);
      tRoof.position.set(0, 12.15, 2.1); tRoof.rotation.y = Math.PI / 4; g.add(tRoof);
      const bell = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.56, 10), brassMat);
      bell.position.set(0, 11.0, 2.1); g.add(bell);
      // Detailed Clock Face with Hands & Gold Rim
      const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.07, 8, 20), brassMat);
      clockRim.position.set(0, 9.5, 3.54); g.add(clockRim);
      const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.74, 20), LS.makeToonMat(0xfffdf5));
      clockFace.position.set(0, 9.5, 3.53); g.add(clockFace);
      const handH = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.38, 0.04), LS.makeToonMat(0x264653));
      handH.position.set(0, 9.64, 3.56); g.add(handH);
      const handM = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.04), LS.makeToonMat(0x264653));
      handM.position.set(0.18, 9.5, 3.56); g.add(handM);

      // Classical Entrance Portico (Steps + White Columns + Triangular Pediment!)
      const pSteps = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.32, 2.0), LS.makeToonMat(0xd6cbb8));
      pSteps.position.set(0, 0.16, 5.5); g.add(pSteps);
      [-1.9, 1.9].forEach(cx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 3.3, 10), trimMat);
        col.position.set(cx, 1.9, 6.15); col.castShadow = true; g.add(col);
      });
      const pRoof = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.32, 2.1), trimMat);
      pRoof.position.set(0, 3.65, 5.65); pRoof.castShadow = true; g.add(pRoof);

      const door = new THREE.Mesh(new THREE.BoxGeometry(2.35, 2.75, 0.24), LS.makeToonMat(0x2e6f5e));
      door.position.set(0, 1.55, 4.74); g.add(door);

      [-4.9, 4.9].forEach(wx => {
        [2.45, 5.15].forEach(wy => {
          const dw = createDetailedWindow(2.3, 1.45, winMat, trimMat, 0x3f5c78);
          dw.position.set(wx, wy, 4.74); g.add(dw);
        });
      });

      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 1.0, 0.18),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture('🏫 SUNNY OAKS NEIGHBORHOOD SCHOOL', {
            bg: '#f2f9f5', border: '#2e6f5e', color: '#1b4332', font: 'bold 26px sans-serif', width: 580, height: 110
          })
        })
      );
      sign.position.set(0, 4.42, 4.86); g.add(sign);

      // School Flagpole with waving sunny pennant!
      const fPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 6.4, 8), trimMat);
      fPole.position.set(-6.5, 3.2, 8.2); fPole.castShadow = true; g.add(fPole);
      const fBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.35, 10), brickMat);
      fBase.position.set(-6.5, 0.18, 8.2); g.add(fBase);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.06), LS.makeToonMat(0xf4a261));
      flag.position.set(-5.7, 5.85, 8.2); g.add(flag);
      W.schoolFlag = flag;

      // Colorful Schoolyard Bunting Flags & Wooden Noticeboard
      const buntColors = [0xff595e, 0xffca3a, 0x8ac926, 0x1982c4, 0x6a4c93];
      for (let i = 0; i < 9; i++) {
        const bx = -5.6 + i * 1.4;
        const pen = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.42, 3), LS.makeToonMat(buntColors[i % buntColors.length]));
        pen.rotation.x = Math.PI;
        pen.position.set(bx, 4.15 - Math.sin((i / 8) * Math.PI) * 0.45, 7.6);
        g.add(pen);
      }

      const notice = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.16), LS.makeToonMat(0x7f4f24));
      notice.position.set(5.8, 1.5, 7.6); g.add(notice);
      const cork = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.95, 0.18), LS.makeToonMat(0xd4a373));
      cork.position.set(5.8, 1.5, 7.62); g.add(cork);
      [[-0.35, 0.15, 0xfff8e7], [0.25, -0.1, 0xffd6e0], [-0.05, 0.05, 0xd8f3dc]].forEach(nt => {
        const note = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.2), LS.makeToonMat(nt[2]));
        note.position.set(5.8 + nt[0], 1.5 + nt[1], 7.63); g.add(note);
      });

      // Flower planters flanking the school steps
      [-3.4, 3.4].forEach(fx => {
        const fp = createFlowerPlanter(2.2, 0.9, [0xffca3a, 0xff595e, 0x8ac926]);
        fp.position.set(fx, 0, 5.4); g.add(fp);
      });

      worldGroup.add(g);
      addCollider(-31.0, -12.0, 5.4, 8.2);

      // Parked Friendly Yellow School Mini-Bus along the School Avenue Curb!
      const bus = createSchoolMiniBus();
      bus.position.set(-28.5, 0, 0.8);
      bus.rotation.y = Math.PI / 2;
      worldGroup.add(bus);
      addCollider(-28.5, 0.8, 3.3, 1.4);

      W.zones.push({
        id: 'home_school',
        label: 'Attend Sunny Oaks School Quiz (Ms. Nadia) 🏫',
        pos: new THREE.Vector3(-23.2, 0, -12.0),
        radius: 3.8
      });
    });

    // -----------------------------------------------------------------------
    // -----------------------------------------------------------------------
    // Gedo Mahmoud & Nana Omaima's House (Paternal Grandparents, East X=+31, Z=-10)
    // Sunlit Ghibli family villa with terracotta roof, climbing bougainvillea pergola,
    // glowing porch lanterns, garden seating, citrus pots & welcoming entrance!
    // -----------------------------------------------------------------------
    safeRun('gedo_mahmoud_house', () => {
      const g = new THREE.Group();
      g.position.set(31.0, 0, -10.0);
      g.rotation.y = -Math.PI / 2;

      const wallMat = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture('#fdf1dc') });
      const stoneMat = LS.makeToonMat(0xd6c3aa);
      const roofMat = LS.makeToonMat(0xffffff, { map: LS.createRoofTileTexture('#b85236') });
      const woodMat = LS.makeToonMat(0x5e3a22);
      const winMat = LS.makeEmissiveMat(0xffe7b2, 0xffc663, 0.62);
      const vineMat = LS.makeToonMat(0x3f8f47);
      const bougMat = LS.makeToonMat(0xe65282);

      // Sunlit Garden Stone Terrace & Entry Path!
      const patioPad = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.08, 7.6), LS.makeToonMat(0xdfd0b8));
      patioPad.position.set(0, 0.04, 7.2); patioPad.receiveShadow = true; g.add(patioPad);

      const body = new THREE.Mesh(new THREE.BoxGeometry(12.8, 5.8, 8.8), wallMat);
      body.position.y = 2.9; body.castShadow = true; body.receiveShadow = true; g.add(body);
      const base = new THREE.Mesh(new THREE.BoxGeometry(13.1, 1.15, 9.1), stoneMat);
      base.position.y = 0.58; g.add(base);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(9.9, 2.6, 4), roofMat);
      roof.position.y = 7.05; roof.rotation.y = Math.PI / 4; roof.scale.set(1.06, 1.0, 0.76);
      roof.castShadow = true; g.add(roof);

      // Cozy Home Chimney puffing gentle warm hearth wisps!
      const homeChim = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.5, 1.05), LS.makeToonMat(0xb85c44));
      homeChim.position.set(-4.0, 7.5, -1.6); homeChim.castShadow = true; g.add(homeChim);
      for (let i = 0; i < 4; i++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.24, 7, 6), LS.makeToonMat(0xfffaf0, { transparent: true, opacity: 0.44 }));
        puff.userData = { baseX: 31.0 + 1.6, baseY: 9.0, baseZ: -10.0 - 4.0, phase: i * 0.25 };
        worldGroup.add(puff);
        W.ovenSmokes.push(puff);
      }

      // Wooden Garden Pergola with Lush Climbing Bougainvillea & Warm Fairy Lights!
      [-5.6, 5.6].forEach(px => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 3.3, 8), woodMat);
        post.position.set(px, 1.65, 8.8); post.castShadow = true; g.add(post);
        const v = new THREE.Mesh(new THREE.SphereGeometry(0.30, 7, 6), vineMat);
        v.scale.set(0.9, 3.1, 0.9); v.position.set(px, 2.15, 8.8); g.add(v);
        const fl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), bougMat);
        fl.position.set(px, 3.18, 8.75); g.add(fl);
      });
      const frontBeam = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.18, 0.22), woodMat);
      frontBeam.position.set(0, 3.28, 8.8); g.add(frontBeam);
      [-4.2, -1.4, 1.4, 4.2].forEach(bx => {
        const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 4.4), woodMat);
        rafter.position.set(bx, 3.35, 6.6); g.add(rafter);
        const bClump = new THREE.Mesh(new THREE.SphereGeometry(0.36, 7, 6), bougMat);
        bClump.scale.set(1.5, 0.55, 0.9); bClump.position.set(bx, 3.50, 8.65); g.add(bClump);
      });

      // Warm glowing porch fairy bulbs across the veranda!
      [-4.6, -2.8, -1.0, 1.0, 2.8, 4.6].forEach((lx, li) => {
        const ySag = 3.16 - Math.sin((li / 5) * Math.PI) * 0.22;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe8a8 }));
        bulb.position.set(lx, ySag, 8.65); g.add(bulb);
        if (LS.createGlowSprite) {
          const halo = LS.createGlowSprite(0xffcf70, 1.2);
          halo.position.copy(bulb.position); g.add(halo);
        }
      });

      // Warm glowing shuttered home windows & inviting mahogany front door
      [-3.8, 3.8].forEach(wx => {
        const dw = createDetailedWindow(2.5, 1.85, winMat, woodMat, 0x2a9d8f);
        dw.position.set(wx, 2.15, 4.46); g.add(dw);
      });
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.95, 2.65, 0.24), woodMat);
      door.position.set(0, 1.34, 4.46); g.add(door);
      const doorWin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.28), winMat);
      doorWin.position.set(0, 1.90, 4.48); g.add(doorWin);
      const brassKnob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 7, 6), LS.makeToonMat(0xe9c46a));
      brassKnob.position.set(0.68, 1.25, 4.62); g.add(brassKnob);

      // Potted Olive & Citrus Trees framing the porch!
      [-1.75, 1.75, -5.2, 5.2].forEach(px => {
        const pot = createPottedTree(0xb85838, 0x4b8f47, 0xffc857);
        pot.position.set(px, 0.08, 5.15); g.add(pot);
      });

      // Cozy Wooden Garden Bench on the front veranda
      const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.10, 0.56), woodMat);
      benchSeat.position.set(-3.6, 0.48, 6.8); g.add(benchSeat);
      const benchBack = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.52, 0.09), woodMat);
      benchBack.position.set(-3.6, 0.78, 6.52); g.add(benchBack);

      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(7.8, 1.02, 0.18),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture("🏡 GEDO MAHMOUD & NANA OMAIMA'S HOUSE 💛", {
            bg: '#fff9ef', border: '#c66b47', color: '#4a2b14', font: 'bold 23px sans-serif', width: 640, height: 104
          })
        })
      );
      sign.position.set(0, 4.72, 4.56); g.add(sign);

      worldGroup.add(g);
      addCollider(31.0, -10.0, 5.0, 7.0);

      W.zones.push({
        id: 'enter_gedo_mahmoud',
        label: "Step Inside Gedo Mahmoud & Nana Omaima's House 🏡💛",
        pos: new THREE.Vector3(23.2, 0, -10.0),
        radius: 3.4
      });
    });

    // -----------------------------------------------------------------------
    // Gated Community Security Gatehouse, Lift Barrier Arm & Perimeter Wall!
    // -----------------------------------------------------------------------
    safeRun('gated_wall', () => {
      const wallMat = LS.makeToonMat(0xebe2d3);
      const capMat = LS.makeToonMat(0xc46b4b);
      const ironMat = LS.makeToonMat(0x2d3748);
      const hedgeMat = LS.makeToonMat(0x4b9349);
      const flowerColors = [0xff7aa2, 0xf7a8c4, 0xffd166];

      function addWallSpan(x1, z1, x2, z2) {
        const len = Math.hypot(x2 - x1, z2 - z1);
        const mx = (x1 + x2) * 0.5, mz = (z1 + z2) * 0.5;
        const ang = Math.atan2(x2 - x1, z2 - z1);
        const g = new THREE.Group();
        g.position.set(mx, 0, mz);
        g.rotation.y = ang;
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.38, len), wallMat);
        base.position.y = 0.69; base.castShadow = true; base.receiveShadow = true; g.add(base);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, len), capMat);
        cap.position.y = 1.44; g.add(cap);
        // Stone rhythm pillars along wall
        for (let t = -len * 0.45; t <= len * 0.46; t += 8.0) {
          const p = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.35, 0.85), wallMat);
          p.position.set(0, 1.18, t); g.add(p);
          const pc = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.16, 0.98), capMat);
          pc.position.set(0, 2.42, t); g.add(pc);
        }
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.92, len), ironMat);
        rail.position.y = 1.94; g.add(rail);
        // Lush Bougainvillea hedges
        const hedge = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, len * 0.92), hedgeMat);
        hedge.position.set(0.68, 0.50, 0); g.add(hedge);
        for (let t = -len * 0.42; t <= len * 0.42; t += 3.6) {
          const bl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.36, 0), LS.makeToonMat(flowerColors[Math.abs(Math.round(t)) % flowerColors.length]));
          bl.position.set(0.72, 1.08, t); g.add(bl);
        }
        worldGroup.add(g);
      }

      addWallSpan(-48, 36, -6.5, 36);
      addWallSpan(6.5, 36, 48, 36);
      addWallSpan(-48, -36, -48, 36);
      addWallSpan(48, -36, 48, 36);
      addWallSpan(-48, -36, 48, -36);

      // Ornate Gate Pillars, Lanterns, Archway & Animated Security Lift Arm!
      [-6.5, 6.5].forEach(px => {
        const pil = new THREE.Mesh(new THREE.BoxGeometry(1.45, 4.6, 1.45), wallMat);
        pil.position.set(px, 2.3, 36); pil.castShadow = true; worldGroup.add(pil);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.24, 1.65), capMat);
        cap.position.set(px, 4.65, 36); worldGroup.add(cap);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), LS.makeEmissiveMat(0xfff4cf, 0xffd57a, 0.9));
        lamp.position.set(px, 5.1, 36); worldGroup.add(lamp);
        if (LS.createGlowSprite) {
          const halo = LS.createGlowSprite(0xffe094, 1.7);
          halo.position.copy(lamp.position); worldGroup.add(halo);
        }
        addCollider(px, 36, 0.9, 0.9);
      });

      const gateArch = new THREE.Mesh(
        new THREE.BoxGeometry(14.5, 1.15, 0.5),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture('🌿 SUNNYSIDE GATED COMMUNITY 🏡', {
            bg: '#234e44', border: '#e9c46a', color: '#fff8e7', font: 'bold 34px sans-serif', width: 640, height: 110
          })
        })
      );
      gateArch.position.set(0, 4.65, 36); worldGroup.add(gateArch);

      // Animated Striped Security Gate Lift Arm (opens smoothly when sisters walk near!)
      const armPivot = new THREE.Group();
      armPivot.position.set(5.4, 1.15, 35.0);
      for (let i = 0; i < 6; i++) {
        const seg = new THREE.Mesh(
          new THREE.BoxGeometry(0.82, 0.12, 0.10),
          LS.makeToonMat(i % 2 === 0 ? 0xe63946 : 0xfffdf8)
        );
        seg.position.x = -0.45 - i * 0.82;
        armPivot.add(seg);
      }
      worldGroup.add(armPivot);
      W.gateArmPivot = armPivot;

      // Detailed Guard Booth with Glass Windows & Awning
      const booth = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.1, 3.2), wallMat);
      booth.position.set(9.4, 1.55, 34.2); booth.castShadow = true; worldGroup.add(booth);
      const boothWin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 3.32), LS.makeEmissiveMat(0xa8e0ff, 0xffe4a0, 0.42));
      boothWin.position.set(9.4, 1.95, 34.2); worldGroup.add(boothWin);
      const boothWinS = new THREE.Mesh(new THREE.BoxGeometry(3.52, 1.2, 2.2), LS.makeEmissiveMat(0xa8e0ff, 0xffe4a0, 0.42));
      boothWinS.position.set(9.4, 1.95, 34.2); worldGroup.add(boothWinS);
      const boothRoof = new THREE.Mesh(new THREE.ConeGeometry(2.9, 1.25, 4), capMat);
      boothRoof.position.set(9.4, 3.72, 34.2); boothRoof.rotation.y = Math.PI / 4; worldGroup.add(boothRoof);
      addCollider(9.4, 34.2, 1.9, 1.8);

      // ---------------------------------------------------------------------
      // Family Gray Nissan Qashqai Crossover SUV parked right next to the Gate!
      // ---------------------------------------------------------------------
      const qashqai = LS.createNissanQashqai();
      qashqai.position.set(-5.8, 0, 30.8);
      qashqai.rotation.y = 0.22;
      worldGroup.add(qashqai);
      addCollider(-5.8, 30.8, 1.4, 2.4);

      // Crisp signpost beside the Qashqai so kids spot it instantly!
      const qSign = new THREE.Mesh(
        new THREE.BoxGeometry(2.35, 0.72, 0.14),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture('🚙 FAMILY QASHQAI', {
            bg: '#eef2f6', border: '#4b5563', color: '#1f2937', font: 'bold 26px sans-serif', width: 320, height: 100
          })
        })
      );
      qSign.position.set(-8.1, 1.55, 31.8);
      qSign.rotation.y = 0.35;
      worldGroup.add(qSign);
      const qPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.45, 7), LS.makeToonMat(0x4b5563));
      qPost.position.set(-8.1, 0.72, 31.8);
      worldGroup.add(qPost);

      W.zones.push({
        id: 'home_qashqai',
        label: 'Drive the Gray Nissan Qashqai 🚙✨',
        pos: new THREE.Vector3(-2.8, 0, 30.8),
        radius: 3.6
      });
    });

    // -----------------------------------------------------------------------
    // Southwest Community Duck Pond Garden & Cozy Gazebo! (X=-21.5, Z=25.5)
    // -----------------------------------------------------------------------
    safeRun('garden_pond', () => {
      const pg = new THREE.Group();
      pg.position.set(-21.5, 0, 25.5);

      const stoneMat = LS.makeToonMat(0xcbc0ae);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.45, 8, 28), stoneMat);
      rim.rotation.x = Math.PI / 2; rim.position.y = 0.16; pg.add(rim);

      const pondWater = new THREE.Mesh(new THREE.CircleGeometry(5.1, 28), LS.makeWaterMat(0.92));
      pondWater.rotation.x = -Math.PI / 2; pondWater.position.y = 0.08; pg.add(pondWater);

      // Lily pads & pink lotus blossoms floating on the pond!
      const padMat = LS.makeToonMat(0x3f8f47);
      const lotusMat = LS.makeToonMat(0xff8fab);
      [[-2.2, 1.6], [2.4, -1.8], [-1.5, -2.5], [1.8, 2.2], [3.2, 0.4]].forEach((lp, idx) => {
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 10), padMat);
        pad.position.set(lp[0], 0.11, lp[1]); pg.add(pad);
        if (idx % 2 === 0) {
          const lot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 7, 6), lotusMat);
          lot.scale.set(1.2, 0.7, 1.2); lot.position.set(lp[0], 0.2, lp[1]); pg.add(lot);
        }
      });

      // Cute Garden Gazebo beside the pond
      const gazG = new THREE.Group();
      gazG.position.set(-6.8, 0, -2.2);
      const wood = LS.makeToonMat(0x7a4e2d);
      const gFloor = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.6, 0.22, 8), LS.makeToonMat(0xd9c5a7));
      gFloor.position.y = 0.11; gazG.add(gFloor);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 2.7, 7), wood);
        post.position.set(Math.cos(a) * 2.15, 1.45, Math.sin(a) * 2.15); gazG.add(post);
      }
      const gRoof = new THREE.Mesh(new THREE.ConeGeometry(2.95, 1.35, 6), LS.makeToonMat(0x3f6e5c));
      gRoof.position.y = 3.45; gRoof.castShadow = true; gazG.add(gRoof);
      pg.add(gazG);
      addCollider(-28.3, 23.3, 2.4, 2.4);

      // Animated Mother Duck & 2 Ducklings swimming in a circle!
      [false, true, true].forEach((isBaby, di) => {
        const d = createPondDuck(isBaby);
        d.userData = { baseAngle: di * 0.36, radius: 2.65 };
        pg.add(d);
        W.pondDucks.push(d);
      });

      worldGroup.add(pg);
      addCollider(-21.5, 25.5, 4.7, 4.7);
    });

    // -----------------------------------------------------------------------
    // Detailed Neighboring Villas, Upgraded Playground, Cars, Lamps & Cart!
    // -----------------------------------------------------------------------
    safeRun('neighbors_and_park', () => {
      function addNeighborVilla(x, z, rotY, wallHex, roofHex, shutterHex) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        g.rotation.y = rotY;
        const body = new THREE.Mesh(new THREE.BoxGeometry(10.8, 7.4, 7.8), LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture(wallHex) }));
        body.position.y = 3.7; body.castShadow = true; body.receiveShadow = true; g.add(body);
        const trim = LS.makeToonMat(0xfffaf0);
        const band = new THREE.Mesh(new THREE.BoxGeometry(11.1, 0.28, 8.1), trim);
        band.position.y = 3.8; g.add(band);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(8.5, 2.4, 4), LS.makeToonMat(0xffffff, { map: LS.createRoofTileTexture(roofHex) }));
        roof.position.y = 8.6; roof.rotation.y = Math.PI / 4; roof.scale.set(1.06, 1, 0.78); roof.castShadow = true; g.add(roof);
        const chim = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.8), LS.makeToonMat(0xb85842));
        chim.position.set(2.6, 8.9, -1.0); g.add(chim);

        const winMat = LS.makeEmissiveMat(0x9bd3f2, 0xffe4a0, 0.30);
        [-2.9, 2.9].forEach(wx => {
          [2.15, 5.4].forEach(wy => {
            const dw = createDetailedWindow(1.85, 1.35, winMat, trim, shutterHex || 0x4a6b5d);
            dw.position.set(wx, wy, 3.92); g.add(dw);
          });
        });
        // Cozy front porch doorway + awning + potted tree
        const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.35, 0.2), LS.makeToonMat(0x7a4e2d));
        door.position.set(0, 1.18, 3.92); g.add(door);
        const porch = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 1.25), LS.makeToonMat(roofHex));
        porch.position.set(0, 2.65, 4.45); porch.rotation.x = 0.2; g.add(porch);
        const fp = createFlowerPlanter(2.4, 0.75, [0xff7aa2, 0xffd166]);
        fp.position.set(-2.9, 0, 4.35); g.add(fp);

        worldGroup.add(g);
        addCollider(x, z, 5.6, 4.5);
      }

      addNeighborVilla(-34, 14, Math.PI / 2, '#f9efe0', '#c46b4b', 0x2a9d8f);
      addNeighborVilla(-24, -29, 0, '#eef5ec', '#4a6b5d', 0xc46b4b);
      addNeighborVilla(24, -29, 0, '#faf0eb', '#b85c48', 0x3f5c78);

      // Cute Parked Ghibli Pastel Neighborhood Cars along the avenues!
      const car1 = createGhibliCar(0x6ec4db, 0xfff8eb);
      car1.position.set(-14.5, 0, 25.0); car1.rotation.y = 0.12; worldGroup.add(car1);
      addCollider(-14.5, 25.0, 1.15, 2.1);

      const car2 = createGhibliCar(0xf29e8e, 0xfff8eb);
      car2.position.set(14.5, 0, 26.5); car2.rotation.y = Math.PI - 0.08; worldGroup.add(car2);
      addCollider(14.5, 26.5, 1.15, 2.1);

      // Charming Neighborhood Little Free Library & Ice-Cream/Lemonade Cart!
      const libG = new THREE.Group();
      libG.position.set(-10.5, 0, 14.5);
      const lPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 1.25, 7), LS.makeToonMat(0x6e472b));
      lPost.position.y = 0.62; libG.add(lPost);
      const lBox = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.72, 0.56), LS.makeToonMat(0x2a9d8f));
      lBox.position.y = 1.48; lBox.castShadow = true; libG.add(lBox);
      const lRoof = new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.36, 4), LS.makeToonMat(0xe76f51));
      lRoof.position.y = 2.0; lRoof.rotation.y = Math.PI / 4; libG.add(lRoof);
      worldGroup.add(libG);

      const cartG = new THREE.Group();
      cartG.position.set(11.5, 0, 14.5);
      cartG.rotation.y = -0.5;
      const cBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.95), LS.makeToonMat(0xfff5d6));
      cBody.position.y = 0.68; cBody.castShadow = true; cartG.add(cBody);
      [-0.68, 0.68].forEach(wx => {
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.1, 10), LS.makeToonMat(0x7a4e2d));
        wh.rotation.x = Math.PI / 2; wh.position.set(wx, 0.32, 0.52); cartG.add(wh);
      });
      const cPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.7, 6), LS.makeToonMat(0x7a4e2d));
      cPole.position.y = 1.75; cartG.add(cPole);
      const cUmb = new THREE.Mesh(new THREE.ConeGeometry(1.25, 0.48, 8), LS.makeToonMat(0xffb703));
      cUmb.position.y = 2.65; cUmb.castShadow = true; cartG.add(cUmb);
      worldGroup.add(cartG);

      // ---------------------------------------------------------------------
      // Upgraded Community Pocket Playground (East South: X=24.5, Z=18.0)
      // Picket fence border, playhouse slide tower, twin swings, spinning
      // merry-go-round carousel, sandbox with bucket & hopscotch!
      // ---------------------------------------------------------------------
      const pgPad = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.09, 11.4), LS.makeToonMat(0xedd9b4));
      pgPad.position.set(24.5, 0.045, 18.0); pgPad.receiveShadow = true; worldGroup.add(pgPad);

      // Cute low wooden picket fence framing North, East & South sides of playground!
      const fenceMat = LS.makeToonMat(0xfff7e8);
      for (let fx = 17.2; fx <= 31.8; fx += 1.2) {
        const pN = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.08), fenceMat);
        pN.position.set(fx, 0.38, 12.4); worldGroup.add(pN);
        const pS = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.08), fenceMat);
        pS.position.set(fx, 0.38, 23.6); worldGroup.add(pS);
      }
      const railN = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.08, 0.08), fenceMat);
      railN.position.set(24.5, 0.52, 12.4); worldGroup.add(railN);
      const railS = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.08, 0.08), fenceMat);
      railS.position.set(24.5, 0.52, 23.6); worldGroup.add(railS);

      // Playhouse Slide Tower!
      const slideMat = LS.makeToonMat(0xf4a261);
      const towerWood = LS.makeToonMat(0x8c5a3c);
      const slidePost = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.75, 1.5), LS.makeToonMat(0x2a9d8f));
      slidePost.position.set(24.0, 0.88, 16.0); slidePost.castShadow = true; worldGroup.add(slidePost);
      const slideRoof = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.95, 4), LS.makeToonMat(0xe76f51));
      slideRoof.position.set(24.0, 2.9, 16.0); slideRoof.rotation.y = Math.PI / 4; slideRoof.castShadow = true; worldGroup.add(slideRoof);
      [[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]].forEach(cp => {
        const st = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 6), towerWood);
        st.position.set(24.0 + cp[0], 2.15, 16.0 + cp[1]); worldGroup.add(st);
      });
      const chute = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 3.25), slideMat);
      chute.position.set(24.0, 0.92, 17.75); chute.rotation.x = 0.52; chute.castShadow = true; worldGroup.add(chute);
      W.zones.push({ id: 'park_slide', label: 'Slide Together at Community Park 🛝', pos: new THREE.Vector3(24.0, 0, 19.3), radius: 2.6 });

      // Detailed A-Frame Swing Set with Chains!
      const swBlue = LS.makeToonMat(0x457b9d);
      const swFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8), swBlue);
      swFrame.rotation.z = Math.PI / 2; swFrame.position.set(28.2, 2.52, 17.5); worldGroup.add(swFrame);
      [-1.25, 1.25].forEach(sx => {
        [-0.35, 0.35].forEach(sz => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 2.7, 7), swBlue);
          leg.position.set(28.2 + sx, 1.28, 17.5 + sz);
          leg.rotation.x = sz > 0 ? -0.25 : 0.25;
          leg.castShadow = true; worldGroup.add(leg);
        });
      });
      const pivot = new THREE.Group();
      pivot.position.set(28.2, 2.48, 17.5);
      const chainMat = LS.makeToonMat(0xb0b8c1);
      [-0.32, 0.32].forEach(cx => {
        const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.85, 5), chainMat);
        ch.position.set(cx, -0.94, 0); pivot.add(ch);
      });
      const swSeat = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.09, 0.38), LS.makeToonMat(0xe76f51));
      swSeat.position.y = -1.88; pivot.add(swSeat);
      worldGroup.add(pivot);
      W.swingPivot = pivot;
      W.zones.push({ id: 'park_swing', label: 'Swing High Together 🎠', pos: new THREE.Vector3(28.2, 0, 19.0), radius: 2.5 });

      // Spinning Colorful Merry-Go-Round Carousel! (X=29.2, Z=21.6)
      const carG = new THREE.Group();
      carG.position.set(29.2, 0.14, 21.6);
      const carDisk = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.12, 16), LS.makeToonMat(0xffd166));
      carDisk.castShadow = true; carG.add(carDisk);
      const carHub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.72, 10), LS.makeToonMat(0xe63946));
      carHub.position.y = 0.38; carG.add(carHub);
      const carWheel = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 7, 14), LS.makeToonMat(0x2a9d8f));
      carWheel.rotation.x = Math.PI / 2; carWheel.position.y = 0.74; carG.add(carWheel);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const bar = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.035, 6, 10, Math.PI), LS.makeToonMat(0x457b9d));
        bar.position.set(Math.cos(a) * 0.75, 0.14, Math.sin(a) * 0.75);
        bar.rotation.y = a; carG.add(bar);
      }
      worldGroup.add(carG);
      W.carouselGroup = carG;

      // Wooden Sandbox with Sand Castle & Bucket! (X=19.2, Z=14.6)
      const sbFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.28, 2.2), towerWood);
      sbFrame.position.set(19.2, 0.16, 14.6); worldGroup.add(sbFrame);
      const sand = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.24, 1.9), LS.makeToonMat(0xf4d58d));
      sand.position.set(19.2, 0.20, 14.6); worldGroup.add(sand);
      const castle = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.45, 6), LS.makeToonMat(0xe6c174));
      castle.position.set(18.8, 0.48, 14.5); worldGroup.add(castle);
      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.26, 8), LS.makeToonMat(0xff595e));
      bucket.position.set(19.7, 0.42, 14.8); worldGroup.add(bucket);

      // Hopscotch
      for (let i = 0; i < 6; i++) {
        const sq = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.62), LS.makeToonMat(i % 2 === 0 ? 0xffb3c6 : 0x90e0ef));
        sq.position.set(20.6, 0.09, 17.5 + i * 0.66); worldGroup.add(sq);
      }
      W.zones.push({ id: 'park_hopscotch', label: 'Play Community Hopscotch 🎯', pos: new THREE.Vector3(20.6, 0, 19.2), radius: 2.4 });

      // Detailed Slatted Community Benches around Courtyard & Avenues!
      [
        [-8.6, 3.0, Math.PI / 2], [8.6, 3.0, -Math.PI / 2],
        [0, 14.2, Math.PI], [16.5, 20.5, Math.PI / 2],
        [-14.5, 22.0, -Math.PI / 4]
      ].forEach(b => {
        const bench = createParkBench();
        bench.position.set(b[0], 0, b[1]);
        bench.rotation.y = b[2];
        worldGroup.add(bench);
      });

      // Vintage Cast-Iron Ghibli Street Lamps lining the Avenues & Courtyard!
      [
        [-5.2, 16.0], [5.2, 16.0],
        [-5.2, 25.2], [5.2, 29.0],
        [-17.0, -9.2], [17.0, -9.2],
        [-11.2, 3.0], [11.2, 3.0]
      ].forEach(lp => {
        const lamp = createStreetLamp();
        lamp.position.set(lp[0], 0, lp[1]);
        worldGroup.add(lamp);
        addCollider(lp[0], lp[1], 0.35, 0.35);
      });
    });

    // Organic Studio Ghibli Leaf-Cluster Trees + Golden Butterflies & Songbirds!
    safeRun('trees_and_wildlife', () => {
      const treeCoords = [
        [-11.5, -10.5, 'sakura', 1.18], [11.5, -10.5, 'sakura', 1.18],
        [-13.5, 9.5, 'green', 1.24], [13.5, 9.5, 'olive', 1.20],
        [-12.5, 29.5, 'gold', 1.14], [12.5, 30.0, 'green', 1.18],
        [-20.5, -0.5, 'green', 1.08], [20.5, -0.5, 'olive', 1.10],
        [-38, 4, 'sakura', 1.28], [38, 6, 'gold', 1.25],
        [-36, -26, 'green', 1.32], [36, -24, 'green', 1.30],
        [-15, -30, 'olive', 1.18], [15, -30, 'sakura', 1.22],
        [-39, 28, 'green', 1.25], [39, 28, 'sakura', 1.24],
        [-29, 31, 'sakura', 1.15], [34, 14, 'olive', 1.12]
      ];
      treeCoords.forEach(tc => {
        const tree = (LS.ghibli && LS.ghibli.buildGhibliTree)
          ? LS.ghibli.buildGhibliTree(tc[2], tc[3])
          : new THREE.Group();
        tree.position.set(tc[0], 0, tc[1]);
        worldGroup.add(tree);
        addCollider(tc[0], tc[1], 0.55, 0.55);
      });

      // Fluttering Ghibli Butterflies over the Courtyard & Pond Flowers!
      const bfColors = [0xffd166, 0xff8fab, 0x90e0ef, 0xfff3b0];
      [[-10, 11], [10, 11], [-21, 22], [19, 17], [-10, -5], [10, -5]].forEach((bp, i) => {
        const bG = new THREE.Group();
        const wMat = LS.makeToonMat(bfColors[i % bfColors.length]);
        const wL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.11), wMat);
        wL.position.x = -0.07; bG.add(wL);
        const wR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.11), wMat);
        wR.position.x = 0.07; bG.add(wR);
        bG.userData = { cx: bp[0], cz: bp[1], phase: i * 1.3, wL: wL, wR: wR };
        worldGroup.add(bG);
        W.butterflies.push(bG);
      });

      // Gentle White Songbirds Gliding High Over Sunnyside Community!
      const birdMat = LS.makeToonMat(0xfffdf8);
      for (let i = 0; i < 4; i++) {
        const bg = new THREE.Group();
        const bW1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.16), birdMat);
        bW1.position.x = -0.2; bg.add(bW1);
        const bW2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.16), birdMat);
        bW2.position.x = 0.2; bg.add(bW2);
        bg.userData = { radius: 18 + i * 5, height: 15 + i * 2.2, speed: 0.26 + i * 0.04, phase: i * 1.6, w1: bW1, w2: bW2 };
        worldGroup.add(bg);
        W.skyBirds.push(bg);
      }
    });

    // Friendly Community NPCs (Ms. Nadia, Chef Mario, Uncle Tariq, Auntie Farah, Grandpa Sami, Little Maya!)
    safeRun('npcs', () => {
      LS.spawnWorldNPCs(worldGroup, [
        {
          name: 'Ms. Nadia (Teacher)',
          line: 'Good morning Laila & Salma! Ready for a fun quiz at Sunny Oaks School? 🏫✨',
          pos: new THREE.Vector3(-23.2, 0, -10.0),
          baseRot: Math.PI / 2,
          waveOnNear: true,
          char: { scale: 0.94, skinColor: 0xe6b595, hairColor: 0x2c1d16, topColor: 0x2a9d8f, bottomColor: 0x264653, longHair: true }
        },
        {
          name: 'Nana Omaima (Garden)',
          line: "Ahlan ya Laila & Salma! Step right inside — Gedo Mahmoud and I made your favorite treats! 🏡💛",
          pos: new THREE.Vector3(24.2, 0, -5.8),
          baseRot: -Math.PI / 2,
          waveOnNear: true,
          char: { scale: 0.90, skinColor: 0xe6b898, hairColor: 0xcfd4da, topColor: 0x2a9d8f, bottomColor: 0x4a5568, hairBun: true, faceOpts: { elder: true } }
        },
        {
          name: 'Uncle Tariq (Gate)',
          line: 'Welcome home to Sunnyside Gated Community, Laila & Salma! Gate is open for you! 🛡️☀️',
          pos: new THREE.Vector3(6.2, 0, 32.5),
          baseRot: -Math.PI * 0.75,
          waveOnNear: true,
          char: { scale: 0.98, skinColor: 0xcf9b78, hairColor: 0x1f1b1a, topColor: 0x3b5998, bottomColor: 0x1e293b, pants: true, hatType: 'cap', hatColor: 0x1e3a8a }
        },
        {
          name: 'Auntie Farah',
          line: 'I heard Laila playing the piano from the courtyard — it sounded magical! 🎹🌸',
          pos: new THREE.Vector3(-8.2, 0, 12.0),
          baseRot: Math.PI * 0.35,
          patrol: { axis: 'z', center: 12.0, range: 5.5, speed: 1.1 },
          char: { scale: 0.92, skinColor: 0xe2b090, hairColor: 0x2c1e1a, topColor: 0xe07a5f, bottomColor: 0x4a5568, hairBun: true }
        },
        {
          name: 'Grandpa Sami',
          line: 'Look at the little ducklings swimming in our garden pond, girls! 🦆🌿',
          pos: new THREE.Vector3(-15.8, 0, 23.2),
          baseRot: -Math.PI * 0.65,
          waveOnNear: true,
          char: { scale: 0.95, skinColor: 0xdca783, hairColor: 0xd9d9d9, topColor: 0x6b8f71, bottomColor: 0x4a3f35, pants: true, faceOpts: { glasses: true, mustache: true } }
        },
        {
          name: 'Maya (Neighbor)',
          line: 'Yay! Laila & Salma! Come try the new spinning carousel and slide with me! 🎠🛝',
          pos: new THREE.Vector3(17.8, 0, 20.8),
          baseRot: Math.PI * 0.4,
          waveOnNear: true,
          char: { scale: 0.74, skinColor: 0xeab99a, hairColor: 0x3a2418, topColor: 0xff8fab, bottomColor: 0x457b9d, twinTails: true }
        }
      ]);
    });

    // 5 Playful Hiding Neighborhood Puppies!
    safeRun('puppies', () => {
      const spotPool = [
        { pos: [-11.5, 0, -14.5], hint: 'sniffing flowers by our Apartment corner' },
        { pos: [11.8, 0, -14.0], hint: 'wagging its tail near the East Apartment balcony' },
        { pos: [-26.0, 0, -2.5], hint: 'waiting by Sunny Oaks School bus stop' },
        { pos: [26.5, 0, -15.5], hint: "sniffing bougainvillea behind Gedo Mahmoud & Nana Omaima's house" },
        { pos: [27.0, 0, 22.4], hint: 'playing near the Community Playground carousel' },
        { pos: [-16.0, 0, 28.5], hint: 'watching the ducks at the Southwest Garden Pond' },
        { pos: [16.5, 0, 29.5], hint: 'greeting Uncle Tariq by the Gatehouse garden' }
      ];
      const names = ['Biscuit', 'Coco', 'Sunny', 'Waffles', 'Peanut'];
      const furs = [0xd99b52, 0x8c5630, 0xf2d08a, 0xc97b42, 0xbfa58a];
      const ears = [0x8f562b, 0x4f2e18, 0xc79948, 0x7d4520, 0x6b5642];
      const collars = [0xe63946, 0x2a9d8f, 0x3a86ff, 0xff006e, 0xf59e0b];
      const chosen = LS.pickRoundSpots(spotPool, LS.state.homePetsRound || 0, 5);
      const foundList = LS.state.foundHomePets || [];

      chosen.forEach((spot, idx) => {
        const id = 'home_pup_' + idx;
        const pup = createHiddenPuppy(furs[idx], ears[idx], collars[idx]);
        pup.root.position.set(spot.pos[0], 0, spot.pos[2]);
        pup.root.rotation.y = idx * 1.1;
        const already = foundList.includes(id);
        pup.root.visible = !already;
        worldGroup.add(pup.root);

        W.hiddenAnimals.push({
          id: id,
          name: names[idx] + ' the Puppy',
          hint: spot.hint,
          mesh: pup.root,
          tail: pup.tail,
          found: already
        });
        if (!already) {
          W.zones.push({
            id: 'animal:' + id,
            label: 'Pet ' + names[idx] + ' the Puppy 🐶',
            pos: new THREE.Vector3(spot.pos[0], 0, spot.pos[2]),
            radius: 2.6
          });
        }
      });
    });

    // Mochi Fetch Ball
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), LS.makeToonMat(0xfacc15));
    ball.position.set(-4.5, 0.16, 8.8);
    ball.visible = false;
    worldGroup.add(ball);
    W.mochiBall = ball;

    W.getMochiIdleAnchor = function () {
      return { pos: new THREE.Vector3(-4.5, 0, 7.5), rotY: 0.4 };
    };

    W.getZoneLabel = function (x, z) {
      if (z < -10 && Math.abs(x) < 14) return "Sunnyside Apartments (Home)";
      if (x < -18 && z < 4) return "Sunny Oaks School Campus";
      if (x > 18 && z < 4) return "Gedo Mahmoud & Nana Omaima's House 🏡";
      if (x > 14 && z > 10) return "Community Playground";
      if (x < -12 && z > 17) return "Duck Pond Garden & Gazebo";
      if (z > 28) return "Gated Community Entrance";
      return "Sunnyside Fountain Courtyard";
    };

    W.update = function (dt, elapsed) {
      // Animate double-tier parabolic fountain droplets, splash ripples & drifting petals
      W.fountainDrops.forEach(d => {
        const t = ((elapsed * 1.48 + d.userData.phase) % 1.0);
        const u = 1 - t;
        if (d.userData.high) {
          const r = u * u * 0.14 + 2 * u * t * 0.64 + t * t * 0.88;
          const y = u * u * 2.48 + 2 * u * t * 2.78 + t * t * 1.84;
          d.position.set(Math.cos(d.userData.angle) * r, y, Math.sin(d.userData.angle) * r);
        } else {
          const r = u * u * 1.15 + 2 * u * t * 1.68 + t * t * 1.98;
          const y = u * u * 1.83 + 2 * u * t * 2.04 + t * t * 0.56;
          d.position.set(Math.cos(d.userData.angle) * r, Math.max(0.56, y), Math.sin(d.userData.angle) * r);
        }
      });
      if (W.fountainRipples) {
        W.fountainRipples.forEach(rp => {
          const cyc = (elapsed * 1.18 + rp.phase) % 1.0;
          const sc = 0.52 + cyc * 2.15;
          rp.mesh.scale.set(sc, sc, 1);
          rp.mesh.material.opacity = (1 - cyc) * 0.68;
        });
      }
      if (W.fountainPetals) {
        W.fountainPetals.forEach(pt => {
          const a = elapsed * pt.spd + pt.phase;
          pt.mesh.position.set(Math.cos(a) * pt.r, 0.57, Math.sin(a) * pt.r);
          pt.mesh.rotation.z = a;
        });
      }
      if (W.swingPivot) W.swingPivot.rotation.x = Math.sin(elapsed * 2.1) * 0.24;
      if (W.carouselGroup) W.carouselGroup.rotation.y += dt * 0.55;
      if (W.schoolFlag) W.schoolFlag.rotation.y = Math.sin(elapsed * 3.8) * 0.16;

      // Gently lift the Security Gate arm when Laila or Salma approaches!
      if (W.gateArmPivot && LS.chars && LS.chars.laila) {
        const lp = LS.chars.laila.root.position;
        const nearGate = Math.hypot(lp.x, lp.z - 35.0) < 9.5;
        const targetZ = nearGate ? -1.15 : 0.0;
        W.gateArmPivot.rotation.z += (targetZ - W.gateArmPivot.rotation.z) * Math.min(1, dt * 4.0);
      }

      // Cozy hearth chimney wisps at Gedo Mahmoud & Nana Omaima's villa
      W.ovenSmokes.forEach(p => {
        const t = (elapsed * 0.35 + p.userData.phase) % 1.0;
        p.position.set(p.userData.baseX + Math.sin(elapsed + p.userData.phase * 6) * 0.35, p.userData.baseY + t * 2.6, p.userData.baseZ);
        p.scale.setScalar(0.65 + t * 1.35);
        p.material.opacity = (1 - t) * 0.42;
      });

      // Swimming pond ducks
      W.pondDucks.forEach((d, i) => {
        const a = elapsed * 0.42 - d.userData.baseAngle;
        const r = d.userData.radius;
        d.position.set(Math.cos(a) * r, 0.02 + Math.sin(elapsed * 4 + i) * 0.025, Math.sin(a) * r);
        d.rotation.y = -a;
      });

      // Fluttering butterflies
      W.butterflies.forEach(b => {
        const u = b.userData;
        const t = elapsed * 1.4 + u.phase;
        b.position.set(u.cx + Math.sin(t) * 1.35, 1.05 + Math.sin(t * 2.3) * 0.32, u.cz + Math.cos(t * 0.85) * 1.25);
        b.rotation.y = Math.atan2(Math.cos(t), -Math.sin(t * 0.85));
        const flap = Math.sin(elapsed * 18 + u.phase) * 0.65;
        u.wL.rotation.z = flap; u.wR.rotation.z = -flap;
      });

      // Gliding sky songbirds
      W.skyBirds.forEach(bg => {
        const u = bg.userData;
        const a = elapsed * u.speed + u.phase;
        bg.position.set(Math.cos(a) * u.radius, u.height + Math.sin(a * 2) * 0.8, Math.sin(a) * u.radius);
        bg.rotation.y = -a;
        const f = Math.sin(elapsed * 8 + u.phase) * 0.35;
        u.w1.rotation.z = f; u.w2.rotation.z = -f;
      });

      W.hiddenAnimals.forEach((a, i) => {
        if (!a.found && a.tail) a.tail.rotation.z = Math.sin(elapsed * 9 + i) * 0.45;
      });
    };

    W.drawMiniMap = function (ctx, Wpx, Hpx, toX, toY) {
      ctx.fillStyle = '#8cc972';
      ctx.fillRect(0, 0, Wpx, Hpx);
      // Roads
      ctx.fillStyle = '#d9ccb2';
      ctx.fillRect(toX(-4.5), toY(-18), toX(4.5) - toX(-4.5), toY(40) - toY(-18));
      ctx.fillRect(toX(-38), toY(-8.5), toX(38) - toX(-38), toY(-0.5) - toY(-8.5));
      ctx.fillRect(toX(-28), toY(16), toX(30) - toX(-28), toY(20) - toY(16));
      // Fountain circle & SW Duck Pond
      ctx.fillStyle = '#56cfe1';
      ctx.beginPath(); ctx.arc(toX(0), toY(3), 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(toX(-21.5), toY(25.5), 6.2, 0, Math.PI * 2); ctx.fill();
      // Landmarks
      ctx.fillStyle = '#e07a5f'; ctx.fillRect(toX(-10), toY(-26), toX(10) - toX(-10), toY(-13) - toY(-26));
      ctx.fillStyle = '#2e6f5e'; ctx.fillRect(toX(-36), toY(-20), toX(-26) - toX(-36), toY(-4) - toY(-20));
      ctx.fillStyle = '#c66b47'; ctx.fillRect(toX(26), toY(-17), toX(36) - toX(26), toY(-3) - toY(-17));
      ctx.fillStyle = '#f4a261'; ctx.fillRect(toX(18), toY(13), toX(31) - toX(18), toY(23) - toY(13));
      // Qashqai car marker next to South Gate
      ctx.fillStyle = '#4b5563'; ctx.fillRect(toX(-8.5), toY(28.5), toX(-3.0) - toX(-8.5), toY(33.5) - toY(28.5));
      // Labels
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('HOME', toX(0), toY(-18));
      ctx.fillText('SCHOOL', toX(-31), toY(-11));
      ctx.fillText('GEDO M.', toX(31), toY(-9));
      ctx.fillText('PARK', toX(24.5), toY(19));
      ctx.fillText('POND', toX(-21.5), toY(26));
      ctx.fillText('CAR', toX(-5.8), toY(32.5));
    };

    return W;
  }

  // Procedural Painterly Woven Rug Texture (shared across Home Apartment & Destinations!)
  LS.createWovenRugTexture = function (baseHex, borderHex, accentHex) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 192;
    const ctx = c.getContext('2d');
    ctx.fillStyle = baseHex || '#f3dfc1'; ctx.fillRect(0, 0, 256, 192);
    // Subtle woven textile grain
    ctx.fillStyle = 'rgba(120, 85, 50, 0.06)';
    for (let y = 0; y < 192; y += 4) ctx.fillRect(0, y, 256, 2);
    // Double ornate border
    ctx.strokeStyle = borderHex || '#c96f4d'; ctx.lineWidth = 14;
    ctx.strokeRect(13, 13, 230, 166);
    ctx.strokeStyle = accentHex || '#e9c46a'; ctx.lineWidth = 4;
    ctx.strokeRect(26, 26, 204, 140);
    // Center floral diamond medallion
    ctx.fillStyle = borderHex || '#c96f4d';
    ctx.beginPath(); ctx.moveTo(128, 48); ctx.lineTo(176, 96); ctx.lineTo(128, 144); ctx.lineTo(80, 96); ctx.closePath(); ctx.fill();
    ctx.fillStyle = accentHex || '#e9c46a';
    ctx.beginPath(); ctx.arc(128, 96, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = baseHex || '#f3dfc1';
    ctx.beginPath(); ctx.arc(128, 96, 9, 0, Math.PI * 2); ctx.fill();
    // Corner rosettes
    [[44, 44], [212, 44], [44, 148], [212, 148]].forEach(p => {
      ctx.fillStyle = accentHex || '#e9c46a';
      ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, Math.PI * 2); ctx.fill();
    });
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = LS.maxAnisotropy || 4;
    return tex;
  };

  function createSubwayTileTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#dce6df'; ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#f6faf7';
    for (let r = 0; r < 8; r++) {
      const off = (r % 2) * 16;
      for (let col = -1; col < 9; col++) {
        ctx.fillRect(col * 32 + off + 2, r * 16 + 2, 28, 12);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  function createWindowVistaTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 160;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 160);
    g.addColorStop(0, '#6ec6f5'); g.addColorStop(0.65, '#d9f2ff'); g.addColorStop(1, '#fff3cf');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 160);
    // Fluffy Ghibli clouds
    ctx.fillStyle = 'rgba(255,253,245,0.92)';
    [[55, 44, 24], [78, 38, 28], [102, 46, 22], [186, 56, 20], [208, 52, 24]].forEach(cl => {
      ctx.beginPath(); ctx.arc(cl[0], cl[1], cl[2], 0, Math.PI * 2); ctx.fill();
    });
    // Distant emerald hills & cherry treetops
    ctx.fillStyle = '#6db36b';
    ctx.beginPath(); ctx.ellipse(72, 162, 115, 48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#539957';
    ctx.beginPath(); ctx.ellipse(196, 164, 105, 44, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f9b7ca';
    [[48, 126, 22], [204, 128, 24]].forEach(bl => {
      ctx.beginPath(); ctx.arc(bl[0], bl[1], bl[2], 0, Math.PI * 2); ctx.fill();
    });
    return new THREE.CanvasTexture(c);
  }

  // =========================================================================
  // 2. LAILA & SALMA'S 4-ROOM 3D APARTMENT INTERIOR (home_apartment)
  //    HIGH-DETAIL STUDIO GHIBLI SHOWCASE EDITION
  //    NW: Kitchen | NE: Dining Room + Piano + Mom & Dad
  //    SW: TV & Game Room | SE: Sisters' Bedroom + Magic World Globe!
  // =========================================================================
  function buildHomeApartment(worldGroup) {
    const W = {
      id: 'home_apartment',
      isInterior: true,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      magicGlobe: null,
      globeRing: null,
      globeStars: [],
      tvScreenMat: null,
      tvCanvas: null,
      tvCtx: null,
      coffeeSteams: []
    };

    function addCol(x, z, hw, hd) {
      W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    }

    W.getGroundHeight = function () { return 0; };

    // Warm Honey-Oak Floor & Cream Ghibli Walls + Wainscoting, Baseboards & Crown Molding!
    const floorMat = LS.makeSurfaceMat(LS.createCedarPlankTexture(), { color: 0xe6c89c });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; worldGroup.add(floor);

    const wallMat = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture('#fbf2e3') });
    const wainscotMat = LS.makeToonMat(0xf0dfc6);
    const trimMat = LS.makeToonMat(0x8c5e3c);
    const whiteTrim = LS.makeToonMat(0xfff9ee);
    const ceilMat = LS.makeToonMat(0xfffaf0);

    // Outer 4 walls
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20.2, 4.6, 0.3), wallMat);
    backWall.position.set(0, 2.3, -8.0); worldGroup.add(backWall);
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(20.2, 4.6, 0.3), wallMat);
    frontWall.position.set(0, 2.3, 8.0); worldGroup.add(frontWall);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, 16.2), wallMat);
    leftWall.position.set(-10.0, 2.3, 0); worldGroup.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, 16.2), wallMat);
    rightWall.position.set(10.0, 2.3, 0); worldGroup.add(rightWall);

    // Wainscoting lower wall panel, chair-rail & crisp white baseboards + crown molding!
    [[0, -7.83, 20, 0.06], [0, 7.83, 20, 0.06]].forEach(b => {
      const ws = new THREE.Mesh(new THREE.BoxGeometry(b[2], 1.02, b[3]), wainscotMat);
      ws.position.set(b[0], 0.51, b[1]); worldGroup.add(ws);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(b[2], 0.08, b[3] + 0.06), whiteTrim);
      rail.position.set(b[0], 1.04, b[1]); worldGroup.add(rail);
      const bb = new THREE.Mesh(new THREE.BoxGeometry(b[2], 0.20, b[3] + 0.06), whiteTrim);
      bb.position.set(b[0], 0.10, b[1]); worldGroup.add(bb);
      const cr = new THREE.Mesh(new THREE.BoxGeometry(b[2], 0.16, b[3] + 0.08), whiteTrim);
      cr.position.set(b[0], 4.46, b[1]); worldGroup.add(cr);
    });
    [[-9.83, 0, 0.06, 16], [9.83, 0, 0.06, 16]].forEach(b => {
      const ws = new THREE.Mesh(new THREE.BoxGeometry(b[2], 1.02, b[3]), wainscotMat);
      ws.position.set(b[0], 0.51, b[1]); worldGroup.add(ws);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.06, 0.08, b[3]), whiteTrim);
      rail.position.set(b[0], 1.04, b[1]); worldGroup.add(rail);
      const bb = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.06, 0.20, b[3]), whiteTrim);
      bb.position.set(b[0], 0.10, b[1]); worldGroup.add(bb);
      const cr = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.08, 0.16, b[3]), whiteTrim);
      cr.position.set(b[0], 4.46, b[1]); worldGroup.add(cr);
    });

    // Open-plan wood-trimmed room dividers + warm header arches defining the 4 cozy rooms!
    const divMat = LS.makeToonMat(0xf4e4cc);
    const northDiv = new THREE.Mesh(new THREE.BoxGeometry(0.30, 4.4, 3.6), divMat);
    northDiv.position.set(-0.6, 2.2, -6.1); worldGroup.add(northDiv);
    const nCol = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.4, 0.36), trimMat);
    nCol.position.set(-0.6, 2.2, -4.3); worldGroup.add(nCol);
    addCol(-0.6, -6.1, 0.36, 1.9);

    const westDiv = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.4, 0.30), divMat);
    westDiv.position.set(-8.2, 2.2, 0.0); worldGroup.add(westDiv);
    const wCol = new THREE.Mesh(new THREE.BoxGeometry(0.36, 4.4, 0.38), trimMat);
    wCol.position.set(-6.5, 2.2, 0.0); worldGroup.add(wCol);
    addCol(-8.2, 0.0, 1.8, 0.36);

    const eastDiv = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.4, 0.30), divMat);
    eastDiv.position.set(8.3, 2.2, 0.0); worldGroup.add(eastDiv);
    const eCol = new THREE.Mesh(new THREE.BoxGeometry(0.36, 4.4, 0.38), trimMat);
    eCol.position.set(6.7, 2.2, 0.0); worldGroup.add(eCol);
    addCol(8.3, 0.0, 1.7, 0.36);

    // Ceiling + Exposed Warm Wood Ceiling Beams + 4 Glowing Pendant Lamps with Soft Halos!
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), ceilMat);
    ceil.rotation.x = Math.PI / 2; ceil.position.y = 4.55; worldGroup.add(ceil);
    [-5.0, 0.0, 5.0].forEach(bx => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 16), trimMat);
      beam.position.set(bx, 4.44, 0); worldGroup.add(beam);
    });
    [[-5.4, -4.0, 0xffe0a3], [3.8, -3.6, 0xffe4b0], [-5.2, 4.1, 0xffe0a3], [5.4, 4.2, 0xffd6e8]].forEach(lp => {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.85, 5), trimMat);
      cord.position.set(lp[0], 4.12, lp[1]); worldGroup.add(cord);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.30, 12), LS.makeToonMat(0xfff4e0));
      shade.position.set(lp[0], 3.72, lp[1]); worldGroup.add(shade);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), LS.makeEmissiveMat(0xfff7dc, lp[2], 0.92));
      bulb.position.set(lp[0], 3.56, lp[1]); worldGroup.add(bulb);
      if (LS.createGlowSprite) {
        const halo = LS.createGlowSprite(lp[2], 1.55);
        halo.position.set(lp[0], 3.55, lp[1]); worldGroup.add(halo);
      }
    });

    // Sunlit Ghibli Windows overlooking painted hills & clouds + flowing curtains + sunlit beams!
    const vistaMat = new THREE.MeshBasicMaterial({ map: createWindowVistaTexture() });
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xfff4c2, transparent: true, opacity: 0.11, side: THREE.DoubleSide, depthWrite: false });
    [[-5.4, 0xb8e0d2], [4.6, 0xf7d1cd]].forEach(wp => {
      const dw = createDetailedWindow(3.2, 1.9, vistaMat, trimMat, null);
      dw.position.set(wp[0], 2.55, -7.80); worldGroup.add(dw);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.4, 6), trimMat);
      rod.rotation.z = Math.PI / 2; rod.position.set(wp[0], 3.68, -7.65); worldGroup.add(rod);
      [-1.78, 1.78].forEach(cx => {
        const curt = new THREE.Mesh(new THREE.BoxGeometry(0.58, 2.45, 0.16), LS.makeToonMat(wp[1]));
        curt.position.set(wp[0] + cx, 2.50, -7.64); worldGroup.add(curt);
      });
      // Cute herb pots sitting right on the sunny windowsill!
      [-0.75, 0.75].forEach(hx => {
        const hPot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.16, 8), LS.makeToonMat(0xc66b47));
        hPot.position.set(wp[0] + hx, 1.66, -7.62); worldGroup.add(hPot);
        const hLeaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), LS.makeToonMat(0x4b9349));
        hLeaf.position.set(wp[0] + hx, 1.80, -7.62); worldGroup.add(hLeaf);
      });
      // Slanted golden afternoon sunbeam!
      const sunbeam = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 4.6), beamMat);
      sunbeam.position.set(wp[0], 1.55, -5.85);
      sunbeam.rotation.x = -0.82;
      worldGroup.add(sunbeam);
    });

    // Framed Family Adventure Art Paintings on the Walls!
    function addWallPainting(x, y, z, rotY, title, bgHex, borderHex) {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.18, 0.09), trimMat);
      frame.position.set(x, y, z); frame.rotation.y = rotY; worldGroup.add(frame);
      const art = new THREE.Mesh(
        new THREE.BoxGeometry(1.54, 0.96, 0.11),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture(title, { bg: bgHex, border: borderHex, color: '#3a2618', font: 'bold 26px sans-serif', width: 320, height: 200 })
        })
      );
      art.position.set(x, y, z); art.rotation.y = rotY; worldGroup.add(art);
    }
    addWallPainting(1.4, 2.55, -7.82, 0, '🌸 Tokyo Sakura', '#ffeef4', '#e07a5f');
    addWallPainting(8.2, 2.55, -7.82, 0, '🦁 Savanna Sun', '#fff3d6', '#d97706');
    addWallPainting(9.82, 2.40, 5.2, -Math.PI / 2, '⛩️ Kyoto Lake', '#eef7f2', '#2a9d8f');

    // -----------------------------------------------------------------------
    // ROOM 1: KITCHEN (Northwest — Healthy Snacks!)
    // Ceramic subway-tile backsplash, upper glass cabinets with plates, copper pans,
    // cutting board with sliced apples, cookie jar, chalkboard & mint retro fridge!
    // -----------------------------------------------------------------------
    const cabMat = LS.makeToonMat(0xdce8dc);
    const topMat = LS.makeToonMat(0xd9a773);
    const steelMat = LS.makeToonMat(0xc8d2dc);
    const copperMat = LS.makeToonMat(0xd47d42);

    // Kitchen woven runner rug
    const kRug = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 1.3),
      LS.makeSurfaceMat(LS.createWovenRugTexture('#e6f2e6', '#52997a', '#f4a261'))
    );
    kRug.rotation.x = -Math.PI / 2; kRug.position.set(-5.8, 0.015, -5.6); worldGroup.add(kRug);

    const kCounter = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.92, 1.15), cabMat);
    kCounter.position.set(-6.4, 0.46, -7.2); kCounter.castShadow = true; worldGroup.add(kCounter);
    const kTop = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.1, 1.25), topMat);
    kTop.position.set(-6.4, 0.96, -7.2); worldGroup.add(kTop);
    const splash = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.78, 0.08), LS.makeSurfaceMat(createSubwayTileTexture()));
    splash.position.set(-6.4, 1.40, -7.80); worldGroup.add(splash);

    // Upper Kitchen Wall Cabinet with Glass Doors & Stacked Plates inside!
    const upCab = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.35, 0.62), cabMat);
    upCab.position.set(-8.6, 2.75, -7.52); worldGroup.add(upCab);
    const upGlass = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.05, 0.65), LS.makeToonMat(0xebf8ff, { transparent: true, opacity: 0.45 }));
    upGlass.position.set(-8.6, 2.75, -7.52); worldGroup.add(upGlass);
    [-9.0, -8.2].forEach((px, pi) => {
      for (let st = 0; st < 3; st++) {
        const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.04, 10), LS.makeToonMat(pi === 0 ? 0xfff8ec : 0xffd6e0));
        pl.position.set(px, 2.38 + st * 0.06, -7.50); worldGroup.add(pl);
      }
    });

    // Hanging Copper Pans Rack on West Kitchen Wall!
    const panBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.2, 6), trimMat);
    panBar.rotation.x = Math.PI / 2; panBar.position.set(-9.72, 2.15, -4.4); worldGroup.add(panBar);
    [-5.0, -4.4, -3.8].forEach((pz, pi) => {
      const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.20 + pi * 0.03, 0.20 + pi * 0.03, 0.05, 12), copperMat);
      pan.rotation.z = Math.PI / 2; pan.position.set(-9.70, 1.78, pz); worldGroup.add(pan);
    });

    // Sink, curved faucet, stove + copper simmering pot, kettle & cutting board!
    const sink = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.06, 0.65), steelMat);
    sink.position.set(-5.4, 1.02, -7.2); worldGroup.add(sink);
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.38, 7), steelMat);
    faucet.position.set(-5.4, 1.22, -7.55); worldGroup.add(faucet);
    const stove = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.08, 0.85), LS.makeToonMat(0x2d3748));
    stove.position.set(-8.1, 1.03, -7.2); worldGroup.add(stove);
    const soupPot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.28, 12), copperMat);
    soupPot.position.set(-8.1, 1.21, -7.2); worldGroup.add(soupPot);
    const kettle = new THREE.Mesh(new THREE.SphereGeometry(0.17, 9, 8), LS.makeToonMat(0x4cc9f0));
    kettle.position.set(-4.1, 1.15, -7.25); worldGroup.add(kettle);
    const cookieJar = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.26, 10), LS.makeToonMat(0xffd166));
    cookieJar.position.set(-6.75, 1.14, -7.22); worldGroup.add(cookieJar);
    addCol(-6.4, -7.2, 3.2, 0.75);

    // Mint Retro Ghibli Fridge covered with Laila & Salma's colorful drawings & magnets!
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(1.40, 2.45, 1.14), LS.makeToonMat(0xa8dadc));
    fridge.position.set(-2.3, 1.22, -7.2); fridge.castShadow = true; worldGroup.add(fridge);
    const fSeam = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.04, 0.04), LS.makeToonMat(0x6ea8ab));
    fSeam.position.set(-2.3, 1.70, -6.62); worldGroup.add(fSeam);
    const fHandle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.1), steelMat);
    fHandle.position.set(-2.85, 1.32, -6.58); worldGroup.add(fHandle);
    [[-2.45, 2.04, 0xffd166], [-2.00, 1.96, 0xff8fab], [-2.22, 1.38, 0xb5e48c]].forEach(dr => {
      const pic = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.03), LS.makeToonMat(dr[2]));
      pic.position.set(dr[0], dr[1], -6.61); worldGroup.add(pic);
    });
    addCol(-2.3, -7.2, 0.8, 0.7);

    // Healthy Snack Kitchen Island with Fruit Bowl, Sliced Apple Cutting Board & Breakfast Stools!
    const island = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.9, 1.42), cabMat);
    island.position.set(-5.4, 0.45, -3.4); island.castShadow = true; worldGroup.add(island);
    const iTop = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.1, 1.56), topMat);
    iTop.position.set(-5.4, 0.95, -3.4); worldGroup.add(iTop);
    const cBoard = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.42), LS.makeToonMat(0xc48b57));
    cBoard.position.set(-4.55, 1.02, -3.4); worldGroup.add(cBoard);
    [-6.15, -4.65].forEach(sx => {
      const stTop = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.07, 10), topMat);
      stTop.position.set(sx, 0.62, -2.40); worldGroup.add(stTop);
      const stLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.16, 0.60, 8), trimMat);
      stLeg.position.set(sx, 0.30, -2.40); worldGroup.add(stLeg);
    });
    addCol(-5.4, -3.4, 1.52, 0.98);

    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.26, 0.18, 14), LS.makeToonMat(0xfff5e4));
    bowl.position.set(-5.7, 1.08, -3.4); worldGroup.add(bowl);
    [[0, 0, 0xe63946], [0.15, 0.06, 0x70e000], [-0.15, 0.05, 0xffd166], [0.02, -0.15, 0xff5d8f], [-0.08, -0.05, 0x7b2cbf]].forEach(fr => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), LS.makeToonMat(fr[2]));
      f.position.set(-5.7 + fr[0], 1.22, -3.4 + fr[1]); worldGroup.add(f);
    });

    const kitchenSign = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.52, 0.08),
      new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🍎 HEALTHY KITCHEN', { bg: '#233a2d', border: '#c48b57', color: '#fff8ec', font: 'bold 30px sans-serif' }) })
    );
    kitchenSign.position.set(-6.0, 3.88, -7.82); worldGroup.add(kitchenSign);

    W.zones.push({
      id: 'home_kitchen_snack',
      label: 'Grab a Healthy Snack in the Kitchen 🍎🫐',
      pos: new THREE.Vector3(-5.4, 0, -1.5),
      radius: 2.5
    });

    // -----------------------------------------------------------------------
    // ROOM 2: DINING ROOM + LAILA'S PIANO + MOM & DAD HAVING COFFEE (Northeast)
    // -----------------------------------------------------------------------
    const rugNE = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 4.2),
      LS.makeSurfaceMat(LS.createWovenRugTexture('#f5e4c8', '#b85c48', '#e9c46a'))
    );
    rugNE.rotation.x = -Math.PI / 2; rugNE.position.set(3.6, 0.015, -3.4); worldGroup.add(rugNE);

    // Warm Wooden Dining Sideboard / Display Hutch along North Wall! (X=4.6, Z=-7.35)
    const hutch = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.95, 0.72), trimMat);
    hutch.position.set(4.6, 0.48, -7.35); hutch.castShadow = true; worldGroup.add(hutch);
    const hPitcher = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.34, 10), LS.makeToonMat(0x4cc9f0));
    hPitcher.position.set(3.9, 1.12, -7.35); worldGroup.add(hPitcher);
    const hFrame = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.05), LS.makeToonMat(0xe9c46a));
    hFrame.position.set(5.1, 1.14, -7.35); hFrame.rotation.x = -0.18; worldGroup.add(hFrame);
    addCol(4.6, -7.35, 1.35, 0.48);

    // Laila's Detailed Upright Mahogany Piano (brass pedals, gold decal, sheet music, metronome & flowers!)
    const pianoG = new THREE.Group();
    pianoG.position.set(8.6, 0, -4.6);
    pianoG.rotation.y = -Math.PI / 2;
    const mahogMat = LS.makeToonMat(0x4a2518);
    const brassMat = LS.makeToonMat(0xe9c46a);
    const pBody = new THREE.Mesh(new THREE.BoxGeometry(2.48, 1.54, 0.86), mahogMat);
    pBody.position.y = 0.77; pBody.castShadow = true; pianoG.add(pBody);
    const pCrown = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.11, 0.94), mahogMat);
    pCrown.position.y = 1.56; pianoG.add(pCrown);
    const pKeyBed = new THREE.Mesh(new THREE.BoxGeometry(2.40, 0.16, 0.52), mahogMat);
    pKeyBed.position.set(0, 0.82, 0.56); pianoG.add(pKeyBed);
    const whiteKeys = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.06, 0.34), LS.makeToonMat(0xfffdf8));
    whiteKeys.position.set(0, 0.92, 0.58); pianoG.add(whiteKeys);
    for (let k = -0.9; k <= 0.9; k += 0.26) {
      const bk = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.2), LS.makeToonMat(0x1a1a1a));
      bk.position.set(k, 0.95, 0.50); pianoG.add(bk);
    }
    [-0.18, 0, 0.18].forEach(px => {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.18), brassMat);
      ped.position.set(px, 0.09, 0.46); pianoG.add(ped);
    });
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.48, 0.04), LS.makeToonMat(0xfffaf0));
    sheet.position.set(0, 1.32, 0.45); sheet.rotation.x = -0.18; pianoG.add(sheet);
    const metro = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 4), LS.makeToonMat(0x8c5a3c));
    metro.position.set(-0.78, 1.74, 0); pianoG.add(metro);
    const pVase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.10, 0.24, 8), LS.makeToonMat(0x90e0ef));
    pVase.position.set(0.82, 1.74, 0); pianoG.add(pVase);
    const pBloom = new THREE.Mesh(new THREE.SphereGeometry(0.13, 7, 6), LS.makeToonMat(0xff8fab));
    pBloom.position.set(0.82, 1.92, 0); pianoG.add(pBloom);
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.48, 0.46), mahogMat);
    bench.position.set(0, 0.24, 1.18); pianoG.add(bench);
    const bCush = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.09, 0.42), LS.makeToonMat(0xb8333a));
    bCush.position.set(0, 0.52, 1.18); pianoG.add(bCush);
    worldGroup.add(pianoG);
    addCol(8.6, -4.6, 0.9, 1.35);

    const nePlant = createPottedTree(0xd9a773, 0x3b8a4e, null);
    nePlant.position.set(8.8, 0, -6.9); worldGroup.add(nePlant);

    W.zones.push({
      id: 'home_piano',
      label: "Play Laila's Piano for Mom & Dad 🎹✨",
      pos: new THREE.Vector3(6.6, 0, -4.6),
      radius: 2.3
    });

    // Dining Table with Woven Runner, Steaming Coffee Mugs, Croissant Plate & Full-Back Chairs!
    const dinG = new THREE.Group();
    dinG.position.set(3.6, 0, -3.4);
    const dTop = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.12, 1.72), trimMat);
    dTop.position.y = 0.82; dTop.castShadow = true; dinG.add(dTop);
    const dRun = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.02, 0.54), LS.makeToonMat(0xfff5e4));
    dRun.position.y = 0.89; dinG.add(dRun);
    [[-1.12, -0.7], [1.12, -0.7], [-1.12, 0.7], [1.12, 0.7]].forEach(leg => {
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.82, 8), trimMat);
      l.position.set(leg[0], 0.41, leg[1]); dinG.add(l);
    });
    const mugMat = LS.makeToonMat(0xfff7ed);
    [[-0.68, 0], [0.68, 0]].forEach((m, idx) => {
      const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.02, 10), mugMat);
      saucer.position.set(m[0], 0.90, m[1]); dinG.add(saucer);
      const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.14, 10), mugMat);
      mug.position.set(m[0], 0.97, m[1]); dinG.add(mug);
      const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.02, 10), LS.makeToonMat(0x4a2c1d));
      coffee.position.set(m[0], 1.04, m[1]); dinG.add(coffee);
      const steam = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), LS.makeToonMat(0xffffff, { transparent: true, opacity: 0.48 }));
      steam.position.set(3.6 + m[0], 1.18, -3.4 + m[1]);
      steam.userData = { baseY: 1.18, phase: idx * 2.1 };
      worldGroup.add(steam);
      W.coffeeSteams.push(steam);
    });
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), LS.makeToonMat(0xe07a5f));
    pot.position.set(0, 1.02, -0.18); dinG.add(pot);
    const pastryPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.19, 0.04, 12), mugMat);
    pastryPlate.position.set(0, 0.91, 0.30); dinG.add(pastryPlate);
    const croissant = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 6), LS.makeToonMat(0xe9a954));
    croissant.scale.set(1.4, 0.7, 0.8); croissant.position.set(0, 0.97, 0.30); dinG.add(croissant);
    [[-1.54, 0], [1.54, 0]].forEach(ch => {
      const seatTop = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.08, 0.54), LS.makeToonMat(0xb67d52));
      seatTop.position.set(ch[0], 0.35, ch[1]); seatTop.castShadow = true; dinG.add(seatTop);
      [[-0.21, -0.21], [0.21, -0.21], [-0.21, 0.21], [0.21, 0.21]].forEach(lg => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.34, 0.055), LS.makeToonMat(0x7c4e2e));
        leg.position.set(ch[0] + lg[0], 0.17, ch[1] + lg[1]); dinG.add(leg);
      });
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.62, 0.52), LS.makeToonMat(0x8c5a3c));
      back.position.set(ch[0] + (ch[0] < 0 ? -0.24 : 0.24), 0.70, ch[1]); dinG.add(back);
    });
    worldGroup.add(dinG);
    addCol(3.6, -3.4, 1.6, 1.0);

    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Mom ☕',
        line: 'Good morning {leader}! Play us a song on the piano — we love you! 💛🎹',
        pos: new THREE.Vector3(2.04, 0.04, -3.4),
        baseRot: Math.PI / 2,
        seated: true,
        char: { scale: 0.90, skinColor: 0xe6b595, hairColor: 0x2c1e18, topColor: 0xf4a261, bottomColor: 0x3d5a80, longHair: true }
      },
      {
        name: 'Dad ☕',
        line: 'Good morning {leader}! Drive the Qashqai to the Airport for flights, or open our Enchanted Bookshelf for Ancient Egypt! ✈️📚',
        pos: new THREE.Vector3(5.16, 0.02, -3.4),
        baseRot: -Math.PI / 2,
        seated: true,
        char: { scale: 0.94, skinColor: 0xd9a480, hairColor: 0x241a16, topColor: 0x457b9d, bottomColor: 0x2b3a4a, pants: true, faceOpts: { glasses: true } }
      }
    ]);

    // -----------------------------------------------------------------------
    // ROOM 3: TV & VIDEO GAME ROOM + ENCHANTED STORYBOOK BOOKSHELF! (Southwest)
    // Woven patterned sage rug, sofa with blanket & pillows, magical storybook
    // portal bookshelf (Ancient Egypt & Outer Space!), retro console & soundbar!
    // -----------------------------------------------------------------------
    const rugSW = new THREE.Mesh(
      new THREE.PlaneGeometry(6.2, 4.8),
      LS.makeSurfaceMat(LS.createWovenRugTexture('#dcebd8', '#3f7d5f', '#f4a261'))
    );
    rugSW.rotation.x = -Math.PI / 2; rugSW.position.set(-5.2, 0.018, 4.1); worldGroup.add(rugSW);

    const sofaMat = LS.makeToonMat(0x52997a);
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.56, 3.35), sofaMat);
    sofaBase.position.set(-3.1, 0.28, 4.1); sofaBase.castShadow = true; worldGroup.add(sofaBase);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.00, 3.35), sofaMat);
    sofaBack.position.set(-2.62, 0.64, 4.1); worldGroup.add(sofaBack);
    [2.50, 5.70].forEach(az => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.74, 0.26), sofaMat);
      arm.position.set(-3.1, 0.37, az); worldGroup.add(arm);
    });
    // Draped cozy yellow knit blanket over sofa corner + throw pillows!
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.42, 0.72), LS.makeToonMat(0xf4d35e));
    blanket.position.set(-3.35, 0.48, 5.15); worldGroup.add(blanket);
    [[3.05, 0xffd166], [4.1, 0xff8fab], [5.15, 0x90e0ef]].forEach(pl => {
      const pill = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.42), LS.makeToonMat(pl[1]));
      pill.position.set(-2.90, 0.72, pl[0]); pill.rotation.z = 0.22; worldGroup.add(pill);
    });
    addCol(-3.0, 4.1, 0.74, 1.78);

    // ENCHANTED STORYBOOK PORTAL BOOKSHELF along South Apartment Wall! (X=-5.6, Z=7.45)
    // Open storybooks here to visit Ancient Egypt, Outer Space & magical non-present-day realms!
    const bookCase = new THREE.Mesh(new THREE.BoxGeometry(2.75, 2.38, 0.58), trimMat);
    bookCase.position.set(-5.6, 1.19, 7.45); bookCase.castShadow = true; worldGroup.add(bookCase);
    const shelfCrown = new THREE.Mesh(new THREE.BoxGeometry(2.94, 0.16, 0.68), LS.makeToonMat(0x7c4e2e));
    shelfCrown.position.set(-5.6, 2.42, 7.44); worldGroup.add(shelfCrown);
    const crownEmblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), LS.makeEmissiveMat(0xffe066, 0xffc300, 0.85));
    crownEmblem.position.set(-5.6, 2.58, 7.22); worldGroup.add(crownEmblem);
    const bCols = [0xe63946, 0xf4a261, 0x2a9d8f, 0x457b9d, 0xa855f7, 0xffd166];
    [0.55, 1.15, 1.78].forEach((by, bi) => {
      for (let i = 0; i < 8; i++) {
        const isGoldEgyptBook = (bi === 1 && i === 3);
        const isSpaceAtlasBook = (bi === 1 && i === 4);
        const bMat = isGoldEgyptBook
          ? LS.makeEmissiveMat(0xffd166, 0xffaa00, 0.82)
          : (isSpaceAtlasBook
            ? LS.makeEmissiveMat(0x7dd3fc, 0x38bdf8, 0.78)
            : LS.makeToonMat(bCols[(i + bi * 2) % bCols.length]));
        const bk = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.38 + (i % 2) * 0.09, 0.34), bMat);
        bk.position.set(-6.55 + i * 0.27, by, (isGoldEgyptBook || isSpaceAtlasBook) ? 7.18 : 7.28);
        if (i === 7 && bi === 2) bk.rotation.z = -0.22;
        worldGroup.add(bk);
      }
    });
    if (LS.createGlowSprite) {
      const bHalo = LS.createGlowSprite(0xffd166, 2.35);
      bHalo.position.set(-5.6, 1.38, 7.02);
      worldGroup.add(bHalo);
    }
    W.bookshelfStars = [];
    for (let s = 0; s < 5; s++) {
      const st = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.065, 0),
        LS.makeEmissiveMat(s % 2 === 0 ? 0xfff3b0 : 0x93c5fd, s % 2 === 0 ? 0xffd166 : 0x38bdf8, 0.92)
      );
      st.userData = { phase: s * 1.25, bx: -6.4 + s * 0.42, bz: 6.95 + (s % 2) * 0.14 };
      worldGroup.add(st);
      W.bookshelfStars.push(st);
    }
    addCol(-5.6, 7.45, 1.42, 0.42);
    W.zones.push({
      id: 'magic_bookshelf',
      label: 'Open Enchanted Storybook Bookshelf (Ancient Egypt & Beyond) 📚✨',
      pos: new THREE.Vector3(-5.6, 0, 6.2),
      radius: 2.5
    });

    // Standing Floor Lamp with warm halo beside sofa
    const flPole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.9, 6), trimMat);
    flPole.position.set(-2.8, 0.95, 6.45); worldGroup.add(flPole);
    const flShade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 0.38, 10), LS.makeEmissiveMat(0xfff4d6, 0xffd97d, 0.65));
    flShade.position.set(-2.8, 1.98, 6.45); worldGroup.add(flShade);

    const cTable = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.42, 1.75), trimMat);
    cTable.position.set(-5.0, 0.21, 4.1); worldGroup.add(cTable);
    [[-5.0, 3.65, 0xff5d8f], [-5.0, 4.55, 0x38bdf8]].forEach(gp => {
      const ctrl = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.07, 0.44), LS.makeToonMat(gp[2]));
      ctrl.position.set(gp[0], 0.46, gp[1]); worldGroup.add(ctrl);
    });
    addCol(-5.0, 4.1, 0.6, 0.9);

    const tvStand = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.65, 3.2), trimMat);
    tvStand.position.set(-9.2, 0.33, 4.1); worldGroup.add(tvStand);
    const soundBar = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, 1.85), LS.makeToonMat(0x222730));
    soundBar.position.set(-8.95, 0.71, 4.1); worldGroup.add(soundBar);
    const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.58), LS.makeToonMat(0x3a4654));
    consoleBox.position.set(-9.25, 0.72, 5.2); worldGroup.add(consoleBox);
    // Floating wall shelf above TV with trailing plant!
    const tvShelf = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.09, 2.4), trimMat);
    tvShelf.position.set(-9.68, 2.95, 4.1); worldGroup.add(tvShelf);
    const sVine = new THREE.Mesh(new THREE.SphereGeometry(0.20, 7, 6), LS.makeToonMat(0x3f8f47));
    sVine.scale.set(0.8, 1.8, 0.8); sVine.position.set(-9.55, 2.82, 3.15); worldGroup.add(sVine);
    const swPlant = createPottedTree(0xe07a5f, 0x3f8f47, null);
    swPlant.position.set(-9.1, 0, 6.6); worldGroup.add(swPlant);

    const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.68, 2.82), LS.makeToonMat(0x222730));
    tvFrame.position.set(-9.45, 1.72, 4.1); worldGroup.add(tvFrame);

    const tvC = document.createElement('canvas');
    tvC.width = 256; tvC.height = 160;
    W.tvCanvas = tvC; W.tvCtx = tvC.getContext('2d');
    const tvTex = new THREE.CanvasTexture(tvC);
    W.tvScreenMat = new THREE.MeshBasicMaterial({ map: tvTex });
    const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.56, 1.46), W.tvScreenMat);
    tvScreen.rotation.y = Math.PI / 2; tvScreen.position.set(-9.34, 1.72, 4.1); worldGroup.add(tvScreen);
    addCol(-9.2, 4.1, 0.75, 1.7);

    W.zones.push({
      id: 'home_tv_room',
      label: 'Watch Cozy TV or Play Video Games 📺🎮',
      pos: new THREE.Vector3(-6.8, 0, 4.1),
      radius: 2.5
    });

    // -----------------------------------------------------------------------
    // ROOM 4: SISTERS' BEDROOM + SPINNING MAGIC WORLD GLOBE! (Southeast)
    // Patterned blossom rug, plushies with ears, shared study/art desk,
    // populated 3D Toy Shelf & orbiting golden stars around the Magic Globe!
    // -----------------------------------------------------------------------
    const rugSE = new THREE.Mesh(
      new THREE.PlaneGeometry(6.8, 5.6),
      LS.makeSurfaceMat(LS.createWovenRugTexture('#fde8ef', '#e57c9e', '#ffd166'))
    );
    rugSE.rotation.x = -Math.PI / 2; rugSE.position.set(5.4, 0.018, 4.1); worldGroup.add(rugSE);

    function addBed(x, z, quiltHex, plushHex, isBunny) {
      const bg = new THREE.Group();
      bg.position.set(x, 0, z);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.45, 2.24), trimMat);
      frame.position.y = 0.22; frame.castShadow = true; bg.add(frame);
      const headb = new THREE.Mesh(new THREE.BoxGeometry(1.52, 1.12, 0.14), trimMat);
      headb.position.set(0, 0.58, 1.08); bg.add(headb);
      const quilt = new THREE.Mesh(new THREE.BoxGeometry(1.40, 0.28, 1.72), LS.makeToonMat(quiltHex));
      quilt.position.set(0, 0.52, -0.18); bg.add(quilt);
      const fold = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.30, 0.32), LS.makeToonMat(0xfffdf8));
      fold.position.set(0, 0.53, 0.48); bg.add(fold);
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.20, 0.48), LS.makeToonMat(0xfffdf8));
      pillow.position.set(0, 0.58, 0.78); bg.add(pillow);
      // Cute sculpted plushie with ears sitting on pillow!
      const pl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 7), LS.makeToonMat(plushHex));
      pl.position.set(0.24, 0.76, 0.72); bg.add(pl);
      const plH = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 7), LS.makeToonMat(plushHex));
      plH.position.set(0.24, 0.94, 0.72); bg.add(plH);
      [-0.06, 0.06].forEach(ex => {
        const ear = new THREE.Mesh(isBunny ? new THREE.CylinderGeometry(0.028, 0.032, 0.16, 6) : new THREE.ConeGeometry(0.04, 0.08, 4), LS.makeToonMat(plushHex));
        ear.position.set(0.24 + ex, isBunny ? 1.08 : 1.04, 0.72); bg.add(ear);
      });
      worldGroup.add(bg);
      addCol(x, z, 0.85, 1.2);
    }
    addBed(8.0, 5.6, 0xff8fab, 0xf4a261, false);
    addBed(5.0, 5.6, 0x72c8f5, 0xfff0f5, true);

    const nStand = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.58, 0.65), trimMat);
    nStand.position.set(6.5, 0.29, 6.25); worldGroup.add(nStand);
    const moonLamp = new THREE.Mesh(new THREE.SphereGeometry(0.17, 9, 8), LS.makeEmissiveMat(0xfff5c0, 0xffd166, 0.92));
    moonLamp.position.set(6.5, 0.76, 6.25); worldGroup.add(moonLamp);

    // Colorful Pennant Bunting Garland & Glowing Star Decals above Sisters' Beds!
    const penCols = [0xff8fab, 0xffd166, 0x72c8f5, 0xb5e48c, 0xc77dff];
    for (let i = 0; i < 7; i++) {
      const pen = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.34, 3), LS.makeToonMat(penCols[i % penCols.length]));
      pen.rotation.x = Math.PI;
      pen.position.set(4.4 + i * 0.72, 2.55 - Math.sin((i / 6) * Math.PI) * 0.28, 7.72);
      worldGroup.add(pen);
    }

    // Shared Sisters' Art & Drawing Desk (X=2.8, Z=6.8) with sketchbook & colored pencils!
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.72, 0.78), LS.makeToonMat(0xf4e4cc));
    desk.position.set(2.4, 0.36, 7.25); worldGroup.add(desk);
    const sketch = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.40), LS.makeToonMat(0xfffdf8));
    sketch.position.set(2.2, 0.74, 7.22); worldGroup.add(sketch);
    const pCup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.14, 8), LS.makeToonMat(0xff8fab));
    pCup.position.set(2.85, 0.79, 7.22); worldGroup.add(pCup);
    addCol(2.4, 7.25, 0.9, 0.5);

    // Populated 3D Toy Shelf on East Bedroom Wall
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.58, 2.15, 2.2), trimMat);
    shelf.position.set(9.45, 1.08, 2.2); worldGroup.add(shelf);
    [0.65, 1.25, 1.85].forEach((sy, si) => {
      [1.52, 2.05, 2.58].forEach((sz, ti) => {
        const toy = new THREE.Mesh(
          (si + ti) % 2 === 0 ? new THREE.SphereGeometry(0.15, 8, 6) : new THREE.BoxGeometry(0.22, 0.28, 0.18),
          LS.makeToonMat(penCols[(si + ti) % penCols.length])
        );
        toy.position.set(9.10, sy, sz); worldGroup.add(toy);
      });
    });
    W.zones.push({
      id: 'toy_shelf_view',
      label: 'View Toy Shelf & Sticker Album 🎁',
      pos: new THREE.Vector3(8.1, 0, 2.2),
      radius: 2.0
    });

    // GLOWING SPINNING 3D MAGIC WORLD GLOBE + Orbiting Golden Stars!
    const globeStandG = new THREE.Group();
    globeStandG.position.set(3.2, 0, 3.6);
    const pedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.60, 0.14, 14), trimMat);
    pedBase.position.y = 0.07; globeStandG.add(pedBase);
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.38, 0.84, 12), trimMat);
    pedestal.position.y = 0.50; pedestal.castShadow = true; globeStandG.add(pedestal);
    const brassRing = new THREE.Mesh(new THREE.TorusGeometry(0.60, 0.042, 8, 28), LS.makeEmissiveMat(0xf5c542, 0xffd166, 0.62));
    brassRing.position.y = 1.50; brassRing.rotation.z = 0.35; globeStandG.add(brassRing);
    const eqRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.022, 6, 28), LS.makeEmissiveMat(0x72efdd, 0x72efdd, 0.68));
    eqRing.position.y = 1.50; eqRing.rotation.x = Math.PI / 2 - 0.25; globeStandG.add(eqRing);

    // 4 Tiny Golden Stars orbiting the Magic World Globe!
    for (let i = 0; i < 4; i++) {
      const st = new THREE.Mesh(new THREE.OctahedronGeometry(0.07, 0), LS.makeEmissiveMat(0xfff3b0, 0xffd166, 0.9));
      st.userData = { angle: (i / 4) * Math.PI * 2 };
      globeStandG.add(st);
      W.globeStars.push(st);
    }

    const gc = document.createElement('canvas');
    gc.width = 256; gc.height = 128;
    const gctx = gc.getContext('2d');
    gctx.fillStyle = '#2d9cdb'; gctx.fillRect(0, 0, 256, 128);
    gctx.fillStyle = '#6fcf97';
    [[52, 46, 26, 18], [68, 84, 16, 22], [134, 42, 24, 18], [142, 78, 18, 22], [198, 48, 28, 22], [208, 92, 16, 12]].forEach(b => {
      gctx.beginPath(); gctx.ellipse(b[0], b[1], b[2], b[3], 0.2, 0, Math.PI * 2); gctx.fill();
    });
    gctx.fillStyle = 'rgba(255,255,255,0.65)';
    gctx.fillRect(0, 0, 256, 10); gctx.fillRect(0, 118, 256, 10);
    const globeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.49, 20, 14),
      LS.makeEmissiveMat(0xffffff, 0x56cfe1, 0.34)
    );
    globeMesh.material.map = new THREE.CanvasTexture(gc);
    globeMesh.position.y = 1.50;
    globeStandG.add(globeMesh);

    if (LS.createGlowSprite) {
      const gHalo = LS.createGlowSprite(0x72efdd, 2.25);
      gHalo.position.y = 1.50;
      globeStandG.add(gHalo);
    }
    worldGroup.add(globeStandG);
    W.magicGlobe = globeMesh;
    W.globeRing = brassRing;
    addCol(3.2, 3.6, 0.62, 0.62);

    W.zones.push({
      id: 'magic_globe',
      label: 'Spin the Magic World Globe 🌍✨',
      pos: new THREE.Vector3(3.2, 0, 2.2),
      radius: 2.4
    });

    const fDoor = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.55, 0.2), trimMat);
    fDoor.position.set(0, 1.28, 7.82); worldGroup.add(fDoor);
    const fKnob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 7, 6), brassMat);
    fKnob.position.set(0.62, 1.18, 7.68); worldGroup.add(fKnob);
    const exitMat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 1.1), LS.makeToonMat(0x2a9d8f));
    exitMat.position.set(0, 0.02, 7.05); worldGroup.add(exitMat);
    W.zones.push({
      id: 'exit_interior',
      label: 'Step Outside to Gated Community 🚪🏡',
      pos: new THREE.Vector3(0, 0, 6.75),
      radius: 2.1
    });

    W.getZoneLabel = function (x, z) {
      if (x < 0 && z < 0) return 'Home Kitchen 🍎';
      if (x >= 0 && z < 0) return 'Dining Room & Piano 🎹☕';
      if (x < 0 && z >= 5.2) return 'Enchanted Storybook Bookshelf 📚✨';
      if (x < 0 && z >= 0) return 'TV & Game Room 📺🎮';
      return "Sisters' Bedroom & Magic Globe 🌍";
    };

    W.update = function (dt, elapsed) {
      if (W.magicGlobe) {
        W.magicGlobe.rotation.y = elapsed * 0.65;
        W.magicGlobe.position.y = 1.50 + Math.sin(elapsed * 2.2) * 0.05;
      }
      if (W.globeRing) W.globeRing.rotation.y = -elapsed * 0.45;
      W.globeStars.forEach((st, i) => {
        const a = elapsed * 1.15 + st.userData.angle;
        st.position.set(Math.cos(a) * 0.84, 1.50 + Math.sin(a * 2 + i) * 0.22, Math.sin(a) * 0.84);
        st.rotation.y = elapsed * 2.2;
      });
      if (W.bookshelfStars) {
        W.bookshelfStars.forEach((st, i) => {
          const u = st.userData;
          const cyc = (elapsed * 0.45 + u.phase) % 1.0;
          st.position.set(u.bx + Math.sin(elapsed * 1.8 + i) * 0.14, 0.72 + cyc * 1.65, u.bz);
          st.rotation.y = elapsed * 2.5 + i;
          st.scale.setScalar(0.55 + Math.sin(cyc * Math.PI) * 0.65);
        });
      }
      W.coffeeSteams.forEach(st => {
        const t = (elapsed * 0.55 + st.userData.phase) % 1.0;
        st.position.y = st.userData.baseY + t * 0.55;
        st.scale.setScalar(0.7 + t * 0.9);
        st.material.opacity = (1 - t) * 0.42;
      });
      if (W.tvCtx && W.tvScreenMat && Math.floor(elapsed * 12) !== W._lastTvFrame) {
        W._lastTvFrame = Math.floor(elapsed * 12);
        const ctx = W.tvCtx;
        const grad = ctx.createLinearGradient(0, 0, 0, 160);
        grad.addColorStop(0, '#38a3e8'); grad.addColorStop(0.68, '#a8e4ff'); grad.addColorStop(1, '#6ec46b');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 160);
        ctx.fillStyle = '#53a653';
        ctx.beginPath(); ctx.ellipse(75, 162, 110, 44, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(205, 166, 95, 38, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fffdf5';
        const cx = ((elapsed * 24) % 310) - 30;
        ctx.beginPath(); ctx.arc(cx, 50, 22, 0, Math.PI * 2); ctx.arc(cx + 22, 44, 26, 0, Math.PI * 2); ctx.arc(cx + 44, 52, 20, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd166'; ctx.font = 'bold 26px sans-serif';
        ctx.fillText('⭐', 114, 110 + Math.sin(elapsed * 5) * 14);
        W.tvScreenMat.map.needsUpdate = true;
      }
    };

    W.drawMiniMap = function (ctx, Wpx, Hpx, toX, toY) {
      ctx.fillStyle = '#f5e6cc'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#dce8dc'; ctx.fillRect(toX(-10), toY(-8), toX(0) - toX(-10), toY(0) - toY(-8));
      ctx.fillStyle = '#fbe8d4'; ctx.fillRect(toX(0), toY(-8), toX(10) - toX(0), toY(0) - toY(-8));
      ctx.fillStyle = '#d9e8d2'; ctx.fillRect(toX(-10), toY(0), toX(0) - toX(-10), toY(8) - toY(0));
      ctx.fillStyle = '#fde2eb'; ctx.fillRect(toX(0), toY(0), toX(10) - toX(0), toY(8) - toY(0));
      ctx.fillStyle = '#3d2c1e'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('KITCHEN', toX(-5), toY(-3.5));
      ctx.fillText('PIANO/DINING', toX(5), toY(-3.5));
      ctx.fillText('TV & BOOKS 📚', toX(-5), toY(4));
      ctx.fillText('BEDROOM 🌍', toX(5), toY(4));
    };

    return W;
  }

  LS.registerWorld('home_neighborhood', { build: buildHomeNeighborhood });
  LS.registerWorld('home_apartment', { build: buildHomeApartment });
})(window.LailaSalma);

