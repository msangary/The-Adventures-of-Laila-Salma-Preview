window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  LS.chars = {
    laila: null,
    salma: null,
    salmaBubble: null,
    mochiHeart: null,
    npcs: [],
    mochi: null
  };

  LS.OUTFITS = [
    // Tokyo — Laila outfits
    { id: 'laila_school', who: 'laila', shop: 'tokyo', name: 'Sakura Sailor Uniform', desc: 'Classic navy & white uniform with red randoseru', cost: 0, swatch: '#2c4a7c',
      style: { topColor: 0xffffff, bottomColor: 0x2c4a7c, shoeColor: 0xd94848, backpackColor: 0xc92c3b, hatType: 'none' } },
    { id: 'laila_sakura', who: 'laila', shop: 'tokyo', name: 'Sakura Pink Dress & Beret', desc: 'Blossom-pink dress with a matching artist beret', cost: 80, swatch: '#ff8fab',
      style: { topColor: 0xffc2d1, bottomColor: 0xfb6f92, shoeColor: 0xffffff, backpackColor: 0xffe5ec, hatType: 'beret', hatColor: 0xfb6f92 } },
    { id: 'laila_hoodie', who: 'laila', shop: 'tokyo', name: 'Tokyo Mint Streetwear', desc: 'Mint hoodie, denim skirt & sporty cap', cost: 110, swatch: '#52b788',
      style: { topColor: 0x95d5b2, bottomColor: 0x3d5a80, shoeColor: 0xffb703, backpackColor: 0x2d6a4f, hatType: 'cap', hatColor: 0x52b788 } },
    { id: 'laila_festival', who: 'laila', shop: 'tokyo', name: 'Starlight Lavender Yukata', desc: 'Festive lavender outfit with golden beret', cost: 140, swatch: '#9d4edd',
      style: { topColor: 0xe0aaff, bottomColor: 0x7b2cbf, shoeColor: 0xffd166, backpackColor: 0xc77dff, hatType: 'beret', hatColor: 0xffd166 } },

    // Kyoto — Laila outfits
    { id: 'laila_kimono_crimson', who: 'laila', shop: 'kyoto', name: 'Kyoto Crimson Blossom Kimono', desc: 'Festive vermilion silk kimono with sakura kanzashi hairpin', cost: 95, swatch: '#d62828',
      style: { topColor: 0xd62828, bottomColor: 0x8f1d21, shoeColor: 0xd4a373, backpackColor: 0xffc300, hatType: 'kanzashi', hatColor: 0xffb3c6 } },
    { id: 'laila_kimono_indigo', who: 'laila', shop: 'kyoto', name: 'Arashiyama Bamboo Yukata', desc: 'Indigo & emerald Kyoto yukata with festival fox mask', cost: 125, swatch: '#2a9d8f',
      style: { topColor: 0x2a9d8f, bottomColor: 0x264653, shoeColor: 0xe9c46a, backpackColor: 0xf4a261, hatType: 'foxmask', hatColor: 0xffffff } },

    // Tokyo — Salma outfits
    { id: 'salma_kinder', who: 'salma', shop: 'tokyo', name: 'Sunny Sunnyside Set', desc: 'Sunny lemon top, rose skirt & sparkly pink headband', cost: 0, swatch: '#df586b',
      style: { topColor: 0xfff3b0, bottomColor: 0xdf586b, shoeColor: 0xc86d24, backpackColor: 0xd97b38, hatType: 'none', hatColor: 0xfacc15 } },
    { id: 'salma_strawberry', who: 'salma', shop: 'tokyo', name: 'Strawberry Picnic Outfit', desc: 'Berry-red dress with a white sun hat', cost: 75, swatch: '#ef476f',
      style: { topColor: 0xffccd5, bottomColor: 0xef476f, shoeColor: 0xffffff, backpackColor: 0xff758f, hatType: 'kinder', hatColor: 0xffffff } },
    { id: 'salma_bunny', who: 'salma', shop: 'tokyo', name: 'Sky-Blue Bunny Hoodie', desc: 'Pastel sky outfit with cute bunny ears', cost: 100, swatch: '#4cc9f0',
      style: { topColor: 0xbde0fe, bottomColor: 0x4895ef, shoeColor: 0xffafcc, backpackColor: 0x90e0ef, hatType: 'bunny', hatColor: 0xffffff } },
    { id: 'salma_panda', who: 'salma', shop: 'tokyo', name: 'Ueno Panda Explorer', desc: 'Monochrome panda jacket & panda ear hat', cost: 130, swatch: '#2b2d42',
      style: { topColor: 0xffffff, bottomColor: 0x2b2d42, shoeColor: 0xef233c, backpackColor: 0x2b2d42, hatType: 'panda', hatColor: 0xffffff } },

    // Kyoto — Salma outfits
    { id: 'salma_kitsune', who: 'salma', shop: 'kyoto', name: 'Little Kitsune Festival Set', desc: 'Peach shrine kimono with a cute white kitsune fox mask!', cost: 90, swatch: '#f77f00',
      style: { topColor: 0xffd6a5, bottomColor: 0xe76f51, shoeColor: 0xffffff, backpackColor: 0xd62828, hatType: 'foxmask', hatColor: 0xffffff } },
    { id: 'salma_matcha', who: 'salma', shop: 'kyoto', name: 'Uji Matcha Princess Kimono', desc: 'Soft matcha green kimono with blossom hairpin', cost: 115, swatch: '#74c69d',
      style: { topColor: 0xb7e4c7, bottomColor: 0x40916c, shoeColor: 0xffd166, backpackColor: 0xff8fab, hatType: 'kanzashi', hatColor: 0xffd166 } },

    // Safari — Laila outfits
    { id: 'laila_safari', who: 'laila', shop: 'safari', name: 'Savanna Explorer Vest', desc: 'Khaki safari vest, olive shorts & wide-brim explorer sun hat', cost: 85, swatch: '#d4a359',
      style: { topColor: 0xe2c792, bottomColor: 0x6b705c, shoeColor: 0x7f4f24, backpackColor: 0xb08968, hatType: 'kinder', hatColor: 0xd4a359 } },
    { id: 'laila_sunset_ranger', who: 'laila', shop: 'safari', name: 'Serengeti Sunset Ranger', desc: 'Terracotta ranger jacket & warm amber explorer cap', cost: 115, swatch: '#e07a5f',
      style: { topColor: 0xe07a5f, bottomColor: 0x3d405b, shoeColor: 0x8d5524, backpackColor: 0xf2cc8f, hatType: 'cap', hatColor: 0xd97706 } },

    // Safari — Salma outfits
    { id: 'salma_safari', who: 'salma', shop: 'safari', name: 'Little Safari Ranger', desc: 'Sunny khaki explorer outfit with a matching safari sun hat!', cost: 80, swatch: '#e9c46a',
      style: { topColor: 0xf4e4ba, bottomColor: 0x84a59d, shoeColor: 0x9c6644, backpackColor: 0xe76f51, hatType: 'kinder', hatColor: 0xe9c46a } },
    { id: 'salma_lioncub', who: 'salma', shop: 'safari', name: 'Playful Lion Cub Hoodie', desc: 'Cozy honey-gold safari hoodie with cute cub ears!', cost: 110, swatch: '#f59e0b',
      style: { topColor: 0xfcd34d, bottomColor: 0xd97706, shoeColor: 0x78350f, backpackColor: 0xfef3c7, hatType: 'panda', hatColor: 0xf59e0b } },

    // Ancient Egypt — Laila & Salma Royal Outfits!
    { id: 'laila_egypt_royal', who: 'laila', shop: 'egypt', name: 'Royal Egyptian Gold-Collar Tunic', desc: 'Ivory linen tunic, lapis & turquoise trim with a golden lotus circlet!', cost: 85, swatch: '#22c7c7',
      style: { topColor: 0xfff8e7, bottomColor: 0x1f4f94, shoeColor: 0xd4a359, backpackColor: 0x22c7c7, hatType: 'crown', hatColor: 0xf6c945 } },
    { id: 'laila_egypt_nile', who: 'laila', shop: 'egypt', name: 'Nile Lotus Explorer Dress', desc: 'Turquoise Nile silk tunic with warm sandstone sash & golden crown', cost: 110, swatch: '#1e9b9b',
      style: { topColor: 0x5eead4, bottomColor: 0xc98a2c, shoeColor: 0x9a6234, backpackColor: 0xf6c945, hatType: 'crown', hatColor: 0x22c7c7 } },
    { id: 'salma_egypt_royal', who: 'salma', shop: 'egypt', name: 'Little Pharaoh Sun Princess', desc: 'Sunlit ivory & turquoise tunic with a sparkling golden Egyptian circlet!', cost: 80, swatch: '#f6c945',
      style: { topColor: 0xfff8e7, bottomColor: 0x1e9b9b, shoeColor: 0xd4a359, backpackColor: 0xf6c945, hatType: 'crown', hatColor: 0xf6c945 } },
    { id: 'salma_egypt_oasis', who: 'salma', shop: 'egypt', name: 'Oasis Lotus Blossom Set', desc: 'Lotus-pink & golden sand dress with a breezy desert sun hat', cost: 105, swatch: '#ff9ebb',
      style: { topColor: 0xffd6e0, bottomColor: 0x229999, shoeColor: 0xe8b76b, backpackColor: 0xff9ebb, hatType: 'kinder', hatColor: 0xf6c945 } },

    // Marrakech — Laila & Salma Embroidered Moroccan Kaftans!
    { id: 'laila_marrakech_ruby', who: 'laila', shop: 'marrakech', name: 'Ruby Marrakech Embroidered Kaftan', desc: 'Festive crimson kaftan with saffron gold trim & jewel circlet!', cost: 90, swatch: '#c83e37',
      style: { topColor: 0xd84339, bottomColor: 0x8a1c24, shoeColor: 0xf4be44, backpackColor: 0xf4be44, hatType: 'crown', hatColor: 0xf4be44 } },
    { id: 'laila_marrakech_emerald', who: 'laila', shop: 'marrakech', name: 'Zellige Emerald Riad Kaftan', desc: 'Emerald-and-cobalt Moroccan silk kaftan inspired by Zellige tiles', cost: 115, swatch: '#1e8a7a',
      style: { topColor: 0x22a699, bottomColor: 0x1f5692, shoeColor: 0xf4be44, backpackColor: 0xe07a5f, hatType: 'beret', hatColor: 0xf4be44 } },
    { id: 'salma_marrakech_saffron', who: 'salma', shop: 'marrakech', name: 'Saffron Lantern Princess Kaftan', desc: 'Golden saffron kaftan with ruby slippers & sparkling crown!', cost: 85, swatch: '#f4be44',
      style: { topColor: 0xf9cf58, bottomColor: 0xc83e37, shoeColor: 0xc83e37, backpackColor: 0x22a699, hatType: 'crown', hatColor: 0xf4be44 } },
    { id: 'salma_marrakech_rose', who: 'salma', shop: 'marrakech', name: 'Atlas Rose Blossom Kaftan', desc: 'Warm coral-rose Moroccan dress with turquoise festival hair blossom', cost: 105, swatch: '#fb7185',
      style: { topColor: 0xffa6b8, bottomColor: 0x1f5692, shoeColor: 0xf4be44, backpackColor: 0xf4be44, hatType: 'kanzashi', hatColor: 0x22c7c7 } }
  ];

  function buildHatMeshes(hatType, hatColor) {
    const group = new THREE.Group();
    if (!hatType || hatType === 'none') return group;

    const fab = (LS.isHD && LS.createFabricTexture) ? LS.createFabricTexture() : null;
    const mainMat = LS.isHD
      ? new THREE.MeshStandardMaterial({ color: hatColor || 0xfacc15, map: fab, bumpMap: fab, bumpScale: 0.018, roughness: 0.78, metalness: 0.02, envMapIntensity: 0.12 })
      : LS.makeToonMat(hatColor || 0xfacc15);
    const bandMat = LS.isHD
      ? new THREE.MeshStandardMaterial({ color: 0x2563eb, map: fab, roughness: 0.72, metalness: 0.03, envMapIntensity: 0.12 })
      : LS.makeToonMat(0x2563eb);

    if (hatType === 'kinder') {
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.31, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), mainMat);
      dome.position.set(0, 0.08, 0);
      dome.rotation.x = -0.10;
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.42, 0.028, 22), mainMat);
      brim.position.set(0, 0.10, 0.02);
      brim.rotation.x = -0.10;
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.313, 0.316, 0.052, 20), bandMat);
      band.position.set(0, 0.13, 0.01);
      band.rotation.x = -0.10;
      group.add(dome, brim, band);
    } else if (hatType === 'beret') {
      const beret = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 14), mainMat);
      beret.scale.set(1.08, 0.36, 1.08);
      beret.position.set(0.04, 0.25, -0.02);
      beret.rotation.z = -0.18;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.07, 6), mainMat);
      stem.position.set(0.06, 0.36, -0.02);
      group.add(beret, stem);
    } else if (hatType === 'cap') {
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.305, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.52), mainMat);
      dome.position.set(0, 0.06, 0);
      const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.024, 16, 1, false, -Math.PI * 0.4, Math.PI * 0.8), mainMat);
      visor.position.set(0, 0.11, 0.16);
      visor.rotation.x = 0.15;
      group.add(dome, visor);
    } else if (hatType === 'bunny') {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.295, 0.03, 8, 20), mainMat);
      band.rotation.x = Math.PI / 2;
      band.position.y = 0.15;
      group.add(band);
      [-0.12, 0.12].forEach(ex => {
        const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.34, 8), mainMat);
        ear.position.set(ex, 0.38, 0);
        ear.rotation.z = ex < 0 ? 0.15 : -0.15;
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.24, 8), LS.makeToonMat(0xffafcc));
        inner.position.set(ex, 0.38, 0.025);
        inner.rotation.z = ex < 0 ? 0.15 : -0.15;
        group.add(ear, inner);
      });
    } else if (hatType === 'panda') {
      const hood = new THREE.Mesh(new THREE.SphereGeometry(0.312, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mainMat);
      hood.position.set(0, 0.05, 0);
      group.add(hood);
      [-0.22, 0.22].forEach(ex => {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), LS.makeToonMat(0x1f2421));
        ear.position.set(ex, 0.31, 0);
        group.add(ear);
      });
    } else if (hatType === 'kanzashi') {
      // Traditional Kyoto blossom hairpin on side of head
      const flower = new THREE.Group();
      flower.position.set(0.27, 0.18, 0.08);
      flower.rotation.z = -0.35;
      const petalMat = LS.makeToonMat(hatColor || 0xffb3c6);
      const centerMat = LS.makeToonMat(0xffd166);
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), petalMat);
        p.position.set(Math.cos(ang) * 0.07, Math.sin(ang) * 0.07, 0);
        p.scale.set(1, 1, 0.45);
        flower.add(p);
      }
      const center = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), centerMat);
      flower.add(center);
      const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.025, 0.16, 6), LS.makeToonMat(0xd62828));
      tassel.position.set(0.04, -0.11, 0);
      flower.add(tassel);
      group.add(flower);
    } else if (hatType === 'foxmask') {
      // Cute festival kitsune mask worn perched on the side-top of the head!
      const maskG = new THREE.Group();
      maskG.position.set(-0.18, 0.25, 0.12);
      maskG.rotation.set(-0.35, -0.45, 0.35);
      const whiteMat = LS.makeToonMat(0xfffcf5);
      const redMat = LS.makeToonMat(0xd62828);
      const face = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), whiteMat);
      face.scale.set(1.0, 1.1, 0.45);
      maskG.add(face);
      [-0.08, 0.08].forEach(ex => {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.13, 5), whiteMat);
        ear.position.set(ex, 0.15, 0);
        const earIn = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 5), redMat);
        earIn.position.set(ex, 0.14, 0.025);
        maskG.add(ear, earIn);
      });
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.025, 0.02), redMat);
      mark.position.set(0, 0.02, 0.06);
      maskG.add(mark);
      group.add(maskG);
    } else if (hatType === 'crown') {
      // Gleaming golden royal circlet crown with turquoise centerpiece gem!
      const goldMat = new THREE.MeshStandardMaterial({ color: hatColor || 0xf6c945, roughness: 0.25, metalness: 0.55 });
      const gemMat = LS.makeEmissiveMat(0x22d3ee, 0x38bdf8, 0.75);
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.026, 8, 22), goldMat);
      band.rotation.x = Math.PI / 2;
      band.position.set(0, 0.20, 0);
      group.add(band);
      for (let i = -2; i <= 2; i++) {
        const ang = i * 0.42;
        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.032, i === 0 ? 0.14 : 0.095, 5), goldMat);
        spire.position.set(Math.sin(ang) * 0.275, 0.26 + (i === 0 ? 0.02 : 0), Math.cos(ang) * 0.275);
        group.add(spire);
      }
      const gem = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), gemMat);
      gem.position.set(0, 0.22, 0.30);
      group.add(gem);
    }
    return group;
  }

  // ---------------------------------------------------------------------------
  // Cached Sculpted Anatomical Geometries for Realistic HD People
  // ---------------------------------------------------------------------------
  const hdHumanGeos = {};

  function deformSculptedHead(geo, expand, fullerCheeks) {
    const pos = geo.attributes.position;
    const rx = (fullerCheeks ? 0.128 : 0.122) * expand;
    const ry = (fullerCheeks ? 0.143 : 0.146) * expand;
    const rz = 0.130 * expand;
    for (let i = 0; i < pos.count; i++) {
      const ux = pos.getX(i);
      const uy = pos.getY(i);
      const uz = pos.getZ(i);
      const jawT = Math.max(0, -uy);
      const jawNarrow = fullerCheeks ? 0.25 : 0.32;
      let xMul = 1.0 - jawNarrow * Math.pow(jawT, 1.35);
      let zMul = 1.0 + (uz > 0 ? 0.08 * Math.sin(jawT * Math.PI) : -0.18 * jawT);
      // Cheekbone contour (soft fuller lower cheeks for Salma)
      const cheek = Math.exp(-Math.pow((uy + (fullerCheeks ? 0.22 : 0.14)) / 0.26, 2)) * Math.max(0, uz) * Math.exp(-Math.pow((Math.abs(ux) - 0.56) / 0.32, 2));
      const cheekAmp = fullerCheeks ? 0.085 : 0.045;
      xMul += cheekAmp * cheek;
      zMul += cheekAmp * cheek;
      // Subtle temple flat
      const temple = Math.exp(-Math.pow((uy - 0.28) / 0.22, 2)) * Math.max(0, Math.abs(ux) - 0.65);
      xMul -= 0.05 * temple;
      // Full rounded occiput in back
      if (uz < -0.15 && uy > -0.15) {
        zMul += 0.065 * Math.min(1, (-uz - 0.15) * 1.4);
      }
      pos.setXYZ(i, ux * rx * xMul, uy * ry, uz * rz * zMul);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function getHDHumanGeos() {
    if (hdHumanGeos.ready) return hdHumanGeos;

    // 1. Sculpted Head & High-Density Contour-Matched Face Overlay Patch
    hdHumanGeos.head = deformSculptedHead(new THREE.SphereGeometry(1.0, 28, 22), 1.0, false);
    const facePatch = new THREE.SphereGeometry(1.0, 28, 22, -Math.PI * 0.31, Math.PI * 0.62, Math.PI * 0.24, Math.PI * 0.52);
    facePatch.rotateY(Math.PI / 2);
    hdHumanGeos.facePatch = deformSculptedHead(facePatch, 1.016, false);

    // Fuller, sweeter 5-year-old cheek silhouette for Salma's portrait face!
    hdHumanGeos.headSalma = deformSculptedHead(new THREE.SphereGeometry(1.0, 28, 22), 1.0, true);
    const facePatchSalma = new THREE.SphereGeometry(1.0, 28, 22, -Math.PI * 0.31, Math.PI * 0.62, Math.PI * 0.24, Math.PI * 0.52);
    facePatchSalma.rotateY(Math.PI / 2);
    hdHumanGeos.facePatchSalma = deformSculptedHead(facePatchSalma, 1.016, true);

    // Sculpted Hair Crown Cap (sits cleanly HIGH on forehead above eyebrows, covers back skull down to nape)
    const hairCap = new THREE.SphereGeometry(1.0, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.44);
    hdHumanGeos.hairCap = deformSculptedHead(hairCap, 1.072, false);

    // Smooth Silky Flowing Long Back Hair Curtain (gentle natural wave, zero corded tube rings!)
    const longCurtain = new THREE.CylinderGeometry(0.118, 0.148, 0.36, 28, 10, true, Math.PI * 0.60, Math.PI * 0.80);
    const lcPos = longCurtain.attributes.position;
    for (let i = 0; i < lcPos.count; i++) {
      const vx = lcPos.getX(i), vy = lcPos.getY(i), vz = lcPos.getZ(i);
      const t = (0.18 - vy) / 0.36; // 0 at top crown, 1 at bottom tips
      const wave = Math.sin(t * Math.PI * 1.4) * 0.014;
      const spreadX = 1.04 + t * 0.12;
      const pushBack = -0.025 - t * 0.024 + wave;
      lcPos.setXYZ(i, vx * spreadX, vy, vz * 0.92 + pushBack);
    }
    longCurtain.computeVertexNormals();
    hdHumanGeos.longHairCurtain = longCurtain;

    // Smooth Tapered Pigtail Teardrop Curl (silky smooth, zero tube rings!)
    hdHumanGeos.pigtailCurl = new THREE.LatheGeometry([
      new THREE.Vector2(0.004, -0.155),
      new THREE.Vector2(0.024, -0.125),
      new THREE.Vector2(0.044, -0.075),
      new THREE.Vector2(0.038, -0.028),
      new THREE.Vector2(0.020, 0.005),
      new THREE.Vector2(0.005, 0.015)
    ], 16);

    // Smooth Continuous S-Wavy Flowing Side Hair Lock for Salma (silky wavy ribbons, zero beaded spheres!)
    const waveGeo = new THREE.CylinderGeometry(0.034, 0.010, 0.34, 16, 18, false);
    const wPos = waveGeo.attributes.position;
    for (let i = 0; i < wPos.count; i++) {
      const vx = wPos.getX(i), vy = wPos.getY(i), vz = wPos.getZ(i);
      const t = (0.17 - vy) / 0.34; // 0 at top temple, 1 at flowing wavy tips
      const widthEnv = Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.85) * 0.45 + 0.72;
      const waveX = Math.sin(t * Math.PI * 2.35) * 0.022 * (0.25 + 0.75 * t);
      const waveZ = t * 0.055 + Math.cos(t * Math.PI * 2.0) * 0.014 * t;
      wPos.setXYZ(i, vx * widthEnv * 1.25 + waveX, vy, vz * widthEnv * 0.72 + waveZ);
    }
    waveGeo.computeVertexNormals();
    hdHumanGeos.salmaWaveLock = waveGeo;

    // 2. Anatomical Torso (Lathe sculpted into elliptical ribcage / tapered waist / hips / sloped shoulders)
    const torsoPts = [
      new THREE.Vector2(0.01, 0.00),
      new THREE.Vector2(0.142, 0.02),
      new THREE.Vector2(0.152, 0.09), // hips
      new THREE.Vector2(0.130, 0.21), // tapered waist
      new THREE.Vector2(0.146, 0.34), // lower ribs
      new THREE.Vector2(0.164, 0.45), // upper chest
      new THREE.Vector2(0.172, 0.52), // smooth natural shoulders
      new THREE.Vector2(0.110, 0.568), // trapezius slope
      new THREE.Vector2(0.054, 0.585)  // neck base
    ];
    const torsoGeo = new THREE.LatheGeometry(torsoPts, 24);
    const tPos = torsoGeo.attributes.position;
    for (let i = 0; i < tPos.count; i++) {
      const vx = tPos.getX(i), vy = tPos.getY(i), vz = tPos.getZ(i);
      // Human torso is wider side-to-side than front-to-back, with gentle chest curve in front
      let zScale = 0.64;
      if (vy > 0.30 && vy < 0.52 && vz > 0) zScale = 0.72;
      tPos.setXYZ(i, vx * 1.0, vy, vz * zScale);
    }
    torsoGeo.computeVertexNormals();
    hdHumanGeos.torso = torsoGeo;

    // 3. Pleated Flared Skirt (16 crisp radial pleats!)
    const skirtGeo = new THREE.CylinderGeometry(0.140, 0.245, 0.34, 48, 6, false);
    const sPos = skirtGeo.attributes.position;
    for (let i = 0; i < sPos.count; i++) {
      const vx = sPos.getX(i), vy = sPos.getY(i), vz = sPos.getZ(i);
      const ang = Math.atan2(vz, vx);
      const r = Math.hypot(vx, vz);
      const bottomW = Math.max(0, (0.17 - vy) / 0.34);
      const pleat = 1.0 + 0.048 * Math.sin(ang * 16) * (0.25 + 0.75 * bottomW);
      const zEll = 0.76 + 0.16 * bottomW;
      sPos.setXYZ(i, Math.cos(ang) * r * pleat, vy, Math.sin(ang) * r * pleat * zEll);
    }
    skirtGeo.computeVertexNormals();
    hdHumanGeos.skirt = skirtGeo;

    // 4. Anatomical Thigh (y = 0 at hip down to -0.38 at knee)
    hdHumanGeos.thigh = new THREE.LatheGeometry([
      new THREE.Vector2(0.046, -0.38),
      new THREE.Vector2(0.052, -0.28),
      new THREE.Vector2(0.062, -0.14),
      new THREE.Vector2(0.070, -0.02),
      new THREE.Vector2(0.056, 0.03)
    ], 16);

    // 5. Anatomical Calf / Shin (y = 0 at knee down to -0.365 at ankle)
    hdHumanGeos.calf = new THREE.LatheGeometry([
      new THREE.Vector2(0.034, -0.365),
      new THREE.Vector2(0.038, -0.27),
      new THREE.Vector2(0.051, -0.13), // calf muscle swell
      new THREE.Vector2(0.049, -0.05),
      new THREE.Vector2(0.044, 0.02)
    ], 16);

    // 6. Fitted Lower-Leg Sock (hugging shin cleanly)
    hdHumanGeos.sock = new THREE.LatheGeometry([
      new THREE.Vector2(0.037, -0.362),
      new THREE.Vector2(0.041, -0.27),
      new THREE.Vector2(0.048, -0.18)
    ], 14);

    // 7. Tailored Trouser Lower Leg (slight realistic drape to cuffed ankle)
    hdHumanGeos.pantCalf = new THREE.LatheGeometry([
      new THREE.Vector2(0.045, -0.355),
      new THREE.Vector2(0.050, -0.24),
      new THREE.Vector2(0.054, -0.11),
      new THREE.Vector2(0.050, 0.02)
    ], 16);

    // 8. Tapered Upper Arm (0 at shoulder down to -0.235 at elbow)
    hdHumanGeos.upperArm = new THREE.LatheGeometry([
      new THREE.Vector2(0.034, -0.235),
      new THREE.Vector2(0.039, -0.12),
      new THREE.Vector2(0.044, -0.02),
      new THREE.Vector2(0.036, 0.025)
    ], 14);

    // 9. Tapered Forearm (0 at elbow down to -0.22 at wrist)
    hdHumanGeos.forearm = new THREE.LatheGeometry([
      new THREE.Vector2(0.025, -0.22),
      new THREE.Vector2(0.031, -0.12),
      new THREE.Vector2(0.035, -0.02),
      new THREE.Vector2(0.031, 0.015)
    ], 14);

    // 10. Sleek Fitted Short Fabric Sleeve (blends smoothly into shoulder line — no boxy shoulder pads!)
    hdHumanGeos.sleeveShort = new THREE.LatheGeometry([
      new THREE.Vector2(0.045, -0.155),
      new THREE.Vector2(0.047, -0.075),
      new THREE.Vector2(0.049, -0.005),
      new THREE.Vector2(0.038, 0.032),
      new THREE.Vector2(0.005, 0.042)
    ], 14);

    // 11. Sleek Tailored Long Fabric Sleeve
    hdHumanGeos.sleeveLong = new THREE.LatheGeometry([
      new THREE.Vector2(0.041, -0.235),
      new THREE.Vector2(0.046, -0.11),
      new THREE.Vector2(0.049, -0.005),
      new THREE.Vector2(0.038, 0.032),
      new THREE.Vector2(0.005, 0.042)
    ], 14);

    hdHumanGeos.ready = true;
    return hdHumanGeos;
  }

  function buildRealisticHDCharacter(cfg) {
    const geos = getHDHumanGeos();
    const root = new THREE.Group();
    const s = cfg.scale || 1.0;

    const skinHex = cfg.skin || cfg.skinColor || 0xf4c4a2;
    const hairHex = cfg.hairColor !== undefined ? cfg.hairColor : 0x3b251b;
    const fabTex = LS.createFabricTexture ? LS.createFabricTexture() : null;
    const hairTex = LS.createHairTexture ? LS.createHairTexture() : null;

    // Luminous Miyazaki cel-anime skin so every NPC stays warm and bright without muddy chin shadows!
    const skinCol = new THREE.Color(skinHex);
    const sssTint = skinCol.clone().lerp(new THREE.Color(0xff7a5c), 0.28);
    const skinMat = (LS.ghibli && LS.ghibli.createGhibliSkinMat)
      ? LS.ghibli.createGhibliSkinMat(skinHex, null)
      : new THREE.MeshStandardMaterial({
          color: skinCol,
          emissive: sssTint,
          emissiveIntensity: 0.08,
          roughness: 0.56,
          metalness: 0.0
        });
    const hairMat = new THREE.MeshStandardMaterial({
      color: hairHex,
      map: hairTex,
      bumpMap: hairTex,
      bumpScale: 0.006,
      roughness: 0.42,
      metalness: 0.04,
      envMapIntensity: 0.18,
      side: THREE.DoubleSide
    });
    const topMat = new THREE.MeshStandardMaterial({
      color: cfg.topColor !== undefined ? cfg.topColor : 0xffffff,
      map: fabTex,
      bumpMap: fabTex,
      bumpScale: 0.018,
      roughness: 0.82,
      metalness: 0.02,
      envMapIntensity: 0.10
    });
    const bottomMat = new THREE.MeshStandardMaterial({
      color: cfg.bottomColor !== undefined ? cfg.bottomColor : 0x2d4373,
      map: fabTex,
      bumpMap: fabTex,
      bumpScale: 0.018,
      roughness: 0.84,
      metalness: 0.02,
      envMapIntensity: 0.10
    });
    const shoeMat = new THREE.MeshStandardMaterial({
      color: cfg.shoeColor !== undefined ? cfg.shoeColor : 0xd94c4c,
      roughness: 0.52,
      metalness: 0.05,
      envMapIntensity: 0.14
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0xf4f1ea,
      roughness: 0.72,
      metalness: 0.02,
      envMapIntensity: 0.10
    });
    const bpMat = new THREE.MeshStandardMaterial({
      color: cfg.backpackColor !== undefined ? cfg.backpackColor : 0xc92c3b,
      map: fabTex,
      bumpMap: fabTex,
      bumpScale: 0.022,
      roughness: 0.62,
      metalness: 0.04,
      envMapIntensity: 0.12
    });

    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    const hipY = 0.835;

    // 1. Articulated 2-Segment Anatomical Legs (Thigh -> Knee -> Shaped Calf -> Ribbed Sock -> Sculpted Sneaker)
    function makeRealisticLeg(sideX) {
      const leg = new THREE.Group();
      leg.position.set(sideX, hipY, 0);

      const thighMat = cfg.pants ? bottomMat : skinMat;
      const thigh = new THREE.Mesh(geos.thigh, thighMat);
      thigh.castShadow = true;
      thigh.receiveShadow = true;
      leg.add(thigh);

      const knee = new THREE.Group();
      knee.position.set(0, -0.375, 0);
      leg.add(knee);

      const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(cfg.pants ? 0.050 : 0.046, 12, 10), thighMat);
      knee.add(kneeCap);

      const calf = new THREE.Mesh(cfg.pants ? geos.pantCalf : geos.calf, thighMat);
      calf.castShadow = true;
      calf.receiveShadow = true;
      knee.add(calf);

      if (!cfg.pants) {
        const sockCol = cfg.sailorCollar ? 0x242c3d : 0xfaf8f5;
        const sockMat = new THREE.MeshStandardMaterial({ color: sockCol, map: fabTex, roughness: 0.85, metalness: 0.0 });
        const sock = new THREE.Mesh(geos.sock, sockMat);
        knee.add(sock);
        const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.047, 0.008, 8, 16), sockMat);
        cuff.rotation.x = Math.PI / 2;
        cuff.position.y = -0.18;
        knee.add(cuff);
      } else {
        const hem = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.007, 8, 16), bottomMat);
        hem.rotation.x = Math.PI / 2;
        hem.position.y = -0.352;
        knee.add(hem);
      }

      // Sculpted Sneaker / Shoe (outsole + rounded upper + toe cap + tongue!)
      const shoeG = new THREE.Group();
      shoeG.position.set(0, -0.388, 0.025);
      const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.050, 0.053, 0.024, 14), soleMat);
      sole.scale.set(0.92, 1.0, 1.92);
      sole.position.set(0, -0.046, 0.016);
      sole.castShadow = true;
      shoeG.add(sole);

      const upper = new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.56), shoeMat);
      upper.scale.set(0.90, 1.05, 1.85);
      upper.position.set(0, -0.036, 0.015);
      upper.castShadow = true;
      shoeG.add(upper);

      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.048, 0.042, 12), shoeMat);
      collar.position.set(0, -0.006, -0.022);
      shoeG.add(collar);

      const laces = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.012, 0.062), soleMat);
      laces.position.set(0, 0.006, 0.034);
      laces.rotation.x = 0.28;
      shoeG.add(laces);

      knee.add(shoeG);
      return { leg, knee };
    }

    const lLeg = makeRealisticLeg(-0.088);
    const rLeg = makeRealisticLeg(0.088);
    bodyPivot.add(lLeg.leg, rLeg.leg);

    // 2. Anatomical Torso, Pelvis, Collar, Skirt/Belt & Rounded Backpack with Straps
    const torso = new THREE.Mesh(geos.torso, topMat);
    torso.position.y = 0.805;
    torso.castShadow = true;
    torso.receiveShadow = true;
    bodyPivot.add(torso);

    // Natural Neck & Collarbone Transition
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.055, 0.145, 14), skinMat);
    neck.position.y = 1.415;
    neck.castShadow = true;
    bodyPivot.add(neck);

    // Crisp Woven Shirt Collar / Neckline Trim
    const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.012, 8, 18), topMat);
    collarRing.rotation.x = Math.PI / 2 + 0.14;
    collarRing.position.set(0, 1.372, 0.008);
    bodyPivot.add(collarRing);

    if (!cfg.pants) {
      // Realistic Pleated A-Line Skirt + Fitted Waistband
      const skirt = new THREE.Mesh(geos.skirt, bottomMat);
      skirt.position.y = 0.725;
      skirt.castShadow = true;
      skirt.receiveShadow = true;
      bodyPivot.add(skirt);
      const waistBand = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.148, 0.048, 22), bottomMat);
      waistBand.scale.set(1.0, 1.0, 0.78);
      waistBand.position.y = 0.892;
      bodyPivot.add(waistBand);
    } else {
      // Tailored Trouser Pelvis + Leather Belt & Brass Buckle
      const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.156, 18, 12), bottomMat);
      pelvis.scale.set(1.0, 0.72, 0.70);
      pelvis.position.y = 0.815;
      pelvis.castShadow = true;
      bodyPivot.add(pelvis);

      const beltMat = new THREE.MeshStandardMaterial({ color: 0x3a261a, roughness: 0.45, metalness: 0.12 });
      const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.148, 0.036, 20), beltMat);
      belt.scale.set(1.0, 1.0, 0.70);
      belt.position.y = 0.885;
      bodyPivot.add(belt);

      const buckle = new THREE.Mesh(
        new THREE.BoxGeometry(0.044, 0.040, 0.016),
        new THREE.MeshStandardMaterial({ color: 0xdcb45c, roughness: 0.30, metalness: 0.75 })
      );
      buckle.position.set(0, 0.885, 0.104);
      bodyPivot.add(buckle);
    }

    if (cfg.sailorCollar) {
      // Draped Sailor Collar with White Trim & Sculpted 3D Ribbon Bow
      const backFlap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.028), bottomMat);
      backFlap.position.set(0, 1.245, -0.105);
      backFlap.rotation.x = 0.14;
      bodyPivot.add(backFlap);
      const trimMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.75 });
      const backTrim = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.016, 0.032), trimMat);
      backTrim.position.set(0, 1.172, -0.109);
      bodyPivot.add(backTrim);

      const shoulderDrape = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.182, 0.11, 18), bottomMat);
      shoulderDrape.scale.set(1.02, 1.0, 0.68);
      shoulderDrape.position.y = 1.318;
      bodyPivot.add(shoulderDrape);

      const ribMat = new THREE.MeshStandardMaterial({ color: 0xd93848, map: fabTex, roughness: 0.65 });
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), ribMat);
      knot.position.set(0, 1.24, 0.116);
      bodyPivot.add(knot);
      [-1, 1].forEach(side => {
        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.12, 0.012), ribMat);
        tail.position.set(side * 0.024, 1.18, 0.114);
        tail.rotation.z = side * 0.18;
        bodyPivot.add(tail);
      });
    }

    if (cfg.backpackColor) {
      // Rounded Sculpted Backpack (Randoseru / Explorer Pack) + Shoulder Straps + Brass Clasp
      const packG = new THREE.Group();
      packG.position.set(0, 1.12, -0.155);
      const packBody = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.120, 0.30, 16), bpMat);
      packBody.scale.set(1.22, 1.0, 0.62);
      packBody.castShadow = true;
      packG.add(packBody);

      const packTop = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), bpMat);
      packTop.scale.set(1.22, 0.45, 0.62);
      packTop.position.y = 0.15;
      packG.add(packTop);

      const flap = new THREE.Mesh(new THREE.BoxGeometry(0.245, 0.19, 0.032), bpMat);
      flap.position.set(0, 0.04, -0.068);
      packG.add(flap);

      const clasp = new THREE.Mesh(
        new THREE.BoxGeometry(0.042, 0.044, 0.022),
        new THREE.MeshStandardMaterial({ color: 0xe9c46a, roughness: 0.28, metalness: 0.78 })
      );
      clasp.position.set(0, -0.055, -0.088);
      packG.add(clasp);

      // Curved shoulder straps wrapping neatly over both shoulders
      [-0.105, 0.105].forEach(sx => {
        const strapCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(sx, 0.16, -0.01),
          new THREE.Vector3(sx, 0.23, 0.11),
          new THREE.Vector3(sx, 0.10, 0.255),
          new THREE.Vector3(sx, -0.11, 0.22),
          new THREE.Vector3(sx, -0.12, 0.02)
        ]);
        const strap = new THREE.Mesh(new THREE.TubeGeometry(strapCurve, 14, 0.015, 6, false), bpMat);
        strap.scale.set(1.25, 1.0, 0.55);
        packG.add(strap);
      });
      bodyPivot.add(packG);
    }

    // 3. Articulated 2-Segment Arms (Deltoid Sleeve -> Upper Arm -> Elbow -> Forearm -> Sculpted Hand)
    const longSleeves = Boolean(cfg.pants && !cfg.sailorCollar);
    function makeRealisticArm(sideX) {
      const side = sideX < 0 ? -1 : 1;
      const arm = new THREE.Group();
      arm.position.set(sideX, 1.292, 0);
      arm.rotation.z = side * 0.055;

      const sleeve = new THREE.Mesh(longSleeves ? geos.sleeveLong : geos.sleeveShort, topMat);
      sleeve.castShadow = true;
      arm.add(sleeve);

      if (!longSleeves) {
        const upperArm = new THREE.Mesh(geos.upperArm, skinMat);
        upperArm.castShadow = true;
        arm.add(upperArm);
      }

      const elbow = new THREE.Group();
      elbow.position.set(0, -0.232, 0);
      arm.add(elbow);

      const elbowCap = new THREE.Mesh(new THREE.SphereGeometry(longSleeves ? 0.039 : 0.034, 10, 8), longSleeves ? topMat : skinMat);
      elbow.add(elbowCap);

      const forearm = new THREE.Mesh(geos.forearm, longSleeves ? topMat : skinMat);
      forearm.castShadow = true;
      elbow.add(forearm);

      if (longSleeves) {
        const wristCuff = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.006, 6, 12), topMat);
        wristCuff.rotation.x = Math.PI / 2;
        wristCuff.position.y = -0.21;
        elbow.add(wristCuff);
      }

      // Sculpted Human Hand (flattened palm + curved fingers block + opposable thumb!)
      const hand = new THREE.Group();
      hand.position.set(0, -0.228, 0.004);
      const palm = new THREE.Mesh(new THREE.SphereGeometry(0.031, 10, 8), skinMat);
      palm.scale.set(0.62, 1.15, 0.92);
      palm.position.y = -0.022;
      hand.add(palm);

      const fingers = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.016, 0.054, 10), skinMat);
      fingers.scale.set(0.55, 1.0, 1.12);
      fingers.position.set(0, -0.062, 0.006);
      fingers.rotation.x = -0.14;
      hand.add(fingers);

      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.036, 8), skinMat);
      thumb.position.set(-side * 0.012, -0.034, 0.025);
      thumb.rotation.set(0.45, 0, side * 0.25);
      hand.add(thumb);

      elbow.add(hand);
      return { arm, elbow };
    }

    const lArm = makeRealisticArm(-0.168);
    const rArm = makeRealisticArm(0.168);
    bodyPivot.add(lArm.arm, rArm.arm);

    // 4. Sculpted Anatomical Head + 1024px Portrait Face + 3D Nose/Ears/Glasses/Mustache + Layered Hair
    const isLailaPortrait = cfg.portraitStyle === 'laila';
    const isSalmaPortrait = cfg.portraitStyle === 'salma';
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.572;
    // Age-natural head-to-body ratio: 5yo Salma (1.16), 9yo Laila (1.08), adults/teens (0.98)
    const headRatio = isSalmaPortrait ? 1.16 : (isLailaPortrait ? 1.08 : (s < 0.75 ? 1.15 : (s < 0.88 ? 1.06 : 0.98)));
    headGroup.scale.setScalar(headRatio);
    bodyPivot.add(headGroup);

    const headMesh = new THREE.Mesh(isSalmaPortrait ? geos.headSalma : geos.head, skinMat);
    if (cfg.faceOpts && cfg.faceOpts.charismaticMale) {
      headMesh.scale.set(0.95, 1.05, 1.0);
    }
    if (cfg.bald) skinMat.roughness = 0.44;
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headGroup.add(headMesh);

    // Sculpted 3D Nose (delicate petite button nose for Laila & Salma; full contoured nose for adults)
    const isGirlP = isLailaPortrait || isSalmaPortrait;
    if (!isGirlP) {
      const noseBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0125, 0.042, 8), skinMat);
      noseBridge.scale.set(0.88, 1.0, 1.05);
      noseBridge.position.set(0, -0.010, 0.127);
      noseBridge.rotation.x = -0.24;
      headGroup.add(noseBridge);
    }
    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(isGirlP ? 0.0085 : 0.013, 10, 8), skinMat);
    noseTip.scale.set(1.12, 0.78, 0.85);
    noseTip.position.set(0, -0.025, isGirlP ? 0.132 : 0.137);
    headGroup.add(noseTip);
    if (!isGirlP) {
      [-1, 1].forEach(side => {
        const ala = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), skinMat);
        ala.scale.set(0.9, 0.72, 0.9);
        ala.position.set(side * 0.0105, -0.027, 0.129);
        headGroup.add(ala);
      });
    }

    // Sculpted 3D Ears (curved outer helix + recessed concha + Laila's tiny gold stud earrings!)
    const earInnerMat = new THREE.MeshStandardMaterial({
      color: skinCol.clone().multiplyScalar(0.82),
      emissive: sssTint,
      emissiveIntensity: 0.12,
      roughness: 0.65
    });
    const studMat = isLailaPortrait
      ? new THREE.MeshStandardMaterial({ color: 0xf4cf64, roughness: 0.22, metalness: 0.86 })
      : null;
    [-1, 1].forEach(side => {
      const earG = new THREE.Group();
      earG.position.set(side * (isSalmaPortrait ? 0.122 : 0.118), -0.014, -0.012);
      earG.rotation.y = side * 0.22;
      const helix = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), skinMat);
      helix.scale.set(0.36, 1.15, 0.72);
      earG.add(helix);
      const concha = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), earInnerMat);
      concha.scale.set(0.28, 0.92, 0.55);
      concha.position.set(side * 0.003, -0.002, 0.004);
      earG.add(concha);
      if (studMat) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.0052, 8, 6), studMat);
        stud.position.set(side * 0.005, -0.023, 0.005);
        earG.add(stud);
      }
      headGroup.add(earG);
    });

    // Crisp 1024px Portrait Face Texture mapped onto high-density contour-matched front patch
    // Using MeshBasicMaterial eliminates milky specular glare over dark irises, lashes & brows while headMesh underneath keeps full 3D lighting!
    const faceBaseOpts = Object.assign({ skinHex, hairHex }, cfg.faceOpts || {});
    const openFaceTex = LS.createRealisticFaceTexture(faceBaseOpts);
    const blinkFaceTex = LS.createRealisticFaceTexture(Object.assign({}, faceBaseOpts, { blink: true }));
    const happyFaceTex = LS.createRealisticFaceTexture(Object.assign({}, faceBaseOpts, { happy: true }));

    const faceMat = new THREE.MeshBasicMaterial({
      map: openFaceTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2
    });
    const facePlane = new THREE.Mesh(isSalmaPortrait ? geos.facePatchSalma : geos.facePatch, faceMat);
    headGroup.add(facePlane);

    // Optional 3D Metallic-Frame Glasses
    if (cfg.faceOpts && cfg.faceOpts.glasses) {
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b211c, roughness: 0.30, metalness: 0.65 });
      const lensMat = new THREE.MeshStandardMaterial({ color: 0xdff2ff, transparent: true, opacity: 0.22, roughness: 0.08, metalness: 0.2 });
      const glassG = new THREE.Group();
      glassG.position.set(0, 0.002, 0.128);
      [-0.041, 0.041].forEach(gx => {
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.0030, 8, 20), frameMat);
        rim.position.x = gx;
        glassG.add(rim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.024, 18), lensMat);
        lens.position.set(gx, 0, -0.001);
        glassG.add(lens);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.135, 6), frameMat);
        arm.rotation.x = Math.PI / 2;
        arm.position.set(gx + (gx < 0 ? -0.025 : 0.025), 0.002, -0.068);
        glassG.add(arm);
      });
      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.032, 6), frameMat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, 0.005, 0.002);
      glassG.add(bridge);
      headGroup.add(glassG);
    }

    // Optional Sculpted 3D Mustache
    if (cfg.faceOpts && cfg.faceOpts.mustache) {
      const mustMat = new THREE.MeshStandardMaterial({
        color: (cfg.faceOpts.elder) ? 0xb4b6ba : hairHex,
        map: hairTex,
        roughness: 0.55
      });
      [-1, 1].forEach(side => {
        const wingCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.044, 0.131),
          new THREE.Vector3(side * 0.018, -0.045, 0.128),
          new THREE.Vector3(side * 0.036, -0.052, 0.116)
        ]);
        const wing = new THREE.Mesh(new THREE.TubeGeometry(wingCurve, 8, 0.008, 6, false), mustMat);
        wing.scale.set(1.0, 0.72, 0.65);
        headGroup.add(wing);
      });
    }

    // Optional Sleek Close-Trimmed 3D Chin Goatee (Thierry Henry / Dave Chappelle silhouette from side angles!)
    if (cfg.faceOpts && cfg.faceOpts.goatee) {
      const gMat = new THREE.MeshStandardMaterial({
        color: 0x171210,
        roughness: 0.72
      });
      const chinGoatee = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 8), gMat);
      chinGoatee.scale.set(0.95, 0.68, 0.45);
      chinGoatee.position.set(0, -0.098, 0.112);
      headGroup.add(chinGoatee);
    }

    // 5. Silky Natural Layered 3D Hair (skipped cleanly when cfg.bald is true!)
    let signatureBand = null;
    if (!cfg.bald) {
      const hairCap = new THREE.Mesh(geos.hairCap, hairMat);
      hairCap.position.set(0, 0.018, -0.014);
      hairCap.rotation.x = isGirlP ? -0.36 : -0.34;
      hairCap.castShadow = true;
      headGroup.add(hairCap);
    }

    if (cfg.bald) {
      // Smooth bald head — no bangs or back hair!
    } else if (isLailaPortrait) {
      // LAILA PORTRAIT HAIR: Open center-part sweeping cleanly behind both ears + woven side braid + cream tied-bow headband!
      [-1, 1].forEach(side => {
        const partSweep = new THREE.Mesh(new THREE.SphereGeometry(0.064, 14, 10), hairMat);
        partSweep.scale.set(1.05, 0.44, 0.56);
        partSweep.position.set(side * 0.062, 0.092, 0.082);
        partSweep.rotation.set(0.24, side * 0.36, -side * 0.44);
        headGroup.add(partSweep);

        const temple = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 8), hairMat);
        temple.scale.set(0.55, 1.55, 0.92);
        temple.position.set(side * 0.114, 0.042, 0.030);
        temple.rotation.z = side * 0.14;
        headGroup.add(temple);
      });

      // Smooth rounded nape gathered cleanly toward Laila's right side braid
      const nape = new THREE.Mesh(new THREE.SphereGeometry(0.124, 18, 12), hairMat);
      nape.scale.set(1.04, 0.86, 0.76);
      nape.position.set(-0.012, -0.020, -0.064);
      headGroup.add(nape);

      // Sculpted Woven 3D Side Braid draping gracefully over Laila's right shoulder (-X, left side when looking at her face!)
      const braidG = new THREE.Group();
      const braidPts = [
        [-0.095, -0.040, -0.055],
        [-0.118, -0.085, -0.012],
        [-0.126, -0.135, 0.036],
        [-0.122, -0.185, 0.072],
        [-0.114, -0.235, 0.092],
        [-0.108, -0.285, 0.100],
        [-0.104, -0.332, 0.102]
      ];
      braidPts.forEach((p, idx) => {
        const taper = 1.0 - idx * 0.065;
        [-1, 1].forEach(bSide => {
          const plait = new THREE.Mesh(new THREE.SphereGeometry(0.025 * taper, 10, 8), hairMat);
          plait.scale.set(0.86, 1.28, 0.74);
          plait.position.set(p[0] + bSide * 0.011 * taper, p[1] - (bSide > 0 ? 0.014 : 0), p[2] + (bSide > 0 ? 0.005 : -0.004));
          plait.rotation.z = bSide * 0.42;
          plait.castShadow = true;
          braidG.add(plait);
        });
      });
      // Dark hair elastic & tapered silky braid tassel tip
      const braidTie = new THREE.Mesh(
        new THREE.TorusGeometry(0.018, 0.005, 6, 12),
        new THREE.MeshStandardMaterial({ color: 0x1b1514, roughness: 0.75 })
      );
      braidTie.rotation.x = Math.PI / 2;
      braidTie.position.set(-0.104, -0.354, 0.102);
      braidG.add(braidTie);
      const tassel = new THREE.Mesh(geos.pigtailCurl, hairMat);
      tassel.scale.set(0.62, 0.62, 0.62);
      tassel.position.set(-0.104, -0.355, 0.102);
      braidG.add(tassel);
      headGroup.add(braidG);

      // Laila's Signature Cream Tied-Bow Headband (auto-hides if wearing a full cap/beret!)
      signatureBand = new THREE.Group();
      const creamMat = new THREE.MeshStandardMaterial({ color: 0xf4e6ce, map: fabTex, roughness: 0.72, metalness: 0.02 });
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.130, 0.014, 10, 28, Math.PI * 1.12), creamMat);
      arch.rotation.set(-0.20, 0, -Math.PI * 0.06);
      arch.position.set(0, 0.022, 0.012);
      signatureBand.add(arch);

      // Cute sculpted knotted bow right at the top of the headband!
      const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), creamMat);
      bowKnot.scale.set(1.0, 0.85, 0.9);
      bowKnot.position.set(0, 0.156, 0.036);
      signatureBand.add(bowKnot);
      [-1, 1].forEach(side => {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 8), creamMat);
        ear.scale.set(1.45, 0.56, 0.42);
        ear.position.set(side * 0.044, 0.160, 0.034);
        ear.rotation.set(0.12, -side * 0.18, side * 0.16);
        signatureBand.add(ear);
      });
      headGroup.add(signatureBand);
    } else if (isSalmaPortrait) {
      // SALMA PORTRAIT HAIR: Open center-part + lush cascading wavy dark chocolate-brown hair + sparkly blush-pink headband!
      [-1, 1].forEach(side => {
        const partSweep = new THREE.Mesh(new THREE.SphereGeometry(0.066, 14, 10), hairMat);
        partSweep.scale.set(1.08, 0.46, 0.58);
        partSweep.position.set(side * 0.064, 0.092, 0.084);
        partSweep.rotation.set(0.22, side * 0.34, -side * 0.42);
        headGroup.add(partSweep);

        const temple = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 8), hairMat);
        temple.scale.set(0.58, 1.65, 0.94);
        temple.position.set(side * 0.120, 0.036, 0.032);
        temple.rotation.z = side * 0.12;
        headGroup.add(temple);
      });

      const napeFill = new THREE.Mesh(new THREE.SphereGeometry(0.128, 18, 12), hairMat);
      napeFill.scale.set(1.08, 0.86, 0.76);
      napeFill.position.set(0, -0.018, -0.062);
      headGroup.add(napeFill);

      // Full silky wavy back hair curtain
      const curtain = new THREE.Mesh(geos.longHairCurtain, hairMat);
      curtain.scale.set(1.08, 0.96, 1.04);
      curtain.position.set(0, -0.122, -0.014);
      curtain.castShadow = true;
      headGroup.add(curtain);

      // Lush continuous silky S-wavy dark-brown hair locks draping smoothly over both shoulders (just like Salma's portrait!)
      [-1, 1].forEach(side => {
        const frontWave = new THREE.Mesh(geos.salmaWaveLock, hairMat);
        frontWave.scale.set(side * 1.10, 1.04, 1.05);
        frontWave.position.set(side * 0.128, -0.140, 0.014);
        frontWave.rotation.set(0.06, -side * 0.18, side * 0.10);
        frontWave.castShadow = true;
        headGroup.add(frontWave);

        const outerWave = new THREE.Mesh(geos.salmaWaveLock, hairMat);
        outerWave.scale.set(side * 1.24, 1.12, 1.12);
        outerWave.position.set(side * 0.142, -0.155, -0.036);
        outerWave.rotation.set(0.04, -side * 0.36, side * 0.18);
        outerWave.castShadow = true;
        headGroup.add(outerWave);
      });

      // Salma's Signature Sparkly Blush-Pink Headband (visible whenever not wearing a full-dome hat!)
      signatureBand = new THREE.Group();
      const pinkBandMat = new THREE.MeshStandardMaterial({
        color: 0xe4a2b2,
        emissive: new THREE.Color(0x522634),
        emissiveIntensity: 0.14,
        roughness: 0.28,
        metalness: 0.35
      });
      const pinkArch = new THREE.Mesh(new THREE.TorusGeometry(0.134, 0.013, 10, 28, Math.PI * 1.12), pinkBandMat);
      pinkArch.rotation.set(-0.22, 0, -Math.PI * 0.06);
      pinkArch.position.set(0, 0.020, 0.012);
      signatureBand.add(pinkArch);
      headGroup.add(signatureBand);
    } else {
      // Smooth Side-Parted Swept Forehead Fringe for Town NPCs
      const leftSweep = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 10), hairMat);
      leftSweep.scale.set(1.08, 0.42, 0.48);
      leftSweep.position.set(-0.044, 0.088, 0.090);
      leftSweep.rotation.set(0.22, -0.20, 0.22);
      headGroup.add(leftSweep);

      const rightSweep = new THREE.Mesh(new THREE.SphereGeometry(0.066, 14, 10), hairMat);
      rightSweep.scale.set(1.16, 0.42, 0.48);
      rightSweep.position.set(0.038, 0.090, 0.094);
      rightSweep.rotation.set(0.22, 0.18, -0.18);
      headGroup.add(rightSweep);

      [-1, 1].forEach(side => {
        const templeLock = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 8), hairMat);
        templeLock.scale.set(0.55, 1.65, 0.85);
        templeLock.position.set(side * 0.116, 0.038, 0.036);
        templeLock.rotation.z = side * 0.12;
        headGroup.add(templeLock);
      });

      if (cfg.longHair) {
        const napeFill = new THREE.Mesh(new THREE.SphereGeometry(0.124, 18, 12), hairMat);
        napeFill.scale.set(1.04, 0.82, 0.72);
        napeFill.position.set(0, -0.016, -0.064);
        headGroup.add(napeFill);

        const curtain = new THREE.Mesh(geos.longHairCurtain, hairMat);
        curtain.position.set(0, -0.125, -0.014);
        curtain.castShadow = true;
        headGroup.add(curtain);

        [-1, 1].forEach(side => {
          const sLock = new THREE.Mesh(geos.pigtailCurl, hairMat);
          sLock.scale.set(0.58, 1.38, 0.72);
          sLock.position.set(side * 0.118, 0.012, 0.012);
          sLock.rotation.z = side * 0.06;
          headGroup.add(sLock);
        });
      } else if (cfg.pigtails) {
        const nape = new THREE.Mesh(new THREE.SphereGeometry(0.120, 16, 10), hairMat);
        nape.scale.set(1.02, 0.78, 0.68);
        nape.position.set(0, -0.028, -0.066);
        headGroup.add(nape);

        const tieMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, map: fabTex, roughness: 0.68 });
        [-1, 1].forEach(side => {
          const tie = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.009, 8, 14), tieMat);
          tie.position.set(side * 0.124, -0.008, -0.038);
          tie.rotation.y = side * 0.65;
          headGroup.add(tie);

          const curl = new THREE.Mesh(geos.pigtailCurl, hairMat);
          curl.position.set(side * 0.130, -0.008, -0.042);
          curl.rotation.set(0.08, 0, side * 0.26);
          curl.castShadow = true;
          headGroup.add(curl);
        });
      } else if (cfg.hairBun) {
        const nape = new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 10), hairMat);
        nape.scale.set(1.0, 0.78, 0.68);
        nape.position.set(0, -0.024, -0.066);
        headGroup.add(nape);

        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 12), hairMat);
        bun.scale.set(1.08, 0.92, 0.92);
        bun.position.set(0, 0.088, -0.132);
        bun.castShadow = true;
        headGroup.add(bun);

        const bunTie = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.008, 8, 16), new THREE.MeshStandardMaterial({ color: 0xd94848, roughness: 0.65 }));
        bunTie.position.set(0, 0.080, -0.106);
        bunTie.rotation.x = 0.45;
        headGroup.add(bunTie);
      } else {
        const nape = new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 10), hairMat);
        nape.scale.set(0.98, 0.76, 0.66);
        nape.position.set(0, -0.022, -0.064);
        headGroup.add(nape);

        [-1, 1].forEach(side => {
          const sb = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.048, 0.022), hairMat);
          sb.position.set(side * 0.114, 0.002, 0.020);
          headGroup.add(sb);
        });
      }
    }

    if (cfg.headband) {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.128, 0.015, 8, 22),
        new THREE.MeshStandardMaterial({ color: 0xf5f5f5, map: fabTex, roughness: 0.78 })
      );
      band.scale.set(1.02, 1.08, 0.95);
      band.rotation.x = Math.PI / 2 - 0.16;
      band.position.set(0, 0.072, 0.004);
      headGroup.add(band);
    }

    // Snugly Fitted Hat Slot for Realistic HD Head Proportions
    const hatSlot = new THREE.Group();
    hatSlot.position.set(0, 0.056, -0.006);
    hatSlot.scale.set(0.45, 0.45, 0.46);
    if (cfg.hatType && cfg.hatType !== 'none') {
      hatSlot.add(buildHatMeshes(cfg.hatType, cfg.hatColor));
    }
    headGroup.add(hatSlot);

    // Soft grounded ambient-occlusion contact shadow disc beneath feet!
    if (LS.createContactShadowTexture) {
      const shadowDisc = new THREE.Mesh(
        new THREE.PlaneGeometry(0.86, 0.86),
        new THREE.MeshBasicMaterial({ map: LS.createContactShadowTexture(), transparent: true, depthWrite: false })
      );
      shadowDisc.rotation.x = -Math.PI / 2;
      shadowDisc.position.y = 0.024;
      shadowDisc.userData.noOutline = true;
      shadowDisc.userData.noCamClip = true;
      root.add(shadowDisc);
    }

    // Optional White Doctor's Coat & 3D Stethoscope (for Mostafa!)
    if (cfg.athletic) {
      torso.scale.x = 1.08;
    }
    if (cfg.doctorCoat) {
      const coatMat = LS.makeToonMat(0xfcfdff);
      const pocketMat = LS.makeToonMat(0xeef2f6);
      const shirtMat = LS.makeToonMat(0x1e293b);
      // Crisp dark navy inner shirt peeking cleanly behind open white coat lapels!
      const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.34, 0.03), shirtMat);
      innerShirt.position.set(0, 1.21, 0.104);
      bodyPivot.add(innerShirt);
      // Long white coat flaps draping smoothly down past the hips
      [-1, 1].forEach(side => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.44, 0.19), coatMat);
        panel.position.set(side * 0.088, 0.86, 0.01);
        panel.castShadow = true;
        bodyPivot.add(panel);
        const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.22, 0.03), coatMat);
        lapel.position.set(side * 0.068, 1.24, 0.112);
        lapel.rotation.z = side * 0.22;
        bodyPivot.add(lapel);
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.09, 0.025), pocketMat);
        pocket.position.set(side * 0.095, 0.96, 0.11);
        bodyPivot.add(pocket);
      });
      const coatBack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.46, 0.06), coatMat);
      coatBack.position.set(0, 0.86, -0.095);
      coatBack.castShadow = true;
      bodyPivot.add(coatBack);
    }

    if (cfg.stethoscope) {
      const tubeMat = LS.makeToonMat(0x1f2937);
      const chromeMat = LS.makeToonMat(0xdbe4ee);
      // Black rubber tubing draped cleanly around the neck & shoulders
      const neckLoop = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.011, 7, 18, Math.PI * 1.25), tubeMat);
      neckLoop.rotation.set(Math.PI / 2 - 0.35, 0, Math.PI * 0.88);
      neckLoop.position.set(0, 1.38, 0.015);
      bodyPivot.add(neckLoop);
      // Left & right hanging tubes over chest
      [-0.082, 0.082].forEach((sx, si) => {
        const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.28, 7), tubeMat);
        drop.position.set(sx, 1.21, 0.118);
        drop.rotation.z = si === 0 ? -0.10 : 0.10;
        bodyPivot.add(drop);
      });
      // Metallic silver chestpiece (diaphragm) + ear tip accents!
      const chestPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.016, 12), chromeMat);
      chestPiece.rotation.x = Math.PI / 2;
      chestPiece.position.set(0.072, 1.07, 0.125);
      bodyPivot.add(chestPiece);
      const earTip = new THREE.Mesh(new THREE.SphereGeometry(0.015, 7, 6), chromeMat);
      earTip.position.set(-0.072, 1.07, 0.125);
      bodyPivot.add(earTip);
    }

    if (cfg.slim) {
      bodyPivot.scale.set(0.84, 1.04, 0.86);
    }

    root.scale.setScalar(s);

    return {
      root,
      bodyPivot,
      headGroup,
      leftLeg: lLeg.leg,
      rightLeg: rLeg.leg,
      leftKnee: lLeg.knee,
      rightKnee: rLeg.knee,
      leftArm: lArm.arm,
      rightArm: rArm.arm,
      leftElbow: lArm.elbow,
      rightElbow: rArm.elbow,
      topMat,
      bottomMat,
      shoeMat,
      bpMat,
      hatSlot,
      signatureBand,
      faceMat,
      openFaceTex,
      blinkFaceTex,
      happyFaceTex,
      blinkTimer: 2 + Math.random() * 3,
      isBlinking: false
    };
  }

  // =========================================================================
  // NEXT-GEN STUDIO GHIBLI PHOTO-MATCHED SISTERS (LAILA & SALMA)
  // Full articulation (knees/elbows), Wardrobe outfit support, photo faces & exact hairstyles!
  // =========================================================================
  let cachedGlitterPinkTex = null;
  function getGlitterHeadbandTex() {
    if (cachedGlitterPinkTex) return cachedGlitterPinkTex;
    const c = document.createElement('canvas'); c.width = 256; c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, '#e39cb4'); g.addColorStop(0.5, '#f4bdd0'); g.addColorStop(1, '#e39cb4');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 420; i++) {
      const x = (Math.sin(i * 19.7) * 0.5 + 0.5) * 256;
      const y = (Math.cos(i * 31.3) * 0.5 + 0.5) * 64;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255,255,255,0.92)' : (i % 3 === 1 ? 'rgba(255,232,210,0.82)' : 'rgba(225,130,165,0.65)');
      ctx.fillRect(x, y, i % 5 === 0 ? 3 : 2, i % 5 === 0 ? 3 : 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    cachedGlitterPinkTex = tex;
    return tex;
  }

  let cachedNeutralPleatTex = null;
  function getNeutralPleatTex() {
    if (cachedNeutralPleatTex) return cachedNeutralPleatTex;
    const c = document.createElement('canvas'); c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 16; i++) {
      const x = i * 32;
      const g = ctx.createLinearGradient(x, 0, x + 32, 0);
      g.addColorStop(0.0, '#c8c8d4');
      g.addColorStop(0.32, '#ffffff');
      g.addColorStop(0.74, '#ffffff');
      g.addColorStop(1.0, '#c8c8d4');
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, 32, 256);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.fillRect(0, 214, 512, 10);
    ctx.fillRect(0, 232, 512, 5);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    cachedNeutralPleatTex = tex;
    return tex;
  }

  function createPaintedSisterHairTex(baseHex, midHex, hiHex) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.0, baseHex); g.addColorStop(0.32, midHex);
    g.addColorStop(0.55, hiHex); g.addColorStop(0.82, midHex); g.addColorStop(1.0, baseHex);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 90; i++) {
      const x = (i / 90) * 256 + Math.sin(i * 1.9) * 3;
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(255,228,200,0.16)' : (i % 3 === 1 ? 'rgba(25,12,8,0.22)' : 'rgba(180,115,82,0.14)');
      ctx.lineWidth = 1.2 + (i % 3) * 0.8;
      ctx.beginPath(); ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + Math.sin(i) * 5, 85, x - Math.cos(i) * 5, 170, x, 256);
      ctx.stroke();
    }
    const hg = ctx.createLinearGradient(0, 70, 0, 105);
    hg.addColorStop(0, 'rgba(255,235,215,0)');
    hg.addColorStop(0.5, 'rgba(255,235,215,0.26)');
    hg.addColorStop(1, 'rgba(255,235,215,0)');
    ctx.fillStyle = hg; ctx.fillRect(0, 70, 256, 35);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function createPhotoHeadGeo(radius, planarFront) {
    const geo = new THREE.SphereGeometry(radius, 36, 28);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const nx = x / radius, ny = y / radius, nz = z / radius;
      if (ny < 0) {
        const t = Math.min(1, -ny);
        z *= (1.0 - 0.19 * Math.pow(t, 1.55));
        x *= (1.0 - 0.07 * Math.pow(t, 1.6));
        if (nx > 0.15) x += 0.020 * radius * Math.exp(-Math.pow((ny + 0.72) / 0.26, 2)) * nx;
      }
      if (nx > 0.30 && ny > -0.35 && ny < 0.45) {
        const f = Math.max(0, (nx - 0.30) / 0.70) * (1.0 - Math.abs(ny - 0.05) / 0.55);
        x -= radius * 0.032 * Math.max(0, f);
      }
      const cheek = Math.exp(-Math.pow((ny + 0.24) / 0.26, 2)) * Math.exp(-Math.pow((Math.abs(nz) - 0.62) / 0.30, 2));
      z *= (1.0 + 0.048 * cheek);
      pos.setXYZ(i, x, y, z);

      if (planarFront) {
        const spanX = radius * 1.82;
        const spanY = radius * 1.88;
        const u = Math.max(0.01, Math.min(0.99, 0.5 - z / spanX));
        const v = Math.max(0.01, Math.min(0.99, 0.5 + (y + radius * 0.085) / spanY));
        uv.setXY(i, u, v);
      }
    }
    if (planarFront && geo.index) {
      const oldIdx = geo.index.array;
      const frontIdx = [], backIdx = [];
      for (let k = 0; k < oldIdx.length; k += 3) {
        const a = oldIdx[k], b = oldIdx[k + 1], c = oldIdx[k + 2];
        if (pos.getX(a) > radius * 0.14 && pos.getX(b) > radius * 0.14 && pos.getX(c) > radius * 0.14) {
          frontIdx.push(a, b, c);
        } else {
          backIdx.push(a, b, c);
        }
      }
      const merged = new Uint16Array(frontIdx.length + backIdx.length);
      merged.set(frontIdx, 0);
      merged.set(backIdx, frontIdx.length);
      geo.setIndex(new THREE.BufferAttribute(merged, 1));
      geo.clearGroups();
      geo.addGroup(0, frontIdx.length, 0);
      geo.addGroup(frontIdx.length, backIdx.length, 1);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function createTaperedHairStrand(curve, segs, rBase, rMid, rTip, flatRatio) {
    const rSegs = 7;
    const geo = new THREE.TubeGeometry(curve, segs, 1.0, rSegs, false);
    const pos = geo.attributes.position;
    const frames = curve.computeFrenetFrames(segs, false);
    const ring = rSegs + 1;
    const flat = flatRatio || 0.60;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const c = curve.getPointAt(t);
      const r = t < 0.32
        ? rBase + (rMid - rBase) * (t / 0.32)
        : rMid + (rTip - rMid) * Math.pow((t - 0.32) / 0.68, 1.15);
      const N = frames.normals[i], B = frames.binormals[i];
      for (let j = 0; j < ring; j++) {
        const idx = i * ring + j;
        const dx = pos.getX(idx) - c.x, dy = pos.getY(idx) - c.y, dz = pos.getZ(idx) - c.z;
        const dN = dx * N.x + dy * N.y + dz * N.z;
        const dB = dx * B.x + dy * B.y + dz * B.z;
        pos.setXYZ(
          idx,
          c.x + N.x * dN * r * flat + B.x * dB * r,
          c.y + N.y * dN * r * flat + B.y * dB * r,
          c.z + N.z * dN * r * flat + B.z * dB * r
        );
      }
    }
    geo.computeVertexNormals();
    return geo;
  }

  function createPleatedSkirtMeshGeo(pts, radialSegs, pleatCount, pleatAmp) {
    const geo = new THREE.LatheGeometry(pts, radialSegs);
    const pos = geo.attributes.position;
    const yMin = pts[0].y, yMax = pts[pts.length - 1].y;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const ang = Math.atan2(z, x);
      const hemWeight = Math.max(0, Math.min(1, (yMax - y) / Math.max(0.01, yMax - yMin)));
      const fold = 1.0 + pleatAmp * Math.sin(ang * pleatCount) * Math.pow(hemWeight, 0.72);
      pos.setXYZ(i, x * fold, y, z * fold);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function buildSisterBow(mat, scale) {
    const bg = new THREE.Group();
    const s = scale || 1.0;
    bg.add(new THREE.Mesh(new THREE.SphereGeometry(0.025 * s, 9, 7), mat));
    [-1, 1].forEach(side => {
      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.036 * s, 0.084 * s, 7), mat);
      wing.rotation.z = side * Math.PI / 2;
      wing.scale.set(0.85, 1.0, 0.45);
      wing.position.set(side * 0.042 * s, 0.005 * s, 0);
      bg.add(wing);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.022 * s, 0.105 * s, 0.009 * s), mat);
      tail.position.set(side * 0.026 * s, -0.06 * s, -0.004 * s);
      tail.rotation.z = side * 0.24;
      bg.add(tail);
    });
    return bg;
  }

  function buildNextGenPhotoSister(cfg) {
    const isSalma = cfg.portraitStyle === 'salma';
    const root = new THREE.Group();
    // Calibrate photo-sister model cleanly to world architecture & adult NPCs
    // (Laila ~1.20m, Salma ~0.95m vs Mom 1.54m, Dad 1.61m, benches 0.92m, doors 2.60m)
    const modelWrap = new THREE.Group();
    modelWrap.scale.setScalar(0.72);
    root.add(modelWrap);
    const bodyPivot = new THREE.Group();
    modelWrap.add(bodyPivot);
    const s = cfg.scale || (isSalma ? 0.68 : 0.86);
    const addOut = (LS.ghibli && LS.ghibli.addInkOutline) ? LS.ghibli.addInkOutline : function () {};

    const skinHex = isSalma ? 0xf6c8ae : 0xeead8a;
    const skinMat = (LS.ghibli && LS.ghibli.createGhibliSkinMat)
      ? LS.ghibli.createGhibliSkinMat(skinHex, null)
      : LS.makeToonMat(skinHex);
    const hairTex = isSalma
      ? createPaintedSisterHairTex('#2a1a14', '#493026', '#724d3e')
      : createPaintedSisterHairTex('#1e120e', '#38231c', '#5c3c31');
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: hairTex, roughness: 0.44, metalness: 0.02, side: THREE.DoubleSide
    });
    const topMat = LS.makeToonMat(cfg.topColor !== undefined ? cfg.topColor : (isSalma ? 0xfff3b0 : 0xffffff));
    const bottomMat = LS.makeToonMat(cfg.bottomColor !== undefined ? cfg.bottomColor : (isSalma ? 0xdf586b : 0x3768b8), {
      map: getNeutralPleatTex()
    });
    const accentMat = LS.makeToonMat(isSalma ? 0xf29f1d : 0xe04f64);
    const bpMat = LS.makeToonMat(cfg.backpackColor !== undefined ? cfg.backpackColor : (isSalma ? 0xd97b38 : 0xc4485a));
    const shoeMat = LS.makeToonMat(cfg.shoeColor !== undefined ? cfg.shoeColor : (isSalma ? 0xc86d24 : 0xb8354a));
    const sockMat = LS.makeToonMat(0xfffdf8);
    const laceMat = LS.makeToonMat(0xfffcf5, { side: THREE.DoubleSide });
    const brassMat = LS.makeToonMat(0xf4c84d);

    // 1. REAL 3D PLEATED SKIRT + SCALLOPED LACE PETTICOAT + WAIST BOW
    const skirtPts = [
      new THREE.Vector2(0.36, 0.42),
      new THREE.Vector2(0.40, 0.44),
      new THREE.Vector2(0.34, 0.56),
      new THREE.Vector2(0.24, 0.74),
      new THREE.Vector2(0.18, 0.86)
    ];
    const skirt = new THREE.Mesh(createPleatedSkirtMeshGeo(skirtPts, 40, 16, 0.052), bottomMat);
    skirt.castShadow = true; addOut(skirt, 0.022);
    bodyPivot.add(skirt);

    const lacePts = [new THREE.Vector2(0.34, 0.395), new THREE.Vector2(0.365, 0.425), new THREE.Vector2(0.32, 0.48)];
    bodyPivot.add(new THREE.Mesh(createPleatedSkirtMeshGeo(lacePts, 32, 18, 0.045), laceMat));

    const sash = new THREE.Mesh(new THREE.TorusGeometry(0.188, 0.025, 8, 24), accentMat);
    sash.rotation.x = Math.PI / 2; sash.position.y = 0.855; bodyPivot.add(sash);
    const backBow = buildSisterBow(accentMat, 1.2);
    backBow.position.set(0, 0.84, -0.19); backBow.rotation.y = Math.PI; bodyPivot.add(backBow);

    // 2. SCULPTED BLOUSE TORSO, NECK & COLLAR
    const torsoPts = [
      new THREE.Vector2(0.165, 0.84), new THREE.Vector2(0.205, 0.98),
      new THREE.Vector2(0.215, 1.13), new THREE.Vector2(0.155, 1.25),
      new THREE.Vector2(0.085, 1.30)
    ];
    const torso = new THREE.Mesh(new THREE.LatheGeometry(torsoPts, 24), topMat);
    torso.scale.set(1.06, 1.0, 0.82); torso.castShadow = true; addOut(torso, 0.022);
    bodyPivot.add(torso);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.072, 0.14, 12), skinMat);
    neck.position.y = 1.32; bodyPivot.add(neck);

    if (!isSalma) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.245, 0.19, 20), bottomMat);
      collar.scale.set(1.12, 1, 0.88); collar.position.y = 1.21; bodyPivot.add(collar);
      const cTrim = new THREE.Mesh(new THREE.TorusGeometry(0.228, 0.011, 6, 22), laceMat);
      cTrim.rotation.x = Math.PI / 2; cTrim.scale.set(1.08, 0.86, 1); cTrim.position.y = 1.135; bodyPivot.add(cTrim);
      const fBow = buildSisterBow(accentMat, 1.12);
      fBow.position.set(0, 1.12, 0.195); bodyPivot.add(fBow);
    } else {
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.148, 0.032, 8, 22), laceMat);
      collar.rotation.x = Math.PI / 2; collar.scale.set(1.08, 0.88, 1); collar.position.y = 1.245; bodyPivot.add(collar);
      [-0.10, 0.10].forEach(sx => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.36, 0.028), bottomMat);
        strap.position.set(sx, 1.04, 0.165); strap.rotation.x = -0.10; bodyPivot.add(strap);
        const btn = new THREE.Mesh(new THREE.SphereGeometry(0.018, 7, 6), brassMat);
        btn.position.set(sx, 0.90, 0.185); bodyPivot.add(btn);
      });
      const fBow = buildSisterBow(accentMat, 0.92);
      fBow.position.set(0, 1.19, 0.175); bodyPivot.add(fBow);
    }

    // 3. ROUNDED STORYBOOK SATCHEL BACKPACK
    const packG = new THREE.Group();
    packG.position.set(0, 1.03, -0.21);
    const pMain = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12), bpMat);
    pMain.scale.set(0.92, 1.08, 0.56); pMain.castShadow = true; addOut(pMain, 0.030); packG.add(pMain);
    const pFlap = new THREE.Mesh(new THREE.SphereGeometry(0.175, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), bpMat);
    pFlap.scale.set(0.95, 0.65, 0.62); pFlap.position.set(0, 0.08, -0.02); packG.add(pFlap);
    [-0.06, 0.06].forEach(bx => {
      const buck = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.038, 0.02), brassMat);
      buck.position.set(bx, 0.02, -0.105); packG.add(buck);
    });
    bodyPivot.add(packG);

    // 4. ARTICULATED LEGS WITH KNEE PIVOTS, ANKLE SOCKS & MARY-JANE SHOES
    function makeSisterLeg(lx) {
      const leg = new THREE.Group();
      leg.position.set(lx, 0.56, 0);
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.054, 0.24, 12), skinMat);
      thigh.position.y = -0.12; thigh.castShadow = true; leg.add(thigh);
      const knee = new THREE.Group();
      knee.position.set(0, -0.24, 0);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.044, 0.20, 12), skinMat);
      shin.position.y = -0.10; shin.castShadow = true; knee.add(shin);
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.16, 12), sockMat);
      sock.position.y = -0.15; knee.add(sock);
      const sockCuff = new THREE.Mesh(new THREE.TorusGeometry(0.051, 0.011, 7, 16), sockMat);
      sockCuff.rotation.x = Math.PI / 2; sockCuff.position.y = -0.07; knee.add(sockCuff);
      const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.070, 14, 10), shoeMat);
      shoe.scale.set(0.94, 0.68, 1.50); shoe.position.set(0, -0.265, 0.036); shoe.castShadow = true;
      addOut(shoe, 0.036); knee.add(shoe);
      const strap = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.009, 6, 14, Math.PI), shoeMat);
      strap.position.set(0, -0.235, 0.035); strap.rotation.x = 0.25; knee.add(strap);
      leg.add(knee);
      return { leg, knee };
    }
    const lLeg = makeSisterLeg(-0.105);
    const rLeg = makeSisterLeg(0.105);
    bodyPivot.add(lLeg.leg, rLeg.leg);

    // 5. BELL SLEEVES + ARTICULATED ELBOW ARMS + HANDS WITH THUMBS
    const sleevePts = [
      new THREE.Vector2(0.056, -0.16), new THREE.Vector2(0.088, -0.10),
      new THREE.Vector2(0.092, -0.03), new THREE.Vector2(0.068, 0.03),
      new THREE.Vector2(0.032, 0.05)
    ];
    const sleeveGeo = new THREE.LatheGeometry(sleevePts, 16);
    function makeSisterArm(ax) {
      const arm = new THREE.Group();
      arm.position.set(ax, 1.22, 0.01);
      const puff = new THREE.Mesh(sleeveGeo, topMat);
      puff.castShadow = true; addOut(puff, 0.030); arm.add(puff);
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.054, 0.011, 6, 14), isSalma ? accentMat : bottomMat);
      cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.155; arm.add(cuff);
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.041, 0.14, 10), skinMat);
      upperArm.position.y = -0.18; arm.add(upperArm);
      const elbow = new THREE.Group();
      elbow.position.set(0, -0.25, 0);
      elbow.rotation.x = -0.18;
      elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.040, 8, 7), skinMat));
      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(0.040, 0.033, 0.17, 10), skinMat);
      foreArm.position.y = -0.085; foreArm.castShadow = true; elbow.add(foreArm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 8), skinMat);
      hand.scale.set(0.88, 1.15, 0.72); hand.position.y = -0.19; elbow.add(hand);
      const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.017, 7, 6), skinMat);
      thumb.position.set(ax < 0 ? 0.032 : -0.032, -0.18, 0.022); elbow.add(thumb);
      arm.add(elbow);
      arm.rotation.z = ax < 0 ? -0.16 : 0.16;
      return { arm, elbow };
    }
    const lArm = makeSisterArm(-0.215);
    const rArm = makeSisterArm(0.215);
    bodyPivot.add(lArm.arm, rArm.arm);

    // 6. PHOTO-EXACT SCULPTED HEAD + 3D EARS + NATURAL BLINKING
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.56, 0.01);
    const openFaceTex = (LS.ghibli && LS.ghibli.getPaintedTex)
      ? LS.ghibli.getPaintedTex(isSalma ? 'salmaFace' : 'lailaFace', 1, 1)
      : LS.createAnimeFaceTexture(cfg.faceOpts);
    const blinkFaceTex = (LS.ghibli && LS.ghibli.getPaintedTex)
      ? LS.ghibli.getPaintedTex(isSalma ? 'salmaFaceBlink' : 'lailaFaceBlink', 1, 1)
      : LS.createAnimeFaceTexture(Object.assign({}, cfg.faceOpts, { blink: true }));
    const happyFaceTex = openFaceTex;
    const faceMat = (LS.ghibli && LS.ghibli.createGhibliSkinMat)
      ? LS.ghibli.createGhibliSkinMat(0xffffff, openFaceTex)
      : new THREE.MeshBasicMaterial({ map: openFaceTex });

    const headGeo = createPhotoHeadGeo(0.284, true);
    const headMesh = new THREE.Mesh(headGeo, [faceMat, skinMat]);
    headMesh.rotation.y = -Math.PI / 2;
    headMesh.castShadow = true;
    const headOutGeo = createPhotoHeadGeo(0.284, false);
    const headOut = new THREE.Mesh(headOutGeo, new THREE.MeshBasicMaterial({ color: 0x3b241c, side: THREE.BackSide }));
    headOut.scale.setScalar(1.022);
    headOut.userData.isOutline = true; headOut.userData.noCamClip = true;
    headMesh.add(headOut);
    headGroup.add(headMesh);

    [-0.268, 0.268].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), skinMat);
      ear.scale.set(0.45, 1.15, 0.72);
      ear.position.set(ex, -0.032, -0.012);
      ear.rotation.y = ex < 0 ? -0.25 : 0.25;
      headGroup.add(ear);
      if (!isSalma) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.010, 6, 6), brassMat);
        stud.position.set(ex * 1.03, -0.072, 0.008);
        headGroup.add(stud);
      }
    });

    // 7. EXACT CENTER-PARTED HAIRSTYLES & HEADBANDS MATCHING REFERENCE PHOTO
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.302, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.48), hairMat);
    hairCap.position.set(0, 0.045, -0.062); hairCap.rotation.x = -0.68; hairCap.castShadow = true;
    addOut(hairCap, 0.020);
    headGroup.add(hairCap);

    [-1, 1].forEach(side => {
      const partCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.008, 0.278, 0.125),
        new THREE.Vector3(side * 0.118, 0.242, 0.205),
        new THREE.Vector3(side * 0.225, 0.145, 0.175),
        new THREE.Vector3(side * 0.276, 0.032, 0.058),
        new THREE.Vector3(side * 0.268, -0.065, -0.072)
      ]);
      const sweep = new THREE.Mesh(createTaperedHairStrand(partCurve, 12, 0.042, 0.062, 0.034, 0.56), hairMat);
      addOut(sweep, 0.022);
      headGroup.add(sweep);

      const topVol = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.020, 0.300, 0.055),
        new THREE.Vector3(side * 0.165, 0.252, 0.112),
        new THREE.Vector3(side * 0.285, 0.105, 0.052),
        new THREE.Vector3(side * 0.285, -0.085, -0.058)
      ]);
      headGroup.add(new THREE.Mesh(createTaperedHairStrand(topVol, 10, 0.054, 0.074, 0.038, 0.62), hairMat));
    });

    const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.294, 20, 16), hairMat);
    hairBack.scale.set(1.04, 1.12, 0.76); hairBack.position.set(0, -0.04, -0.148);
    addOut(hairBack, 0.022); headGroup.add(hairBack);

    const signatureBand = new THREE.Group();
    headGroup.add(signatureBand);
    const swayHair = [];

    if (!isSalma) {
      // LAILA: Cream knotted-bow fabric headband + thick glossy woven side braid over right shoulder (-X)!
      const creamBandMat = LS.makeToonMat(0xf8ebd0);
      const headband = new THREE.Mesh(new THREE.TorusGeometry(0.304, 0.030, 10, 28, Math.PI * 1.04), creamBandMat);
      headband.scale.set(1.02, 1.02, 0.72);
      headband.position.set(0, 0.062, 0.022);
      headband.rotation.x = -0.24;
      addOut(headband, 0.020);
      signatureBand.add(headband);

      const bowTopG = new THREE.Group();
      bowTopG.position.set(0, 0.365, -0.045);
      bowTopG.rotation.x = -0.20;
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), creamBandMat);
      knot.scale.set(1.15, 0.88, 0.92); addOut(knot, 0.025); bowTopG.add(knot);
      [-1, 1].forEach(side => {
        const earCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.02, 0.0, 0),
          new THREE.Vector3(side * 0.095, 0.028, 0.008),
          new THREE.Vector3(side * 0.165, 0.002, -0.005)
        ]);
        const earMesh = new THREE.Mesh(createTaperedHairStrand(earCurve, 7, 0.032, 0.042, 0.010, 0.45), creamBandMat);
        addOut(earMesh, 0.025); bowTopG.add(earMesh);
      });
      signatureBand.add(bowTopG);

      [-1, 1].forEach(side => {
        const wisp = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.25, 0.02, 0.06),
          new THREE.Vector3(side * 0.27, -0.09, -0.02),
          new THREE.Vector3(side * 0.22, -0.20, -0.09)
        ]);
        headGroup.add(new THREE.Mesh(createTaperedHairStrand(wisp, 7, 0.028, 0.032, 0.008, 0.65), hairMat));
      });

      const braidG = new THREE.Group();
      braidG.position.set(-0.215, -0.08, -0.03);
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const rPlait = 0.064 - t * 0.020;
        const bx = -0.015 + Math.sin(t * 2.2) * 0.022;
        const by = -i * 0.066;
        const bz = 0.025 + Math.sin(t * Math.PI * 0.68) * 0.145;
        [-1, 1].forEach(ps => {
          const plait = new THREE.Mesh(new THREE.SphereGeometry(rPlait, 9, 7), hairMat);
          plait.scale.set(1.05, 0.82, 0.78);
          plait.rotation.z = ps * 0.48;
          plait.position.set(bx + ps * (rPlait * 0.46), by - (ps > 0 ? 0.016 : 0), bz);
          addOut(plait, 0.022);
          braidG.add(plait);
        });
      }
      const tie = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.010, 7, 14), LS.makeToonMat(0x2a1c17));
      tie.rotation.x = Math.PI / 2; tie.position.set(-0.005, -0.57, 0.155); braidG.add(tie);
      const tipCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.005, -0.57, 0.155),
        new THREE.Vector3(-0.012, -0.66, 0.165),
        new THREE.Vector3(0.008, -0.76, 0.155)
      ]);
      const tipMesh = new THREE.Mesh(createTaperedHairStrand(tipCurve, 7, 0.036, 0.046, 0.006, 0.72), hairMat);
      addOut(tipMesh, 0.022);
      braidG.add(tipMesh);
      headGroup.add(braidG);
      swayHair.push(braidG);
    } else {
      // SALMA: Sparkly soft-pink glitter headband + lush long wavy dark-chocolate hair over BOTH shoulders!
      const pinkBandMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, map: getGlitterHeadbandTex(), roughness: 0.34, metalness: 0.16
      });
      const headband = new THREE.Mesh(new THREE.TorusGeometry(0.305, 0.026, 10, 28, Math.PI * 1.02), pinkBandMat);
      headband.scale.set(1.02, 1.02, 0.70);
      headband.position.set(0, 0.068, 0.022);
      headband.rotation.x = -0.24;
      addOut(headband, 0.018);
      signatureBand.add(headband);

      [-1, 1].forEach(side => {
        const waveG = new THREE.Group();
        const w1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.25, 0.08, 0.03),
          new THREE.Vector3(side * 0.30, -0.10, 0.07),
          new THREE.Vector3(side * 0.24, -0.28, 0.14),
          new THREE.Vector3(side * 0.28, -0.46, 0.17),
          new THREE.Vector3(side * 0.21, -0.64, 0.16),
          new THREE.Vector3(side * 0.24, -0.78, 0.13)
        ]);
        const m1 = new THREE.Mesh(createTaperedHairStrand(w1, 14, 0.062, 0.082, 0.012, 0.56), hairMat);
        addOut(m1, 0.020); waveG.add(m1);

        const w2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.26, 0.04, -0.06),
          new THREE.Vector3(side * 0.35, -0.18, -0.02),
          new THREE.Vector3(side * 0.31, -0.40, 0.05),
          new THREE.Vector3(side * 0.36, -0.60, 0.06),
          new THREE.Vector3(side * 0.29, -0.74, 0.04)
        ]);
        const m2 = new THREE.Mesh(createTaperedHairStrand(w2, 12, 0.055, 0.072, 0.010, 0.60), hairMat);
        addOut(m2, 0.020); waveG.add(m2);

        const w3 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.22, 0.04, 0.10),
          new THREE.Vector3(side * 0.25, -0.14, 0.11),
          new THREE.Vector3(side * 0.18, -0.34, 0.15),
          new THREE.Vector3(side * 0.16, -0.52, 0.16)
        ]);
        waveG.add(new THREE.Mesh(createTaperedHairStrand(w3, 10, 0.036, 0.046, 0.008, 0.58), hairMat));
        headGroup.add(waveG);
        swayHair.push(waveG);
      });

      for (let bl = -2; bl <= 2; bl++) {
        const bx = bl * 0.115;
        const bc = new THREE.CatmullRomCurve3([
          new THREE.Vector3(bx * 0.85, 0.04, -0.24),
          new THREE.Vector3(bx * 1.12, -0.22, -0.28),
          new THREE.Vector3(bx * 1.02, -0.48, -0.25),
          new THREE.Vector3(bx * 1.15, -0.70 - (2 - Math.abs(bl)) * 0.04, -0.22)
        ]);
        const bm = new THREE.Mesh(createTaperedHairStrand(bc, 10, 0.062, 0.076, 0.012, 0.54), hairMat);
        addOut(bm, 0.018); headGroup.add(bm);
      }
    }

    const hatSlot = new THREE.Group();
    if (cfg.hatType && cfg.hatType !== 'none') {
      hatSlot.add(buildHatMeshes(cfg.hatType, cfg.hatColor));
    }
    headGroup.add(hatSlot);
    bodyPivot.add(headGroup);

    if (LS.createContactShadowTexture) {
      const shadowDisc = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.95),
        new THREE.MeshBasicMaterial({ map: LS.createContactShadowTexture(), transparent: true, depthWrite: false })
      );
      shadowDisc.rotation.x = -Math.PI / 2;
      shadowDisc.position.y = 0.024;
      shadowDisc.userData.noOutline = true;
      shadowDisc.userData.noCamClip = true;
      modelWrap.add(shadowDisc);
    }

    root.scale.setScalar(s);

    return {
      root,
      bodyPivot,
      headGroup,
      leftLeg: lLeg.leg,
      rightLeg: rLeg.leg,
      leftKnee: lLeg.knee,
      rightKnee: rLeg.knee,
      leftArm: lArm.arm,
      rightArm: rArm.arm,
      leftElbow: lArm.elbow,
      rightElbow: rArm.elbow,
      topMat,
      bottomMat,
      shoeMat,
      bpMat,
      hatSlot,
      signatureBand,
      swayHair,
      faceMat,
      openFaceTex,
      blinkFaceTex,
      happyFaceTex,
      blinkTimer: isSalma ? 4.8 : 3.2,
      isBlinking: false
    };
  }

  LS.createAnimeCharacter = function (cfg) {
    if (cfg && (cfg.portraitStyle === 'laila' || cfg.portraitStyle === 'salma')) {
      return buildNextGenPhotoSister(cfg);
    }
    if (LS.isHD) return buildRealisticHDCharacter(cfg);

    const root = new THREE.Group();
    const s = cfg.scale || 1.0;

    const skinMat = LS.makeToonMat(cfg.skin || cfg.skinColor || 0xffe3cc);
    const hairMat = LS.makeToonMat(cfg.hairColor || 0x3b261d);
    const topMat = LS.makeToonMat(cfg.topColor || 0xffffff);
    const bottomMat = LS.makeToonMat(cfg.bottomColor || 0x2d4373);
    const shoeMat = LS.makeToonMat(cfg.shoeColor || 0xd94c4c);
    const bpMat = LS.makeToonMat(cfg.backpackColor || 0xc92c3b);

    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);
    const hd = false;
    const legH = hd ? 0.66 : 0.52;
    const hipY = hd ? 0.72 : 0.58;

    function makeLeg(sideX) {
      const leg = new THREE.Group();
      leg.position.set(sideX, hipY, 0);
      const limb = new THREE.Mesh(
        new THREE.CylinderGeometry(hd ? 0.072 : 0.085, hd ? 0.056 : 0.072, legH, hd ? 14 : 10),
        cfg.pants ? bottomMat : skinMat
      );
      limb.position.y = -legH * 0.5;
      limb.castShadow = true;
      leg.add(limb);

      if (!cfg.pants) {
        const sockCol = (hd && cfg.sailorCollar) ? 0x262d3d : 0xffffff;
        const sockH = hd ? 0.28 : 0.16;
        const sock = new THREE.Mesh(new THREE.CylinderGeometry(hd ? 0.064 : 0.078, hd ? 0.058 : 0.072, sockH, hd ? 12 : 10), LS.makeToonMat(sockCol));
        sock.position.y = -legH + sockH * 0.5 + 0.02;
        leg.add(sock);
      }

      const shoe = new THREE.Mesh(new THREE.SphereGeometry(hd ? 0.095 : 0.11, 12, 8), shoeMat);
      shoe.scale.set(0.92, 0.62, 1.45);
      shoe.position.set(0, -legH - 0.02, 0.04);
      leg.add(shoe);
      return leg;
    }

    const leftLeg = makeLeg(hd ? -0.105 : -0.13);
    const rightLeg = makeLeg(hd ? 0.105 : 0.13);
    bodyPivot.add(leftLeg, rightLeg);

    const torsoY = hd ? 1.03 : 0.88;
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(hd ? 0.165 : 0.19, hd ? 0.185 : 0.23, hd ? 0.58 : 0.56, hd ? 16 : 12), topMat);
    torso.position.y = torsoY;
    torso.castShadow = true;
    bodyPivot.add(torso);

    if (hd) {
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.068, 0.14, 10), skinMat);
      neck.position.y = torsoY + 0.33;
      bodyPivot.add(neck);
    }

    if (!cfg.pants) {
      const skirt = new THREE.Mesh(new THREE.ConeGeometry(hd ? 0.28 : 0.32, hd ? 0.40 : 0.36, hd ? 20 : 14), bottomMat);
      skirt.position.y = hd ? 0.75 : 0.64;
      skirt.castShadow = true;
      bodyPivot.add(skirt);
    }

    if (cfg.sailorCollar) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(hd ? 0.185 : 0.21, hd ? 0.22 : 0.24, 0.16, hd ? 16 : 12), bottomMat);
      collar.position.y = torsoY + 0.21;
      bodyPivot.add(collar);
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(hd ? 0.11 : 0.14, hd ? 0.18 : 0.14, 0.06), LS.makeToonMat(0xd93848));
      ribbon.position.set(0, torsoY + 0.12, hd ? 0.19 : 0.21);
      bodyPivot.add(ribbon);
    }

    if (cfg.backpackColor) {
      const bp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.18), bpMat);
      bp.position.set(0, torsoY + 0.04, hd ? -0.21 : -0.24);
      bp.castShadow = true;
      bodyPivot.add(bp);
      const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), LS.makeToonMat(0xf2c94c));
      clasp.position.set(0, torsoY - 0.10, hd ? -0.31 : -0.34);
      bodyPivot.add(clasp);
    }

    function makeArm(sideX) {
      const arm = new THREE.Group();
      arm.position.set(sideX, torsoY + 0.22, 0);
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(hd ? 0.075 : 0.085, 10, 8), topMat);
      arm.add(shoulder);
      if (hd) {
        const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.060, 0.20, 10), topMat);
        sleeve.position.y = -0.10;
        arm.add(sleeve);
      }
      const limb = new THREE.Mesh(new THREE.CylinderGeometry(hd ? 0.054 : 0.068, hd ? 0.045 : 0.058, hd ? 0.48 : 0.44, 10), skinMat);
      limb.position.y = hd ? -0.26 : -0.24;
      limb.castShadow = true;
      arm.add(limb);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(hd ? 0.052 : 0.065, 8, 8), skinMat);
      hand.position.y = hd ? -0.51 : -0.47;
      arm.add(hand);
      return arm;
    }

    const leftArm = makeArm(hd ? -0.22 : -0.26);
    const rightArm = makeArm(hd ? 0.22 : 0.26);
    bodyPivot.add(leftArm, rightArm);

    const headGroup = new THREE.Group();
    headGroup.position.y = hd ? 1.56 : 1.44;
    if (hd) headGroup.scale.set(0.84, 0.88, 0.84);
    bodyPivot.add(headGroup);

    const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.29, hd ? 26 : 18, hd ? 20 : 14), skinMat);
    headSphere.scale.set(1.0, 1.03, 0.98);
    headSphere.castShadow = true;
    headGroup.add(headSphere);

    // Cute sculpted 3D anime ears & delicate nose contour
    [-0.268, 0.268].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), skinMat);
      ear.scale.set(0.38, 0.95, 0.68);
      ear.position.set(ex, -0.025, -0.015);
      ear.rotation.y = ex < 0 ? -0.2 : 0.2;
      headGroup.add(ear);
    });
    if (hd) {
      const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), skinMat);
      noseTip.scale.set(0.85, 0.9, 1.2);
      noseTip.position.set(0, -0.048, 0.283);
      noseTip.userData.noOutline = true;
      headGroup.add(noseTip);
    }

    const openFaceTex = LS.createAnimeFaceTexture(cfg.faceOpts);
    const blinkFaceTex = LS.createAnimeFaceTexture(Object.assign({}, cfg.faceOpts, { blink: true }));
    const happyFaceTex = LS.createAnimeFaceTexture(Object.assign({}, cfg.faceOpts, { happy: true }));

    const faceMat = new THREE.MeshBasicMaterial({
      map: openFaceTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2
    });
    const facePlane = new THREE.Mesh(
      new THREE.SphereGeometry(0.294, hd ? 24 : 16, hd ? 16 : 12, -Math.PI * 0.34, Math.PI * 0.68, Math.PI * 0.22, Math.PI * 0.56),
      faceMat
    );
    facePlane.scale.set(1.0, 1.03, 0.98);
    facePlane.rotation.y = Math.PI / 2;
    headGroup.add(facePlane);

    // Tilt hair crown gently back so the back of the skull is full while the forehead & anime eyes stay 100% open and clear!
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.308, hd ? 24 : 16, hd ? 18 : 12, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
    hairTop.scale.set(1.01, 1.03, 1.02);
    hairTop.position.set(0, 0.025, -0.012);
    hairTop.rotation.x = -0.34;
    headGroup.add(hairTop);

    // Subtle glossy anime angel-ring hair shine band in HD mode!
    if (hd) {
      const shineRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.255, 0.018, 6, 22, Math.PI * 1.15),
        new THREE.MeshBasicMaterial({ color: 0xfff6e8, transparent: true, opacity: 0.24, depthWrite: false })
      );
      shineRing.rotation.set(Math.PI / 2 - 0.34, 0, -0.2);
      shineRing.position.set(0, 0.195, -0.04);
      shineRing.userData.noOutline = true;
      headGroup.add(shineRing);
    }

    // Sculpted layered anime forehead bangs framing the brow cleanly ABOVE the eyes!
    [
      [-0.165, 0.178, 0.205, 0.062, 0.115, 0.34],
      [-0.082, 0.198, 0.232, 0.056, 0.105, 0.16],
      [0.0, 0.204, 0.240, 0.054, 0.098, 0.0],
      [0.082, 0.198, 0.232, 0.056, 0.105, -0.16],
      [0.165, 0.178, 0.205, 0.062, 0.115, -0.34]
    ].forEach(b => {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(b[3], b[4], 7), hairMat);
      bang.scale.set(1.0, 1.0, 0.48);
      bang.position.set(b[0], b[1], b[2]);
      bang.rotation.set(Math.PI + 0.36, 0, b[5]);
      bang.userData.noOutline = true;
      headGroup.add(bang);
    });

    if (hd && (cfg.longHair || cfg.hairBun)) {
      // Sculpted anime side hair locks framing cleanly outside the cheeks (angled gently outward, never crossing under the chin!)
      [-0.255, 0.255].forEach(bx => {
        const strand = new THREE.Mesh(new THREE.ConeGeometry(0.064, 0.34, 8), hairMat);
        strand.scale.set(0.75, 1.0, 0.65);
        strand.position.set(bx, -0.06, 0.02);
        strand.rotation.x = Math.PI;
        strand.rotation.z = bx < 0 ? -0.08 : 0.08;
        strand.userData.noOutline = true;
        headGroup.add(strand);
      });
    }

    if (cfg.longHair) {
      // Silky flowing back hair veil positioned cleanly behind the ears & neck (zero chin/neck clip!)
      const backHair = new THREE.Mesh(new THREE.CylinderGeometry(0.265, hd ? 0.33 : 0.30, hd ? 0.56 : 0.44, hd ? 18 : 12), hairMat);
      backHair.scale.set(1.0, 1.0, 0.42);
      backHair.position.set(0, hd ? -0.20 : -0.14, -0.195);
      backHair.rotation.x = 0.08;
      headGroup.add(backHair);
    }
    if (cfg.pigtails) {
      [-0.28, 0.28].forEach(px => {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), hairMat);
        puff.position.set(px, -0.02, -0.06);
        headGroup.add(puff);
        const tie = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), LS.makeToonMat(0xf59e0b));
        tie.position.set(px * 0.85, 0.04, -0.04);
        headGroup.add(tie);
      });
    }

    if (cfg.hairBun) {
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), hairMat);
      bun.position.set(0, 0.24, -0.2);
      headGroup.add(bun);
    }
    if (cfg.headband) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.295, 0.032, 8, 20), LS.makeToonMat(0xf5f5f5));
      band.rotation.x = Math.PI / 2;
      band.position.y = 0.14;
      headGroup.add(band);
    }

    if (hd && LS.hdAssets && LS.hdAssets.addAnimeOutline) {
      LS.hdAssets.addAnimeOutline(bodyPivot, 0.042, 0x2b1e1a);
    }

    // Soft grounded ambient-occlusion contact shadow disc beneath feet!
    if (LS.createContactShadowTexture) {
      const shadowDisc = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.95),
        new THREE.MeshBasicMaterial({ map: LS.createContactShadowTexture(), transparent: true, depthWrite: false })
      );
      shadowDisc.rotation.x = -Math.PI / 2;
      shadowDisc.position.y = 0.024;
      shadowDisc.userData.noOutline = true;
      shadowDisc.userData.noCamClip = true;
      root.add(shadowDisc);
    }

    const hatSlot = new THREE.Group();
    if (cfg.hatType && cfg.hatType !== 'none') {
      hatSlot.add(buildHatMeshes(cfg.hatType, cfg.hatColor));
    }
    headGroup.add(hatSlot);

    root.scale.setScalar(s);

    return {
      root,
      bodyPivot,
      headGroup,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm,
      topMat,
      bottomMat,
      shoeMat,
      bpMat,
      hatSlot,
      faceMat,
      openFaceTex,
      blinkFaceTex,
      happyFaceTex,
      blinkTimer: 2 + Math.random() * 3,
      isBlinking: false
    };
  };

  LS.applyOutfit = function (who, outfitId) {
    const outfit = LS.OUTFITS.find(o => o.id === outfitId && o.who === who);
    const charObj = who === 'salma' ? LS.chars.salma : LS.chars.laila;
    if (!outfit || !charObj) return;
    const st = outfit.style;
    charObj.topMat.color.setHex(st.topColor);
    charObj.bottomMat.color.setHex(st.bottomColor);
    charObj.shoeMat.color.setHex(st.shoeColor);
    charObj.bpMat.color.setHex(st.backpackColor);

    while (charObj.hatSlot.children.length > 0) {
      charObj.hatSlot.remove(charObj.hatSlot.children[0]);
    }
    if (st.hatType && st.hatType !== 'none') {
      charObj.hatSlot.add(buildHatMeshes(st.hatType, st.hatColor));
    }
    if (charObj.signatureBand) {
      const fullDome = st.hatType === 'kinder' || st.hatType === 'beret' || st.hatType === 'cap' || st.hatType === 'panda';
      charObj.signatureBand.visible = !fullDome;
    }
  };

  function buildShibaVisuals() {
    const visual = new THREE.Group();
    if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_shiba')) {
      const mdl = LS.hdAssets.clone('anime_shiba');
      mdl.scale.setScalar(1.06);
      visual.add(mdl);
      return visual;
    }
    const fur = LS.makeToonMat(0xd98a3b);
    const cream = LS.makeToonMat(0xfae8cd);
    const dark = LS.makeToonMat(0x1f1714);
    const pink = LS.makeToonMat(0xf09fa4);
    const scarf = LS.makeToonMat(0xd63031);
    const gold = LS.makeToonMat(0xfacc15);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), fur);
    body.scale.set(0.86, 0.78, 1.48); body.position.y = 0.41; body.castShadow = true; visual.add(body);
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), cream);
    chest.position.set(0, 0.42, 0.24); visual.add(chest);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.036, 8, 16), scarf);
    collar.rotation.x = Math.PI / 2 + 0.25; collar.position.set(0, 0.50, 0.26); visual.add(collar);
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 8), gold);
    bell.position.set(0, 0.43, 0.40); visual.add(bell);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.215, 16, 12), fur);
    head.position.set(0, 0.65, 0.34); head.castShadow = true; visual.add(head);
    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), cream);
    snout.scale.set(0.95, 0.78, 1.15); snout.position.set(0, 0.59, 0.51); visual.add(snout);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), dark);
    nose.position.set(0, 0.62, 0.61); visual.add(nose);
    [-0.092, 0.092].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), dark); eye.position.set(ex, 0.68, 0.51); visual.add(eye);
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); sp.position.set(ex * 1.08, 0.692, 0.532); visual.add(sp);
      const brow = new THREE.Mesh(new THREE.SphereGeometry(0.024, 6, 6), cream); brow.scale.set(1.2, 0.65, 0.6); brow.position.set(ex * 0.92, 0.74, 0.49); visual.add(brow);
    });
    [-0.135, 0.135].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.17, 7), fur); ear.position.set(ex, 0.85, 0.31); ear.rotation.z = ex < 0 ? 0.22 : -0.22; visual.add(ear);
      const ein = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.12, 6), pink); ein.position.set(ex, 0.84, 0.34); ein.rotation.z = ex < 0 ? 0.22 : -0.22; visual.add(ein);
    });
    const tail = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.045, 8, 14, Math.PI * 1.5), fur);
    tail.position.set(0, 0.58, -0.30); tail.rotation.y = Math.PI / 2; visual.add(tail);
    [[-0.115, 0.20], [0.115, 0.20], [-0.115, -0.20], [0.115, -0.20]].forEach(lp => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.28, 8), cream); leg.position.set(lp[0], 0.14, lp[1]); visual.add(leg);
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), cream); paw.scale.set(1, 0.62, 1.3); paw.position.set(lp[0], 0.032, lp[1] + 0.02); visual.add(paw);
    });
    return visual;
  }

  function createShibaInu() {
    const g = new THREE.Group();
    const vis = buildShibaVisuals();
    g.userData.visualSlot = vis;
    g.add(vis);
    return g;
  }

  LS.refreshMochiHD = function () {
    if (!LS.chars.mochi || !LS.isHD || !LS.hdAssets || !LS.hdAssets.has('anime_shiba')) return;
    const oldVis = LS.chars.mochi.userData.visualSlot;
    if (oldVis) LS.chars.mochi.remove(oldVis);
    const newVis = buildShibaVisuals();
    LS.chars.mochi.userData.visualSlot = newVis;
    LS.chars.mochi.add(newVis);
  };

  LS.createCatModel = function (coatHex, accentHex, opts) {
    const cfg = opts || {};
    const root = new THREE.Group();
    const s = cfg.scale || 1.0;
    const furMat = LS.makeToonMat(coatHex !== undefined ? coatHex : 0xe89643);
    const accMat = LS.makeToonMat(accentHex !== undefined ? accentHex : 0xfff3d6);
    const collarHex = cfg.collarColor || 0xe04858;

    if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_cat')) {
      const mdl = LS.hdAssets.clone('anime_cat', {
        furTint: coatHex,
        accentTint: accentHex,
        collarTint: collarHex
      });
      mdl.scale.setScalar(1.08);
      root.add(mdl);
    } else {
      const pinkMat = LS.makeToonMat(0xf5a6b8);
      const eyeMat = LS.makeToonMat(0x2a7a42);
      const darkMat = LS.makeToonMat(0x161210);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 10), furMat); body.scale.set(0.9, 1.05, 1.1); body.position.set(0, 0.22, -0.04); body.castShadow = true; root.add(body);
      const chest = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), accMat); chest.position.set(0, 0.24, 0.10); root.add(chest);
      [-0.075, 0.075].forEach(px => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.042, 0.20, 8), furMat); leg.position.set(px, 0.13, 0.13); root.add(leg);
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), accMat); paw.scale.set(1, 0.65, 1.25); paw.position.set(px, 0.03, 0.16); root.add(paw);
      });
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.025, 8, 14), LS.makeToonMat(collarHex)); collar.rotation.x = Math.PI / 2 + 0.15; collar.position.set(0, 0.36, 0.08); root.add(collar);
      const bell = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), LS.makeToonMat(0xfacc15)); bell.position.set(0, 0.34, 0.19); root.add(bell);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.175, 14, 10), furMat); head.position.set(0, 0.49, 0.10); head.castShadow = true; root.add(head);
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), pinkMat); nose.position.set(0, 0.47, 0.265); root.add(nose);
      [-0.08, 0.08].forEach(ex => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), eyeMat); eye.position.set(ex, 0.51, 0.24); root.add(eye);
        const pup = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), darkMat); pup.scale.set(0.65, 1.3, 0.8); pup.position.set(ex, 0.51, 0.262); root.add(pup);
        const sp = new THREE.Mesh(new THREE.SphereGeometry(0.011, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); sp.position.set(ex * 1.12, 0.525, 0.268); root.add(sp);
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.062, 0.145, 6), furMat); ear.position.set(ex * 1.35, 0.65, 0.085); ear.rotation.z = ex < 0 ? 0.22 : -0.22; root.add(ear);
        const ein = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.10, 5), pinkMat); ein.position.set(ex * 1.32, 0.64, 0.105); ein.rotation.z = ex < 0 ? 0.22 : -0.22; root.add(ein);
      });
    }

    // Articulated gently-curved animated cat tail!
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0.16, -0.22);
    const tSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.038, 0.26, 8), furMat);
    tSeg1.position.set(0, 0.11, -0.07); tSeg1.rotation.x = -0.48; tailPivot.add(tSeg1);
    const tSeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.030, 0.22, 8), furMat);
    tSeg2.position.set(0, 0.28, -0.14); tSeg2.rotation.x = -0.15; tailPivot.add(tSeg2);
    const tTip = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), accMat);
    tTip.position.set(0, 0.39, -0.16); tailPivot.add(tTip);
    root.add(tailPivot);

    root.scale.setScalar(s);
    return { root, tail: tailPivot };
  };

  LS.createKitsuneModel = function (coatHex, tipHex, opts) {
    const cfg = opts || {};
    const root = new THREE.Group();
    const s = cfg.scale || 1.0;
    const furMat = LS.makeToonMat(coatHex !== undefined ? coatHex : 0xf77f00);
    const tipMat = LS.makeToonMat(tipHex !== undefined ? tipHex : 0xffffff);

    if (LS.isHD && LS.hdAssets && LS.hdAssets.has('anime_kitsune')) {
      const mdl = LS.hdAssets.clone('anime_kitsune', {
        furTint: coatHex,
        accentTint: 0xfff8ee
      });
      mdl.scale.setScalar(1.10);
      root.add(mdl);
    } else {
      const bibMat = LS.makeToonMat(0xd62828);
      const darkMat = LS.makeToonMat(0x1f1714);
      const eyeMat = LS.makeToonMat(0xe05a1e);
      const creamMat = LS.makeToonMat(0xfff8ee);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 10), furMat); body.scale.set(0.84, 1.15, 1.08); body.position.set(0, 0.26, -0.04); body.castShadow = true; root.add(body);
      const bib = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.20, 8), bibMat); bib.position.set(0, 0.36, 0.16); bib.rotation.x = 0.35; root.add(bib);
      const bell = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 6), LS.makeToonMat(0xfacc15)); bell.position.set(0, 0.38, 0.23); root.add(bell);
      [-0.072, 0.072].forEach(px => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.24, 8), furMat); leg.position.set(px, 0.15, 0.13); root.add(leg);
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.040, 8, 6), darkMat); paw.scale.set(1, 0.65, 1.3); paw.position.set(px, 0.03, 0.16); root.add(paw);
      });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), furMat); head.position.set(0, 0.56, 0.10); head.castShadow = true; root.add(head);
      const snout = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.22, 8), creamMat); snout.rotation.x = Math.PI / 2; snout.position.set(0, 0.53, 0.29); root.add(snout);
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), darkMat); nose.position.set(0, 0.54, 0.40); root.add(nose);
      [-0.078, 0.078].forEach(ex => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), eyeMat); eye.position.set(ex, 0.58, 0.24); root.add(eye);
        const sp = new THREE.Mesh(new THREE.SphereGeometry(0.011, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); sp.position.set(ex * 1.1, 0.59, 0.264); root.add(sp);
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.064, 0.22, 7), furMat); ear.position.set(ex * 1.35, 0.76, 0.085); ear.rotation.z = ex < 0 ? 0.18 : -0.18; root.add(ear);
      });
    }

    // Lush animated multi-lobe fluffy kitsune fox tail with contrasting tip!
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0.22, -0.22);
    const tBase = new THREE.Mesh(new THREE.SphereGeometry(0.115, 10, 8), furMat);
    tBase.scale.set(0.85, 0.95, 1.55); tBase.position.set(0, 0.09, -0.12); tBase.rotation.x = 0.48; tBase.castShadow = true; tailPivot.add(tBase);
    const tMid = new THREE.Mesh(new THREE.SphereGeometry(0.135, 10, 8), furMat);
    tMid.scale.set(0.92, 1.0, 1.45); tMid.position.set(0, 0.22, -0.26); tMid.rotation.x = 0.62; tMid.castShadow = true; tailPivot.add(tMid);
    const tTip = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.26, 9), tipMat);
    tTip.position.set(0, 0.36, -0.39); tTip.rotation.x = -0.82; tailPivot.add(tTip);
    root.add(tailPivot);

    root.scale.setScalar(s);
    return { root, tail: tailPivot };
  };

  LS.initCoreCharacters = function (scene) {
    LS.chars.laila = LS.createAnimeCharacter({
      scale: 0.86,
      portraitStyle: 'laila',
      skinColor: 0xdfa882,
      hairColor: 0x2c201b,
      topColor: 0xffffff,
      bottomColor: 0x2c4a7c,
      shoeColor: 0xd94848,
      sailorCollar: true,
      backpackColor: 0xc92c3b,
      longHair: true,
      hatType: 'none',
      faceOpts: { portrait: 'laila', smileTeeth: true, eyeColor: '#3a2216', eyeHighlight: '#885838', blush: 'rgba(222, 112, 92, 0.36)' }
    });
    scene.add(LS.chars.laila.root);

    LS.chars.salma = LS.createAnimeCharacter({
      scale: 0.68,
      portraitStyle: 'salma',
      skinColor: 0xf6c8ae,
      hairColor: 0x34221c,
      topColor: 0xfff3b0,
      bottomColor: 0xdf586b,
      shoeColor: 0xc86d24,
      backpackColor: 0xd97b38,
      hatType: 'none',
      hatColor: 0xfacc15,
      faceOpts: { portrait: 'salma', smileTeeth: true, eyeColor: '#3c2317', eyeHighlight: '#92623e', blush: 'rgba(244, 134, 146, 0.42)' }
    });
    LS.chars.salmaBubble = LS.createSpeechBubbleSprite('Salma', 'Wait for me, Laila! Let us explore together! 🌸');
    LS.chars.salmaBubble.position.set(0, 1.92, 0);
    LS.chars.salma.root.add(LS.chars.salmaBubble);
    scene.add(LS.chars.salma.root);

    LS.applyOutfit('laila', LS.state.equippedLaila);
    LS.applyOutfit('salma', LS.state.equippedSalma);

    LS.chars.mochi = createShibaInu();
    const hc = document.createElement('canvas');
    hc.width = 160; hc.height = 120;
    const hctx = hc.getContext('2d');
    hctx.font = 'bold 74px sans-serif';
    hctx.textAlign = 'center';
    hctx.fillText('💖', 80, 88);
    const heartSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, depthTest: false }));
    heartSprite.scale.set(0.95, 0.72, 1);
    heartSprite.position.set(0, 1.15, 0);
    heartSprite.visible = false;
    LS.chars.mochi.add(heartSprite);
    LS.chars.mochiHeart = heartSprite;
    scene.add(LS.chars.mochi);
  };

  LS.setSalmaBubbleText = function (text, showMs) {
    const isSalmaLead = LS.state && LS.state.activeLeader === 'salma';
    const speaker = isSalmaLead ? LS.chars.laila : LS.chars.salma;
    const speakerName = isSalmaLead ? 'Laila' : 'Salma';
    if (!speaker) return;
    if (LS.chars.salmaBubble && LS.chars.salmaBubble.parent) {
      LS.chars.salmaBubble.parent.remove(LS.chars.salmaBubble);
      LS.chars.salmaBubble = null;
    }
    if (!text) {
      LS.runtime.salmaHintUntil = 0;
      return;
    }
    const nb = LS.createSpeechBubbleSprite(speakerName, text, { skipAutoLeader: true });
    const inRoom = LS.WORLDS && LS.WORLDS[LS.state.currentWorld] && LS.WORLDS[LS.state.currentWorld].isInterior;
    if (inRoom) {
      nb.scale.multiplyScalar(0.54);
      nb.position.set(0, 1.66, 0);
    } else {
      nb.position.set(0, 1.92, 0);
    }
    nb.visible = Boolean(showMs);
    LS.chars.salmaBubble = nb;
    speaker.root.add(nb);
    if (showMs) LS.runtime.salmaHintUntil = Date.now() + showMs;
  };

  LS.spawnWorldNPCs = function (worldGroup, npcConfigs) {
    LS.chars.npcs = [];
    const inRoom = LS.WORLDS && LS.WORLDS[LS.state.currentWorld] && LS.WORLDS[LS.state.currentWorld].isInterior;
    npcConfigs.forEach(cfg => {
      const model = LS.createAnimeCharacter(cfg.char);
      model.root.position.copy(cfg.pos);
      if (cfg.baseRot !== undefined) model.root.rotation.y = cfg.baseRot;
      if (cfg.seated) {
        model.leftLeg.rotation.x = -1.55;
        model.rightLeg.rotation.x = -1.55;
        model.leftArm.rotation.x = -0.26;
        model.rightArm.rotation.x = -0.26;
        model.leftArm.rotation.z = -0.06;
        model.rightArm.rotation.z = 0.06;
        if (LS.applyArticulatedPose) LS.applyArticulatedPose(model, 0, 'chair_sit', 0);
      }
      const bubble = LS.createSpeechBubbleSprite(cfg.name, cfg.line, {
        lines: cfg.lines,
        fixedLine: cfg.fixedLine,
        lineLaila: cfg.lineLaila,
        lineSalma: cfg.lineSalma,
        skipAutoLeader: cfg.skipAutoLeader
      });
      if (inRoom) {
        bubble.scale.multiplyScalar(0.58);
        bubble.position.set(0, 2.02, 0);
      } else {
        bubble.position.set(0, 2.25, 0);
      }
      model.root.add(bubble);
      worldGroup.add(model.root);

      LS.chars.npcs.push({
        name: cfg.name,
        model,
        bubble,
        patrol: cfg.patrol || null,
        seated: Boolean(cfg.seated),
        dir: 1,
        waveOnNear: Boolean(cfg.waveOnNear),
        baseRot: cfg.baseRot || 0
      });
    });
  };

  LS.showSalmaAnimalHint = function () {
    const world = LS.activeWorld;
    if (!LS.chars.salma || !world || !world.hiddenAnimals) return;
    if (world.isInterior) {
      LS.setSalmaBubbleText('Let us play piano, grab a snack, or spin the Magic Globe! 🌍✨', 3800);
      return;
    }
    const wid = LS.state.currentWorld;
    const isHome = wid === 'home_neighborhood';
    const isKyoto = wid === 'kyoto';
    const isSafari = wid === 'safari';
    const label = isHome ? 'puppies' : (isSafari ? 'lion cubs' : (isKyoto ? 'kitsune foxes' : 'cats'));
    const emoji = isHome ? '🐶' : (isSafari ? '🦁' : (isKyoto ? '🦊' : '🐱'));
    const unfound = world.hiddenAnimals.filter(a => !a.found);
    if (unfound.length === 0) {
      const rem = LS.getAnimalResetRemainingMs(wid);
      const mins = Math.max(1, Math.ceil(rem / 60000));
      const doneMsg = 'We found all 5 ' + label + '! They will hide in new spots in ' + mins + ' min!';
      LS.setSalmaBubbleText(doneMsg, 4500);
      LS.showToast('🐾 ' + doneMsg);
      return;
    }
    const leader = (LS.state.activeLeader === 'salma' && LS.chars.salma) ? LS.chars.salma : LS.chars.laila;
    const lp = leader.root.position;
    let nearest = unfound[0];
    let bestD = Infinity;
    unfound.forEach(a => {
      const d = a.mesh.position.distanceTo(lp);
      if (d < bestD) { bestD = d; nearest = a; }
    });
    const soundWord = isHome ? 'barking playfully' : (isSafari ? 'purring & roaring softly' : (isKyoto ? 'yipping happily' : 'meowing'));
    const placeText = nearest.hint || 'somewhere nearby';
    const hintText = 'I hear ' + nearest.name.split(' ')[0] + ' ' + soundWord + ' ' + placeText + '!';
    LS.setSalmaBubbleText(hintText, 5000);
    LS.showToast(emoji + ' Sister Hint: ' + hintText);
  };

  function buildSingleBowl(mealType, bowlScale) {
    const g = new THREE.Group();
    const bs = bowlScale || 1.0;

    if (mealType === 'molokhia_chicken') {
      // Eatery signature platter: fluffy white rice, emerald-green molokhia bowl & golden roasted chicken!
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.27, 0.04, 18), LS.makeToonMat(0xfffaf2));
      tray.position.y = 0.025; g.add(tray);
      // Emerald green Molokhia bowl!
      const mBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.10, 0.10, 14), LS.makeToonMat(0xd9a773));
      mBowl.position.set(-0.10, 0.08, -0.05); g.add(mBowl);
      const molokhia = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.02, 14), LS.makeToonMat(0x2d7a36));
      molokhia.position.set(-0.10, 0.125, -0.05); g.add(molokhia);
      // Fluffy white rice mound!
      const rice = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), LS.makeToonMat(0xfffdf8));
      rice.scale.set(1.1, 0.65, 1.1); rice.position.set(0.11, 0.08, -0.04); g.add(rice);
      // Golden roasted chicken piece!
      const chick = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), LS.makeToonMat(0xc86d28));
      chick.scale.set(1.3, 0.72, 0.85); chick.position.set(0.02, 0.08, 0.12); g.add(chick);
    } else if (mealType === 'mai_lasagna') {
      // Mai's warm bubbly homemade layered lasagna!
      const dish = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.34), LS.makeToonMat(0xfffaf0));
      dish.position.y = 0.03; g.add(dish);
      const layer1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.24), LS.makeToonMat(0xc83e2b));
      layer1.position.y = 0.08; g.add(layer1);
      const cheese = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.04, 0.25), LS.makeToonMat(0xf5c85c));
      cheese.position.y = 0.125; g.add(cheese);
      const basil = new THREE.Mesh(new THREE.SphereGeometry(0.036, 7, 6), LS.makeToonMat(0x3a9442));
      basil.position.set(0, 0.155, 0); g.add(basil);
    } else if (mealType === 'yiwan_dumplings' || mealType === 'yiwan_sweet_sour' || mealType === 'yiwan_rice' || mealType === 'yiwan_combo') {
      // Yiwan Restaurant bamboo steamer dumplings, sweet & sour chicken, jasmine rice, or grand combo tray!
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.38), LS.makeToonMat(0x8c2328));
      tray.position.y = 0.02; g.add(tray);
      if (mealType === 'yiwan_dumplings' || mealType === 'yiwan_combo') {
        const bx = mealType === 'yiwan_combo' ? -0.13 : 0;
        const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.09, 14), LS.makeToonMat(0xd9ad6c));
        basket.position.set(bx, 0.08, -0.04); g.add(basket);
        [[-0.04, -0.03], [0.04, -0.03], [0, 0.04]].forEach(dp => {
          const d = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 6), LS.makeToonMat(0xfff5e0));
          d.scale.set(1.2, 0.72, 0.9); d.position.set(bx + dp[0], 0.13, -0.04 + dp[1]); g.add(d);
        });
      }
      if (mealType === 'yiwan_sweet_sour' || mealType === 'yiwan_combo') {
        const sx = mealType === 'yiwan_combo' ? 0.13 : 0;
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.08, 14), LS.makeToonMat(0xfffaf2));
        bowl.position.set(sx, 0.075, -0.04); g.add(bowl);
        [[-0.04, 0, 0xe85d26], [0.04, -0.02, 0xd93829], [0, 0.04, 0xffca3a], [-0.01, -0.04, 0x4ca84c]].forEach(b => {
          const bite = new THREE.Mesh(new THREE.SphereGeometry(0.038, 7, 6), LS.makeToonMat(b[2]));
          bite.position.set(sx + b[0], 0.125, -0.04 + b[1]); g.add(bite);
        });
      }
      if (mealType === 'yiwan_rice' || mealType === 'yiwan_combo') {
        const rz = mealType === 'yiwan_combo' ? 0.11 : 0;
        const rBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.07, 0.08, 12), LS.makeToonMat(0xfffdf8));
        rBowl.position.set(0, 0.075, rz); g.add(rBowl);
        const rTop = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 7), LS.makeToonMat(0xffffff));
        rTop.scale.set(1.0, 0.55, 1.0); rTop.position.set(0, 0.115, rz); g.add(rTop);
      }
    } else if (mealType === 'pasta' || mealType === 'eatery_pasta' || mealType === 'grilled_salmon' || mealType === 'family_pizza') {
      // Warm ceramic dinner plate for Family Dinner at Bella Bistro & Eatery Pasta!
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.04, 16), LS.makeToonMat(0xfffaf2));
      plate.position.y = 0.025;
      g.add(plate);
      const isP = mealType === 'pasta' || mealType === 'eatery_pasta';
      const foodCol = isP ? 0xf4b942 : (mealType === 'grilled_salmon' ? 0xf27d52 : 0xe8a848);
      const mound = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), LS.makeToonMat(foodCol));
      mound.scale.set(1.1, 0.36, 1.0);
      mound.position.y = 0.07;
      g.add(mound);
      const garnish = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), LS.makeToonMat(isP ? 0xd93838 : 0x4ca84c));
      garnish.position.set(0.04, 0.12, 0.03);
      g.add(garnish);
    } else if (mealType === 'tamago' || mealType === 'salmon' || mealType === 'sushi_boat') {
      // Wooden Kyoto geta sushi board with colorful nigiri!
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.24), LS.makeToonMat(0xd4a373));
      board.position.y = 0.03;
      g.add(board);

      const toppings = mealType === 'tamago'
        ? [0xffd166, 0xffd166, 0x264653]
        : (mealType === 'salmon' ? [0xff7b54, 0xff7b54, 0xff9b71] : [0xff7b54, 0xffd166, 0xe63946]);
      toppings.forEach((col, i) => {
        const rice = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.08), LS.makeToonMat(0xffffff));
        rice.position.set(-0.13 + i * 0.13, 0.08, 0);
        const top = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.03, 0.085), LS.makeToonMat(col));
        top.position.set(-0.13 + i * 0.13, 0.12, 0);
        g.add(rice, top);
      });
    } else {
      const bowlMat = LS.makeToonMat(bs < 1 ? 0xe07a34 : 0xb82e2e);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.14, 0.16, 14), bowlMat);
      bowl.position.y = 0.08;
      g.add(bowl);

      const brothColors = { shoyu: 0x7c4820, miso: 0xc27b30, tonkotsu: 0xf2dfc0 };
      const broth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.21, 0.21, 0.02, 14),
        LS.makeToonMat(brothColors[mealType] || 0xc27b30)
      );
      broth.position.y = 0.15;
      g.add(broth);

      const chashu = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.025, 10), LS.makeToonMat(0x9e5838));
      chashu.position.set(-0.07, 0.17, 0.03);
      g.add(chashu);

      const naruto = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 10), LS.makeToonMat(0xffffff));
      naruto.position.set(0.08, 0.17, -0.05);
      g.add(naruto);

      const egg = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), LS.makeToonMat(0xffc947));
      egg.scale.set(1, 0.45, 1.2);
      egg.position.set(0.05, 0.17, 0.08);
      g.add(egg);

      const nori = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.015), LS.makeToonMat(0x1f2e22));
      nori.position.set(0.0, 0.2, -0.16);
      nori.rotation.x = -0.3;
      g.add(nori);
    }

    const sticks = new THREE.Group();
    sticks.position.set(-0.04, 0.28, 0.0);
    const stickMat = LS.makeToonMat(0xd6a667);
    const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.006, 0.34, 6), stickMat);
    s1.rotation.z = 1.1;
    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.006, 0.34, 6), stickMat);
    s2.rotation.z = 1.25;
    s2.position.y = 0.02;
    const bite = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.12, 8), LS.makeToonMat(mealType === 'salmon' ? 0xff7b54 : 0xf5d66b));
    bite.position.set(0.06, -0.05, 0);
    sticks.add(s1, s2, bite);
    g.add(sticks);

    g.scale.setScalar(bs);
    return { group: g, sticks };
  }

  LS.spawnMealProps = function (scene, mealType, diningConfig) {
    const wrapper = new THREE.Group();
    const lailaBowl = buildSingleBowl(mealType, 1.0);
    lailaBowl.group.position.copy(diningConfig.lailaDishPos);
    wrapper.add(lailaBowl.group);

    const salmaBowl = buildSingleBowl(mealType, 0.84);
    salmaBowl.group.position.copy(diningConfig.salmaDishPos);
    wrapper.add(salmaBowl.group);

    const sc = document.createElement('canvas');
    sc.width = 320; sc.height = 96;
    const ctx = sc.getContext('2d');
    ctx.fillStyle = '#fff5dc';
    ctx.strokeStyle = '#d97a2b';
    ctx.lineWidth = 6;
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    const caption = diningConfig.caption || 'Oishii! 😋🍜';
    ctx.strokeText(caption, 160, 60);
    ctx.fillText(caption, 160, 60);
    const oishii = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(sc), transparent: true }));
    oishii.scale.set(1.65, 0.5, 1);
    oishii.position.copy(diningConfig.oishiiPos);
    wrapper.add(oishii);

    scene.add(wrapper);
    return {
      group: wrapper,
      sticks: lailaBowl.sticks,
      salmaSticks: salmaBowl.sticks,
      oishii,
      baseOishiiY: diningConfig.oishiiPos.y
    };
  };

  function setFaceTex(faceMat, tex) {
    faceMat.map = tex;
    if ('emissiveMap' in faceMat && faceMat.emissiveMap !== undefined) {
      faceMat.emissiveMap = tex;
    }
    faceMat.needsUpdate = true;
  }

  function updateBlink(charObj, dt, forceHappy) {
    if (!charObj) return;
    if (forceHappy) {
      if (charObj.faceMat.map !== charObj.happyFaceTex) {
        setFaceTex(charObj.faceMat, charObj.happyFaceTex);
      }
      return;
    }
    charObj.blinkTimer -= dt;
    if (!charObj.isBlinking && charObj.blinkTimer <= 0) {
      charObj.isBlinking = true;
      charObj.blinkTimer = 0.14;
      setFaceTex(charObj.faceMat, charObj.blinkFaceTex);
    } else if (charObj.isBlinking && charObj.blinkTimer <= 0) {
      charObj.isBlinking = false;
      charObj.blinkTimer = 2.4 + Math.random() * 3.2;
      setFaceTex(charObj.faceMat, charObj.openFaceTex);
    }
  }

  LS.applyArticulatedPose = function (charObj, swing, mode, elapsed) {
    if (!charObj || !charObj.leftKnee) return;
    if (mode === 'walk' || mode === 'run') {
      const kBoost = mode === 'run' ? 0.95 : 0.72;
      charObj.leftKnee.rotation.x = Math.max(0.06, swing * kBoost + 0.14);
      charObj.rightKnee.rotation.x = Math.max(0.06, -swing * kBoost + 0.14);
      charObj.leftElbow.rotation.x = -0.22 - Math.max(0, swing * 0.65);
      charObj.rightElbow.rotation.x = -0.22 - Math.max(0, -swing * 0.65);
      charObj.bodyPivot.position.y = Math.abs(Math.sin(Math.abs(swing) * Math.PI)) * (mode === 'run' ? 0.032 : 0.016);
      charObj.bodyPivot.scale.y = 1.0;
    } else if (mode === 'chair_sit') {
      charObj.leftKnee.rotation.x = 1.55;
      charObj.rightKnee.rotation.x = 1.55;
      charObj.leftElbow.rotation.x = -0.82;
      charObj.rightElbow.rotation.x = -0.82;
      charObj.bodyPivot.position.y = -0.382;
      if (elapsed !== undefined) {
        charObj.bodyPivot.scale.y = 1.0 + Math.sin(elapsed * 1.8) * 0.005;
      }
    } else if (mode === 'floor_sit') {
      charObj.leftLeg.rotation.x = -1.54;
      charObj.rightLeg.rotation.x = -1.54;
      charObj.leftLeg.rotation.y = 0.45;
      charObj.rightLeg.rotation.y = -0.45;
      charObj.leftKnee.rotation.x = 0.25;
      charObj.rightKnee.rotation.x = 0.25;
      charObj.leftElbow.rotation.x = -0.52;
      charObj.rightElbow.rotation.x = -0.52;
      charObj.bodyPivot.position.y = -0.715;
    } else if (mode === 'sit') {
      charObj.leftKnee.rotation.x = 1.45;
      charObj.rightKnee.rotation.x = 1.45;
      charObj.leftElbow.rotation.x = -0.55;
      charObj.rightElbow.rotation.x = -0.55;
      charObj.bodyPivot.position.y = 0;
    } else if (mode === 'bike_pedal') {
      charObj.leftKnee.rotation.x = Math.max(0.18, 0.72 - swing * 0.44);
      charObj.rightKnee.rotation.x = Math.max(0.18, 0.72 + swing * 0.44);
      charObj.leftElbow.rotation.x = -0.34;
      charObj.rightElbow.rotation.x = -0.34;
      charObj.bodyPivot.position.y = 0;
    } else {
      // Natural relaxed standing posture + subtle lifelike breathing
      charObj.leftKnee.rotation.x *= 0.82;
      charObj.rightKnee.rotation.x *= 0.82;
      charObj.leftElbow.rotation.x += (-0.11 - charObj.leftElbow.rotation.x) * 0.18;
      charObj.rightElbow.rotation.x += (-0.11 - charObj.rightElbow.rotation.x) * 0.18;
      charObj.bodyPivot.position.y *= 0.82;
      if (elapsed !== undefined) {
        charObj.bodyPivot.scale.y = 1.0 + Math.sin(elapsed * 2.1) * 0.007;
      }
    }
  };

  LS.updateCharacters = function (dt, elapsed, playerPos) {
    const happyNow = Boolean(LS.runtime.eating) || LS.runtime.poseTimer > 0;
    updateBlink(LS.chars.laila, dt, happyNow);
    if (LS.chars.salma) {
      updateBlink(LS.chars.salma, dt, happyNow || LS.runtime.highFiveTimer > 0);
      if (LS.chars.salmaBubble) {
        const hintActive = LS.runtime.salmaHintUntil && Date.now() < LS.runtime.salmaHintUntil;
        LS.chars.salmaBubble.visible = !LS.runtime.eating && (hintActive || (elapsed % 18 < 4.2));
      }
    }
    [LS.chars.laila, LS.chars.salma].forEach((sChar, sIdx) => {
      if (sChar && sChar.swayHair) {
        for (let hi = 0; hi < sChar.swayHair.length; hi++) {
          sChar.swayHair[hi].rotation.z = Math.sin(elapsed * 2.2 + sIdx * 1.4 + hi * 0.6) * 0.055;
        }
      }
    });

    LS.chars.npcs.forEach((npc, idx) => {
      updateBlink(npc.model, dt, false);
      const dist = npc.model.root.position.distanceTo(playerPos);

      if (npc.seated) {
        npc.bubble.visible = dist < 4.5;
        npc.model.leftLeg.rotation.x = -1.55;
        npc.model.rightLeg.rotation.x = -1.55;
        npc.model.leftArm.rotation.x = -0.26;
        npc.model.rightArm.rotation.x = -0.28 + Math.sin(elapsed * 1.4 + idx) * 0.06;
        npc.model.leftArm.rotation.z = -0.06;
        npc.model.rightArm.rotation.z = 0.06;
        LS.applyArticulatedPose(npc.model, 0, 'chair_sit', elapsed + idx);
        return;
      }

      if (dist < 5.8) {
        const targetYaw = Math.atan2(
          playerPos.x - npc.model.root.position.x,
          playerPos.z - npc.model.root.position.z
        );
        let diff = targetYaw - npc.model.root.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        npc.model.root.rotation.y += diff * Math.min(1, dt * 6);
        npc.bubble.visible = true;
        npc.model.leftLeg.rotation.x *= 0.85;
        npc.model.rightLeg.rotation.x *= 0.85;
        npc.model.leftArm.rotation.x *= 0.85;
        LS.applyArticulatedPose(npc.model, 0, 'idle', elapsed + idx * 0.9);
        if (npc.waveOnNear) {
          npc.model.rightArm.rotation.z = -2.4 + Math.sin(elapsed * 7) * 0.35;
          if (npc.model.rightElbow) npc.model.rightElbow.rotation.x = -0.35;
        }
      } else {
        npc.bubble.visible = false;
        if (npc.waveOnNear) {
          npc.model.rightArm.rotation.z = Math.sin(elapsed * 2) * 0.06;
        }
        if (npc.patrol) {
          const p = npc.patrol;
          if (p.axis === 'x') {
            npc.model.root.position.x += npc.dir * p.speed * dt;
            if (npc.model.root.position.x > p.center + p.range) npc.dir = -1;
            if (npc.model.root.position.x < p.center - p.range) npc.dir = 1;
            npc.model.root.rotation.y = npc.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
          } else {
            npc.model.root.position.z += npc.dir * p.speed * dt;
            if (npc.model.root.position.z > p.center + p.range) npc.dir = -1;
            if (npc.model.root.position.z < p.center - p.range) npc.dir = 1;
            npc.model.root.rotation.y = npc.dir > 0 ? 0 : Math.PI;
          }
          const swing = Math.sin(elapsed * 5.5) * 0.45;
          npc.model.leftLeg.rotation.x = swing;
          npc.model.rightLeg.rotation.x = -swing;
          npc.model.leftArm.rotation.x = -swing * 0.7;
          npc.model.rightArm.rotation.x = swing * 0.7;
          LS.applyArticulatedPose(npc.model, swing, 'walk', elapsed);
        } else {
          LS.applyArticulatedPose(npc.model, 0, 'idle', elapsed + idx * 0.9);
        }
      }
    });

    if (LS.updateDynamicBubbleCycling) LS.updateDynamicBubbleCycling(dt);

    if (LS.chars.mochiHeart) {
      if (LS.runtime.mochiHeartTimer > 0) {
        LS.runtime.mochiHeartTimer -= dt;
        LS.chars.mochiHeart.visible = true;
        LS.chars.mochiHeart.position.y = 1.15 + Math.sin(elapsed * 8) * 0.14;
      } else {
        LS.chars.mochiHeart.visible = false;
      }
    }

    if (LS.chars.mochi && !LS.runtime.mochiGame && LS.activeWorld) {
      const anchor = LS.activeWorld.getMochiIdleAnchor ? LS.activeWorld.getMochiIdleAnchor() : null;
      if (anchor) {
        LS.chars.mochi.position.lerp(anchor.pos, Math.min(1, dt * 4));
        LS.chars.mochi.rotation.y = anchor.rotY;
      }
    }
  };
})(window.LailaSalma);
