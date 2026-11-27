window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  const ASSET_MANIFEST = {
    tokyo_house_2f: 'assets/hd/tokyo_house_2f.glb',
    tokyo_house_1f: 'assets/hd/tokyo_house_1f.glb',
    kyoto_machiya: 'assets/hd/kyoto_machiya.glb',
    sakura_school: 'assets/hd/sakura_school.glb',
    ichiban_ramen: 'assets/hd/ichiban_ramen.glb',
    anime_tree_green: 'assets/hd/anime_tree_green.glb',
    anime_tree_sakura: 'assets/hd/anime_tree_sakura.glb',
    anime_tree_maple: 'assets/hd/anime_tree_maple.glb',
    anime_tree_willow: 'assets/hd/anime_tree_willow.glb',
    anime_tree_cedar: 'assets/hd/anime_tree_cedar.glb',
    anime_shrub: 'assets/hd/anime_shrub.glb',
    utility_pole: 'assets/hd/utility_pole.glb',
    anime_vending: 'assets/hd/anime_vending.glb',
    anime_bike: 'assets/hd/anime_bike.glb',
    anime_shinkansen: 'assets/hd/anime_shinkansen.glb',
    anime_duck_mallard: 'assets/hd/anime_duck_mallard.glb',
    anime_duck_white: 'assets/hd/anime_duck_white.glb',
    anime_shiba: 'assets/hd/anime_shiba.glb',
    anime_cat: 'assets/hd/anime_cat.glb',
    anime_kitsune: 'assets/hd/anime_kitsune.glb',
    anime_acacia: 'assets/hd/anime_acacia.glb',
    anime_baobab: 'assets/hd/anime_baobab.glb',
    anime_giraffe: 'assets/hd/anime_giraffe.glb',
    anime_elephant: 'assets/hd/anime_elephant.glb',
    anime_lion_cub: 'assets/hd/anime_lion_cub.glb',
    anime_zebra: 'assets/hd/anime_zebra.glb',
    anime_lion_king: 'assets/hd/anime_lion_king.glb',
    anime_lioness: 'assets/hd/anime_lioness.glb',
    anime_flamingo: 'assets/hd/anime_flamingo.glb',
    anime_safari_jeep: 'assets/hd/anime_safari_jeep.glb',
    anime_hippo: 'assets/hd/anime_hippo.glb',
    anime_meerkat: 'assets/hd/anime_meerkat.glb',
    anime_cheetah: 'assets/hd/anime_cheetah.glb'
  };

  const cache = {};
  const animatedUniforms = [];
  let toonGradientMap = null;

  function hash01(n) {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return v - Math.floor(v);
  }

  function getAnimeGradientMap() {
    if (LS.ghibli && LS.ghibli.getToonRamp) return LS.ghibli.getToonRamp();
    if (toonGradientMap) return toonGradientMap;
    // Pure Studio Ghibli 3-band painterly cel ramp fallback
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
    toonGradientMap = tex;
    return tex;
  }

  function stylizeLoadedGLB(root) {
    const grad = getAnimeGradientMap();
    const aniso = LS.maxAnisotropy || 8;
    root.traverse(obj => {
      if (!obj.isMesh) return;
      const oldMat = obj.material;
      if (!oldMat) return;
      const mName = (oldMat.name || '').toLowerCase();
      const isAlphaLeaf = oldMat.alphaTest > 0 || mName.indexOf('leaf') >= 0 || mName.indexOf('foliage') >= 0 || mName.indexOf('willow_crown') >= 0 || mName.indexOf('willow_vines') >= 0 || mName.indexOf('cedar_needles') >= 0;
      const isGlossy = mName.indexOf('glass') >= 0 || mName.indexOf('chrome') >= 0 || mName.indexOf('metal') >= 0 || mName.indexOf('ac_') >= 0 || mName.indexOf('vent') >= 0;

      if (oldMat.map) oldMat.map.anisotropy = aniso;
      if (oldMat.normalMap) oldMat.normalMap.anisotropy = aniso;

      if (isAlphaLeaf) {
        const leafMat = new THREE.MeshToonMaterial({
          map: oldMat.map,
          color: oldMat.color ? oldMat.color.clone() : new THREE.Color(0xffffff),
          gradientMap: grad,
          vertexColors: !!obj.geometry.attributes.color,
          alphaTest: 0.45,
          side: THREE.DoubleSide
        });
        leafMat.name = oldMat.name;
        obj.material = leafMat;
        obj.castShadow = true;
        obj.receiveShadow = true;
      } else if (!isGlossy) {
        // Cel-toon + embedded tangent-space Normal Map + baked Vertex AO!
        const toon = new THREE.MeshToonMaterial({
          map: oldMat.map || null,
          normalMap: oldMat.normalMap || null,
          normalScale: new THREE.Vector2(0.85, 0.85),
          color: oldMat.color ? oldMat.color.clone() : new THREE.Color(0xffffff),
          emissive: oldMat.emissive ? oldMat.emissive.clone() : new THREE.Color(0x000000),
          emissiveIntensity: oldMat.emissiveIntensity || 1.0,
          gradientMap: grad,
          vertexColors: !!obj.geometry.attributes.color,
          side: oldMat.side
        });
        toon.name = oldMat.name;
        obj.material = toon;
        obj.castShadow = true;
        obj.receiveShadow = true;
      } else {
        oldMat.envMapIntensity = 1.35;
        oldMat.needsUpdate = true;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }

  // -------------------------------------------------------------------------
  // 1. AAA GLSL Custom Shimmering Anime Water Shader (Fresnel + Caustics + Flow)
  // -------------------------------------------------------------------------
  LS.createAAAWaterMaterial = function (opacity, side) {
    const uniforms = {
      uTime: { value: 0.0 },
      uTimeMode: { value: LS.state ? LS.state.timeMode : 0.0 },
      uOpacity: { value: opacity !== undefined ? opacity : 0.92 }
    };
    animatedUniforms.push(uniforms);

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
        'float wave(vec2 p) {',
        '  return sin(p.x * 1.6 + uTime * 1.35) * cos(p.y * 1.4 - uTime * 1.05)',
        '       + 0.5 * sin(p.x * 3.1 - p.y * 2.4 + uTime * 1.9);',
        '}',
        'void main() {',
        '  vec2 p = vWorldPos.xz * 0.55;',
        '  float w1 = wave(p + vec2(0.0, uTime * 0.45));',
        '  float w2 = wave(p * 1.65 - vec2(uTime * 0.3, -uTime * 0.6));',
        '  vec3 N = normalize(vec3((w1 - w2) * 0.14, 1.0, (w1 + w2) * 0.14));',
        '  vec3 V = normalize(cameraPosition - vWorldPos);',
        '  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);',
        '  vec3 deepCol = uTimeMode > 1.5 ? vec3(0.06, 0.14, 0.24) : (uTimeMode > 0.5 ? vec3(0.14, 0.28, 0.36) : vec3(0.09, 0.36, 0.45));',
        '  vec3 shallowCol = uTimeMode > 1.5 ? vec3(0.12, 0.25, 0.40) : (uTimeMode > 0.5 ? vec3(0.28, 0.48, 0.54) : vec3(0.18, 0.58, 0.68));',
        '  vec3 skyCol = uTimeMode > 1.5 ? vec3(0.24, 0.36, 0.58) : (uTimeMode > 0.5 ? vec3(1.0, 0.68, 0.42) : vec3(0.68, 0.88, 1.0));',
        '  vec3 col = mix(deepCol, shallowCol, clamp(0.45 + w1 * 0.25, 0.0, 1.0));',
        '  // Sunlit shimmer caustics + Fresnel sky reflection (clamped to avoid bloom blowout!)',
        '  float caust = smoothstep(0.68, 1.18, w1 * 0.6 + w2 * 0.55);',
        '  vec3 L = normalize(vec3(0.65, 0.55, 0.45));',
        '  vec3 H = normalize(L + V);',
        '  float spec = pow(max(dot(N, H), 0.0), 96.0) * (uTimeMode > 1.5 ? 0.25 : (uTimeMode > 0.5 ? 0.44 : 0.52));',
        '  col = mix(col, skyCol, clamp(fresnel * 0.66, 0.0, 0.72));',
        '  col += mix(vec3(0.55, 0.86, 0.96), vec3(0.98, 0.84, 0.62), clamp(uTimeMode, 0.0, 1.0)) * (caust * 0.16 + spec);',
        '  // Soft animated white edge ripple foam along banks (UV.x near 0 or 1)',
        '  float edge = smoothstep(0.08, 0.0, min(vUv.x, 1.0 - vUv.x));',
        '  col = mix(col, vec3(0.90, 0.95, 0.96), edge * (0.42 + 0.18 * sin(vWorldPos.z * 2.5 + uTime * 2.0)));',
        '  gl_FragColor = vec4(clamp(col, 0.0, 0.92), uOpacity);',
        '}'
      ].join('\n')
    });
  };

  // Dedicated Translucent Crystal Kyoto Garden Pond Water Shader (clearly reveals swimming Koi & river pebbles!)
  LS.createAAAPondWaterMaterial = function () {
    const uniforms = {
      uTime: { value: 0.0 },
      uTimeMode: { value: LS.state ? LS.state.timeMode : 0.0 }
    };
    animatedUniforms.push(uniforms);

    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
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
        'varying vec2 vUv;',
        'varying vec3 vWorldPos;',
        'float pondWave(vec2 p) {',
        '  return sin(p.x * 1.45 + uTime * 0.95) * cos(p.y * 1.35 - uTime * 0.85)',
        '       + 0.45 * sin(p.x * 2.9 - p.y * 2.2 + uTime * 1.45);',
        '}',
        'void main() {',
        '  vec2 uvC = (vUv - 0.5) * 2.0;',
        '  float edgeDist = length(uvC);',
        '  vec2 p = vWorldPos.xz * 0.52;',
        '  float w1 = pondWave(p + vec2(uTime * 0.14, uTime * 0.18));',
        '  float w2 = pondWave(p * 1.6 - vec2(uTime * 0.22, -uTime * 0.12));',
        '  vec3 N = normalize(vec3((w1 - w2) * 0.10, 1.0, (w1 + w2) * 0.10));',
        '  vec3 V = normalize(cameraPosition - vWorldPos);',
        '  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);',
        '  vec3 deepJade = uTimeMode > 1.5 ? vec3(0.05, 0.15, 0.24) : (uTimeMode > 0.5 ? vec3(0.11, 0.30, 0.34) : vec3(0.08, 0.38, 0.42));',
        '  vec3 shallowJade = uTimeMode > 1.5 ? vec3(0.10, 0.24, 0.36) : (uTimeMode > 0.5 ? vec3(0.24, 0.48, 0.46) : vec3(0.18, 0.56, 0.54));',
        '  vec3 skyCol = uTimeMode > 1.5 ? vec3(0.22, 0.36, 0.58) : (uTimeMode > 0.5 ? vec3(1.0, 0.68, 0.42) : vec3(0.70, 0.88, 1.0));',
        '  float shallowMask = smoothstep(0.45, 0.96, edgeDist);',
        '  vec3 col = mix(deepJade, shallowJade, shallowMask * 0.72 + clamp(w1 * 0.18, 0.0, 0.25));',
        '  // Gentle sunlit pond caustics + Fresnel sky reflection',
        '  float caust = smoothstep(0.55, 1.15, w1 * 0.65 + w2 * 0.55);',
        '  vec3 L = normalize(vec3(0.65, 0.58, 0.42));',
        '  vec3 H = normalize(L + V);',
        '  float spec = pow(max(dot(N, H), 0.0), 110.0) * (uTimeMode > 1.5 ? 0.22 : 0.48);',
        '  col = mix(col, skyCol, clamp(fresnel * 0.62, 0.0, 0.68));',
        '  col += mix(vec3(0.62, 0.94, 0.92), vec3(0.98, 0.84, 0.62), clamp(uTimeMode, 0.0, 1.0)) * (caust * 0.15 + spec);',
        '  // Soft glistening shoreline meniscus foam around mossy rocks',
        '  float shore = smoothstep(0.84, 0.98, edgeDist);',
        '  col = mix(col, vec3(0.86, 0.94, 0.92), shore * (0.28 + 0.12 * sin(uTime * 1.8 + vWorldPos.x * 2.0)));',
        '  // Crystal translucency in center so colorful Koi & submerged river pebbles shine through!',
        '  float alpha = clamp(0.66 + fresnel * 0.24 + shore * 0.12, 0.62, 0.90);',
        '  gl_FragColor = vec4(clamp(col, 0.0, 0.92), alpha);',
        '}'
      ].join('\n')
    });
  };

  // -------------------------------------------------------------------------
  // 2. AAA Weathered Japanese Neighborhood Street Texture (Reference-Matched!)
  // -------------------------------------------------------------------------
  LS.createAAAStreetTexture = function (style) {
    const isKyoto = style === 'kyoto';
    const W = 512;
    const H = isKyoto ? 512 : 1024;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    if (style === 'safari') {
      // Sun-baked Serengeti red-ochre safari jeep dirt track with warm pebbles & golden grass verges!
      ctx.fillStyle = '#b9824f';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 6400; i++) {
        const px = hash01(i * 3.7 + 1.1) * W;
        const py = hash01(i * 7.9 + 4.3) * H;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(138,88,46,0.34)' : (i % 3 === 1 ? 'rgba(218,174,116,0.28)' : 'rgba(164,108,58,0.28)');
        ctx.fillRect(px, py, 4, 4);
      }
      // Subtle safari jeep twin tire ruts
      ctx.fillStyle = 'rgba(124, 78, 42, 0.22)';
      ctx.fillRect(138, 0, 56, H);
      ctx.fillRect(318, 0, 56, H);
      const gSL = ctx.createLinearGradient(0, 0, 56, 0);
      gSL.addColorStop(0, 'rgba(190,162,78,0.88)'); gSL.addColorStop(1, 'rgba(190,162,78,0)');
      ctx.fillStyle = gSL; ctx.fillRect(0, 0, 56, H);
      const gSR = ctx.createLinearGradient(W, 0, W - 56, 0);
      gSR.addColorStop(0, 'rgba(190,162,78,0.88)'); gSR.addColorStop(1, 'rgba(190,162,78,0)');
      ctx.fillStyle = gSR; ctx.fillRect(W - 56, 0, 56, H);
    } else if (isKyoto) {
      // Rich weathered Kyoto moss-edged granite flagstones
      ctx.fillStyle = '#5e5a53';
      ctx.fillRect(0, 0, W, H);
      for (let r = 0; r < 8; r++) {
        for (let col = 0; col < 6; col++) {
          const x = col * 86 + (r % 2) * 32 - 16;
          const y = r * 64;
          const v = Math.floor((hash01(r * 7.3 + col * 3.1) - 0.5) * 24);
          ctx.fillStyle = 'rgb(' + (112 + v) + ',' + (108 + v) + ',' + (100 + v) + ')';
          ctx.fillRect(x + 3, y + 3, 80, 58);
          ctx.fillStyle = 'rgba(255,250,235,0.09)';
          ctx.fillRect(x + 3, y + 3, 80, 5);
        }
      }
      // Mossy stone verges
      const gL = ctx.createLinearGradient(0, 0, 52, 0);
      gL.addColorStop(0, 'rgba(68,104,54,0.85)'); gL.addColorStop(1, 'rgba(68,104,54,0)');
      ctx.fillStyle = gL; ctx.fillRect(0, 0, 52, H);
      const gR = ctx.createLinearGradient(W, 0, W - 52, 0);
      gR.addColorStop(0, 'rgba(68,104,54,0.85)'); gR.addColorStop(1, 'rgba(68,104,54,0)');
      ctx.fillStyle = gR; ctx.fillRect(W - 52, 0, 52, H);
    } else {
      // Authentic Makoto Shinkai weathered slate-grey Japanese neighborhood asphalt!
      ctx.fillStyle = '#585d66';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 7200; i++) {
        const px = hash01(i * 3.7 + 1.1) * W;
        const py = hash01(i * 7.9 + 4.3) * H;
        const v = 74 + Math.floor(hash01(i * 2.1) * 34);
        ctx.fillStyle = 'rgba(' + v + ',' + (v + 2) + ',' + (v + 8) + ',0.35)';
        ctx.fillRect(px, py, 3, 3);
      }
      // Subtle weathered asphalt patches & tire tracks
      ctx.fillStyle = 'rgba(42, 46, 54, 0.16)';
      ctx.fillRect(145, 0, 62, H);
      ctx.fillRect(305, 0, 62, H);
      // Subtle cast-iron Japanese round street manhole cover
      ctx.fillStyle = 'rgba(44, 48, 56, 0.55)';
      ctx.beginPath(); ctx.arc(365, 760, 24, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(98, 102, 110, 0.45)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(365, 760, 17, 0, Math.PI * 2); ctx.stroke();
      // Crisp white Japanese pedestrian shoulder edge lines + concrete gutter curb!
      ctx.fillStyle = '#8b8e92';
      ctx.fillRect(0, 0, 26, H);
      ctx.fillRect(W - 26, 0, 26, H);
      ctx.fillStyle = 'rgba(244, 242, 232, 0.84)';
      ctx.fillRect(34, 0, 12, H);
      ctx.fillRect(W - 46, 0, 12, H);
      // Iconic Japanese crosswalk-ahead diamond (◇) spaced naturally along the lane!
      ctx.strokeStyle = 'rgba(242, 240, 232, 0.72)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(256, 170); ctx.lineTo(310, 300); ctx.lineTo(256, 430); ctx.lineTo(202, 300);
      ctx.closePath();
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if (!isKyoto) tex.repeat.set(1, 0.45);
    tex.anisotropy = LS.maxAnisotropy || 8;
    return tex;
  };

  // -------------------------------------------------------------------------
  // 3. AAA Assets, Instanced Swaying 3D Grass, Sculpted Mountain Ridges & Wires
  // -------------------------------------------------------------------------
  LS.hdAssets = {
    ready: false,

    preloadAll: function () {
      if (!LS.isHD || typeof THREE.GLTFLoader === 'undefined') {
        return Promise.resolve();
      }
      const loader = new THREE.GLTFLoader();
      const keys = Object.keys(ASSET_MANIFEST);
      const promises = keys.map(key => new Promise(resolve => {
        loader.load(
          ASSET_MANIFEST[key],
          gltf => {
            const root = gltf.scene || gltf.scenes[0];
            if (root) {
              stylizeLoadedGLB(root);
              cache[key] = root;
            }
            resolve();
          },
          undefined,
          err => {
            console.warn('[HD GLB] Failed to load ' + key, err);
            resolve();
          }
        );
      }));
      return Promise.all(promises).then(() => {
        LS.hdAssets.ready = Object.keys(cache).length > 0;
      });
    },

    has: function (key) {
      return !!cache[key];
    },

    clone: function (key, opts) {
      const src = cache[key];
      if (!src) return null;
      const cloned = src.clone(true);
      const cfg = opts || {};
      if (cfg.wallTint || cfg.roofTint || cfg.furTint !== undefined || cfg.accentTint !== undefined || cfg.collarTint !== undefined || cfg.frameTint !== undefined || cfg.tint) {
        cloned.traverse(o => {
          if (!o.isMesh || !o.material) return;
          const nm = (o.material.name || '').toLowerCase();
          if (cfg.wallTint && (nm.indexOf('stucco') >= 0 || nm.indexOf('plaster') >= 0)) {
            o.material = o.material.clone();
            o.material.color.set(cfg.wallTint);
          } else if (cfg.roofTint && (nm.indexOf('kawara') >= 0 || nm.indexOf('tile') >= 0)) {
            o.material = o.material.clone();
            o.material.color.set(cfg.roofTint);
          } else if (cfg.furTint !== undefined && (nm.indexOf('cat_fur') >= 0 || nm.indexOf('fox_fur') >= 0)) {
            o.material = o.material.clone();
            o.material.color.set(cfg.furTint);
          } else if (cfg.accentTint !== undefined && (nm.indexOf('cat_accent') >= 0 || nm.indexOf('fox_tip') >= 0)) {
            o.material = o.material.clone();
            o.material.color.set(cfg.accentTint);
          } else if (cfg.collarTint !== undefined && nm.indexOf('cat_collar') >= 0) {
            o.material = o.material.clone();
            o.material.color.set(cfg.collarTint);
          } else if (cfg.frameTint !== undefined && nm.indexOf('bike_frame') >= 0) {
            o.material = o.material.clone();
            o.material.color.set(cfg.frameTint);
          } else if (cfg.tint) {
            o.material = o.material.clone();
            o.material.color.multiply(new THREE.Color(cfg.tint));
          }
        });
      }
      return cloned;
    },

    // Wind-Swept 3D Grass Blade Clusters in 1 GPU Draw Call (quality-scaled for Android phones!)
    addInstancedGrass: function (parent, bounds, isClearFn, style, countOverride) {
      const qCfg = (LS.ghibli && LS.ghibli.getQualityConfig) ? LS.ghibli.getQualityConfig() : { grassScale: 1.0 };
      if (qCfg.grassScale <= 0) return null;
      const baseCount = countOverride || 14000;
      const count = Math.round(baseCount * qCfg.grassScale);
      const isKyoto = style === 'kyoto';
      const isSafari = style === 'safari';
      const isHome = style === 'home';
      const isEgypt = style === 'egypt';

      // Plush 5-blade 2-segment curved arching meadow patch spread across 0.56m so neighboring patches weave into a lush Miyazaki grass carpet!
      const positions = [];
      const uvs = [];
      const bladeDefs = [
        { a: 0.15, r0: 0.05, w: 0.058, h: 0.40, lean: 0.20 },
        { a: 1.40, r0: 0.20, w: 0.054, h: 0.30, lean: 0.17 },
        { a: 2.66, r0: 0.27, w: 0.060, h: 0.43, lean: 0.22 },
        { a: 3.92, r0: 0.18, w: 0.054, h: 0.26, lean: 0.15 },
        { a: 5.18, r0: 0.25, w: 0.056, h: 0.35, lean: 0.18 }
      ];
      bladeDefs.forEach(b => {
        const ca = Math.cos(b.a), sa = Math.sin(b.a);
        const px = -sa, pz = ca; // perpendicular width axis
        const bx = ca * b.r0, bz = sa * b.r0;
        const mx = bx + ca * (b.lean * 0.42), mz = bz + sa * (b.lean * 0.42);
        const tx = bx + ca * b.lean, tz = bz + sa * b.lean;
        const mh = b.h * 0.56;
        const w0 = b.w, w1 = b.w * 0.56;
        // Lower quad (2 tris): base -> mid
        positions.push(
          bx - px * w0, 0,  bz - pz * w0,
          bx + px * w0, 0,  bz + pz * w0,
          mx + px * w1, mh, mz + pz * w1,

          bx - px * w0, 0,  bz - pz * w0,
          mx + px * w1, mh, mz + pz * w1,
          mx - px * w1, mh, mz - pz * w1
        );
        uvs.push(
          0, 0,  1, 0,  1, 0.55,
          0, 0,  1, 0.55,  0, 0.55
        );
        // Upper tapered tip tri: mid -> gracefully arched tip
        positions.push(
          mx - px * w1, mh,  mz - pz * w1,
          mx + px * w1, mh,  mz + pz * w1,
          tx,           b.h, tz
        );
        uvs.push(0, 0.55,  1, 0.55,  0.5, 1.0);
      });

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.computeVertexNormals();

      const uniforms = {
        uTime: { value: 0.0 },
        uTimeMode: { value: LS.state ? LS.state.timeMode : 0.0 },
        uRootCol: { value: new THREE.Color(isSafari ? 0xb49240 : (isEgypt ? 0x3b843e : (isHome ? 0x529644 : (isKyoto ? 0x4b7d3c : 0x569644)))) },
        uMidCol:  { value: new THREE.Color(isSafari ? 0xd4b050 : (isEgypt ? 0x5cb852 : (isHome ? 0x72c456 : (isKyoto ? 0x6ba64e : 0x78be58)))) },
        uTipCol:  { value: new THREE.Color(isSafari ? 0xf6de7a : (isEgypt ? 0xb8f074 : (isHome ? 0xcbf47c : (isKyoto ? 0xaad86c : 0xbceb74)))) }
      };
      animatedUniforms.push(uniforms);

      const mat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        side: THREE.DoubleSide,
        vertexShader: [
          'uniform float uTime;',
          'varying float vH;',
          'varying float vVar;',
          'varying float vGust;',
          'void main() {',
          '  vH = uv.y;',
          '  vec4 worldBase = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);',
          '  vVar = fract(sin(dot(worldBase.xz, vec2(12.9898, 78.233))) * 43758.5453);',
          '  vec3 pos = position;',
          '  // 2-octave sweeping Studio Ghibli meadow wind wave (Totoro / Wind Rises ripple!)',
          '  float gust = sin(uTime * 1.45 + worldBase.x * 0.14 + worldBase.z * 0.11);',
          '  float flutter = sin(uTime * 3.1 + worldBase.x * 0.42 - worldBase.z * 0.35 + vVar * 6.28) * 0.35;',
          '  float sway = (gust * 0.14 + flutter * 0.045);',
          '  vGust = gust * 0.5 + 0.5;',
          '  pos.x += sway * vH * vH;',
          '  pos.z += sway * 0.58 * vH * vH;',
          '  pos.y -= abs(sway) * 0.18 * vH * vH;',
          '  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(pos, 1.0);',
          '}'
        ].join('\n'),
        fragmentShader: [
          'uniform vec3 uRootCol;',
          'uniform vec3 uMidCol;',
          'uniform vec3 uTipCol;',
          'uniform float uTimeMode;',
          'varying float vH;',
          'varying float vVar;',
          'varying float vGust;',
          'void main() {',
          '  vec3 tipVar = mix(uTipCol, uTipCol * vec3(1.10, 1.04, 0.80), vVar * 0.65);',
          '  vec3 col = vH < 0.42 ? mix(uRootCol, uMidCol, vH / 0.42) : mix(uMidCol, tipVar, (vH - 0.42) / 0.58);',
          '  // Luminous sunlit wind-ripple sheen sweeping across arched blade tips!',
          '  col += vec3(0.11, 0.12, 0.05) * vGust * pow(vH, 1.6);',
          '  if (uTimeMode > 1.5) col *= vec3(0.40, 0.54, 0.80);',
          '  else if (uTimeMode > 0.5) col *= vec3(1.12, 0.84, 0.60);',
          '  gl_FragColor = vec4(col, 1.0);',
          '}'
        ].join('\n')
      });

      const mesh = new THREE.InstancedMesh(geo, mat, count);
      const dummy = new THREE.Object3D();
      let placed = 0;
      const flowerSpots = [];
      const maxFlowers = Math.round((countOverride ? countOverride * 0.16 : 1800) * qCfg.grassScale);
      const minX = bounds.minX, maxX = bounds.maxX, minZ = bounds.minZ, maxZ = bounds.maxZ;
      // Organic 2D patch-clump noise so meadow grass forms lush wild tufts & sunny low clover clearings (never uniform turf!)
      function meadowClump(x, z) {
        return 0.5 + 0.28 * Math.sin(x * 0.24 + Math.cos(z * 0.19) * 1.6)
                   + 0.22 * Math.cos(z * 0.29 - Math.sin(x * 0.21) * 1.4);
      }
      for (let attempt = 0; attempt < count * 5 && placed < count; attempt++) {
        const x = minX + hash01(attempt * 3.17 + 1.1) * (maxX - minX);
        const z = minZ + hash01(attempt * 5.73 + 2.9) * (maxZ - minZ);
        if (isClearFn && !isClearFn(x, z)) continue;
        const clump = meadowClump(x, z);
        // Reject sparse clearings so natural non-uniform tuft rhythm emerges!
        if (clump < 0.26 && hash01(attempt * 17.3) > 0.22) continue;
        const tallTuft = clump > 0.72 ? (1.0 + (clump - 0.72) * 2.1) : (0.62 + clump * 0.55);
        dummy.position.set(x, 0.0, z);
        dummy.rotation.set(0, hash01(attempt * 7.1) * Math.PI * 2, (hash01(attempt * 11.7) - 0.5) * 0.14);
        const scXZ = (isSafari ? 1.15 : (isEgypt ? 1.10 : 0.92)) + hash01(attempt * 9.3) * 0.88;
        const scY = ((isSafari ? 0.92 : (isEgypt ? 0.92 : 0.58)) + hash01(attempt * 2.3) * 0.68) * tallTuft;
        dummy.scale.set(scXZ, scY, scXZ);
        dummy.updateMatrix();
        mesh.setMatrixAt(placed++, dummy.matrix);
      }
      // Group wildflowers into cohesive painterly bouquet drifts instead of uniform scattered confetti!
      const driftCount = Math.max(18, Math.round(maxFlowers / 28));
      for (let d = 0; d < driftCount && flowerSpots.length < maxFlowers; d++) {
        const dx = minX + hash01(d * 19.7 + 4.3) * (maxX - minX);
        const dz = minZ + hash01(d * 29.3 + 8.1) * (maxZ - minZ);
        if (isClearFn && !isClearFn(dx, dz)) continue;
        const speciesTone = hash01(d * 13.1 + 2.7);
        const perDrift = 14 + Math.floor(hash01(d * 7.9) * 22);
        for (let k = 0; k < perDrift && flowerSpots.length < maxFlowers; k++) {
          const ang = hash01(d * 97 + k * 5.3) * Math.PI * 2;
          const rad = Math.pow(hash01(d * 53 + k * 11.1), 0.7) * 2.4;
          const fx = dx + Math.cos(ang) * rad;
          const fz = dz + Math.sin(ang) * rad;
          if (isClearFn && !isClearFn(fx, fz)) continue;
          const fScale = 0.85 + hash01(d * 31 + k * 3.7) * 0.65;
          flowerSpots.push([fx, fz, fScale, (speciesTone + (hash01(k * 4.1) - 0.5) * 0.14 + 1) % 1]);
        }
      }
      mesh.count = placed;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      parent.add(mesh);

      // Swaying 3D Instanced Wildflower Duos (cupped 5-petal blooms + golden pollen centers dancing in sync with the wind!)
      if (flowerSpots.length > 0) {
        const fPos = [];
        const fUv = [];
        const fColType = [];
        function addBlossom(ox, oz, h, pr) {
          fPos.push(ox - 0.014, 0.0, oz,  ox + 0.014, 0.0, oz,  ox, h, oz);
          fUv.push(0, 0,  1, 0,  0.5, 0.92);
          fColType.push(0, 0, 0);
          for (let p = 0; p < 5; p++) {
            const a0 = (p / 5) * Math.PI * 2;
            const a1 = a0 + 0.56;
            const a2 = a0 - 0.56;
            fPos.push(
              ox, h, oz,
              ox + Math.cos(a1) * pr, h + pr * 0.42, oz + Math.sin(a1) * pr,
              ox + Math.cos(a2) * pr, h + pr * 0.42, oz + Math.sin(a2) * pr
            );
            fUv.push(0.5, 1.0,  1.0, 1.0,  0.0, 1.0);
            fColType.push(1, 1, 1);
          }
          // Sunny golden pollen center triangle!
          const cr = pr * 0.36;
          fPos.push(
            ox, h + 0.024, oz + cr,
            ox - cr * 0.88, h + 0.024, oz - cr * 0.55,
            ox + cr * 0.88, h + 0.024, oz - cr * 0.55
          );
          fUv.push(0.5, 1.0,  1.0, 1.0,  0.0, 1.0);
          fColType.push(2, 2, 2);
        }
        addBlossom(0.0, 0.0, 0.38, 0.105);
        addBlossom(0.13, 0.09, 0.30, 0.082);

        const fGeo = new THREE.BufferGeometry();
        fGeo.setAttribute('position', new THREE.Float32BufferAttribute(fPos, 3));
        fGeo.setAttribute('uv', new THREE.Float32BufferAttribute(fUv, 2));
        fGeo.setAttribute('aPart', new THREE.Float32BufferAttribute(fColType, 1));
        fGeo.computeVertexNormals();

        const fUniforms = {
          uTime: uniforms.uTime,
          uTimeMode: uniforms.uTimeMode,
          uStemCol: { value: new THREE.Color(isSafari ? 0x7e8a38 : 0x459442) },
          uColA: { value: new THREE.Color(isSafari ? 0xffd86b : (isEgypt ? 0xfff8dc : 0xffffff)) },
          uColB: { value: new THREE.Color(isSafari ? 0xf58458 : (isEgypt ? 0xffd166 : 0xffe266)) },
          uColC: { value: new THREE.Color(isSafari ? 0xfff3b0 : (isEgypt ? 0x7dd3fc : 0xff9ec2)) },
          uColD: { value: new THREE.Color(isSafari ? 0xf9c74f : (isEgypt ? 0xf9a8d4 : 0x93c5fd)) }
        };
        const fMat = new THREE.ShaderMaterial({
          uniforms: fUniforms,
          side: THREE.DoubleSide,
          vertexShader: [
            'attribute float aPart;',
            'uniform float uTime;',
            'varying float vPart;',
            'varying float vVar;',
            'void main() {',
            '  vPart = aPart;',
            '  float h = uv.y;',
            '  vec4 worldBase = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);',
            '  vVar = fract(sin(dot(worldBase.xz, vec2(37.13, 91.7))) * 43758.5453);',
            '  vec3 pos = position;',
            '  float gust = sin(uTime * 1.45 + worldBase.x * 0.14 + worldBase.z * 0.11);',
            '  float sway = gust * 0.14;',
            '  pos.x += sway * h * h;',
            '  pos.z += sway * 0.58 * h * h;',
            '  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(pos, 1.0);',
            '}'
          ].join('\n'),
          fragmentShader: [
            'uniform vec3 uStemCol;',
            'uniform vec3 uColA;',
            'uniform vec3 uColB;',
            'uniform vec3 uColC;',
            'uniform vec3 uColD;',
            'uniform float uTimeMode;',
            'varying float vPart;',
            'varying float vVar;',
            'void main() {',
            '  vec3 pCol = vVar < 0.32 ? uColA : (vVar < 0.58 ? uColB : (vVar < 0.82 ? uColC : uColD));',
            '  vec3 col = vPart < 0.5 ? uStemCol : (vPart > 1.5 ? vec3(1.0, 0.82, 0.22) : pCol);',
            '  if (uTimeMode > 1.5) col *= vec3(0.45, 0.58, 0.84);',
            '  else if (uTimeMode > 0.5) col *= vec3(1.10, 0.86, 0.66);',
            '  gl_FragColor = vec4(col, 1.0);',
            '}'
          ].join('\n')
        });
        const fMesh = new THREE.InstancedMesh(fGeo, fMat, flowerSpots.length);
        flowerSpots.forEach((fs, idx) => {
          dummy.position.set(fs[0], 0.0, fs[1]);
          dummy.rotation.set(0, fs[3] * Math.PI * 2, 0);
          const fsc = 0.90 + fs[3] * 0.62;
          dummy.scale.set(fsc, fsc, fsc);
          dummy.updateMatrix();
          fMesh.setMatrixAt(idx, dummy.matrix);
        });
        fMesh.instanceMatrix.needsUpdate = true;
        fMesh.frustumCulled = false;
        parent.add(fMesh);
      }

      return mesh;
    },

    // Sculpted 360-degree Multi-Ridge Horizon (forested Japanese mountains or warm terracotta savanna mesas!)
    addMountainRange: function (parent, style) {
      const isKyoto = style === 'kyoto';
      const isSafari = style === 'safari';
      const segs = 128;
      const rInner = 92, rOuter = 175;
      const positions = [];
      const colors = [];
      const indices = [];

      function ridgeH(ang, t) {
        const n = Math.sin(ang * 3.0 + 0.5) * 0.42
                + Math.sin(ang * 7.0 - 1.2) * 0.28
                + Math.cos(ang * 13.0 + 2.1) * 0.16
                + Math.sin(ang * 23.0) * 0.08;
        const crest = Math.sin(t * Math.PI);
        return Math.max(0, crest * ((isSafari ? 15.0 : 22.0) + n * (isSafari ? 11.0 : 16.0)));
      }

      const rings = 10;
      for (let r = 0; r <= rings; r++) {
        const t = r / rings;
        const rad = rInner + t * (rOuter - rInner);
        for (let i = 0; i <= segs; i++) {
          const ang = (i / segs) * Math.PI * 2;
          const h = ridgeH(ang, t) - (r === 0 ? 1.5 : 0);
          positions.push(Math.cos(ang) * rad, h, Math.sin(ang) * rad);
          const sunLit = 0.5 + 0.5 * Math.cos(ang - 0.6);
          const mist = Math.min(1, t * 0.85);
          const baseR = isSafari ? (0.62 + sunLit * 0.18) : ((isKyoto ? 0.22 : 0.25) + sunLit * 0.14);
          const baseG = isSafari ? (0.45 + sunLit * 0.14) : ((isKyoto ? 0.44 : 0.48) + sunLit * 0.18);
          const baseB = isSafari ? (0.28 + sunLit * 0.08) : ((isKyoto ? 0.30 : 0.28) + sunLit * 0.08);
          colors.push(
            baseR * (1 - mist * 0.42) + (isSafari ? 0.78 : 0.54) * mist * 0.42,
            baseG * (1 - mist * 0.35) + (isSafari ? 0.72 : 0.68) * mist * 0.35,
            baseB * (1 - mist * 0.45) + (isSafari ? 0.66 : 0.82) * mist * 0.45
          );
        }
      }
      const stride = segs + 1;
      for (let r = 0; r < rings; r++) {
        for (let i = 0; i < segs; i++) {
          const a = r * stride + i, b = a + 1, c = (r + 1) * stride + i, d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      const mat = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: getAnimeGradientMap() });
      const m = new THREE.Mesh(geo, mat);
      parent.add(m);
      return m;
    },

    addPowerLines: function (parent, poles) {
      if (!poles || poles.length < 2) return;
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x24262e });
      const offsets = [[-0.72, 7.66], [0.0, 7.66], [0.72, 7.66], [-0.58, 6.86], [0.58, 6.86]];
      for (let i = 0; i < poles.length - 1; i++) {
        const a = poles[i], b = poles[i + 1];
        const dist = Math.hypot(b.x - a.x, b.z - a.z);
        if (dist > 34) continue;
        const sag = Math.min(1.15, dist * 0.042);
        const cosA = Math.cos(a.rotY || 0), sinA = Math.sin(a.rotY || 0);
        const cosB = Math.cos(b.rotY || 0), sinB = Math.sin(b.rotY || 0);
        offsets.forEach((off, wi) => {
          const ax = a.x + cosA * off[0], az = a.z - sinA * off[0];
          const bx = b.x + cosB * off[0], bz = b.z - sinB * off[0];
          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(ax, off[1], az),
            new THREE.Vector3((ax + bx) * 0.5, off[1] - sag - (wi % 2) * 0.14, (az + bz) * 0.5),
            new THREE.Vector3(bx, off[1], bz)
          );
          parent.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.022, 4, false), wireMat));
        });
      }
    },

    addRidgeTowers: function (parent, coords) {
      const redMat = new THREE.MeshBasicMaterial({ color: 0xc94a44 });
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xf4ece4 });
      (coords || [[-28, 19, -112], [26, 17, -108]]).forEach(pt => {
        const tg = new THREE.Group();
        tg.position.set(pt[0], pt[1], pt[2]);
        for (let tier = 0; tier < 5; tier++) {
          const seg = new THREE.Mesh(
            new THREE.CylinderGeometry(1.35 - tier * 0.24, 1.6 - tier * 0.25, 3.0, 4, 1, true),
            tier % 2 === 0 ? redMat : whiteMat
          );
          seg.material.wireframe = true;
          seg.position.y = tier * 3.0 + 1.5;
          tg.add(seg);
        }
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 4.0, 5), redMat);
        mast.position.y = 17.0;
        tg.add(mast);
        parent.add(tg);
      });
    },

    // Inverted-hull subtle anime ink outline on hero characters (Genshin Impact / Ni no Kuni look!)
    addAnimeOutline: function (group, thickness, hexColor) {
      const outMat = new THREE.MeshBasicMaterial({ color: hexColor || 0x2b1e1a, side: THREE.BackSide });
      const meshes = [];
      group.traverse(o => {
        if (o.isMesh && o.geometry && o.material && !o.material.transparent && !(o.userData && o.userData.noOutline)) meshes.push(o);
      });
      const sc = 1.0 + (thickness || 0.048);
      meshes.forEach(m => {
        const om = new THREE.Mesh(m.geometry, outMat);
        om.position.copy(m.position);
        om.rotation.copy(m.rotation);
        om.scale.copy(m.scale).multiplyScalar(sc);
        if (m.parent) m.parent.add(om);
      });
    }
  };

  // Towering 2048x1024 Shinkai Anime Cumulus Sky Dome
  LS.createShinkaiSkyTexture = function (mode, worldId) {
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 1024;
    const ctx = c.getContext('2d');
    const isSafari = worldId === 'safari';
    const isEgypt = worldId === 'egypt';
    const isMarrakech = worldId === 'marrakech';
    const isWarmAfrica = isSafari || isEgypt || isMarrakech;

    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    if (mode === 1) {
      grad.addColorStop(0.0, isMarrakech ? '#321c4a' : (isWarmAfrica ? '#261e4a' : '#1c2854'));
      grad.addColorStop(0.32, isMarrakech ? '#a8425e' : (isEgypt ? '#9e4c52' : (isSafari ? '#78425e' : '#5a4876')));
      grad.addColorStop(0.58, isMarrakech ? '#f26a4b' : (isWarmAfrica ? '#e86a3a' : '#df7a52'));
      grad.addColorStop(0.78, isEgypt ? '#ffc65c' : (isWarmAfrica ? '#ffb84d' : '#ffbc68'));
      grad.addColorStop(1.0, '#fff2c8');
    } else if (mode === 2) {
      grad.addColorStop(0.0, isMarrakech ? '#0d0c28' : '#090f24');
      grad.addColorStop(0.5, isMarrakech ? '#281d52' : '#1a2c56');
      grad.addColorStop(1.0, isEgypt ? '#544a6e' : '#445882');
    } else if (isEgypt) {
      grad.addColorStop(0.0, '#1e6ec4');
      grad.addColorStop(0.32, '#58b4e8');
      grad.addColorStop(0.60, '#bce8f7');
      grad.addColorStop(0.80, '#ffebc2');
      grad.addColorStop(1.0, '#ffd58a');
    } else if (isMarrakech) {
      grad.addColorStop(0.0, '#2a68b8');
      grad.addColorStop(0.32, '#74a8df');
      grad.addColorStop(0.60, '#e8d4d8');
      grad.addColorStop(0.80, '#ffd4b8');
      grad.addColorStop(1.0, '#ffba92');
    } else if (isSafari) {
      grad.addColorStop(0.0, '#2a75c7');
      grad.addColorStop(0.34, '#66aee8');
      grad.addColorStop(0.62, '#c8e4f4');
      grad.addColorStop(0.82, '#fbe7c2');
      grad.addColorStop(1.0, '#ffd898');
    } else {
      grad.addColorStop(0.0, '#2368be');
      grad.addColorStop(0.36, '#56a0e4');
      grad.addColorStop(0.64, '#a6d4f6');
      grad.addColorStop(0.84, '#e6eef7');
      grad.addColorStop(1.0, '#fff2d0');
    }
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 2048, 1024);

    if (mode === 2) {
      if (isWarmAfrica) {
        // Subtle diagonal Milky Way band across the African night sky
        ctx.save();
        ctx.translate(1024, 240);
        ctx.rotate(-0.24);
        const mw = ctx.createLinearGradient(0, -140, 0, 140);
        mw.addColorStop(0, 'rgba(130, 160, 230, 0)');
        mw.addColorStop(0.5, 'rgba(160, 188, 248, 0.18)');
        mw.addColorStop(1, 'rgba(130, 160, 230, 0)');
        ctx.fillStyle = mw;
        ctx.fillRect(-1100, -140, 2200, 280);
        ctx.restore();
      }
      ctx.fillStyle = 'rgba(255, 250, 224, 0.92)';
      const starCount = isWarmAfrica ? 360 : 240;
      for (let i = 0; i < starCount; i++) {
        ctx.beginPath();
        ctx.arc(hash01(i * 9.1) * 2048, hash01(i * 4.7) * 490, (i % 5 === 0) ? 2.8 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (isWarmAfrica) {
        // Glowing golden African Night Constellations (Southern Cross, Leo the Lion & Orion!)
        const constellations = [
          // Southern Cross (Crux)
          [[460, 175], [510, 235], [460, 305], [415, 230], [460, 175]],
          // Leo the Lion (Savanna King Constellation!)
          [[940, 255], [995, 220], [1050, 185], [1095, 168], [1128, 198], [1090, 235], [1038, 245], [995, 220]],
          // Orion Belt & Shoulders
          [[1510, 160], [1565, 225], [1595, 232], [1625, 240], [1685, 172], [1645, 310], [1540, 305], [1565, 225]]
        ];
        ctx.strokeStyle = 'rgba(255, 228, 152, 0.36)';
        ctx.lineWidth = 2.0;
        constellations.forEach(pts => {
          ctx.beginPath();
          pts.forEach((p, idx) => idx === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
          ctx.stroke();
          pts.forEach(p => {
            const sg = ctx.createRadialGradient(p[0], p[1], 1, p[0], p[1], 12);
            sg.addColorStop(0, 'rgba(255, 252, 224, 0.98)');
            sg.addColorStop(0.4, 'rgba(255, 218, 130, 0.42)');
            sg.addColorStop(1, 'rgba(255, 218, 130, 0)');
            ctx.fillStyle = sg;
            ctx.beginPath(); ctx.arc(p[0], p[1], 12, 0, Math.PI * 2); ctx.fill();
          });
        });
      }
    } else {
      const sx = mode === 1 ? 1320 : (isSafari ? 1180 : 1460);
      const sy = mode === 1 ? 520 : (isSafari ? 360 : 300);
      const sRad = isSafari ? 380 : 310;
      const sg = ctx.createRadialGradient(sx, sy, 16, sx, sy, sRad);
      sg.addColorStop(0, 'rgba(255, 252, 228, 0.99)');
      sg.addColorStop(0.30, (mode === 1 || isSafari) ? 'rgba(255, 198, 114, 0.56)' : 'rgba(255, 245, 206, 0.38)');
      sg.addColorStop(1, 'rgba(255, 232, 180, 0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, sRad, 0, Math.PI * 2); ctx.fill();
    }

    function drawCumulus(cx, cy, scale) {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(scale, scale);
      const puffs = [
        [-130, 52, 68], [-65, 24, 88], [0, -18, 104], [75, 16, 86], [140, 48, 64],
        [-35, -72, 74], [38, -68, 72], [4, -124, 58], [-92, -16, 56], [96, -12, 54],
        [-180, 74, 48], [185, 72, 46]
      ];
      const deepShadow = mode === 1 ? 'rgba(176, 98, 92, 0.85)' : (mode === 2 ? 'rgba(32, 46, 84, 0.85)' : 'rgba(134, 166, 208, 0.88)');
      const midShadow = mode === 1 ? 'rgba(222, 146, 114, 0.88)' : (mode === 2 ? 'rgba(56, 74, 118, 0.85)' : 'rgba(190, 212, 236, 0.90)');
      const sunlitTop = mode === 1 ? 'rgba(255, 234, 198, 0.96)' : (mode === 2 ? 'rgba(102, 122, 168, 0.88)' : 'rgba(255, 253, 246, 0.98)');
      puffs.forEach(p => { ctx.fillStyle = deepShadow; ctx.beginPath(); ctx.arc(p[0] - 8, p[1] + 22, p[2] * 1.02, 0, Math.PI * 2); ctx.fill(); });
      puffs.forEach(p => { ctx.fillStyle = midShadow; ctx.beginPath(); ctx.arc(p[0] - 3, p[1] + 10, p[2] * 0.96, 0, Math.PI * 2); ctx.fill(); });
      puffs.forEach(p => { ctx.fillStyle = sunlitTop; ctx.beginPath(); ctx.arc(p[0] + 6, p[1] - 4, p[2] * 0.88, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
    }
    drawCumulus(420, 445, 1.38); drawCumulus(1060, 410, 1.68);
    drawCumulus(1660, 460, 1.32); drawCumulus(120, 495, 0.98); drawCumulus(1960, 490, 1.02);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = LS.maxAnisotropy || 8;
    return tex;
  };

  // -------------------------------------------------------------------------
  // 4. AAA Post-Processing Stack (RenderPass + UnrealBloom + Shinkai Sun-Glow Grade + FXAA!)
  // -------------------------------------------------------------------------
  const ShinkaiGradeShader = {
    uniforms: {
      tDiffuse: { value: null },
      uTimeMode: { value: 0.0 }
    },
    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D tDiffuse;',
      'uniform float uTimeMode;',
      'varying vec2 vUv;',
      'void main() {',
      '  vec4 tex = texture2D(tDiffuse, vUv);',
      '  vec3 col = tex.rgb;',
      '  // Preserve rich midtones & crisp readability; gently roll off only extreme highlights (> 0.82)',
      '  vec3 over = max(col - vec3(0.82), vec3(0.0));',
      '  col = min(col, vec3(0.82)) + over / (1.0 + over * 2.2);',
      '  float lum = dot(col, vec3(0.299, 0.587, 0.114));',
      '  // Makoto Shinkai warm-gold afternoon sunlight vs cool slate-indigo shadows!',
      '  vec3 coolTint = vec3(0.90, 0.95, 1.13);',
      '  vec3 warmTint = mix(vec3(1.04, 1.01, 0.94), vec3(1.14, 0.96, 0.82), clamp(uTimeMode, 0.0, 1.0));',
      '  col *= mix(coolTint, warmTint, smoothstep(0.14, 0.78, lum));',
      '  // Soft atmospheric afternoon sun-shaft glow descending from upper horizon',
      '  float sunDist = distance(vUv, vec2(0.56, 0.78));',
      '  float sunGlow = exp(-sunDist * 4.2) * (uTimeMode > 1.5 ? 0.015 : (uTimeMode > 0.5 ? 0.09 : 0.036));',
      '  col += vec3(1.0, 0.89, 0.70) * sunGlow;',
      '  // Lush anime vibrance & clean contrast',
      '  float avg = (col.r + col.g + col.b) / 3.0;',
      '  col = mix(vec3(avg), col, 1.18);',
      '  col = (col - 0.5) * 1.06 + 0.5;',
      '  // Subtle cinematic edge framing',
      '  float dist = distance(vUv, vec2(0.5));',
      '  col *= smoothstep(1.06, 0.38, dist * 0.50);',
      '  gl_FragColor = vec4(clamp(col, 0.0, 1.0), tex.a);',
      '}'
    ].join('\n')
  };

  LS.hdPost = {
    composer: null,
    bloomPass: null,
    gradePass: null,
    fxaaPass: null,
    enabled: true,

    init: function (renderer, scene, camera) {
      if (!LS.isHD || typeof THREE.EffectComposer === 'undefined') return false;
      try {
        const composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        if (typeof THREE.UnrealBloomPass !== 'undefined') {
          const bloom = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.13, 0.48, 0.90
          );
          composer.addPass(bloom);
          LS.hdPost.bloomPass = bloom;
        }

        if (typeof THREE.ShaderPass !== 'undefined') {
          const grade = new THREE.ShaderPass(ShinkaiGradeShader);
          composer.addPass(grade);
          LS.hdPost.gradePass = grade;

          if (typeof THREE.FXAAShader !== 'undefined') {
            const fxaa = new THREE.ShaderPass(THREE.FXAAShader);
            const pr = renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
            fxaa.material.uniforms.resolution.value.set(1 / (window.innerWidth * pr), 1 / (window.innerHeight * pr));
            composer.addPass(fxaa);
            LS.hdPost.fxaaPass = fxaa;
          }
        }

        LS.hdPost.composer = composer;
        LS.hdPost.applyQuality();
        return true;
      } catch (e) {
        console.warn('[HD Post]', e);
        return false;
      }
    },

    applyQuality: function (q) {
      const qCfg = (LS.ghibli && LS.ghibli.getQualityConfig) ? LS.ghibli.getQualityConfig(q) : { usePost: true, useBloom: true };
      LS.hdPost.enabled = !!qCfg.usePost;
      if (LS.hdPost.bloomPass) {
        LS.hdPost.bloomPass.enabled = !!qCfg.useBloom;
      }
    },

    registerAnimatedUniform: function (u) {
      if (u) animatedUniforms.push(u);
    },

    setSize: function (w, h, pr) {
      if (LS.hdPost.composer) LS.hdPost.composer.setSize(w, h);
      if (LS.hdPost.fxaaPass) {
        const dpr = pr || Math.min(window.devicePixelRatio || 1, 2.0);
        LS.hdPost.fxaaPass.material.uniforms.resolution.value.set(1 / (w * dpr), 1 / (h * dpr));
      }
    },

    setTimeMode: function (mode) {
      if (LS.hdPost.gradePass) {
        LS.hdPost.gradePass.uniforms.uTimeMode.value = mode;
      }
      if (LS.hdPost.bloomPass) {
        LS.hdPost.bloomPass.strength = mode === 1 ? 0.24 : (mode === 2 ? 0.34 : 0.13);
        LS.hdPost.bloomPass.threshold = mode === 2 ? 0.74 : (mode === 1 ? 0.86 : 0.90);
      }
      animatedUniforms.forEach(u => {
        if (u.uTimeMode) u.uTimeMode.value = mode;
      });
    },

    update: function (elapsed) {
      for (let i = 0; i < animatedUniforms.length; i++) {
        if (animatedUniforms[i].uTime) animatedUniforms[i].uTime.value = elapsed;
      }
    },

    clearAnimatedUniforms: function () {
      animatedUniforms.length = 0;
    },

    render: function () {
      if (LS.hdPost.composer && LS.hdPost.enabled) {
        LS.hdPost.composer.render();
        return true;
      }
      return false;
    }
  };
})(window.LailaSalma);
