window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  /**
   * Real-world calibrated character heights (in scene meters) aligned with
   * apartment doors (2.15m), chairs (0.46m seat), and dining tables (0.76m).
   */
  LS.GLB_TARGET_HEIGHTS = {
    laila: 1.24,
    salma: 1.04,
    mom: 1.58,
    dad: 1.72,
    gedo_mahmoud: 1.68,
    nana_omaima: 1.54,
    bibo: 0.99,
    nouzi: 1.22,
    mai: 1.56,
    mostafa: 1.72
  };

  /**
   * Active .glb character manifest.
   * Keep entries `null` until real .glb files are placed under `assets/models/`
   * so the game never issues 404 requests. Once `assets/models/laila.glb` and
   * `assets/models/salma.glb` are saved, set their paths here to upgrade them
   * across every world automatically.
   */
  LS.GLB_CHARACTER_MANIFEST = {
    laila: null,
    salma: null,
    mom: null,
    dad: null,
    gedo_mahmoud: null,
    nana_omaima: null,
    bibo: null,
    nouzi: null,
    mai: null,
    mostafa: null
  };

  const activeRigs = new Set();

  function matchClip(animations, patterns) {
    if (!animations || !animations.length) return null;
    for (let p = 0; p < patterns.length; p++) {
      const rx = patterns[p];
      for (let i = 0; i < animations.length; i++) {
        if (rx.test(animations[i].name || '')) return animations[i];
      }
    }
    return null;
  }

  function buildClipStateMap(animations) {
    const map = {};
    if (!animations || !animations.length) return map;
    map.idle = matchClip(animations, [/idle/i, /stand/i, /breath/i, /wait/i, /rest/i]) || animations[0];
    map.walk = matchClip(animations, [/walk/i, /stride/i, /stroll/i, /move/i, /locomot/i]) || null;
    map.run = matchClip(animations, [/run/i, /sprint/i, /jog/i, /dash/i]) || map.walk || null;
    map.jump = matchClip(animations, [/jump/i, /hop/i, /leap/i, /air/i]) || null;
    map.sit = matchClip(animations, [/sit/i, /chair/i, /seat/i]) || map.idle;
    map.chair_sit = map.sit;
    map.wave = matchClip(animations, [/wave/i, /greet/i, /hello/i, /cheer/i, /happy/i, /dance/i]) || map.idle;
    return map;
  }

  function computeModelBounds(object3D) {
    object3D.updateMatrixWorld(true);
    const box = new THREE.Box3();
    box.setFromObject(object3D);
    if (!box.isEmpty()) {
      const sz = new THREE.Vector3();
      box.getSize(sz);
      if (sz.y > 0.001 && Number.isFinite(sz.y)) return box;
    }
    // Fallback: measure mesh geometry bounding boxes directly
    const fallback = new THREE.Box3();
    object3D.traverse(node => {
      if (node.isMesh && node.geometry) {
        if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
        if (node.geometry.boundingBox) {
          const b = node.geometry.boundingBox.clone();
          b.applyMatrix4(node.matrixWorld);
          fallback.union(b);
        }
      }
    });
    return fallback;
  }

  function prepareMaterials(modelRoot, ghibliMatteDefault) {
    const records = [];
    let meshCount = 0;
    let triangleCount = 0;
    let boneCount = 0;
    let hasSkinnedMesh = false;

    modelRoot.traverse(node => {
      if (node.isBone) boneCount++;
      if (!node.isMesh) return;
      meshCount++;
      if (node.isSkinnedMesh) hasSkinnedMesh = true;
      if (node.geometry) {
        const idx = node.geometry.index;
        const pos = node.geometry.attributes && node.geometry.attributes.position;
        if (idx) triangleCount += Math.floor(idx.count / 3);
        else if (pos) triangleCount += Math.floor(pos.count / 3);
      }
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach(mat => {
        if (!mat) return;
        const orig = {
          mat,
          roughness: mat.roughness !== undefined ? mat.roughness : 0.7,
          metalness: mat.metalness !== undefined ? mat.metalness : 0.0,
          envMapIntensity: mat.envMapIntensity !== undefined ? mat.envMapIntensity : 1.0,
          emissiveIntensity: mat.emissiveIntensity !== undefined ? mat.emissiveIntensity : 0.0,
          colorHex: mat.color ? mat.color.getHex() : 0xffffff
        };
        if (mat.map) {
          mat.map.encoding = THREE.sRGBEncoding;
          mat.map.needsUpdate = true;
        }
        records.push(orig);
      });
    });

    function applyMatteStyle(enabled) {
      records.forEach(rec => {
        const m = rec.mat;
        if (enabled) {
          // Soft Studio Ghibli matte watercolor look: kills plastic specular glare
          // while preserving every hand-painted albedo detail from the 3D texture.
          if (m.roughness !== undefined) m.roughness = Math.max(rec.roughness, 0.88);
          if (m.metalness !== undefined) m.metalness = Math.min(rec.metalness, 0.03);
          if (m.envMapIntensity !== undefined) m.envMapIntensity = 0.45;
          if (m.color) m.color.setHex(rec.colorHex);
        } else {
          if (m.roughness !== undefined) m.roughness = rec.roughness;
          if (m.metalness !== undefined) m.metalness = rec.metalness;
          if (m.envMapIntensity !== undefined) m.envMapIntensity = rec.envMapIntensity;
          if (m.color) m.color.setHex(rec.colorHex);
        }
        m.needsUpdate = true;
      });
    }

    applyMatteStyle(ghibliMatteDefault !== false);

    return {
      applyMatteStyle,
      stats: { meshCount, triangleCount, boneCount, hasSkinnedMesh }
    };
  }

  function buildRigController(gltf, opts) {
    const options = opts || {};
    const targetHeight = options.targetHeight || 1.24;
    const ghibliMatte = options.ghibliMatte !== false;

    const group = new THREE.Group();
    group.name = 'glb_character_root';

    const modelPivot = new THREE.Group();
    modelPivot.name = 'glb_model_pivot';

    const model = gltf.scene || (gltf.scenes && gltf.scenes[0]);
    if (!model) {
      throw new Error('GLB file contains no 3D scene.');
    }

    const matInfo = prepareMaterials(model, ghibliMatte);
    modelPivot.add(model);
    group.add(modelPivot);

    // Measure natural unscaled bounding box
    const rawBox = computeModelBounds(model);
    const rawSize = new THREE.Vector3();
    const rawCenter = new THREE.Vector3();
    rawBox.getSize(rawSize);
    rawBox.getCenter(rawCenter);
    const rawHeight = rawSize.y > 0.001 ? rawSize.y : 1.0;

    let currentTargetHeight = targetHeight;
    let yawOffset = options.yawOffset || 0;

    function applyNormalization() {
      const s = currentTargetHeight / rawHeight;
      model.scale.setScalar(s);
      // Center X/Z at 0 and place feet flush on y = 0
      model.position.set(
        -rawCenter.x * s,
        -rawBox.min.y * s,
        -rawCenter.z * s
      );
      modelPivot.rotation.y = yawOffset;
    }
    applyNormalization();

    const animations = gltf.animations || [];
    const mixer = animations.length ? new THREE.AnimationMixer(model) : null;
    const clipMap = buildClipStateMap(animations);
    const actions = new Map();
    let activeAction = null;
    let currentState = 'idle';
    let manualClipIndex = -1;
    let isGhibliMatte = ghibliMatte;

    function getAction(clip) {
      if (!mixer || !clip) return null;
      if (!actions.has(clip)) {
        const act = mixer.clipAction(clip);
        actions.set(clip, act);
      }
      return actions.get(clip);
    }

    function fadeToClip(clip, fadeSec) {
      const next = getAction(clip);
      if (!next) return;
      if (activeAction === next) return;
      next.reset();
      next.enabled = true;
      next.setEffectiveTimeScale(1.0);
      next.setEffectiveWeight(1.0);
      if (activeAction) {
        next.play();
        activeAction.crossFadeTo(next, fadeSec !== undefined ? fadeSec : 0.22, false);
      } else {
        next.play();
      }
      activeAction = next;
    }

    if (clipMap.idle) {
      fadeToClip(clipMap.idle, 0.01);
    }

    const rig = {
      group,
      modelPivot,
      model,
      mixer,
      animations,
      clipMap,
      stats: Object.assign({}, matInfo.stats, {
        clipCount: animations.length,
        clipNames: animations.map((c, idx) => c.name || ('Clip ' + (idx + 1))),
        rawHeight: Number(rawHeight.toFixed(3)),
        targetHeight: currentTargetHeight
      }),
      playState(stateName) {
        manualClipIndex = -1;
        const normalized = stateName || 'idle';
        currentState = normalized;
        if (!mixer) return;
        const clip = clipMap[normalized] || clipMap.idle;
        if (clip) fadeToClip(clip, normalized === 'jump' ? 0.12 : 0.22);
      },
      playClipByIndex(idx) {
        if (!mixer || idx < 0 || idx >= animations.length) return;
        manualClipIndex = idx;
        fadeToClip(animations[idx], 0.18);
      },
      setGhibliMatte(enabled) {
        isGhibliMatte = Boolean(enabled);
        matInfo.applyMatteStyle(isGhibliMatte);
      },
      isGhibliMatte() {
        return isGhibliMatte;
      },
      setTargetHeight(h) {
        currentTargetHeight = Math.max(0.4, Math.min(2.6, Number(h) || targetHeight));
        rig.stats.targetHeight = currentTargetHeight;
        applyNormalization();
      },
      setYawOffset(rad) {
        yawOffset = Number(rad) || 0;
        modelPivot.rotation.y = yawOffset;
      },
      getState() {
        return currentState;
      },
      update(dt, elapsed, moveSpeed) {
        const safeDt = Math.min(dt || 0.016, 0.05);
        if (mixer) {
          mixer.update(safeDt);
        }
        // Gentle Ghibli procedural motion fallback when testing static/unrigged GLBs
        // or when a model lacks a dedicated walk/run clip
        const hasWalkClip = Boolean(clipMap.walk);
        const speed = moveSpeed !== undefined ? moveSpeed : (
          currentState === 'run' ? 4.2 : currentState === 'walk' ? 2.4 : 0
        );
        const t = elapsed !== undefined ? elapsed : performance.now() * 0.001;

        if (!mixer || (manualClipIndex < 0 && !hasWalkClip && speed > 0.15)) {
          if (speed > 0.15) {
            const freq = speed > 3.2 ? 12.0 : 8.5;
            modelPivot.position.y = Math.abs(Math.sin(t * freq)) * 0.065;
            modelPivot.rotation.z = Math.sin(t * freq) * 0.045;
            modelPivot.rotation.x = 0.04;
          } else {
            modelPivot.position.y = 0;
            modelPivot.rotation.z *= 0.85;
            modelPivot.rotation.x *= 0.85;
            const breath = 1.0 + Math.sin(t * 2.2) * 0.008;
            modelPivot.scale.set(1, breath, 1);
          }
        } else {
          modelPivot.position.y = 0;
          modelPivot.rotation.z = 0;
          modelPivot.rotation.x = 0;
          modelPivot.scale.set(1, 1, 1);
        }
      },
      dispose() {
        activeRigs.delete(rig);
        if (mixer) mixer.stopAllAction();
        group.traverse(node => {
          if (node.isMesh) {
            if (node.geometry) node.geometry.dispose();
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach(m => {
              if (!m) return;
              if (m.map) m.map.dispose();
              m.dispose();
            });
          }
        });
      }
    };

    return rig;
  }

  /**
   * Load a .glb character from either a URL string or an ArrayBuffer / File / Blob.
   * Returns a Promise resolving to a RigController.
   */
  LS.loadGLBCharacter = function (source, opts) {
    return new Promise((resolve, reject) => {
      if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader !== 'function') {
        reject(new Error('THREE.GLTFLoader is not loaded.'));
        return;
      }
      const loader = new THREE.GLTFLoader();

      const onParsed = gltf => {
        try {
          const rig = buildRigController(gltf, opts);
          resolve(rig);
        } catch (err) {
          reject(err);
        }
      };

      if (typeof source === 'string') {
        loader.load(source, onParsed, undefined, err => reject(err || new Error('Failed to load GLB: ' + source)));
      } else if (source instanceof ArrayBuffer) {
        loader.parse(source, '', onParsed, err => reject(err || new Error('Failed to parse GLB ArrayBuffer')));
      } else if (typeof Blob !== 'undefined' && source instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          loader.parse(reader.result, '', onParsed, err => reject(err || new Error('Failed to parse GLB file')));
        };
        reader.onerror = () => reject(new Error('Failed to read GLB file'));
        reader.readAsArrayBuffer(source);
      } else {
        reject(new Error('Unsupported GLB source. Pass a URL string, File, Blob, or ArrayBuffer.'));
      }
    });
  };

  /**
   * Upgrade an existing procedural game character object (from LS.createAnimeCharacter)
   * with a loaded .glb rig while preserving root transforms, contact shadows, and bubbles.
   */
  LS.attachGLBRigToCharacter = function (charObj, rig, portraitStyle) {
    if (!charObj || !charObj.root || !rig) return null;
    if (charObj.glbRig && charObj.glbRig.group && charObj.glbRig.group.parent) {
      charObj.glbRig.group.parent.remove(charObj.glbRig.group);
      charObj.glbRig.dispose();
    }
    // Compensate for root.scale so the GLB renders at its exact calibrated world height
    const rootScale = charObj.root.scale.x > 0.01 ? charObj.root.scale.x : 1.0;
    rig.group.scale.setScalar(1.0 / rootScale);
    charObj.root.add(rig.group);
    if (charObj.bodyPivot) {
      charObj.bodyPivot.visible = false;
    }
    charObj.glbRig = rig;
    charObj.glbKey = portraitStyle || null;
    activeRigs.add(rig);
    return rig;
  };

  /**
   * Automatically attaches a configured .glb from LS.GLB_CHARACTER_MANIFEST if non-null.
   * Safe no-op (zero network requests) when manifest entry is null.
   */
  LS.attachGLBIfConfigured = function (charObj, portraitStyle) {
    if (!charObj || !portraitStyle) return null;
    const url = LS.GLB_CHARACTER_MANIFEST && LS.GLB_CHARACTER_MANIFEST[portraitStyle];
    if (!url) return null;
    const targetHeight = LS.GLB_TARGET_HEIGHTS[portraitStyle] || 1.24;
    return LS.loadGLBCharacter(url, { targetHeight, ghibliMatte: true })
      .then(rig => LS.attachGLBRigToCharacter(charObj, rig, portraitStyle))
      .catch(err => {
        console.warn('[GLB] Falling back to built-in character for', portraitStyle, err);
        return null;
      });
  };

  /**
   * Tick all active in-game GLB character AnimationMixers.
   */
  LS.updateGLBCharacters = function (dt, elapsed) {
    activeRigs.forEach(rig => {
      if (rig && rig.group && rig.group.parent) {
        rig.update(dt, elapsed);
      } else {
        activeRigs.delete(rig);
      }
    });
  };
})(window.LailaSalma);
