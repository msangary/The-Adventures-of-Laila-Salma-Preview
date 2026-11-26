window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  // Procedural Texture Helpers for High-Detail Ghibli Destinations!
  function createCheckerTileTexture(colA, colB, repX, repY) {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = colA; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = colB;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillRect(64, 64, 64, 64);
    ctx.strokeStyle = 'rgba(110, 75, 45, 0.14)'; ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64); ctx.strokeRect(64, 64, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repX || 6, repY || 5);
    return tex;
  }

  function createGalaxyCarpetTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#221f4d'; ctx.fillRect(0, 0, 256, 256);
    const cols = ['#fde047', '#38bdf8', '#f472b6', '#a78bfa', '#34d399'];
    for (let i = 0; i < 42; i++) {
      const x = (i * 61 + 19) % 244 + 6;
      const y = (i * 97 + 31) % 244 + 6;
      ctx.fillStyle = cols[i % cols.length];
      ctx.beginPath(); ctx.arc(x, y, (i % 3) + 2, 0, Math.PI * 2); ctx.fill();
    }
    // Fun retro neon swirls
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(72, 84, 24, 0, Math.PI * 1.4); ctx.stroke();
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath(); ctx.arc(188, 174, 28, 0.4, Math.PI * 1.7); ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 3);
    return tex;
  }

  function createBoardGameTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff5d6'; ctx.fillRect(0, 0, 256, 256);
    const cols = ['#ff8fab', '#ffd166', '#90e0ef', '#b5e48c'];
    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4), col = i % 4;
      const x = 14 + col * 58, y = 14 + row * 58;
      ctx.fillStyle = i === 15 ? '#fbbf24' : cols[i % 4];
      ctx.fillRect(x, y, 52, 52);
      ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 3;
      ctx.strokeRect(x, y, 52, 52);
      ctx.fillStyle = '#3d2c1e'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(i === 15 ? '🏆' : (i === 4 || i === 9 || i === 12 ? '⭐' : String(i + 1)), x + 26, y + 34);
    }
    return new THREE.CanvasTexture(c);
  }

  function createWindowVistaTexture() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 160;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 160);
    g.addColorStop(0, '#6dc6f5'); g.addColorStop(0.68, '#d9f2ff'); g.addColorStop(1, '#fff3cf');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = 'rgba(255,253,245,0.92)';
    [[60, 44, 22], [82, 38, 26], [190, 52, 22]].forEach(cl => {
      ctx.beginPath(); ctx.arc(cl[0], cl[1], cl[2], 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#6db36b';
    ctx.beginPath(); ctx.ellipse(90, 162, 120, 46, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#539957';
    ctx.beginPath(); ctx.ellipse(205, 164, 100, 42, 0, 0, Math.PI * 2); ctx.fill();
    return new THREE.CanvasTexture(c);
  }

  function addDetailedWallWindow(worldGroup, x, y, z, rotY, w, h, curtHex, trimMat) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = rotY;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.24, h + 0.24, 0.14), trimMat);
    g.add(frame);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.16), new THREE.MeshBasicMaterial({ map: createWindowVistaTexture() }));
    g.add(glass);
    const mV = new THREE.Mesh(new THREE.BoxGeometry(0.07, h, 0.19), trimMat); g.add(mV);
    const mH = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, 0.19), trimMat); mH.position.y = 0.08; g.add(mH);
    const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.42, 0.12, 0.30), trimMat);
    sill.position.set(0, -h * 0.5 - 0.10, 0.08); g.add(sill);
    if (curtHex) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, w + 1.15, 6), trimMat);
      rod.rotation.z = Math.PI / 2; rod.position.set(0, h * 0.5 + 0.22, 0.14); g.add(rod);
      [-1, 1].forEach(side => {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.46, h + 0.48, 0.12), LS.makeToonMat(curtHex));
        c.position.set(side * (w * 0.5 + 0.24), -0.04, 0.14); g.add(c);
      });
    }
    worldGroup.add(g);
  }

  function addHangingStringLights(worldGroup, x1, z1, x2, z2, y, count, glowHex) {
    for (let i = 0; i < count; i++) {
      const u = count > 1 ? i / (count - 1) : 0.5;
      const lx = x1 + (x2 - x1) * u;
      const lz = z1 + (z2 - z1) * u;
      const ly = y - Math.sin(u * Math.PI) * 0.24;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 6), new THREE.MeshBasicMaterial({ color: 0xfff3c4 }));
      bulb.position.set(lx, ly, lz); worldGroup.add(bulb);
      if (LS.createGlowSprite && i % 2 === 0) {
        const halo = LS.createGlowSprite(glowHex || 0xffd57a, 1.15);
        halo.position.set(lx, ly, lz); worldGroup.add(halo);
      }
    }
  }

  // Shared helper: High-Detail 4-walled Studio Ghibli room shell (wainscoting, crown trim & wood beams, 0 extra lights!)
  function buildRoomShell(worldGroup, w, d, h, floorHex, wallHex, trimHex, floorTex) {
    const floorMat = LS.makeSurfaceMat(floorTex || LS.createCedarPlankTexture(), { color: floorTex ? 0xffffff : (floorHex || 0xe3c396) });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; worldGroup.add(floor);

    const wallMat = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture(wallHex || '#fbf2e3') });
    const wainMat = LS.makeToonMat(0xecdac0);
    const trimMat = LS.makeToonMat(trimHex || 0x8c5e3c);
    const whiteTrim = LS.makeToonMat(0xfff9ee);
    const ceilMat = LS.makeToonMat(0xfffaf0);

    const bw = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, h, 0.3), wallMat);
    bw.position.set(0, h / 2, -d / 2); worldGroup.add(bw);
    const fw = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, h, 0.3), wallMat);
    fw.position.set(0, h / 2, d / 2); worldGroup.add(fw);
    const lw = new THREE.Mesh(new THREE.BoxGeometry(0.3, h, d + 0.3), wallMat);
    lw.position.set(-w / 2, h / 2, 0); worldGroup.add(lw);
    const rw = new THREE.Mesh(new THREE.BoxGeometry(0.3, h, d + 0.3), wallMat);
    rw.position.set(w / 2, h / 2, 0); worldGroup.add(rw);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilMat);
    ceil.rotation.x = Math.PI / 2; ceil.position.y = h - 0.05; worldGroup.add(ceil);

    // Exposed wooden ceiling timber rafters!
    [-w * 0.28, 0, w * 0.28].forEach(bx => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, d), trimMat);
      beam.position.set(bx, h - 0.16, 0); worldGroup.add(beam);
    });

    // Wainscoting paneling, chair-rail, baseboards & crown molding!
    [[0, -d / 2 + 0.16, w, 0.06], [0, d / 2 - 0.16, w, 0.06]].forEach(b => {
      const ws = new THREE.Mesh(new THREE.BoxGeometry(b[2], 1.0, b[3]), wainMat);
      ws.position.set(b[0], 0.50, b[1]); worldGroup.add(ws);
      const rl = new THREE.Mesh(new THREE.BoxGeometry(b[2], 0.08, b[3] + 0.06), trimMat);
      rl.position.set(b[0], 1.02, b[1]); worldGroup.add(rl);
      const bb = new THREE.Mesh(new THREE.BoxGeometry(b[2], 0.20, b[3] + 0.06), whiteTrim);
      bb.position.set(b[0], 0.10, b[1]); worldGroup.add(bb);
      const cr = new THREE.Mesh(new THREE.BoxGeometry(b[2], 0.16, b[3] + 0.08), whiteTrim);
      cr.position.set(b[0], h - 0.12, b[1]); worldGroup.add(cr);
    });
    [[-w / 2 + 0.16, 0, 0.06, d], [w / 2 - 0.16, 0, 0.06, d]].forEach(b => {
      const ws = new THREE.Mesh(new THREE.BoxGeometry(b[2], 1.0, b[3]), wainMat);
      ws.position.set(b[0], 0.50, b[1]); worldGroup.add(ws);
      const rl = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.06, 0.08, b[3]), trimMat);
      rl.position.set(b[0], 1.02, b[1]); worldGroup.add(rl);
      const bb = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.06, 0.20, b[3]), whiteTrim);
      bb.position.set(b[0], 0.10, b[1]); worldGroup.add(bb);
      const cr = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.08, 0.16, b[3]), whiteTrim);
      cr.position.set(b[0], h - 0.12, b[1]); worldGroup.add(cr);
    });

    // Detailed Panelled Exit Door + Brass Handle + Welcome Mat back to Qashqai!
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.90, 2.65, 0.22), trimMat);
    door.position.set(0, 1.32, d / 2 - 0.15); worldGroup.add(door);
    const dKnob = new THREE.Mesh(new THREE.SphereGeometry(0.065, 7, 6), LS.makeToonMat(0xe9c46a));
    dKnob.position.set(0.68, 1.24, d / 2 - 0.30); worldGroup.add(dKnob);
    const mat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 1.15), LS.makeToonMat(0x4b5563));
    mat.position.set(0, 0.02, d / 2 - 0.9); worldGroup.add(mat);

    return { trimMat, wallMat };
  }

  // Helper: Animated cozy 3D TV screen on a detailed media stand
  function createAnimatedTV(worldGroup, x, y, z, rotY, mode) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = rotY;
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.68, 0.76), LS.makeToonMat(0x7c5032));
    stand.position.y = 0.34; stand.castShadow = true; g.add(stand);
    const sBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.09, 0.16), LS.makeToonMat(0x1f242c));
    sBar.position.set(0, 0.72, 0.24); g.add(sBar);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.50, 1.52, 0.16), LS.makeToonMat(0x1f242c));
    frame.position.set(0, 1.58, 0); g.add(frame);

    const c = document.createElement('canvas');
    c.width = 256; c.height = 152;
    const ctx = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c);
    const screenMat = new THREE.MeshBasicMaterial({ map: tex });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.28, 1.32), screenMat);
    screen.position.set(0, 1.58, 0.095); g.add(screen);
    worldGroup.add(g);

    return {
      canvas: c, ctx, mat: screenMat, lastFrame: -1, mode: mode || 'show',
      currentChannel: 'soap',
      manualChannel: null,
      manualUntil: 0,
      lastElapsed: 0,
      toggleChannel: function (elapsed) {
        const now = typeof elapsed === 'number' && elapsed > 0 ? elapsed : this.lastElapsed;
        this.manualChannel = this.currentChannel === 'soap' ? 'news' : 'soap';
        this.manualUntil = now + 12;
        this.currentChannel = this.manualChannel;
        this.lastFrame = -1;
        return this.currentChannel;
      },
      update: function (elapsed) {
        this.lastElapsed = elapsed;
        const f = Math.floor(elapsed * 10);
        if (f === this.lastFrame) return;
        this.lastFrame = f;
        const gGrad = ctx.createLinearGradient(0, 0, 0, 152);
        if (this.mode === 'sports') {
          gGrad.addColorStop(0, '#38a3e8'); gGrad.addColorStop(0.55, '#8ce0ff'); gGrad.addColorStop(1, '#3fa34d');
          ctx.fillStyle = gGrad; ctx.fillRect(0, 0, 256, 152);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(16, 108, 224, 4);
          const bx = 42 + ((elapsed * 55) % 170);
          const by = 98 - Math.abs(Math.sin(elapsed * 4.5)) * 28;
          ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#1f2937'; ctx.font = 'bold 16px sans-serif'; ctx.fillText('⚽ LIVE', 18, 28);
        } else if (this.mode === 'nano_tv') {
          // Mostly dramatic Soap Opera (~70%), sometimes switches to Breaking News (~30%)!
          let ch = (elapsed % 20) < 14 ? 'soap' : 'news';
          if (this.manualChannel && elapsed < this.manualUntil) ch = this.manualChannel;
          else if (this.manualChannel && elapsed >= this.manualUntil) this.manualChannel = null;
          this.currentChannel = ch;

          if (ch === 'soap') {
            // Dramatic Soap Opera Scene: Mansion evening backdrop, chandelier, two dramatic actors, hearts & subtitles!
            gGrad.addColorStop(0, '#3b1538'); gGrad.addColorStop(0.55, '#6b234e'); gGrad.addColorStop(1, '#261029');
            ctx.fillStyle = gGrad; ctx.fillRect(0, 0, 256, 152);
            // Moonlit mansion window in background
            ctx.fillStyle = '#1e2b58'; ctx.fillRect(98, 20, 60, 62);
            ctx.strokeStyle = '#e9c46a'; ctx.lineWidth = 3; ctx.strokeRect(98, 20, 60, 62);
            ctx.fillStyle = '#fff5cc'; ctx.beginPath(); ctx.arc(138, 38, 10, 0, Math.PI * 2); ctx.fill();
            // Dramatic Actor 1 (left, woman in red gown)
            const sway = Math.sin(elapsed * 3.2) * 3;
            ctx.fillStyle = '#e63963'; ctx.beginPath(); ctx.arc(76, 128, 26, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#f1c29b'; ctx.beginPath(); ctx.arc(76, 84 + sway * 0.4, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#241715'; ctx.beginPath(); ctx.arc(74, 80 + sway * 0.4, 16, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
            // Dramatic Actor 2 (right, man in tuxedo)
            ctx.fillStyle = '#1f2937'; ctx.beginPath(); ctx.arc(180, 128, 27, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#e0ac84'; ctx.beginPath(); ctx.arc(180, 82 - sway * 0.4, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1e1918'; ctx.beginPath(); ctx.arc(180, 77 - sway * 0.4, 15, Math.PI, 0); ctx.fill();
            // Floating dramatic icon
            ctx.font = '22px sans-serif';
            const dramaIcon = Math.floor(elapsed / 3) % 2 === 0 ? '💔' : '🌹';
            ctx.fillText(dramaIcon, 117, 68 + Math.sin(elapsed * 4) * 5);
            // Channel Badge
            ctx.fillStyle = 'rgba(233,196,106,0.92)'; ctx.fillRect(10, 10, 106, 22);
            ctx.fillStyle = '#2c1026'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('🎭 SOAP OPERA', 16, 25);
            // Subtitle Bar
            ctx.fillStyle = 'rgba(0,0,0,0.68)'; ctx.fillRect(0, 124, 256, 28);
            const lines = ['"Wait! Tell me the truth!"', '"I never forgot you..."', '"Gasp! The secret letter!"'];
            ctx.fillStyle = '#fff5d6'; ctx.font = 'italic bold 13px sans-serif';
            ctx.fillText(lines[Math.floor(elapsed / 3.5) % lines.length], 22, 142);
          } else {
            // Breaking News Broadcast: Blue studio, world map, anchor at desk, red LIVE NEWS badge & scrolling ticker!
            gGrad.addColorStop(0, '#0f2957'); gGrad.addColorStop(0.65, '#1d4d8f'); gGrad.addColorStop(1, '#0b1d3d');
            ctx.fillStyle = gGrad; ctx.fillRect(0, 0, 256, 152);
            // Stylized World Map glow on studio wall
            ctx.fillStyle = 'rgba(120,190,255,0.22)';
            ctx.beginPath(); ctx.ellipse(72, 62, 42, 22, 0.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(186, 56, 36, 18, -0.15, 0, Math.PI * 2); ctx.fill();
            // News Anchor in suit & red tie behind curved studio desk
            const nod = Math.sin(elapsed * 5.0) * 2;
            ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(128, 112, 28, Math.PI, 0); ctx.fill();
            ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(120, 92); ctx.lineTo(136, 92); ctx.lineTo(128, 112); ctx.fill();
            ctx.fillStyle = '#dc2626'; ctx.fillRect(126, 94, 4, 16);
            ctx.fillStyle = '#e5b894'; ctx.beginPath(); ctx.arc(128, 74 + nod, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.arc(128, 69 + nod, 15, Math.PI, 0); ctx.fill();
            // Curved News Desk
            ctx.fillStyle = '#cbd5e1'; ctx.fillRect(42, 108, 172, 18);
            ctx.fillStyle = '#dc2626'; ctx.fillRect(42, 108, 172, 4);
            // Flashing LIVE NEWS Badge
            ctx.fillStyle = Math.floor(elapsed * 2) % 2 === 0 ? '#dc2626' : '#ef4444';
            ctx.fillRect(10, 10, 96, 22);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('🔴 LIVE NEWS', 16, 25);
            // Scrolling News Ticker
            ctx.fillStyle = '#b91c1c'; ctx.fillRect(0, 126, 256, 26);
            ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px sans-serif';
            const ticker = 'BREAKING NEWS: SUNNY SKIES TODAY • COZY TEA TIME • NEIGHBORHOOD BAKERY WINS GOLD •   ';
            const tx = 256 - ((elapsed * 58) % 620);
            ctx.fillText(ticker, tx, 143);
          }
        } else {
          gGrad.addColorStop(0, '#ffafcc'); gGrad.addColorStop(0.6, '#fde4cf'); gGrad.addColorStop(1, '#95d5b2');
          ctx.fillStyle = gGrad; ctx.fillRect(0, 0, 256, 152);
          ctx.fillStyle = '#fffdf5';
          const cx = ((elapsed * 22) % 300) - 30;
          ctx.beginPath(); ctx.arc(cx, 48, 20, 0, Math.PI * 2); ctx.arc(cx + 22, 42, 24, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#e07a5f'; ctx.font = 'bold 24px sans-serif';
          ctx.fillText('🌸 🏡 ✨', 76, 104 + Math.sin(elapsed * 3) * 8);
        }
        screenMat.map.needsUpdate = true;
      }
    };
  }

  function addIndoorPlant(worldGroup, x, z, potHex, tall) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.21, 0.46, 10), LS.makeToonMat(potHex || 0xc66b47));
    pot.position.set(x, 0.23, z); pot.castShadow = true; worldGroup.add(pot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.04, 7, 12), LS.makeToonMat(potHex || 0xc66b47));
    rim.rotation.x = Math.PI / 2; rim.position.set(x, 0.45, z); worldGroup.add(rim);
    if (tall) {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.72, 7), LS.makeToonMat(0x6e472b));
      stem.position.set(x, 0.76, z); worldGroup.add(stem);
    }
    const baseY = tall ? 1.18 : 0.72;
    const leafMat = LS.makeToonMat(0x3f8f47);
    [[0, 0, 0, 0.38], [0.20, 0.24, 0.12, 0.27], [-0.20, 0.20, -0.1, 0.27], [0.04, 0.42, -0.06, 0.24]].forEach(b => {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(b[3], 1), leafMat);
      m.position.set(x + b[0], baseY + b[1], z + b[2]); worldGroup.add(m);
    });
  }

  // =========================================================================
  // DESTINATION 1: EATERY RESTAURANT (dest_eatery) — HIGH-DETAIL GHIBLI BISTRO
  // Checkered terracotta floor, warm brick accent wall, Edison string lights,
  // glass pastry display case, chalk menu board, simmering Molokhia steam!
  // =========================================================================
  function buildEatery(worldGroup) {
    const W = {
      id: 'dest_eatery',
      isInterior: true,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      potSteams: [],
      diningConfigs: {
        eatery_dining: {
          lailaSeat: new THREE.Vector3(-1.15, 0.18, -1.0),
          salmaSeat: new THREE.Vector3(1.15, 0.18, -1.0),
          lailaDishPos: new THREE.Vector3(-0.62, 0.86, -1.0),
          salmaDishPos: new THREE.Vector3(0.62, 0.86, -1.0),
          oishiiPos: new THREE.Vector3(0, 1.85, -1.0),
          seatYaw: 0,
          camPos: new THREE.Vector3(0, 2.35, 3.0),
          camLook: new THREE.Vector3(0, 1.05, -1.0),
          caption: 'Yum at Eatery! 🍲🍗🍝',
          exitPos: new THREE.Vector3(0, 0, 2.0)
        }
      }
    };
    const addCol = (x, z, hw, hd) => W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    W.getGroundHeight = () => 0;

    const tileTex = createCheckerTileTexture('#f5e5cc', '#e3c49d', 7, 6);
    const { trimMat } = buildRoomShell(worldGroup, 18, 14, 4.5, 0xdfb98a, '#fbf0dd', 0x7c4e2e, tileTex);

    // Warm Terracotta Brick Accent Wall behind Open Kitchen Pass!
    const brickWall = new THREE.Mesh(new THREE.BoxGeometry(11.6, 3.5, 0.12), LS.makeToonMat(0xb85842));
    brickWall.position.set(0, 2.55, -6.82); worldGroup.add(brickWall);
    // Sunlit Curtained Side Windows on West & East walls!
    addDetailedWallWindow(worldGroup, -8.82, 2.35, -1.0, Math.PI / 2, 2.8, 1.75, 0xe8c59e, trimMat);
    addDetailedWallWindow(worldGroup, 8.82, 2.35, -1.0, -Math.PI / 2, 2.8, 1.75, 0xe8c59e, trimMat);

    // Eatery Signboard + Side Chalkboard Menu + Spice & Olive Oil Wall Shelves!
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 1.05, 0.16),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🍲 EATERY • MOLOKHIA, CHICKEN, RICE & PASTA 🍝', {
          bg: '#fff8ec', border: '#c97b36', color: '#4a2b14', font: 'bold 22px sans-serif', width: 640, height: 110
        })
      })
    );
    sign.position.set(0, 3.65, -6.72); worldGroup.add(sign);

    const chalkMenu = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.45, 0.12),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🍲 SPECIALS: MOLOKHIA & PASTA!', {
          bg: '#23312d', border: '#d9a45b', color: '#fff8e7', font: 'bold 24px sans-serif', width: 320, height: 220
        })
      })
    );
    chalkMenu.position.set(-7.1, 2.45, -6.80); worldGroup.add(chalkMenu);

    // Open Kitchen Pass Counter + Glass Pastry Display Case + Copper Molokhia Pot with Steam!
    const counter = new THREE.Mesh(new THREE.BoxGeometry(10.8, 1.05, 1.35), LS.makeToonMat(0x8c5630));
    counter.position.set(0, 0.52, -5.7); counter.castShadow = true; worldGroup.add(counter);
    const cTop = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.12, 1.48), LS.makeToonMat(0xede0cc));
    cTop.position.set(0, 1.08, -5.7); worldGroup.add(cTop);
    // Glass dessert/bread display case on right of counter
    const pCase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 0.95), LS.makeToonMat(0xebf8ff, { transparent: true, opacity: 0.42 }));
    pCase.position.set(3.8, 1.50, -5.7); worldGroup.add(pCase);
    [3.2, 3.8, 4.4].forEach((px, pi) => {
      const loaf = new THREE.Mesh(new THREE.SphereGeometry(0.20, 8, 6), LS.makeToonMat(pi === 1 ? 0xe9a954 : 0xd48b47));
      loaf.scale.set(1.2, 0.65, 0.9); loaf.position.set(px, 1.28, -5.7); worldGroup.add(loaf);
    });
    // Copper Molokhia Pot + Animated Rising Steam!
    const pot1 = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.30, 0.34, 14), LS.makeToonMat(0xc86d28));
    pot1.position.set(-2.6, 1.30, -5.7); worldGroup.add(pot1);
    const mTop = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.04, 14), LS.makeToonMat(0x2d7a36));
    mTop.position.set(-2.6, 1.47, -5.7); worldGroup.add(mTop);
    for (let i = 0; i < 3; i++) {
      const st = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), LS.makeToonMat(0xffffff, { transparent: true, opacity: 0.45 }));
      st.userData = { bx: -2.6, by: 1.56, bz: -5.7, phase: i * 0.33 };
      worldGroup.add(st); W.potSteams.push(st);
    }
    const pot2 = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.26, 0.28, 12), LS.makeToonMat(0xd9a773));
    pot2.position.set(-1.5, 1.28, -5.7); worldGroup.add(pot2);
    addCol(0, -5.7, 5.5, 0.9);

    // Warm Edison Fairy String Lights & Pendant Lamps!
    addHangingStringLights(worldGroup, -7.8, -3.5, 7.8, -3.5, 3.85, 9, 0xffd57a);
    addHangingStringLights(worldGroup, -7.8, 1.8, 7.8, 1.8, 3.85, 9, 0xffd57a);
    [-4.8, 0, 4.8].forEach(lx => {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 5), trimMat);
      cord.position.set(lx, 4.05, -1.0); worldGroup.add(cord);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.34, 12), LS.makeToonMat(0xe07a5f));
      shade.position.set(lx, 3.55, -1.0); worldGroup.add(shade);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), LS.makeEmissiveMat(0xfff5d6, 0xffd166, 0.92));
      bulb.position.set(lx, 3.38, -1.0); worldGroup.add(bulb);
    });

    // Woven Center Carpet under Main Family Table!
    if (LS.createWovenRugTexture) {
      const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.6), LS.makeSurfaceMat(LS.createWovenRugTexture('#fae8d0', '#2d7a36', '#e9c46a')));
      rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.015, -1.0); worldGroup.add(rug);
    }

    // Detailed Dining Tables with Bread Baskets, Water Carafes, Candles & Upholstered Chairs!
    function addDiningTable(tx, tz, featured) {
      const tg = new THREE.Group();
      tg.position.set(tx, 0, tz);
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 1.5), LS.makeToonMat(0xfff8ec));
      top.position.y = 0.80; top.castShadow = true; tg.add(top);
      const run = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.13, 1.54), LS.makeToonMat(featured ? 0x2d7a36 : 0xc97b36));
      run.position.y = 0.805; tg.add(run);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.78, 10), trimMat);
      leg.position.y = 0.39; tg.add(leg);
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.18, 8), LS.makeEmissiveMat(0xfff4d0, 0xffcc66, 0.9));
      candle.position.set(0, 0.94, 0); tg.add(candle);
      // Warm pita bread basket & water carafe
      const bsk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.10, 10), LS.makeToonMat(0xc48b57));
      bsk.position.set(0, 0.90, -0.42); tg.add(bsk);
      const car = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.24, 8), LS.makeToonMat(0xb8e6ff));
      car.position.set(0, 0.97, 0.42); tg.add(car);
      [-1.22, 1.22].forEach(cx => {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.48, 0.56), trimMat);
        seat.position.set(cx, 0.24, 0); tg.add(seat);
        const cush = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.07, 0.50), LS.makeToonMat(0xe07a5f));
        cush.position.set(cx, 0.51, 0); tg.add(cush);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.58, 0.54), trimMat);
        back.position.set(cx + (cx < 0 ? -0.25 : 0.25), 0.70, 0); tg.add(back);
      });
      worldGroup.add(tg);
      addCol(tx, tz, 1.28, 0.88);
    }
    addDiningTable(0, -1.0, true);
    addDiningTable(-5.6, 0.8, false);
    addDiningTable(5.6, 0.8, false);

    addIndoorPlant(worldGroup, -7.8, -5.8, 0xc66b47, true);
    addIndoorPlant(worldGroup, 7.8, -5.8, 0xc66b47, true);
    addIndoorPlant(worldGroup, -7.8, 5.6, 0x2a9d8f, false);
    addIndoorPlant(worldGroup, 7.8, 5.6, 0x2a9d8f, false);

    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Chef Karim (Eatery)',
        line: 'Ahlan {leader}! Fresh green Molokhia with rice & chicken, or creamy pasta today? 🍲🍝',
        lines: [
          'Ahlan {leader}! Fresh green Molokhia with rice & chicken, or creamy pasta today? 🍲🍝',
          'Our roasted chicken and fluffy rice just came out piping hot, {leader}! 🍗✨',
          'Always so happy to cook for you and {companion}, {leader}! 💛'
        ],
        pos: new THREE.Vector3(0, 0, -4.4),
        baseRot: 0,
        waveOnNear: true,
        char: { scale: 0.96, skinColor: 0xd9a27e, hairColor: 0x1f1916, topColor: 0xffffff, bottomColor: 0x2b2d42, pants: true, faceOpts: { mustache: true } }
      },
      {
        name: 'Nour (Eatery Guest) 🍲',
        line: 'Hi {leader}! You HAVE to try the emerald-green Molokhia here — it\'s delicious! 🍲✨',
        lines: [
          'Hi {leader}! You HAVE to try the emerald-green Molokhia here — it\'s delicious! 🍲✨',
          'This warm dining hall smells amazing today, {leader}! 🍝💛'
        ],
        pos: new THREE.Vector3(-5.8, 0, 2.2),
        baseRot: 0.75,
        waveOnNear: true,
        char: { scale: 0.91, skinColor: 0xe4b292, hairColor: 0x2b1d17, topColor: 0xe07a5f, bottomColor: 0x334155, longHair: true }
      },
      {
        name: 'Hassan (Server) 🍽️',
        line: 'Right this way to your cozy family table, {leader}! 🍽️☀️',
        lines: [
          'Right this way to your cozy family table, {leader}! 🍽️☀️',
          'Eatery pasta gives awesome running energy for your next adventure, {leader}! ⚡'
        ],
        pos: new THREE.Vector3(5.6, 0, -1.8),
        baseRot: -0.75,
        patrol: { axis: 'z', center: -1.8, range: 2.0, speed: 0.85 },
        char: { scale: 0.95, skinColor: 0xd29c74, hairColor: 0x1e1815, topColor: 0x2a9d8f, bottomColor: 0x1e293b, pants: true }
      }
    ]);

    W.zones.push({ id: 'eatery_order', label: 'Order at Eatery (Molokhia, Rice & Chicken or Pasta) 🍲🍝', pos: new THREE.Vector3(0, 0, 1.1), radius: 2.8 });
    W.zones.push({ id: 'home_qashqai', label: 'Hop in Gray Nissan Qashqai (Drive Home or Elsewhere) 🚙', pos: new THREE.Vector3(0, 0, 5.7), radius: 2.3 });

    W.update = (dt, elapsed) => {
      W.potSteams.forEach(st => {
        const t = (elapsed * 0.55 + st.userData.phase) % 1.0;
        st.position.set(st.userData.bx + Math.sin(elapsed * 2 + st.userData.phase * 5) * 0.1, st.userData.by + t * 0.65, st.userData.bz);
        st.scale.setScalar(0.65 + t * 1.1);
        st.material.opacity = (1 - t) * 0.44;
      });
    };
    W.getZoneLabel = () => 'Eatery Restaurant 🍲🍝';
    W.drawMiniMap = (ctx, Wpx, Hpx, toX, toY) => {
      ctx.fillStyle = '#f5e4c8'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#c97b36'; ctx.fillRect(toX(-5), toY(-6.2), toX(5) - toX(-5), toY(-4.6) - toY(-6.2));
      ctx.fillStyle = '#2d7a36'; ctx.fillRect(toX(-1.5), toY(-2), toX(1.5) - toX(-1.5), toY(0) - toY(-2));
      ctx.fillStyle = '#3d2c1e'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('EATERY', toX(0), toY(-2.5));
      ctx.fillText('QASHQAI 🚙', toX(0), toY(5.6));
    };
    return W;
  }

  // =========================================================================
  // DESTINATION 2: YIWAN RESTAURANT (dest_yiwan) — HIGH-DETAIL ASIAN PAVILION
  // Shoji lattice screens, blossom scroll mural, curved eave dumpling bar with
  // rising steam, swaying tasseled lanterns, moon-gate bamboo Zen corner!
  // =========================================================================
  function buildYiwan(worldGroup) {
    const W = {
      id: 'dest_yiwan',
      isInterior: true,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      lanterns: [],
      steams: [],
      diningConfigs: {
        yiwan_dining: {
          lailaSeat: new THREE.Vector3(-1.15, 0.18, -1.0),
          salmaSeat: new THREE.Vector3(1.15, 0.18, -1.0),
          lailaDishPos: new THREE.Vector3(-0.62, 0.86, -1.0),
          salmaDishPos: new THREE.Vector3(0.62, 0.86, -1.0),
          oishiiPos: new THREE.Vector3(0, 1.85, -1.0),
          seatYaw: 0,
          camPos: new THREE.Vector3(0, 2.35, 3.0),
          camLook: new THREE.Vector3(0, 1.05, -1.0),
          caption: 'Delicious at Yiwan! 🥟🍗🍚',
          exitPos: new THREE.Vector3(0, 0, 2.0)
        }
      }
    };
    const addCol = (x, z, hw, hd) => W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    W.getGroundHeight = () => 0;

    buildRoomShell(worldGroup, 18, 14, 4.5, 0xc79263, '#faebd7', 0x7c1d22);

    // Decorative Wood Lattice Screens on West & East Walls + Golden Blossom Scroll Mural!
    const latMat = LS.makeSurfaceMat(LS.createWoodLatticeTexture());
    [[-8.78, Math.PI / 2], [8.78, -Math.PI / 2]].forEach(w => {
      const sc = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.5, 0.12), latMat);
      sc.position.set(w[0], 2.4, -0.8); sc.rotation.y = w[1]; worldGroup.add(sc);
    });
    const scrollMural = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.5, 0.10),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🌸 🥢 YIWAN KITCHEN 🐉 🌸', {
          bg: '#fff3d6', border: '#9e2a2b', color: '#7c1d22', font: 'bold 26px sans-serif', width: 420, height: 180
        })
      })
    );
    scrollMural.position.set(0, 2.42, -6.82); worldGroup.add(scrollMural);

    // Rich Red & Gold Yiwan Restaurant Signboard + Curved Pavilion Roof Eave above Bar!
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 1.05, 0.16),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🥟 YIWAN • DUMPLINGS, SWEET & SOUR & RICE 🏮', {
          bg: '#7c1d22', border: '#e9c46a', color: '#fff8e7', font: 'bold 22px sans-serif', width: 640, height: 110
        })
      })
    );
    sign.position.set(0, 3.68, -6.74); worldGroup.add(sign);

    const eave = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.18, 1.45), LS.makeToonMat(0x7c1d22));
    eave.position.set(0, 3.05, -6.15); eave.rotation.x = 0.24; worldGroup.add(eave);

    // Tasseled Swaying Red & Gold Silk Lanterns!
    [[-5.2, -2.5], [0, -2.5], [5.2, -2.5], [-4.8, 2.4], [4.8, 2.4]].forEach((lp, i) => {
      const lg = new THREE.Group();
      lg.position.set(lp[0], 3.55, lp[1]);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), LS.makeEmissiveMat(0xd62828, 0xff6b35, 0.76));
      body.scale.set(1.0, 1.18, 1.0); lg.add(body);
      const capT = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 10), LS.makeToonMat(0xe9c46a));
      capT.position.y = 0.44; lg.add(capT);
      const capB = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 10), LS.makeToonMat(0xe9c46a));
      capB.position.y = -0.44; lg.add(capB);
      const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.34, 6), LS.makeToonMat(0xe9c46a));
      tassel.position.y = -0.64; lg.add(tassel);
      if (LS.createGlowSprite) lg.add(LS.createGlowSprite(0xff9f68, 1.75));
      lg.userData.phase = i * 1.1;
      worldGroup.add(lg);
      W.lanterns.push(lg);
    });

    // Dumpling Steamer Bar Counter + Animated Rising Steamer Wisps!
    const bar = new THREE.Mesh(new THREE.BoxGeometry(10.8, 1.05, 1.35), LS.makeToonMat(0x6b2024));
    bar.position.set(0, 0.52, -5.7); bar.castShadow = true; worldGroup.add(bar);
    const bTop = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.12, 1.48), LS.makeToonMat(0xd9a773));
    bTop.position.set(0, 1.08, -5.7); worldGroup.add(bTop);
    [-3.4, -2.5, 2.5, 3.4].forEach((bx, bi) => {
      const tiers = bi % 2 === 0 ? 3 : 2;
      for (let tier = 0; tier < tiers; tier++) {
        const st = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 14), LS.makeToonMat(0xd9ad6c));
        st.position.set(bx, 1.21 + tier * 0.15, -5.7); worldGroup.add(st);
      }
      if (bi === 0 || bi === 3) {
        const wisp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), LS.makeToonMat(0xffffff, { transparent: true, opacity: 0.45 }));
        wisp.userData = { bx: bx, by: 1.25 + tiers * 0.15, bz: -5.7, phase: bi * 0.4 };
        worldGroup.add(wisp); W.steams.push(wisp);
      }
    });
    addCol(0, -5.7, 5.5, 0.9);

    // Ornate Red & Gold Carpet under Main Round Banquet Table!
    if (LS.createWovenRugTexture) {
      const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 4.4), LS.makeSurfaceMat(LS.createWovenRugTexture('#f5d7c4', '#9e2a2b', '#e9c46a')));
      rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.015, -1.0); worldGroup.add(rug);
    }

    const woodDark = LS.makeToonMat(0x5c231c);
    const goldMat = LS.makeToonMat(0xe9c46a);
    function addYiwanTable(tx, tz, main) {
      const tg = new THREE.Group();
      tg.position.set(tx, 0, tz);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(main ? 1.24 : 0.98, main ? 1.24 : 0.98, 0.10, 22), woodDark);
      top.position.y = 0.80; top.castShadow = true; tg.add(top);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(main ? 1.24 : 0.98, 0.03, 7, 24), goldMat);
      rim.rotation.x = Math.PI / 2; rim.position.y = 0.82; tg.add(rim);
      const lazy = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.04, 18), LS.makeToonMat(0x9e2a2b));
      lazy.position.y = 0.87; tg.add(lazy);
      const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), goldMat);
      teapot.position.y = 1.02; tg.add(teapot);
      [-0.36, 0.36].forEach(cx => {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.08, 8), LS.makeToonMat(0xfffaf0));
        cup.position.set(cx, 0.92, 0.25); tg.add(cup);
      });
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.36, 0.78, 12), woodDark);
      ped.position.y = 0.39; tg.add(ped);
      [-1.24, 1.24].forEach(cx => {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.48, 0.54), LS.makeToonMat(0x9e2a2b));
        seat.position.set(cx, 0.24, 0); tg.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.58, 0.52), woodDark);
        back.position.set(cx + (cx < 0 ? -0.24 : 0.24), 0.70, 0); tg.add(back);
      });
      worldGroup.add(tg);
      addCol(tx, tz, 1.3, 1.2);
    }
    addYiwanTable(0, -1.0, true);
    addYiwanTable(-5.6, 0.6, false);
    addYiwanTable(5.6, 0.6, false);

    // Tall Bamboo Urns + Circular Moon-Gate Arch Decorative Accent in corners!
    [-7.8, 7.8].forEach(bx => {
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 0.58, 12), LS.makeToonMat(0x9e2a2b));
      urn.position.set(bx, 0.29, -5.8); worldGroup.add(urn);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 6, 14), goldMat);
      ring.rotation.x = Math.PI / 2; ring.position.set(bx, 0.56, -5.8); worldGroup.add(ring);
      [-0.12, 0, 0.12].forEach((ox, oi) => {
        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.9 + oi * 0.3, 7), LS.makeToonMat(0x4b9349));
        stalk.position.set(bx + ox, 1.85, -5.8 + (oi - 1) * 0.08); worldGroup.add(stalk);
        const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), LS.makeToonMat(0x52a850));
        leaf.position.set(bx + ox, 3.1 + oi * 0.2, -5.8); worldGroup.add(leaf);
      });
    });

    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Chef Mei (Yiwan)',
        line: 'Welcome to Yiwan, {leader}! Dumplings, Sweet & Sour Chicken, Jasmine Rice, or a Combo Feast? 🥟🍚',
        lines: [
          'Welcome to Yiwan, {leader}! Dumplings, Sweet & Sour Chicken, Jasmine Rice, or a Combo Feast? 🥟🍚',
          'Our bamboo steamers are bubbling with fresh handmade dumplings, {leader}! 🥟✨',
          'Mix and match your own red lacquer combination tray, {leader}! 🍱💛'
        ],
        pos: new THREE.Vector3(0, 0, -4.4),
        baseRot: 0,
        waveOnNear: true,
        char: { scale: 0.92, skinColor: 0xf4d2bc, hairColor: 0x1e1817, topColor: 0x9e2a2b, bottomColor: 0x22262e, hairBun: true }
      },
      {
        name: 'Sora (Yiwan Guest) 🥟',
        line: 'Hi {leader}! The Sweet & Sour Chicken with Jasmine Rice is my all-time favorite! 🍗🍍',
        lines: [
          'Hi {leader}! The Sweet & Sour Chicken with Jasmine Rice is my all-time favorite! 🍗🍍',
          'Look at the warm red lanterns gently swaying overhead, {leader}! 🏮✨'
        ],
        pos: new THREE.Vector3(-5.8, 0, 2.2),
        baseRot: 0.72,
        waveOnNear: true,
        char: { scale: 0.90, skinColor: 0xf0cbb2, hairColor: 0x1c1716, topColor: 0xf4a261, bottomColor: 0x1e293b, longHair: true }
      },
      {
        name: 'Ken (Dumpling Helper) 🍱',
        line: 'Fresh jasmine rice coming right out for you, {leader}! 🍚✨',
        lines: [
          'Fresh jasmine rice coming right out for you, {leader}! 🍚✨',
          'Try ordering the 3-item Combination Feast to share with {companion}, {leader}! 🥟'
        ],
        pos: new THREE.Vector3(5.6, 0, -1.6),
        baseRot: -0.7,
        patrol: { axis: 'z', center: -1.6, range: 2.0, speed: 0.85 },
        char: { scale: 0.94, skinColor: 0xedd0ba, hairColor: 0x1e1817, topColor: 0xd97706, bottomColor: 0x1e293b, pants: true }
      }
    ]);

    W.zones.push({ id: 'yiwan_order', label: 'Order at Yiwan (Dumplings, Sweet & Sour, Rice or Combo!) 🥟🍗', pos: new THREE.Vector3(0, 0, 1.2), radius: 2.8 });
    W.zones.push({ id: 'home_qashqai', label: 'Hop in Gray Nissan Qashqai (Drive Home or Elsewhere) 🚙', pos: new THREE.Vector3(0, 0, 5.7), radius: 2.3 });

    W.update = (dt, elapsed) => {
      W.lanterns.forEach(l => { l.rotation.z = Math.sin(elapsed * 1.4 + l.userData.phase) * 0.06; });
      W.steams.forEach(st => {
        const t = (elapsed * 0.55 + st.userData.phase) % 1.0;
        st.position.set(st.userData.bx + Math.sin(elapsed * 2 + st.userData.phase * 5) * 0.09, st.userData.by + t * 0.65, st.userData.bz);
        st.scale.setScalar(0.65 + t * 1.05);
        st.material.opacity = (1 - t) * 0.44;
      });
    };
    W.getZoneLabel = () => 'Yiwan Restaurant 🥟🏮';
    W.drawMiniMap = (ctx, Wpx, Hpx, toX, toY) => {
      ctx.fillStyle = '#f2dec2'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#9e2a2b'; ctx.fillRect(toX(-5), toY(-6.2), toX(5) - toX(-5), toY(-4.6) - toY(-6.2));
      ctx.fillStyle = '#e9c46a'; ctx.beginPath(); ctx.arc(toX(0), toY(-1), 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3d2c1e'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('YIWAN', toX(0), toY(-2.5));
      ctx.fillText('QASHQAI 🚙', toX(0), toY(5.6));
    };
    return W;
  }

  // =========================================================================
  // DESTINATION 3: COSMO CITY ARCADE (dest_cosmo_city) — HIGH-DETAIL ARCADE!
  // Galaxy carpet, neon wall strips, animated CRT screens, glass 3D claw machine
  // with moving crane & plushies, animated air hockey puck & glass prize showcase!
  // =========================================================================
  function buildCosmoCity(worldGroup) {
    const W = {
      id: 'dest_cosmo_city',
      isInterior: true,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      neonStars: [],
      clawHook: null,
      hockeyPuck: null
    };
    const addCol = (x, z, hw, hd) => W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    W.getGroundHeight = () => 0;

    // Galaxy Star-Patterned Arcade Carpet Floor!
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), LS.makeSurfaceMat(createGalaxyCarpetTexture()));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; worldGroup.add(floor);

    const tileCols = [0xff5d8f, 0x38bdf8, 0xffd166, 0xa855f7];
    const wallMat = LS.makeToonMat(0x2d275c);
    [[0, -8, 20.3, 4.6, 0.3], [0, 8, 20.3, 4.6, 0.3], [-10, 0, 0.3, 4.6, 16.3], [10, 0, 0.3, 4.6, 16.3]].forEach(b => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(b[2], b[3], b[4]), wallMat);
      m.position.set(b[0], b[3] / 2, b[1]); worldGroup.add(m);
    });
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), LS.makeToonMat(0x181538));
    ceil.rotation.x = Math.PI / 2; ceil.position.y = 4.55; worldGroup.add(ceil);

    // Glowing Neon Trim Strips around the Arcade Walls!
    const cyanNeon = LS.makeEmissiveMat(0x38bdf8, 0x38bdf8, 0.92);
    const pinkNeon = LS.makeEmissiveMat(0xf472b6, 0xf472b6, 0.92);
    [[0, 3.1, -7.82, 19.6, 0.08, 0.08, cyanNeon], [0, 0.25, -7.82, 19.6, 0.08, 0.08, pinkNeon],
     [-9.82, 3.1, 0, 0.08, 0.08, 15.6, pinkNeon], [9.82, 3.1, 0, 0.08, 0.08, 15.6, cyanNeon]].forEach(n => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(n[3], n[4], n[5]), n[6]);
      bar.position.set(n[0], n[1], n[2]); worldGroup.add(bar);
    });

    // Glowing COSMO CITY Signboard + Retro Game Wall Posters!
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(8.6, 1.18, 0.16),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🚀 COSMO CITY FAMILY ARCADE 🕹️✨', {
          bg: '#1e1b4b', border: '#38bdf8', color: '#fde047', font: 'bold 28px sans-serif', width: 640, height: 110
        })
      })
    );
    sign.position.set(0, 3.85, -7.75); worldGroup.add(sign);

    // Floating Orbiting Ringed Planets under the Ceiling!
    [[-5.5, 3.65, -2.0, 0x38bdf8], [0, 3.8, 0.8, 0xffd166], [5.5, 3.65, -2.0, 0xff5d8f]].forEach((sp, i) => {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.44, 14, 10), LS.makeEmissiveMat(sp[3], sp[3], 0.78));
      orb.position.set(sp[0], sp[1], sp[2]); worldGroup.add(orb);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.045, 6, 22), LS.makeEmissiveMat(0xffffff, sp[3], 0.68));
      ring.rotation.x = Math.PI / 2 - 0.3; ring.position.copy(orb.position); worldGroup.add(ring);
      if (LS.createGlowSprite) {
        const h = LS.createGlowSprite(sp[3], 1.75);
        h.position.copy(orb.position); worldGroup.add(h);
      }
      orb.userData = { baseY: sp[1], phase: i * 1.4, ring: ring };
      W.neonStars.push(orb);
    });

    // Detailed Arcade Cabinet Builder (with coin slots, speaker grille, pixel art screen & neon trim!)
    function addArcadeCabinet(x, z, rotY, bodyHex, screenText, labelText) {
      const g = new THREE.Group();
      g.position.set(x, 0, z); g.rotation.y = rotY;
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.62, 2.42, 1.18), LS.makeToonMat(bodyHex));
      cab.position.y = 1.21; cab.castShadow = true; g.add(cab);
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.16, 0.58), LS.makeToonMat(0x1e293b));
      deck.position.set(0, 1.05, 0.74); g.add(deck);
      // Glowing Coin Slot!
      const coinSlot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.08), LS.makeEmissiveMat(0xf59e0b, 0xf59e0b, 0.7));
      coinSlot.position.set(0, 0.58, 0.60); g.add(coinSlot);
      // Joystick & glowing buttons
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 6), LS.makeToonMat(0xdbe4ee));
      stick.position.set(-0.38, 1.22, 0.78); g.add(stick);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.068, 8, 6), LS.makeToonMat(0xff595e));
      knob.position.set(-0.38, 1.32, 0.78); g.add(knob);
      [0.12, 0.30, 0.48].forEach((bx, bi) => {
        const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.05, 8), LS.makeEmissiveMat(tileCols[bi], tileCols[bi], 0.85));
        bt.position.set(bx, 1.15, 0.78); g.add(bt);
      });
      const scr = new THREE.Mesh(
        new THREE.BoxGeometry(1.32, 0.94, 0.08),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture(screenText, { bg: '#0b1026', border: '#38bdf8', color: '#fde047', font: 'bold 28px sans-serif', width: 256, height: 180 })
        })
      );
      scr.position.set(0, 1.64, 0.60); scr.rotation.x = -0.10; g.add(scr);
      const marq = new THREE.Mesh(
        new THREE.BoxGeometry(1.56, 0.38, 0.12),
        new THREE.MeshBasicMaterial({
          map: LS.createSignTexture(labelText, { bg: '#0f172a', border: '#fde047', color: '#ffffff', font: 'bold 26px sans-serif', width: 320, height: 80 })
        })
      );
      marq.position.set(0, 2.28, 0.62); g.add(marq);
      worldGroup.add(g);
      addCol(x, z, 0.98, 0.88);
    }

    // Station 1 & 2: Space Meteor Catcher & Cosmo Color Memory Cabinets
    addArcadeCabinet(-5.4, -5.8, 0, 0x2563eb, '☄️ ⭐ 🚀', '🛸 METEOR CATCH');
    addArcadeCabinet(0, -5.8, 0, 0x9333ea, '🌸 💎 ⭐ 🍀', '🎨 COSMO MEMORY');

    // Station 3: TRUE 3D GLASS CLAW MACHINE filled with colorful Plushies & Moving Internal Crane!
    const clawG = new THREE.Group();
    clawG.position.set(5.4, 0, -5.8);
    const cBase = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.05, 1.35), LS.makeToonMat(0xec4899));
    cBase.position.y = 0.52; cBase.castShadow = true; clawG.add(cBase);
    const cGlass = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.25, 1.25), LS.makeToonMat(0xe0f2fe, { transparent: true, opacity: 0.34 }));
    cGlass.position.y = 1.66; clawG.add(cGlass);
    const cTop = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.38, 1.38), LS.makeToonMat(0xdb2777));
    cTop.position.y = 2.42; clawG.add(cTop);
    const cMarq = new THREE.Mesh(
      new THREE.BoxGeometry(1.66, 0.32, 0.10),
      new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🧸 CLAW GRABBER', { bg: '#0f172a', border: '#fde047', color: '#fff', font: 'bold 24px sans-serif', width: 300, height: 70 }) })
    );
    cMarq.position.set(0, 2.42, 0.72); clawG.add(cMarq);
    // Pile of miniature plushies inside the glass claw box!
    [[-0.4, -0.2, 0xffd166], [0.0, 0.1, 0xff8fab], [0.42, -0.15, 0x38bdf8], [-0.25, 0.25, 0xa855f7], [0.25, 0.22, 0x34d399]].forEach(pl => {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 7), LS.makeToonMat(pl[2]));
      p.position.set(pl[0], 1.22, pl[1]); clawG.add(p);
    });
    // Animated swinging 3D crane hook inside the glass box!
    const cHook = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 6), LS.makeToonMat(0xfde047));
    cHook.rotation.x = Math.PI; cHook.position.set(0, 1.98, 0); clawG.add(cHook);
    W.clawHook = cHook;
    worldGroup.add(clawG);
    addCol(5.4, -5.8, 1.0, 0.88);

    // Extra side decorative arcade cabinets along West Wall!
    addArcadeCabinet(-8.6, -1.6, Math.PI / 2, 0x0ea5e9, '🏎️ TURBO', '🏎️ STAR RACER');
    addArcadeCabinet(-8.6, 2.0, Math.PI / 2, 0xf59e0b, '🏀 HOOPS!', '🏀 COSMO DUNK');

    // Detailed Glowing Air Hockey Table with Score Arch & Sliding Puck!
    const ah = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.86, 1.6), LS.makeToonMat(0x1e293b));
    ah.position.set(-3.6, 0.43, 1.6); ah.castShadow = true; worldGroup.add(ah);
    const ahTop = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.06, 1.38), LS.makeEmissiveMat(0xe0f2fe, 0x38bdf8, 0.48));
    ahTop.position.set(-3.6, 0.88, 1.6); worldGroup.add(ahTop);
    const ahArch = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 7, 16, Math.PI), pinkNeon);
    ahArch.rotation.y = Math.PI / 2; ahArch.position.set(-3.6, 0.90, 1.6); worldGroup.add(ahArch);
    const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 10), LS.makeEmissiveMat(0xff595e, 0xff595e, 0.8));
    puck.position.set(-3.6, 0.94, 1.6); worldGroup.add(puck);
    W.hockeyPuck = puck;
    addCol(-3.6, 1.6, 1.6, 0.95);

    // Illuminated Glass Prize Showcase Counter packed with prizes on East Wall!
    const prizeDesk = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.95, 5.2), LS.makeToonMat(0x4c1d95));
    prizeDesk.position.set(8.2, 0.48, 0.6); worldGroup.add(prizeDesk);
    const prizeGlass = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.85, 5.0), LS.makeToonMat(0xe0f2fe, { transparent: true, opacity: 0.32 }));
    prizeGlass.position.set(8.2, 1.38, 0.6); worldGroup.add(prizeGlass);
    [-1.6, -0.8, 0, 0.8, 1.6].forEach((pz, pi) => {
      const plush = new THREE.Mesh(new THREE.SphereGeometry(0.24, 9, 8), LS.makeToonMat(tileCols[pi % 4]));
      plush.position.set(8.2, 1.24, 0.6 + pz); worldGroup.add(plush);
    });
    addCol(8.2, 0.6, 0.9, 2.7);

    const door = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.7, 0.22), LS.makeToonMat(0x38bdf8));
    door.position.set(0, 1.35, 7.82); worldGroup.add(door);
    const exitMat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 1.15), LS.makeToonMat(0x4b5563));
    exitMat.position.set(0, 0.02, 7.0); worldGroup.add(exitMat);

    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Leo (Cosmo Host)',
        line: 'Welcome to Cosmo City, {leader}! Try all 3 glowing arcade machines to win coins & prizes! 🚀🎮',
        lines: [
          'Welcome to Cosmo City, {leader}! Try all 3 glowing arcade machines to win coins & prizes! 🚀🎮',
          'The Space Meteor Catcher and Claw Grabber are charged up and ready, {leader}! 🛸🧸',
          'Win big tokens for your outfits and travel adventures, {leader}! ⭐✨'
        ],
        pos: new THREE.Vector3(6.6, 0, 0.6),
        baseRot: -Math.PI / 2,
        waveOnNear: true,
        char: { scale: 0.92, skinColor: 0xe6b595, hairColor: 0x2c1d16, topColor: 0x6d28d9, bottomColor: 0x1e293b, pants: true, hatType: 'cap', hatColor: 0x38bdf8 }
      },
      {
        name: 'Talia (Arcade Champ) 🕹️',
        line: 'Whoa, {leader}! I just grabbed a giant plushie from the Cosmo Claw machine! 🧸✨',
        lines: [
          'Whoa, {leader}! I just grabbed a giant plushie from the Cosmo Claw machine! 🧸✨',
          'See if you can beat my high score on Cosmo Color Memory, {leader}! 🎨🌟'
        ],
        pos: new THREE.Vector3(-6.4, 0, -0.5),
        baseRot: 0.65,
        patrol: { axis: 'z', center: -0.5, range: 2.4, speed: 1.05 },
        char: { scale: 0.78, skinColor: 0xeab99a, hairColor: 0x3a2418, topColor: 0xec4899, bottomColor: 0x3b82f6, twinTails: true }
      },
      {
        name: 'Zein (Meteor Pilot) 🛸',
        line: 'Hey {leader}! Catch the glowing golden meteors for super bonus points! 🌠🚀',
        lines: [
          'Hey {leader}! Catch the glowing golden meteors for super bonus points! 🌠🚀',
          'Cosmo City feels like our own starship game deck, {leader}! ✨'
        ],
        pos: new THREE.Vector3(3.2, 0, 3.2),
        baseRot: -0.6,
        waveOnNear: true,
        char: { scale: 0.76, skinColor: 0xd8a382, hairColor: 0x1e1612, topColor: 0x0ea5e9, bottomColor: 0x1e293b, pants: true }
      }
    ]);

    W.zones.push({ id: 'cosmo_meteors', label: 'Play Space Meteor Catcher 🛸⭐', pos: new THREE.Vector3(-5.4, 0, -4.0), radius: 2.3 });
    W.zones.push({ id: 'cosmo_memory', label: 'Play Cosmo Color Memory 🎨✨', pos: new THREE.Vector3(0, 0, -4.0), radius: 2.3 });
    W.zones.push({ id: 'cosmo_claw', label: 'Play Cosmo Claw Grabber 🧸🕹️', pos: new THREE.Vector3(5.4, 0, -4.0), radius: 2.3 });
    W.zones.push({ id: 'home_qashqai', label: 'Hop in Gray Nissan Qashqai (Drive Home or Elsewhere) 🚙', pos: new THREE.Vector3(0, 0, 6.6), radius: 2.4 });

    W.update = (dt, elapsed) => {
      W.neonStars.forEach(o => {
        o.position.y = o.userData.baseY + Math.sin(elapsed * 1.8 + o.userData.phase) * 0.12;
        o.userData.ring.position.y = o.position.y;
        o.userData.ring.rotation.z = elapsed * 0.6;
      });
      if (W.clawHook) {
        W.clawHook.position.x = Math.sin(elapsed * 1.6) * 0.55;
        W.clawHook.position.y = 1.96 + Math.sin(elapsed * 3.2) * 0.08;
      }
      if (W.hockeyPuck) {
        W.hockeyPuck.position.x = -3.6 + Math.sin(elapsed * 2.8) * 1.05;
        W.hockeyPuck.position.z = 1.6 + Math.cos(elapsed * 3.9) * 0.48;
      }
    };
    W.getZoneLabel = () => 'Cosmo City Arcade 🚀🕹️';
    W.drawMiniMap = (ctx, Wpx, Hpx, toX, toY) => {
      ctx.fillStyle = '#282654'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(toX(-6.5), toY(-6.8), toX(-4.3) - toX(-6.5), toY(-4.8) - toY(-6.8));
      ctx.fillStyle = '#a855f7'; ctx.fillRect(toX(-1.1), toY(-6.8), toX(1.1) - toX(-1.1), toY(-4.8) - toY(-6.8));
      ctx.fillStyle = '#ec4899'; ctx.fillRect(toX(4.3), toY(-6.8), toX(6.5) - toX(4.3), toY(-4.8) - toY(-6.8));
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('COSMO CITY', toX(0), toY(-1));
      ctx.fillText('QASHQAI 🚙', toX(0), toY(6.4));
    };
    return W;
  }

  // =========================================================================
  // DESTINATION 4: GRANDMA (NANO) & GRANDPA (GEDO)'S HOUSE (dest_grandparents)
  // Patterned Persian rug, sunlit lace-curtain windows, family portrait gallery,
  // chandelier, china cabinet, Nano watching TV & Gedo sipping steaming mint tea!
  // =========================================================================
  function buildGrandparents(worldGroup) {
    const W = {
      id: 'dest_grandparents',
      isInterior: true,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      teaSteams: [],
      tvObj: null
    };
    const addCol = (x, z, hw, hd) => W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    W.getGroundHeight = () => 0;

    const { trimMat } = buildRoomShell(worldGroup, 18, 14, 4.5, 0xdfb889, '#fdf4e4', 0x7c4e2e);

    // Rich Patterned Oriental / Persian Living Room Carpet!
    const rugMat = LS.createWovenRugTexture
      ? LS.makeSurfaceMat(LS.createWovenRugTexture('#f2dec8', '#a64438', '#d4a359'))
      : LS.makeToonMat(0xe8c5b0);
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(11.4, 8.2), rugMat);
    rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.016, -0.6); worldGroup.add(rug);

    // Big Sunlit Curtained Windows right next to Gedo's Tea Corner (North & East walls!)
    addDetailedWallWindow(worldGroup, 5.2, 2.45, -6.80, 0, 3.2, 2.0, 0xf7d8c4, trimMat);
    addDetailedWallWindow(worldGroup, 8.80, 2.45, -4.4, -Math.PI / 2, 2.6, 1.8, 0xf7d8c4, trimMat);
    // Warm slanted golden sunbeam streaming through Gedo's window (0 extra WebGL lights!)
    const gBeam = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.8),
      new THREE.MeshBasicMaterial({ color: 0xffe6a3, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false })
    );
    gBeam.position.set(5.2, 1.25, -5.15);
    gBeam.rotation.x = -Math.PI / 3.1;
    worldGroup.add(gBeam);

    // Warm Hanging Brass Chandelier in Center!
    const chanG = new THREE.Group();
    chanG.position.set(0, 3.65, -1.0);
    const brass = LS.makeToonMat(0xd4a359);
    const cStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.85, 8), brass);
    cStem.position.y = 0.42; chanG.add(cStem);
    const cRing = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.045, 7, 20), brass);
    cRing.rotation.x = Math.PI / 2; chanG.add(cRing);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const gOrb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), LS.makeEmissiveMat(0xfff7dc, 0xffd57a, 0.92));
      gOrb.position.set(Math.cos(a) * 0.75, 0.14, Math.sin(a) * 0.75); chanG.add(gOrb);
    }
    if (LS.createGlowSprite) chanG.add(LS.createGlowSprite(0xffe094, 2.0));
    worldGroup.add(chanG);

    // Welcome Sign + Golden Family Portrait Gallery Wall!
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.88, 0.12),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture("💛 NANO & GEDO'S COZY HOME 🫖📺", {
          bg: '#fff9ef', border: '#2a9d8f', color: '#2b3a34', font: 'bold 23px sans-serif', width: 560, height: 100
        })
      })
    );
    sign.position.set(-0.6, 3.65, -6.82); worldGroup.add(sign);

    // Golden Family Photo Frames on Back Wall
    [[-1.2, '#ffeef4', '👧🧒'], [0.0, '#eef7f2', '👵👴']].forEach(ph => {
      const fr = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.05, 0.08), brass);
      fr.position.set(ph[0], 2.25, -6.82); worldGroup.add(fr);
      const pic = new THREE.Mesh(
        new THREE.BoxGeometry(0.76, 0.88, 0.10),
        new THREE.MeshBasicMaterial({ map: LS.createSignTexture(ph[2], { bg: ph[1], border: '#d4a359', color: '#333', font: 'bold 46px sans-serif', width: 160, height: 180 }) })
      );
      pic.position.set(ph[0], 2.25, -6.82); worldGroup.add(pic);
    });

    // Large Animated 3D TV on West Wall — Nano watches her Soap Opera (and sometimes the News!)
    W.tvObj = createAnimatedTV(worldGroup, -8.15, 0, -2.6, Math.PI / 2, 'nano_tv');
    addCol(-8.15, -2.6, 0.85, 1.5);

    // Nano's Anatomically Proportioned Cozy Rose Sofa (clean side-profile facing West toward TV!)
    const nanoSofaPos = { x: -3.0, z: -2.6, rotY: -Math.PI / 2 };
    const sofaMat = LS.makeToonMat(0xd88c9a);
    const sofaCushMat = LS.makeToonMat(0xe6a1ae);
    const nanoSofaG = new THREE.Group();
    nanoSofaG.position.set(nanoSofaPos.x, 0, nanoSofaPos.z);
    nanoSofaG.rotation.y = nanoSofaPos.rotY;
    const sBase = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.24, 0.66), sofaMat);
    sBase.position.set(0, 0.20, -0.02); sBase.castShadow = true; nanoSofaG.add(sBase);
    const sCush = new THREE.Mesh(new THREE.BoxGeometry(2.50, 0.12, 0.48), sofaCushMat);
    sCush.position.set(0, 0.33, 0.05); nanoSofaG.add(sCush);
    const sBack = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.74, 0.22), sofaMat);
    sBack.position.set(0, 0.64, -0.26); sBack.castShadow = true; nanoSofaG.add(sBack);
    [-1.32, 1.32].forEach(ax => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.68), sofaMat);
      arm.position.set(ax, 0.36, -0.02); nanoSofaG.add(arm);
    });
    [[-1.25, -0.25], [1.25, -0.25], [-1.25, 0.22], [1.25, 0.22]].forEach(lg => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.10, 6), trimMat);
      leg.position.set(lg[0], 0.05, lg[1]); nanoSofaG.add(leg);
    });
    const knit = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.28, 0.50), LS.makeToonMat(0xfff3c4));
    knit.position.set(-0.92, 0.42, 0.08); nanoSofaG.add(knit);
    const nPill = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.32, 0.18), LS.makeToonMat(0xf4a261));
    nPill.position.set(0.88, 0.56, -0.08); nPill.rotation.x = 0.22; nanoSofaG.add(nPill);
    worldGroup.add(nanoSofaG);
    addCol(nanoSofaPos.x, nanoSofaPos.z, 0.65, 1.55);

    // Coffee Table with Lace Runner, TV Remote & Flower Vase in front of Nano
    const cTabG = new THREE.Group();
    cTabG.position.set(-5.25, 0, -2.6);
    cTabG.rotation.y = nanoSofaPos.rotY;
    const cTabTop = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.08, 0.84), trimMat);
    cTabTop.position.y = 0.40; cTabG.add(cTabTop);
    [[-0.72, -0.32], [0.72, -0.32], [-0.72, 0.32], [0.72, 0.32]].forEach(lg => {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 0.06), trimMat);
      l.position.set(lg[0], 0.19, lg[1]); cTabG.add(l);
    });
    const lace = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.02, 0.54), LS.makeToonMat(0xfffdf8));
    lace.position.y = 0.45; cTabG.add(lace);
    const remote = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.09), LS.makeToonMat(0x2d3748));
    remote.position.set(-0.35, 0.47, 0.12); cTabG.add(remote);
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.24, 8), LS.makeToonMat(0x90e0ef));
    vase.position.set(0.36, 0.56, -0.05); cTabG.add(vase);
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 7, 6), LS.makeToonMat(0xff8fab));
    fl.position.set(0.36, 0.74, -0.05); cTabG.add(fl);
    worldGroup.add(cTabG);
    addCol(-5.25, -2.6, 0.52, 0.92);

    // Gedo's Cozy Armchair RIGHT NEXT TO THE SUNLIT WINDOW + Reading Lamp + Mint Tea & Cookies!
    const gedoChairPos = { x: 5.3, z: -5.0, rotY: -0.45 };
    const chairMat = LS.makeToonMat(0x457b9d);
    const chairCushMat = LS.makeToonMat(0x5b94b8);
    const gedoChairG = new THREE.Group();
    gedoChairG.position.set(gedoChairPos.x, 0, gedoChairPos.z);
    gedoChairG.rotation.y = gedoChairPos.rotY;
    const gBase = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.24, 0.66), chairMat);
    gBase.position.set(0, 0.20, -0.02); gBase.castShadow = true; gedoChairG.add(gBase);
    const gCush = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.46), chairCushMat);
    gCush.position.set(0, 0.33, 0.05); gedoChairG.add(gCush);
    const gBack = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.78, 0.22), chairMat);
    gBack.position.set(0, 0.66, -0.26); gBack.castShadow = true; gedoChairG.add(gBack);
    [-0.46, 0.46].forEach(ax => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.48, 0.66), chairMat);
      arm.position.set(ax, 0.36, -0.02); gedoChairG.add(arm);
    });
    [[-0.46, -0.25], [0.46, -0.25], [-0.46, 0.22], [0.46, 0.22]].forEach(lg => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.10, 6), trimMat);
      leg.position.set(lg[0], 0.05, lg[1]); gedoChairG.add(leg);
    });
    worldGroup.add(gedoChairG);
    const gLampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.85, 6), brass);
    gLampPole.position.set(6.75, 0.92, -5.55); worldGroup.add(gLampPole);
    const gLampShade = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.34, 10), LS.makeEmissiveMat(0xfff4d6, 0xffd57a, 0.7));
    gLampShade.position.set(6.75, 1.92, -5.55); worldGroup.add(gLampShade);
    addCol(gedoChairPos.x, gedoChairPos.z, 0.72, 0.72);

    // Round Tea Table beside Gedo's Window Armchair (Brass Tray, Teapot, Steaming Mint Tea & Kahk Cookies!)
    const tx = 3.85, tz = -3.65;
    const tTab = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 18), trimMat);
    tTab.position.set(tx, 0.64, tz); worldGroup.add(tTab);
    const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.22, 0.62, 10), trimMat);
    tLeg.position.set(tx, 0.31, tz); worldGroup.add(tLeg);
    const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.43, 0.03, 16), brass);
    tray.position.set(tx, 0.70, tz); worldGroup.add(tray);
    const tPot = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), brass);
    tPot.position.set(tx - 0.16, 0.87, tz - 0.14); worldGroup.add(tPot);
    const teaGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.16, 10), LS.makeToonMat(0xd97706));
    teaGlass.position.set(tx + 0.18, 0.80, tz + 0.12); worldGroup.add(teaGlass);
    const cookiePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.03, 10), LS.makeToonMat(0xfffdf8));
    cookiePlate.position.set(tx - 0.16, 0.73, tz + 0.22); worldGroup.add(cookiePlate);
    for (let k = 0; k < 3; k++) {
      const ck = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), LS.makeToonMat(0xf4d58d));
      ck.scale.set(1.1, 0.6, 1.1); ck.position.set(tx - 0.20 + k * 0.05, 0.77, tz + 0.22 + (k % 2 ? 0.04 : -0.04)); worldGroup.add(ck);
    }
    for (let i = 0; i < 2; i++) {
      const st = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), LS.makeToonMat(0xffffff, { transparent: true, opacity: 0.48 }));
      st.userData = { baseX: tx + 0.18, baseY: 0.94, baseZ: tz + 0.12, phase: i * 0.5 };
      worldGroup.add(st); W.teaSteams.push(st);
    }
    addCol(tx, tz, 0.74, 0.74);

    // Glass-Front China Cabinet along East Wall + Indoor Ferns!
    const chinaG = new THREE.Group();
    chinaG.position.set(8.42, 0, 1.4);
    chinaG.rotation.y = -Math.PI / 2;
    const china = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.35, 0.62), trimMat);
    china.position.set(0, 1.18, 0); china.castShadow = true; chinaG.add(china);
    const cGlass = new THREE.Mesh(new THREE.BoxGeometry(2.65, 1.25, 0.66), LS.makeToonMat(0xebf8ff, { transparent: true, opacity: 0.36 }));
    cGlass.position.set(0, 1.65, 0); chinaG.add(cGlass);
    [-0.9, 0, 0.9].forEach((cx, ci) => {
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.22, 10), LS.makeToonMat(ci === 1 ? 0xd4a359 : 0xfff8ec));
      dish.position.set(cx, 1.38, 0.04); chinaG.add(dish);
    });
    worldGroup.add(chinaG);
    addCol(8.4, 1.4, 0.5, 1.55);
    addIndoorPlant(worldGroup, -7.8, 3.8, 0x2a9d8f, true);
    addIndoorPlant(worldGroup, 7.6, 4.8, 0xe07a5f, true);

    // Exact seated world coordinates aligned with backrest & cushion front edge!
    const seatLocalZ = -0.02;
    const nanoWorldX = nanoSofaPos.x + seatLocalZ * Math.sin(nanoSofaPos.rotY);
    const nanoWorldZ = nanoSofaPos.z + seatLocalZ * Math.cos(nanoSofaPos.rotY);
    const gedoWorldX = gedoChairPos.x + seatLocalZ * Math.sin(gedoChairPos.rotY);
    const gedoWorldZ = gedoChairPos.z + seatLocalZ * Math.cos(gedoChairPos.rotY);

    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Nano (Grandma) 📺',
        line: "Habibati Laila & Salma! Come sit beside Nano — I'm watching my soap opera (and checking the news too)! 📺🎭🗞️",
        pos: new THREE.Vector3(nanoWorldX, 0.04, nanoWorldZ),
        baseRot: nanoSofaPos.rotY,
        seated: true,
        char: { scale: 0.90, skinColor: 0xe6b898, hairColor: 0xd8dce0, topColor: 0xe07a5f, bottomColor: 0x5c4b51, hairBun: true, faceOpts: { glasses: true, elder: true } }
      },
      {
        name: 'Gedo (Grandpa) ☕',
        line: 'Ahlan ya Laila & Salma! Gedo loves sitting right by this sunny window sipping warm mint tea — come chat! ☕🌿☀️',
        pos: new THREE.Vector3(gedoWorldX, 0.02, gedoWorldZ),
        baseRot: gedoChairPos.rotY,
        seated: true,
        char: { scale: 0.94, skinColor: 0xd9a480, hairColor: 0xd8dce0, topColor: 0x6b8f71, bottomColor: 0x3b4252, pants: true, faceOpts: { glasses: true, mustache: true, elder: true } }
      }
    ]);

    W.zones.push({ id: 'visit_nano_tv', label: 'Watch Soap Opera / News with Nano 📺🎭🗞️', pos: new THREE.Vector3(-2.4, 0, 0.8), radius: 2.8 });
    W.zones.push({ id: 'visit_gedo_tea', label: 'Drink Mint Tea by the Window with Gedo ☕☀️', pos: new THREE.Vector3(4.0, 0, -1.8), radius: 2.8 });
    W.zones.push({ id: 'home_qashqai', label: 'Hop in Gray Nissan Qashqai (Drive Home or Elsewhere) 🚙', pos: new THREE.Vector3(0, 0, 5.7), radius: 2.3 });

    W.update = (dt, elapsed) => {
      if (W.tvObj) W.tvObj.update(elapsed);
      W.teaSteams.forEach(st => {
        const t = (elapsed * 0.55 + st.userData.phase) % 1.0;
        st.position.set(st.userData.baseX, st.userData.baseY + t * 0.52, st.userData.baseZ);
        st.scale.setScalar(0.65 + t * 0.9);
        st.material.opacity = (1 - t) * 0.45;
      });
    };
    W.getZoneLabel = (x) => (x < 0 ? "Nano's TV Living Room 📺🎭" : "Gedo's Sunny Window Tea Corner ☕☀️");
    W.drawMiniMap = (ctx, Wpx, Hpx, toX, toY) => {
      ctx.fillStyle = '#f5e4cf'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#d88c9a'; ctx.fillRect(toX(-4.4), toY(-2.8), toX(-2.0) - toX(-4.4), toY(-0.4) - toY(-2.8));
      ctx.fillStyle = '#457b9d'; ctx.fillRect(toX(4.4), toY(-5.8), toX(6.2) - toX(4.4), toY(-4.2) - toY(-5.8));
      ctx.fillStyle = '#3d2c1e'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('NANO 📺', toX(-3.2), toY(-3.3));
      ctx.fillText('GEDO ☕☀️', toX(5.3), toY(-6.1));
      ctx.fillText('QASHQAI 🚙', toX(0), toY(5.6));
    };
    return W;
  }

  // =========================================================================
  // DESTINATION 5: MAI & MOSTAFA'S 18TH-FLOOR HOME OVERLOOKING THE RIVER
  // Direct indoor transport into their sunlit high-rise apartment:
  // - Floor-to-ceiling panoramic glass windows & 18th-floor balcony overlooking
  //   the sparkling river, sailboat feluccas, bridge & skyline towers far below!
  // - Full kitchen & steaming homemade lasagna with Mai!
  // - Dr. Mostafa (Thierry Henry + Dave Chappelle likeness: bald, goatee, warm
  //   wide grin, athletic white orthopedic doctor's coat + stethoscope) watching TV
  //   and asking: "Are your bones okay?"
  // - Nouzi (5yo slim athletic girl) doing gymnastics with balance beam & trophies!
  // - Bibo (4yo boy) sitting on his play rug zooming toy cars around his garage!
  // - Painted 4-player Board Game Table for Laila, Salma, Nouzi & Bibo!
  // =========================================================================
  function buildMaiMostafa(worldGroup) {
    const W = {
      id: 'dest_mai_mostafa',
      isInterior: true,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      skyMesh: null,
      tvObj: null,
      nouziChar: null,
      biboChar: null,
      biboToyCars: [],
      riverBoats: [],
      skyClouds: [],
      lasagnaSteams: [],
      diningConfigs: {
        mai_dining: {
          lailaSeat: new THREE.Vector3(-6.7, 0.14, -4.0),
          salmaSeat: new THREE.Vector3(-4.5, 0.14, -4.0),
          lailaDishPos: new THREE.Vector3(-6.2, 0.88, -4.0),
          salmaDishPos: new THREE.Vector3(-5.0, 0.88, -4.0),
          oishiiPos: new THREE.Vector3(-5.6, 1.88, -4.0),
          seatYaw: 0,
          camPos: new THREE.Vector3(-5.6, 2.35, -0.2),
          camLook: new THREE.Vector3(-5.6, 1.05, -4.0),
          caption: "Mai's Homemade Lasagna! 🧀🍝💛",
          exitPos: new THREE.Vector3(-5.6, 0, -1.5)
        }
      }
    };
    const addCol = (x, z, hw, hd) => W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    W.getGroundHeight = () => 0;

    // -----------------------------------------------------------------------
    // 18TH-FLOOR SKY & PANORAMIC RIVER + CITY SKYLINE FAR BELOW!
    // -----------------------------------------------------------------------
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(215, 24, 16),
      new THREE.MeshBasicMaterial({ map: LS.createSkyTexture(LS.state.timeMode, 'tokyo'), side: THREE.BackSide })
    );
    worldGroup.add(sky);
    W.skyMesh = sky;

    // Sparkling wide river far below the 18th floor — framed right in the panoramic window sightline!
    const riverY = -12;
    const riverBed = new THREE.Mesh(new THREE.PlaneGeometry(280, 82), LS.makeToonMat(0x1f7a96));
    riverBed.rotation.x = -Math.PI / 2; riverBed.position.set(0, riverY - 0.12, -58); worldGroup.add(riverBed);
    const riverWater = new THREE.Mesh(new THREE.PlaneGeometry(280, 76), LS.makeWaterMat(0.94));
    riverWater.rotation.x = -Math.PI / 2; riverWater.position.set(0, riverY, -58); worldGroup.add(riverWater);
    // Sparkling sun-glint ripples shimmering across the river far below
    for (let s = 0; s < 14; s++) {
      const gl = new THREE.Mesh(
        new THREE.PlaneGeometry(5.5 + (s % 3) * 3.0, 0.72),
        new THREE.MeshBasicMaterial({ color: 0xeafcff, transparent: true, opacity: 0.48 })
      );
      gl.rotation.x = -Math.PI / 2;
      gl.position.set(-56 + s * 9.5, riverY + 0.08, -42 - (s % 5) * 9.5);
      worldGroup.add(gl);
    }

    // Animated white sailboat feluccas gliding gently across the river 18 floors below!
    [[-26, -54, 1.1], [8, -64, -0.8], [30, -50, 0.9], [-6, -76, -0.7], [18, -82, 0.85]].forEach((bp, bi) => {
      const boat = new THREE.Group();
      const hull = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.65, 1.15), LS.makeToonMat(0x8c5a3c));
      hull.position.y = 0.28; boat.add(hull);
      const sail = new THREE.Mesh(new THREE.ConeGeometry(1.45, 3.8, 3), LS.makeToonMat(0xfffdf8));
      sail.position.set(0, 2.35, 0); sail.rotation.y = Math.PI / 2; boat.add(sail);
      boat.position.set(bp[0], riverY + 0.05, bp[1]);
      boat.userData = { baseX: bp[0], z: bp[1], speed: bp[2], phase: bi * 1.9 };
      worldGroup.add(boat); W.riverBoats.push(boat);
    });

    // Green tree-lined opposite riverbank & distant bridge far below!
    const bankGrass = LS.makeToonMat(0x6db05e);
    const farGround = new THREE.Mesh(new THREE.PlaneGeometry(320, 120), bankGrass);
    farGround.rotation.x = -Math.PI / 2; farGround.position.set(0, riverY + 0.2, -152); worldGroup.add(farGround);
    const nearBank = new THREE.Mesh(new THREE.BoxGeometry(280, 2.2, 14), LS.makeToonMat(0xcbc0ae));
    nearBank.position.set(0, riverY + 0.4, -14); worldGroup.add(nearBank);
    const farProm = new THREE.Mesh(new THREE.BoxGeometry(300, 1.8, 7), LS.makeToonMat(0xd6cbb8));
    farProm.position.set(0, riverY + 0.6, -98); worldGroup.add(farProm);

    // Distant multi-arch city bridge spanning the river on the left horizon!
    const brMat = LS.makeToonMat(0xe2dbd0);
    const brDeck = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.0, 82), brMat);
    brDeck.position.set(-46, riverY + 3.6, -58); worldGroup.add(brDeck);
    [-32, -50, -68, -86].forEach(bz => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.4, 2.4), LS.makeToonMat(0xb0a798));
      pier.position.set(-46, riverY + 1.4, bz); worldGroup.add(pier);
    });

    // City Skyline High-Rise Towers along opposite riverbank & neighboring 18-story flanks!
    const towerPalette = [0xf2e3cf, 0xe4d5c3, 0xd4e2eb, 0xebd7cc, 0xdce4d8, 0xe8dec8];
    const winBandMat = LS.makeToonMat(0x69a4c9);
    const skylineSpecs = [
      // Opposite riverbank skyline rising cleanly above the sparkling turquoise river!
      [-72, -110, 13, 30, 12], [-54, -106, 11, 38, 11], [-36, -114, 13, 28, 12],
      [-18, -108, 12, 42, 11], [0, -112, 14, 34, 12], [18, -106, 11, 46, 11],
      [36, -112, 13, 36, 12], [54, -108, 12, 32, 11], [72, -114, 13, 40, 12],
      // Neighboring tall high-rise towers flanking left & right (authentic 18th-floor altitude feel!)
      [-32, -26, 13, 34, 13], [32, -28, 13, 36, 13]
    ];
    skylineSpecs.forEach((sp, ti) => {
      const [tx, tz, tw, th, td] = sp;
      const tMesh = new THREE.Mesh(new THREE.BoxGeometry(tw, th, td), LS.makeToonMat(towerPalette[ti % towerPalette.length]));
      tMesh.position.set(tx, riverY + th / 2, tz);
      worldGroup.add(tMesh);
      for (let wy = riverY + 4; wy < riverY + th - 2; wy += 3.8) {
        const band = new THREE.Mesh(new THREE.BoxGeometry(tw + 0.18, 1.45, td + 0.18), winBandMat);
        band.position.set(tx, wy, tz);
        worldGroup.add(band);
      }
    });

    // Soft fluffy Ghibli clouds drifting past at 18th-floor eye level!
    const cloudMat = LS.makeToonMat(0xfffdf8, { transparent: true, opacity: 0.90 });
    [[-38, 8.5, -72], [14, 11.0, -84], [48, 7.5, -68], [-8, 13.5, -94]].forEach((cp, ci) => {
      const cg = new THREE.Group();
      [[0, 0, 0, 3.6], [3.2, -0.4, 0.4, 2.6], [-3.0, -0.5, -0.3, 2.7], [0.9, 1.1, -0.2, 2.3]].forEach(b => {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(b[3], 9, 7), cloudMat);
        puff.scale.set(1.3, 0.72, 0.85);
        puff.position.set(b[0], b[1], b[2]);
        cg.add(puff);
      });
      cg.position.set(cp[0], cp[1], cp[2]);
      cg.userData = { baseX: cp[0], y: cp[1], z: cp[2], speed: 0.45 + (ci % 2) * 0.25 };
      worldGroup.add(cg); W.skyClouds.push(cg);
    });

    // -----------------------------------------------------------------------
    // 18TH-FLOOR LUXURY APARTMENT SHELL (22m x 15m x 4.6m)
    // Open panoramic glass North Wall overlooking the river!
    // -----------------------------------------------------------------------
    const W_AP = 22, D_AP = 15, H_AP = 4.6;
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(W_AP, D_AP),
      LS.makeSurfaceMat(LS.createCedarPlankTexture(), { color: 0xe6c89c })
    );
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; worldGroup.add(floor);

    const wallMat = LS.makeToonMat(0xffffff, { map: LS.createPlasterTexture('#fdf6e8') });
    const wainMat = LS.makeToonMat(0xf3e4cd);
    const trimMat = LS.makeToonMat(0x7c4e2e);
    const bronzeMat = LS.makeToonMat(0x2f353d);
    const whiteTrim = LS.makeToonMat(0xfffaf2);

    // West, East & South solid interior walls + modern wainscoting & crown molding
    const wW = new THREE.Mesh(new THREE.BoxGeometry(0.26, H_AP, D_AP), wallMat);
    wW.position.set(-W_AP / 2, H_AP / 2, 0); worldGroup.add(wW);
    const wE = new THREE.Mesh(new THREE.BoxGeometry(0.26, H_AP, D_AP), wallMat);
    wE.position.set(W_AP / 2, H_AP / 2, 0); worldGroup.add(wE);
    const wS = new THREE.Mesh(new THREE.BoxGeometry(W_AP, H_AP, 0.26), wallMat);
    wS.position.set(0, H_AP / 2, D_AP / 2); worldGroup.add(wS);

    [[-W_AP / 2 + 0.15, 0, 0.06, D_AP], [W_AP / 2 - 0.15, 0, 0.06, D_AP]].forEach(b => {
      const ws = new THREE.Mesh(new THREE.BoxGeometry(b[2], 1.0, b[3]), wainMat);
      ws.position.set(b[0], 0.50, b[1]); worldGroup.add(ws);
      const rl = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.06, 0.08, b[3]), trimMat);
      rl.position.set(b[0], 1.02, b[1]); worldGroup.add(rl);
      const cr = new THREE.Mesh(new THREE.BoxGeometry(b[2] + 0.08, 0.16, b[3]), whiteTrim);
      cr.position.set(b[0], H_AP - 0.12, b[1]); worldGroup.add(cr);
    });

    // Ceiling Slab + Warm Modern Recessed Beams + 4 Glowing Pendant Lamps (0 extra WebGL lights!)
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W_AP, D_AP), LS.makeToonMat(0xfffaf0));
    ceil.rotation.x = Math.PI / 2; ceil.position.y = H_AP; worldGroup.add(ceil);
    [-3.6, 0, 3.6].forEach(bz => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(W_AP - 0.2, 0.16, 0.22), trimMat);
      beam.position.set(0, H_AP - 0.08, bz); worldGroup.add(beam);
    });
    [[-5.6, -3.6], [5.2, -3.6], [-5.6, 2.2], [5.6, 2.2]].forEach(lp => {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.72, 6), bronzeMat);
      cord.position.set(lp[0], H_AP - 0.36, lp[1]); worldGroup.add(cord);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.20, 9, 7), LS.makeEmissiveMat(0xfff7dc, 0xffd57a, 0.90));
      bulb.position.set(lp[0], H_AP - 0.78, lp[1]); worldGroup.add(bulb);
      if (LS.createGlowSprite) {
        const glow = LS.createGlowSprite(0xffe094, 1.5);
        glow.position.set(lp[0], H_AP - 0.80, lp[1]); worldGroup.add(glow);
      }
    });

    // FLOOR-TO-CEILING PANORAMIC GLASS CURTAIN WALL & 18TH-FLOOR RIVER BALCONY (North Wall z = -7.5)!
    const sill = new THREE.Mesh(new THREE.BoxGeometry(W_AP, 0.24, 0.32), whiteTrim);
    sill.position.set(0, 0.12, -D_AP / 2); worldGroup.add(sill);
    const header = new THREE.Mesh(new THREE.BoxGeometry(W_AP, 0.36, 0.38), whiteTrim);
    header.position.set(0, H_AP - 0.18, -D_AP / 2); worldGroup.add(header);
    const panGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(W_AP - 0.5, H_AP - 0.60),
      new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.10, side: THREE.DoubleSide, depthWrite: false })
    );
    panGlass.position.set(0, H_AP / 2, -D_AP / 2); worldGroup.add(panGlass);
    for (let mx = -10.6; mx <= 10.7; mx += 3.55) {
      const mul = new THREE.Mesh(new THREE.BoxGeometry(0.11, H_AP - 0.50, 0.18), bronzeMat);
      mul.position.set(mx, H_AP / 2, -D_AP / 2); worldGroup.add(mul);
    }
    const transom = new THREE.Mesh(new THREE.BoxGeometry(W_AP - 0.4, 0.08, 0.14), bronzeMat);
    transom.position.set(0, 3.45, -D_AP / 2); worldGroup.add(transom);

    // Slim 18th-Floor Balcony Terrace outside the panoramic glass with clear railing & potted palms!
    const balcFloor = new THREE.Mesh(new THREE.BoxGeometry(W_AP + 0.4, 0.20, 1.35), LS.makeToonMat(0xcbbca7));
    balcFloor.position.set(0, -0.08, -D_AP / 2 - 0.68); worldGroup.add(balcFloor);
    const balcRail = new THREE.Mesh(new THREE.BoxGeometry(W_AP + 0.3, 0.08, 0.09), bronzeMat);
    balcRail.position.set(0, 1.02, -D_AP / 2 - 1.30); worldGroup.add(balcRail);
    const balcGlass = new THREE.Mesh(
      new THREE.BoxGeometry(W_AP + 0.2, 0.94, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xcbeeff, transparent: true, opacity: 0.20 })
    );
    balcGlass.position.set(0, 0.52, -D_AP / 2 - 1.30); worldGroup.add(balcGlass);
    for (let px = -10.5; px <= 10.6; px += 3.5) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.04, 0.07), bronzeMat);
      post.position.set(px, 0.52, -D_AP / 2 - 1.30); worldGroup.add(post);
    }
    addIndoorPlant(worldGroup, -9.2, -D_AP / 2 - 0.68, 0xc66b47, true);
    addIndoorPlant(worldGroup, 9.2, -D_AP / 2 - 0.68, 0xc66b47, true);

    // Apartment Header Plaque above Panoramic Glass ("MAI & MOSTAFA'S HOME")
    const aptSign = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.58, 0.12),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture("🏙️ MAI & MOSTAFA'S HOME 🌊", {
          bg: '#fff9ef', border: '#c66b47', color: '#4a2b14', font: 'bold 24px sans-serif', width: 560, height: 76
        })
      })
    );
    aptSign.position.set(0, 4.18, -D_AP / 2 + 0.22); worldGroup.add(aptSign);

    // South Entryway: Apartment Front Door (18F Plaque) + Welcome Mat back to Elevator & Qashqai!
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.95, 2.75, 0.22), trimMat);
    door.position.set(0, 1.38, D_AP / 2 - 0.15); worldGroup.add(door);
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.34, 0.05),
      new THREE.MeshBasicMaterial({ map: LS.createSignTexture('18F', { bg: '#d4a359', border: '#4a2b14', color: '#2b1a0e', font: 'bold 34px sans-serif', width: 120, height: 64 }) })
    );
    plaque.position.set(0, 2.15, D_AP / 2 - 0.28); worldGroup.add(plaque);
    const dKnob = new THREE.Mesh(new THREE.SphereGeometry(0.065, 7, 6), LS.makeToonMat(0xe9c46a));
    dKnob.position.set(0.68, 1.26, D_AP / 2 - 0.30); worldGroup.add(dKnob);
    const wMat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 1.15), LS.makeToonMat(0x4b5563));
    wMat.position.set(0, 0.02, D_AP / 2 - 0.9); worldGroup.add(wMat);

    // -----------------------------------------------------------------------
    // AREA 1 (Northwest, River View): MAI'S KITCHEN & HOMEMADE LASAGNA!
    // -----------------------------------------------------------------------
    const dinRugMat = LS.createWovenRugTexture
      ? LS.makeSurfaceMat(LS.createWovenRugTexture('#f6e4cc', '#c66b47', '#e9c46a'))
      : LS.makeToonMat(0xf4e3cc);
    const dinRug = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 4.2), dinRugMat);
    dinRug.rotation.x = -Math.PI / 2; dinRug.position.set(-5.6, 0.018, -4.0); worldGroup.add(dinRug);

    // Open Kitchen Counter & Glowing Lasagna Oven along West Wall!
    const kCounter = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.96, 5.2), LS.makeToonMat(0xf5e8d5));
    kCounter.position.set(-10.2, 0.48, -4.0); kCounter.castShadow = true; worldGroup.add(kCounter);
    const kTop = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.10, 5.35), LS.makeToonMat(0xfffdf8));
    kTop.position.set(-10.2, 1.00, -4.0); worldGroup.add(kTop);
    const ovenWin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 0.84), LS.makeEmissiveMat(0xffcf87, 0xff9f43, 0.72));
    ovenWin.position.set(-9.60, 0.56, -4.0); worldGroup.add(ovenWin);
    addCol(-10.1, -4.0, 0.75, 2.75);

    const dinTab = new THREE.Group();
    dinTab.position.set(-5.6, 0, -4.0);
    const dtTop = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.12, 1.75), trimMat);
    dtTop.position.y = 0.80; dtTop.castShadow = true; dinTab.add(dtTop);
    const dtRun = new THREE.Mesh(new THREE.BoxGeometry(2.90, 0.02, 0.56), LS.makeToonMat(0xfff8eb));
    dtRun.position.y = 0.87; dinTab.add(dtRun);
    [[-1.2, -0.7], [1.2, -0.7], [-1.2, 0.7], [1.2, 0.7]].forEach(lp => {
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.80, 7), trimMat);
      l.position.set(lp[0], 0.40, lp[1]); dinTab.add(l);
    });
    // Bubbling Golden Baked Lasagna Dish + Animated Steam + Fresh Salad Bowl!
    const pan = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.14, 0.58), LS.makeToonMat(0xfffdf8));
    pan.position.set(0, 0.94, 0); dinTab.add(pan);
    const las = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.10, 0.48), LS.makeToonMat(0xe89c3e));
    las.position.set(0, 1.01, 0); dinTab.add(las);
    const salad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.14, 10), LS.makeToonMat(0x52b788));
    salad.position.set(0.85, 0.94, 0.18); dinTab.add(salad);
    for (let i = 0; i < 2; i++) {
      const st = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), LS.makeToonMat(0xffffff, { transparent: true, opacity: 0.45 }));
      st.userData = { bx: -5.6 + (i === 0 ? -0.18 : 0.18), by: 1.12, bz: -4.0, phase: i * 0.55 };
      worldGroup.add(st); W.lasagnaSteams.push(st);
    }
    // 4-legged dining chairs
    [[-1.45, 0], [1.45, 0]].forEach(ch => {
      const stTop = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.52), LS.makeToonMat(0xb67d52));
      stTop.position.set(ch[0], 0.35, ch[1]); dinTab.add(stTop);
      [[-0.20, -0.20], [0.20, -0.20], [-0.20, 0.20], [0.20, 0.20]].forEach(lg => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.05), trimMat);
        leg.position.set(ch[0] + lg[0], 0.17, ch[1] + lg[1]); dinTab.add(leg);
      });
      const bk = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.58, 0.50), trimMat);
      bk.position.set(ch[0] + (ch[0] < 0 ? -0.23 : 0.23), 0.68, ch[1]); dinTab.add(bk);
    });
    worldGroup.add(dinTab);
    addCol(-5.6, -4.0, 1.55, 1.0);

    // -----------------------------------------------------------------------
    // AREA 2 (Northeast, River View): DR. MOSTAFA'S TV LOUNGE!
    // -----------------------------------------------------------------------
    const tvRugMat = LS.createWovenRugTexture
      ? LS.makeSurfaceMat(LS.createWovenRugTexture('#dcebd8', '#3d5a80', '#e9c46a'))
      : LS.makeToonMat(0xdce8dc);
    const tvRug = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 5.0), tvRugMat);
    tvRug.rotation.x = -Math.PI / 2; tvRug.position.set(5.6, 0.018, -3.8); worldGroup.add(tvRug);

    // Framed Medical Diploma on East Wall above the TV!
    const dipFrame = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.15, 1.75), LS.makeToonMat(0xd4a359));
    dipFrame.position.set(10.80, 3.25, -3.8); worldGroup.add(dipFrame);
    const dipArt = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.96, 1.54),
      new THREE.MeshBasicMaterial({ map: LS.createSignTexture('🩺 DR. MOSTAFA, MD', { bg: '#fffdf5', border: '#3d5a80', color: '#1e3a5f', font: 'bold 24px sans-serif', width: 320, height: 200 }) })
    );
    dipArt.position.set(10.80, 3.25, -3.8); worldGroup.add(dipArt);

    W.tvObj = createAnimatedTV(worldGroup, 10.1, 0, -3.8, -Math.PI / 2, 'sports');
    addCol(10.1, -3.8, 0.85, 1.5);

    const mSofaMat = LS.makeToonMat(0x3d5a80);
    const mCushMat = LS.makeToonMat(0x52739e);
    const mSofaG = new THREE.Group();
    mSofaG.position.set(4.5, 0, -3.8);
    mSofaG.rotation.y = Math.PI / 2;
    const msBase = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.24, 0.66), mSofaMat);
    msBase.position.set(0, 0.20, -0.02); msBase.castShadow = true; mSofaG.add(msBase);
    const msCush = new THREE.Mesh(new THREE.BoxGeometry(2.76, 0.12, 0.48), mCushMat);
    msCush.position.set(0, 0.34, 0.05); mSofaG.add(msCush);
    const msBack = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.74, 0.22), mSofaMat);
    msBack.position.set(0, 0.65, -0.26); msBack.castShadow = true; mSofaG.add(msBack);
    [-1.46, 1.46].forEach(ax => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.68), mSofaMat);
      arm.position.set(ax, 0.36, -0.02); mSofaG.add(arm);
    });
    [[-1.38, -0.25], [1.38, -0.25], [-1.38, 0.22], [1.38, 0.22]].forEach(lg => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.10, 6), trimMat);
      leg.position.set(lg[0], 0.05, lg[1]); mSofaG.add(leg);
    });
    const mPill = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.32, 0.18), LS.makeToonMat(0xf4a261));
    mPill.position.set(1.02, 0.56, -0.08); mPill.rotation.x = 0.22; mSofaG.add(mPill);
    worldGroup.add(mSofaG);
    const mSide = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.40, 0.56, 12), trimMat);
    mSide.position.set(4.5, 0.28, -5.95); worldGroup.add(mSide);
    const mCup = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.14, 9), LS.makeToonMat(0xfffdf8));
    mCup.position.set(4.5, 0.63, -5.95); worldGroup.add(mCup);
    addCol(4.5, -3.8, 0.62, 1.72);

    addIndoorPlant(worldGroup, 9.8, -6.5, 0x2a9d8f, true);
    addIndoorPlant(worldGroup, -9.8, 6.2, 0xe07a5f, false);
    addIndoorPlant(worldGroup, 9.8, 6.2, 0xe07a5f, false);

    // -----------------------------------------------------------------------
    // AREA 3 (Southwest): NOUZI'S GYMNASTICS MAT, BALANCE BEAM & MEDAL RACK!
    // -----------------------------------------------------------------------
    const gymMat = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.09, 2.9), LS.makeToonMat(0xffb3c6));
    gymMat.position.set(-6.4, 0.045, 2.2); gymMat.receiveShadow = true; worldGroup.add(gymMat);
    const gymStripe = new THREE.Mesh(new THREE.BoxGeometry(4.52, 0.10, 0.28), LS.makeToonMat(0xffffff));
    gymStripe.position.set(-6.4, 0.047, 2.2); worldGroup.add(gymStripe);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 0.22), LS.makeToonMat(0xe5a97c));
    beam.position.set(-6.4, 0.32, 0.35); beam.castShadow = true; worldGroup.add(beam);
    [-7.4, -5.4].forEach(bx => {
      const bLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.34), LS.makeToonMat(0x4a5568));
      bLeg.position.set(bx, 0.14, 0.35); worldGroup.add(bLeg);
    });
    const medalShelf = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 1.8), trimMat);
    medalShelf.position.set(-10.68, 2.05, 2.2); worldGroup.add(medalShelf);
    [1.8, 2.2, 2.6].forEach(mz => {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 0.22, 8), LS.makeToonMat(0xfbbf24));
      cup.position.set(-10.65, 2.22, mz); worldGroup.add(cup);
    });

    const nouzi = LS.createAnimeCharacter({
      scale: 0.74,
      slim: true,
      skinColor: 0xd9a480,
      hairColor: 0x221713,
      topColor: 0xe63982,
      bottomColor: 0xe63982,
      shoeColor: 0xfff5f8,
      pigtails: true,
      pants: true
    });
    nouzi.root.position.set(-6.4, 0.08, 2.2);
    worldGroup.add(nouzi.root);
    W.nouziChar = nouzi;

    const nouziBub = LS.createSpeechBubbleSprite ? LS.createSpeechBubbleSprite('Nouzi 🤸‍♀️', 'Watch my cartwheel & handstand, Laila & Salma! ✨') : null;
    if (nouziBub) { nouziBub.scale.multiplyScalar(0.62); nouziBub.position.set(-6.4, 1.82, 2.2); worldGroup.add(nouziBub); }

    // -----------------------------------------------------------------------
    // AREA 4 (Southeast): BIBO'S TOY CAR TRACK, MINI GARAGE & ALPHABET BLOCKS!
    // -----------------------------------------------------------------------
    const toyRugMat = LS.createWovenRugTexture
      ? LS.makeSurfaceMat(LS.createWovenRugTexture('#d8f3fc', '#3b82f6', '#ffd166'))
      : LS.makeToonMat(0xcaf0f8);
    const toyRug = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.8), toyRugMat);
    toyRug.rotation.x = -Math.PI / 2; toyRug.position.set(6.4, 0.018, 2.2); worldGroup.add(toyRug);
    const track = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.18, 6, 26), LS.makeToonMat(0x4b5563));
    track.rotation.x = Math.PI / 2; track.position.set(6.4, 0.04, 2.2); worldGroup.add(track);
    const garage = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.62, 0.72), LS.makeToonMat(0xe63946));
    garage.position.set(8.4, 0.31, 1.1); garage.castShadow = true; worldGroup.add(garage);
    const gRoof = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.10, 0.80), LS.makeToonMat(0xfacc15));
    gRoof.position.set(8.4, 0.65, 1.1); worldGroup.add(gRoof);
    [[8.2, 0.13, 3.5, 0x3b82f6], [8.55, 0.13, 3.55, 0x22c55e], [8.38, 0.39, 3.52, 0xffd166]].forEach(bl => {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), LS.makeToonMat(bl[3]));
      cube.position.set(bl[0], bl[1], bl[2]); worldGroup.add(cube);
    });

    [0xe63946, 0xfacc15, 0x3b82f6].forEach((cHex, ci) => {
      const tc = new THREE.Group();
      const cb = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.13, 0.44), LS.makeToonMat(cHex));
      cb.position.y = 0.08; tc.add(cb);
      const ct = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.09, 0.24), LS.makeToonMat(0xfffdf8));
      ct.position.set(0, 0.17, -0.02); tc.add(ct);
      tc.userData = { cx: 6.4, cz: 2.2, radius: 1.18, phase: ci * 2.1 };
      worldGroup.add(tc); W.biboToyCars.push(tc);
    });

    const bibo = LS.createAnimeCharacter({
      scale: 0.66,
      skinColor: 0xcf9772,
      hairColor: 0x1e1613,
      topColor: 0x3b82f6,
      bottomColor: 0x1e3a5f,
      shoeColor: 0xfacc15,
      pants: true
    });
    bibo.root.position.set(6.4, 0.03, 2.2);
    if (LS.applyArticulatedPose) LS.applyArticulatedPose(bibo, 0, 'floor_sit', 0);
    worldGroup.add(bibo.root);
    W.biboChar = bibo;

    const biboBub = LS.createSpeechBubbleSprite ? LS.createSpeechBubbleSprite('Bibo 🚗', 'Laila Salma', { skipAutoLeader: true }) : null;
    if (biboBub) { biboBub.scale.multiplyScalar(0.62); biboBub.position.set(6.4, 1.48, 2.2); worldGroup.add(biboBub); }
    W.biboBub = biboBub;
    W.nouziBub = nouziBub;

    // -----------------------------------------------------------------------
    // AREA 5 (Center): PAINTED 4-PLAYER KIDS' BOARD GAME TABLE! (X = 0, Z = -0.6)
    // -----------------------------------------------------------------------
    const bgTable = new THREE.Group();
    bgTable.position.set(0, 0, -0.6);
    const bgTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.10, 2.1), trimMat);
    bgTop.position.y = 0.56; bgTop.castShadow = true; bgTable.add(bgTop);
    [[-0.86, -0.86], [0.86, -0.86], [-0.86, 0.86], [0.86, 0.86]].forEach(lp => {
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.54, 7), trimMat);
      l.position.set(lp[0], 0.27, lp[1]); bgTable.add(l);
    });
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(1.48, 0.04, 1.48),
      new THREE.MeshBasicMaterial({ map: createBoardGameTexture() })
    );
    board.position.y = 0.63; bgTable.add(board);
    [[-0.42, -0.42, 0xff5d8f], [0.42, -0.42, 0xffd166], [-0.42, 0.42, 0xa855f7], [0.42, 0.42, 0x3b82f6]].forEach(p => {
      const pawn = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.24, 8), LS.makeToonMat(p[2]));
      pawn.position.set(p[0], 0.77, p[1]); bgTable.add(pawn);
    });
    const die = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.17, 0.17), LS.makeToonMat(0xffffff));
    die.position.set(0, 0.74, 0); die.rotation.y = 0.5; bgTable.add(die);
    [[-1.38, 0, 0xff8fab], [1.38, 0, 0xffd166], [0, -1.38, 0xc77dff], [0, 1.38, 0x72c8f5]].forEach(c => {
      const cush = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.48, 0.18, 14), LS.makeToonMat(c[2]));
      cush.position.set(c[0], 0.09, c[1]); bgTable.add(cush);
    });
    worldGroup.add(bgTable);
    addCol(0, -0.6, 1.18, 1.18);

    // MAI & DR. MOSTAFA (Thierry Henry + Dave Chappelle likeness asking "Are your bones okay?")
    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Mai 🍝',
        line: 'Hi Lailouta, I made you your favorite food! 🧀🍝💛',
        lineLaila: 'Hi Lailouta, I made you your favorite food! 🧀🍝💛',
        lineSalma: 'Hi Salouma, I missed you! 🧀🍝💛',
        pos: new THREE.Vector3(-5.6, 0, -5.8),
        baseRot: 0,
        waveOnNear: true,
        char: { scale: 0.92, skinColor: 0xdca886, hairColor: 0x261a14, topColor: 0xe07a5f, bottomColor: 0x3d5a80, longHair: true }
      },
      {
        name: 'Mostafa (Dr.) 🩺🦴',
        line: 'Hey {leader}! How is my favorite niece — are your bones okay? 🦴😄🩺',
        pos: new THREE.Vector3(4.48, 0.02, -3.8),
        baseRot: Math.PI / 2,
        seated: true,
        char: {
          scale: 1.0,
          athletic: true,
          skinColor: 0x5c3822,
          hairColor: 0x161210,
          bald: true,
          doctorCoat: true,
          stethoscope: true,
          topColor: 0xffffff,
          bottomColor: 0x1e293b,
          pants: true,
          faceOpts: {
            charismaticMale: true,
            goatee: true,
            smileTeeth: true,
            eyeColor: '#1e120c',
            eyeHighlight: '#5a3a24'
          }
        }
      }
    ]);

    W.zones.push({ id: 'mai_lasagna', label: "Talk to Mai — Have Homemade Lasagna? 🧀🍝", pos: new THREE.Vector3(-5.6, 0, -2.0), radius: 2.8 });
    W.zones.push({ id: 'kids_board_game', label: 'Play a Board Game with Laila, Salma, Nouzi & Bibo! 🎲🎉', pos: new THREE.Vector3(0, 0, 1.5), radius: 2.8 });
    W.zones.push({ id: 'home_qashqai', label: 'Take Elevator Down to Gray Nissan Qashqai (Drive Home or Elsewhere) 🛗🚙', pos: new THREE.Vector3(0, 0, 6.2), radius: 2.3 });

    W.update = function (dt, elapsed) {
      if (W.tvObj) W.tvObj.update(elapsed);

      // Show Bibo ("Laila Salma") & Nouzi speech bubbles when the active leader is nearby!
      const activeChar = (LS.state && LS.state.activeLeader === 'salma' && LS.chars && LS.chars.salma)
        ? LS.chars.salma : (LS.chars && LS.chars.laila);
      if (activeChar && activeChar.root) {
        const lp = activeChar.root.position;
        if (W.biboBub) W.biboBub.visible = Math.hypot(lp.x - 6.4, lp.z - 2.2) < 7.2;
        if (W.nouziBub) W.nouziBub.visible = Math.hypot(lp.x + 6.4, lp.z - 2.2) < 7.2;
      }

      // Animate Nouzi doing real gymnastics moves on her mat (exact height clearance — ZERO floor clipping!)
      if (W.nouziChar) {
        const matTop = 0.095;
        const reachH = 1.42; // Scaled feet-to-fingertips height (0.74 scale)
        const cycle = elapsed % 9.0;
        const r = W.nouziChar.root;
        const bp = W.nouziChar.bodyPivot;
        if (cycle < 3.0) {
          // Phase 1: Graceful Cartwheel across the pink mat!
          const u = cycle / 3.0;
          const ang = -u * Math.PI * 2;
          const yClear = matTop + Math.max(0, -Math.cos(ang)) * reachH + Math.abs(Math.sin(ang)) * 0.52;
          r.position.set(-7.6 + u * 2.4, yClear, 2.2);
          r.rotation.set(0, 0, 0);
          bp.rotation.set(0, 0, ang);
          W.nouziChar.leftArm.rotation.z = 2.75; W.nouziChar.rightArm.rotation.z = -2.75;
          W.nouziChar.leftLeg.rotation.z = -0.52; W.nouziChar.rightLeg.rotation.z = 0.52;
        } else if (cycle < 6.0) {
          // Phase 2: Handstand hold with gymnastic scissor splits (hands planted right on top of mat!)
          const u = (cycle - 3.0) / 3.0;
          const inv = Math.sin(u * Math.PI);
          const ang = inv * Math.PI;
          const yClear = matTop + Math.max(0, -Math.cos(ang)) * reachH + Math.abs(Math.sin(ang)) * 0.42;
          r.position.set(-5.2, yClear, 2.2);
          r.rotation.set(0, 0, 0);
          bp.rotation.set(0, 0, ang);
          W.nouziChar.leftArm.rotation.z = 2.95; W.nouziChar.rightArm.rotation.z = -2.95;
          const kick = inv > 0.75 ? Math.sin(elapsed * 5.0) * 0.34 : 0;
          W.nouziChar.leftLeg.rotation.z = -0.18 - kick;
          W.nouziChar.rightLeg.rotation.z = 0.18 - kick;
        } else {
          // Phase 3: Joyful gymnastic leap & pirouette back across the mat!
          const u = (cycle - 6.0) / 3.0;
          r.position.set(-5.2 - u * 2.4, matTop + Math.abs(Math.sin(u * Math.PI * 3)) * 0.44, 2.2);
          r.rotation.set(0, 0, 0);
          bp.rotation.set(0, u * Math.PI * 2, 0);
          W.nouziChar.leftArm.rotation.z = 2.1; W.nouziChar.rightArm.rotation.z = -2.1;
          W.nouziChar.leftLeg.rotation.z = 0; W.nouziChar.rightLeg.rotation.z = 0;
        }
      }

      if (W.biboChar) {
        W.biboChar.root.rotation.y = Math.sin(elapsed * 1.4) * 0.7;
        W.biboChar.rightArm.rotation.x = -0.9 + Math.sin(elapsed * 5.0) * 0.35;
        W.biboChar.leftArm.rotation.x = -0.7 + Math.cos(elapsed * 5.0) * 0.25;
      }
      W.biboToyCars.forEach(tc => {
        const u = tc.userData;
        const a = elapsed * 1.85 + u.phase;
        tc.position.set(u.cx + Math.cos(a) * u.radius, 0.04, u.cz + Math.sin(a) * u.radius);
        tc.rotation.y = -a;
      });
      // Animate tiny sailboats gliding along the river 18 floors below!
      W.riverBoats.forEach(boat => {
        const u = boat.userData;
        const span = 120;
        const bx = ((u.baseX + elapsed * u.speed + span / 2) % span + span) % span - span / 2;
        boat.position.set(bx, riverY + 0.05 + Math.sin(elapsed * 2 + u.phase) * 0.06, u.z);
        boat.rotation.y = u.speed >= 0 ? 0 : Math.PI;
      });
      // Animate clouds drifting slowly past 18th-floor windows!
      W.skyClouds.forEach(cl => {
        const u = cl.userData;
        const span = 140;
        const cx = ((u.baseX + elapsed * u.speed + span / 2) % span + span) % span - span / 2;
        cl.position.set(cx, u.y + Math.sin(elapsed * 0.4 + u.baseX) * 0.25, u.z);
      });
      W.lasagnaSteams.forEach(st => {
        const t = (elapsed * 0.55 + st.userData.phase) % 1.0;
        st.position.set(st.userData.bx, st.userData.by + t * 0.52, st.userData.bz);
        st.scale.setScalar(0.65 + t * 0.9);
        st.material.opacity = (1 - t) * 0.42;
      });
    };

    W.getZoneLabel = (x, z) => {
      if (z < -1.8 && x < -2) return "Mai's Lasagna Kitchen 🍝";
      if (z < -1.8 && x > 2) return "Dr. Mostafa's Lounge 🩺🦴";
      if (x < -2.5) return "Nouzi's Gymnastics Mat 🤸‍♀️";
      if (x > 2.5) return "Bibo's Toy Car Track 🚗";
      if (z > 4.2) return "Entryway (Elevator & Qashqai 🛗🚙)";
      return "Mai & Mostafa's Board Game Table 🎲";
    };

    W.drawMiniMap = (ctx, Wpx, Hpx, toX, toY) => {
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(0, 0, Wpx, toY(-7.2));
      ctx.fillStyle = '#f5e4cc'; ctx.fillRect(toX(-11), toY(-7.2), toX(11) - toX(-11), toY(7.4) - toY(-7.2));
      ctx.fillStyle = '#3d5a80'; ctx.fillRect(toX(3.8), toY(-5.4), toX(5.2) - toX(3.8), toY(-2.2) - toY(-5.4));
      ctx.fillStyle = '#3d2c1e'; ctx.font = 'bold 7.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('RIVER VIEW 🌊', toX(0), toY(-7.4) - 2);
      ctx.fillText('MAI 🍝', toX(-5.6), toY(-4.0));
      ctx.fillText('MOSTAFA 🩺', toX(5.6), toY(-3.8));
      ctx.fillText('BOARD GAME 🎲', toX(0), toY(-0.6));
      ctx.fillText('ELEVATOR 🛗', toX(0), toY(6.4));
    };

    return W;
  }

  // =========================================================================
  // DESTINATION 6: NGSC SPORTS CLUB (dest_ngsc)
  // - Left Wing: Glass-Back Championship Squash Court for Laila!
  // - Right Wing: Sunlit Olympic Swimming Pool where Laila & Salma BOTH swim!
  // - Clubhouse Pergola, Palm Trees, Striped Umbrellas & Gray Qashqai!
  // =========================================================================
  function buildNGSC(worldGroup) {
    const W = {
      id: 'dest_ngsc',
      isInterior: false,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      skyMesh: null,
      squashBall: null,
      poolFloatie: null
    };
    const addCol = (x, z, hw, hd) => W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    W.getGroundHeight = () => 0;

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(205, 24, 16),
      new THREE.MeshBasicMaterial({ map: LS.createSkyTexture(LS.state.timeMode, 'tokyo'), side: THREE.BackSide })
    );
    worldGroup.add(sky);
    W.skyMesh = sky;

    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), LS.makeSurfaceMat(LS.createGrassTexture('tokyo')));
    lawn.rotation.x = -Math.PI / 2; lawn.receiveShadow = true; worldGroup.add(lawn);

    // Sunlit Stone Club Plaza & Walkways
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(31, 22), LS.makeSurfaceMat(LS.createStonePathTexture(), { color: 0xf0e4d0 }));
    plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, 0.02, 0); plaza.receiveShadow = true; worldGroup.add(plaza);

    // Grand NGSC Welcome Arch & Clubhouse Pavilion along North Backdrop!
    const trimMat = LS.makeToonMat(0x7c4e2e);
    const clubMat = LS.makeToonMat(0xfdf5e6);
    const navyMat = LS.makeToonMat(0x1e3a5f);
    const clubSign = new THREE.Mesh(
      new THREE.BoxGeometry(10.5, 1.25, 0.22),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🎾 NGSC SPORTS CLUB • SQUASH & SWIMMING 🏊‍♀️', {
          bg: '#0c4a6e', border: '#facc15', color: '#ffffff', font: 'bold 24px sans-serif', width: 720, height: 100
        })
      })
    );
    clubSign.position.set(0, 4.45, -10.5); worldGroup.add(clubSign);
    [-5.4, 5.4].forEach(px => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.42, 4.6, 0.42), clubMat);
      p.position.set(px, 2.3, -10.5); p.castShadow = true; worldGroup.add(p);
    });

    // -----------------------------------------------------------------------
    // LEFT WING (X = -7.6, Z = -2.0): GLASS-BACK CHAMPIONSHIP SQUASH COURT!
    // -----------------------------------------------------------------------
    const sqG = new THREE.Group();
    sqG.position.set(-7.6, 0, -2.0);
    // Maple Hardwood Squash Floor
    const sqFloor = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 0.12, 9.8),
      LS.makeSurfaceMat(LS.createCedarPlankTexture(), { color: 0xf0c98a })
    );
    sqFloor.position.y = 0.06; sqFloor.receiveShadow = true; sqG.add(sqFloor);
    // Crisp Red Squash Court Floor Lines (Short Line, Half-Court Line & Service Boxes!)
    const redLine = LS.makeToonMat(0xdc2626);
    const shortL = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.02, 0.09), redLine);
    shortL.position.set(0, 0.13, 0.8); sqG.add(shortL);
    const halfL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 4.0), redLine);
    halfL.position.set(0, 0.13, 2.8); sqG.add(halfL);
    [-2.5, 2.5].forEach(sx => {
      const boxH = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.02, 0.08), redLine);
      boxH.position.set(sx, 0.13, 2.6); sqG.add(boxH);
      const boxV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 1.8), redLine);
      boxV.position.set(sx < 0 ? -1.5 : 1.5, 0.13, 1.7); sqG.add(boxV);
    });
    // White Front Wall + Side Walls + Red Tin, Service Line & Out Line!
    const sqWallMat = LS.makeToonMat(0xf8fafc);
    const fWall = new THREE.Mesh(new THREE.BoxGeometry(7.4, 4.6, 0.24), sqWallMat);
    fWall.position.set(0, 2.3, -4.9); fWall.castShadow = true; sqG.add(fWall);
    [-3.65, 3.65].forEach(wx => {
      const sW = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.2, 9.8), sqWallMat);
      sW.position.set(wx, 2.1, 0); sW.castShadow = true; sqG.add(sW);
    });
    // Front Wall Tin (bottom metal strip), Service Line & Top Out Line
    const tin = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.48, 0.06), LS.makeToonMat(0xe11d48));
    tin.position.set(0, 0.34, -4.76); sqG.add(tin);
    const srvLine = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.07, 0.06), redLine);
    srvLine.position.set(0, 1.85, -4.76); sqG.add(srvLine);
    const outLine = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.08, 0.06), redLine);
    outLine.position.set(0, 4.35, -4.76); sqG.add(outLine);
    // Clear Glass Back Viewing Wall!
    const gBack = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 2.8, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.26 })
    );
    gBack.position.set(0, 1.48, 4.9); sqG.add(gBack);
    const sqBadge = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.65, 0.12),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🎾 NGSC SQUASH COURT', {
          bg: '#0f172a', border: '#38bdf8', color: '#fef08a', font: 'bold 24px sans-serif', width: 380, height: 80
        })
      })
    );
    sqBadge.position.set(0, 4.88, -4.85); sqG.add(sqBadge);

    // Live bouncing yellow-dot squash ball inside the court!
    const sBall = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), LS.makeEmissiveMat(0x1e293b, 0xfacc15, 0.45));
    sBall.position.set(0, 1.4, -1.5); sqG.add(sBall);
    W.squashBall = sBall;

    // Squash Rackets Rack beside glass back wall
    [-2.4, -1.9].forEach(rx => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.65, 6), navyMat);
      handle.position.set(rx, 0.55, 5.22); sqG.add(handle);
      const head = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 6, 14), LS.makeToonMat(0xf59e0b));
      head.position.set(rx, 1.05, 5.22); sqG.add(head);
    });
    worldGroup.add(sqG);
    addCol(-7.6, -2.0, 3.9, 5.1);

    // -----------------------------------------------------------------------
    // RIGHT WING (X = +7.4, Z = -2.0): SPARKLING OLYMPIC SWIMMING POOL!
    // -----------------------------------------------------------------------
    const poolG = new THREE.Group();
    poolG.position.set(7.4, 0, -2.0);
    // Crisp White Pool Coping Deck
    const coping = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.16, 11.4), LS.makeToonMat(0xf8fafc));
    coping.position.y = 0.08; coping.receiveShadow = true; poolG.add(coping);
    // Deep Turquoise Sparkling Pool Water
    const pWater = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 10.0), LS.makeWaterMat(0.95));
    pWater.rotation.x = -Math.PI / 2; pWater.position.y = 0.18; poolG.add(pWater);
    // Floating Red & White Swimming Lane Ropes (3 lanes!)
    [-1.4, 1.4].forEach(lx => {
      for (let lz = -4.5; lz <= 4.5; lz += 0.75) {
        const buoy = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.34, 8),
          LS.makeToonMat(Math.round(lz * 2) % 2 === 0 ? 0xef4444 : 0xffffff)
        );
        buoy.rotation.x = Math.PI / 2; buoy.position.set(lx, 0.21, lz); poolG.add(buoy);
      }
    });
    // Starting Blocks at North End + Stainless Pool Ladders!
    [-2.7, 0, 2.7].forEach(bx => {
      const blk = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.56, 0.62), navyMat);
      blk.position.set(bx, 0.38, -5.3); blk.castShadow = true; poolG.add(blk);
      const bTop = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.08, 0.66), LS.makeToonMat(0x38bdf8));
      bTop.position.set(bx, 0.68, -5.3); poolG.add(bTop);
    });
    // Colorful Donut Pool Floatie bobbing on the sparkling water!
    const floatie = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.20, 10, 20), LS.makeToonMat(0xff6b9d));
    floatie.rotation.x = Math.PI / 2; floatie.position.set(2.4, 0.28, 2.2); poolG.add(floatie);
    W.poolFloatie = floatie;

    // Striped Poolside Umbrellas & Cushioned Sun Loungers along East Deck!
    [-3.2, 2.2].forEach((uz, ui) => {
      const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.26, 2.05), LS.makeToonMat(0xffffff));
      lounger.position.set(5.8, 0.20, uz); poolG.add(lounger);
      const towel = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.06, 1.55), LS.makeToonMat(ui === 0 ? 0x38bdf8 : 0xfacc15));
      towel.position.set(5.8, 0.36, uz); poolG.add(towel);
      const uPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 6), trimMat);
      uPole.position.set(6.1, 1.35, uz - 1.1); poolG.add(uPole);
      const uTop = new THREE.Mesh(new THREE.ConeGeometry(1.55, 0.58, 8), LS.makeToonMat(ui === 0 ? 0x0284c7 : 0xf97316));
      uTop.position.set(6.1, 2.65, uz - 1.1); uTop.castShadow = true; poolG.add(uTop);
    });

    const poolSign = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.65, 0.12),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture('🏊‍♀️ NGSC SWIMMING POOL', {
          bg: '#0369a1', border: '#fef08a', color: '#ffffff', font: 'bold 24px sans-serif', width: 390, height: 80
        })
      })
    );
    poolSign.position.set(0, 2.55, -6.2); poolG.add(poolSign);
    [-1.8, 1.8].forEach(px => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 2.5, 6), navyMat);
      p.position.set(px, 1.25, -6.2); poolG.add(p);
    });

    worldGroup.add(poolG);
    addCol(7.4, -2.0, 4.4, 5.2);

    // Tropical Palms & Parked Gray Nissan Qashqai by the Club Gate!
    [[-14, -9, 'green', 1.25], [14.5, -9, 'green', 1.25], [-14, 9, 'sakura', 1.15], [14.5, 9, 'olive', 1.2]].forEach(tc => {
      if (LS.ghibli && LS.ghibli.buildGhibliTree) {
        const t = LS.ghibli.buildGhibliTree(tc[2], tc[3]);
        t.position.set(tc[0], 0, tc[1]); worldGroup.add(t);
      }
    });
    if (LS.createNissanQashqai) {
      const suv = LS.createNissanQashqai();
      suv.position.set(-5.6, 0, 10.2);
      suv.rotation.y = Math.PI * 0.35;
      worldGroup.add(suv);
      addCol(-5.6, 10.2, 2.2, 1.4);
    }

    // Friendly NGSC Coaches & Club Members (6 Lively NPCs with Alternating Leader-Aware Phrases!)
    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Coach Karim (Squash) 🎾',
        line: "Ready to hit the glass court, {leader}? Let's practice your winning squash rally! 🎾🏆",
        lines: [
          "Ready to hit the glass court, {leader}? Let's practice your winning squash rally! 🎾🏆",
          'Great footwork and super crisp forehand swings today, {leader}! 💪✨',
          'Step into the Squash Court zone to rally with {companion}, {leader}! 🎾'
        ],
        pos: new THREE.Vector3(-4.2, 0, 4.2),
        baseRot: 0.4,
        waveOnNear: true,
        char: { scale: 0.96, skinColor: 0xcf9772, hairColor: 0x1e1816, topColor: 0x0284c7, bottomColor: 0x1e293b, pants: true }
      },
      {
        name: 'Coach Dina (Swim) 🏊‍♀️',
        line: 'The pool water is sparkling warm today, {leader} — jump in and swim! 🏊‍♀️💦',
        lines: [
          'The pool water is sparkling warm today, {leader} — jump in and swim! 🏊‍♀️💦',
          'Kick smooth and glide like a dolphin across the turquoise lanes, {leader}! 🐬✨',
          'You and {companion} make an unstoppable swim team, {leader}! 🏅'
        ],
        pos: new THREE.Vector3(3.6, 0, 4.4),
        baseRot: -0.4,
        waveOnNear: true,
        char: { scale: 0.92, skinColor: 0xdca886, hairColor: 0x261a14, topColor: 0xf97316, bottomColor: 0x0f172a, longHair: true }
      },
      {
        name: 'Farida (Squash Player) 🎾',
        line: 'Hi {leader}! Your squash drop-shots look awesome on that glass court! 🎾✨',
        lines: [
          'Hi {leader}! Your squash drop-shots look awesome on that glass court! 🎾✨',
          'NGSC is the best sports club in town for squash and swimming, {leader}! 🏆',
          'Catch you for a friendly match after your swim, {leader}! 😄'
        ],
        pos: new THREE.Vector3(-10.5, 0, 5.2),
        baseRot: 0.55,
        patrol: { axis: 'x', center: -10.5, range: 2.8, speed: 1.0 },
        char: { scale: 0.84, skinColor: 0xe4b292, hairColor: 0x2e1f18, topColor: 0xec4899, bottomColor: 0x1e3a5f, pigtails: true }
      },
      {
        name: 'Adam (Junior Swimmer) 🥽',
        line: 'Hey {leader}! I just swam four full laps in the pool! 🏊‍♂️💧',
        lines: [
          'Hey {leader}! I just swam four full laps in the pool! 🏊‍♂️💧',
          'The turquoise water feels super refreshing under the striped umbrellas, {leader}! ⛱️',
          'Race you to the pool wall, {leader}! 💦✨'
        ],
        pos: new THREE.Vector3(10.8, 0, 4.6),
        baseRot: -0.6,
        patrol: { axis: 'z', center: 4.6, range: 2.6, speed: 1.05 },
        char: { scale: 0.76, skinColor: 0xd8a382, hairColor: 0x1e1612, topColor: 0x22c55e, bottomColor: 0x0284c7, pants: true }
      },
      {
        name: 'Coach Sherif (Lifeguard) 🛟',
        line: 'All clear and sunny at the NGSC pool, {leader}! Have a safe, splashy swim! 🛟☀️',
        lines: [
          'All clear and sunny at the NGSC pool, {leader}! Have a safe, splashy swim! 🛟☀️',
          'Remember to stretch before squash and drink plenty of water, {leader}! 💧',
          'You\'re both champion athletes today, {leader}! 🏅✨'
        ],
        pos: new THREE.Vector3(12.2, 0, -4.5),
        baseRot: -Math.PI * 0.55,
        waveOnNear: true,
        char: { scale: 0.98, skinColor: 0xc99166, hairColor: 0x1c1512, topColor: 0xef4444, bottomColor: 0x1e293b, pants: true, hatType: 'cap', hatColor: 0xef4444 }
      },
      {
        name: 'Auntie Dalia (Club Lounge) 🥤',
        line: 'Hello {leader}! Watching you play squash and swim from the shady pergola! ⛱️💛',
        lines: [
          'Hello {leader}! Watching you play squash and swim from the shady pergola! ⛱️💛',
          'The gray Qashqai is parked right by the club gate whenever you\'re ready to head home, {leader}! 🚙',
          'What a cheerful afternoon at NGSC, {leader}! 🌴☀️'
        ],
        pos: new THREE.Vector3(-0.2, 0, 7.6),
        baseRot: Math.PI,
        waveOnNear: true,
        char: { scale: 0.92, skinColor: 0xe6b898, hairColor: 0x3b2418, topColor: 0xa855f7, bottomColor: 0x334155, longHair: true, hatType: 'sunhat', hatColor: 0xfef08a }
      }
    ]);

    // White translucent water-splash rings used when Laila & Salma swim together!
    W.swimSplashes = [0, 1].map(() => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.28, 0.52, 18),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.72, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(7.4, 0.22, 0);
      ring.visible = false;
      worldGroup.add(ring);
      return ring;
    });

    W.zones.push({ id: 'ngsc_squash', label: 'Watch Laila Play Squash on Court! 🎾🏆', pos: new THREE.Vector3(-7.6, 0, 4.2), radius: 3.0 });
    W.zones.push({ id: 'ngsc_swim', label: 'Swim Together in the NGSC Pool (Laila & Salma!) 🏊‍♀️💦', pos: new THREE.Vector3(7.4, 0, 4.6), radius: 3.2 });
    W.zones.push({ id: 'home_qashqai', label: 'Hop in Gray Nissan Qashqai (Drive Home or Elsewhere) 🚙', pos: new THREE.Vector3(-1.8, 0, 10.2), radius: 3.2 });

    W.update = function (dt, elapsed) {
      const activeSquash = LS.runtime && LS.runtime.ngscActivity && LS.runtime.ngscActivity.type === 'squash';
      if (W.squashBall && !activeSquash) {
        const t = elapsed * 2.6;
        W.squashBall.position.set(
          Math.sin(t * 0.9) * 2.4,
          0.35 + Math.abs(Math.sin(t * 1.9)) * 2.1,
          -4.5 + Math.abs(Math.sin(t * 1.15)) * 6.8
        );
      }
      if (W.poolFloatie) {
        W.poolFloatie.position.y = 0.26 + Math.sin(elapsed * 2.5) * 0.05;
        W.poolFloatie.rotation.z = Math.sin(elapsed * 1.1) * 0.12;
      }
    };

    W.getZoneLabel = (x, z) => {
      if (x < -2 && z < 5.5) return 'NGSC Championship Squash Court 🎾';
      if (x > 2 && z < 5.5) return 'NGSC Olympic Swimming Pool 🏊‍♀️';
      return 'NGSC Sports Club Plaza 🌴';
    };

    W.drawMiniMap = (ctx, Wpx, Hpx, toX, toY) => {
      ctx.fillStyle = '#8cc972'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#f0e4d0'; ctx.fillRect(toX(-15), toY(-11), toX(15) - toX(-15), toY(11) - toY(-11));
      ctx.fillStyle = '#f0c98a'; ctx.fillRect(toX(-11.2), toY(-7), toX(-4) - toX(-11.2), toY(3) - toY(-7));
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(toX(3.2), toY(-7), toX(11.6) - toX(3.2), toY(3) - toY(-7));
      ctx.fillStyle = '#1e293b'; ctx.font = 'bold 7.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('SQUASH 🎾', toX(-7.6), toY(-2));
      ctx.fillText('POOL 🏊‍♀️', toX(7.4), toY(-2));
      ctx.fillText('QASHQAI 🚙', toX(-3.2), toY(10));
    };

    return W;
  }

  // =========================================================================
  // PATERNAL GRANDPARENTS: GEDO MAHMOUD & NANA OMAIMA'S HOUSE (dest_gedo_mahmoud)
  // Walkable cozy villa interior inside the Gated Community!
  // =========================================================================
  function buildGedoMahmoudHouse(worldGroup) {
    const W = {
      id: 'dest_gedo_mahmoud',
      isInterior: true,
      colliders: [],
      zones: [],
      hiddenAnimals: [],
      coffeeSteams: []
    };
    const addCol = (x, z, hw, hd) => W.colliders.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
    W.getGroundHeight = () => 0;

    const { trimMat } = buildRoomShell(worldGroup, 18, 14, 4.5, 0xdfb889, '#fdf4e4', 0x6f4326);

    // Rich Patterned Persian Carpet in Center!
    const rugMat = LS.createWovenRugTexture
      ? LS.makeSurfaceMat(LS.createWovenRugTexture('#f4e2cc', '#2a6f5e', '#d4a359'))
      : LS.makeToonMat(0xe8d5bc);
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(11.2, 8.0), rugMat);
    rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.016, -0.6); worldGroup.add(rug);

    // Sunlit Curtained Windows along North & East Walls + Golden Chandelier!
    addDetailedWallWindow(worldGroup, -4.6, 2.45, -6.80, 0, 2.9, 1.85, 0xd8f0e8, trimMat);
    addDetailedWallWindow(worldGroup, 4.8, 2.45, -6.80, 0, 2.9, 1.85, 0xd8f0e8, trimMat);

    const brass = LS.makeToonMat(0xd4a359);
    const chanG = new THREE.Group();
    chanG.position.set(0, 3.68, -0.8);
    const cStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.82, 8), brass);
    cStem.position.y = 0.41; chanG.add(cStem);
    const cRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.045, 7, 20), brass);
    cRing.rotation.x = Math.PI / 2; chanG.add(cRing);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), LS.makeEmissiveMat(0xfff7dc, 0xffd57a, 0.92));
      orb.position.set(Math.cos(a) * 0.72, 0.12, Math.sin(a) * 0.72); chanG.add(orb);
    }
    if (LS.createGlowSprite) chanG.add(LS.createGlowSprite(0xffe094, 1.9));
    worldGroup.add(chanG);

    // Welcome Banner & Golden Family Portrait Gallery
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.92, 0.12),
      new THREE.MeshBasicMaterial({
        map: LS.createSignTexture("🏡 GEDO MAHMOUD & NANA OMAIMA'S HOME 💛", {
          bg: '#fff9ef', border: '#c66b47', color: '#3b2516', font: 'bold 22px sans-serif', width: 620, height: 100
        })
      })
    );
    sign.position.set(0, 3.65, -6.82); worldGroup.add(sign);

    // LEFT SIDE: GEDO MAHMOUD'S COZY ARMCHAIR, BOOKSHELF & ARABIC COFFEE CORNER!
    const chairPos = { x: -4.8, z: -3.2, rotY: 0.45 };
    const chairMat = LS.makeToonMat(0x3a6b5c);
    const cushMat = LS.makeToonMat(0x4f8a78);
    const gChairG = new THREE.Group();
    gChairG.position.set(chairPos.x, 0, chairPos.z);
    gChairG.rotation.y = chairPos.rotY;
    const gBase = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.24, 0.66), chairMat);
    gBase.position.set(0, 0.20, -0.02); gBase.castShadow = true; gChairG.add(gBase);
    const gCush = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.46), cushMat);
    gCush.position.set(0, 0.33, 0.05); gChairG.add(gCush);
    const gBack = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.78, 0.22), chairMat);
    gBack.position.set(0, 0.66, -0.26); gBack.castShadow = true; gChairG.add(gBack);
    [-0.47, 0.47].forEach(ax => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.48, 0.66), chairMat);
      arm.position.set(ax, 0.36, -0.02); gChairG.add(arm);
    });
    [[-0.46, -0.25], [0.46, -0.25], [-0.46, 0.22], [0.46, 0.22]].forEach(lg => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.10, 6), trimMat);
      leg.position.set(lg[0], 0.05, lg[1]); gChairG.add(leg);
    });
    worldGroup.add(gChairG);
    addCol(chairPos.x, chairPos.z, 0.72, 0.72);

    // Gedo Mahmoud's Coffee Side Table + Steaming Arabic Coffee + Bookshelf on West Wall!
    const cx = -3.1, cz = -2.2;
    const cTab = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.08, 16), trimMat);
    cTab.position.set(cx, 0.62, cz); worldGroup.add(cTab);
    const cLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.22, 0.60, 10), trimMat);
    cLeg.position.set(cx, 0.30, cz); worldGroup.add(cLeg);
    const kanaka = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.22, 10), brass);
    kanaka.position.set(cx - 0.16, 0.77, cz - 0.10); worldGroup.add(kanaka);
    const finjan = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.11, 10), LS.makeToonMat(0xfffdf8));
    finjan.position.set(cx + 0.16, 0.72, cz + 0.10); worldGroup.add(finjan);
    for (let i = 0; i < 2; i++) {
      const st = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), LS.makeToonMat(0xffffff, { transparent: true, opacity: 0.48 }));
      st.userData = { bx: cx + 0.16, by: 0.85, bz: cz + 0.10, phase: i * 0.55 };
      worldGroup.add(st); W.coffeeSteams.push(st);
    }
    addCol(cx, cz, 0.70, 0.70);

    // Tall Wooden Bookshelf along West Wall
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.5, 3.2), trimMat);
    shelf.position.set(-8.45, 1.25, -2.0); worldGroup.add(shelf);
    [0x2a9d8f, 0xe07a5f, 0x3b82f6, 0xe9c46a, 0x8b5cf6].forEach((bc, bi) => {
      const bk = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.42), LS.makeToonMat(bc));
      bk.position.set(-8.30, 1.72, -3.1 + bi * 0.55); worldGroup.add(bk);
    });

    // RIGHT SIDE: NANA OMAIMA'S FAMILY DINING FEAST & SWEETS TABLE!
    const dTabG = new THREE.Group();
    dTabG.position.set(4.2, 0, -2.0);
    const dtTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.95), trimMat);
    dtTop.position.y = 0.80; dtTop.castShadow = true; dTabG.add(dtTop);
    const dtRun = new THREE.Mesh(new THREE.BoxGeometry(3.24, 0.02, 0.62), LS.makeToonMat(0xfff5e4));
    dtRun.position.y = 0.87; dTabG.add(dtRun);
    [[-1.35, -0.78], [1.35, -0.78], [-1.35, 0.78], [1.35, 0.78]].forEach(lp => {
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.80, 7), trimMat);
      l.position.set(lp[0], 0.40, lp[1]); dTabG.add(l);
    });
    // Home-cooked Egyptian family feast platter + Golden Basbousa dessert tray!
    const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.44, 0.06, 14), brass);
    platter.position.set(-0.55, 0.90, 0); dTabG.add(platter);
    const feast = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), LS.makeToonMat(0xd97706));
    feast.scale.set(1.2, 0.55, 1.0); feast.position.set(-0.55, 1.00, 0); dTabG.add(feast);
    const basbousa = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.10, 0.48), LS.makeToonMat(0xf4b942));
    basbousa.position.set(0.72, 0.92, 0.08); dTabG.add(basbousa);
    worldGroup.add(dTabG);
    addCol(4.2, -2.0, 1.75, 1.15);

    addIndoorPlant(worldGroup, -7.8, 4.6, 0x2a9d8f, true);
    addIndoorPlant(worldGroup, 7.8, 4.6, 0xc66b47, true);

    // Exact seated coordinates for Gedo Mahmoud + Warm standing Nana Omaima!
    const gmX = chairPos.x + (-0.02) * Math.sin(chairPos.rotY);
    const gmZ = chairPos.z + (-0.02) * Math.cos(chairPos.rotY);

    LS.spawnWorldNPCs(worldGroup, [
      {
        name: 'Gedo Mahmoud ☕',
        line: 'Ahlan ya Laila & Salma! Come give Gedo Mahmoud a big hug — I saved my best stories for you! 💛☕',
        pos: new THREE.Vector3(gmX, 0.02, gmZ),
        baseRot: chairPos.rotY,
        seated: true,
        char: { scale: 0.96, skinColor: 0xd9a480, hairColor: 0xd0d4d8, topColor: 0x3b5998, bottomColor: 0x2b3a4a, pants: true, faceOpts: { glasses: true, mustache: true, elder: true } }
      },
      {
        name: 'Nana Omaima 🍲💛',
        line: 'Habibati Laila & Salma! Nana Omaima cooked a delicious homemade feast & sweet basbousa just for you! 🍲🍯💛',
        pos: new THREE.Vector3(4.2, 0, -4.1),
        baseRot: 0,
        waveOnNear: true,
        char: { scale: 0.90, skinColor: 0xe6b898, hairColor: 0xcfd4da, topColor: 0x2a9d8f, bottomColor: 0x4a5568, hairBun: true, faceOpts: { elder: true } }
      }
    ]);

    W.zones.push({ id: 'visit_gedo_mahmoud', label: 'Hug & Chat with Gedo Mahmoud ☕💛', pos: new THREE.Vector3(-3.8, 0, 0.2), radius: 2.8 });
    W.zones.push({ id: 'visit_nana_omaima', label: "Enjoy Nana Omaima's Homemade Feast & Sweets 🍲🍯", pos: new THREE.Vector3(4.2, 0, 0.4), radius: 2.8 });
    W.zones.push({ id: 'exit_interior', label: 'Step Back Outside into Our Gated Community 🏡🌳', pos: new THREE.Vector3(0, 0, 5.7), radius: 2.3 });

    W.update = (dt, elapsed) => {
      W.coffeeSteams.forEach(st => {
        const t = (elapsed * 0.55 + st.userData.phase) % 1.0;
        st.position.set(st.userData.bx, st.userData.by + t * 0.48, st.userData.bz);
        st.scale.setScalar(0.65 + t * 0.9);
        st.material.opacity = (1 - t) * 0.45;
      });
    };
    W.getZoneLabel = (x) => (x < 0 ? "Gedo Mahmoud's Study & Coffee Corner ☕" : "Nana Omaima's Dining Room 🍲💛");
    W.drawMiniMap = (ctx, Wpx, Hpx, toX, toY) => {
      ctx.fillStyle = '#f5e4cf'; ctx.fillRect(0, 0, Wpx, Hpx);
      ctx.fillStyle = '#3a6b5c'; ctx.fillRect(toX(-5.8), toY(-4.2), toX(-3.8) - toX(-5.8), toY(-2.2) - toY(-4.2));
      ctx.fillStyle = '#c66b47'; ctx.fillRect(toX(2.5), toY(-3.2), toX(5.9) - toX(2.5), toY(-0.8) - toY(-3.2));
      ctx.fillStyle = '#3d2c1e'; ctx.font = 'bold 7.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('GEDO MAHMOUD ☕', toX(-4.6), toY(-4.8));
      ctx.fillText('NANA OMAIMA 🍲', toX(4.2), toY(-3.8));
      ctx.fillText('EXIT 🏡', toX(0), toY(5.6));
    };

    return W;
  }

  LS.registerWorld('dest_eatery', { build: buildEatery });
  LS.registerWorld('dest_yiwan', { build: buildYiwan });
  LS.registerWorld('dest_cosmo_city', { build: buildCosmoCity });
  LS.registerWorld('dest_grandparents', { build: buildGrandparents });
  LS.registerWorld('dest_mai_mostafa', { build: buildMaiMostafa });
  LS.registerWorld('dest_ngsc', { build: buildNGSC });
  LS.registerWorld('dest_gedo_mahmoud', { build: buildGedoMahmoudHouse });
})(window.LailaSalma);
