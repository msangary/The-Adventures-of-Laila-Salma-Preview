window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  const texCache = {};

  function finalizeTex(tex) {
    if (LS.isHD) {
      tex.anisotropy = LS.maxAnisotropy || 8;
    }
    return tex;
  }

  LS.makeToonMat = function (color, opts) {
    const cfg = Object.assign({ color: color }, opts || {});
    if (LS.ghibli && LS.ghibli.createGhibliMat) {
      return LS.ghibli.createGhibliMat(color, cfg);
    }
    if (LS.isHD) {
      const std = Object.assign({
        roughness: cfg.map ? 0.68 : 0.74,
        metalness: 0.04,
        envMapIntensity: 0.14
      }, cfg);
      if (cfg.map && !std.bumpMap) {
        std.bumpMap = cfg.map;
        std.bumpScale = 0.06;
      }
      return new THREE.MeshStandardMaterial(std);
    }
    delete cfg.roughness; delete cfg.metalness; delete cfg.bumpMap; delete cfg.bumpScale; delete cfg.envMapIntensity;
    return new THREE.MeshLambertMaterial(cfg);
  };

  LS.makeSurfaceMat = function (tex, opts) {
    const cfg = Object.assign({ map: tex }, opts || {});
    if (LS.ghibli && LS.ghibli.createGhibliMat) {
      return LS.ghibli.createGhibliMat(cfg.color !== undefined ? cfg.color : 0xffffff, Object.assign({
        bumpMap: tex,
        bumpScale: 0.032
      }, cfg));
    }
    if (LS.isHD) {
      const std = Object.assign({
        roughness: 0.80,
        metalness: 0.03,
        bumpMap: tex,
        bumpScale: 0.055,
        envMapIntensity: 0.12
      }, cfg);
      return new THREE.MeshStandardMaterial(std);
    }
    delete cfg.roughness; delete cfg.metalness; delete cfg.bumpMap; delete cfg.bumpScale; delete cfg.envMapIntensity;
    return new THREE.MeshLambertMaterial(cfg);
  };

  LS.makeWaterMat = function (opacity, side) {
    const op = opacity !== undefined ? opacity : 0.9;
    if (LS.ghibli && LS.ghibli.createGhibliWaterMat) {
      return LS.ghibli.createGhibliWaterMat(op, side || THREE.DoubleSide);
    }
    if (LS.isHD && LS.createAAAWaterMaterial) {
      return LS.createAAAWaterMaterial(op, side || THREE.DoubleSide);
    }
    const tex = LS.createWaterTexture();
    return new THREE.MeshLambertMaterial({ map: tex, transparent: true, opacity: op, side: side || THREE.FrontSide });
  };

  LS.makeEmissiveMat = function (color, emissiveHex, intensity) {
    const em = emissiveHex !== undefined ? emissiveHex : color;
    const emI = intensity !== undefined ? intensity : 0.72;
    if (LS.ghibli && LS.ghibli.createGhibliMat) {
      return LS.ghibli.createGhibliMat(color, {
        emissive: em,
        emissiveIntensity: emI * 1.05
      });
    }
    return new THREE.MeshLambertMaterial({
      color: color,
      emissive: em,
      emissiveIntensity: emI
    });
  };

  LS.createGlowSprite = function (hexColor, scale) {
    const key = 'glow_' + (hexColor || '#ffd685');
    let tex = texCache[key];
    if (!tex) {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 128;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      g.addColorStop(0, 'rgba(255, 245, 210, 0.85)');
      g.addColorStop(0.35, 'rgba(255, 210, 120, 0.35)');
      g.addColorStop(1, 'rgba(255, 190, 90, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      tex = new THREE.CanvasTexture(c);
      texCache[key] = tex;
    }
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex,
      color: hexColor || 0xffd685,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    const s = scale || 1.6;
    sp.scale.set(s, s, 1);
    return sp;
  };

  LS.getWaterTexture = function () { return texCache.water_teal || null; };

  LS.createRoadTexture = function (style) {
    const key = 'road_' + (style || 'tokyo');
    if (texCache[key]) return texCache[key];

    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 512;
    const ctx = c.getContext('2d');

    if (style === 'kyoto') {
      ctx.fillStyle = '#53575d';
      ctx.fillRect(0, 0, 256, 512);
      for (let i = 0; i < 2000; i++) {
        const v = 72 + Math.floor(Math.random() * 24);
        ctx.fillStyle = 'rgba(' + v + ',' + v + ',' + (v + 4) + ',0.32)';
        ctx.fillRect(Math.random() * 256, Math.random() * 512, 2, 2);
      }
      ctx.fillStyle = '#eae5d6';
      ctx.fillRect(14, 0, 6, 512);
      ctx.fillRect(236, 0, 6, 512);
      ctx.fillStyle = '#e8d8b0';
      for (let y = 16; y < 512; y += 64) {
        ctx.fillRect(125, y, 6, 32);
      }
    } else {
      ctx.fillStyle = '#565b63';
      ctx.fillRect(0, 0, 256, 512);
      for (let i = 0; i < 2200; i++) {
        const v = 74 + Math.floor(Math.random() * 28);
        ctx.fillStyle = 'rgba(' + v + ',' + v + ',' + (v + 6) + ',0.35)';
        ctx.fillRect(Math.random() * 256, Math.random() * 512, 2, 2);
      }
      ctx.fillStyle = '#f2f0e6';
      ctx.fillRect(14, 0, 6, 512);
      ctx.fillRect(236, 0, 6, 512);
      ctx.fillStyle = '#f7e9c4';
      for (let y = 15; y < 512; y += 64) {
        ctx.fillRect(125, y, 6, 33);
      }
      ctx.strokeStyle = 'rgba(245, 242, 232, 0.88)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(78, 110);
      ctx.lineTo(98, 145);
      ctx.lineTo(78, 180);
      ctx.lineTo(58, 145);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = 'rgba(245, 242, 232, 0.88)';
      ctx.font = 'bold 23px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('止まれ', 178, 380);
      ctx.fillRect(140, 350, 75, 6);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 6);
    texCache[key] = tex;
    return tex;
  };

  LS.createRoofTileTexture = function (baseHex) {
    const key = 'roof_' + (baseHex || '#445266');
    if (texCache[key]) return texCache[key];

    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = baseHex || '#445266';
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 24) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(0, y, 256, 4);
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, y + 20, 256, 4);
      for (let x = 0; x < 256; x += 32) {
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + 16, y + 18, 16, 0, Math.PI);
        ctx.stroke();
      }
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    texCache[key] = tex;
    return tex;
  };

  LS.createPlasterTexture = function (hex) {
    const key = 'plaster_' + (hex || '#f3ead8');
    if (texCache[key]) return texCache[key];

    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = hex || '#f3ead8';
    ctx.fillRect(0, 0, S, S);
    const cnt = LS.isHD ? 2800 : 1100;
    for (let i = 0; i < cnt; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.11)' : 'rgba(120,90,60,0.08)';
      ctx.fillRect(hash01(i * 3.1) * S, hash01(i * 7.3) * S, 4 * sc, 3 * sc);
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    texCache[key] = tex;
    return tex;
  };

  LS.createWoodLatticeTexture = function (woodHex, paperHex) {
    const key = 'lattice_' + (woodHex || '#4d3221') + '_' + (paperHex || '#f7ecd4');
    if (texCache[key]) return texCache[key];

    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = paperHex || '#f7ecd4';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = woodHex || '#4d3221';
    for (let x = 0; x < 256; x += 24) {
      ctx.fillRect(x, 0, 6, 256);
    }
    for (let y = 0; y < 256; y += 64) {
      ctx.fillRect(0, y, 256, 7);
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    texCache[key] = tex;
    return tex;
  };

  LS.createStonePathTexture = function () {
    if (texCache.stone_path) return texCache.stone_path;
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#463b2d';
    ctx.fillRect(0, 0, S, S);

    const stones = [
      [14, 18, 68, 48], [94, 14, 72, 52], [178, 20, 64, 46],
      [20, 82, 82, 54], [114, 78, 66, 56], [190, 84, 54, 48],
      [12, 150, 64, 48], [88, 148, 86, 52], [184, 146, 60, 54],
      [22, 208, 92, 38], [126, 208, 114, 38]
    ];
    const palette = ['#48453f', '#524e47', '#5a554c', '#625c52'];
    stones.forEach((s, idx) => {
      ctx.fillStyle = palette[idx % palette.length];
      ctx.fillRect(s[0] * sc, s[1] * sc, s[2] * sc, s[3] * sc);
      if (LS.isHD) {
        ctx.fillStyle = 'rgba(255,250,235,0.08)';
        ctx.fillRect(s[0] * sc, s[1] * sc, s[2] * sc, 5 * sc);
      }
      ctx.strokeStyle = 'rgba(28, 22, 16, 0.45)';
      ctx.lineWidth = 3 * sc;
      ctx.strokeRect(s[0] * sc, s[1] * sc, s[2] * sc, s[3] * sc);
    });

    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    texCache.stone_path = tex;
    return tex;
  };

  LS.createCedarPlankTexture = function () {
    if (texCache.cedar_plank) return texCache.cedar_plank;
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#8b6343';
    ctx.fillRect(0, 0, S, S);
    for (let x = 0; x < 256; x += 28) {
      ctx.fillStyle = (x % 56 === 0) ? '#80593b' : '#946b49';
      ctx.fillRect(x * sc, 0, 26 * sc, S);
      if (LS.isHD) {
        ctx.fillStyle = 'rgba(65,38,20,0.14)';
        for (let g = 3; g < 24; g += 5) {
          ctx.fillRect((x + g) * sc, 0, 1.5 * sc, S);
        }
      }
      ctx.fillStyle = '#4f3522';
      ctx.fillRect((x + 26) * sc, 0, 2 * sc, S);
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    texCache.cedar_plank = tex;
    return tex;
  };

  function hash01(n) {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return v - Math.floor(v);
  }

  LS.createGrassTexture = function (style) {
    const key = 'grass_' + (style || 'tokyo');
    if (texCache[key]) return texCache[key];
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    const isKyoto = style === 'kyoto';
    const isSafari = style === 'safari';
    ctx.fillStyle = isSafari ? '#c8a956' : (isKyoto ? '#5d874b' : '#6ca656');
    ctx.fillRect(0, 0, S, S);

    // Seamless painterly Ghibli meadow/savanna patches using hash scatter (zero linear banding!)
    const tones = isSafari
      ? ['rgba(182,146,66,0.30)', 'rgba(218,188,98,0.26)', 'rgba(154,132,58,0.24)', 'rgba(232,202,118,0.20)']
      : (isKyoto
        ? ['rgba(74,114,58,0.28)', 'rgba(118,150,82,0.24)', 'rgba(84,102,56,0.2)', 'rgba(136,162,90,0.18)']
        : ['rgba(90,148,70,0.28)', 'rgba(134,182,92,0.24)', 'rgba(80,132,62,0.22)', 'rgba(162,196,104,0.18)']);
    const patchCount = LS.isHD ? 340 : 220;
    for (let i = 0; i < patchCount; i++) {
      ctx.fillStyle = tones[i % tones.length];
      const rx = hash01(i * 3.1 + 1.7) * S;
      const ry = hash01(i * 5.7 + 9.3) * S;
      const r = (10 + hash01(i * 7.3) * 18) * sc;
      for (let ox = -S; ox <= S; ox += S) {
        if (rx + ox < -r || rx + ox > S + r) continue;
        for (let oy = -S; oy <= S; oy += S) {
          if (ry + oy < -r || ry + oy > S + r) continue;
          ctx.beginPath();
          ctx.arc(rx + ox, ry + oy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    // Delicate randomly scattered grass blades & tiny specks
    const bladeCount = LS.isHD ? 1400 : 420;
    for (let i = 0; i < bladeCount; i++) {
      ctx.fillStyle = isSafari
        ? (i % 4 === 0 ? 'rgba(246,226,154,0.28)' : (i % 4 === 1 ? 'rgba(134,104,42,0.24)' : 'rgba(182,154,68,0.24)'))
        : (i % 4 === 0 ? 'rgba(230,244,184,0.24)' : (i % 4 === 1 ? 'rgba(42,74,34,0.24)' : 'rgba(92,146,66,0.22)'));
      const gx = hash01(i * 11.3 + 4.1) * S;
      const gy = hash01(i * 17.9 + 2.3) * S;
      ctx.fillRect(gx, gy, 2 * sc, 5 * sc);
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(22, 22);
    texCache[key] = tex;
    return tex;
  };

  LS.createVillageLaneTexture = function (style) {
    const key = 'village_lane_' + (style || 'tokyo');
    if (texCache[key]) return texCache[key];
    if (LS.isHD && LS.createAAAStreetTexture) {
      const aaaTex = LS.createAAAStreetTexture(style || 'tokyo');
      texCache[key] = aaaTex;
      return aaaTex;
    }
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    const isKyoto = style === 'kyoto';
    const isSafari = style === 'safari';
    ctx.fillStyle = isSafari ? '#b9824f' : (isKyoto ? '#847a6c' : '#a79e8d');
    ctx.fillRect(0, 0, S, S);
    const speckCount = LS.isHD ? 1800 : 650;
    for (let i = 0; i < speckCount; i++) {
      const px = hash01(i * 4.3 + 1.1) * S;
      const py = hash01(i * 6.9 + 7.7) * S;
      const sz = (2 + hash01(i * 2.1) * 5.5) * sc;
      ctx.fillStyle = i % 3 === 0
        ? (isSafari ? 'rgba(136,84,42,0.34)' : (isKyoto ? 'rgba(98,90,78,0.34)' : 'rgba(126,118,104,0.3)'))
        : (isSafari ? 'rgba(224,180,120,0.28)' : (isKyoto ? 'rgba(170,160,144,0.26)' : 'rgba(232,224,206,0.28)'));
      ctx.fillRect(px, py, sz, sz * 0.8);
    }
    if (LS.isHD) {
      for (let i = 0; i < 160; i++) {
        const cx = (34 + hash01(i * 9.1) * 188) * sc;
        const cy = hash01(i * 13.7) * S;
        const rx = (5 + hash01(i * 3.3) * 7) * sc;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,248,232,0.12)' : 'rgba(72,64,54,0.14)';
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * 0.72, hash01(i) * Math.PI, 0, Math.PI * 2); ctx.fill();
      }
    }
    const gL = ctx.createLinearGradient(0, 0, 34 * sc, 0);
    gL.addColorStop(0, isSafari ? 'rgba(196,166,82,0.78)' : (isKyoto ? 'rgba(84,116,66,0.72)' : 'rgba(106,154,82,0.62)'));
    gL.addColorStop(1, 'rgba(106,154,82,0)');
    ctx.fillStyle = gL; ctx.fillRect(0, 0, 34 * sc, S);
    const gR = ctx.createLinearGradient(S, 0, S - 34 * sc, 0);
    gR.addColorStop(0, isKyoto ? 'rgba(84,116,66,0.72)' : 'rgba(106,154,82,0.62)');
    gR.addColorStop(1, 'rgba(106,154,82,0)');
    ctx.fillStyle = gR; ctx.fillRect(S - 34 * sc, 0, 34 * sc, S);

    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 2);
    texCache[key] = tex;
    return tex;
  };

  LS.createGravelPathTexture = function () {
    if (texCache.gravel_path) return texCache.gravel_path;
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#c8b89a';
    ctx.fillRect(0, 0, S, S);
    const cnt = LS.isHD ? 2200 : 900;
    for (let i = 0; i < cnt; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(145,126,96,0.28)' : 'rgba(244,236,216,0.3)';
      ctx.fillRect(hash01(i * 4.7) * S, hash01(i * 8.3) * S, 4 * sc, 3 * sc);
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    texCache.gravel_path = tex;
    return tex;
  };

  LS.createZenGravelTexture = function () {
    if (texCache.zen_gravel) return texCache.zen_gravel;
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#d4cec0';
    ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = 'rgba(126, 120, 108, 0.42)';
    ctx.lineWidth = 4 * sc;
    for (let y = 10 * sc; y < S; y += 16 * sc) {
      ctx.beginPath();
      for (let x = 0; x <= S; x += 16 * sc) {
        const wy = y + Math.sin((x / S) * Math.PI * 2) * 4 * sc;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    texCache.zen_gravel = tex;
    return tex;
  };

  LS.createWaterTexture = function () {
    if (texCache.water_teal) return texCache.water_teal;
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = LS.isHD ? '#1e697d' : '#236675';
    ctx.fillRect(0, 0, S, S);
    const waveCount = LS.isHD ? 110 : 42;
    for (let i = 0; i < waveCount; i++) {
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(150, 224, 236, 0.28)' : (i % 3 === 1 ? 'rgba(16, 62, 76, 0.30)' : 'rgba(98, 192, 206, 0.22)');
      ctx.lineWidth = (LS.isHD ? 2.5 : 3) * sc;
      ctx.beginPath();
      const y = hash01(i * 3.7 + 1.2) * S;
      const x = hash01(i * 7.1 + 5.4) * (S - 44 * sc);
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 22 * sc, y - 5 * sc, x + 44 * sc, y);
      ctx.stroke();
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    texCache.water_teal = tex;
    return tex;
  };

  LS.createSkyTexture = function (mode, worldId) {
    const key = 'sky_' + mode + '_' + (worldId || 'tokyo');
    if (texCache[key]) return texCache[key];
    if (LS.isHD && LS.createShinkaiSkyTexture) {
      const hdTex = LS.createShinkaiSkyTexture(mode, worldId);
      texCache[key] = hdTex;
      return hdTex;
    }

    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    if (mode === 1) {
      grad.addColorStop(0, worldId === 'kyoto' ? '#363366' : '#324878');
      grad.addColorStop(0.42, '#e68454');
      grad.addColorStop(0.82, '#ffd07d');
      grad.addColorStop(1, '#fff0bc');
    } else if (mode === 2) {
      grad.addColorStop(0, '#0d152e');
      grad.addColorStop(0.55, '#223561');
      grad.addColorStop(1, '#4f6088');
    } else {
      grad.addColorStop(0, worldId === 'kyoto' ? '#3182cf' : '#2d7cd1');
      grad.addColorStop(0.48, worldId === 'kyoto' ? '#82c5ea' : '#78beef');
      grad.addColorStop(0.84, '#d8eef8');
      grad.addColorStop(1, '#fff5db');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Radiant Sun Disc (day & golden hour) or Crescent Moon + Twinkling Stars (night) in HD!
    if (mode === 2) {
      ctx.fillStyle = 'rgba(255, 250, 220, 0.88)';
      const starCnt = LS.isHD ? 180 : 85;
      for (let i = 0; i < starCnt; i++) {
        const sx = hash01(i * 9.7 + 3.1) * 1024;
        const sy = hash01(i * 4.3 + 1.7) * 235;
        const sr = (i % 4 === 0) ? 2.2 : 1.1;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
      }
      if (worldId === 'safari') {
        ctx.strokeStyle = 'rgba(255, 228, 152, 0.34)';
        ctx.lineWidth = 1.4;
        [[[230, 88], [255, 118], [230, 152], [208, 115], [230, 88]],
         [[470, 128], [498, 110], [525, 92], [548, 84], [564, 99], [545, 118], [518, 122], [498, 110]]].forEach(pts => {
          ctx.beginPath();
          pts.forEach((p, idx) => idx === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
          ctx.stroke();
          ctx.fillStyle = '#fff9d6';
          pts.forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 3.0, 0, Math.PI * 2); ctx.fill(); });
        });
      }
      if (LS.isHD) {
        const mg = ctx.createRadialGradient(780, 130, 8, 780, 130, 70);
        mg.addColorStop(0, 'rgba(255,250,224,0.95)');
        mg.addColorStop(0.35, 'rgba(200,220,255,0.32)');
        mg.addColorStop(1, 'rgba(180,200,255,0)');
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(780, 130, 70, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff9df'; ctx.beginPath(); ctx.arc(780, 130, 20, 0, Math.PI * 2); ctx.fill();
      }
    } else if (LS.isHD) {
      const sx = mode === 1 ? 660 : 720;
      const sy = mode === 1 ? 265 : 155;
      const sg = ctx.createRadialGradient(sx, sy, 8, sx, sy, 120);
      sg.addColorStop(0, mode === 1 ? 'rgba(255,244,200,0.95)' : 'rgba(255,253,235,0.9)');
      sg.addColorStop(0.32, mode === 1 ? 'rgba(255,190,110,0.45)' : 'rgba(255,246,204,0.28)');
      sg.addColorStop(1, 'rgba(255,230,170,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 120, 0, Math.PI * 2); ctx.fill();
    }

    function drawCloud(cx, cy, scale, alpha) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      const puffs = [
        [0, 0, 58], [-48, 18, 42], [52, 16, 46], [-22, -32, 40],
        [24, -28, 38], [0, -56, 30], [-78, 32, 32], [82, 30, 34]
      ];
      const shadowCol = mode === 1 ? 'rgba(205,120,95,' + alpha + ')' :
                        mode === 2 ? 'rgba(40,52,88,' + alpha + ')' :
                                     'rgba(180,208,232,' + alpha + ')';
      const lightCol = mode === 1 ? 'rgba(255,228,195,' + alpha + ')' :
                       mode === 2 ? 'rgba(92,110,152,' + alpha + ')' :
                                    'rgba(255,253,246,' + alpha + ')';
      puffs.forEach(p => {
        ctx.fillStyle = shadowCol;
        ctx.beginPath();
        ctx.arc(p[0], p[1] + 10, p[2], 0, Math.PI * 2);
        ctx.fill();
      });
      puffs.forEach(p => {
        ctx.fillStyle = lightCol;
        ctx.beginPath();
        ctx.arc(p[0], p[1], p[2] * 0.94, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    drawCloud(240, 210, 1.35, 0.92);
    drawCloud(680, 190, 1.6, 0.94);
    drawCloud(900, 240, 1.0, 0.85);
    drawCloud(90, 250, 0.9, 0.82);

    const tex = finalizeTex(new THREE.CanvasTexture(c));
    texCache[key] = tex;
    return tex;
  };

  LS.createSignTexture = function (text, opts) {
    const cfg = Object.assign({
      bg: '#fdf6e7',
      border: '#b85424',
      color: '#3d2c1e',
      font: 'bold 38px sans-serif',
      width: 512,
      height: 128
    }, opts || {});
    const c = document.createElement('canvas');
    c.width = cfg.width;
    c.height = cfg.height;
    const ctx = c.getContext('2d');
    ctx.fillStyle = cfg.bg;
    ctx.fillRect(0, 0, cfg.width, cfg.height);
    ctx.strokeStyle = cfg.border;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, cfg.width - 16, cfg.height - 16);
    ctx.fillStyle = cfg.color;
    ctx.font = cfg.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cfg.width / 2, cfg.height / 2 + 2);
    return new THREE.CanvasTexture(c);
  };

  LS.createAnimeFaceTexture = function (opts) {
    const cfg = Object.assign({
      skin: '#ffe3cc',
      eyeColor: '#472818',
      eyeHighlight: '#b0703a',
      blush: 'rgba(246, 126, 142, 0.48)',
      blink: false,
      happy: false,
      glasses: false,
      elder: false,
      mustache: false
    }, opts || {});

    const S = 512;
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    const ctx = c.getContext('2d');
    ctx.scale(S / 512, S / 512);
    // Transparent canvas so features sit seamlessly on the 3D shaded head (ZERO rectangular seam!)
    ctx.clearRect(0, 0, 512, 512);
    ctx.save();
    ctx.translate(0, 22); // Classic anime proportion: large expressive eyes right at mid-lower face below the bangs!

    // 1. Soft airbrushed radial rosy cheeks + subtle anime cheek highlight dots
    function drawBlush(bx, by) {
      const bg = ctx.createRadialGradient(bx, by, 4, bx, by, 44);
      bg.addColorStop(0, cfg.blush);
      bg.addColorStop(0.55, cfg.blush.replace(/[\d.]+\)$/, '0.18)'));
      bg.addColorStop(1, 'rgba(246, 126, 142, 0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.ellipse(bx, by, 46, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      if (!cfg.elder && !cfg.mustache) {
        ctx.fillStyle = 'rgba(255, 252, 246, 0.55)';
        ctx.beginPath();
        ctx.ellipse(bx - 10, by - 5, 5, 2.6, -0.25, 0, Math.PI * 2);
        ctx.ellipse(bx + 4, by - 3, 2.8, 1.8, -0.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    drawBlush(146, 304);
    drawBlush(366, 304);

    // 2. Refined expressive anime eyebrows (soft tapered arc)
    ctx.strokeStyle = cfg.elder ? '#b6b8bc' : '#3a2216';
    ctx.lineWidth = cfg.elder ? 8.5 : 6.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(132, 184);
    ctx.quadraticCurveTo(176, 166, 214, 180);
    ctx.moveTo(298, 180);
    ctx.quadraticCurveTo(336, 166, 380, 184);
    ctx.stroke();

    // 3. Multi-layered Studio Ghibli / Makoto Shinkai Anime Eyes (side: -1 left, +1 right)
    function drawEye(cx, side) {
      const cy = 246;
      if (cfg.blink || cfg.happy) {
        ctx.strokeStyle = '#24140d';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (cfg.happy) {
          ctx.moveTo(cx - 34, cy + 12);
          ctx.quadraticCurveTo(cx, cy - 22, cx + 34, cy + 12);
        } else {
          ctx.moveTo(cx - 34, cy + 2);
          ctx.quadraticCurveTo(cx, cy + 20, cx + 34, cy + 2);
        }
        ctx.stroke();
        // Delicate outer lash flick
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx + side * 30, cfg.happy ? cy + 8 : cy + 4);
        ctx.lineTo(cx + side * 42, cfg.happy ? cy + 1 : cy + 8);
        ctx.stroke();
        return;
      }

      // Almond eye clip shape
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - 39, cy + 4);
      ctx.bezierCurveTo(cx - 34, cy - 40, cx + 34, cy - 40, cx + 39, cy + 4);
      ctx.bezierCurveTo(cx + 32, cy + 36, cx - 32, cy + 36, cx - 39, cy + 4);
      ctx.closePath();
      ctx.fillStyle = '#fffdfb';
      ctx.fill();
      ctx.clip();

      // Soft cool upper sclera shadow cast by eyelashes
      const scGrad = ctx.createLinearGradient(cx, cy - 38, cx, cy - 4);
      scGrad.addColorStop(0, 'rgba(138, 146, 186, 0.44)');
      scGrad.addColorStop(1, 'rgba(138, 146, 186, 0)');
      ctx.fillStyle = scGrad;
      ctx.fillRect(cx - 44, cy - 44, 88, 44);

      // Luminous layered anime iris!
      const irisGrad = ctx.createLinearGradient(cx, cy - 30, cx, cy + 34);
      irisGrad.addColorStop(0.0, '#1c100b');
      irisGrad.addColorStop(0.32, cfg.eyeColor);
      irisGrad.addColorStop(0.78, cfg.eyeHighlight);
      irisGrad.addColorStop(1.0, '#ffe8b8');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.ellipse(cx - side * 2, cy + 2, 27, 33, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dark outer iris ring for anime crispness
      ctx.strokeStyle = 'rgba(24, 12, 8, 0.72)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Glowing lower iris crescent bounce light
      const glowGrad = ctx.createRadialGradient(cx - side * 2, cy + 22, 2, cx - side * 2, cy + 22, 22);
      glowGrad.addColorStop(0, 'rgba(255, 245, 206, 0.85)');
      glowGrad.addColorStop(0.6, 'rgba(255, 220, 160, 0.35)');
      glowGrad.addColorStop(1, 'rgba(255, 220, 160, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(cx - side * 2, cy + 19, 20, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deep velvety pupil
      ctx.fillStyle = '#180d09';
      ctx.beginPath();
      ctx.ellipse(cx - side * 2, cy + 1, 12, 15.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Triple studio anime specular catchlights!
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.beginPath();
      ctx.ellipse(cx - 12, cy - 13, 9.5, 11.5, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 11, cy + 14, 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.beginPath();
      ctx.arc(cx + 13, cy - 12, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Sculpted upper eyelash arch with graceful outer wing flick!
      ctx.strokeStyle = '#20120c';
      ctx.lineWidth = 10.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy + 2);
      ctx.bezierCurveTo(cx - 30, cy - 40, cx + 30, cy - 40, cx + 38, cy + 2);
      ctx.stroke();

      // Outer lash wing flick
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.moveTo(cx + side * 34, cy - 6);
      ctx.lineTo(cx + side * 46, cy - 15);
      ctx.stroke();

      // Delicate upper eyelid crease line
      ctx.strokeStyle = 'rgba(130, 82, 58, 0.62)';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(cx - 28, cy - 35);
      ctx.quadraticCurveTo(cx, cy - 48, cx + 28, cy - 35);
      ctx.stroke();

      // Subtle soft lower lash hint
      ctx.strokeStyle = 'rgba(72, 42, 30, 0.45)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 31);
      ctx.quadraticCurveTo(cx, cy + 36, cx + 20, cy + 31);
      ctx.stroke();

      // Gentle friendly laugh lines for elders
      if (cfg.elder) {
        ctx.strokeStyle = 'rgba(148, 100, 74, 0.55)';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cx + side * 42, cy + 4);
        ctx.lineTo(cx + side * 54, cy + 9);
        ctx.moveTo(cx + side * 42, cy + 14);
        ctx.lineTo(cx + side * 52, cy + 20);
        ctx.stroke();
      }
    }

    drawEye(172, -1);
    drawEye(340, 1);

    // 4. Polished anime glasses with soft translucent lenses & diagonal sheen
    if (cfg.glasses) {
      [172, 340].forEach(gx => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(gx, 248, 48, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(218, 240, 255, 0.22)';
        ctx.fill();
        ctx.clip();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(gx - 38, 212);
        ctx.lineTo(gx - 8, 286);
        ctx.stroke();
        ctx.restore();
      });
      ctx.strokeStyle = '#47362a';
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.arc(172, 248, 48, 0, Math.PI * 2);
      ctx.moveTo(220, 248);
      ctx.quadraticCurveTo(256, 238, 292, 248);
      ctx.moveTo(388, 248);
      ctx.arc(340, 248, 48, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 5. Delicate cel-shaded anime nose (soft warm shadow wedge + sunlit tip highlight)
    ctx.fillStyle = 'rgba(196, 134, 102, 0.52)';
    ctx.beginPath();
    ctx.moveTo(256, 286);
    ctx.lineTo(249, 304);
    ctx.lineTo(260, 306);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 248, 240, 0.72)';
    ctx.beginPath();
    ctx.arc(257, 297, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // 6. Tapered sculpted anime mustache
    if (cfg.mustache) {
      ctx.fillStyle = cfg.elder ? '#c8cacd' : '#3a2416';
      ctx.beginPath();
      ctx.moveTo(256, 326);
      ctx.quadraticCurveTo(230, 320, 206, 340);
      ctx.quadraticCurveTo(234, 346, 256, 336);
      ctx.quadraticCurveTo(278, 346, 306, 340);
      ctx.quadraticCurveTo(282, 320, 256, 326);
      ctx.fill();
    }

    // 7. Expressive anime mouth with soft lower-lip blush
    ctx.lineCap = 'round';
    if (cfg.happy) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(226, 338);
      ctx.quadraticCurveTo(256, 344, 286, 338);
      ctx.quadraticCurveTo(282, 376, 256, 376);
      ctx.quadraticCurveTo(230, 376, 226, 338);
      ctx.closePath();
      ctx.fillStyle = '#c84b58';
      ctx.fill();
      ctx.clip();
      ctx.fillStyle = '#f2848f';
      ctx.beginPath();
      ctx.ellipse(256, 370, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(226, 336, 60, 9);
      ctx.restore();
      ctx.strokeStyle = '#7c322c';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(226, 338);
      ctx.quadraticCurveTo(256, 344, 286, 338);
      ctx.quadraticCurveTo(282, 376, 256, 376);
      ctx.quadraticCurveTo(230, 376, 226, 338);
      ctx.stroke();
    } else {
      // Soft rosy lower-lip shade
      ctx.fillStyle = 'rgba(232, 134, 138, 0.34)';
      ctx.beginPath();
      ctx.ellipse(256, 353, 18, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Gentle tapered smile line
      ctx.strokeStyle = '#8b3e36';
      ctx.lineWidth = 6.2;
      ctx.beginPath();
      ctx.moveTo(228, 338);
      ctx.quadraticCurveTo(256, 355, 284, 338);
      ctx.stroke();
    }
    ctx.restore();

    return finalizeTex(new THREE.CanvasTexture(c));
  };

  LS.createPondBedTexture = function () {
    if (texCache.pond_bed) return texCache.pond_bed;
    const S = LS.isHD ? 512 : 256;
    const sc = S / 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    // Warm pebbled shallow rim fading to deep mossy emerald-teal pond center
    const rg = ctx.createRadialGradient(S * 0.5, S * 0.5, S * 0.12, S * 0.5, S * 0.5, S * 0.52);
    rg.addColorStop(0.0, '#143238');
    rg.addColorStop(0.58, '#1e4a4c');
    rg.addColorStop(0.84, '#446354');
    rg.addColorStop(1.0, '#6e6a54');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, S, S);
    const pebbleCols = ['rgba(86,92,80,0.45)', 'rgba(132,124,102,0.40)', 'rgba(54,68,62,0.50)', 'rgba(164,152,126,0.34)', 'rgba(66,102,74,0.36)'];
    for (let i = 0; i < (LS.isHD ? 950 : 350); i++) {
      const px = hash01(i * 3.7 + 1.1) * S;
      const py = hash01(i * 6.1 + 4.9) * S;
      const rx = (2.5 + hash01(i * 2.3) * 7.5) * sc;
      ctx.fillStyle = pebbleCols[i % pebbleCols.length];
      ctx.beginPath();
      ctx.ellipse(px, py, rx, rx * 0.72, hash01(i * 8.3) * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    texCache.pond_bed = tex;
    return tex;
  };

  LS.createSpeechBubbleSprite = function (name, text) {
    const c = document.createElement('canvas');
    const measureCtx = c.getContext('2d');
    measureCtx.font = '600 22px sans-serif';

    const maxTextWidth = 392;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const test = currentLine + words[i] + ' ';
      if (measureCtx.measureText(test).width > maxTextWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = words[i] + ' ';
      } else {
        currentLine = test;
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trim());

    const lineHeight = 30;
    const extraLines = Math.max(0, lines.length - 2);
    const boxHeight = 122 + extraLines * lineHeight;
    const tailHeight = 24;
    const topPad = 14;
    const bottomPad = 14;

    c.width = 512;
    c.height = topPad + boxHeight + tailHeight + bottomPad;

    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(253, 246, 231, 0.96)';
    ctx.strokeStyle = '#b98b52';
    ctx.lineWidth = 8;

    const x = 16, y = topPad, w = 480, h = boxHeight, r = 26;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(276, y + h);
    ctx.lineTo(256, y + h + tailHeight);
    ctx.lineTo(236, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#b85424';
    ctx.font = 'bold 25px sans-serif';
    ctx.fillText(name, 40, 50);

    ctx.fillStyle = '#3d2c1e';
    ctx.font = '600 22px sans-serif';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 40, 86 + i * lineHeight);
    }

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.renderOrder = 25;
    const worldHeight = 1.24 * (c.height / 180);
    sprite.scale.set(3.45, worldHeight, 1);
    sprite.visible = false;
    return sprite;
  };

  // Shared Natural Neighborhood Scenery Builders (zero extra lights, mobile-safe geometry)
  function sampleCatmullRom(pts, stepsPerSeg) {
    if (!pts || pts.length < 2) return pts || [];
    const steps = stepsPerSeg || 8;
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const count = (i === pts.length - 2) ? steps : steps;
      for (let s = 0; s < count; s++) {
        const t = s / steps;
        const t2 = t * t, t3 = t2 * t;
        const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        const z = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        out.push([x, z]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function buildRibbonGeometry(sampled, width, yLevel, vScale) {
    const hw = width * 0.5;
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    let dist = 0;

    for (let i = 0; i < sampled.length; i++) {
      const cur = sampled[i];
      const prev = sampled[Math.max(0, i - 1)];
      const next = sampled[Math.min(sampled.length - 1, i + 1)];
      if (i > 0) dist += Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
      let tx = next[0] - prev[0];
      let tz = next[1] - prev[1];
      const tLen = Math.hypot(tx, tz) || 1;
      tx /= tLen; tz /= tLen;
      // Perpendicular normal in XZ plane
      const nx = -tz, nz = tx;

      positions.push(cur[0] - nx * hw, yLevel, cur[1] - nz * hw);
      positions.push(cur[0] + nx * hw, yLevel, cur[1] + nz * hw);
      normals.push(0, 1, 0, 0, 1, 0);
      const v = dist * (vScale || 0.14);
      uvs.push(0, v, 1, v);

      if (i < sampled.length - 1) {
        const b = i * 2;
        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }

  LS.scenery = {
    sampleSpline: sampleCatmullRom,

    addCurvedPath: function (parent, points, width, style, yLevel) {
      let tex;
      if (style === 'stone') tex = LS.createStonePathTexture();
      else if (style === 'lane_tokyo') tex = LS.createVillageLaneTexture('tokyo');
      else if (style === 'lane_kyoto') tex = LS.createVillageLaneTexture('kyoto');
      else if (style === 'lane_safari') tex = LS.createVillageLaneTexture('safari');
      else tex = LS.createGravelPathTexture();

      const mat = LS.makeSurfaceMat(tex, { side: THREE.DoubleSide, roughness: style === 'stone' ? 0.76 : 0.86 });
      const sampled = sampleCatmullRom(points, LS.isHD ? 12 : 8);
      const y = (yLevel !== undefined) ? yLevel : (style && style.indexOf('lane_') === 0 ? 0.032 : 0.024);
      const geo = buildRibbonGeometry(sampled, width || 2.5, y, style === 'stone' ? 0.16 : 0.12);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      parent.add(mesh);
      return sampled;
    },

    addMeanderingStream: function (parent, points, width, addColliderFn, bridgeZones) {
      const sampled = sampleCatmullRom(points, LS.isHD ? 12 : 8);
      const w = width || 4.8;
      // Soft earthy riverbank border beneath water
      const bankGeo = buildRibbonGeometry(sampled, w + 1.5, 0.015, 0.1);
      const bankMesh = new THREE.Mesh(bankGeo, LS.makeToonMat(0x5a584a, { side: THREE.DoubleSide }));
      bankMesh.receiveShadow = true;
      parent.add(bankMesh);

      // Flowing water ribbon (glossy reflective PBR in HD!)
      const waterGeo = buildRibbonGeometry(sampled, w, 0.036, 0.12);
      const waterMat = LS.makeWaterMat(0.92, THREE.DoubleSide);
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      parent.add(waterMesh);

      const bridges = bridgeZones || [];
      function nearBridge(px, pz) {
        for (let b = 0; b < bridges.length; b++) {
          if (Math.hypot(px - bridges[b].x, pz - bridges[b].z) < (bridges[b].r || 3.4)) return true;
        }
        return false;
      }

      // Scattered mossy bank boulders, reeds & gentle water colliders (clean gap at bridges!)
      for (let i = 1; i < sampled.length - 1; i++) {
        const cur = sampled[i];
        const prev = sampled[i - 1], next = sampled[i + 1];
        let tx = next[0] - prev[0], tz = next[1] - prev[1];
        const tl = Math.hypot(tx, tz) || 1;
        tx /= tl; tz /= tl;
        const nx = -tz, nz = tx;

        const isBridge = nearBridge(cur[0], cur[1]);
        if (addColliderFn && !isBridge && i % 2 === 0) {
          addColliderFn(cur[0], cur[1], w * 0.44, w * 0.44);
        }
        if (!isBridge && i % 4 === 0) {
          const side = (i % 8 === 0) ? 1 : -1;
          const bx = cur[0] + nx * side * (w * 0.56 + 0.35);
          const bz = cur[1] + nz * side * (w * 0.56 + 0.35);
          LS.scenery.addBoulder(parent, bx, bz, 0.55 + hash01(i * 3.7) * 0.45, true);
        }
        if (!isBridge && i % 5 === 2) {
          const side = (i % 10 === 2) ? -1 : 1;
          LS.scenery.addTallGrass(parent, cur[0] + nx * side * (w * 0.52 + 0.25), cur[1] + nz * side * (w * 0.52 + 0.25), 1.15);
        }
        if (!isBridge && i % 7 === 3) {
          LS.scenery.addLilyPad(parent, cur[0] + nx * (hash01(i) - 0.5) * w * 0.4, 0.052, cur[1] + nz * (hash01(i + 4) - 0.5) * w * 0.4, 0.9, i % 14 === 3);
        }
      }
      return sampled;
    },

    addMeadowPatch: function (parent, x, z, rx, rz, rotY, colorHex) {
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(1, 20),
        LS.makeToonMat(colorHex || 0x82bc64)
      );
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = rotY || 0;
      m.scale.set(rx, rz, 1);
      m.position.set(x, 0.012, z);
      m.receiveShadow = true;
      parent.add(m);
    },

    addTallGrass: function (parent, x, z, scale) {
      const s = scale || 1;
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.scale.setScalar(s);
      const bladeMat = LS.makeToonMat(0x4b8f44);
      const tipMat = LS.makeToonMat(0x74b354);
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + (x * 0.3 + z * 0.2);
        const r = 0.08 + (i % 2) * 0.16;
        const h = 0.42 + (i % 3) * 0.16;
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, h, 4), i % 2 === 0 ? bladeMat : tipMat);
        blade.position.set(Math.cos(ang) * r, h * 0.46, Math.sin(ang) * r);
        blade.rotation.z = Math.cos(ang) * 0.24;
        blade.rotation.x = Math.sin(ang) * 0.24;
        g.add(blade);
      }
      parent.add(g);
    },

    addLilyPad: function (parent, x, y, z, scale, hasBloom) {
      const s = scale || 1;
      const g = new THREE.Group();
      g.position.set(x, y, z);
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.36 * s, 0.36 * s, 0.03, 10), LS.makeToonMat(0x408a4c));
      g.add(pad);
      if (hasBloom) {
        const bloom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.11 * s, 0), LS.makeToonMat(0xffa6c9));
        bloom.position.y = 0.08;
        g.add(bloom);
      }
      parent.add(g);
    },

    addSteppingStones: function (parent, points) {
      const mat = LS.makeToonMat(0x8a877d);
      points.forEach((p, idx) => {
        const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.42 + (idx % 2) * 0.1, 0.48, 0.06, 8), mat);
        stone.scale.set(1.15, 1, 0.85);
        stone.rotation.y = idx * 0.9;
        stone.position.set(p[0], 0.032, p[1]);
        stone.receiveShadow = true;
        parent.add(stone);
      });
    },

    addSignpost: function (parent, x, z, rotY) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rotY || 0;
      const wood = LS.makeToonMat(0x7c5333), board = LS.makeToonMat(0xd4b483);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.0, 6), wood);
      post.position.y = 1.0; post.castShadow = true; g.add(post);
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.22, 0.07), board);
      arm1.position.set(0.32, 1.72, 0); arm1.rotation.z = 0.04; g.add(arm1);
      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.2, 0.07), board);
      arm2.position.set(-0.28, 1.38, 0.05); arm2.rotation.y = 0.55; arm2.rotation.z = -0.03; g.add(arm2);
      parent.add(g);
    },

    addWildflowerMeadow: function (parent, cx, cz, radius, count, palette) {
      const n = count || 8;
      for (let i = 0; i < n; i++) {
        const ang = hash01(cx * 3.1 + cz * 1.7 + i * 5.3) * Math.PI * 2;
        const rad = Math.sqrt(hash01(cx * 1.9 + cz * 4.1 + i * 7.7)) * radius;
        const px = cx + Math.cos(ang) * rad;
        const pz = cz + Math.sin(ang) * rad;
        if (i % 3 === 0) LS.scenery.addTallGrass(parent, px, pz, 0.85 + hash01(i * 2.9) * 0.45);
        else LS.scenery.addFlowerPatch(parent, px, pz, palette);
      }
    },

    addFlowerPatch: function (parent, x, z, palette) {
      const g = new THREE.Group();
      g.position.set(x, 0.04, z);
      const cols = palette || [0xff8fab, 0xffd166, 0xffffff, 0x90e0ef];
      const stemMat = LS.makeToonMat(0x4c9a42);
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + (x + z) * 0.3;
        const r = 0.22 + (i % 3) * 0.34;
        const fx = Math.cos(ang) * r, fz = Math.sin(ang) * r;
        const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 5), stemMat);
        tuft.position.set(fx, 0.08, fz);
        g.add(tuft);
        const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), LS.makeToonMat(cols[i % cols.length]));
        bloom.position.set(fx, 0.2, fz);
        g.add(bloom);
      }
      parent.add(g);
    },

    addShrub: function (parent, x, z, scale, flowerHex) {
      const s = scale || 1;
      if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_shrub')) {
        const m = LS.hdAssets.clone('anime_shrub');
        m.position.set(x, 0, z);
        m.rotation.y = x * 0.7 + z * 0.3;
        m.scale.setScalar(s * 1.15);
        parent.add(m);
        return;
      }
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.scale.setScalar(s);
      const leafMat = LS.makeToonMat(0x448543);
      [[0, 0.45, 0, 0.58], [-0.42, 0.35, 0.2, 0.42], [0.42, 0.36, -0.18, 0.44]].forEach(p => {
        const geo = LS.isHD ? new THREE.IcosahedronGeometry(p[3], 2) : new THREE.DodecahedronGeometry(p[3], 0);
        const m = new THREE.Mesh(geo, leafMat);
        m.position.set(p[0], p[1], p[2]);
        m.castShadow = true;
        g.add(m);
      });
      if (flowerHex) {
        const fMat = LS.makeToonMat(flowerHex);
        [[-0.25, 0.68, 0.28], [0.22, 0.72, 0.22], [0.0, 0.85, -0.15]].forEach(fp => {
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.14, LS.isHD ? 10 : 6, LS.isHD ? 8 : 5), fMat);
          b.position.set(fp[0], fp[1], fp[2]);
          g.add(b);
        });
      }
      parent.add(g);
    },

    addBoulder: function (parent, x, z, scale, mossy) {
      const s = scale || 1;
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68 * s, LS.isHD ? 1 : 0), LS.makeToonMat(0x7c7b74));
      rock.scale.set(1.25, 0.72, 1.0);
      rock.position.y = 0.36 * s;
      rock.rotation.y = (x * 0.7 + z * 0.4);
      rock.castShadow = true;
      rock.receiveShadow = true;
      g.add(rock);
      if (mossy) {
        const moss = new THREE.Mesh(new THREE.SphereGeometry(0.45 * s, LS.isHD ? 12 : 7, LS.isHD ? 8 : 5), LS.makeToonMat(0x528a48));
        moss.scale.set(1.2, 0.35, 1.0);
        moss.position.set(0.05, 0.66 * s, 0);
        g.add(moss);
      }
      parent.add(g);
    },

    addBench: function (parent, x, z, rotY) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rotY || 0;
      const wood = LS.makeToonMat(0x8c5e35);
      const legMat = LS.makeToonMat(0x3a3d42);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.55), wood);
      seat.position.y = 0.48; seat.castShadow = true; g.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.42, 0.08), wood);
      back.position.set(0, 0.78, -0.24); back.rotation.x = -0.15; g.add(back);
      [-0.68, 0.68].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.46, 0.48), legMat);
        leg.position.set(lx, 0.23, 0); g.add(leg);
      });
      parent.add(g);
    },

    addPicnicBlanket: function (parent, x, z, rotY) {
      const g = new THREE.Group();
      g.position.set(x, 0.03, z);
      g.rotation.y = rotY || 0;
      const cloth = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.03, 2.2), LS.makeToonMat(0xf4a261));
      g.add(cloth);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.62, 0.035, 0.55), LS.makeToonMat(0xfff5e4));
      g.add(stripe);
      const basket = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.4), LS.makeToonMat(0xa67342));
      basket.position.set(0.65, 0.2, -0.45); basket.castShadow = true; g.add(basket);
      parent.add(g);
    },

    addFenceRun: function (parent, x1, z1, x2, z2, style) {
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const g = new THREE.Group();
      g.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
      g.rotation.y = Math.atan2(dx, dz);
      if (style === 'hedge') {
        const hedge = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, len), LS.makeToonMat(0x3f7d40));
        hedge.position.y = 0.48; hedge.castShadow = true; hedge.receiveShadow = true; g.add(hedge);
      } else if (style === 'bamboo') {
        const bMat = LS.makeToonMat(0x8ba35c);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.05, len), bMat);
        rail.position.y = 0.52; rail.castShadow = true; g.add(rail);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, len + 0.1), LS.makeToonMat(0x526b36));
        cap.position.y = 1.08; g.add(cap);
      } else {
        const wMat = LS.makeToonMat(0x8c6239);
        [0.32, 0.72].forEach(ry => {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, len), wMat);
          bar.position.y = ry; g.add(bar);
        });
        const posts = Math.max(2, Math.round(len / 2.2));
        for (let i = 0; i <= posts; i++) {
          const pz = -len / 2 + (i / posts) * len;
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, 0.14), wMat);
          post.position.set(0, 0.47, pz); g.add(post);
        }
      }
      parent.add(g);
    },

    addGrassMound: function (parent, x, z, radius, height, colorHex) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(radius, LS.isHD ? 24 : 14, LS.isHD ? 16 : 10),
        LS.makeToonMat(colorHex || 0x629950)
      );
      m.scale.set(1.3, height / radius, 1.05);
      m.rotation.y = x * 0.2 + z * 0.1;
      m.position.set(x, -height * 0.36, z);
      m.receiveShadow = true;
      parent.add(m);
    },

    addBike: function (parent, x, z, rotY, colorHex) {
      if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_bike')) {
        const m = LS.hdAssets.clone('anime_bike', { frameTint: colorHex || 0x52a69a });
        m.position.set(x, 0, z);
        m.rotation.y = rotY || 0;
        parent.add(m);
        return m;
      }
      const bike = new THREE.Group();
      bike.position.set(x, 0, z);
      bike.rotation.y = rotY || 0;
      const wheelMat = LS.makeToonMat(0x26282c);
      const chromeMat = LS.makeToonMat(0xd4d8de);
      const frameMat = LS.makeToonMat(colorHex || 0x52a69a);
      [-0.54, 0.54].forEach(wz => {
        const w = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.036, 8, 18), wheelMat);
        w.position.set(0, 0.34, wz); w.rotation.y = Math.PI / 2; bike.add(w);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.015, 6, 16), chromeMat);
        rim.position.set(0, 0.34, wz); rim.rotation.y = Math.PI / 2; bike.add(rim);
        for (let s = 0; s < 4; s++) {
          const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.54, 4), chromeMat);
          sp.position.set(0, 0.34, wz); sp.rotation.x = (s / 4) * Math.PI; bike.add(sp);
        }
      });
      const downTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.62, 6), frameMat);
      downTube.position.set(0, 0.48, 0.14); downTube.rotation.x = 1.15; bike.add(downTube);
      const seatTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.54, 6), frameMat);
      seatTube.position.set(0, 0.60, -0.15); seatTube.rotation.x = -0.25; bike.add(seatTube);
      const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.56, 6), frameMat);
      fork.position.set(0, 0.60, 0.46); fork.rotation.x = -0.28; bike.add(fork);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.46, 6), chromeMat);
      bar.position.set(0, 0.98, 0.35); bar.rotation.z = Math.PI / 2; bike.add(bar);
      const seat = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), LS.makeToonMat(0x5c3620));
      seat.scale.set(0.85, 0.38, 1.3); seat.position.set(0, 0.92, -0.22); bike.add(seat);
      const rack = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.025, 0.38), chromeMat);
      rack.position.set(0, 0.72, -0.54); bike.add(rack);
      const basket = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.24), LS.makeToonMat(0x9a6d40));
      basket.position.set(0, 0.82, 0.54); bike.add(basket);
      parent.add(bike);
      return bike;
    },

    buildShinkansenTrackAndTrain: function (stationGroup, trackZ) {
      const tz = trackZ !== undefined ? trackZ : 3.6;
      // Gravel ballast bed + concrete sleepers (ties) + twin gleaming steel rails + overhead catenary gantries!
      const ballast = new THREE.Mesh(new THREE.BoxGeometry(130, 0.36, 3.3), LS.makeToonMat(0x6c6e72));
      ballast.position.set(0, 0.18, tz); ballast.receiveShadow = true; stationGroup.add(ballast);

      const sleeperMat = LS.makeToonMat(0x8e8c84);
      for (let sx = -44; sx <= 44; sx += 1.6) {
        const tie = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 2.2), sleeperMat);
        tie.position.set(sx, 0.38, tz); stationGroup.add(tie);
      }
      const railMat = LS.makeToonMat(0xb8c0cc);
      [-0.72, 0.72].forEach(rz => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(130, 0.10, 0.09), railMat);
        rail.position.set(0, 0.45, tz + rz); stationGroup.add(rail);
      });
      // Overhead Shinkansen steel catenary gantries & live power wire!
      const gantryMat = LS.makeToonMat(0x525c68);
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x262a32 });
      [-12, 0, 12].forEach(gx => {
        const pole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 5.2, 0.24), gantryMat);
        pole.position.set(gx, 2.6, tz + 2.15); stationGroup.add(pole);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 3.2), gantryMat);
        arm.position.set(gx, 4.65, tz + 0.65); stationGroup.add(arm);
      });
      const catWire = new THREE.Mesh(new THREE.BoxGeometry(120, 0.035, 0.035), wireMat);
      catWire.position.set(0, 4.02, tz); stationGroup.add(catWire);

      const train = new THREE.Group();
      train.position.set(0, 0.48, tz);

      if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_shinkansen')) {
        const mdl = LS.hdAssets.clone('anime_shinkansen');
        train.add(mdl);
      } else {
        // Upgraded Classic 3-car N700S Bullet Train!
        const whiteM = LS.makeToonMat(0xf8fafc), blueM = LS.makeToonMat(0x144296);
        const darkM = LS.makeToonMat(0x28303b), glassM = LS.makeEmissiveMat(0x6495c4, 0xffdfa0, 0.28);
        const headM = new THREE.MeshBasicMaterial({ color: 0xfff8d6 }), tailM = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        [[-7.4, 5.4], [0, 8.8], [7.4, 5.4]].forEach(c => {
          const body = new THREE.Mesh(new THREE.BoxGeometry(c[1], 1.56, 1.92), whiteM); body.position.set(c[0], 1.28, 0); body.castShadow = true; train.add(body);
          const roof = new THREE.Mesh(new THREE.BoxGeometry(c[1], 0.24, 1.54), whiteM); roof.position.set(c[0], 2.15, 0); train.add(roof);
          const stripe = new THREE.Mesh(new THREE.BoxGeometry(c[1] + 0.04, 0.22, 1.96), blueM); stripe.position.set(c[0], 1.02, 0); train.add(stripe);
          const win = new THREE.Mesh(new THREE.BoxGeometry(c[1] - 0.6, 0.42, 1.97), glassM); win.position.set(c[0], 1.52, 0); train.add(win);
          const bogie = new THREE.Mesh(new THREE.BoxGeometry(c[1] - 0.5, 0.42, 1.52), darkM); bogie.position.set(c[0], 0.32, 0); train.add(bogie);
        });
        [-4.55, 4.55].forEach(gx => {
          const gap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.52, 1.72), darkM); gap.position.set(gx, 1.28, 0); train.add(gap);
          const panto = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.8), darkM); panto.position.set(gx, 2.58, 0); train.add(panto);
        });
        [-1, 1].forEach(side => {
          const nose1 = new THREE.Mesh(new THREE.SphereGeometry(1.02, 14, 10), whiteM);
          nose1.scale.set(2.8, 0.86, 0.94); nose1.position.set(side * 10.6, 1.08, 0); train.add(nose1);
          const cab = new THREE.Mesh(new THREE.SphereGeometry(0.76, 12, 8), glassM);
          cab.scale.set(1.5, 0.48, 0.95); cab.position.set(side * 10.8, 1.58, 0); train.add(cab);
          [-0.44, 0.44].forEach(lz => {
            const l = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), side > 0 ? headM : tailM);
            l.position.set(side * 12.6, 0.84, lz); train.add(l);
          });
        });
      }

      stationGroup.add(train);
      return train;
    }
  };

  let _giraffeHideTex = null;
  LS.createGiraffeHideTexture = function () {
    if (_giraffeHideTex) return _giraffeHideTex;
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f4de9e';
    ctx.fillRect(0, 0, 128, 128);
    // Warm chestnut polygonal spots separated by cream network lines
    const cols = ['#9c5526', '#8d4a20', '#ab602b', '#944f22'];
    for (let gy = 0; gy < 5; gy++) {
      for (let gx = 0; gx < 5; gx++) {
        const cx = gx * 26 + ((gy % 2) * 12) + 8;
        const cy = gy * 26 + 10;
        ctx.fillStyle = cols[(gx + gy * 3) % cols.length];
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 6);
        ctx.lineTo(cx + 2, cy - 11);
        ctx.lineTo(cx + 11, cy - 3);
        ctx.lineTo(cx + 8, cy + 9);
        ctx.lineTo(cx - 5, cy + 10);
        ctx.lineTo(cx - 11, cy + 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    _giraffeHideTex = new THREE.CanvasTexture(c);
    _giraffeHideTex.wrapS = _giraffeHideTex.wrapT = THREE.RepeatWrapping;
    return _giraffeHideTex;
  };

  let _zebraHideTex = null;
  LS.createZebraHideTexture = function () {
    if (_zebraHideTex) return _zebraHideTex;
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f8f5ee';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#232022';
    for (let x = 0; x < 128; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.quadraticCurveTo(x + 5, 42, x + 2, 84);
      ctx.quadraticCurveTo(x - 1, 108, x + 2, 128);
      ctx.lineTo(x + 8, 128);
      ctx.quadraticCurveTo(x + 5, 108, x + 8, 84);
      ctx.quadraticCurveTo(x + 11, 42, x + 6, 0);
      ctx.closePath();
      ctx.fill();
    }
    _zebraHideTex = new THREE.CanvasTexture(c);
    _zebraHideTex.wrapS = _zebraHideTex.wrapT = THREE.RepeatWrapping;
    return _zebraHideTex;
  };

  LS.createSandstoneTexture = function () {
    if (texCache.sandstone) return texCache.sandstone;
    const S = LS.isHD ? 256 : 128;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b98d5c';
    ctx.fillRect(0, 0, S, S);
    // Painterly striated African kopje granite & sandstone rock strata
    const bands = ['#a37648', '#c89e6b', '#8d643d', '#d4ae7a', '#996f45'];
    for (let y = 0; y < S; y += 12) {
      ctx.fillStyle = bands[(y / 12) % bands.length];
      ctx.globalAlpha = 0.52;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= S; x += 16) {
        ctx.lineTo(x, y + Math.sin(x * 0.06 + y * 0.15) * 4);
      }
      ctx.lineTo(S, y + 14);
      ctx.lineTo(0, y + 14);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Weathered rock fissures & sunlit warm mineral flecks
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = i % 3 === 0 ? 'rgba(72,46,24,0.28)' : 'rgba(246,222,182,0.22)';
      ctx.fillRect((i * 37) % S, (i * 71) % S, 4 + (i % 6), 2);
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    texCache.sandstone = tex;
    return tex;
  };

  LS.createThatchTexture = function () {
    if (texCache.thatch) return texCache.thatch;
    const S = LS.isHD ? 256 : 128;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#cfa154';
    ctx.fillRect(0, 0, S, S);
    // Layered bundled golden straw thatch rows
    for (let row = 0; row < S; row += 16) {
      ctx.fillStyle = 'rgba(116, 76, 28, 0.34)';
      ctx.fillRect(0, row + 13, S, 3);
      for (let x = 0; x < S; x += 3) {
        const shade = ((x * 13 + row * 7) % 3);
        ctx.fillStyle = shade === 0 ? '#e6be72' : (shade === 1 ? '#b8863c' : '#d9aa58');
        ctx.fillRect(x, row, 2, 14 + ((x + row) % 3));
      }
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    texCache.thatch = tex;
    return tex;
  };

  LS.createTermiteClayTexture = function () {
    if (texCache.termiteClay) return texCache.termiteClay;
    const S = 128;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b65b36';
    ctx.fillRect(0, 0, S, S);
    for (let x = 0; x < S; x += 6) {
      ctx.fillStyle = x % 12 === 0 ? 'rgba(138,56,28,0.42)' : 'rgba(222,138,88,0.28)';
      ctx.fillRect(x, 0, 3, S);
    }
    for (let i = 0; i < 120; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(92,38,18,0.24)' : 'rgba(242,172,118,0.22)';
      ctx.beginPath();
      ctx.arc((i * 29) % S, (i * 53) % S, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    texCache.termiteClay = tex;
    return tex;
  };

  LS.createContactShadowTexture = function () {
    if (texCache.contactShadow) return texCache.contactShadow;
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
    g.addColorStop(0, 'rgba(28, 24, 36, 0.36)');
    g.addColorStop(0.55, 'rgba(28, 24, 36, 0.16)');
    g.addColorStop(1, 'rgba(28, 24, 36, 0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    texCache.contactShadow = tex;
    return tex;
  };

  LS.createFabricTexture = function () {
    if (texCache.fabric) return texCache.fabric;
    const S = 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    // Neutral bright linen/cotton base so multiplying by any outfit color stays true & vibrant
    ctx.fillStyle = '#f3f2ef';
    ctx.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 4) {
      ctx.fillStyle = (y % 8 === 0) ? 'rgba(0,0,0,0.045)' : 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, y, S, 2);
    }
    for (let x = 0; x < S; x += 4) {
      ctx.fillStyle = (x % 8 === 0) ? 'rgba(0,0,0,0.038)' : 'rgba(255,255,255,0.05)';
      ctx.fillRect(x, 0, 2, S);
    }
    // Subtle organic slub threads for tactile woven cloth look
    for (let i = 0; i < 140; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0,0,0,0.028)' : 'rgba(255,255,255,0.05)';
      ctx.fillRect((i * 41) % S, (i * 67) % S, 12 + (i % 14), 1);
    }
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    texCache.fabric = tex;
    return tex;
  };

  LS.createHairTexture = function () {
    if (texCache.hairStrands) return texCache.hairStrands;
    const S = 256;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#e6e4e2';
    ctx.fillRect(0, 0, S, S);
    // Ultra-fine silky hair fiber variation (soft & natural, never harsh ribbed lines)
    for (let x = 0; x < S; x += 2) {
      const v = Math.sin(x * 0.28) * 0.5 + Math.cos(x * 0.71) * 0.5;
      const lum = Math.round(228 + v * 14);
      ctx.fillStyle = 'rgb(' + lum + ',' + lum + ',' + lum + ')';
      ctx.fillRect(x, 0, 2, S);
    }
    // Soft silky studio sheen band across crown/mid-hair
    const sheen = ctx.createLinearGradient(0, S * 0.14, 0, S * 0.54);
    sheen.addColorStop(0.0, 'rgba(255,255,255,0.0)');
    sheen.addColorStop(0.42, 'rgba(255,252,248,0.22)');
    sheen.addColorStop(0.56, 'rgba(255,252,248,0.14)');
    sheen.addColorStop(1.0, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, S * 0.14, S, S * 0.40);
    const tex = finalizeTex(new THREE.CanvasTexture(c));
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    texCache.hairStrands = tex;
    return tex;
  };

  LS.createRealisticFaceTexture = function (opts) {
    const cfg = Object.assign({
      skinHex: 0xf4c4a2,
      hairHex: 0x3b251b,
      eyeColor: '#3a2216',
      eyeHighlight: '#8d5d3b',
      blush: 'rgba(228, 118, 108, 0.34)',
      portrait: null,
      smileTeeth: false,
      charismaticMale: false,
      goatee: false,
      blink: false,
      happy: false,
      elder: false,
      mustache: false
    }, opts || {});

    const S = 1024;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    ctx.scale(2, 2); // Crisp 1024x1024 supersampled rendering in 512x512 virtual space!
    ctx.clearRect(0, 0, 512, 512);

    const isLaila = cfg.portrait === 'laila';
    const isSalma = cfg.portrait === 'salma';
    const isGirlPortrait = isLaila || isSalma;
    const isCharisMale = Boolean(cfg.charismaticMale);

    const r = (cfg.skinHex >> 16) & 255;
    const g = (cfg.skinHex >> 8) & 255;
    const b = cfg.skinHex & 255;
    const skinLuma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isDarkSkin = skinLuma < 0.58;

    const hr = (cfg.hairHex >> 16) & 255;
    const hg = (cfg.hairHex >> 8) & 255;
    const hb = cfg.hairHex & 255;
    const browCol = cfg.elder ? '#a8a8ad'
      : (isCharisMale ? '#18110e'
        : (isLaila ? '#261812' : (isSalma ? '#352118'
          : ('rgb(' + Math.max(20, Math.round(hr * 0.78)) + ',' + Math.max(14, Math.round(hg * 0.78)) + ',' + Math.max(12, Math.round(hb * 0.78)) + ')'))));

    function drawSoftShade(x, y, rx, ry, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, ry / rx);
      const gr = ctx.createRadialGradient(0, 0, rx * 0.06, 0, 0, rx);
      gr.addColorStop(0, color);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 1. Sculpted Soft Portrait Skin Shading (orbital depth, bridge glow, nostrils & warm cheeks)
    const eyeCXLeft = isGirlPortrait ? 154 : (isCharisMale ? 170 : 166);
    const eyeCXRight = 512 - eyeCXLeft;
    const eyeCY = isSalma ? 256 : (isCharisMale ? 242 : 248);

    const socketTint = isDarkSkin ? 'rgba(34, 16, 8, 0.28)' : 'rgba(176, 110, 82, 0.16)';
    drawSoftShade(eyeCXLeft, eyeCY - 6, 68, 42, socketTint);
    drawSoftShade(eyeCXRight, eyeCY - 6, 68, 42, socketTint);

    // Subtle nose-bridge glow, contoured nose shadow & nostril crescents
    drawSoftShade(256, 294, isCharisMale ? 16 : 14, 24, isDarkSkin ? 'rgba(255, 224, 198, 0.19)' : 'rgba(255, 250, 245, 0.32)');
    drawSoftShade(256, 314, isCharisMale ? 20 : 16, 11, isDarkSkin ? 'rgba(255, 224, 198, 0.20)' : 'rgba(255, 252, 248, 0.42)');
    drawSoftShade(256, 326, isCharisMale ? 26 : 22, 9, isDarkSkin ? 'rgba(30, 14, 8, 0.36)' : 'rgba(160, 92, 66, 0.28)');
    ctx.strokeStyle = isDarkSkin ? 'rgba(36, 14, 8, 0.56)' : 'rgba(146, 82, 60, 0.52)';
    ctx.lineWidth = isCharisMale ? 3.2 : 2.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(isCharisMale ? 240 : 244, 322, isCharisMale ? 5.2 : 4.4, 0.2 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(isCharisMale ? 272 : 268, 322, isCharisMale ? 5.2 : 4.4, 0.1 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Rich Warm Portrait Cheek Blush (or sculpted bronze cheekbones for charismaticMale!)
    if (isCharisMale) {
      drawSoftShade(126, 296, 52, 22, 'rgba(255, 212, 178, 0.15)');
      drawSoftShade(386, 296, 52, 22, 'rgba(255, 212, 178, 0.15)');
      drawSoftShade(118, 336, 54, 28, 'rgba(28, 12, 6, 0.28)');
      drawSoftShade(394, 336, 54, 28, 'rgba(28, 12, 6, 0.28)');
      // Warm comedian laugh lines beside the grin
      ctx.strokeStyle = 'rgba(34, 16, 10, 0.36)';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(192, 334); ctx.quadraticCurveTo(176, 366, 184, 396); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(320, 334); ctx.quadraticCurveTo(336, 366, 328, 396); ctx.stroke();
    } else {
      const cheekCol = isLaila ? 'rgba(222, 104, 78, 0.44)'
        : (isSalma ? 'rgba(244, 122, 138, 0.48)'
          : (isDarkSkin ? 'rgba(192, 86, 70, 0.30)' : 'rgba(232, 114, 108, 0.32)'));
      const cheekY = isSalma ? 320 : 314;
      drawSoftShade(116, cheekY, 64, 34, cheekCol);
      drawSoftShade(396, cheekY, 64, 34, cheekCol);

      if (isGirlPortrait) {
        ctx.strokeStyle = isSalma ? 'rgba(232, 106, 124, 0.55)' : 'rgba(198, 86, 66, 0.48)';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        [-1, 1].forEach(side => {
          const bx = side < 0 ? 112 : 400;
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(bx + i * 11 - 2, cheekY - 12);
            ctx.lineTo(bx + i * 11 + 4, cheekY + 1);
            ctx.stroke();
          }
        });
      }
    }

    // 2. Bold Sculpted Portrait Eyebrows (confident clean arched shape + fine hair feathering!)
    function drawBrow(side) {
      ctx.save();
      const innerX = side < 0 ? (eyeCXLeft + 56) : (eyeCXRight - 56);
      const midX = side < 0 ? (eyeCXLeft + 2) : (eyeCXRight - 2);
      const outerX = side < 0 ? (eyeCXLeft - 62) : (eyeCXRight + 62);
      const baseY = isSalma ? 186 : (isCharisMale ? 182 : 176);
      const archLift = isLaila ? 22 : (isCharisMale ? 14 : (isSalma ? 15 : 16));
      const thick = isLaila ? 13.5 : (isSalma ? 14.0 : (isCharisMale ? 12.2 : (cfg.elder ? 11.5 : 10.0)));

      ctx.fillStyle = browCol;
      ctx.globalAlpha = 0.94;
      ctx.beginPath();
      ctx.moveTo(innerX, baseY + thick * 0.45);
      ctx.quadraticCurveTo(midX, baseY - archLift - thick * 0.52, outerX, baseY + 6);
      ctx.quadraticCurveTo(midX, baseY - archLift + thick * 0.58, innerX, baseY + thick * 0.45);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = browCol;
      ctx.globalAlpha = 0.96;
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      for (let i = 0; i < 16; i++) {
        const t = i / 15;
        const bx = (1 - t) * (1 - t) * innerX + 2 * (1 - t) * t * midX + t * t * outerX;
        const by = (1 - t) * (1 - t) * (baseY + 2) + 2 * (1 - t) * t * (baseY - archLift) + t * t * (baseY + 6);
        ctx.beginPath();
        ctx.moveTo(bx, by + 4);
        ctx.lineTo(bx + side * 6.5, by - 4.5);
        ctx.stroke();
      }
      ctx.restore();
    }
    drawBrow(-1);
    drawBrow(1);

    // 3. Portrait-Inspired High-Detail Luminous Eyes (big expressive warm brown eyes, double eyelid crease, lush lashes & dual catchlights!)
    function drawEye(cx, side) {
      const cy = eyeCY;
      const ew = isSalma ? 63 : (isLaila ? 61 : (isCharisMale ? 46 : 46));
      const ehTop = isSalma ? 44 : (isLaila ? 41 : (isCharisMale ? 20 : 28));
      const ehBot = isSalma ? 35 : (isLaila ? 32 : (isCharisMale ? 15 : 22));

      // Crisp double-eyelid crease fold above eye
      ctx.strokeStyle = isDarkSkin ? 'rgba(34, 16, 8, 0.62)' : 'rgba(116, 62, 44, 0.64)';
      ctx.lineWidth = isGirlPortrait ? 3.8 : 3.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - ew * 0.88, cy - ehTop * 0.54);
      ctx.quadraticCurveTo(cx, cy - ehTop * 1.42, cx + ew * 0.90, cy - ehTop * 0.46);
      ctx.stroke();
      if (isCharisMale) {
        // Warm laughing eye crinkles at outer corners (Dave Chappelle + Thierry Henry warm charm!)
        ctx.strokeStyle = 'rgba(34, 16, 8, 0.42)';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx + side * (ew + 2), cy + 2);
        ctx.lineTo(cx + side * (ew + 15), cy - 3);
        ctx.moveTo(cx + side * (ew + 2), cy + 8);
        ctx.lineTo(cx + side * (ew + 14), cy + 12);
        ctx.stroke();
      }

      if (cfg.blink || cfg.happy) {
        ctx.strokeStyle = '#1b0d08';
        ctx.lineWidth = isGirlPortrait ? 9.5 : 7.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (cfg.happy) {
          ctx.moveTo(cx - ew * 0.90, cy + 10);
          ctx.quadraticCurveTo(cx, cy - ehTop * 0.82, cx + ew * 0.90, cy + 10);
        } else {
          ctx.moveTo(cx - ew * 0.90, cy + 2);
          ctx.quadraticCurveTo(cx, cy + ehBot * 0.72, cx + ew * 0.90, cy + 2);
        }
        ctx.stroke();
        ctx.lineWidth = 4.6;
        ctx.beginPath();
        ctx.moveTo(cx + side * (ew * 0.80), cy + 4);
        ctx.lineTo(cx + side * (ew * 1.08), cfg.happy ? cy - 8 : cy + 9);
        ctx.stroke();
        return;
      }

      // Expressive Almond-Round Sclera Clip Shape
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - ew, cy + 3);
      ctx.bezierCurveTo(cx - ew * 0.68, cy - ehTop, cx + ew * 0.68, cy - ehTop, cx + ew, cy + 3);
      ctx.bezierCurveTo(cx + ew * 0.65, cy + ehBot, cx - ew * 0.65, cy + ehBot, cx - ew, cy + 3);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();

      // Subtle warm inner tear-duct caruncle
      const innerX = cx - side * (ew * 0.88);
      ctx.fillStyle = 'rgba(232, 138, 130, 0.52)';
      ctx.beginPath();
      ctx.arc(innerX, cy + 3, 9.5, 0, Math.PI * 2);
      ctx.fill();

      // Soft cool-lilac upper eyelid shadow across sclera
      const scGrad = ctx.createLinearGradient(cx, cy - ehTop, cx, cy + 2);
      scGrad.addColorStop(0, 'rgba(68, 70, 108, 0.34)');
      scGrad.addColorStop(0.75, 'rgba(68, 70, 108, 0.08)');
      scGrad.addColorStop(1, 'rgba(68, 70, 108, 0)');
      ctx.fillStyle = scGrad;
      ctx.fillRect(cx - ew - 4, cy - ehTop - 4, ew * 2 + 8, ehTop + 8);

      // Rich Portrait Layered Iris (velvety deep espresso top + luminous warm amber-brown lower crescent!)
      const ix = cx - side * 2.0;
      const iy = cy + 1.0;
      const ir = isSalma ? 35.0 : (isLaila ? 33.5 : 23.0);
      const irisGrad = ctx.createLinearGradient(ix, iy - ir, ix, iy + ir);
      irisGrad.addColorStop(0.0, '#140906');
      irisGrad.addColorStop(0.32, cfg.eyeColor);
      irisGrad.addColorStop(0.72, cfg.eyeHighlight);
      irisGrad.addColorStop(1.0, '#d29a64');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(ix, iy, ir, 0, Math.PI * 2);
      ctx.fill();

      // Luminous lower-iris warm honey crescent glow (signature life-spark from the portraits!)
      const glowGrad = ctx.createRadialGradient(ix, iy + ir * 0.44, 3, ix, iy + ir * 0.44, ir * 0.72);
      glowGrad.addColorStop(0.0, 'rgba(250, 214, 160, 0.82)');
      glowGrad.addColorStop(0.55, 'rgba(202, 140, 82, 0.35)');
      glowGrad.addColorStop(1.0, 'rgba(202, 140, 82, 0.0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(ix, iy, ir * 0.92, 0, Math.PI * 2);
      ctx.fill();

      // 24 fine radial iris texture fibers
      ctx.strokeStyle = 'rgba(255, 240, 210, 0.24)';
      ctx.lineWidth = 1.6;
      for (let a = 0; a < 24; a++) {
        const ang = (a / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(ix + Math.cos(ang) * (ir * 0.42), iy + Math.sin(ang) * (ir * 0.42));
        ctx.lineTo(ix + Math.cos(ang) * (ir * 0.88), iy + Math.sin(ang) * (ir * 0.88));
        ctx.stroke();
      }

      // Crisp dark outer limbal ring
      ctx.strokeStyle = '#140905';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(ix, iy, ir - 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Deep jet-black centered pupil
      ctx.fillStyle = '#080504';
      ctx.beginPath();
      ctx.arc(ix, iy, ir * 0.44, 0, Math.PI * 2);
      ctx.fill();

      // Signature Dual Luminous Portrait Corneal Catchlights!
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(ix - ir * 0.33, iy - ir * 0.29, ir * 0.30, ir * 0.24, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 253, 248, 0.96)';
      ctx.beginPath();
      ctx.arc(ix + ir * 0.34, iy + ir * 0.29, ir * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(ix + ir * 0.16, iy - ir * 0.44, ir * 0.09, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Lush Bold Tapered Upper Eyelash Band (filled curved lash line, thicker toward outer wing!)
      ctx.fillStyle = '#180b07';
      ctx.beginPath();
      ctx.moveTo(cx - ew * 1.00, cy + 3);
      ctx.bezierCurveTo(cx - ew * 0.66, cy - ehTop * 1.24, cx + ew * 0.68, cy - ehTop * 1.26, cx + ew * 1.06, cy + 2);
      ctx.bezierCurveTo(cx + ew * 0.66, cy - ehTop * 0.78, cx - ew * 0.64, cy - ehTop * 0.80, cx - ew * 1.00, cy + 3);
      ctx.closePath();
      ctx.fill();

      // Delicate Curved Outer Eyelash Flicks (matching Laila & Salma's expressive portrait lashes!)
      ctx.strokeStyle = '#180b07';
      ctx.lineCap = 'round';
      const lashCount = isGirlPortrait ? 3 : 1;
      for (let li = 0; li < lashCount; li++) {
        ctx.lineWidth = (isGirlPortrait ? 4.6 : 3.2) - li * 0.8;
        const lx = cx + side * (ew * (0.86 - li * 0.12));
        const ly = cy - 3 - li * 8.5;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.quadraticCurveTo(lx + side * 9, ly - 4.5, lx + side * (16 - li * 2.0), ly - (10 - li * 1.6));
        ctx.stroke();
      }

      // Soft lower lash contour & subtle lower eyelid rim
      ctx.strokeStyle = isDarkSkin ? 'rgba(34, 16, 10, 0.62)' : 'rgba(64, 34, 24, 0.56)';
      ctx.lineWidth = isGirlPortrait ? 3.2 : 2.6;
      ctx.beginPath();
      ctx.moveTo(cx - ew * 0.72, cy + ehBot * 0.54);
      ctx.quadraticCurveTo(cx, cy + ehBot * 1.08, cx + ew * 0.74, cy + ehBot * 0.52);
      ctx.stroke();

      if (cfg.elder) {
        ctx.strokeStyle = isDarkSkin ? 'rgba(42, 20, 12, 0.44)' : 'rgba(128, 86, 68, 0.44)';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(cx + side * (ew + 2), cy + 3);
        ctx.lineTo(cx + side * (ew + 16), cy + 7);
        ctx.moveTo(cx + side * (ew + 1), cy + 10);
        ctx.lineTo(cx + side * (ew + 13), cy + 17);
        ctx.stroke();
      }
    }
    drawEye(eyeCXLeft, -1);
    drawEye(eyeCXRight, 1);

    // 4. Expressive Portrait Mouth, Warm Pearly Smile & Soft Shaded Lips
    const my = isSalma ? 378 : 374;
    const lipUpperCol = isLaila ? 'rgba(196, 98, 80, 0.86)'
      : (isSalma ? 'rgba(226, 114, 124, 0.84)'
        : (isDarkSkin ? 'rgba(116, 56, 48, 0.82)' : 'rgba(196, 104, 98, 0.76)'));
    const lipLowerCol = isLaila ? 'rgba(218, 114, 96, 0.88)'
      : (isSalma ? 'rgba(244, 130, 142, 0.88)'
        : (isDarkSkin ? 'rgba(146, 76, 66, 0.78)' : 'rgba(218, 122, 118, 0.74)'));
    const lipLineCol = isDarkSkin ? 'rgba(44, 18, 12, 0.88)' : 'rgba(104, 44, 38, 0.86)';

    if (cfg.happy || cfg.smileTeeth) {
      const mw = cfg.happy ? 58 : (isSalma ? 52 : 54);
      const mh = cfg.happy ? 38 : (isSalma ? 27 : 28);

      // Warm interior mouth cavity
      ctx.fillStyle = '#c4525c';
      ctx.beginPath();
      ctx.moveTo(256 - mw, my - 4);
      ctx.quadraticCurveTo(256, my + 7, 256 + mw, my - 4);
      ctx.quadraticCurveTo(256, my + mh + 9, 256 - mw, my - 4);
      ctx.closePath();
      ctx.fill();

      // Clean bright pearly upper teeth (matching Laila & Salma's warm beaming portrait smiles!)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(256 - mw * 0.84, my - 1);
      ctx.quadraticCurveTo(256, my + 7, 256 + mw * 0.84, my - 1);
      ctx.quadraticCurveTo(256, my + mh * 0.80, 256 - mw * 0.84, my - 1);
      ctx.closePath();
      ctx.fill();

      // Subtle upper lip cupid's bow contour
      ctx.fillStyle = lipUpperCol;
      ctx.beginPath();
      ctx.moveTo(256 - mw, my - 3);
      ctx.quadraticCurveTo(256 - mw * 0.40, my - 13, 256, my - 7);
      ctx.quadraticCurveTo(256 + mw * 0.40, my - 13, 256 + mw, my - 3);
      ctx.quadraticCurveTo(256, my + 5, 256 - mw, my - 3);
      ctx.closePath();
      ctx.fill();

      // Soft rosy lower lip cushion below smile + glossy highlight
      ctx.fillStyle = lipLowerCol;
      ctx.beginPath();
      ctx.moveTo(256 - mw * 0.78, my + mh * 0.46);
      ctx.quadraticCurveTo(256, my + mh + 22, 256 + mw * 0.78, my + mh * 0.46);
      ctx.quadraticCurveTo(256, my + mh + 7, 256 - mw * 0.78, my + mh * 0.46);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 250, 246, 0.56)';
      ctx.beginPath();
      ctx.ellipse(256, my + mh + 8, 16, 4.0, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crisp smile outline & cute corner dimples
      ctx.strokeStyle = lipLineCol;
      ctx.lineWidth = 3.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(256 - mw - 3, my - 5);
      ctx.quadraticCurveTo(256, my + 7, 256 + mw + 3, my - 5);
      ctx.stroke();
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(256 - mw * 0.88, my + 2);
      ctx.quadraticCurveTo(256, my + mh + 9, 256 + mw * 0.88, my + 2);
      ctx.stroke();

      // Subtle under-lip chin dimple shadow
      drawSoftShade(256, my + mh + 26, 22, 8, isDarkSkin ? 'rgba(34, 16, 10, 0.28)' : 'rgba(148, 86, 68, 0.24)');
    } else {
      // Closed realistic friendly smile for NPCs
      ctx.fillStyle = lipUpperCol;
      ctx.beginPath();
      ctx.moveTo(214, my + 1);
      ctx.quadraticCurveTo(236, my - 11, 256, my - 6);
      ctx.quadraticCurveTo(276, my - 11, 298, my + 1);
      ctx.quadraticCurveTo(256, my + 8, 214, my + 1);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = lipLowerCol;
      ctx.beginPath();
      ctx.moveTo(220, my + 2);
      ctx.quadraticCurveTo(256, my + 24, 292, my + 2);
      ctx.quadraticCurveTo(256, my + 9, 220, my + 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 248, 244, 0.42)';
      ctx.beginPath();
      ctx.ellipse(256, my + 11, 14, 3.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = lipLineCol;
      ctx.lineWidth = 3.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(212, my);
      ctx.quadraticCurveTo(256, my + 11, 300, my);
      ctx.stroke();

      drawSoftShade(256, my + 26, 20, 7, isDarkSkin ? 'rgba(34, 16, 10, 0.26)' : 'rgba(148, 92, 74, 0.22)');
    }

    // 5. Sharp Groomed Mustache & Goatee (Thierry Henry / Dave Chappelle style!)
    if (cfg.goatee) {
      ctx.save();
      // Subtle close-cropped shadow stubble along lower jawline
      drawSoftShade(256, 444, 106, 42, 'rgba(18, 13, 11, 0.24)');

      // Crisp neatly trimmed upper-lip mustache curving around the smile
      ctx.fillStyle = 'rgba(20, 14, 12, 0.90)';
      ctx.beginPath();
      ctx.moveTo(256, my - 23);
      ctx.quadraticCurveTo(222, my - 25, 194, my - 4);
      ctx.quadraticCurveTo(190, my + 5, 198, my + 6);
      ctx.quadraticCurveTo(220, my - 10, 256, my - 10);
      ctx.quadraticCurveTo(292, my - 10, 314, my + 6);
      ctx.quadraticCurveTo(322, my + 5, 318, my - 4);
      ctx.quadraticCurveTo(290, my - 25, 256, my - 23);
      ctx.closePath();
      ctx.fill();

      // Subtle side goatee connectors framing the wide grin
      ctx.strokeStyle = 'rgba(20, 14, 12, 0.80)';
      ctx.lineWidth = 8.5;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(198, my + 4); ctx.quadraticCurveTo(194, my + 34, 212, my + 56); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(314, my + 4); ctx.quadraticCurveTo(318, my + 34, 300, my + 56); ctx.stroke();

      // Neat soul patch + sculpted chin goatee
      ctx.fillStyle = 'rgba(20, 14, 12, 0.86)';
      ctx.beginPath();
      ctx.ellipse(256, my + 44, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(206, my + 52);
      ctx.quadraticCurveTo(256, my + 46, 306, my + 52);
      ctx.quadraticCurveTo(300, my + 84, 256, my + 90);
      ctx.quadraticCurveTo(212, my + 84, 206, my + 52);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const tex = finalizeTex(new THREE.CanvasTexture(c));
    return tex;
  };
})(window.LailaSalma);
