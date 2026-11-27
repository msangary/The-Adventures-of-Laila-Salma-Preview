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
    { id: 'laila_school', who: 'laila', shop: 'tokyo', name: 'Sunny Yellow Ruffled Dress', desc: 'Butter-yellow ruffled summer sundress & white bow headband', cost: 0, swatch: '#f8dc74',
      style: { topColor: 0xf8dc74, bottomColor: 0xf4d25c, shoeColor: 0xd96055, backpackColor: 0xd96055, hatType: 'none' } },
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
    { id: 'salma_kinder', who: 'salma', shop: 'tokyo', name: 'Sunnyside Tee & Coral Skirt', desc: 'Crisp white short-sleeve tee, coral skirt & terracotta headband', cost: 0, swatch: '#d96b5a',
      style: { topColor: 0xf9f8f5, bottomColor: 0xd96b5a, shoeColor: 0xc87238, backpackColor: 0xd97b38, hatType: 'none', hatColor: 0xfacc15 } },
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
    const addOut = (LS.ghibli && LS.ghibli.addInkOutline) ? LS.ghibli.addInkOutline : function () {};

    // Studio Ghibli brushed hair sheen multiplied cleanly by each NPC's true hairHex (rich espresso/chestnut/gold/silver!)
    if (!buildRealisticHDCharacter._neutralHairTex) {
      buildRealisticHDCharacter._neutralHairTex = createPaintedSisterHairTex('#9e9892', '#ccc5be', '#ebe2d8');
    }
    const hairMat = new THREE.MeshStandardMaterial({
      color: hairHex,
      map: buildRealisticHDCharacter._neutralHairTex,
      roughness: 0.46,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const topMat = LS.makeToonMat(cfg.topColor !== undefined ? cfg.topColor : 0xffffff, {
      map: fabTex || undefined
    });
    const bottomMat = LS.makeToonMat(cfg.bottomColor !== undefined ? cfg.bottomColor : 0x2d4373, {
      map: cfg.pants ? (fabTex || undefined) : getNeutralPleatTex()
    });
    const shoeMat = LS.makeToonMat(cfg.shoeColor !== undefined ? cfg.shoeColor : 0xd94c4c);
    const soleMat = LS.makeToonMat(0xf4f1ea);
    const bpMat = LS.makeToonMat(cfg.backpackColor !== undefined ? cfg.backpackColor : 0xc92c3b);

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
      addOut(upper, 0.034);
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

    // 2. Anatomical Torso, Pelvis, Collar, 3D Pleated Skirt/Belt & Rounded Backpack with Straps
    const torso = new THREE.Mesh(geos.torso, topMat);
    torso.position.y = 0.805;
    torso.castShadow = true;
    torso.receiveShadow = true;
    addOut(torso, 0.024);
    bodyPivot.add(torso);

    // Natural Neck & Collarbone Transition
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.058, 0.145, 14), skinMat);
    neck.position.y = 1.415;
    neck.castShadow = true;
    bodyPivot.add(neck);

    // Crisp Woven Shirt Collar / Neckline Trim
    const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.014, 8, 18), LS.makeToonMat(0xfffaf0));
    collarRing.rotation.x = Math.PI / 2 + 0.14;
    collarRing.position.set(0, 1.372, 0.008);
    bodyPivot.add(collarRing);

    if (!cfg.pants) {
      // Studio Ghibli 3D Radial-Pleated A-Line Skirt + Waist Sash + Soft Lace Hem (matches Laila & Salma!)
      if (!buildRealisticHDCharacter._npcSkirtGeo) {
        buildRealisticHDCharacter._npcSkirtGeo = createPleatedSkirtMeshGeo([
          new THREE.Vector2(0.245, 0.45),
          new THREE.Vector2(0.260, 0.47),
          new THREE.Vector2(0.228, 0.59),
          new THREE.Vector2(0.175, 0.76),
          new THREE.Vector2(0.142, 0.89)
        ], 36, 14, 0.034);
      }
      const skirt = new THREE.Mesh(buildRealisticHDCharacter._npcSkirtGeo, bottomMat);
      skirt.scale.set(1.0, 1.0, 0.84);
      skirt.castShadow = true;
      skirt.receiveShadow = true;
      addOut(skirt, 0.022);
      bodyPivot.add(skirt);
      const waistBand = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.018, 8, 22), LS.makeToonMat(0xfff4e0));
      waistBand.rotation.x = Math.PI / 2;
      waistBand.scale.set(1.0, 0.84, 1.0);
      waistBand.position.y = 0.888;
      bodyPivot.add(waistBand);
    } else {
      // Tailored Trouser Pelvis + Leather Belt & Brass Buckle
      const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.156, 18, 12), bottomMat);
      pelvis.scale.set(1.0, 0.72, 0.70);
      pelvis.position.y = 0.815;
      pelvis.castShadow = true;
      addOut(pelvis, 0.024);
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
    headGroup.position.y = 1.588;
    // Cohesive Studio Ghibli head-to-body ratio aligned cleanly with Laila & Salma (adults ~0.27m head, kids ~0.22-0.25m)
    const headRatio = isSalmaPortrait ? 1.24 : (isLailaPortrait ? 1.22 : (s < 0.75 ? 1.28 : (s < 0.88 ? 1.24 : 1.20)));
    headGroup.scale.setScalar(headRatio);
    bodyPivot.add(headGroup);

    const headMesh = new THREE.Mesh(isSalmaPortrait ? geos.headSalma : geos.head, skinMat);
    if (cfg.faceOpts && cfg.faceOpts.charismaticMale) {
      headMesh.scale.set(0.95, 1.05, 1.0);
    }
    if (cfg.bald) skinMat.roughness = 0.44;
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    addOut(headMesh, 0.022);
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
      addOut(hairCap, 0.024);
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
        addOut(curtain, 0.024);
        headGroup.add(curtain);

        [-1, 1].forEach(side => {
          const sLock = new THREE.Mesh(geos.pigtailCurl, hairMat);
          sLock.scale.set(0.58, 1.38, 0.72);
          sLock.position.set(side * 0.118, 0.012, 0.012);
          sLock.rotation.z = side * 0.06;
          addOut(sLock, 0.026);
          headGroup.add(sLock);
        });
      } else if (cfg.pigtails) {
        const nape = new THREE.Mesh(new THREE.SphereGeometry(0.120, 16, 10), hairMat);
        nape.scale.set(1.02, 0.78, 0.68);
        nape.position.set(0, -0.028, -0.066);
        headGroup.add(nape);

        const tieMat = LS.makeToonMat(0xf59e0b);
        [-1, 1].forEach(side => {
          const tie = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.009, 8, 14), tieMat);
          tie.position.set(side * 0.124, -0.008, -0.038);
          tie.rotation.y = side * 0.65;
          headGroup.add(tie);

          const curl = new THREE.Mesh(geos.pigtailCurl, hairMat);
          curl.position.set(side * 0.130, -0.008, -0.042);
          curl.rotation.set(0.08, 0, side * 0.26);
          curl.castShadow = true;
          addOut(curl, 0.026);
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
        addOut(bun, 0.028);
        headGroup.add(bun);

        const bunTie = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.008, 8, 16), LS.makeToonMat(0xd94848));
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
    modelWrap.scale.setScalar(0.76);
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

    // 1. REAL 3D PLEATED SKIRT + SCALLOPED LACE PETTICOAT + WAIST BOW (graceful world-aligned width!)
    const skirtPts = [
      new THREE.Vector2(0.245, 0.42),
      new THREE.Vector2(0.270, 0.44),
      new THREE.Vector2(0.232, 0.56),
      new THREE.Vector2(0.175, 0.74),
      new THREE.Vector2(0.138, 0.86)
    ];
    const skirt = new THREE.Mesh(createPleatedSkirtMeshGeo(skirtPts, 40, 16, 0.036), bottomMat);
    skirt.castShadow = true; addOut(skirt, 0.022);
    bodyPivot.add(skirt);

    const lacePts = [new THREE.Vector2(0.232, 0.395), new THREE.Vector2(0.252, 0.425), new THREE.Vector2(0.220, 0.48)];
    bodyPivot.add(new THREE.Mesh(createPleatedSkirtMeshGeo(lacePts, 32, 18, 0.032), laceMat));

    const sash = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.020, 8, 24), accentMat);
    sash.rotation.x = Math.PI / 2; sash.position.y = 0.855; bodyPivot.add(sash);
    const backBow = buildSisterBow(accentMat, 0.92);
    backBow.position.set(0, 0.84, -0.146); backBow.rotation.y = Math.PI; bodyPivot.add(backBow);

    // 2. SCULPTED BLOUSE TORSO, NECK & COLLAR (graceful Miyazaki anime width!)
    const torsoPts = [
      new THREE.Vector2(0.128, 0.84), new THREE.Vector2(0.154, 0.98),
      new THREE.Vector2(0.160, 1.13), new THREE.Vector2(0.120, 1.25),
      new THREE.Vector2(0.066, 1.30)
    ];
    const torso = new THREE.Mesh(new THREE.LatheGeometry(torsoPts, 24), topMat);
    torso.scale.set(1.0, 1.0, 0.80); torso.castShadow = true; addOut(torso, 0.022);
    bodyPivot.add(torso);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.055, 0.14, 12), skinMat);
    neck.position.y = 1.315; bodyPivot.add(neck);

    if (!isSalma) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.106, 0.184, 0.175, 20), bottomMat);
      collar.scale.set(1.06, 1, 0.84); collar.position.y = 1.21; bodyPivot.add(collar);
      const cTrim = new THREE.Mesh(new THREE.TorusGeometry(0.170, 0.009, 6, 22), laceMat);
      cTrim.rotation.x = Math.PI / 2; cTrim.scale.set(1.04, 0.84, 1); cTrim.position.y = 1.138; bodyPivot.add(cTrim);
      const fBow = buildSisterBow(accentMat, 0.88);
      fBow.position.set(0, 1.125, 0.146); bodyPivot.add(fBow);
    } else {
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.114, 0.024, 8, 22), laceMat);
      collar.rotation.x = Math.PI / 2; collar.scale.set(1.04, 0.84, 1); collar.position.y = 1.245; bodyPivot.add(collar);
      [-0.076, 0.076].forEach(sx => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.36, 0.022), bottomMat);
        strap.position.set(sx, 1.04, 0.126); strap.rotation.x = -0.10; bodyPivot.add(strap);
        const btn = new THREE.Mesh(new THREE.SphereGeometry(0.014, 7, 6), brassMat);
        btn.position.set(sx, 0.90, 0.142); bodyPivot.add(btn);
      });
      const fBow = buildSisterBow(accentMat, 0.76);
      fBow.position.set(0, 1.19, 0.135); bodyPivot.add(fBow);
    }

    // 3. ROUNDED STORYBOOK SATCHEL BACKPACK
    const packG = new THREE.Group();
    packG.position.set(0, 1.03, -0.155);
    const pMain = new THREE.Mesh(new THREE.SphereGeometry(0.145, 16, 12), bpMat);
    pMain.scale.set(0.92, 1.08, 0.56); pMain.castShadow = true; addOut(pMain, 0.030); packG.add(pMain);
    const pFlap = new THREE.Mesh(new THREE.SphereGeometry(0.132, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), bpMat);
    pFlap.scale.set(0.95, 0.65, 0.62); pFlap.position.set(0, 0.062, -0.016); packG.add(pFlap);
    [-0.046, 0.046].forEach(bx => {
      const buck = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.030, 0.016), brassMat);
      buck.position.set(bx, 0.016, -0.082); packG.add(buck);
    });
    bodyPivot.add(packG);

    // 4. ARTICULATED LEGS WITH KNEE PIVOTS, ANKLE SOCKS & MARY-JANE SHOES
    function makeSisterLeg(lx) {
      const leg = new THREE.Group();
      leg.position.set(lx, 0.56, 0);
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.046, 0.24, 12), skinMat);
      thigh.position.y = -0.12; thigh.castShadow = true; leg.add(thigh);
      const knee = new THREE.Group();
      knee.position.set(0, -0.24, 0);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.20, 12), skinMat);
      shin.position.y = -0.10; shin.castShadow = true; knee.add(shin);
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.039, 0.16, 12), sockMat);
      sock.position.y = -0.15; knee.add(sock);
      const sockCuff = new THREE.Mesh(new THREE.TorusGeometry(0.043, 0.009, 7, 16), sockMat);
      sockCuff.rotation.x = Math.PI / 2; sockCuff.position.y = -0.07; knee.add(sockCuff);
      const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.058, 14, 10), shoeMat);
      shoe.scale.set(0.92, 0.68, 1.52); shoe.position.set(0, -0.268, 0.030); shoe.castShadow = true;
      addOut(shoe, 0.036); knee.add(shoe);
      const strap = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.008, 6, 14, Math.PI), shoeMat);
      strap.position.set(0, -0.242, 0.028); strap.rotation.x = 0.25; knee.add(strap);
      leg.add(knee);
      return { leg, knee };
    }
    const lLeg = makeSisterLeg(-0.082);
    const rLeg = makeSisterLeg(0.082);
    bodyPivot.add(lLeg.leg, rLeg.leg);

    // 5. BELL SLEEVES + ARTICULATED ELBOW ARMS + HANDS WITH THUMBS
    const sleevePts = [
      new THREE.Vector2(0.044, -0.15), new THREE.Vector2(0.068, -0.095),
      new THREE.Vector2(0.072, -0.03), new THREE.Vector2(0.054, 0.025),
      new THREE.Vector2(0.026, 0.045)
    ];
    const sleeveGeo = new THREE.LatheGeometry(sleevePts, 16);
    function makeSisterArm(ax) {
      const arm = new THREE.Group();
      arm.position.set(ax, 1.21, 0.01);
      const puff = new THREE.Mesh(sleeveGeo, topMat);
      puff.castShadow = true; addOut(puff, 0.030); arm.add(puff);
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.043, 0.009, 6, 14), isSalma ? accentMat : bottomMat);
      cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.145; arm.add(cuff);
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.033, 0.14, 10), skinMat);
      upperArm.position.y = -0.175; arm.add(upperArm);
      const elbow = new THREE.Group();
      elbow.position.set(0, -0.245, 0);
      elbow.rotation.x = -0.18;
      elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.033, 8, 7), skinMat));
      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.028, 0.17, 10), skinMat);
      foreArm.position.y = -0.085; foreArm.castShadow = true; elbow.add(foreArm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.037, 10, 8), skinMat);
      hand.scale.set(0.88, 1.15, 0.72); hand.position.y = -0.188; elbow.add(hand);
      const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.014, 7, 6), skinMat);
      thumb.position.set(ax < 0 ? 0.026 : -0.026, -0.178, 0.018); elbow.add(thumb);
      arm.add(elbow);
      arm.rotation.z = ax < 0 ? -0.14 : 0.14;
      return { arm, elbow };
    }
    const lArm = makeSisterArm(-0.162);
    const rArm = makeSisterArm(0.162);
    bodyPivot.add(lArm.arm, rArm.arm);

    // 6. PHOTO-EXACT SCULPTED HEAD + 3D EARS + NATURAL BLINKING (aligned to Mom/Dad & world width!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.485, 0.01);
    headGroup.scale.setScalar(0.75);
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

  // Dedicated Next-Gen Photo-Matched Parent Builder (Mom & Dad from custom watercolor portraits!)
  function buildNextGenPhotoParent(cfg) {
    const isMom = cfg.portraitStyle === 'mom';
    const geos = getHDHumanGeos();
    const root = new THREE.Group();
    const s = cfg.scale || (isMom ? 0.90 : 0.94);
    const addOut = (LS.ghibli && LS.ghibli.addInkOutline) ? LS.ghibli.addInkOutline : function () {};
    const fabTex = LS.createFabricTexture ? LS.createFabricTexture() : null;

    // Exact skin hex matched seamlessly to extracted feathered dad_face.jpg / mom_face.jpg
    const skinHex = isMom ? 0xf0ceae : 0xeeccad;
    const skinCol = new THREE.Color(skinHex);
    const skinMat = (LS.ghibli && LS.ghibli.createGhibliSkinMat)
      ? LS.ghibli.createGhibliSkinMat(skinHex, null)
      : LS.makeToonMat(skinHex);

    // Rich glossy Studio Ghibli brushed hair tailored to each parent's portrait
    const hairTex = isMom
      ? createPaintedSisterHairTex('#19181a', '#2e2c32', '#4c4952')
      : createPaintedSisterHairTex('#201f22', '#353439', '#5a5960');
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: hairTex,
      roughness: 0.44,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    const topColor = cfg.topColor !== undefined ? cfg.topColor : (isMom ? 0xeba0ab : 0xf8f6f2);
    const bottomColor = cfg.bottomColor !== undefined ? cfg.bottomColor : (isMom ? 0x3d5a80 : 0x2b3a4a);
    const shoeColor = cfg.shoeColor !== undefined ? cfg.shoeColor : (isMom ? 0x8b4c56 : 0x4b3426);

    const topMat = LS.makeToonMat(topColor, { map: fabTex || undefined });
    const collarMat = LS.makeToonMat(isMom ? 0xf2aeb8 : 0xffffff);
    const bottomMat = LS.makeToonMat(bottomColor, {
      map: cfg.pants ? (fabTex || undefined) : getNeutralPleatTex()
    });
    const shoeMat = LS.makeToonMat(shoeColor);
    const soleMat = LS.makeToonMat(0xf4f1ea);
    const bpMat = LS.makeToonMat(0x555555);

    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);
    const hipY = 0.835;

    // 1. Articulated Legs (supports full seated armchair pose cleanly!)
    function makeParentLeg(sideX) {
      const leg = new THREE.Group();
      leg.position.set(sideX, hipY, 0);
      const thighMat = cfg.pants ? bottomMat : skinMat;
      const thigh = new THREE.Mesh(cfg.pants ? geos.pantThigh : geos.thigh, thighMat);
      thigh.castShadow = true; thigh.receiveShadow = true;
      leg.add(thigh);

      const knee = new THREE.Group();
      knee.position.set(0, -0.375, 0);
      knee.add(new THREE.Mesh(new THREE.SphereGeometry(cfg.pants ? 0.050 : 0.046, 12, 10), thighMat));
      const calf = new THREE.Mesh(cfg.pants ? geos.pantCalf : geos.calf, thighMat);
      calf.castShadow = true; calf.receiveShadow = true;
      knee.add(calf);

      if (!cfg.pants) {
        const sockMat = LS.makeToonMat(0xfaf8f5);
        knee.add(new THREE.Mesh(geos.sock, sockMat));
      } else {
        const hem = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.007, 8, 16), bottomMat);
        hem.rotation.x = Math.PI / 2; hem.position.y = -0.352;
        knee.add(hem);
      }

      const shoeG = new THREE.Group();
      shoeG.position.set(0, -0.388, 0.025);
      const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.050, 0.053, 0.024, 14), soleMat);
      sole.scale.set(0.92, 1.0, 1.92); sole.position.set(0, -0.046, 0.016); sole.castShadow = true;
      shoeG.add(sole);
      const upper = new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.56), shoeMat);
      upper.scale.set(0.90, 1.05, 1.85); upper.position.set(0, -0.036, 0.015); upper.castShadow = true;
      addOut(upper, 0.032);
      shoeG.add(upper);
      knee.add(shoeG);
      leg.add(knee);
      return { leg, knee };
    }
    const lLeg = makeParentLeg(-0.088);
    const rLeg = makeParentLeg(0.088);
    bodyPivot.add(lLeg.leg, rLeg.leg);

    // 2. Tailored Collared Button-Up Shirt / Blouse + Open V-Neckline + Medallion Necklace (Mom) / Placket
    const torso = new THREE.Mesh(geos.torso, topMat);
    torso.position.y = 0.805;
    if (!isMom) torso.scale.set(1.06, 1.0, 1.02);
    torso.castShadow = true; torso.receiveShadow = true;
    addOut(torso, 0.024);
    bodyPivot.add(torso);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.060, 0.155, 14), skinMat);
    neck.position.y = 1.415; neck.castShadow = true;
    bodyPivot.add(neck);

    // Open V-neck skin triangle peeking cleanly between the folded shirt collar lapels!
    const vSkin = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.145, 10), skinMat);
    vSkin.rotation.x = Math.PI;
    vSkin.scale.set(1.0, 1.0, 0.36);
    vSkin.position.set(0, 1.318, 0.098);
    bodyPivot.add(vSkin);

    // Folded Back & Side Button-Up Collar Band + Structured Left & Right Collar Lapels
    const collarBack = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.016, 8, 18, Math.PI * 1.4), collarMat);
    collarBack.rotation.set(Math.PI / 2 + 0.14, 0, Math.PI * 0.8);
    collarBack.position.set(0, 1.375, 0.002);
    bodyPivot.add(collarBack);
    [-1, 1].forEach(side => {
      const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.088, 0.018), collarMat);
      lapel.position.set(side * 0.056, 1.338, 0.092);
      lapel.rotation.set(-0.14, side * -0.34, side * 0.36);
      addOut(lapel, 0.028);
      bodyPivot.add(lapel);
    });

    // Subtle Center Shirt Placket + Pearl Buttons (both Dad's crisp white shirt & Mom's blush-pink blouse!)
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.36, 0.010), collarMat);
    placket.position.set(0, 1.075, 0.112);
    bodyPivot.add(placket);
    const btnMat = LS.makeToonMat(isMom ? 0xffe6ec : 0xe5dfd5);
    [1.22, 1.12, 1.02].forEach(by => {
      const btn = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 8, 6), btnMat);
      btn.scale.set(1.0, 1.0, 0.45);
      btn.position.set(0, by, 0.119);
      bodyPivot.add(btn);
    });

    if (isMom) {
      // MOM'S SIGNATURE SILVER CHAIN & ROUND FILIGREE MEDALLION NECKLACE (from 1795782475108.jpg!)
      const silverMat = new THREE.MeshStandardMaterial({ color: 0xd8dfe8, roughness: 0.26, metalness: 0.78 });
      const silverDark = new THREE.MeshStandardMaterial({ color: 0x8d97a4, roughness: 0.36, metalness: 0.65 });
      const chainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.044, 1.385, 0.052),
        new THREE.Vector3(-0.032, 1.315, 0.112),
        new THREE.Vector3(-0.008, 1.242, 0.124),
        new THREE.Vector3(0.016, 1.315, 0.112),
        new THREE.Vector3(0.044, 1.385, 0.052)
      ]);
      const chain = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 18, 0.0038, 6, false), silverMat);
      bodyPivot.add(chain);

      const medG = new THREE.Group();
      medG.position.set(-0.008, 1.220, 0.128);
      medG.rotation.x = -0.14;
      const medOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.007, 16), silverMat);
      medOuter.rotation.x = Math.PI / 2;
      addOut(medOuter, 0.05);
      medG.add(medOuter);
      const medInner = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.009, 14), silverDark);
      medInner.rotation.x = Math.PI / 2;
      medG.add(medInner);
      const medCore = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6), silverMat);
      medCore.position.z = 0.004;
      medG.add(medCore);
      bodyPivot.add(medG);

      // Mom's tailored 3D radial-pleated navy/denim skirt + cream sash
      if (!buildRealisticHDCharacter._npcSkirtGeo) {
        buildRealisticHDCharacter._npcSkirtGeo = createPleatedSkirtMeshGeo([
          new THREE.Vector2(0.245, 0.45),
          new THREE.Vector2(0.260, 0.47),
          new THREE.Vector2(0.228, 0.59),
          new THREE.Vector2(0.175, 0.76),
          new THREE.Vector2(0.142, 0.89)
        ], 36, 14, 0.034);
      }
      const skirt = new THREE.Mesh(buildRealisticHDCharacter._npcSkirtGeo, bottomMat);
      skirt.scale.set(1.0, 1.0, 0.84); skirt.castShadow = true; skirt.receiveShadow = true;
      addOut(skirt, 0.022);
      bodyPivot.add(skirt);
      const waistBand = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.017, 8, 22), LS.makeToonMat(0xfff4e0));
      waistBand.rotation.x = Math.PI / 2; waistBand.scale.set(1.0, 0.84, 1.0); waistBand.position.y = 0.888;
      bodyPivot.add(waistBand);
    } else {
      // Dad's tailored trousers pelvis + dark leather belt & brass buckle
      const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.158, 18, 12), bottomMat);
      pelvis.scale.set(1.04, 0.72, 0.72); pelvis.position.y = 0.815; pelvis.castShadow = true;
      addOut(pelvis, 0.024);
      bodyPivot.add(pelvis);
      const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.150, 0.153, 0.036, 20), LS.makeToonMat(0x3a261a));
      belt.scale.set(1.03, 1.0, 0.72); belt.position.y = 0.885;
      bodyPivot.add(belt);
      const buckle = new THREE.Mesh(
        new THREE.BoxGeometry(0.044, 0.040, 0.016),
        new THREE.MeshStandardMaterial({ color: 0xdcb45c, roughness: 0.30, metalness: 0.75 })
      );
      buckle.position.set(0, 0.885, 0.110);
      bodyPivot.add(buckle);
    }

    // 3. Articulated Shirt-Sleeve Arms & Hands
    function makeParentArm(sideX) {
      const side = sideX < 0 ? -1 : 1;
      const arm = new THREE.Group();
      arm.position.set(sideX, 1.325, 0);
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.056, 12, 10), topMat);
      shoulder.scale.set(0.95, 1.05, 0.95); arm.add(shoulder);
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.041, 0.25, 12), topMat);
      upperArm.position.y = -0.125; upperArm.castShadow = true; addOut(upperArm, 0.028); arm.add(upperArm);

      const elbow = new THREE.Group();
      elbow.position.set(0, -0.255, 0);
      elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.040, 10, 8), topMat));
      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(0.039, 0.033, 0.22, 12), isMom ? topMat : topMat);
      foreArm.position.y = -0.11; foreArm.castShadow = true; elbow.add(foreArm);
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.008, 6, 12), collarMat);
      cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.21; elbow.add(cuff);

      const hand = new THREE.Group();
      hand.position.set(0, -0.228, 0.004);
      const palm = new THREE.Mesh(new THREE.SphereGeometry(0.031, 10, 8), skinMat);
      palm.scale.set(0.62, 1.15, 0.92); palm.position.y = -0.022; hand.add(palm);
      const fingers = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.052, 10), skinMat);
      fingers.scale.set(0.55, 1.0, 1.12); fingers.position.set(0, -0.060, 0.006); fingers.rotation.x = -0.14; hand.add(fingers);
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.034, 8), skinMat);
      thumb.position.set(-side * 0.012, -0.034, 0.024); thumb.rotation.set(0.45, 0, side * 0.25); hand.add(thumb);
      elbow.add(hand);
      arm.add(elbow);
      return { arm, elbow };
    }
    const lArm = makeParentArm(isMom ? -0.168 : -0.180);
    const rArm = makeParentArm(isMom ? 0.168 : 0.180);
    bodyPivot.add(lArm.arm, rArm.arm);

    // 4. ORTHOGRAPHIC FRONT-PLANAR PHOTO-MATCHED HEAD (Zero Distortion, Seamless Skin, Natural Blink!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.595, 0.008);
    const headR = isMom ? 0.152 : 0.156;
    const openFaceTex = (LS.ghibli && LS.ghibli.getPaintedTex)
      ? LS.ghibli.getPaintedTex(isMom ? 'momFace' : 'dadFace', 1, 1)
      : null;
    const blinkFaceTex = (LS.ghibli && LS.ghibli.getPaintedTex)
      ? LS.ghibli.getPaintedTex(isMom ? 'momFaceBlink' : 'dadFaceBlink', 1, 1)
      : openFaceTex;
    const faceMat = (LS.ghibli && LS.ghibli.createGhibliSkinMat)
      ? LS.ghibli.createGhibliSkinMat(0xffffff, openFaceTex)
      : new THREE.MeshBasicMaterial({ map: openFaceTex });

    const headGeo = createPhotoHeadGeo(headR, true);
    const headMesh = new THREE.Mesh(headGeo, [faceMat, skinMat]);
    headMesh.scale.set(isMom ? 0.96 : 0.95, isMom ? 1.03 : 1.08, 0.96);
    headMesh.castShadow = true; headMesh.receiveShadow = true;
    addOut(headMesh, 0.022);
    headGroup.add(headMesh);

    // Sculpted 3D Ears
    const earInnerMat = LS.makeToonMat(skinCol.clone().multiplyScalar(0.84));
    [-1, 1].forEach(side => {
      const earG = new THREE.Group();
      earG.position.set(side * (headR * 0.92), -0.012, -0.008);
      earG.rotation.y = side * 0.22;
      const helix = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), skinMat);
      helix.scale.set(0.36, 1.15, 0.72); earG.add(helix);
      const concha = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 6), earInnerMat);
      concha.scale.set(0.28, 0.92, 0.55); concha.position.set(side * 0.003, -0.002, 0.004); earG.add(concha);
      headGroup.add(earG);
    });

    const swayHair = [];

    if (!isMom) {
      // DAD'S PORTRAIT HAIR (1795782470901.jpg): Short textured wavy charcoal-black hair + subtle salt-and-pepper temples + jawline beard continuity!
      const crown = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.045, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
      crown.scale.set(0.98, 1.04, 1.01);
      crown.position.set(0, 0.024, -0.014);
      crown.rotation.x = -0.34;
      crown.castShadow = true;
      addOut(crown, 0.024);
      headGroup.add(crown);

      // Textured short wavy top curls along the crown & natural masculine hairline!
      [
        [0.0, 0.148, 0.056, 0.062, 0.036, 0.048, 0.15, 0],
        [-0.062, 0.142, 0.046, 0.055, 0.034, 0.044, 0.12, 0.25],
        [0.064, 0.140, 0.046, 0.054, 0.034, 0.044, 0.12, -0.25],
        [-0.095, 0.118, 0.022, 0.044, 0.034, 0.048, 0.05, 0.35],
        [0.095, 0.118, 0.022, 0.044, 0.034, 0.048, 0.05, -0.35],
        [0.0, 0.162, -0.015, 0.078, 0.038, 0.068, -0.08, 0]
      ].forEach(c => {
        const tuft = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), hairMat);
        tuft.scale.set(c[3], c[4], c[5]);
        tuft.position.set(c[0], c[1], c[2]);
        tuft.rotation.set(c[6], 0, c[7]);
        headGroup.add(tuft);
      });

      // Neat cropped nape + subtle salt-and-pepper sideburns/temples
      const nape = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.96, 16, 12), hairMat);
      nape.scale.set(0.95, 0.86, 0.72);
      nape.position.set(0, -0.018, -0.068);
      addOut(nape, 0.022);
      headGroup.add(nape);

      const saltMat = LS.makeToonMat(0x525258);
      [-1, 1].forEach(side => {
        const temple = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.092, 0.056), saltMat);
        temple.position.set(side * (headR * 0.92), 0.028, -0.008);
        temple.rotation.z = side * 0.08;
        headGroup.add(temple);
        // Subtle lower-jaw beard continuity connecting temple sideburns to the front photo beard!
        const jawBeard = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), hairMat);
        jawBeard.scale.set(0.42, 0.92, 1.18);
        jawBeard.position.set(side * (headR * 0.72), -0.072, 0.022);
        jawBeard.rotation.set(0.24, side * -0.28, side * -0.22);
        headGroup.add(jawBeard);
      });
    } else {
      // MOM'S PORTRAIT HAIR (1795782475108.jpg): Center-parted voluminous shoulder-length wavy glossy black hair!
      const crown = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.07, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
      crown.scale.set(1.04, 1.04, 1.02);
      crown.position.set(0, 0.022, -0.012);
      crown.rotation.x = -0.32;
      crown.castShadow = true;
      addOut(crown, 0.024);
      headGroup.add(crown);

      // Center-parted lush side-swept top bangs framing Mom's forehead softly
      [-1, 1].forEach(side => {
        const sweep = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.48, 14, 10), hairMat);
        sweep.scale.set(1.18, 0.48, 0.72);
        sweep.position.set(side * headR * 0.42, headR * 0.76, headR * 0.56);
        sweep.rotation.set(0.24, side * 0.34, -side * 0.46);
        addOut(sweep, 0.020);
        headGroup.add(sweep);
      });

      const hairBack = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.06, 20, 14), hairMat);
      hairBack.scale.set(1.06, 1.12, 0.78);
      hairBack.position.set(0, -0.028, -headR * 0.48);
      addOut(hairBack, 0.022);
      headGroup.add(hairBack);

      // Cascading voluminous S-curved wavy shoulder-length locks over BOTH shoulders!
      [-1, 1].forEach(side => {
        const waveG = new THREE.Group();
        const w1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.132, 0.075, 0.030),
          new THREE.Vector3(side * 0.172, -0.035, 0.048),
          new THREE.Vector3(side * 0.145, -0.155, 0.082),
          new THREE.Vector3(side * 0.180, -0.275, 0.098),
          new THREE.Vector3(side * 0.145, -0.375, 0.105)
        ]);
        const m1 = new THREE.Mesh(createTaperedHairStrand(w1, 14, 0.044, 0.056, 0.014, 0.64), hairMat);
        m1.castShadow = true; addOut(m1, 0.022); waveG.add(m1);

        const w2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.138, 0.040, -0.035),
          new THREE.Vector3(side * 0.185, -0.085, -0.020),
          new THREE.Vector3(side * 0.158, -0.215, 0.018),
          new THREE.Vector3(side * 0.192, -0.335, 0.035),
          new THREE.Vector3(side * 0.165, -0.415, 0.042)
        ]);
        const m2 = new THREE.Mesh(createTaperedHairStrand(w2, 14, 0.046, 0.060, 0.014, 0.60), hairMat);
        m2.castShadow = true; addOut(m2, 0.020); waveG.add(m2);

        const w3 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.118, 0.055, 0.072),
          new THREE.Vector3(side * 0.146, -0.075, 0.082),
          new THREE.Vector3(side * 0.125, -0.205, 0.105),
          new THREE.Vector3(side * 0.112, -0.320, 0.112)
        ]);
        waveG.add(new THREE.Mesh(createTaperedHairStrand(w3, 10, 0.026, 0.034, 0.008, 0.58), hairMat));

        headGroup.add(waveG);
        swayHair.push(waveG);
      });

      // Voluminous wavy back shoulder curtain
      for (let bl = -2; bl <= 2; bl++) {
        const bx = bl * 0.064;
        const bc = new THREE.CatmullRomCurve3([
          new THREE.Vector3(bx * 0.85, 0.02, -0.125),
          new THREE.Vector3(bx * 1.15, -0.11, -0.152),
          new THREE.Vector3(bx * 1.02, -0.25, -0.138),
          new THREE.Vector3(bx * 1.12, -0.38 - (2 - Math.abs(bl)) * 0.02, -0.120)
        ]);
        const bm = new THREE.Mesh(createTaperedHairStrand(bc, 10, 0.038, 0.048, 0.010, 0.56), hairMat);
        addOut(bm, 0.018); headGroup.add(bm);
      }
    }

    const hatSlot = new THREE.Group();
    headGroup.add(hatSlot);
    bodyPivot.add(headGroup);

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
      signatureBand: null,
      swayHair,
      faceMat,
      openFaceTex,
      blinkFaceTex,
      happyFaceTex: openFaceTex,
      blinkTimer: isMom ? 3.8 : 4.6,
      isBlinking: false
    };
  }

  let cachedWatercolorHairTex = null;
  function getWatercolorHairStrandTex() {
    if (cachedWatercolorHairTex) return cachedWatercolorHairTex;
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#cfcac4';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 84; i++) {
      const x = (i / 84) * 256 + Math.sin(i * 1.9) * 2.5;
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(255,250,242,0.22)' : (i % 3 === 1 ? 'rgba(40,32,28,0.22)' : 'rgba(90,78,70,0.14)');
      ctx.lineWidth = 1.4 + (i % 3) * 0.7;
      ctx.beginPath(); ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + Math.sin(i) * 4, 85, x - Math.cos(i) * 4, 170, x, 256);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    cachedWatercolorHairTex = tex;
    return tex;
  }

  let cachedNouziFloralTex = null;
  function getNouziFloralTex() {
    if (cachedNouziFloralTex) return cachedNouziFloralTex;
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#4a5058';
    ctx.fillRect(0, 0, 256, 256);
    const petals = ['#f2e6d8', '#e6b8b0', '#c8c0b4', '#9aa69e'];
    for (let i = 0; i < 42; i++) {
      const fx = ((i * 73) % 236) + 10;
      const fy = ((i * 107) % 236) + 10;
      ctx.fillStyle = petals[i % petals.length];
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(fx + Math.cos(a) * 5.2, fy + Math.sin(a) * 5.2, 3.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#d4a359';
      ctx.beginPath(); ctx.arc(fx, fy, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    cachedNouziFloralTex = tex;
    return tex;
  }

  // Smooth Organic Studio Ghibli / Nintendo Head Sculpting (shared by head mesh + curved transparent face decal!)
  function applyGhibliHeadSculpt(geo, radius, isChild) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const nx = x / radius, ny = y / radius, nz = z / radius;
      // Soft tapered anime chin & graceful oval jawline
      if (ny < 0) {
        const t = Math.min(1, -ny);
        const jawTaper = isChild ? 0.16 : 0.22;
        x *= (1.0 - jawTaper * Math.pow(t, 1.55));
        z *= (1.0 - 0.14 * Math.pow(t, 1.55));
        if (nz > 0.15) z += 0.025 * radius * Math.exp(-Math.pow((ny + 0.65) / 0.28, 2)) * nz;
      }
      // Cute soft fuller cheeks (especially sweet for kids!)
      const cheekAmp = isChild ? 0.068 : 0.036;
      const cheek = Math.exp(-Math.pow((ny + 0.20) / 0.28, 2)) *
        Math.exp(-Math.pow((Math.abs(nx) - 0.60) / 0.32, 2)) *
        Math.max(0, nz + 0.25);
      x *= (1.0 + cheekAmp * cheek);
      z *= (1.0 + cheekAmp * 0.6 * cheek);
      // Gentle fuller occiput at back of head
      if (nz < -0.15) {
        z *= (1.0 + 0.05 * Math.min(1, (-nz - 0.15) * 1.4));
      }
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // Smooth Sculpted Cloth Hijab Hood Geometry for Nana Omaima (organic tapered cloth drape, ZERO chunky cylinders!)
  function createSmoothHijabHoodGeo(headR) {
    const r = headR * 1.11;
    // phiStart = 0.80*PI, phiLength = 1.40*PI leaves front face (+Z, phi=0.5*PI) cleanly open (0.20*PI..0.80*PI)!
    const geo = new THREE.SphereGeometry(r, 28, 22, Math.PI * 0.80, Math.PI * 1.40, 0.02, Math.PI * 0.90);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const ny = y / r;
      // Gently flare out at the lower jaw/neck like real draped silk/cotton fabric
      if (ny < -0.15) {
        const t = Math.min(1, (-ny - 0.15) / 0.85);
        x *= (1.0 - 0.12 * t);
        z *= (1.0 - 0.08 * t);
        y -= t * headR * 0.22;
      }
      // Subtle graceful crown loft
      if (ny > 0.4) {
        y += (ny - 0.4) * headR * 0.10;
      }
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // Official 9-Character Stylized Studio Ghibli / Nintendo Registry (exact guide outfits, cohesive heights & clean Ghibli faces!)
  const PORTRAIT_PROFILES = {
    laila: {
      scale: 0.72, headR: 0.214, isChild: true, skinHex: 0xf5d4b6,
      hairPalette: ['#1c1412', '#34241e', '#563c32'], browColor: '#2a1c16',
      topHex: 0xf8dc74, bottomHex: 0xf4d056, shoeHex: 0xd95b52, bpHex: 0xd95b52,
      sleeves: 'ruffle_straps', bottomType: 'skirt', torsoW: 0.90,
      face: { eyeColor: '#3f2618', eyeHighlight: '#8f5a34', eyeScale: 1.02, lashStyle: 'graceful', mouthStyle: 'gentle' }
    },
    salma: {
      scale: 0.61, headR: 0.222, isChild: true, skinHex: 0xf8dac0,
      hairPalette: ['#201614', '#3a2721', '#5f4136'], browColor: '#2d1e18',
      topHex: 0xf4f0e8, bottomHex: 0xde6b5a, shoeHex: 0xc87238, bpHex: 0xd97b38,
      sleeves: 'short_cap', bottomType: 'skirt', torsoW: 0.90,
      face: { eyeColor: '#3b2416', eyeHighlight: '#8c5834', eyeScale: 1.08, lashStyle: 'graceful', mouthStyle: 'sweet_small' }
    },
    mom: {
      scale: 0.90, headR: 0.194, isChild: false, skinHex: 0xf3d0b0,
      hairPalette: ['#151418', '#2a2830', '#484552'], browColor: '#221f22',
      topHex: 0xefa2ae, bottomHex: 0x3b587e, shoeHex: 0x8b4c56,
      sleeves: 'long_cuff', bottomType: 'skirt', collar: 'button_v', necklace: 'silver_medallion', torsoW: 0.98,
      face: { eyeColor: '#342016', eyeHighlight: '#7c4d30', eyeScale: 0.88, lashStyle: 'graceful', mouthStyle: 'gentle' }
    },
    dad: {
      scale: 0.97, headR: 0.194, isChild: false, skinHex: 0xf0cca9,
      hairPalette: ['#1c1b1f', '#323038', '#4f4d57'], browColor: '#242124',
      topHex: 0xf0ece3, bottomHex: 0x2b3b4e, shoeHex: 0x4c3426,
      sleeves: 'long_cuff', bottomType: 'pants', collar: 'button_v', torsoW: 1.08,
      face: { eyeColor: '#332016', eyeHighlight: '#75492e', eyeScale: 0.86, lashStyle: 'soft', beard: 'full_neat', mouthStyle: 'gentle' }
    },
    gedo_mahmoud: {
      scale: 0.95, headR: 0.194, isChild: false, skinHex: 0xedc8a6,
      hairPalette: ['#aeb3bc', '#d0d4dc', '#eef0f5'], browColor: '#a6aab2',
      topHex: 0x2f3136, shirtHex: 0x9bc0e2, bottomHex: 0x26282d, shoeHex: 0x2f251f,
      sleeves: 'long_cuff', bottomType: 'pants', collar: 'blazer', torsoW: 1.06,
      face: { eyeColor: '#412e20', eyeHighlight: '#856244', eyeScale: 0.84, lashStyle: 'soft', elder: true, glasses: 'rect_thin', mouthStyle: 'gentle' }
    },
    nana_omaima: {
      scale: 0.88, headR: 0.192, isChild: false, skinHex: 0xf1ceb0,
      hairPalette: ['#e6e2da', '#f3f0e8', '#ffffff'], browColor: '#5c4d45',
      topHex: 0xc93c32, shirtHex: 0x2d2c30, bottomHex: 0x2e333c, shoeHex: 0x46322d,
      sleeves: 'long_cuff', bottomType: 'skirt', collar: 'blazer', torsoW: 0.98,
      face: { eyeColor: '#3d281c', eyeHighlight: '#805739', eyeScale: 0.84, lashStyle: 'graceful', elder: true, glasses: 'rect_thin', mouthStyle: 'gentle' }
    },
    bibo: {
      scale: 0.57, headR: 0.224, isChild: true, skinHex: 0xf6d8bc,
      hairPalette: ['#623c20', '#8c5a34', '#bd8654'], browColor: '#6b4426',
      topHex: 0xdb5a50, bottomHex: 0x354a68, shoeHex: 0xf2c94c,
      sleeves: 'short_cap', bottomType: 'shorts', collar: 'polo', torsoW: 0.94,
      face: { eyeColor: '#3f2618', eyeHighlight: '#925d36', eyeScale: 1.08, lashStyle: 'soft', mouthStyle: 'sweet_small' }
    },
    nouzi: {
      scale: 0.70, headR: 0.214, isChild: true, skinHex: 0xf6d9be,
      hairPalette: ['#201918', '#382c28', '#5c4942'], browColor: '#2d221e',
      topHex: 0xffffff, bottomHex: 0xffffff, shoeHex: 0x5d4a50,
      sleeves: 'sleeveless', bottomType: 'skirt', floralDress: true, torsoW: 0.88,
      face: { eyeColor: '#3b2416', eyeHighlight: '#8a5632', eyeScale: 1.02, lashStyle: 'graceful', glasses: 'round_burgundy', mouthStyle: 'gentle' }
    },
    mai: {
      scale: 0.89, headR: 0.194, isChild: false, skinHex: 0xf4d2b6,
      hairPalette: ['#3b2418', '#5d3b29', '#8a5b40'], browColor: '#4c3020',
      topHex: 0xb83c34, bottomHex: 0xa2302a, shoeHex: 0x6b453a,
      sleeves: 'sleeveless', bottomType: 'skirt', pleatedTop: true, torsoW: 0.94,
      face: { eyeColor: '#3b2416', eyeHighlight: '#8a5632', eyeScale: 0.88, lashStyle: 'graceful', mouthStyle: 'open_smile' }
    }
  };
  LS.PORTRAIT_PROFILES = PORTRAIT_PROFILES;

  // Unified Stylized 3D Studio Ghibli / Nintendo Character Builder (warm, charming, slimmed world scale, ZERO uncanny photo-stickers!)
  function buildUnifiedWatercolorCharacter(cfg) {
    const style = cfg.portraitStyle;
    const P = PORTRAIT_PROFILES[style] || PORTRAIT_PROFILES.laila;
    const root = new THREE.Group();
    const s = cfg.scale !== undefined ? cfg.scale : P.scale;
    const addOut = (LS.ghibli && LS.ghibli.addInkOutline) ? LS.ghibli.addInkOutline : function () {};
    const fabTex = LS.createFabricTexture ? LS.createFabricTexture() : null;

    const skinCol = new THREE.Color(P.skinHex);
    const skinMat = (LS.ghibli && LS.ghibli.createGhibliSkinMat)
      ? LS.ghibli.createGhibliSkinMat(P.skinHex, null)
      : LS.makeToonMat(P.skinHex);

    // Silky painterly Studio Ghibli hair material (rich color + soft strand sheen, never flat rubber or washed gray!)
    const hp = P.hairPalette || ['#1e1513', '#362520', '#5a4036'];
    const hairTex = createPaintedSisterHairTex(hp[0], hp[1], hp[2]);
    const hairMat = LS.makeToonMat(0xffffff, { map: hairTex, side: THREE.DoubleSide });

    const topHex = cfg.topColor !== undefined ? cfg.topColor : P.topHex;
    const bottomHex = cfg.bottomColor !== undefined ? cfg.bottomColor : P.bottomHex;
    const shoeHex = cfg.shoeColor !== undefined ? cfg.shoeColor : P.shoeHex;
    const bpHex = cfg.backpackColor !== undefined ? cfg.backpackColor : (P.bpHex || 0xc9485a);

    const floralTex = P.floralDress ? getNouziFloralTex() : null;
    const topMat = LS.makeToonMat(topHex, {
      map: floralTex || (P.pleatedTop ? getNeutralPleatTex() : (fabTex || undefined))
    });
    const bottomMat = LS.makeToonMat(bottomHex, {
      map: floralTex || (P.bottomType === 'skirt' ? getNeutralPleatTex() : (fabTex || undefined))
    });
    const shoeMat = LS.makeToonMat(shoeHex);
    const sockMat = LS.makeToonMat(0xfffdf8);
    const bpMat = LS.makeToonMat(bpHex);
    const brassMat = LS.makeToonMat(0xf0c24b);

    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    // 1. SOFT SCULPTED LEGS, ANKLE SOCKS & CUTE ROUNDED GHIBLI SHOES (supports walking, jumping, chair_sit & floor_sit!)
    const isPants = P.bottomType === 'pants';
    const isShorts = P.bottomType === 'shorts';
    function makeGhibliLeg(lx) {
      const leg = new THREE.Group();
      leg.position.set(lx, 0.72, 0);
      const thighMat = (isPants || isShorts) ? bottomMat : skinMat;
      const thighR = isPants ? 0.062 : (isShorts ? 0.058 : 0.050);
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(thighR, thighR * 0.88, 0.34, 14), thighMat);
      thigh.position.y = -0.17; thigh.castShadow = true; thigh.receiveShadow = true;
      leg.add(thigh);

      const knee = new THREE.Group();
      knee.position.set(0, -0.34, 0);
      const calfMat = isPants ? bottomMat : skinMat;
      const calfR = isPants ? 0.055 : 0.044;
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(calfR, calfR * 0.82, 0.30, 14), calfMat);
      shin.position.y = -0.15; shin.castShadow = true; shin.receiveShadow = true;
      knee.add(shin);

      if (!isPants) {
        const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.039, 0.16, 14), sockMat);
        sock.position.y = -0.23; knee.add(sock);
        const sockCuff = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.0085, 7, 16), sockMat);
        sockCuff.rotation.x = Math.PI / 2; sockCuff.position.y = -0.152; knee.add(sockCuff);
      } else {
        const hem = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.009, 7, 16), bottomMat);
        hem.rotation.x = Math.PI / 2; hem.position.y = -0.295; knee.add(hem);
      }

      const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.058, 14, 10), shoeMat);
      shoe.scale.set(0.92, 0.66, 1.54);
      shoe.position.set(0, -0.348, 0.030);
      shoe.castShadow = true;
      addOut(shoe, 0.028);
      knee.add(shoe);

      if (P.bottomType === 'skirt' && P.isChild) {
        const strap = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.008, 6, 14, Math.PI), shoeMat);
        strap.position.set(0, -0.322, 0.028); strap.rotation.x = 0.25; knee.add(strap);
      }
      leg.add(knee);
      return { leg, knee };
    }
    const legOff = P.torsoW > 1.0 ? 0.088 : 0.078;
    const lLeg = makeGhibliLeg(-legOff);
    const rLeg = makeGhibliLeg(legOff);
    bodyPivot.add(lLeg.leg, rLeg.leg);

    // 2. ORGANIC SCULPTED GHIBLI TORSO (soft rounded LatheGeometry silhouette — ZERO boxy mannequin edges!)
    const torsoPts = P.torsoW > 1.0
      ? [
          new THREE.Vector2(0.140, 0.82),
          new THREE.Vector2(0.152, 0.92),
          new THREE.Vector2(0.168, 1.09),
          new THREE.Vector2(0.172, 1.24),
          new THREE.Vector2(0.132, 1.32),
          new THREE.Vector2(0.068, 1.35)
        ]
      : [
          new THREE.Vector2(0.120, 0.78),
          new THREE.Vector2(0.142, 0.94),
          new THREE.Vector2(0.148, 1.12),
          new THREE.Vector2(0.126, 1.26),
          new THREE.Vector2(0.064, 1.33)
        ];
    const torso = new THREE.Mesh(new THREE.LatheGeometry(torsoPts, 24), topMat);
    torso.scale.set(P.torsoW, 1.0, 0.80);
    torso.castShadow = true; torso.receiveShadow = true;
    addOut(torso, 0.012);
    bodyPivot.add(torso);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.056, 0.14, 14), skinMat);
    neck.position.y = 1.375; neck.receiveShadow = false;
    bodyPivot.add(neck);

    // Smooth curved skin V-neck / scoop helper (cleanly matches skin tone, zero dark shadows!)
    function addSmoothSkinV(w, h, yPos, zPos) {
      const shape = new THREE.Shape();
      shape.moveTo(-w * 0.5, h * 0.5);
      shape.lineTo(0, -h * 0.5);
      shape.lineTo(w * 0.5, h * 0.5);
      shape.closePath();
      const vMesh = new THREE.Mesh(
        new THREE.ShapeGeometry(shape),
        new THREE.MeshBasicMaterial({ color: skinCol.clone().multiplyScalar(0.96), side: THREE.DoubleSide })
      );
      vMesh.position.set(0, yPos, zPos);
      bodyPivot.add(vMesh);
    }

    // Character-specific collars, ruffled straps, blazers, silver medallion necklace!
    if (P.sleeves === 'ruffle_straps') {
      // LAILA: Butter-yellow ruffled-strap sleeveless summer sundress!
      const scoop = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.062, 0.09, 14), skinMat);
      scoop.scale.set(1.0, 1.0, 0.65); scoop.position.set(0, 1.315, 0.040); scoop.receiveShadow = false;
      bodyPivot.add(scoop);
      [-1, 1].forEach(side => {
        const strap = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.014, 8, 16, Math.PI * 1.12), topMat);
        strap.rotation.set(0, Math.PI / 2, -0.15);
        strap.position.set(side * 0.095, 1.295, 0.008);
        bodyPivot.add(strap);
        for (let r = 0; r < 3; r++) {
          const ruf = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), topMat);
          ruf.scale.set(0.80, 0.44, 1.16);
          ruf.position.set(side * (0.118 + r * 0.004), 1.325 - r * 0.032, 0.032 - r * 0.024);
          ruf.rotation.z = side * -0.40;
          addOut(ruf, 0.020);
          bodyPivot.add(ruf);
        }
      });
    } else if (P.collar === 'button_v') {
      const colMat = LS.makeToonMat(style === 'mom' ? 0xf2aeb8 : 0xe8e2d8);
      const plackMat = LS.makeToonMat(style === 'mom' ? 0xe596a3 : 0xdcd5c8);
      addSmoothSkinV(0.088, 0.102, 1.295, 0.122);
      const cBack = new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.015, 8, 20, Math.PI * 1.4), colMat);
      cBack.rotation.set(Math.PI / 2 + 0.14, 0, Math.PI * 0.8); cBack.position.set(0, 1.345, 0.002);
      bodyPivot.add(cBack);
      [-1, 1].forEach(side => {
        const lap = new THREE.Mesh(new THREE.BoxGeometry(0.050, 0.078, 0.014), colMat);
        lap.position.set(side * 0.052, 1.305, 0.106);
        lap.rotation.set(-0.14, side * -0.34, side * 0.36);
        addOut(lap, 0.018);
        bodyPivot.add(lap);
      });
      const plack = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.36, 0.010), plackMat);
      plack.position.set(0, 1.055, 0.122); bodyPivot.add(plack);
      const btnMat = LS.makeToonMat(style === 'mom' ? 0xffe8ee : 0xcbc2b4);
      [1.19, 1.09, 0.99].forEach(by => {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 8, 6), btnMat);
        b.scale.set(1, 1, 0.45); b.position.set(0, by, 0.129); bodyPivot.add(b);
      });
    } else if (P.collar === 'blazer') {
      const innerMat = LS.makeToonMat(P.shirtHex || 0x9bc0e2);
      const isNana = (style === 'nana_omaima');
      const innerPanel = new THREE.Mesh(new THREE.BoxGeometry(0.118, isNana ? 0.50 : 0.46, 0.052), innerMat);
      innerPanel.position.set(0, isNana ? 1.095 : 1.095, 0.112); bodyPivot.add(innerPanel);
      if (style === 'gedo_mahmoud') {
        addSmoothSkinV(0.074, 0.088, 1.300, 0.140);
        const sColMat = LS.makeToonMat(0x84aed6);
        [-1, 1].forEach(side => {
          const sCol = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.072, 0.014), sColMat);
          sCol.position.set(side * 0.046, 1.312, 0.130);
          sCol.rotation.set(-0.12, side * -0.30, side * 0.32);
          addOut(sCol, 0.018);
          bodyPivot.add(sCol);
        });
      }
      [-1, 1].forEach(side => {
        const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.30, 0.022), topMat);
        lapel.position.set(side * 0.080, 1.185, 0.126);
        lapel.rotation.set(0, side * -0.18, side * 0.16);
        addOut(lapel, 0.018);
        bodyPivot.add(lapel);
      });
    } else if (P.collar === 'polo') {
      const cBack = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.015, 8, 20), topMat);
      cBack.rotation.x = Math.PI / 2 + 0.15; cBack.position.set(0, 1.335, 0.005);
      bodyPivot.add(cBack);
      [-1, 1].forEach(side => {
        const lap = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.060, 0.014), topMat);
        lap.position.set(side * 0.046, 1.305, 0.098);
        lap.rotation.set(-0.14, side * -0.32, side * 0.38);
        addOut(lap, 0.018);
        bodyPivot.add(lap);
      });
    } else {
      const trim = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.013, 8, 20), topMat);
      trim.rotation.x = Math.PI / 2 + 0.14; trim.position.set(0, 1.328, 0.008);
      bodyPivot.add(trim);
    }

    if (P.necklace === 'silver_medallion') {
      const silverBright = new THREE.MeshStandardMaterial({
        color: 0xeaf0f8, emissive: 0x626c7a, emissiveIntensity: 0.45, roughness: 0.24, metalness: 0.42
      });
      const silverEtch = new THREE.MeshStandardMaterial({
        color: 0xb7c2d0, emissive: 0x3b4452, emissiveIntensity: 0.30, roughness: 0.34, metalness: 0.36
      });
      const chainCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.042, 1.345, 0.056),
        new THREE.Vector3(-0.028, 1.275, 0.126),
        new THREE.Vector3(-0.004, 1.205, 0.136),
        new THREE.Vector3(0.020, 1.275, 0.126),
        new THREE.Vector3(0.042, 1.345, 0.056)
      ]);
      bodyPivot.add(new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 18, 0.0038, 6, false), silverBright));
      const medG = new THREE.Group();
      medG.position.set(-0.004, 1.182, 0.140); medG.rotation.x = -0.14;
      const medOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.006, 18), silverBright);
      medOuter.rotation.x = Math.PI / 2; addOut(medOuter, 0.04); medG.add(medOuter);
      const medInner = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.008, 14), silverEtch);
      medInner.rotation.x = Math.PI / 2; medG.add(medInner);
      const medCore = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), silverBright);
      medCore.position.z = 0.004; medG.add(medCore);
      bodyPivot.add(medG);
    }

    // 3. REAL 3D PLEATED A-LINE SKIRT OR SOFT TAILORED TROUSERS / SHORTS
    if (P.bottomType === 'skirt') {
      if (!buildUnifiedWatercolorCharacter._ghibliSkirtGeo) {
        buildUnifiedWatercolorCharacter._ghibliSkirtGeo = createPleatedSkirtMeshGeo([
          new THREE.Vector2(0.228, 0.42),
          new THREE.Vector2(0.246, 0.44),
          new THREE.Vector2(0.214, 0.56),
          new THREE.Vector2(0.166, 0.72),
          new THREE.Vector2(0.134, 0.85)
        ], 40, 16, 0.030);
      }
      const skirt = new THREE.Mesh(buildUnifiedWatercolorCharacter._ghibliSkirtGeo, bottomMat);
      skirt.scale.set(P.torsoW, 1.0, 0.86);
      skirt.castShadow = true; skirt.receiveShadow = true;
      addOut(skirt, 0.018);
      bodyPivot.add(skirt);
      const waistMat = (style === 'laila' || style === 'salma') ? topMat : bottomMat;
      const waistBand = new THREE.Mesh(new THREE.TorusGeometry(0.134, 0.015, 8, 24), waistMat);
      waistBand.rotation.x = Math.PI / 2;
      waistBand.scale.set(P.torsoW, 0.86, 1.0);
      waistBand.position.y = 0.848;
      bodyPivot.add(waistBand);
    } else {
      const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.154, 18, 12), bottomMat);
      pelvis.scale.set(P.torsoW, 0.76, 0.80); pelvis.position.y = 0.745; pelvis.castShadow = true;
      addOut(pelvis, 0.016); bodyPivot.add(pelvis);
      if (isPants) {
        const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.156, 0.158, 0.042, 22), LS.makeToonMat(0x3c271a));
        belt.scale.set(P.torsoW, 1.0, 0.83); belt.position.y = 0.832; bodyPivot.add(belt);
        const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.040, 0.014), brassMat);
        buckle.position.set(0, 0.832, 0.134); bodyPivot.add(buckle);
      }
    }

    // Cute storybook satchel backpack for Laila & Salma (back-only)
    if (style === 'laila' || style === 'salma') {
      const packG = new THREE.Group();
      packG.position.set(0, 1.04, -0.135);
      const pMain = new THREE.Mesh(new THREE.SphereGeometry(0.122, 16, 12), bpMat);
      pMain.scale.set(0.92, 1.08, 0.56); pMain.castShadow = true; addOut(pMain, 0.024); packG.add(pMain);
      const pFlap = new THREE.Mesh(new THREE.SphereGeometry(0.112, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), bpMat);
      pFlap.scale.set(0.95, 0.65, 0.62); pFlap.position.set(0, 0.052, -0.014); packG.add(pFlap);
      [-0.038, 0.038].forEach(bx => {
        const buck = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.026, 0.014), brassMat);
        buck.position.set(bx, 0.014, -0.070); packG.add(buck);
      });
      bodyPivot.add(packG);
    }

    // 4. NATURAL RELAXED GHIBLI ARMS (soft angled pose, smooth continuous sleeves & cute hands — ZERO stiff robot ball-joints!)
    if (!buildUnifiedWatercolorCharacter._capSleeveGeo) {
      buildUnifiedWatercolorCharacter._capSleeveGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0.044, -0.145), new THREE.Vector2(0.062, -0.09),
        new THREE.Vector2(0.064, -0.025), new THREE.Vector2(0.048, 0.025),
        new THREE.Vector2(0.022, 0.042)
      ], 16);
    }
    function makeGhibliArm(ax) {
      const side = ax < 0 ? -1 : 1;
      const arm = new THREE.Group();
      arm.position.set(ax, 1.245, 0.008);
      const upperMat = (P.sleeves === 'sleeveless' || P.sleeves === 'ruffle_straps') ? skinMat : topMat;
      const foreMat = P.sleeves === 'long_cuff' ? topMat : skinMat;

      if (P.sleeves === 'short_cap') {
        const cap = new THREE.Mesh(buildUnifiedWatercolorCharacter._capSleeveGeo, topMat);
        cap.castShadow = true; addOut(cap, 0.022); arm.add(cap);
        const lowUp = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.034, 0.14, 12), skinMat);
        lowUp.position.y = -0.175; arm.add(lowUp);
      } else {
        const sh = new THREE.Mesh(new THREE.SphereGeometry(P.sleeves === 'long_cuff' ? 0.052 : 0.044, 12, 10), upperMat);
        sh.scale.set(0.95, 1.04, 0.95); arm.add(sh);
        const up = new THREE.Mesh(new THREE.CylinderGeometry(P.sleeves === 'long_cuff' ? 0.047 : 0.039, P.sleeves === 'long_cuff' ? 0.042 : 0.034, 0.24, 12), upperMat);
        up.position.y = -0.12; up.castShadow = true;
        if (upperMat === topMat) addOut(up, 0.018);
        arm.add(up);
      }

      const elbow = new THREE.Group();
      elbow.position.set(0, -0.24, 0);
      elbow.rotation.x = -0.16;
      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(P.sleeves === 'long_cuff' ? 0.041 : 0.034, P.sleeves === 'long_cuff' ? 0.035 : 0.029, 0.20, 12), foreMat);
      foreArm.position.y = -0.10; foreArm.castShadow = true;
      if (foreMat === topMat) addOut(foreArm, 0.016);
      elbow.add(foreArm);

      if (P.sleeves === 'long_cuff') {
        const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 7, 14), topMat);
        cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.195; elbow.add(cuff);
      }

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), skinMat);
      hand.scale.set(0.86, 1.12, 0.72); hand.position.y = -0.218; elbow.add(hand);
      const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.014, 7, 6), skinMat);
      thumb.position.set(-side * 0.024, -0.208, 0.016); elbow.add(thumb);

      arm.add(elbow);
      // Warm relaxed Studio Ghibli stance (arms naturally angled out, NEVER stiff vertical sticks!)
      arm.rotation.z = side * 0.14;
      return { arm, elbow };
    }
    const armX = P.torsoW > 1.0 ? 0.192 : (P.torsoW < 0.92 ? 0.148 : 0.166);
    const lArm = makeGhibliArm(-armX);
    const rArm = makeGhibliArm(armX);
    bodyPivot.add(lArm.arm, rArm.arm);

    // 5. CHARMING SCULPTED GHIBLI/NINTENDO HEAD + CLEAN STYLIZED FACE DECAL (ZERO photo-stickers!)
    const headGroup = new THREE.Group();
    const headR = P.headR;
    headGroup.position.set(0, 1.435 + headR * 0.72, 0.010);

    const headGeo = applyGhibliHeadSculpt(new THREE.SphereGeometry(headR, 32, 24), headR, P.isChild);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = false;
    addOut(headMesh, 0.018);
    headGroup.add(headMesh);

    // Clean transparent Studio Ghibli anime face decal hugging the front of the sculpted head (golden-ratio vertical framing!)
    const faceOpts = Object.assign({ browColor: P.browColor }, P.face || {});
    const openFaceTex = LS.createAnimeFaceTexture(faceOpts);
    const blinkFaceTex = LS.createAnimeFaceTexture(Object.assign({}, faceOpts, { blink: true }));
    const happyFaceTex = LS.createAnimeFaceTexture(Object.assign({}, faceOpts, { happy: true }));
    const faceMat = new THREE.MeshBasicMaterial({
      map: openFaceTex,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -1
    });
    const decalGeo = applyGhibliHeadSculpt(
      new THREE.SphereGeometry(headR * 1.014, 28, 22, Math.PI * 0.16, Math.PI * 0.68, Math.PI * 0.18, Math.PI * 0.62),
      headR * 1.014,
      P.isChild
    );
    const faceDecal = new THREE.Mesh(decalGeo, faceMat);
    headGroup.add(faceDecal);

    // Cute sculpted 3D ears (hidden cleanly inside hijab for Nana Omaima)
    if (style !== 'nana_omaima') {
      const earInnerMat = LS.makeToonMat(skinCol.clone().multiplyScalar(0.85));
      [-1, 1].forEach(side => {
        const earG = new THREE.Group();
        earG.position.set(side * (headR * 0.94), -headR * 0.08, -0.008);
        earG.rotation.y = side * 0.24;
        const helix = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.18, 10, 8), skinMat);
        helix.scale.set(0.42, 1.15, 0.72); earG.add(helix);
        const concha = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.11, 8, 6), earInnerMat);
        concha.scale.set(0.32, 0.90, 0.55); concha.position.set(side * 0.004, -0.002, 0.004); earG.add(concha);
        if (style === 'laila' || style === 'mom' || style === 'mai') {
          const stud = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), brassMat);
          stud.position.set(side * 0.006, -headR * 0.14, 0.006); earG.add(stud);
        }
        headGroup.add(earG);
      });
    }

    // 6. SILKY FLOWING STUDIO GHIBLI HAIRSTYLES & SMOOTH DRAPED HIJAB (tapered ribbon strands — ZERO lumpy balls!)
    const signatureBand = new THREE.Group();
    headGroup.add(signatureBand);
    const swayHair = [];

    function addPartedCrownAndSweeps(partShift) {
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.06, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.50), hairMat);
      hairCap.position.set(0, headR * 0.14, -headR * 0.18);
      hairCap.rotation.x = -0.56;
      hairCap.castShadow = true; addOut(hairCap, 0.018);
      headGroup.add(hairCap);

      [-1, 1].forEach(side => {
        const ps = (partShift || 0);
        // Natural parted hairline sweeping gracefully across upper forehead & temples
        const partCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(ps + side * headR * 0.03, headR * 0.92, headR * 0.56),
          new THREE.Vector3(side * headR * 0.44, headR * 0.72, headR * 0.78),
          new THREE.Vector3(side * headR * 0.82, headR * 0.42, headR * 0.62),
          new THREE.Vector3(side * headR * 0.98, headR * 0.06, headR * 0.20),
          new THREE.Vector3(side * headR * 0.94, -headR * 0.24, -headR * 0.26)
        ]);
        const sweep = new THREE.Mesh(createTaperedHairStrand(partCurve, 12, headR * 0.15, headR * 0.23, headR * 0.12, 0.55), hairMat);
        addOut(sweep, 0.018); headGroup.add(sweep);

        const topVol = new THREE.CatmullRomCurve3([
          new THREE.Vector3(ps + side * headR * 0.07, headR * 1.03, headR * 0.24),
          new THREE.Vector3(side * headR * 0.58, headR * 0.84, headR * 0.44),
          new THREE.Vector3(side * headR * 1.00, headR * 0.34, headR * 0.18),
          new THREE.Vector3(side * headR * 1.00, -headR * 0.30, -headR * 0.20)
        ]);
        headGroup.add(new THREE.Mesh(createTaperedHairStrand(topVol, 10, headR * 0.19, headR * 0.26, headR * 0.13, 0.60), hairMat));
      });

      const hairBack = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.03, 20, 16), hairMat);
      hairBack.scale.set(1.04, 1.10, 0.78); hairBack.position.set(0, -headR * 0.12, -headR * 0.50);
      addOut(hairBack, 0.018); headGroup.add(hairBack);
    }

    if (style === 'laila') {
      // LAILA: Exact beloved cream knotted-bow headband + center-parted silky hair + thick woven side braid!
      addPartedCrownAndSweeps(0);
      const creamBandMat = LS.makeToonMat(0xfbf6ea);
      const headband = new THREE.Mesh(new THREE.TorusGeometry(headR * 1.06, headR * 0.088, 10, 28, Math.PI * 1.04), creamBandMat);
      headband.scale.set(1.02, 1.02, 0.72);
      headband.position.set(0, headR * 0.16, headR * 0.16);
      headband.rotation.x = -0.22;
      addOut(headband, 0.020); signatureBand.add(headband);

      const bowTopG = new THREE.Group();
      bowTopG.position.set(0, headR * 1.16, headR * 0.08);
      bowTopG.rotation.x = -0.14;
      const knot = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.115, 10, 8), creamBandMat);
      knot.scale.set(1.15, 0.88, 0.92); addOut(knot, 0.024); bowTopG.add(knot);
      [-1, 1].forEach(side => {
        const earCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.07, 0.0, 0),
          new THREE.Vector3(side * headR * 0.34, headR * 0.10, headR * 0.03),
          new THREE.Vector3(side * headR * 0.56, headR * 0.01, -headR * 0.02)
        ]);
        const earMesh = new THREE.Mesh(createTaperedHairStrand(earCurve, 7, headR * 0.105, headR * 0.14, headR * 0.035, 0.45), creamBandMat);
        addOut(earMesh, 0.022); bowTopG.add(earMesh);
      });
      signatureBand.add(bowTopG);

      [-1, 1].forEach(side => {
        const wisp = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.88, headR * 0.06, headR * 0.22),
          new THREE.Vector3(side * headR * 0.95, -headR * 0.32, -headR * 0.06),
          new THREE.Vector3(side * headR * 0.78, -headR * 0.70, -headR * 0.30)
        ]);
        headGroup.add(new THREE.Mesh(createTaperedHairStrand(wisp, 7, headR * 0.10, headR * 0.11, headR * 0.028, 0.65), hairMat));
      });

      const braidG = new THREE.Group();
      braidG.position.set(-headR * 0.76, -headR * 0.28, -headR * 0.10);
      for (let i = 0; i < 8; i++) {
        const t = i / 7;
        const rPlait = headR * (0.21 - t * 0.065);
        const bx = -0.01 + Math.sin(t * 2.2) * 0.016;
        const by = -i * (headR * 0.22);
        const bz = headR * (0.09 + Math.sin(t * Math.PI * 0.68) * 0.48);
        [-1, 1].forEach(ps => {
          const plait = new THREE.Mesh(new THREE.SphereGeometry(rPlait, 9, 7), hairMat);
          plait.scale.set(1.05, 0.82, 0.78);
          plait.rotation.z = ps * 0.48;
          plait.position.set(bx + ps * (rPlait * 0.46), by - (ps > 0 ? 0.012 : 0), bz);
          addOut(plait, 0.020); braidG.add(plait);
        });
      }
      const tie = new THREE.Mesh(new THREE.TorusGeometry(headR * 0.12, headR * 0.035, 7, 14), LS.makeToonMat(0x2a1c17));
      tie.rotation.x = Math.PI / 2; tie.position.set(0, -headR * 1.72, headR * 0.50); braidG.add(tie);
      const tipCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -headR * 1.72, headR * 0.50),
        new THREE.Vector3(-0.008, -headR * 2.02, headR * 0.53),
        new THREE.Vector3(0.006, -headR * 2.34, headR * 0.48)
      ]);
      const tipMesh = new THREE.Mesh(createTaperedHairStrand(tipCurve, 7, headR * 0.12, headR * 0.15, headR * 0.02, 0.70), hairMat);
      addOut(tipMesh, 0.020); braidG.add(tipMesh);
      headGroup.add(braidG); swayHair.push(braidG);
    } else if (style === 'salma') {
      // SALMA: Crisp terracotta headband + lush flowing wavy dark ribbons over both shoulders!
      addPartedCrownAndSweeps(0);
      const terraBand = new THREE.Mesh(new THREE.TorusGeometry(headR * 1.06, headR * 0.068, 10, 28, Math.PI * 1.02), LS.makeToonMat(0xc95432));
      terraBand.scale.set(1.02, 1.02, 0.70);
      terraBand.position.set(0, headR * 0.18, headR * 0.16);
      terraBand.rotation.x = -0.20;
      addOut(terraBand, 0.020); signatureBand.add(terraBand);

      [-1, 1].forEach(side => {
        const waveG = new THREE.Group();
        const w1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.88, headR * 0.28, headR * 0.10),
          new THREE.Vector3(side * headR * 1.04, -headR * 0.34, headR * 0.24),
          new THREE.Vector3(side * headR * 0.84, -headR * 0.96, headR * 0.44),
          new THREE.Vector3(side * headR * 0.96, -headR * 1.56, headR * 0.50),
          new THREE.Vector3(side * headR * 0.78, -headR * 2.06, headR * 0.44)
        ]);
        const m1 = new THREE.Mesh(createTaperedHairStrand(w1, 14, headR * 0.20, headR * 0.26, headR * 0.04, 0.55), hairMat);
        addOut(m1, 0.018); waveG.add(m1);

        const w2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.90, headR * 0.14, -headR * 0.20),
          new THREE.Vector3(side * headR * 1.18, -headR * 0.60, -headR * 0.08),
          new THREE.Vector3(side * headR * 1.04, -headR * 1.34, headR * 0.14),
          new THREE.Vector3(side * headR * 1.14, -headR * 1.98, headR * 0.16)
        ]);
        const m2 = new THREE.Mesh(createTaperedHairStrand(w2, 12, headR * 0.18, headR * 0.24, headR * 0.035, 0.58), hairMat);
        addOut(m2, 0.018); waveG.add(m2);
        headGroup.add(waveG); swayHair.push(waveG);
      });

      for (let bl = -2; bl <= 2; bl++) {
        const bx = bl * (headR * 0.38);
        const bc = new THREE.CatmullRomCurve3([
          new THREE.Vector3(bx * 0.85, headR * 0.12, -headR * 0.82),
          new THREE.Vector3(bx * 1.12, -headR * 0.72, -headR * 0.96),
          new THREE.Vector3(bx * 1.02, -headR * 1.50, -headR * 0.86),
          new THREE.Vector3(bx * 1.12, -headR * 2.15 - (2 - Math.abs(bl)) * 0.02, -headR * 0.76)
        ]);
        const bm = new THREE.Mesh(createTaperedHairStrand(bc, 10, headR * 0.20, headR * 0.25, headR * 0.04, 0.54), hairMat);
        addOut(bm, 0.016); headGroup.add(bm);
      }
    } else if (style === 'mom' || style === 'nouzi' || style === 'mai') {
      // MOM, NOUZI, MAI: Lush layered silky Studio Ghibli wavy ribbons!
      addPartedCrownAndSweeps(style === 'mai' ? headR * 0.18 : 0);
      const lenMul = style === 'nouzi' ? 1.06 : (style === 'mai' ? 0.94 : 1.02);
      [-1, 1].forEach(side => {
        const waveG = new THREE.Group();
        const w1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.88, headR * 0.36, headR * 0.14),
          new THREE.Vector3(side * headR * 1.08, -headR * 0.28, headR * 0.26),
          new THREE.Vector3(side * headR * 0.90, -headR * 0.98 * lenMul, headR * 0.44),
          new THREE.Vector3(side * headR * 1.10, -headR * 1.66 * lenMul, headR * 0.48),
          new THREE.Vector3(side * headR * 0.88, -headR * 2.24 * lenMul, headR * 0.42)
        ]);
        const m1 = new THREE.Mesh(createTaperedHairStrand(w1, 14, headR * 0.20, headR * 0.27, headR * 0.045, 0.56), hairMat);
        m1.castShadow = true; addOut(m1, 0.018); waveG.add(m1);

        const w2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.90, headR * 0.16, -headR * 0.18),
          new THREE.Vector3(side * headR * 1.22, -headR * 0.56, -headR * 0.06),
          new THREE.Vector3(side * headR * 1.04, -headR * 1.32 * lenMul, headR * 0.14),
          new THREE.Vector3(side * headR * 1.20, -headR * 2.02 * lenMul, headR * 0.18),
          new THREE.Vector3(side * headR * 1.02, -headR * 2.42 * lenMul, headR * 0.14)
        ]);
        const m2 = new THREE.Mesh(createTaperedHairStrand(w2, 14, headR * 0.20, headR * 0.28, headR * 0.042, 0.56), hairMat);
        m2.castShadow = true; addOut(m2, 0.016); waveG.add(m2);

        const w3 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.78, headR * 0.16, headR * 0.36),
          new THREE.Vector3(side * headR * 0.90, -headR * 0.46, headR * 0.38),
          new THREE.Vector3(side * headR * 0.72, -headR * 1.14 * lenMul, headR * 0.48)
        ]);
        waveG.add(new THREE.Mesh(createTaperedHairStrand(w3, 10, headR * 0.12, headR * 0.15, headR * 0.025, 0.55), hairMat));
        headGroup.add(waveG); swayHair.push(waveG);
      });

      for (let bl = -2; bl <= 2; bl++) {
        const bx = bl * (headR * 0.40);
        const bc = new THREE.CatmullRomCurve3([
          new THREE.Vector3(bx * 0.85, headR * 0.12, -headR * 0.80),
          new THREE.Vector3(bx * 1.12, -headR * 0.72, -headR * 0.96),
          new THREE.Vector3(bx * 1.00, -headR * 1.56 * lenMul, -headR * 0.86),
          new THREE.Vector3(bx * 1.10, -headR * 2.28 * lenMul, -headR * 0.76)
        ]);
        const bm = new THREE.Mesh(createTaperedHairStrand(bc, 10, headR * 0.20, headR * 0.26, headR * 0.04, 0.54), hairMat);
        addOut(bm, 0.016); headGroup.add(bm);
      }
    } else if (style === 'dad') {
      // DAD: Smooth sculpted Studio Ghibli short wavy hair with sweeping layered top waves & salt-and-pepper sideburns!
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.05, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.50), hairMat);
      hairCap.position.set(0, headR * 0.16, -headR * 0.18);
      hairCap.rotation.x = -0.56;
      hairCap.castShadow = true; addOut(hairCap, 0.018); headGroup.add(hairCap);

      // Sweeping layered short front-top hair waves (smooth tapered ribbons — ZERO lumpy balls!)
      [
        [-0.58, 0.70, 0.66, -0.18, 1.04, 0.50, 0.22, 1.10, 0.12],
        [-0.32, 0.78, 0.72, 0.12, 1.08, 0.48, 0.50, 1.00, 0.10],
        [0.10, 0.80, 0.72, 0.54, 1.02, 0.42, 0.82, 0.76, 0.08],
        [-0.86, 0.50, 0.46, -0.68, 0.86, 0.44, -0.30, 1.06, 0.06],
        [0.44, 0.74, 0.62, 0.78, 0.80, 0.36, 0.96, 0.42, -0.04]
      ].forEach(p => {
        const c = new THREE.CatmullRomCurve3([
          new THREE.Vector3(p[0] * headR, p[1] * headR, p[2] * headR),
          new THREE.Vector3(p[3] * headR, p[4] * headR, p[5] * headR),
          new THREE.Vector3(p[6] * headR, p[7] * headR, p[8] * headR)
        ]);
        const lock = new THREE.Mesh(createTaperedHairStrand(c, 9, headR * 0.14, headR * 0.21, headR * 0.13, 0.58), hairMat);
        addOut(lock, 0.016); headGroup.add(lock);
      });

      // Neat side hair tapering into subtle salt-and-pepper temples
      const saltMat = LS.makeToonMat(0x52525b);
      [-1, 1].forEach(side => {
        const sCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.90, headR * 0.56, headR * 0.22),
          new THREE.Vector3(side * headR * 0.98, headR * 0.20, headR * 0.04),
          new THREE.Vector3(side * headR * 0.92, -headR * 0.18, -headR * 0.06)
        ]);
        headGroup.add(new THREE.Mesh(createTaperedHairStrand(sCurve, 8, headR * 0.13, headR * 0.15, headR * 0.07, 0.45), saltMat));
      });

      const nape = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.98, 18, 14), hairMat);
      nape.scale.set(0.96, 0.94, 0.74); nape.position.set(0, -headR * 0.10, -headR * 0.42);
      addOut(nape, 0.016); headGroup.add(nape);
    } else if (style === 'gedo_mahmoud') {
      // GEDO MAHMOUD: Smooth receding silver-white side hair sweeping gracefully back around temples & nape!
      const backCap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.04, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.46), hairMat);
      backCap.position.set(0, headR * 0.08, -headR * 0.26); backCap.rotation.x = -0.84;
      backCap.castShadow = true; addOut(backCap, 0.016); headGroup.add(backCap);

      [-1, 1].forEach(side => {
        const s1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.74, headR * 0.56, headR * 0.34),
          new THREE.Vector3(side * headR * 0.98, headR * 0.38, headR * 0.04),
          new THREE.Vector3(side * headR * 0.96, headR * 0.06, -headR * 0.40),
          new THREE.Vector3(side * headR * 0.68, -headR * 0.24, -headR * 0.76)
        ]);
        const m1 = new THREE.Mesh(createTaperedHairStrand(s1, 10, headR * 0.12, headR * 0.18, headR * 0.10, 0.48), hairMat);
        addOut(m1, 0.016); headGroup.add(m1);

        const s2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * headR * 0.90, headR * 0.24, headR * 0.16),
          new THREE.Vector3(side * headR * 0.98, 0.0, -headR * 0.18),
          new THREE.Vector3(side * headR * 0.80, -headR * 0.30, -headR * 0.64)
        ]);
        headGroup.add(new THREE.Mesh(createTaperedHairStrand(s2, 8, headR * 0.10, headR * 0.14, headR * 0.08, 0.46), hairMat));
      });

      const nape = new THREE.Mesh(new THREE.SphereGeometry(headR * 0.96, 18, 14), hairMat);
      nape.scale.set(0.95, 0.88, 0.72); nape.position.set(0, -headR * 0.14, -headR * 0.44);
      addOut(nape, 0.016); headGroup.add(nape);
    } else if (style === 'nana_omaima') {
      // NANA OMAIMA: Smooth continuous sculpted Studio Ghibli cloth hijab (ZERO lumpy toruses or chunky cylinders!)
      const hijabMat = LS.makeToonMat(0xf4f1ea, { side: THREE.DoubleSide });
      const innerCapMat = LS.makeToonMat(0x28272b);

      // Tiny neat dark inner underscarf peak right at the upper forehead hairline
      const underCap = new THREE.Mesh(new THREE.TorusGeometry(headR * 0.86, 0.012, 8, 22, Math.PI * 0.76), innerCapMat);
      underCap.position.set(0, headR * 0.26, headR * 0.44); underCap.rotation.z = 0.38;
      headGroup.add(underCap);

      // Continuous smooth sculpted cloth hood (cleanly open around her smiling face!)
      const hHood = new THREE.Mesh(createSmoothHijabHoodGeo(headR), hijabMat);
      hHood.position.set(0, headR * 0.06, -headR * 0.06);
      hHood.castShadow = true; addOut(hHood, 0.018);
      headGroup.add(hHood);

      // Graceful continuous front framing edge curving seamlessly from forehead around cheeks to chin
      const rimCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-headR * 0.68, -headR * 0.82, headR * 0.44),
        new THREE.Vector3(-headR * 0.92, -headR * 0.16, headR * 0.44),
        new THREE.Vector3(-headR * 0.78, headR * 0.68, headR * 0.48),
        new THREE.Vector3(0, headR * 1.04, headR * 0.44),
        new THREE.Vector3(headR * 0.78, headR * 0.68, headR * 0.48),
        new THREE.Vector3(headR * 0.92, -headR * 0.16, headR * 0.44),
        new THREE.Vector3(headR * 0.68, -headR * 0.82, headR * 0.44)
      ]);
      const rimMesh = new THREE.Mesh(createTaperedHairStrand(rimCurve, 22, headR * 0.11, headR * 0.15, headR * 0.11, 0.52), hijabMat);
      addOut(rimMesh, 0.016); headGroup.add(rimMesh);

      // Smooth flowing LatheGeometry shawl drape from under her chin neatly into her crimson blazer!
      const shawlPts = [
        new THREE.Vector2(headR * 0.98, -headR * 1.62),
        new THREE.Vector2(headR * 0.94, -headR * 1.30),
        new THREE.Vector2(headR * 0.78, -headR * 1.00),
        new THREE.Vector2(headR * 0.64, -headR * 0.80)
      ];
      const shawl = new THREE.Mesh(new THREE.LatheGeometry(shawlPts, 24), hijabMat);
      shawl.scale.set(1.02, 1.0, 0.84);
      shawl.position.set(0, 0, headR * 0.06);
      addOut(shawl, 0.016); headGroup.add(shawl);

      // Soft diagonal folded scarf ribbon crossing gracefully over her neck
      const foldCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-headR * 0.84, -headR * 0.76, headR * 0.34),
        new THREE.Vector3(-headR * 0.18, -headR * 1.02, headR * 0.72),
        new THREE.Vector3(headR * 0.64, -headR * 1.18, headR * 0.52),
        new THREE.Vector3(headR * 0.86, -headR * 1.44, headR * 0.08)
      ]);
      const foldRibbon = new THREE.Mesh(createTaperedHairStrand(foldCurve, 14, headR * 0.12, headR * 0.17, headR * 0.10, 0.36), hijabMat);
      addOut(foldRibbon, 0.016); headGroup.add(foldRibbon);
    } else if (style === 'bibo') {
      // BIBO: Soft airy tousled golden-brown curly hair ribbons gently framing his forehead & crown!
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.06, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.50), hairMat);
      hairCap.position.set(0, headR * 0.16, -headR * 0.14);
      hairCap.rotation.x = -0.48;
      hairCap.castShadow = true; addOut(hairCap, 0.018); headGroup.add(hairCap);

      // Layered sweeping curly forehead bangs & bouncy crown curls!
      [
        [-0.42, 0.98, 0.36, -0.54, 0.74, 0.80, -0.32, 0.48, 0.94],
        [-0.08, 1.02, 0.42, -0.14, 0.76, 0.86, 0.14, 0.48, 0.96],
        [0.24, 1.00, 0.38, 0.42, 0.74, 0.82, 0.56, 0.48, 0.86],
        [-0.68, 0.84, 0.28, -0.94, 0.62, 0.52, -0.96, 0.26, 0.48],
        [0.68, 0.84, 0.28, 0.94, 0.62, 0.52, 0.96, 0.26, 0.48],
        [-0.56, 0.98, -0.10, -0.20, 1.20, 0.20, 0.22, 1.14, 0.28],
        [0.48, 0.98, -0.18, 0.12, 1.18, -0.02, -0.30, 1.12, -0.16],
        [-0.86, 0.56, -0.16, -1.04, 0.24, -0.02, -0.96, -0.06, 0.18],
        [0.86, 0.56, -0.16, 1.04, 0.24, -0.02, 0.96, -0.06, 0.18]
      ].forEach(p => {
        const c = new THREE.CatmullRomCurve3([
          new THREE.Vector3(p[0] * headR, p[1] * headR, p[2] * headR),
          new THREE.Vector3(p[3] * headR, p[4] * headR, p[5] * headR),
          new THREE.Vector3(p[6] * headR, p[7] * headR, p[8] * headR)
        ]);
        const curl = new THREE.Mesh(createTaperedHairStrand(c, 9, headR * 0.16, headR * 0.24, headR * 0.08, 0.62), hairMat);
        addOut(curl, 0.016); headGroup.add(curl);
      });

      const nape = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.00, 18, 14), hairMat);
      nape.scale.set(1.02, 0.94, 0.78); nape.position.set(0, -headR * 0.10, -headR * 0.44);
      addOut(nape, 0.016); headGroup.add(nape);
    }

    const hatSlot = new THREE.Group();
    hatSlot.position.set(0, headR * 0.38, -0.008);
    hatSlot.scale.set(0.76, 0.76, 0.76);
    if (cfg.hatType && cfg.hatType !== 'none') {
      hatSlot.add(buildHatMeshes(cfg.hatType, cfg.hatColor));
    }
    headGroup.add(hatSlot);
    bodyPivot.add(headGroup);

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
      blinkTimer: 3.0 + (style.length * 0.37) % 2.4,
      isBlinking: false
    };
  }

  LS.createAnimeCharacter = function (cfg) {
    if (cfg && cfg.portraitStyle && PORTRAIT_PROFILES[cfg.portraitStyle]) {
      const charObj = buildUnifiedWatercolorCharacter(cfg);
      const glbPromise = LS.attachGLBIfConfigured ? LS.attachGLBIfConfigured(charObj, cfg.portraitStyle) : null;
      if (!glbPromise && LS.attachHD2DIfConfigured) {
        LS.attachHD2DIfConfigured(charObj, cfg.portraitStyle);
      }
      return charObj;
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
      scale: 0.72,
      portraitStyle: 'laila',
      topColor: 0xf8dc74,
      bottomColor: 0xf4d056,
      shoeColor: 0xd95b52,
      backpackColor: 0xd95b52,
      hatType: 'none'
    });
    scene.add(LS.chars.laila.root);

    LS.chars.salma = LS.createAnimeCharacter({
      scale: 0.61,
      portraitStyle: 'salma',
      topColor: 0xf4f0e8,
      bottomColor: 0xde6b5a,
      shoeColor: 0xc87238,
      backpackColor: 0xd97b38,
      hatType: 'none'
    });
    LS.chars.salmaBubble = LS.createSpeechBubbleSprite('Salma', 'Wait for me, Laila! Let us explore together! 🌸');
    LS.chars.salmaBubble.position.set(0, 2.08, 0);
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
    if (charObj && charObj.glbRig) {
      charObj.glbRig.playState(mode || 'idle');
      return;
    }
    if (charObj && charObj.hd2dRig) {
      charObj.hd2dRig.setMode(mode || 'idle');
      return;
    }
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

    if (LS.updateGLBCharacters) LS.updateGLBCharacters(dt, elapsed);
    if (LS.updateHD2DCharacters) LS.updateHD2DCharacters(dt, elapsed);
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
