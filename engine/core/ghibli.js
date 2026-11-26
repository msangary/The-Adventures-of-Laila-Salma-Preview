window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  let ghibliRampTex = null;

  function isTouchOrPhone() {
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth <= 920;
    const ua = (navigator && navigator.userAgent) ? navigator.userAgent : '';
    return coarse || narrow || /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  }

  const QUALITY_PRESETS = {
    high: {
      id: 'high',
      label: '✨ High',
      maxDpr: 2.0,
      shadowSize: 2048,
      grassScale: 1.0,
      usePost: true,
      useBloom: true
    },
    balanced: {
      id: 'balanced',
      label: '⚖️ Balanced',
      maxDpr: 1.5,
      shadowSize: 1024,
      grassScale: 0.45,
      usePost: true,
      useBloom: false
    },
    lite: {
      id: 'lite',
      label: '⚡ Lite',
      maxDpr: 1.15,
      shadowSize: 512,
      grassScale: 0.0,
      usePost: false,
      useBloom: false
    }
  };

  function getToonRamp() {
    if (ghibliRampTex) return ghibliRampTex;
    // Pure Studio Ghibli 3-Band Painterly Watercolor Cel Ramp:
    // Band 1: Cool lavender-slate shadow | Band 2: Luminous daylight midtone | Band 3: Warm cream sunlit highlight
    const data = new Uint8Array([
      132, 140, 174, 255,
      132, 140, 174, 255,
      208, 212, 222, 255,
      208, 212, 222, 255,
      255, 251, 236, 255,
      255, 251, 236, 255
    ]);
    const tex = new THREE.DataTexture(data, 6, 1, THREE.RGBAFormat);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    ghibliRampTex = tex;
    return tex;
  }

  function createGhibliMat(color, opts) {
    const raw = Object.assign({ color: color !== undefined ? color : 0xffffff }, opts || {});
    const cfg = {
      color: raw.color,
      gradientMap: getToonRamp()
    };
    if (raw.map) cfg.map = raw.map;
    if (raw.bumpMap) {
      cfg.bumpMap = raw.bumpMap;
      cfg.bumpScale = raw.bumpScale !== undefined ? raw.bumpScale : 0.035;
    }
    if (raw.normalMap) {
      cfg.normalMap = raw.normalMap;
      cfg.normalScale = raw.normalScale || new THREE.Vector2(0.55, 0.55);
    }
    if (raw.emissive !== undefined) cfg.emissive = raw.emissive;
    if (raw.emissiveIntensity !== undefined) cfg.emissiveIntensity = raw.emissiveIntensity;
    if (raw.transparent !== undefined) cfg.transparent = raw.transparent;
    if (raw.opacity !== undefined) cfg.opacity = raw.opacity;
    if (raw.side !== undefined) cfg.side = raw.side;
    if (raw.alphaTest !== undefined) cfg.alphaTest = raw.alphaTest;
    if (raw.vertexColors !== undefined) cfg.vertexColors = raw.vertexColors;
    if (raw.depthWrite !== undefined) cfg.depthWrite = raw.depthWrite;
    return new THREE.MeshToonMaterial(cfg);
  }

  let cachedLeafTex = null;
  function getLeafBrushTexture() {
    if (cachedLeafTex) return cachedLeafTex;
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#dcdcdc';
    ctx.fillRect(0, 0, 256, 256);
    // Soft hand-painted Ghibli leaf brushstroke dapples
    let seed = 4219;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (let i = 0; i < 240; i++) {
      const x = rnd() * 256;
      const y = rnd() * 256;
      const rx = 8 + rnd() * 14;
      const ry = 4 + rnd() * 7;
      const ang = rnd() * Math.PI;
      const tone = rnd();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.fillStyle = tone > 0.62 ? 'rgba(255,255,255,0.42)'
        : (tone < 0.34 ? 'rgba(135,148,132,0.34)' : 'rgba(218,228,214,0.36)');
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.encoding = THREE.sRGBEncoding;
    tex.needsUpdate = true;
    cachedLeafTex = tex;
    return tex;
  }

  let cachedBarkTex = null;
  function getBarkTexture() {
    if (cachedBarkTex) return cachedBarkTex;
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#d4c3b0';
    ctx.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 10) {
      ctx.strokeStyle = x % 20 === 0 ? 'rgba(84,56,36,0.36)' : 'rgba(255,244,226,0.24)';
      ctx.lineWidth = 3 + (x % 3);
      ctx.beginPath();
      for (let y = 0; y <= 256; y += 16) {
        const xx = x + Math.sin(y * 0.05 + x * 0.2) * 3.5;
        if (y === 0) ctx.moveTo(xx, y); else ctx.lineTo(xx, y);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.encoding = THREE.sRGBEncoding;
    tex.needsUpdate = true;
    cachedBarkTex = tex;
    return tex;
  }

  let cachedPuffGeo = null;
  function getOrganicFoliageGeo() {
    if (cachedPuffGeo) return cachedPuffGeo;
    const geo = new THREE.SphereGeometry(1.0, 14, 11);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const lump = 1.0 + 0.11 * Math.sin(x * 3.8 + y * 2.7) * Math.cos(z * 3.4 - y * 2.2)
                       + 0.06 * Math.cos(x * 6.2 - z * 5.1);
      pos.setXYZ(i, x * lump, y * lump, z * lump);
    }
    geo.computeVertexNormals();
    cachedPuffGeo = geo;
    return geo;
  }

  // Organic Studio Ghibli multi-tone dappled leaf/blossom cluster canopy
  function addLeafClusters(group, centers, opts) {
    const cfg = Object.assign({
      sunHex: 0x8ad662,
      midHex: 0x54a84c,
      shadeHex: 0x35753d,
      castShadow: true,
      receiveShadow: true
    }, opts || {});

    const leafTex = getLeafBrushTexture();
    const sunMat = createGhibliMat(cfg.sunHex, { map: leafTex });
    const midMat = createGhibliMat(cfg.midHex, { map: leafTex });
    const shadeMat = createGhibliMat(cfg.shadeHex, { map: leafTex });
    const puffGeo = getOrganicFoliageGeo();

    (centers || []).forEach((c, idx) => {
      const r = c[3] || 1.0;
      const sx = (c[4] || 1.12) * r;
      const sy = (c[5] || 0.86) * r;
      const sz = (c[6] || 1.08) * r;
      const mat = (c[7] === 'sun' || idx % 3 === 0) ? sunMat
        : ((c[7] === 'shade' || idx % 3 === 2) ? shadeMat : midMat);
      const puff = new THREE.Mesh(puffGeo, mat);
      puff.position.set(c[0], c[1], c[2]);
      puff.scale.set(sx, sy, sz);
      puff.rotation.set(idx * 0.45, idx * 0.85, idx * 0.25);
      puff.castShadow = cfg.castShadow;
      puff.receiveShadow = cfg.receiveShadow;
      group.add(puff);
    });
  }

  // Painterly Ghibli tree builder (flared roots + curved textured bark trunk + 4 boughs + 11-cluster Miyazaki canopy!)
  function buildGhibliTree(kind, scale) {
    const s = scale || 1.0;
    const g = new THREE.Group();
    const palettes = {
      sakura: { trunk: 0x5c4237, sun: 0xffd9e8, mid: 0xf7a2c2, shade: 0xd46b94 },
      maple:  { trunk: 0x593a2b, sun: 0xffad4d, mid: 0xe85d38, shade: 0xa82e22 },
      gold:   { trunk: 0x5d412d, sun: 0xffe478, mid: 0xf2b138, shade: 0xc2761e },
      olive:  { trunk: 0x6b533b, sun: 0xa8d474, mid: 0x6f9e4d, shade: 0x42682f },
      green:  { trunk: 0x614431, sun: 0x96df6c, mid: 0x52a64a, shade: 0x2e6f37 }
    };
    const pal = palettes[kind] || palettes.green;
    const trunkMat = createGhibliMat(pal.trunk, { map: getBarkTexture() });

    // Flared organic root buttresses gripping the earth
    for (let r = 0; r < 4; r++) {
      const a = (r / 4) * Math.PI * 2 + 0.35;
      const root = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.22, 0.72, 7), trunkMat);
      root.position.set(Math.cos(a) * 0.24, 0.24, Math.sin(a) * 0.24);
      root.rotation.z = -Math.cos(a) * 0.48;
      root.rotation.x = Math.sin(a) * 0.48;
      root.castShadow = true;
      g.add(root);
    }

    // Gently curving 2-segment bark trunk
    const trunkLow = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.36, 1.65, 10), trunkMat);
    trunkLow.position.set(0.02, 0.82, 0);
    trunkLow.rotation.z = -0.05;
    trunkLow.castShadow = true;
    trunkLow.receiveShadow = true;
    g.add(trunkLow);

    const trunkTop = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.45, 10), trunkMat);
    trunkTop.position.set(0.09, 2.22, -0.02);
    trunkTop.rotation.z = 0.06;
    trunkTop.castShadow = true;
    trunkTop.receiveShadow = true;
    g.add(trunkTop);

    // 4 Organically forked boughs reaching outward into the foliage
    [
      [-0.45, 2.48, 0.16, 0.54, 0.14],
      [0.48, 2.55, -0.18, -0.50, -0.18],
      [0.12, 2.42, 0.46, 0.12, 0.54],
      [-0.14, 2.46, -0.44, -0.14, -0.52]
    ].forEach(b => {
      const br = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.135, 1.25, 7), trunkMat);
      br.position.set(b[0], b[1], b[2]);
      br.rotation.z = b[3];
      br.rotation.x = b[4];
      br.castShadow = true;
      g.add(br);
    });

    // Rich 11-cluster layered Miyazaki cloud canopy (deep shade under-boughs -> mid -> warm sunlit crown)
    addLeafClusters(g, [
      [0.0, 4.18, 0.0, 1.22, 1.22, 0.82, 1.16, 'sun'],
      [0.58, 3.92, 0.36, 0.92, 1.15, 0.78, 1.08, 'sun'],
      [-0.54, 3.85, -0.32, 0.94, 1.14, 0.80, 1.08, 'sun'],
      [-1.18, 3.24, 0.45, 1.06, 1.18, 0.78, 1.08, 'mid'],
      [1.22, 3.30, -0.32, 1.08, 1.18, 0.80, 1.08, 'sun'],
      [0.24, 3.18, 1.08, 0.98, 1.14, 0.78, 1.06, 'mid'],
      [-0.32, 3.12, -1.06, 1.02, 1.16, 0.80, 1.06, 'shade'],
      [-0.92, 2.84, -0.58, 0.86, 1.12, 0.72, 1.04, 'shade'],
      [0.92, 2.86, 0.64, 0.88, 1.12, 0.74, 1.04, 'mid'],
      [0.05, 2.74, -0.45, 0.84, 1.14, 0.68, 1.05, 'shade'],
      [-0.42, 3.36, 0.72, 0.80, 1.10, 0.76, 1.04, 'sun']
    ], { sunHex: pal.sun, midHex: pal.mid, shadeHex: pal.shade });

    g.scale.setScalar(s);
    return g;
  }

  // Lush Studio Ghibli Potted Seville Orange / Citrus Tree (Glazed Pot + Forked Bark + 11 Dappled Foliage Puffs + Oranges & White Blossoms!)
  function buildOrangeTree(scale, opts) {
    const s = scale || 1.0;
    const cfg = Object.assign({
      potHex: 0x1f5692,
      rimHex: 0xf4be44,
      bandHex: 0x1ea3a3,
      sunHex: 0x76c758,
      midHex: 0x3f9646,
      shadeHex: 0x246334,
      fruitHex: 0xff8c1a,
      withBlossoms: true
    }, opts || {});

    const g = new THREE.Group();
    const potMat = createGhibliMat(cfg.potHex);
    const rimMat = createGhibliMat(cfg.rimHex);
    const bandMat = createGhibliMat(cfg.bandHex);
    const soilMat = createGhibliMat(0x523926);
    const trunkMat = createGhibliMat(0x6d4a2d, { map: getBarkTexture() });

    // Sculpted Moroccan glazed terracotta pot with ornamental gold & turquoise bands
    const potFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.12, 14), rimMat);
    potFoot.position.y = 0.06; g.add(potFoot);
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.42, 0.68, 16), potMat);
    pot.position.y = 0.40; pot.castShadow = true; pot.receiveShadow = true; g.add(pot);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.50, 0.14, 16), bandMat);
    band.position.y = 0.46; g.add(band);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.57, 0.065, 8, 20), rimMat);
    rim.rotation.x = Math.PI / 2; rim.position.y = 0.74; g.add(rim);
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.06, 14), soilMat);
    soil.position.y = 0.72; g.add(soil);

    // Gently curving textured citrus trunk + 3 visible forked branches!
    const trunkLow = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.15, 0.95, 9), trunkMat);
    trunkLow.position.set(0.02, 1.15, 0);
    trunkLow.rotation.z = -0.06;
    trunkLow.castShadow = true;
    g.add(trunkLow);

    const trunkUp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.78, 9), trunkMat);
    trunkUp.position.set(0.06, 1.92, -0.02);
    trunkUp.rotation.z = 0.08;
    trunkUp.castShadow = true;
    g.add(trunkUp);

    [[-0.26, 2.08, 0.12, 0.58, 0.16], [0.28, 2.12, -0.10, -0.55, -0.14], [0.02, 2.05, 0.25, 0.06, 0.52]].forEach(b => {
      const br = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.075, 0.72, 7), trunkMat);
      br.position.set(b[0], b[1], b[2]);
      br.rotation.z = b[3]; br.rotation.x = b[4];
      br.castShadow = true;
      g.add(br);
    });

    // 11-cluster organic Miyazaki citrus crown (layered shade -> mid -> sunlit green!)
    addLeafClusters(g, [
      [0.0, 3.02, 0.0, 0.68, 1.18, 0.85, 1.14, 'sun'],
      [0.44, 2.86, 0.28, 0.52, 1.12, 0.82, 1.06, 'sun'],
      [-0.46, 2.84, -0.22, 0.54, 1.14, 0.84, 1.08, 'sun'],
      [-0.68, 2.48, 0.24, 0.58, 1.16, 0.80, 1.08, 'mid'],
      [0.70, 2.52, -0.20, 0.58, 1.16, 0.82, 1.08, 'mid'],
      [0.14, 2.52, 0.66, 0.54, 1.12, 0.80, 1.06, 'mid'],
      [-0.18, 2.46, -0.66, 0.56, 1.14, 0.82, 1.06, 'shade'],
      [-0.48, 2.18, -0.34, 0.46, 1.10, 0.74, 1.04, 'shade'],
      [0.48, 2.20, 0.38, 0.48, 1.10, 0.76, 1.04, 'shade'],
      [0.02, 2.24, -0.14, 0.52, 1.12, 0.72, 1.08, 'shade'],
      [-0.24, 2.74, 0.48, 0.44, 1.08, 0.78, 1.05, 'sun']
    ], { sunHex: cfg.sunHex, midHex: cfg.midHex, shadeHex: cfg.shadeHex });

    // Glistening ripe Seville oranges with tiny green leaf calyxes!
    if (cfg.fruitHex) {
      const orangeMat = createGhibliMat(cfg.fruitHex);
      const stemMat = createGhibliMat(0x276b33);
      [
        [0.64, 2.54, 0.54], [-0.68, 2.60, 0.42], [0.24, 2.98, 0.66],
        [-0.26, 2.28, 0.72], [0.78, 2.34, -0.32], [-0.52, 2.86, -0.58],
        [0.12, 2.46, -0.78], [0.54, 2.96, -0.12], [-0.74, 2.26, -0.22]
      ].forEach(op => {
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.115, 10, 8), orangeMat);
        fruit.position.set(op[0], op[1], op[2]);
        g.add(fruit);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.03, 6), stemMat);
        cap.position.set(op[0], op[1] + 0.11, op[2]);
        g.add(cap);
      });
    }

    // Dainty fragrant white-and-gold orange blossoms nestled in the canopy!
    if (cfg.withBlossoms) {
      const petalMat = createGhibliMat(0xfffdf6);
      const centerMat = createGhibliMat(0xffd166);
      [
        [0.36, 3.16, 0.34], [-0.42, 3.04, 0.24], [0.76, 2.70, 0.12],
        [-0.78, 2.58, -0.06], [0.06, 2.74, 0.80], [-0.14, 2.88, -0.74], [0.46, 2.38, -0.62]
      ].forEach(bp => {
        const bl = new THREE.Mesh(new THREE.SphereGeometry(0.068, 7, 6), petalMat);
        bl.scale.set(1.2, 0.65, 1.2);
        bl.position.set(bp[0], bp[1], bp[2]);
        g.add(bl);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), centerMat);
        dot.position.set(bp[0], bp[1] + 0.035, bp[2]);
        g.add(dot);
      });
    }

    g.scale.setScalar(s);
    return g;
  }

  // Luminous Studio Ghibli continuous curving parabolic fountain water jet (TubeGeometry!)
  function createWaterJetArc(p0, ctrl, p1, radius) {
    const curve = new THREE.QuadraticBezierCurve3(p0, ctrl, p1);
    const geo = new THREE.TubeGeometry(curve, 16, radius || 0.032, 7, false);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xdffbff,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 3;
    return mesh;
  }

  // Stylized Studio Ghibli cel-shimmer turquoise water (Ponyo / Spirited Away palette)
  function createGhibliWaterMat(opacity, side) {
    const op = opacity !== undefined ? opacity : 0.90;
    const uniforms = {
      uTime: { value: 0.0 },
      uTimeMode: { value: LS.state ? LS.state.timeMode : 0.0 },
      uOpacity: { value: op }
    };
    if (LS.hdPost && LS.hdPost.registerAnimatedUniform) {
      LS.hdPost.registerAnimatedUniform(uniforms);
    }

    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      side: side || THREE.DoubleSide,
      vertexShader: [
        'varying vec2 vUv;',
        'varying vec3 vWorldPos;',
        'void main() {',
        '  vUv = uv;',
        '  vec4 wp = modelMatrix * vec4(position, 1.0);',
        '  vWorldPos = wp.xyz;',
        '  gl_Position = projectionMatrix * viewMatrix * wp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform float uTimeMode;',
        'uniform float uOpacity;',
        'varying vec2 vUv;',
        'varying vec3 vWorldPos;',
        'float gWave(vec2 p) {',
        '  return sin(p.x * 1.4 + uTime * 1.15) * cos(p.y * 1.25 - uTime * 0.95)',
        '       + 0.45 * sin(p.x * 2.8 - p.y * 2.1 + uTime * 1.65);',
        '}',
        'void main() {',
        '  vec2 p = vWorldPos.xz * 0.52;',
        '  float w1 = gWave(p + vec2(0.0, uTime * 0.36));',
        '  float w2 = gWave(p * 1.55 - vec2(uTime * 0.25, -uTime * 0.48));',
        '  // Cel-quantized painterly Ghibli water bands!',
        '  float band = smoothstep(-0.35, 0.35, w1 * 0.65 + w2 * 0.45);',
        '  float celBand = floor(band * 3.0 + 0.35) / 3.0;',
        '  vec3 deepCol = uTimeMode > 1.5 ? vec3(0.08, 0.20, 0.34) : (uTimeMode > 0.5 ? vec3(0.16, 0.36, 0.46) : vec3(0.12, 0.48, 0.58));',
        '  vec3 midCol  = uTimeMode > 1.5 ? vec3(0.15, 0.32, 0.48) : (uTimeMode > 0.5 ? vec3(0.32, 0.56, 0.60) : vec3(0.22, 0.68, 0.74));',
        '  vec3 litCol  = uTimeMode > 1.5 ? vec3(0.26, 0.44, 0.64) : (uTimeMode > 0.5 ? vec3(0.95, 0.74, 0.50) : vec3(0.52, 0.87, 0.90));',
        '  vec3 col = mix(deepCol, midCol, clamp(celBand * 1.1, 0.0, 1.0));',
        '  float sparkle = step(0.88, w1 * 0.58 + w2 * 0.55);',
        '  col = mix(col, litCol, sparkle * (uTimeMode > 1.5 ? 0.35 : 0.65));',
        '  // Crisp painterly white shoreline foam ribbons',
        '  float edge = smoothstep(0.10, 0.0, min(vUv.x, 1.0 - vUv.x));',
        '  float foam = edge * step(0.25, 0.55 + 0.45 * sin(vWorldPos.z * 2.2 + uTime * 1.8));',
        '  col = mix(col, vec3(0.96, 0.98, 0.97), foam * 0.62);',
        '  gl_FragColor = vec4(clamp(col, 0.0, 0.95), uOpacity);',
        '}'
      ].join('\n')
    });
  }

  LS.ghibli = {
    QUALITY_PRESETS: QUALITY_PRESETS,
    isTouchOrPhone: isTouchOrPhone,
    detectDefaultQuality: function () {
      return isTouchOrPhone() ? 'balanced' : 'high';
    },
    getQualityConfig: function (q) {
      const key = q || (LS.state && LS.state.quality) || 'balanced';
      return QUALITY_PRESETS[key] || QUALITY_PRESETS.balanced;
    },
    getToonRamp: getToonRamp,
    getLeafBrushTexture: getLeafBrushTexture,
    getBarkTexture: getBarkTexture,
    createGhibliMat: createGhibliMat,
    addLeafClusters: addLeafClusters,
    buildGhibliTree: buildGhibliTree,
    buildOrangeTree: buildOrangeTree,
    createWaterJetArc: createWaterJetArc,
    createGhibliWaterMat: createGhibliWaterMat
  };
})(window.LailaSalma);
