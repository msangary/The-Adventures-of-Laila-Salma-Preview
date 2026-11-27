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

  const leafCutoutCache = {};
  function getLeafCutoutTexture(style) {
    const key = style || 'leaf';
    if (leafCutoutCache[key]) return leafCutoutCache[key];
    const S = 512;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, S, S);

    const isSakura = key === 'sakura';
    let seed = isSakura ? 9137 : 6311;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

    function drawPaintedLeaf(cx, cy, len, wid, ang, fillCol, veinCol) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.fillStyle = fillCol;
      ctx.beginPath();
      ctx.moveTo(0, -len * 0.55);
      ctx.bezierCurveTo(wid, -len * 0.25, wid * 0.95, len * 0.30, 0, len * 0.55);
      ctx.bezierCurveTo(-wid * 0.95, len * 0.30, -wid, -len * 0.25, 0, -len * 0.55);
      ctx.closePath();
      ctx.fill();
      if (veinCol) {
        ctx.strokeStyle = veinCol;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, -len * 0.42);
        ctx.lineTo(0, len * 0.42);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawSakuraCluster(cx, cy, r, ang, fillCol) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.fillStyle = fillCol;
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.52, r * 0.36, r * 0.56, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = 'rgba(255, 240, 178, 0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3 concentric Miyazaki leaf layers: deep interior -> lush mid -> crisp sunlit rim leaves!
    const total = isSakura ? 34 : 38;
    for (let i = 0; i < total; i++) {
      const layer = i < 12 ? 0 : (i < 26 ? 1 : 2);
      const a = (i / total) * Math.PI * 2 + rnd() * 0.55;
      const rad = (layer === 0 ? (15 + rnd() * 75) : (layer === 1 ? (68 + rnd() * 98) : (120 + rnd() * 78)));
      const lx = S * 0.5 + Math.cos(a) * rad;
      const ly = S * 0.5 + Math.sin(a) * rad;
      if (isSakura) {
        const col = layer === 0 ? '#d8d0d4' : (layer === 1 ? '#f0eaec' : '#ffffff');
        drawSakuraCluster(lx, ly, 36 + rnd() * 24, a + rnd(), col);
      } else {
        const col = layer === 0 ? '#b2b8b0' : (layer === 1 ? '#dcded8' : '#ffffff');
        const vein = layer === 2 ? 'rgba(255,255,255,0.55)' : 'rgba(130,145,128,0.35)';
        const len = 72 + rnd() * 44;
        const wid = 26 + rnd() * 18;
        drawPaintedLeaf(lx, ly, len, wid, a + Math.PI * 0.5 + (rnd() - 0.5) * 0.65, col, vein);
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    leafCutoutCache[key] = tex;
    return tex;
  }

  let cachedCrossCardGeo = null;
  function getCrossLeafCardGeo() {
    if (cachedCrossCardGeo) return cachedCrossCardGeo;
    // Two softly intersecting angled leaf-sprig planes so foliage looks rich from EVERY camera angle!
    const p1 = new THREE.PlaneGeometry(1.0, 1.0);
    const p2 = new THREE.PlaneGeometry(1.0, 1.0);
    p2.rotateY(Math.PI * 0.5);
    p2.rotateZ(0.18);
    const pos1 = p1.attributes.position.array;
    const pos2 = p2.attributes.position.array;
    const uv1 = p1.attributes.uv.array;
    const uv2 = p2.attributes.uv.array;
    const norm1 = p1.attributes.normal.array;
    const norm2 = p2.attributes.normal.array;
    const idx1 = p1.index.array;
    const idx2 = p2.index.array;
    const mergedPos = new Float32Array(pos1.length + pos2.length);
    mergedPos.set(pos1, 0); mergedPos.set(pos2, pos1.length);
    const mergedUv = new Float32Array(uv1.length + uv2.length);
    mergedUv.set(uv1, 0); mergedUv.set(uv2, uv1.length);
    const mergedNorm = new Float32Array(norm1.length + norm2.length);
    mergedNorm.set(norm1, 0); mergedNorm.set(norm2, norm1.length);
    const vOff = pos1.length / 3;
    const mergedIdx = new Uint16Array(idx1.length + idx2.length);
    mergedIdx.set(idx1, 0);
    for (let i = 0; i < idx2.length; i++) mergedIdx[idx1.length + i] = idx2[i] + vOff;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(mergedUv, 2));
    geo.setIndex(new THREE.BufferAttribute(mergedIdx, 1));
    cachedCrossCardGeo = geo;
    return geo;
  }

  const leafCardMatCache = {};
  const leafCardGeoCache = {};
  function getLeafCardMat(style, hex) {
    const k = (style || 'leaf') + '_' + hex;
    if (!leafCardMatCache[k]) {
      // Gentle warm sunlit translucency so alpha-cutout Miyazaki leaf silhouettes glow instead of turning gray in shadow!
      leafCardMatCache[k] = createGhibliMat(hex, {
        map: getLeafCutoutTexture(style),
        alphaTest: 0.38,
        side: THREE.DoubleSide,
        emissive: hex,
        emissiveIntensity: 0.14
      });
    }
    return leafCardMatCache[k];
  }

  function addLeafCardShell(group, centers, opts) {
    const cfg = Object.assign({
      sunHex: 0x98e26e,
      midHex: 0x52a84a,
      shadeHex: 0x2d6e36,
      style: 'leaf',
      cardsPerCluster: 4,
      cardScale: 1.38,
      cacheKey: null
    }, opts || {});

    const mats = {
      sun: getLeafCardMat(cfg.style, cfg.sunHex),
      mid: getLeafCardMat(cfg.style, cfg.midHex),
      shade: getLeafCardMat(cfg.style, cfg.shadeHex)
    };

    let builtGeos = cfg.cacheKey ? leafCardGeoCache[cfg.cacheKey] : null;
    if (!builtGeos) {
      const baseGeo = getCrossLeafCardGeo();
      const bPos = baseGeo.attributes.position.array;
      const bNorm = baseGeo.attributes.normal.array;
      const bUv = baseGeo.attributes.uv.array;
      const bIdx = baseGeo.index.array;
      const vCount = bPos.length / 3;

      const buckets = {
        sun: { pos: [], norm: [], uv: [], idx: [], vOff: 0 },
        mid: { pos: [], norm: [], uv: [], idx: [], vOff: 0 },
        shade: { pos: [], norm: [], uv: [], idx: [], vOff: 0 }
      };
      const m4 = new THREE.Matrix4();
      const nMat = new THREE.Matrix3();
      const dummyPos = new THREE.Vector3();
      const dummyScale = new THREE.Vector3();
      const dummyEuler = new THREE.Euler();
      const dummyQuat = new THREE.Quaternion();
      const tv = new THREE.Vector3();

      (centers || []).forEach((c, idx) => {
        const r = c[3] || 1.0;
        const baseTone = (c[7] === 'sun') ? 'sun' : ((c[7] === 'shade') ? 'shade' : 'mid');
        for (let k = 0; k < cfg.cardsPerCluster; k++) {
          const ang = (k / cfg.cardsPerCluster) * Math.PI * 2 + idx * 1.13;
          const lift = (k === 0 ? 0.42 : (k === 1 ? 0.14 : -0.18)) * r;
          const rad = (k === 0 ? 0.18 : 0.64) * r;
          const tone = (k === 0 && baseTone !== 'shade') ? 'sun' : baseTone;
          const bk = buckets[tone];

          dummyPos.set(c[0] + Math.cos(ang) * rad, c[1] + lift, c[2] + Math.sin(ang) * rad);
          const sc = r * cfg.cardScale * (k === 0 ? 1.08 : (k === 1 ? 0.96 : 0.90));
          dummyScale.set(sc, sc * 0.92, sc);
          dummyEuler.set(((idx + k) % 3 - 1) * 0.30, ang + idx * 0.72, (((idx * 3 + k) % 3) - 1) * 0.24);
          dummyQuat.setFromEuler(dummyEuler);
          m4.compose(dummyPos, dummyQuat, dummyScale);
          nMat.getNormalMatrix(m4);

          for (let v = 0; v < vCount; v++) {
            tv.set(bPos[v * 3], bPos[v * 3 + 1], bPos[v * 3 + 2]).applyMatrix4(m4);
            bk.pos.push(tv.x, tv.y, tv.z);
            tv.set(bNorm[v * 3], bNorm[v * 3 + 1], bNorm[v * 3 + 2]).applyMatrix3(nMat).normalize();
            bk.norm.push(tv.x, tv.y, tv.z);
            bk.uv.push(bUv[v * 2], bUv[v * 2 + 1]);
          }
          for (let i = 0; i < bIdx.length; i++) bk.idx.push(bIdx[i] + bk.vOff);
          bk.vOff += vCount;
        }
      });

      builtGeos = {};
      ['shade', 'mid', 'sun'].forEach(tone => {
        const bk = buckets[tone];
        if (bk.pos.length === 0) return;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(bk.pos, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(bk.norm, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(bk.uv, 2));
        geo.setIndex(bk.idx);
        builtGeos[tone] = geo;
      });
      if (cfg.cacheKey) leafCardGeoCache[cfg.cacheKey] = builtGeos;
    }

    ['shade', 'mid', 'sun'].forEach(tone => {
      if (!builtGeos[tone]) return;
      const mesh = new THREE.Mesh(builtGeos[tone], mats[tone]);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      group.add(mesh);
    });
  }

  // =========================================================================
  // NEXT-GEN STUDIO GHIBLI SHARED ASSET LOADER, UNIFORMS, SKIN SHADER & OUTLINES
  // =========================================================================
  const PAINTED_PATHS = {
    sky: 'assets/ghibli_showcase/sky_panorama.jpg',
    cobble: 'assets/ghibli_showcase/stone_cobble.jpg',
    plaster: 'assets/ghibli_showcase/plaster_wall.jpg',
    roof: 'assets/ghibli_showcase/terracotta_roof.jpg',
    meadow: 'assets/ghibli_showcase/meadow_ground.jpg',
    bark: 'assets/ghibli_showcase/bark_ghibli.jpg',
    sakuraBough: 'assets/ghibli_showcase/sakura_bough.png',
    leafBough: 'assets/ghibli_showcase/leaf_bough.png',
    woodFloor: 'assets/ghibli_showcase/wood_floor_ghibli.jpg',
    wovenRug: 'assets/ghibli_showcase/woven_rug_ghibli.jpg',
    pottedLemon: 'assets/ghibli_showcase/potted_lemon.png',
    pottedFlowers: 'assets/ghibli_showcase/potted_flowers.png',
    lailaFace: 'assets/ghibli_showcase/portraits/laila_face.jpg',
    lailaFaceBlink: 'assets/ghibli_showcase/portraits/laila_face_blink.jpg',
    salmaFace: 'assets/ghibli_showcase/portraits/salma_face.jpg',
    salmaFaceBlink: 'assets/ghibli_showcase/portraits/salma_face_blink.jpg',
    momFace: 'assets/ghibli_showcase/portraits/mom_face.jpg',
    momFaceBlink: 'assets/ghibli_showcase/portraits/mom_face_blink.jpg',
    dadFace: 'assets/ghibli_showcase/portraits/dad_face.jpg',
    dadFaceBlink: 'assets/ghibli_showcase/portraits/dad_face_blink.jpg',
    gedoMahmoudFace: 'assets/ghibli_showcase/portraits/gedo_mahmoud_face.jpg',
    gedoMahmoudFaceBlink: 'assets/ghibli_showcase/portraits/gedo_mahmoud_face_blink.jpg',
    nanaOmaimaFace: 'assets/ghibli_showcase/portraits/nana_omaima_face.jpg',
    nanaOmaimaFaceBlink: 'assets/ghibli_showcase/portraits/nana_omaima_face_blink.jpg',
    biboFace: 'assets/ghibli_showcase/portraits/bibo_face.jpg',
    biboFaceBlink: 'assets/ghibli_showcase/portraits/bibo_face_blink.jpg',
    nouziFace: 'assets/ghibli_showcase/portraits/nouzi_face.jpg',
    nouziFaceBlink: 'assets/ghibli_showcase/portraits/nouzi_face_blink.jpg',
    maiFace: 'assets/ghibli_showcase/portraits/mai_face.jpg',
    maiFaceBlink: 'assets/ghibli_showcase/portraits/mai_face_blink.jpg'
  };
  const CLAMP_KEYS = {
    sakuraBough: true, leafBough: true, wovenRug: true,
    pottedLemon: true, pottedFlowers: true,
    lailaFace: true, lailaFaceBlink: true, salmaFace: true, salmaFaceBlink: true,
    momFace: true, momFaceBlink: true, dadFace: true, dadFaceBlink: true,
    gedoMahmoudFace: true, gedoMahmoudFaceBlink: true,
    nanaOmaimaFace: true, nanaOmaimaFaceBlink: true,
    biboFace: true, biboFaceBlink: true,
    nouziFace: true, nouziFaceBlink: true,
    maiFace: true, maiFaceBlink: true
  };
  const paintedTexCache = {};
  let sharedTexLoader = null;

  function getPaintedTex(key, rx, ry) {
    const path = PAINTED_PATHS[key];
    if (!path) return null;
    const ck = key + '_' + (rx || 1) + '_' + (ry || 1);
    if (paintedTexCache[ck]) return paintedTexCache[ck];
    if (!sharedTexLoader) sharedTexLoader = new THREE.TextureLoader();
    const baseKey = key + '_1_1';
    let t;
    if ((rx && rx !== 1 || ry && ry !== 1) && paintedTexCache[baseKey]) {
      t = paintedTexCache[baseKey].clone();
      t.needsUpdate = true;
    } else {
      t = sharedTexLoader.load(path);
    }
    if (CLAMP_KEYS[key]) {
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
    } else {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = (key === 'sky') ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
    }
    if (rx || ry) t.repeat.set(rx || 1, ry || 1);
    t.anisotropy = LS.maxAnisotropy || 8;
    paintedTexCache[ck] = t;
    return t;
  }

  const GLOBAL = {
    uTime: { value: 0.0 },
    uSunDir: { value: new THREE.Vector3(22, 38, 18).normalize() },
    uSunCol: { value: new THREE.Color(0xfff5dc) },
    uShadowTint: { value: new THREE.Color(0x6e84c2) },
    uRimCol: { value: new THREE.Color(0xffe7a8) },
    uRimStrength: { value: 0.42 },
    uFogCol: { value: new THREE.Color(0xc8ecfb) },
    uFogDensity: { value: 0.0045 },
    uTimeMode: { value: 0.0 }
  };

  const outlineMatCache = {};
  function addInkOutline(mesh, scaleBoost, hex) {
    if (!mesh || !mesh.geometry) return null;
    const k = hex || 0x3b241c;
    if (!outlineMatCache[k]) {
      outlineMatCache[k] = new THREE.MeshBasicMaterial({ color: k, side: THREE.BackSide });
    }
    const om = new THREE.Mesh(mesh.geometry, outlineMatCache[k]);
    const s = 1 + (scaleBoost || 0.024);
    om.scale.set(s, s, s);
    om.castShadow = false;
    om.receiveShadow = false;
    om.userData.isOutline = true;
    om.userData.noCamClip = true;
    mesh.add(om);
    return om;
  }

  // Luminous Miyazaki Cel-Anime Skin Shader (warm cel-fill eliminates dark chin shadows & matches photo faces seamlessly!)
  function createGhibliSkinMat(colorHex, mapTex) {
    const col = new THREE.Color(colorHex !== undefined ? colorHex : 0xffffff);
    const mat = new THREE.MeshStandardMaterial({
      color: col.clone().multiplyScalar(0.86),
      map: mapTex || null,
      emissive: mapTex ? new THREE.Color(0xffffff) : col.clone(),
      emissiveMap: mapTex || null,
      emissiveIntensity: 0.25,
      roughness: 0.86,
      metalness: 0.0
    });
    mat.onBeforeCompile = function (shader) {
      shader.uniforms.uSunDir = GLOBAL.uSunDir;
      shader.uniforms.uRimCol = GLOBAL.uRimCol;
      shader.uniforms.uRimStr = GLOBAL.uRimStrength;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vSkinWPos;\nvarying vec3 vSkinWNorm;')
        .replace('#include <worldpos_vertex>', [
          '#include <worldpos_vertex>',
          'vSkinWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
          'vSkinWNorm = normalize(mat3(modelMatrix) * objectNormal);'
        ].join('\n'));
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', [
          '#include <common>',
          'uniform vec3 uSunDir; uniform vec3 uRimCol; uniform float uRimStr;',
          'varying vec3 vSkinWPos; varying vec3 vSkinWNorm;'
        ].join('\n'))
        .replace('#include <dithering_fragment>', [
          'vec3 nW = normalize(vSkinWNorm);',
          'vec3 vDir = normalize(cameraPosition - vSkinWPos);',
          'float ndl = dot(nW, normalize(uSunDir));',
          'float cel = smoothstep(-0.55, 0.15, ndl);',
          'gl_FragColor.rgb = mix(gl_FragColor.rgb * vec3(0.98, 0.92, 0.89), gl_FragColor.rgb * vec3(1.00, 0.99, 0.97), cel);',
          'float fres = pow(1.0 - max(0.0, dot(nW, vDir)), 3.6);',
          'gl_FragColor.rgb += uRimCol * fres * smoothstep(-0.2, 0.6, ndl) * uRimStr * 0.16;',
          '#include <dithering_fragment>'
        ].join('\n'));
    };
    return mat;
  }

  // Hand-Painted Botanical Bough Wind Shader (Miyazaki sakura & leafy boughs with cavity AO!)
  const boughMatCache = {};
  function getPaintedBoughMat(kind) {
    const k = kind || 'green';
    if (boughMatCache[k]) return boughMatCache[k];
    const specs = {
      sakura:  { tex: 'sakuraBough', sun: 0xfff0f5, shade: 0x8d638e, warm: 0xffd5e4 },
      camphor: { tex: 'leafBough',   sun: 0xd8f594, shade: 0x3b6e68, warm: 0xa8d87a },
      green:   { tex: 'leafBough',   sun: 0xd8f594, shade: 0x3b6e68, warm: 0xa8d87a },
      olive:   { tex: 'leafBough',   sun: 0xdbe6b8, shade: 0x5c746e, warm: 0xaab890 },
      cypress: { tex: 'leafBough',   sun: 0x79b87a, shade: 0x26484e, warm: 0x4b8760 },
      gold:    { tex: 'leafBough',   sun: 0xfff099, shade: 0x9c6230, warm: 0xf4c452 },
      maple:   { tex: 'leafBough',   sun: 0xffb870, shade: 0x7d2926, warm: 0xe66242 }
    };
    const sp = specs[k] || specs.green;
    const mat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uMap: { value: getPaintedTex(sp.tex, 1, 1) },
        uSunTint: { value: new THREE.Color(sp.sun) },
        uShadeTint: { value: new THREE.Color(sp.shade) },
        uWarmTint: { value: new THREE.Color(sp.warm) },
        uSunDir: GLOBAL.uSunDir,
        uTime: GLOBAL.uTime,
        uTimeMode: GLOBAL.uTimeMode,
        uRimCol: GLOBAL.uRimCol,
        uRimStr: GLOBAL.uRimStrength,
        uFogCol: GLOBAL.uFogCol,
        uFogDensity: GLOBAL.uFogDensity
      },
      vertexShader: [
        'attribute float aAO;',
        'uniform float uTime;',
        'varying vec2 vUv;',
        'varying vec3 vSmoothNorm;',
        'varying vec3 vWPos;',
        'varying float vAO;',
        'void main() {',
        '  vUv = uv;',
        '  vAO = aAO;',
        '  vec4 wp = modelMatrix * vec4(position, 1.0);',
        '  float flex = clamp(vAO, 0.25, 1.0);',
        '  float gust = sin(uTime * 1.65 + wp.x * 0.45 + wp.z * 0.40) * 0.075 * flex;',
        '  float flut = sin(uTime * 3.6 + wp.y * 2.0 + wp.x * 1.4) * 0.022 * flex;',
        '  wp.x += gust + flut;',
        '  wp.y += cos(uTime * 1.35 + wp.z * 0.8) * 0.026 * flex;',
        '  vWPos = wp.xyz;',
        '  vSmoothNorm = normalize(mat3(modelMatrix) * normal);',
        '  gl_Position = projectionMatrix * viewMatrix * wp;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D uMap;',
        'uniform vec3 uSunTint;',
        'uniform vec3 uShadeTint;',
        'uniform vec3 uWarmTint;',
        'uniform vec3 uSunDir;',
        'uniform float uTimeMode;',
        'uniform vec3 uRimCol;',
        'uniform float uRimStr;',
        'uniform vec3 uFogCol;',
        'uniform float uFogDensity;',
        'varying vec2 vUv;',
        'varying vec3 vSmoothNorm;',
        'varying vec3 vWPos;',
        'varying float vAO;',
        'void main() {',
        '  vec4 tex = texture2D(uMap, vUv);',
        '  if (tex.a < 0.45) discard;',
        '  vec3 nW = normalize(vSmoothNorm);',
        '  float ndl = dot(nW, normalize(uSunDir));',
        '  float sunBand = smoothstep(-0.32, 0.42, ndl);',
        '  float topSun = smoothstep(0.28, 0.78, ndl);',
        '  vec3 lightCol = mix(uShadeTint, uWarmTint, sunBand);',
        '  lightCol = mix(lightCol, uSunTint, topSun * 0.65);',
        '  float ao = mix(0.56, 1.08, clamp(vAO, 0.0, 1.0));',
        '  vec3 col = tex.rgb * lightCol * ao;',
        '  vec3 vDir = normalize(cameraPosition - vWPos);',
        '  float rim = pow(1.0 - max(0.0, dot(nW, vDir)), 3.2) * smoothstep(-0.15, 0.65, ndl) * clamp(vAO, 0.0, 1.0);',
        '  col += uRimCol * rim * uRimStr * 0.28;',
        '  if (uTimeMode > 1.5) col *= vec3(0.42, 0.54, 0.84);',
        '  else if (uTimeMode > 0.5) col *= vec3(1.16, 0.84, 0.66);',
        '  col = col / (1.0 + col * 0.14);',
        '  float dist = length(cameraPosition - vWPos);',
        '  float fogF = 1.0 - exp(-pow(dist * uFogDensity, 2.0));',
        '  col = mix(col, uFogCol, clamp(fogF, 0.0, 0.72));',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    });
    boughMatCache[k] = mat;
    return mat;
  }

  function makeTaperedBranch(curve, segs, rBase, rTip, radialSegs) {
    const rS = radialSegs || 7;
    const geo = new THREE.TubeGeometry(curve, segs, 1.0, rS, false);
    const pos = geo.attributes.position;
    const ringSize = rS + 1;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const center = curve.getPointAt(t);
      const rad = rBase + (rTip - rBase) * Math.pow(t, 0.85);
      for (let j = 0; j < ringSize; j++) {
        const idx = i * ringSize + j;
        pos.setXYZ(
          idx,
          center.x + (pos.getX(idx) - center.x) * rad,
          center.y + (pos.getY(idx) - center.y) * rad,
          center.z + (pos.getZ(idx) - center.z) * rad
        );
      }
    }
    geo.computeVertexNormals();
    return geo;
  }

  let sharedBarkMat = null;
  let treeSeedCounter = 1;
  // Next-Gen Studio Ghibli Multi-Species Botanical Tree (curving mossy bark + forked limbs + painted bough cards!)
  function buildGhibliTree(kind, scale) {
    const s = scale || 1.0;
    const g = new THREE.Group();
    if (!sharedBarkMat) {
      sharedBarkMat = createGhibliMat(0xd4b69e, { map: getPaintedTex('bark', 1.5, 2.6) });
    }
    const barkMat = sharedBarkMat;
    let seed = (treeSeedCounter++ * 7919 + (kind ? kind.charCodeAt(0) * 31 : 17)) % 99991 + 17;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

    const posArr = [], normArr = [], uvArr = [], aoArr = [], idxArr = [];
    let vOff = 0;
    const basePlane = new THREE.PlaneGeometry(1.0, 1.0);
    const bp = basePlane.attributes.position.array;
    const bu = basePlane.attributes.uv.array;
    const bi = basePlane.index.array;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), eu = new THREE.Euler();
    const vTmp = new THREE.Vector3(), nLoc = new THREE.Vector3(), nCrown = new THREE.Vector3();

    const qCfg = LS.ghibli ? LS.ghibli.getQualityConfig() : QUALITY_PRESETS.high;
    const densityScale = qCfg.id === 'lite' ? 0.55 : (qCfg.id === 'balanced' ? 0.78 : 1.0);

    function addBoughPad(cx, cy, cz, rx, ry, rz, cardCount, cardScale, crownRef, droop) {
      const cnt = Math.max(5, Math.round(cardCount * densityScale));
      const padCenter = new THREE.Vector3(cx, cy, cz);
      for (let k = 0; k < cnt; k++) {
        const u = (k + 0.5) / cnt;
        const phi = Math.acos(1 - 2 * u);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (k + cx * 3.1 + cz * 2.7);
        const shellR = 0.34 + 0.66 * Math.pow(rnd(), 0.55);
        const px = cx + Math.sin(phi) * Math.cos(theta) * rx * shellR;
        const py = cy + Math.cos(phi) * ry * shellR - (droop ? Math.sin(phi) * droop * shellR : 0);
        const pz = cz + Math.sin(phi) * Math.sin(theta) * rz * shellR;
        const sz = cardScale * (0.78 + rnd() * 0.42);
        const outDir = new THREE.Vector3(px - cx, (py - cy) * 1.1 + 0.2, pz - cz).normalize();
        const yaw = Math.atan2(outDir.x, outDir.z) + (rnd() - 0.5) * 1.1;
        const pitch = -0.35 + (rnd() - 0.5) * 0.72;
        const roll = (rnd() - 0.5) * Math.PI * 1.2;
        eu.set(pitch, yaw, roll);
        q.setFromEuler(eu);
        m4.compose(new THREE.Vector3(px, py, pz), q, new THREE.Vector3(sz, sz, sz));

        nCrown.set(px - crownRef.x, (py - crownRef.y) * 1.35 + 0.32, pz - crownRef.z).normalize();
        nLoc.set(px - padCenter.x, (py - padCenter.y) * 1.2 + 0.15, pz - padCenter.z).normalize();
        nCrown.lerp(nLoc, 0.35).normalize();
        const ao = Math.min(1.0, Math.max(0.18, 0.24 + shellR * 0.58 + Math.max(0, nCrown.y) * 0.28));

        for (let v = 0; v < 4; v++) {
          vTmp.set(bp[v * 3], bp[v * 3 + 1], bp[v * 3 + 2]).applyMatrix4(m4);
          posArr.push(vTmp.x, vTmp.y, vTmp.z);
          normArr.push(nCrown.x, nCrown.y, nCrown.z);
          uvArr.push(bu[v * 2], bu[v * 2 + 1]);
          aoArr.push(ao);
        }
        for (let t = 0; t < bi.length; t++) idxArr.push(vOff + bi[t]);
        vOff += 4;
      }
    }

    if (kind === 'cypress') {
      const tCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.06, 2.2, -0.05),
        new THREE.Vector3(-0.04, 4.8, 0.04),
        new THREE.Vector3(0.02, 6.8, 0)
      ]);
      const trMesh = new THREE.Mesh(makeTaperedBranch(tCurve, 10, 0.30, 0.06, 7), barkMat);
      trMesh.castShadow = true; trMesh.receiveShadow = true; g.add(trMesh);
      const crownRef = new THREE.Vector3(0, 4.2, 0);
      for (let l = 0; l < 6; l++) {
        const y = 1.65 + l * 0.96;
        const rad = Math.sin(((l + 0.65) / 6.8) * Math.PI) * 0.95 + 0.22;
        addBoughPad((rnd() - 0.5) * 0.12, y, (rnd() - 0.5) * 0.12, rad, 0.72, rad, 11, 1.28 - l * 0.07, crownRef, 0.06);
      }
    } else {
      const isSak = (kind === 'sakura');
      const leanX = (rnd() - 0.5) * 0.52;
      const leanZ = (rnd() - 0.5) * 0.48;
      const trunkH = isSak ? 2.55 : 2.95;
      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(leanX * 0.35, trunkH * 0.38, leanZ * 0.35),
        new THREE.Vector3(leanX * 0.85, trunkH * 0.74, leanZ * 0.85),
        new THREE.Vector3(leanX, trunkH, leanZ)
      ]);
      const trMesh = new THREE.Mesh(makeTaperedBranch(trunkCurve, 10, 0.44, 0.22, 8), barkMat);
      trMesh.castShadow = true; trMesh.receiveShadow = true; g.add(trMesh);

      // Flared organic surface roots gripping the soil!
      for (let r = 0; r < 5; r++) {
        const ra = (r / 5) * Math.PI * 2 + rnd() * 0.4;
        const rCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.cos(ra) * 0.16, 0.72, Math.sin(ra) * 0.16),
          new THREE.Vector3(Math.cos(ra) * 0.48, 0.24, Math.sin(ra) * 0.48),
          new THREE.Vector3(Math.cos(ra) * 0.82, -0.04, Math.sin(ra) * 0.82)
        ]);
        const rm = new THREE.Mesh(makeTaperedBranch(rCurve, 6, 0.18, 0.06, 6), barkMat);
        rm.castShadow = true; g.add(rm);
      }

      const crownRef = new THREE.Vector3(leanX * 0.7, trunkH + 1.4, leanZ * 0.7);
      const limbCount = 5;
      for (let b = 0; b < limbCount; b++) {
        const ba = (b / limbCount) * Math.PI * 2 + rnd() * 0.45;
        const reach = (isSak ? 2.55 : 2.25) + rnd() * 0.65;
        const lift = (isSak ? 1.48 : 1.85) + rnd() * 0.62;
        const startPt = trunkCurve.getPointAt(0.72 + (b % 3) * 0.12);
        const midPt = new THREE.Vector3(
          startPt.x + Math.cos(ba) * reach * 0.56,
          startPt.y + lift * 0.64,
          startPt.z + Math.sin(ba) * reach * 0.56
        );
        const endPt = new THREE.Vector3(
          startPt.x + Math.cos(ba) * reach,
          startPt.y + lift,
          startPt.z + Math.sin(ba) * reach
        );
        const limbCurve = new THREE.CatmullRomCurve3([startPt, midPt, endPt]);
        const lm = new THREE.Mesh(makeTaperedBranch(limbCurve, 7, 0.16, 0.055, 6), barkMat);
        lm.castShadow = true; g.add(lm);

        addBoughPad(
          endPt.x, endPt.y + (isSak ? 0.12 : 0.25), endPt.z,
          isSak ? 1.55 : 1.38, isSak ? 0.85 : 0.96, isSak ? 1.50 : 1.34,
          15, isSak ? 1.82 : 1.72, crownRef, isSak ? 0.22 : 0.06
        );
      }

      // Upper sunlit crown cap
      const topPt = trunkCurve.getPointAt(1.0);
      addBoughPad(
        topPt.x + (rnd() - 0.5) * 0.4, topPt.y + (isSak ? 1.65 : 1.85), topPt.z + (rnd() - 0.5) * 0.4,
        isSak ? 1.72 : 1.60, isSak ? 0.82 : 1.0, isSak ? 1.68 : 1.55,
        15, isSak ? 1.85 : 1.75, crownRef, isSak ? 0.14 : 0.05
      );
    }

    const canopyGeo = new THREE.BufferGeometry();
    canopyGeo.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
    canopyGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normArr, 3));
    canopyGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvArr, 2));
    canopyGeo.setAttribute('aAO', new THREE.Float32BufferAttribute(aoArr, 1));
    canopyGeo.setIndex(idxArr);
    const canopyMesh = new THREE.Mesh(canopyGeo, getPaintedBoughMat(kind));
    canopyMesh.userData.noCamClip = true;
    g.add(canopyMesh);

    g.scale.setScalar(s);
    return g;
  }

  // Hand-Painted 3D Studio Ghibli Potted Plants (Sculpted Terracotta Pot + Botanical Sprite Cards!)
  const pottedPlantSway = [];
  let sharedPotGeo = null;
  let sharedSoilMat = null;
  let sharedPotLemonMat = null;
  let sharedPotFlowerMat = null;
  let sharedPotTimberMat = null;

  function ensurePotAssets() {
    if (!sharedPotGeo) {
      const potPts = [
        new THREE.Vector2(0.001, 0.0),
        new THREE.Vector2(0.24, 0.0),
        new THREE.Vector2(0.27, 0.14),
        new THREE.Vector2(0.34, 0.38),
        new THREE.Vector2(0.36, 0.48),
        new THREE.Vector2(0.41, 0.51),
        new THREE.Vector2(0.41, 0.58),
        new THREE.Vector2(0.35, 0.59),
        new THREE.Vector2(0.32, 0.52)
      ];
      sharedPotGeo = new THREE.LatheGeometry(potPts, 20);
      sharedSoilMat = createGhibliMat(0x4b3322);
      sharedPotTimberMat = createGhibliMat(0x6e472d, { map: getPaintedTex('bark', 1, 1.5) });
      sharedPotLemonMat = new THREE.MeshStandardMaterial({
        map: getPaintedTex('pottedLemon', 1, 1),
        alphaTest: 0.44, side: THREE.DoubleSide, roughness: 0.74, metalness: 0.0
      });
      sharedPotFlowerMat = new THREE.MeshStandardMaterial({
        map: getPaintedTex('pottedFlowers', 1, 1),
        alphaTest: 0.44, side: THREE.DoubleSide, roughness: 0.76, metalness: 0.0
      });
    }
  }

  function buildPaintedPottedPlant(kind, scale, opts) {
    ensurePotAssets();
    const s = scale || 1.0;
    const cfg = opts || {};
    const pg = new THREE.Group();
    const potMat = createGhibliMat(cfg.potHex !== undefined ? cfg.potHex : 0xc9623f, { map: getPaintedTex('plaster', 1, 1) });
    const pot = new THREE.Mesh(sharedPotGeo, potMat);
    pot.castShadow = true; pot.receiveShadow = true;
    addInkOutline(pot, 0.022);
    pg.add(pot);

    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.345, 0.018, 8, 20),
      createGhibliMat(cfg.bandHex !== undefined ? cfg.bandHex : 0xd97d56)
    );
    band.rotation.x = Math.PI / 2; band.position.y = 0.42; pg.add(band);

    const soil = new THREE.Mesh(new THREE.CircleGeometry(0.33, 16), sharedSoilMat);
    soil.rotation.x = -Math.PI / 2; soil.position.y = 0.525; pg.add(soil);

    const foliageG = new THREE.Group();
    foliageG.position.y = 0.52;
    if (kind === 'lemon' || kind === 'citrus') {
      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.03, 0.34, 0.02),
        new THREE.Vector3(-0.02, 0.68, -0.01)
      ]);
      const trunk = new THREE.Mesh(new THREE.TubeGeometry(trunkCurve, 8, 0.048, 7, false), sharedPotTimberMat);
      trunk.castShadow = true; foliageG.add(trunk);
      const cards = [
        { x: 0.0, y: 0.92, z: 0.0, ry: 0.0, rx: 0.05, sz: 1.24 },
        { x: 0.0, y: 0.94, z: 0.0, ry: Math.PI / 3, rx: -0.06, sz: 1.22 },
        { x: 0.0, y: 0.90, z: 0.0, ry: (2 * Math.PI) / 3, rx: 0.06, sz: 1.18 },
        { x: 0.14, y: 1.08, z: 0.08, ry: 0.55, rx: -0.18, sz: 0.88 },
        { x: -0.14, y: 1.05, z: -0.08, ry: -0.68, rx: 0.16, sz: 0.86 }
      ];
      cards.forEach(c => {
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(c.sz, c.sz), sharedPotLemonMat);
        pl.position.set(c.x, c.y, c.z);
        pl.rotation.set(c.rx, c.ry, 0);
        pl.userData.noCamClip = true;
        foliageG.add(pl);
      });
    } else {
      const cards = [
        { x: 0.0, y: 0.44, z: 0.0, ry: 0.0, rx: 0.08, sz: 1.08 },
        { x: 0.0, y: 0.46, z: 0.0, ry: Math.PI / 3, rx: -0.08, sz: 1.05 },
        { x: 0.0, y: 0.43, z: 0.0, ry: (2 * Math.PI) / 3, rx: 0.06, sz: 1.02 },
        { x: 0.0, y: 0.56, z: 0.04, ry: Math.PI / 6, rx: -0.22, sz: 0.78 }
      ];
      cards.forEach(c => {
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(c.sz, c.sz), sharedPotFlowerMat);
        pl.position.set(c.x, c.y, c.z);
        pl.rotation.set(c.rx, c.ry, 0);
        pl.userData.noCamClip = true;
        foliageG.add(pl);
      });
    }
    pg.add(foliageG);
    pottedPlantSway.push({ g: foliageG, phase: Math.random() * Math.PI * 2 });
    pg.scale.setScalar(s);
    return pg;
  }

  // Fill a rectangular terracotta flowerbox or stone planter with overlapping hand-painted flower/fern cards!
  function populateFlowerbox(parent, width, yBase, zOff, count) {
    ensurePotAssets();
    const n = count || Math.max(3, Math.round(width * 2.8));
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? (i / (n - 1) - 0.5) : 0;
      const fx = t * (width * 0.80);
      const sz = Math.min(0.88, Math.max(0.52, (width / n) * 1.65));
      const card = new THREE.Mesh(new THREE.PlaneGeometry(sz, sz), sharedPotFlowerMat);
      card.position.set(fx, yBase + sz * 0.34 + (i % 2) * 0.04, (zOff || 0) + (i % 2 === 0 ? 0.05 : -0.05));
      card.rotation.set(-0.12, t * 0.55 + (i % 2 === 0 ? 0.22 : -0.22), (i % 2 === 0 ? 0.06 : -0.06));
      card.userData.noCamClip = true;
      parent.add(card);
      const cross = new THREE.Mesh(new THREE.PlaneGeometry(sz * 0.92, sz * 0.92), sharedPotFlowerMat);
      cross.position.set(fx, yBase + sz * 0.32, zOff || 0);
      cross.rotation.set(0.08, Math.PI * 0.5 + (i % 2 === 0 ? 0.18 : -0.18), 0);
      cross.userData.noCamClip = true;
      parent.add(cross);
    }
  }

  // Backward-compatible buildOrangeTree upgraded to hand-painted botanical citrus pot!
  function buildOrangeTree(scale, opts) {
    const cfg = opts || {};
    const s = (scale || 1.0) * 1.82;
    return buildPaintedPottedPlant(cfg.fruitHex === null ? 'flowers' : 'lemon', s, {
      potHex: cfg.potHex !== undefined ? cfg.potHex : 0xc9623f,
      bandHex: cfg.bandHex !== undefined ? cfg.bandHex : (cfg.rimHex !== undefined ? cfg.rimHex : 0xd97d56)
    });
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

  // Next-Gen Studio Ghibli Reflective Voronoi Caustic Water Shader (Ponyo / Spirited Away palette!)
  function createGhibliWaterMat(opacity, side) {
    const op = opacity !== undefined ? opacity : 0.92;
    const uniforms = {
      uTime: GLOBAL.uTime,
      uTimeMode: GLOBAL.uTimeMode,
      uSunDir: GLOBAL.uSunDir,
      uOpacity: { value: op }
    };
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
        'uniform vec3 uSunDir;',
        'uniform float uOpacity;',
        'varying vec2 vUv;',
        'varying vec3 vWorldPos;',
        'vec2 hash22(vec2 p) {',
        '  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));',
        '  return fract(sin(p) * 43758.5453);',
        '}',
        'float voronoiCaustic(vec2 x, float t) {',
        '  vec2 n = floor(x); vec2 f = fract(x);',
        '  float md = 8.0;',
        '  for (int j = -1; j <= 1; j++) {',
        '    for (int i = -1; i <= 1; i++) {',
        '      vec2 g = vec2(float(i), float(j));',
        '      vec2 o = hash22(n + g);',
        '      o = 0.5 + 0.42 * sin(t * 1.45 + 6.2831 * o);',
        '      vec2 r = g + o - f;',
        '      md = min(md, dot(r, r));',
        '    }',
        '  }',
        '  return sqrt(md);',
        '}',
        'void main() {',
        '  vec2 p = vWorldPos.xz * 0.72;',
        '  float c1 = voronoiCaustic(p + vec2(uTime * 0.14, -uTime * 0.10), uTime);',
        '  float c2 = voronoiCaustic(p * 1.45 - vec2(uTime * 0.18, uTime * 0.12), uTime * 1.15);',
        '  float caustic = smoothstep(0.42, 0.84, c1 * 0.55 + c2 * 0.55);',
        '  vec3 deepCol = uTimeMode > 1.5 ? vec3(0.08, 0.22, 0.38) : (uTimeMode > 0.5 ? vec3(0.16, 0.36, 0.48) : vec3(0.11, 0.48, 0.62));',
        '  vec3 midCol  = uTimeMode > 1.5 ? vec3(0.16, 0.36, 0.56) : (uTimeMode > 0.5 ? vec3(0.36, 0.60, 0.66) : vec3(0.22, 0.72, 0.82));',
        '  vec3 litCol  = uTimeMode > 1.5 ? vec3(0.45, 0.68, 0.92) : (uTimeMode > 0.5 ? vec3(1.0, 0.80, 0.55) : vec3(0.70, 0.96, 1.0));',
        '  vec3 V = normalize(cameraPosition - vWorldPos);',
        '  vec3 N = normalize(vec3((c1 - c2) * 0.18, 1.0, (c2 - 0.5) * 0.16));',
        '  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.8);',
        '  vec3 col = mix(deepCol, midCol, clamp(0.45 + c1 * 0.45, 0.0, 1.0));',
        '  col = mix(col, litCol, caustic * (uTimeMode > 1.5 ? 0.35 : 0.62));',
        '  col = mix(col, litCol, fres * 0.36);',
        '  float edge = smoothstep(0.12, 0.0, min(vUv.x, 1.0 - vUv.x));',
        '  col = mix(col, vec3(0.96, 0.99, 1.0), edge * 0.52);',
        '  gl_FragColor = vec4(clamp(col, 0.0, 0.96), uOpacity);',
        '}'
      ].join('\n')
    });
  }

  function updateGhibliFrame(dt, elapsed) {
    GLOBAL.uTime.value = elapsed;
    for (let i = 0; i < pottedPlantSway.length; i++) {
      const pp = pottedPlantSway[i];
      if (!pp || !pp.g) continue;
      pp.g.rotation.z = Math.sin(elapsed * 1.85 + pp.phase) * 0.032;
      pp.g.rotation.x = Math.cos(elapsed * 1.45 + pp.phase) * 0.022;
    }
  }

  function clearWorldSway() {
    pottedPlantSway.length = 0;
  }

  function setTimeLighting(mode, sunPos, fogColor) {
    GLOBAL.uTimeMode.value = mode || 0.0;
    if (sunPos) GLOBAL.uSunDir.value.copy(sunPos).normalize();
    if (fogColor) GLOBAL.uFogCol.value.copy(fogColor);
    if (mode === 1) {
      GLOBAL.uShadowTint.value.setHex(0x7c5899);
      GLOBAL.uRimCol.value.setHex(0xffba6b);
    } else if (mode === 2) {
      GLOBAL.uShadowTint.value.setHex(0x32467c);
      GLOBAL.uRimCol.value.setHex(0x8cc2ff);
    } else {
      GLOBAL.uShadowTint.value.setHex(0x6e84c2);
      GLOBAL.uRimCol.value.setHex(0xffe7a8);
    }
  }

  LS.ghibli = {
    QUALITY_PRESETS: QUALITY_PRESETS,
    GLOBAL: GLOBAL,
    isTouchOrPhone: isTouchOrPhone,
    detectDefaultQuality: function () {
      return isTouchOrPhone() ? 'balanced' : 'high';
    },
    getQualityConfig: function (q) {
      const key = q || (LS.state && LS.state.quality) || 'balanced';
      return QUALITY_PRESETS[key] || QUALITY_PRESETS.balanced;
    },
    getToonRamp: getToonRamp,
    getPaintedTex: getPaintedTex,
    getLeafBrushTexture: getLeafBrushTexture,
    getLeafCutoutTexture: getLeafCutoutTexture,
    getBarkTexture: getBarkTexture,
    createGhibliMat: createGhibliMat,
    createGhibliSkinMat: createGhibliSkinMat,
    addInkOutline: addInkOutline,
    addLeafClusters: addLeafClusters,
    addLeafCardShell: addLeafCardShell,
    buildGhibliTree: buildGhibliTree,
    buildPaintedPottedPlant: buildPaintedPottedPlant,
    populateFlowerbox: populateFlowerbox,
    buildOrangeTree: buildOrangeTree,
    createWaterJetArc: createWaterJetArc,
    createGhibliWaterMat: createGhibliWaterMat,
    update: updateGhibliFrame,
    clearWorldSway: clearWorldSway,
    setTimeLighting: setTimeLighting
  };
})(window.LailaSalma);
