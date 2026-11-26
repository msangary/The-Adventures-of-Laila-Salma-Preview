window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  const SAVE_KEY = (LS.isPreviewBuild && LS.isPreviewBuild())
    ? 'laila_salma_preview_multiworld_v1'
    : 'laila_salma_adventures_multiworld_v1';
  const QUIZ_WINDOW_MS = 2 * 60 * 60 * 1000;
  const ANIMAL_RESET_MS = 2 * 60 * 60 * 1000; // 2 hours after completing all 5 animals

  LS.GACHAPON_TOYS = [
    // Tokyo Capsule Toys (6)
    { id: 'mini_daruma', world: 'tokyo', name: 'Lucky Mini Daruma', emoji: '🎎', desc: 'Red wish charm that cheers on Laila & Salma' },
    { id: 'origami_crane', world: 'tokyo', name: 'Folded Origami Crane', emoji: '🕊️', desc: 'Paper peace crane from Tokyo craft stalls' },
    { id: 'pixel_cat', world: 'tokyo', name: 'Pixel Kitteh Badge', emoji: '👾', desc: 'Retro arcade kitty pin for the Toy Shelf' },
    { id: 'ramen_charm', world: 'tokyo', name: 'Mini Ramen Keychain', emoji: '🍥', desc: 'Tiny narutomaki & noodle charm' },
    { id: 'sakura_fan', world: 'tokyo', name: 'Blossom Folding Fan', emoji: '🪭', desc: 'Springtime sakura fan with gold trim' },
    { id: 'shiba_plush', world: 'tokyo', name: 'Pocket Shiba Plush', emoji: '🐕', desc: "Mini Mochi plushie for Salma's shelf" },
    // Kyoto Capsule Toys (6)
    { id: 'kitsune_charm', world: 'kyoto', name: 'Golden Kitsune Charm', emoji: '🦊', desc: 'Lucky shrine fox figurine from Sakurako' },
    { id: 'mini_torii', world: 'kyoto', name: 'Vermilion Mini Torii', emoji: '⛩️', desc: 'Pocket shrine gate keepsake' },
    { id: 'bamboo_panda', world: 'kyoto', name: 'Bamboo Panda Figure', emoji: '🐼', desc: 'Cute panda peeking from Arashiyama stalks' },
    { id: 'koi_chime', world: 'kyoto', name: 'Koi Wind Chime', emoji: '🎐', desc: 'Glass furin bell with a tiny koi fish' },
    { id: 'matcha_whisk', world: 'kyoto', name: 'Uji Matcha Set', emoji: '🍵', desc: 'Miniature tea bowl & bamboo whisk' },
    { id: 'dango_pin', world: 'kyoto', name: 'Sweet Dango Sticker', emoji: '🍡', desc: 'Sparkly pink-white-green dango badge' },
    // Safari Wildlife Photo Stickers (6)
    { id: 'lion_sticker', world: 'safari', name: 'Pride Rock Lion Sticker', emoji: '🦁', desc: 'Golden savanna king photo sticker from Serengeti' },
    { id: 'giraffe_sticker', world: 'safari', name: 'Tall Giraffe Sticker', emoji: '🦒', desc: 'Spotted acacia-munching giraffe collectible card' },
    { id: 'elephant_sticker', world: 'safari', name: 'Baby Elephant Sticker', emoji: '🐘', desc: 'Splashing watering-hole elephant photo badge' },
    { id: 'zebra_sticker', world: 'safari', name: 'Zebra Herd Sticker', emoji: '🦓', desc: 'Bold striped runner card from Zebra Meadow' },
    { id: 'flamingo_sticker', world: 'safari', name: 'Pink Flamingo Sticker', emoji: '🦩', desc: 'Rosy oasis flamingo sticker for the Toy Shelf' },
    { id: 'jeep_pin', world: 'safari', name: 'Safari Jeep Explorer Pin', emoji: '🚙', desc: 'Miniature zebra-striped Land Cruiser badge' }
  ];

  LS.ROOM_WALLPAPERS = [
    { id: 'sakura_cream', name: 'Sakura Cream', cost: 0, color: '#fdf3e3', accent: '#f4a4b8', hex: 0xfdf3e3 },
    { id: 'sky_pastel', name: 'Sky Pastel', cost: 60, color: '#e3f2fd', accent: '#64b5f6', hex: 0xdbeeff },
    { id: 'matcha_mint', name: 'Matcha Garden', cost: 85, color: '#e8f5e9', accent: '#66bb6a', hex: 0xdff5e2 },
    { id: 'starry_lilac', name: 'Starry Lilac', cost: 110, color: '#f3e5f5', accent: '#ab47bc', hex: 0xeddbf5 }
  ];

  LS.ROOM_BEANBAGS = [
    { id: 'strawberry_puff', name: 'Strawberry Beanbag', cost: 0, color: '#ff8fab', hex: 0xff8fab },
    { id: 'lemon_cloud', name: 'Lemon Cloud Puff', cost: 55, color: '#ffd166', hex: 0xffd166 },
    { id: 'berry_pop', name: 'Berry Pop Cushion', cost: 80, color: '#9d4edd', hex: 0x9d4edd }
  ];

  LS.ROOM_POSTERS = [
    { id: 'tokyo_sketches', name: 'Tokyo & Cat Sketches', cost: 0, label: 'TOKYO 🗼 & 🐱', bg: '#fff0f5', border: '#e05780' },
    { id: 'space_cats', name: 'Astronaut Cats Poster', cost: 65, label: 'ASTRO CATS 🚀🐾', bg: '#1d2d50', border: '#ffd166', fg: '#ffffff' },
    { id: 'ramen_dreams', name: 'Ramen & Stars Art', cost: 90, label: 'RAMEN & STARS 🍜✨', bg: '#fff4e0', border: '#e07a34' }
  ];

  LS.RYOKAN_TATAMI = [
    { id: 'classic_tatami', name: 'Classic Woven Tatami', cost: 0, color: '#e8dfb8', accent: '#8b6e4e', hex: 0xd9cf9c },
    { id: 'bamboo_breeze', name: 'Bamboo Breeze Mat', cost: 65, color: '#dcebd5', accent: '#4f8a5b', hex: 0xc2d9b8 },
    { id: 'autumn_maple', name: 'Autumn Maple Weave', cost: 90, color: '#f7e1d1', accent: '#c95c38', hex: 0xebd0bd }
  ];

  LS.RYOKAN_CUSHIONS = [
    { id: 'sakura_zabuton', name: 'Sakura Silk Zabuton', cost: 0, color: '#ffb3c6', hex: 0xff8fab },
    { id: 'indigo_wave', name: 'Indigo Wave Cushion', cost: 60, color: '#5b82b8', hex: 0x4a74ad },
    { id: 'gold_kitsune', name: 'Golden Kitsune Futon', cost: 85, color: '#f5b841', hex: 0xf5b841 }
  ];

  LS.RYOKAN_SCROLLS = [
    { id: 'kyoto_torii', name: 'Vermilion Torii Scroll', cost: 0, label: '⛩️ KYOTO SHRINE & KOI', bg: '#fff8eb', border: '#c83e37' },
    { id: 'bamboo_moon', name: 'Bamboo & Full Moon', cost: 70, label: '🎋 ARASHIYAMA MOON 🌕', bg: '#1b4332', border: '#95d5b2', fg: '#ecfdf5' },
    { id: 'kitsune_lantern', name: 'Lanterns & Kitsune Art', cost: 95, label: '🦊 LANTERN FESTIVAL 🏮', bg: '#3a1f1b', border: '#f59e0b', fg: '#fff5dc' }
  ];

  LS.SAFARI_TENT_RUGS = [
    { id: 'savanna_gold', name: 'Savanna Woven Rug', cost: 0, color: '#d4a359', accent: '#9c4221', hex: 0xc98a3e },
    { id: 'maasai_crimson', name: 'Maasai Crimson Weave', cost: 65, color: '#c83e37', accent: '#f59e0b', hex: 0xb83b32 },
    { id: 'oasis_turquoise', name: 'Oasis Turquoise Kilim', cost: 90, color: '#2a9d8f', accent: '#e9c46a', hex: 0x2e8c82 }
  ];

  LS.SAFARI_TENT_CUSHIONS = [
    { id: 'acacia_amber', name: 'Acacia Amber Pouf', cost: 0, color: '#e9c46a', hex: 0xe0a848 },
    { id: 'terracotta_sun', name: 'Terracotta Sunset Pouf', cost: 60, color: '#e07a5f', hex: 0xd96b4e },
    { id: 'emerald_leaf', name: 'Baobab Emerald Cushion', cost: 85, color: '#52b788', hex: 0x459c72 }
  ];

  LS.SAFARI_TENT_TAPESTRIES = [
    { id: 'kilimanjaro_dawn', name: 'Mt. Kilimanjaro Dawn', cost: 0, label: '🏔️ KILIMANJARO & LIONS 🦁', bg: '#fff3d6', border: '#c26d1f', fg: '#5a2d0c' },
    { id: 'starry_savanna', name: 'Starry African Night', cost: 70, label: '✨ SAVANNA CONSTELLATIONS 🦒', bg: '#16213e', border: '#facc15', fg: '#fef3c7' },
    { id: 'sunset_acacia', name: 'Serengeti Golden Sunset', cost: 95, label: '🌅 SERENGETI SUNSET 🐘', bg: '#5c2018', border: '#f59e0b', fg: '#ffedd5' }
  ];

  LS.RIAD_RUGS = [
    { id: 'riad_zellige', name: 'Cobalt Zellige Carpet', cost: 0, color: '#1f5692', accent: '#f4be44', hex: 0x1f5692 },
    { id: 'riad_crimson', name: 'Berber Crimson Weave', cost: 65, color: '#c83e37', accent: '#f4be44', hex: 0xc83e37 },
    { id: 'riad_emerald', name: 'Atlas Emerald Mosaic', cost: 90, color: '#1e8a7a', accent: '#ffd166', hex: 0x1e8a7a }
  ];

  LS.RIAD_CUSHIONS = [
    { id: 'riad_saffron', name: 'Saffron Velvet Poufs', cost: 0, color: '#f4be44', hex: 0xf4be44 },
    { id: 'riad_ruby', name: 'Ruby Marrakech Poufs', cost: 60, color: '#d84339', hex: 0xd84339 },
    { id: 'riad_turquoise', name: 'Turquoise Oasis Poufs', cost: 85, color: '#22c7c7', hex: 0x22c7c7 }
  ];

  LS.RIAD_LANTERNS = [
    { id: 'riad_gold_glow', name: 'Warm Saffron Brass Lanterns', cost: 0, color: '#ffb703', hex: 0xffb703 },
    { id: 'riad_ruby_glow', name: 'Ruby Stained-Glass Lanterns', cost: 65, color: '#fb5687', hex: 0xfb5687 },
    { id: 'riad_sapphire_glow', name: 'Sapphire Starlight Lanterns', cost: 85, color: '#38bdf8', hex: 0x38bdf8 }
  ];

  LS.SAFARI_WILDLIFE_GUIDE = [
    { id: 'giraffe', name: 'Reticulated Giraffe', emoji: '🦒', spot: 'West Acacia Sanctuary', fact: 'Giraffes are the tallest land animals on Earth — and their purple tongues are 45 cm long to grab tasty acacia leaves!' },
    { id: 'elephant', name: 'African Bush Elephant', emoji: '🐘', spot: 'Northwest Elephant Oasis', fact: 'Elephants have over 40,000 muscles in their trunks! Baby elephants love spraying sparkling water to cool off.' },
    { id: 'zebra', name: 'Plains Zebra', emoji: '🦓', spot: 'East Zebra Meadow', fact: 'Every single zebra has a one-of-a-kind stripe pattern, just like human fingerprints — helping herds stay safe together!' },
    { id: 'flamingo', name: 'Lesser Flamingo', emoji: '🦩', spot: 'Oasis Watering Hole', fact: 'Flamingos get their bright rosy-pink feathers from natural pigments in the tiny algae they scoop from warm lakes!' },
    { id: 'lion', name: 'Pride Rock Lion', emoji: '🦁', spot: 'North Pride Rock Kopje', fact: 'A friendly lion\'s mighty roar can travel up to 8 kilometers across the golden African savanna at sunset!' },
    { id: 'hippo', name: 'Savanna River Hippo', emoji: '🦛', spot: 'Lily-Pad Hippo Lagoon', fact: 'Hippos stay cool in shallow lagoons all afternoon and can hold their breath underwater for up to 5 minutes!' },
    { id: 'meerkat', name: 'Meerkat Sentinel', emoji: '🐾', spot: 'Zebra Meadow Burrows', fact: 'Meerkats take turns standing tall on lookout duty, using their dark eye rings like built-in sunglasses in the bright sun!' }
  ];

  LS.STORY_CHAPTERS = {
    home_neighborhood: {
      title: 'Chapter 1: Morning in Our Gated Community',
      emoji: '🏡',
      rewardCoins: 80,
      rewardXp: 60,
      steps: [
        { id: 'home_snack', zoneId: 'enter_home_apartment', interiorZoneId: 'home_kitchen_snack', title: 'Grab a healthy snack in the Apartment Kitchen 🍎', hint: 'Step inside our Apartment Building and visit the Kitchen!' },
        { id: 'home_piano', zoneId: 'enter_home_apartment', interiorZoneId: 'home_piano', title: 'Play a song on Laila\'s Piano for Mom & Dad 🎹', hint: 'Walk to the Dining Room piano where Mom & Dad are sipping coffee!' },
        { id: 'home_dinner', zoneId: 'enter_gedo_mahmoud', interiorZoneId: 'visit_nana_omaima', title: "Visit Gedo Mahmoud & Nana Omaima's House 🏡💛", hint: "Walk across the gated community to Gedo Mahmoud & Nana Omaima's villa!" }
      ]
    },
    tokyo: {
      title: 'Chapter 2: Expanded Sakura-cho Discovery',
      emoji: '🗼',
      rewardCoins: 100,
      rewardXp: 75,
      steps: [
        { id: 'tokyo_teacher', zoneId: 'tokyo_teacher_quiz', title: 'Meet Sensei Haruka for a Tokyo Quiz 👩‍🏫', hint: 'Find Sensei Haruka standing in Central Sakura Plaza!' },
        { id: 'tokyo_ramen', zoneId: 'ramen', title: 'Share a warm bowl at Ichiban Ramen 🍜', hint: 'Master Ken is cooking hot ramen along Sakura-cho Street!' },
        { id: 'tokyo_crepes', zoneId: 'tokyo_crepes', title: 'Treat yourselves at Harajuku Crêpe Plaza 🍓', hint: 'Visit the sweet new Crêpe & Sakura Tea Plaza in West Tokyo!' }
      ]
    },
    kyoto: {
      title: 'Chapter 3: Lanterns of Kyoto & Gion',
      emoji: '⛩️',
      rewardCoins: 100,
      rewardXp: 75,
      steps: [
        { id: 'kyoto_teacher', zoneId: 'kyoto_teacher_quiz', title: 'Quiz with Sensei Kenji by the Koi Lake 👨‍🏫', hint: 'Meet Sensei Kenji near Sakurako Lakeside Promenade!' },
        { id: 'kyoto_koi', zoneId: 'koi_dock', title: 'Feed the Koi Fish & Ducks at Sakurako Lake 🐟', hint: 'Walk down to the wooden lake dock to feed the koi!' },
        { id: 'kyoto_shrine', zoneId: 'shrine_omikuji', title: 'Draw an Omikuji Fortune at Sakurako Shrine ⛩️', hint: 'Cross the bridge through the vermilion torii gates!' }
      ]
    },
    safari: {
      title: 'Chapter 4: Golden Savanna Adventure',
      emoji: '🦁',
      rewardCoins: 120,
      rewardXp: 90,
      steps: [
        { id: 'safari_teacher', zoneId: 'safari_academy', title: 'Take a Wildlife Quiz with Dr. Kofi 🦒', hint: 'Dr. Kofi is waiting at Safari Base Camp!' },
        { id: 'safari_feed', zoneId: 'safari_feed_giraffe', title: 'Feed the Gentle Giraffes at Acacia Sanctuary 🌿', hint: 'Follow the trail west to the Tall Giraffe platform!' },
        { id: 'safari_jeep', zoneId: 'safari_jeep', title: 'Ride the Safari Jeep across the Savanna 🚙', hint: 'Hop into the zebra-striped Safari Jeep at Base Camp!' }
      ]
    },
    egypt: {
      title: 'Chapter 5: Secrets of Ancient Egypt',
      emoji: '🐪',
      rewardCoins: 120,
      rewardXp: 95,
      steps: [
        { id: 'egypt_teacher', zoneId: 'egypt_teacher_quiz', title: 'Take an Ancient Egypt Quiz with Scribe Imhotep 📜', hint: 'Scribe Imhotep is waiting by the Sunlit Sandstone Plaza!' },
        { id: 'egypt_hieroglyphs', zoneId: 'egypt_hieroglyphs', title: 'Crack the Temple Hieroglyph Code-Breaker 🔺', hint: 'Walk north to the Painted Temple Pylon near the Great Pyramids!' },
        { id: 'egypt_felucca', zoneId: 'egypt_felucca', title: 'Sail a Nile Felucca Boat down the River ⛵', hint: 'Stroll east to the palm-lined Nile Lotus Dock!' }
      ]
    },
    marrakech: {
      title: 'Chapter 6: Lanterns of Marrakech',
      emoji: '🏮',
      rewardCoins: 120,
      rewardXp: 95,
      steps: [
        { id: 'marrakech_teacher', zoneId: 'marrakech_teacher_quiz', title: 'Quiz with Teacher Youssef by the Zellige Fountain 🕌', hint: 'Teacher Youssef is greeting guests beside the mosaic courtyard fountain!' },
        { id: 'marrakech_lantern', zoneId: 'marrakech_lantern', title: 'Craft a Glowing Stained-Glass Lantern 🏮✨', hint: 'Visit Lantern Artisan Fatima under the glowing west bazaar arches!' },
        { id: 'marrakech_tea', zoneId: 'marrakech_tea', title: 'Enjoy High-Poured Mint Tea & Tagine 🫖', hint: 'Relax with Tea Master Rashid in the Riad Orange-Tree Courtyard!' }
      ]
    }
  };

  const COZY_MISSION_POOL = [
    { type: 'quiz', title: 'Complete a Quiz with any Teacher', emoji: '👩‍🏫', rewardCoins: 35, rewardXp: 25 },
    { type: 'meal', title: 'Share a Snack, Ramen, Sushi or Dinner', emoji: '🍽️', rewardCoins: 30, rewardXp: 20 },
    { type: 'pet', title: 'Find a Hidden Puppy, Cat, Fox or Cub', emoji: '🐾', rewardCoins: 35, rewardXp: 25 },
    { type: 'music', title: 'Play Piano or Safari Djembe Drums', emoji: '🎹', rewardCoins: 30, rewardXp: 20 },
    { type: 'play', title: 'Play TV Star-Catcher, Park or Mochi Game', emoji: '🎮', rewardCoins: 30, rewardXp: 25 },
    { type: 'swap', title: 'Swap Leaders (Laila ⇄ Salma) & Wave', emoji: '👧', rewardCoins: 25, rewardXp: 15 }
  ];

  function buildCozyMissions(seed) {
    const out = [];
    const n = COZY_MISSION_POOL.length;
    for (let i = 0; i < 3; i++) {
      const src = COZY_MISSION_POOL[(seed * 2 + i) % n];
      out.push(Object.assign({ id: 'm_' + seed + '_' + i, done: false }, src));
    }
    return out;
  }

  function makeDefaultState() {
    const defQuality = (LS.ghibli && LS.ghibli.detectDefaultQuality) ? LS.ghibli.detectDefaultQuality() : 'balanced';
    return {
      currentWorld: 'home_neighborhood',
      quality: defQuality,
      activeLeader: 'laila',
      level: 1,
      xp: 0,
      coins: 200,
      lastCompletedWindowHome: -1,
      lastCompletedWindowTokyo: -1,
      lastCompletedWindowKyoto: -1,
      lastCompletedWindowSafari: -1,
      lastCompletedWindowEgypt: -1,
      lastCompletedWindowMarrakech: -1,
      demoOffsetWindows: 0,
      timeMode: 0,
      grainEnabled: true,
      soundEnabled: true,
      foundHomePets: [],
      homePetsCompletedAt: 0,
      homePetsRound: 0,
      foundCats: [],
      catsCompletedAt: 0,
      catsRound: 0,
      foundKitsune: [],
      kitsuneCompletedAt: 0,
      kitsuneRound: 0,
      foundLionCubs: [],
      lionCubsCompletedAt: 0,
      lionCubsRound: 0,
      foundEgyptCats: [],
      egyptCatsCompletedAt: 0,
      egyptCatsRound: 0,
      foundMarrakechFoxes: [],
      marrakechFoxesCompletedAt: 0,
      marrakechFoxesRound: 0,
      storyProgress: { home_neighborhood: 0, tokyo: 0, kyoto: 0, safari: 0, egypt: 0, marrakech: 0 },
      cozyMissionSeed: 1,
      cozyMissions: buildCozyMissions(1),
      unlockedOutfits: ['laila_school', 'salma_kinder'],
      equippedLaila: 'laila_school',
      equippedSalma: 'salma_kinder',
      unlockedToys: [],
      stamps: [],
      emaWishes: [],
      lastFortune: null,
      koiFedCount: 0,
      safariFedCount: 0,
      safariPhotos: [],
      roomWallpaper: 'sakura_cream',
      unlockedRoomItems: ['sakura_cream', 'strawberry_puff', 'tokyo_sketches'],
      roomBeanbag: 'strawberry_puff',
      roomPoster: 'tokyo_sketches',
      ryokanTatami: 'classic_tatami',
      ryokanCushion: 'sakura_zabuton',
      ryokanScroll: 'kyoto_torii',
      unlockedRyokanItems: ['classic_tatami', 'sakura_zabuton', 'kyoto_torii'],
      safariTentRug: 'savanna_gold',
      safariTentCushion: 'acacia_amber',
      safariTentTapestry: 'kilimanjaro_dawn',
      unlockedSafariTentItems: ['savanna_gold', 'acacia_amber', 'kilimanjaro_dawn'],
      riadRug: 'riad_zellige',
      riadCushion: 'riad_saffron',
      riadLantern: 'riad_gold_glow',
      unlockedRiadItems: ['riad_zellige', 'riad_saffron', 'riad_gold_glow']
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return makeDefaultState();
      const parsed = JSON.parse(raw);
      const validOutdoors = ['home_neighborhood', 'tokyo', 'kyoto', 'safari', 'egypt', 'marrakech'];
      const startW = (validOutdoors.includes(parsed.currentWorld) && (!LS.isWorldEnabled || LS.isWorldEnabled(parsed.currentWorld)))
        ? parsed.currentWorld
        : 'home_neighborhood';
      const def = makeDefaultState();
      const sp = Object.assign({}, def.storyProgress, parsed.storyProgress || {});
      return Object.assign(def, parsed, {
        currentWorld: startW,
        quality: (parsed.quality === 'high' || parsed.quality === 'balanced' || parsed.quality === 'lite') ? parsed.quality : def.quality,
        activeLeader: parsed.activeLeader === 'salma' ? 'salma' : 'laila',
        storyProgress: sp,
        cozyMissions: Array.isArray(parsed.cozyMissions) && parsed.cozyMissions.length === 3 ? parsed.cozyMissions : def.cozyMissions,
        foundHomePets: Array.isArray(parsed.foundHomePets) ? parsed.foundHomePets.slice() : [],
        foundCats: Array.isArray(parsed.foundCats) ? parsed.foundCats.slice() : [],
        foundKitsune: Array.isArray(parsed.foundKitsune) ? parsed.foundKitsune.slice() : [],
        foundLionCubs: Array.isArray(parsed.foundLionCubs) ? parsed.foundLionCubs.slice() : [],
        foundEgyptCats: Array.isArray(parsed.foundEgyptCats) ? parsed.foundEgyptCats.slice() : [],
        foundMarrakechFoxes: Array.isArray(parsed.foundMarrakechFoxes) ? parsed.foundMarrakechFoxes.slice() : [],
        unlockedOutfits: Array.isArray(parsed.unlockedOutfits) ? parsed.unlockedOutfits.slice() : ['laila_school', 'salma_kinder'],
        unlockedToys: Array.isArray(parsed.unlockedToys) ? parsed.unlockedToys.slice() : [],
        stamps: Array.isArray(parsed.stamps) ? parsed.stamps.slice() : [],
        emaWishes: Array.isArray(parsed.emaWishes) ? parsed.emaWishes.slice() : [],
        safariPhotos: Array.isArray(parsed.safariPhotos) ? parsed.safariPhotos.slice() : [],
        unlockedRoomItems: Array.isArray(parsed.unlockedRoomItems) ? parsed.unlockedRoomItems.slice() : ['sakura_cream', 'strawberry_puff', 'tokyo_sketches'],
        unlockedRyokanItems: Array.isArray(parsed.unlockedRyokanItems) ? parsed.unlockedRyokanItems.slice() : ['classic_tatami', 'sakura_zabuton', 'kyoto_torii'],
        unlockedSafariTentItems: Array.isArray(parsed.unlockedSafariTentItems) ? parsed.unlockedSafariTentItems.slice() : ['savanna_gold', 'acacia_amber', 'kilimanjaro_dawn'],
        unlockedRiadItems: Array.isArray(parsed.unlockedRiadItems) ? parsed.unlockedRiadItems.slice() : ['riad_zellige', 'riad_saffron', 'riad_gold_glow']
      });
    } catch (e) {
      return makeDefaultState();
    }
  }

  LS.state = loadState();
  LS.runtime = {
    titleScreenActive: true,
    audioUnlocked: false,
    stamina: 100,
    running: false,
    runToggle: false,
    camMode: 0,
    poseTimer: 0,
    highFiveTimer: 0,
    piggybackUntil: 0,
    modalOpen: false,
    traveling: false,
    eating: null,
    buff: null,
    superJumpUntil: 0,
    sparkleUntil: 0,
    nearZone: null,
    mochiGame: null,
    mochiHeartTimer: 0,
    parkActivity: null,
    safariRide: null,
    balloonRide: null,
    cheetahRace: null,
    watchtowerTimer: 0,
    prideRoarTimer: 0,
    safariFeedTimer: 0,
    koiFeedTimer: 0,
    salmaHintUntil: 0,
    wave1Anim: null
  };

  LS.saveState = function () {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(LS.state));
    } catch (e) {}
  };

  LS.hasAfricaMasterBonus = function () {
    const sp = LS.state.storyProgress || {};
    return (sp.safari || 0) >= 3 && (sp.egypt || 0) >= 3 && (sp.marrakech || 0) >= 3;
  };

  LS.activateMagicCarpetGlide = function (silent) {
    if (!LS.hasAfricaMasterBonus()) return false;
    const now = Date.now();
    LS.runtime.buff = {
      name: 'Magic Carpet Glide',
      short: '🪄Carpet',
      speedMult: 1.38,
      infiniteStamina: true,
      expiresAt: now + 120000
    };
    LS.runtime.sparkleUntil = Math.max(LS.runtime.sparkleUntil || 0, now + 120000);
    LS.runtime.stamina = 100;
    LS.updateHUD();
    if (!silent) {
      LS.playSFX('levelup');
      LS.showToast('🪄✨ Magic Carpet Glide Activated! Zoom across any world with golden sparkles for 2 minutes!');
    }
    return true;
  };

  function toBaseStoryWorld(wid) {
    if (wid === 'home_apartment' || wid === 'gedo_mahmoud_house') return 'home_neighborhood';
    if (wid === 'kyoto_room') return 'kyoto';
    if (wid === 'safari_tent') return 'safari';
    if (wid === 'egypt_chamber') return 'egypt';
    if (wid === 'marrakech_riad') return 'marrakech';
    return wid;
  }

  LS.getActiveStoryStep = function (worldId) {
    const wid = worldId || LS.state.currentWorld;
    const baseWid = toBaseStoryWorld(wid);
    const chap = LS.STORY_CHAPTERS[baseWid];
    if (!chap) return null;
    const idx = (LS.state.storyProgress && LS.state.storyProgress[baseWid]) || 0;
    if (idx >= chap.steps.length) return null;
    const step = chap.steps[idx];
    return {
      worldId: baseWid,
      index: idx,
      total: chap.steps.length,
      chapterTitle: chap.title,
      step: step,
      targetZoneId: ((wid === 'home_apartment' || wid === 'gedo_mahmoud_house') && step.interiorZoneId) ? step.interiorZoneId : step.zoneId
    };
  };

  LS.advanceStoryStep = function (worldId, stepId) {
    const baseWid = toBaseStoryWorld(worldId);
    const chap = LS.STORY_CHAPTERS[baseWid];
    if (!chap) return false;
    if (!LS.state.storyProgress) LS.state.storyProgress = {};
    const curIdx = LS.state.storyProgress[baseWid] || 0;
    if (curIdx >= chap.steps.length) return false;
    if (chap.steps[curIdx].id !== stepId) return false;
    LS.state.storyProgress[baseWid] = curIdx + 1;
    LS.saveState();
    if (curIdx + 1 >= chap.steps.length) {
      LS.addCoins(chap.rewardCoins);
      LS.addXP(chap.rewardXp);
      LS.playSFX('levelup');
      LS.showToast('📖✨ Chapter Complete: ' + chap.title + '! +' + chap.rewardCoins + 'c & +' + chap.rewardXp + ' XP!');
      if (LS.hasAfricaMasterBonus() && !LS.state.stamps.includes('africa_master')) {
        LS.unlockStamp('africa_master');
        LS.addCoins(150);
        LS.addXP(120);
        LS.activateMagicCarpetGlide(true);
        setTimeout(() => {
          LS.showToast('🌍🪄 AFRICA MASTER EXPLORER UNLOCKED! +150c & Magic Carpet Glide boost forever in your Journal!');
        }, 1800);
      }
    } else {
      LS.addCoins(20);
      LS.addXP(15);
      LS.playSFX('stamp');
      const nextStep = chap.steps[curIdx + 1];
      LS.showToast('📖 Quest Step Done! Next: ' + nextStep.title);
    }
    return true;
  };

  LS.completeCozyMission = function (type) {
    if (!Array.isArray(LS.state.cozyMissions)) LS.state.cozyMissions = buildCozyMissions(1);
    let hit = false;
    LS.state.cozyMissions.forEach(m => {
      if (!m.done && m.type === type) {
        m.done = true;
        hit = true;
        LS.addCoins(m.rewardCoins);
        LS.addXP(m.rewardXp);
        LS.showToast('🌟 Cozy Mission Done: ' + m.title + ' (+' + m.rewardCoins + 'c, +' + m.rewardXp + ' XP)!');
      }
    });
    if (hit) {
      const allDone = LS.state.cozyMissions.every(m => m.done);
      if (allDone) {
        LS.state.cozyMissionSeed = (LS.state.cozyMissionSeed || 1) + 1;
        setTimeout(() => {
          LS.state.cozyMissions = buildCozyMissions(LS.state.cozyMissionSeed);
          LS.saveState();
          LS.showToast('📋 Fresh Cozy Missions posted in your Storybook Journal!');
        }, 1800);
      }
      LS.saveState();
    }
    return hit;
  };

  LS.refreshCozyMissions = function () {
    LS.state.cozyMissionSeed = (LS.state.cozyMissionSeed || 1) + 1;
    LS.state.cozyMissions = buildCozyMissions(LS.state.cozyMissionSeed);
    LS.saveState();
  };

  LS.resetProgress = function () {
    const keepSound = !!LS.state.soundEnabled;
    const keepGrain = LS.state.grainEnabled !== false;
    const keepQuality = LS.state.quality || 'balanced';
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {}

    // Fresh state with brand-new arrays while preserving audio, grain & quality preferences
    const fresh = makeDefaultState();
    fresh.soundEnabled = keepSound;
    fresh.grainEnabled = keepGrain;
    fresh.quality = keepQuality;
    Object.keys(LS.state).forEach(k => { delete LS.state[k]; });
    Object.assign(LS.state, fresh);

    LS.runtime.stamina = 100;
    LS.runtime.buff = null;
    LS.runtime.superJumpUntil = 0;
    LS.runtime.sparkleUntil = 0;
    LS.runtime.piggybackUntil = 0;
    LS.runtime.mochiGame = null;
    LS.runtime.parkActivity = null;
    LS.runtime.safariRide = null;
    LS.runtime.balloonRide = null;
    LS.runtime.cheetahRace = null;
    LS.runtime.watchtowerTimer = 0;
    LS.runtime.prideRoarTimer = 0;
    LS.runtime.wave1Anim = null;
    LS.runtime.ngscActivity = null;

    LS.saveState();
    if (LS.applyOutfit) {
      LS.applyOutfit('laila', LS.state.equippedLaila);
      LS.applyOutfit('salma', LS.state.equippedSalma);
    }
    if (LS.closeAllModals) LS.closeAllModals();
    if (LS.loadWorld) LS.loadWorld('home_neighborhood', false);
    LS.updateHUD();
    LS.playSFX('coin');
    LS.showToast('🔄 Progress reset! Welcome back home, Laila & Salma!');
  };

  // 2-Hour Animal Hide-and-Seek Reset Logic
  LS.checkAnimalReset = function (worldId) {
    const wid = worldId || LS.state.currentWorld;
    const now = Date.now();
    if (wid === 'home_neighborhood' && LS.state.foundHomePets && LS.state.foundHomePets.length >= 5 && LS.state.homePetsCompletedAt > 0) {
      if (now - LS.state.homePetsCompletedAt >= ANIMAL_RESET_MS) {
        LS.state.foundHomePets = [];
        LS.state.homePetsCompletedAt = 0;
        LS.state.homePetsRound = (LS.state.homePetsRound || 0) + 1;
        LS.saveState();
        return true;
      }
    }
    if (wid === 'tokyo' && LS.state.foundCats.length >= 5 && LS.state.catsCompletedAt > 0) {
      if (now - LS.state.catsCompletedAt >= ANIMAL_RESET_MS) {
        LS.state.foundCats = [];
        LS.state.catsCompletedAt = 0;
        LS.state.catsRound = (LS.state.catsRound || 0) + 1;
        LS.saveState();
        return true;
      }
    }
    if (wid === 'kyoto' && LS.state.foundKitsune.length >= 5 && LS.state.kitsuneCompletedAt > 0) {
      if (now - LS.state.kitsuneCompletedAt >= ANIMAL_RESET_MS) {
        LS.state.foundKitsune = [];
        LS.state.kitsuneCompletedAt = 0;
        LS.state.kitsuneRound = (LS.state.kitsuneRound || 0) + 1;
        LS.saveState();
        return true;
      }
    }
    if (wid === 'safari' && LS.state.foundLionCubs.length >= 5 && LS.state.lionCubsCompletedAt > 0) {
      if (now - LS.state.lionCubsCompletedAt >= ANIMAL_RESET_MS) {
        LS.state.foundLionCubs = [];
        LS.state.lionCubsCompletedAt = 0;
        LS.state.lionCubsRound = (LS.state.lionCubsRound || 0) + 1;
        LS.saveState();
        return true;
      }
    }
    if (wid === 'egypt' && LS.state.foundEgyptCats && LS.state.foundEgyptCats.length >= 5 && LS.state.egyptCatsCompletedAt > 0) {
      if (now - LS.state.egyptCatsCompletedAt >= ANIMAL_RESET_MS) {
        LS.state.foundEgyptCats = [];
        LS.state.egyptCatsCompletedAt = 0;
        LS.state.egyptCatsRound = (LS.state.egyptCatsRound || 0) + 1;
        LS.saveState();
        return true;
      }
    }
    if (wid === 'marrakech' && LS.state.foundMarrakechFoxes && LS.state.foundMarrakechFoxes.length >= 5 && LS.state.marrakechFoxesCompletedAt > 0) {
      if (now - LS.state.marrakechFoxesCompletedAt >= ANIMAL_RESET_MS) {
        LS.state.foundMarrakechFoxes = [];
        LS.state.marrakechFoxesCompletedAt = 0;
        LS.state.marrakechFoxesRound = (LS.state.marrakechFoxesRound || 0) + 1;
        LS.saveState();
        return true;
      }
    }
    return false;
  };

  LS.getAnimalResetRemainingMs = function (worldId) {
    const wid = worldId || LS.state.currentWorld;
    const now = Date.now();
    if (wid === 'home_neighborhood' && LS.state.foundHomePets && LS.state.foundHomePets.length >= 5 && LS.state.homePetsCompletedAt > 0) {
      return Math.max(0, ANIMAL_RESET_MS - (now - LS.state.homePetsCompletedAt));
    }
    if (wid === 'tokyo' && LS.state.foundCats.length >= 5 && LS.state.catsCompletedAt > 0) {
      return Math.max(0, ANIMAL_RESET_MS - (now - LS.state.catsCompletedAt));
    }
    if (wid === 'kyoto' && LS.state.foundKitsune.length >= 5 && LS.state.kitsuneCompletedAt > 0) {
      return Math.max(0, ANIMAL_RESET_MS - (now - LS.state.kitsuneCompletedAt));
    }
    if (wid === 'safari' && LS.state.foundLionCubs.length >= 5 && LS.state.lionCubsCompletedAt > 0) {
      return Math.max(0, ANIMAL_RESET_MS - (now - LS.state.lionCubsCompletedAt));
    }
    if (wid === 'egypt' && LS.state.foundEgyptCats && LS.state.foundEgyptCats.length >= 5 && LS.state.egyptCatsCompletedAt > 0) {
      return Math.max(0, ANIMAL_RESET_MS - (now - LS.state.egyptCatsCompletedAt));
    }
    if (wid === 'marrakech' && LS.state.foundMarrakechFoxes && LS.state.foundMarrakechFoxes.length >= 5 && LS.state.marrakechFoxesCompletedAt > 0) {
      return Math.max(0, ANIMAL_RESET_MS - (now - LS.state.marrakechFoxesCompletedAt));
    }
    return 0;
  };

  LS.startNewAnimalRound = function (worldId) {
    const wid = worldId || LS.state.currentWorld;
    if (wid === 'home_neighborhood') {
      LS.state.foundHomePets = [];
      LS.state.homePetsCompletedAt = 0;
      LS.state.homePetsRound = (LS.state.homePetsRound || 0) + 1;
    } else if (wid === 'kyoto') {
      LS.state.foundKitsune = [];
      LS.state.kitsuneCompletedAt = 0;
      LS.state.kitsuneRound = (LS.state.kitsuneRound || 0) + 1;
    } else if (wid === 'safari') {
      LS.state.foundLionCubs = [];
      LS.state.lionCubsCompletedAt = 0;
      LS.state.lionCubsRound = (LS.state.lionCubsRound || 0) + 1;
    } else if (wid === 'egypt') {
      LS.state.foundEgyptCats = [];
      LS.state.egyptCatsCompletedAt = 0;
      LS.state.egyptCatsRound = (LS.state.egyptCatsRound || 0) + 1;
    } else if (wid === 'marrakech') {
      LS.state.foundMarrakechFoxes = [];
      LS.state.marrakechFoxesCompletedAt = 0;
      LS.state.marrakechFoxesRound = (LS.state.marrakechFoxesRound || 0) + 1;
    } else {
      LS.state.foundCats = [];
      LS.state.catsCompletedAt = 0;
      LS.state.catsRound = (LS.state.catsRound || 0) + 1;
    }
    LS.saveState();
    if (LS.state.currentWorld === wid && LS.loadWorld) {
      LS.loadWorld(wid, false);
    }
    LS.playSFX('animal');
    LS.showToast(wid === 'home_neighborhood'
      ? '🐶 New Hide-and-Seek Round! All 5 Community Puppies hid in brand-new spots!'
      : (wid === 'safari'
        ? '🦁 New Hide-and-Seek Round! All 5 Safari Lion Cubs hid in brand-new spots!'
        : (wid === 'egypt'
          ? '🐱 New Hide-and-Seek Round! All 5 Royal Egyptian Mau Cats hid in brand-new spots!'
          : (wid === 'marrakech'
            ? '🦊 New Hide-and-Seek Round! All 5 Marrakech Fennec Foxes hid in brand-new spots!'
            : (wid === 'kyoto'
              ? '🦊 New Hide-and-Seek Round! All 5 Kyoto Kitsune hid in brand-new spots!'
              : '🐱 New Hide-and-Seek Round! All 5 Tokyo Cats hid in brand-new spots!')))));
  };

  // Deterministic seeded pick of 5 hiding spots from a larger curated list based on round number
  LS.pickRoundSpots = function (spotList, roundNum, count) {
    const arr = spotList.slice();
    let s = ((roundNum || 0) + 1) * 7919 + 104729;
    function rnd() {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr.slice(0, count || 5);
  };

  LS.xpForLevel = function (lv) {
    return 100 + (lv - 1) * 50;
  };

  LS.unlockStamp = function (stampId) {
    if (!LS.state.stamps.includes(stampId)) {
      LS.state.stamps.push(stampId);
      LS.saveState();
      const stamp = LS.PASSPORT_STAMPS.find(s => s.id === stampId);
      if (stamp) {
        LS.playSFX('stamp');
        setTimeout(() => {
          LS.showToast('🛂 Passport Stamp Unlocked: ' + stamp.emoji + ' ' + stamp.title + '!');
        }, 550);
      }
      LS.updateHUD();
      return true;
    }
    return false;
  };

  LS.addXP = function (amount) {
    LS.state.xp += amount;
    let leveledUp = false;
    while (LS.state.xp >= LS.xpForLevel(LS.state.level)) {
      LS.state.xp -= LS.xpForLevel(LS.state.level);
      LS.state.level += 1;
      leveledUp = true;
    }
    LS.saveState();
    LS.updateHUD();
    if (leveledUp) {
      LS.playSFX('levelup');
      LS.showToast('🎉 Level Up! Laila & Salma reached Level ' + LS.state.level + '!');
    }
    return leveledUp;
  };

  LS.addCoins = function (amount) {
    LS.state.coins = Math.max(0, LS.state.coins + amount);
    LS.saveState();
    LS.updateHUD();
  };

  LS.getCurrentQuizWindow = function () {
    return Math.floor(Date.now() / QUIZ_WINDOW_MS) + (LS.state.demoOffsetWindows || 0);
  };

  LS.getQuizCooldownMs = function (worldId) {
    const wid = worldId || LS.state.currentWorld;
    const cur = LS.getCurrentQuizWindow();
    const last = wid === 'home_neighborhood'
      ? LS.state.lastCompletedWindowHome
      : (wid === 'safari'
        ? LS.state.lastCompletedWindowSafari
        : (wid === 'egypt'
          ? LS.state.lastCompletedWindowEgypt
          : (wid === 'marrakech'
            ? LS.state.lastCompletedWindowMarrakech
            : (wid === 'kyoto' ? LS.state.lastCompletedWindowKyoto : LS.state.lastCompletedWindowTokyo))));
    if (last < cur) return 0;
    const realWindow = Math.floor(Date.now() / QUIZ_WINDOW_MS);
    const nextRealBoundary = (realWindow + 1) * QUIZ_WINDOW_MS;
    return Math.max(0, nextRealBoundary - Date.now());
  };

  LS.markQuizCompleted = function (worldId) {
    const wid = worldId || LS.state.currentWorld;
    const cur = LS.getCurrentQuizWindow();
    if (wid === 'home_neighborhood') {
      LS.state.lastCompletedWindowHome = cur;
      LS.unlockStamp('home_school');
    } else if (wid === 'safari') {
      LS.state.lastCompletedWindowSafari = cur;
      LS.advanceStoryStep('safari', 'safari_teacher');
    } else if (wid === 'egypt') {
      LS.state.lastCompletedWindowEgypt = cur;
      LS.unlockStamp('egypt_quiz');
      LS.advanceStoryStep('egypt', 'egypt_teacher');
    } else if (wid === 'marrakech') {
      LS.state.lastCompletedWindowMarrakech = cur;
      LS.unlockStamp('marrakech_quiz');
      LS.advanceStoryStep('marrakech', 'marrakech_teacher');
    } else if (wid === 'kyoto') {
      LS.state.lastCompletedWindowKyoto = cur;
      LS.advanceStoryStep('kyoto', 'kyoto_teacher');
    } else {
      LS.state.lastCompletedWindowTokyo = cur;
      LS.unlockStamp('tokyo_quiz');
      LS.advanceStoryStep('tokyo', 'tokyo_teacher');
    }
    LS.completeCozyMission('quiz');
    LS.saveState();
  };

  LS.getLeaderName = function () {
    return (LS.state && LS.state.activeLeader === 'salma') ? 'Salma' : 'Laila';
  };

  LS.getCompanionName = function () {
    return (LS.state && LS.state.activeLeader === 'salma') ? 'Laila' : 'Salma';
  };

  LS.personalizeLeaderLine = function (text, opts) {
    const cfg = opts || {};
    const isSalma = !!(LS.state && LS.state.activeLeader === 'salma');
    if (cfg.lineLaila !== undefined && cfg.lineSalma !== undefined) {
      return isSalma ? cfg.lineSalma : cfg.lineLaila;
    }
    if (!text) return '';
    if (cfg.skipAutoLeader) return text;
    const leader = isSalma ? 'Salma' : 'Laila';
    const companion = isSalma ? 'Laila' : 'Salma';
    let out = String(text)
      .replace(/\{leader\}/g, leader)
      .replace(/\{companion\}/g, companion);
    // Automatically convert paired or Laila-only NPC greetings to address whoever is leading!
    out = out.replace(/Laila\s*(?:&|and)\s*Salma/gi, leader);
    if (isSalma && /\bLaila\b/.test(out) && !/\bSalma\b/.test(out)) {
      out = out.replace(/\bLaila\b/g, 'Salma');
    }
    // If an NPC greeting didn't mention a name yet, naturally address the active leader!
    if (out.indexOf(leader) === -1) {
      if (/^(Ahlan|Marhaba|Irasshaimase|Ohayo|Jambo|Bonjour|Buonasera)!/i.test(out)) {
        out = out.replace(/^(Ahlan|Marhaba|Irasshaimase|Ohayo|Jambo|Bonjour|Buonasera)!/i, '$1, ' + leader + '!');
      } else if (/^Welcome to /i.test(out)) {
        out = out.replace(/^Welcome to /i, 'Welcome, ' + leader + ', to ');
      } else if (/^Purr~ Welcome to /i.test(out)) {
        out = out.replace(/^Purr~ Welcome to /i, 'Purr~ Welcome, ' + leader + ', to ');
      } else if (!cfg.noFallbackPrefix) {
        out = 'Hi ' + leader + '! ' + out;
      }
    }
    return out;
  };

  LS.updateHUD = function () {
    const worldMeta = LS.WORLDS[LS.state.currentWorld] || LS.WORLDS.home_neighborhood;
    const isHomeContext = LS.state.currentWorld === 'home_neighborhood' || LS.state.currentWorld === 'home_apartment' || LS.state.currentWorld === 'gedo_mahmoud_house' || (LS.state.currentWorld && LS.state.currentWorld.indexOf('dest_') === 0);
    const isKyotoContext = LS.state.currentWorld === 'kyoto' || LS.state.currentWorld === 'kyoto_room';
    const isSafariContext = LS.state.currentWorld === 'safari' || LS.state.currentWorld === 'safari_tent';
    const isEgyptContext = LS.state.currentWorld === 'egypt' || LS.state.currentWorld === 'egypt_chamber';
    const isMarrakechContext = LS.state.currentWorld === 'marrakech' || LS.state.currentWorld === 'marrakech_riad';
    const lvEl = document.getElementById('hud-level');
    const worldBadge = document.getElementById('hud-world-badge');
    const xpBar = document.getElementById('xp-bar');
    const xpText = document.getElementById('xp-text');
    const stamBar = document.getElementById('stamina-bar');
    const stamText = document.getElementById('stamina-text');
    const coinEl = document.getElementById('coin-count');
    const animalPill = document.getElementById('cat-pill');
    const toyEl = document.getElementById('toy-count');
    const stampEl = document.getElementById('stamp-count');
    const buffPill = document.getElementById('buff-pill');
    const mochiHud = document.getElementById('mochi-game-banner');
    const questHint = document.getElementById('hud-quest-hint');
    const swapBtn = document.getElementById('btn-swap-sister');

    const need = LS.xpForLevel(LS.state.level);
    const leaderTxt = LS.state.activeLeader === 'salma' ? '🧒 Salma Leading' : '👧 Laila Leading';
    if (lvEl) lvEl.textContent = 'Lv. ' + LS.state.level + ' • ' + leaderTxt;
    if (swapBtn) {
      swapBtn.textContent = LS.state.activeLeader === 'salma' ? '🧒⇄👧' : '👧⇄🧒';
      swapBtn.title = LS.state.activeLeader === 'salma'
        ? 'Currently playing as Salma — Tap to switch to Laila!'
        : 'Currently playing as Laila — Tap to switch to Salma!';
    }
    if (worldBadge) {
      worldBadge.textContent = worldMeta.emoji + ' ' + worldMeta.title;
      worldBadge.style.background = worldMeta.badgeColor;
    }
    if (xpBar) xpBar.style.width = Math.min(100, Math.round((LS.state.xp / need) * 100)) + '%';
    if (xpText) xpText.textContent = LS.state.xp + '/' + need;
    if (stamBar) stamBar.style.width = Math.round(LS.runtime.stamina) + '%';
    if (stamText) stamText.textContent = Math.round(LS.runtime.stamina) + '%';
    if (coinEl) coinEl.textContent = LS.state.coins;

    if (animalPill) {
      if (isHomeContext) {
        const hCount = LS.state.foundHomePets ? LS.state.foundHomePets.length : 0;
        animalPill.innerHTML = '🐶 <span id="cat-count">' + hCount + '/5</span>';
        animalPill.title = 'Hidden Community Puppies Found (resets 2h after 5/5)';
      } else if (isSafariContext) {
        const sCount = LS.state.foundLionCubs ? LS.state.foundLionCubs.length : 0;
        animalPill.innerHTML = '🦁 <span id="cat-count">' + sCount + '/5</span>';
        animalPill.title = 'Hidden Safari Lion Cubs Found (resets 2h after 5/5)';
      } else if (isEgyptContext) {
        const eCount = LS.state.foundEgyptCats ? LS.state.foundEgyptCats.length : 0;
        animalPill.innerHTML = '🐱 <span id="cat-count">' + eCount + '/5</span>';
        animalPill.title = 'Hidden Royal Egyptian Mau Cats Found (resets 2h after 5/5)';
      } else if (isMarrakechContext) {
        const mCount = LS.state.foundMarrakechFoxes ? LS.state.foundMarrakechFoxes.length : 0;
        animalPill.innerHTML = '🦊 <span id="cat-count">' + mCount + '/5</span>';
        animalPill.title = 'Hidden Sahara Fennec Foxes Found (resets 2h after 5/5)';
      } else if (isKyotoContext) {
        const kCount = LS.state.foundKitsune ? LS.state.foundKitsune.length : 0;
        animalPill.innerHTML = '🦊 <span id="cat-count">' + kCount + '/5</span>';
        animalPill.title = 'Hidden Kyoto Kitsune Foxes Found (resets 2h after 5/5)';
      } else {
        const cCount = LS.state.foundCats ? LS.state.foundCats.length : 0;
        animalPill.innerHTML = '🐱 <span id="cat-count">' + cCount + '/5</span>';
        animalPill.title = 'Hidden Tokyo Cats Found (resets 2h after 5/5)';
      }
    }

    if (questHint) {
      const activeQ = LS.getActiveStoryStep(LS.state.currentWorld);
      if (activeQ) {
        questHint.textContent = '📖 ' + (activeQ.index + 1) + '/' + activeQ.total + ': ' + activeQ.step.title;
        questHint.classList.remove('hidden');
      } else {
        questHint.textContent = '📖 Chapter Complete! Tap 📖 for Cozy Missions';
        questHint.classList.remove('hidden');
      }
    }

    if (toyEl) {
      const activeToys = LS.getActiveToys ? LS.getActiveToys() : LS.GACHAPON_TOYS;
      const activeToyIds = new Set(activeToys.map(t => t.id));
      const ownedActive = (LS.state.unlockedToys || []).filter(id => activeToyIds.has(id)).length;
      toyEl.textContent = ownedActive + '/' + activeToys.length;
    }
    if (stampEl) {
      const activeStamps = LS.getActivePassportStamps ? LS.getActivePassportStamps() : LS.PASSPORT_STAMPS;
      const activeStampIds = new Set(activeStamps.map(s => s.id));
      const earnedActive = (LS.state.stamps || []).filter(id => activeStampIds.has(id)).length;
      stampEl.textContent = earnedActive + '/' + activeStamps.length;
    }

    if (mochiHud) {
      if (LS.runtime.mochiGame) {
        const mg = LS.runtime.mochiGame;
        mochiHud.textContent = (mg.mode === 'fetch' ? '🎾 Mochi Fetch: ' : '🐕 Mochi Tag: ') +
          Math.ceil(mg.timeLeft) + 's left • Score: ' + mg.score;
        mochiHud.classList.remove('hidden');
      } else {
        mochiHud.classList.add('hidden');
      }
    }

    if (buffPill) {
      const tags = [];
      if (LS.runtime.piggybackUntil && Date.now() < LS.runtime.piggybackUntil) {
        tags.push('👧🧒Piggyback ' + Math.ceil((LS.runtime.piggybackUntil - Date.now()) / 1000) + 's');
      }
      if (LS.runtime.buff && Date.now() < LS.runtime.buff.expiresAt) {
        tags.push(LS.runtime.buff.short + ' ' + Math.ceil((LS.runtime.buff.expiresAt - Date.now()) / 1000) + 's');
      } else {
        LS.runtime.buff = null;
      }
      if (LS.runtime.superJumpUntil && Date.now() < LS.runtime.superJumpUntil) {
        tags.push('🦘Jump ' + Math.ceil((LS.runtime.superJumpUntil - Date.now()) / 1000) + 's');
      }
      if (LS.runtime.sparkleUntil && Date.now() < LS.runtime.sparkleUntil) {
        tags.push('✨Sparkle ' + Math.ceil((LS.runtime.sparkleUntil - Date.now()) / 1000) + 's');
      }
      if (tags.length > 0) {
        buffPill.textContent = tags.join(' • ');
        buffPill.classList.remove('hidden');
      } else {
        buffPill.classList.add('hidden');
      }
    }
  };

  let toastTimer = null;
  LS.showToast = function (msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 3800);
  };

  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  LS.unlockAudio = function () {
    LS.runtime.audioUnlocked = true;
    getAudio();
  };

  LS.playTone = function (freq, duration, type, delaySec, gainVal) {
    if (!LS.state.soundEnabled) return;
    try {
      const ctx = getAudio();
      if (!ctx) return;
      const now = ctx.currentTime + (delaySec || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(gainVal || 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (duration || 0.15));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (duration || 0.15) + 0.02);
    } catch (e) {}
  };

  // Laila's warm upright acoustic piano synthesizer (8-key C4..C5 scale!)
  const PIANO_FREQS = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  LS.playPianoNote = function (idx, delaySec, vol) {
    if (!LS.state.soundEnabled) return;
    const freq = PIANO_FREQS[Math.max(0, Math.min(PIANO_FREQS.length - 1, idx || 0))];
    const d = delaySec || 0;
    const v = vol || 0.11;
    // Fundamental + warm harmonic overtone for rich Ghibli upright piano timbre!
    LS.playTone(freq, 0.72, 'triangle', d, v);
    LS.playTone(freq * 2, 0.42, 'sine', d, v * 0.34);
  };

  LS.playSFX = function (kind) {
    if (!LS.state.soundEnabled) return;
    if (kind === 'jump') {
      LS.playTone(392, 0.07, 'sine', 0, 0.07);
      LS.playTone(587.33, 0.09, 'sine', 0.05, 0.06);
    } else if (kind === 'coin') {
      LS.playTone(784, 0.09, 'triangle', 0, 0.08);
      LS.playTone(1046.5, 0.16, 'triangle', 0.08, 0.08);
    } else if (kind === 'correct') {
      LS.playTone(587.33, 0.1, 'sine', 0, 0.08);
      LS.playTone(880, 0.18, 'sine', 0.09, 0.08);
    } else if (kind === 'wrong') {
      LS.playTone(290, 0.16, 'triangle', 0, 0.07);
    } else if (kind === 'animal') {
      LS.playTone(659.25, 0.09, 'sine', 0, 0.08);
      LS.playTone(783.99, 0.09, 'sine', 0.08, 0.08);
      LS.playTone(1046.5, 0.2, 'sine', 0.16, 0.08);
    } else if (kind === 'splash') {
      LS.playTone(340, 0.08, 'sine', 0, 0.06);
      LS.playTone(460, 0.1, 'sine', 0.07, 0.06);
      LS.playTone(620, 0.14, 'triangle', 0.14, 0.05);
    } else if (kind === 'shrine') {
      LS.playTone(523.25, 0.22, 'triangle', 0, 0.07);
      LS.playTone(659.25, 0.24, 'triangle', 0.14, 0.07);
      LS.playTone(783.99, 0.32, 'sine', 0.28, 0.08);
    } else if (kind === 'door') {
      LS.playTone(440, 0.1, 'triangle', 0, 0.07);
      LS.playTone(659.25, 0.16, 'triangle', 0.09, 0.07);
    } else if (kind === 'train') {
      LS.playTone(523.25, 0.14, 'sine', 0, 0.08);
      LS.playTone(659.25, 0.14, 'sine', 0.13, 0.08);
      LS.playTone(783.99, 0.14, 'sine', 0.26, 0.08);
      LS.playTone(1046.5, 0.34, 'sine', 0.39, 0.09);
    } else if (kind === 'stamp') {
      LS.playTone(587.33, 0.1, 'triangle', 0, 0.08);
      LS.playTone(740, 0.1, 'triangle', 0.1, 0.08);
      LS.playTone(880, 0.22, 'triangle', 0.2, 0.09);
    } else if (kind === 'levelup') {
      LS.playTone(523.25, 0.12, 'triangle', 0, 0.08);
      LS.playTone(659.25, 0.12, 'triangle', 0.12, 0.08);
      LS.playTone(783.99, 0.12, 'triangle', 0.24, 0.08);
      LS.playTone(1046.5, 0.32, 'triangle', 0.36, 0.09);
    } else {
      LS.playTone(523.25, 0.12);
    }
  };

  // Interactive African Djembe Drum & Warm Marimba Synth (for Base Camp Campfire Circle!)
  LS.playDjembeSound = function (kind) {
    if (!LS.state.soundEnabled) return;
    try {
      const ctx = getAudio();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      if (kind === 'bass') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(145, now);
        osc.frequency.exponentialRampToValueAtTime(62, now + 0.24);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      } else if (kind === 'tone') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(248, now);
        osc.frequency.exponentialRampToValueAtTime(168, now + 0.16);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
      } else if (kind === 'slap') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(490, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.09);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      } else {
        const notes = [392, 440, 523.25, 587.33, 659.25];
        const f = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  };

  LS.playLionRoar = function () {
    if (!LS.state.soundEnabled) return;
    try {
      const ctx = getAudio();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(128, now);
      osc.frequency.linearRampToValueAtTime(156, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(68, now + 0.85);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.13, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.92);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);
      LS.playTone(392, 0.22, 'triangle', 0.32, 0.06);
      LS.playTone(523.25, 0.32, 'sine', 0.48, 0.07);
    } catch (e) {}
  };

  LS.playCameraShutter = function () {
    if (!LS.state.soundEnabled) return;
    LS.playTone(1350, 0.035, 'square', 0, 0.05);
    LS.playTone(880, 0.05, 'triangle', 0.03, 0.06);
    LS.playTone(1174.66, 0.14, 'sine', 0.08, 0.07);
  };

  // Studio Ghibli Gentle Procedural WebAudio Music Engine (Joe Hisaishi-inspired piano/celesta, koto, kalimba!)
  let musicTimer = 0.8;
  let musicStep = 0;
  const GHIBLI_THEMES = {
    home:   { tempo: 0.62, type: 'triangle', vol: 0.028, notes: [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 440.00, 523.25, 392.00, 523.25, 659.25, 880.00, 783.99, 659.25, 587.33, 0] },
    indoor: { tempo: 0.72, type: 'sine',     vol: 0.024, notes: [523.25, 659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 0, 440.00, 523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 0] },
    tokyo:  { tempo: 0.56, type: 'triangle', vol: 0.026, notes: [587.33, 659.25, 739.99, 880.00, 987.77, 880.00, 739.99, 659.25, 587.33, 493.88, 587.33, 739.99, 880.00, 739.99, 659.25, 0] },
    kyoto:  { tempo: 0.74, type: 'sine',     vol: 0.026, notes: [440.00, 493.88, 523.25, 659.25, 783.99, 659.25, 523.25, 493.88, 440.00, 0, 523.25, 659.25, 783.99, 659.25, 493.88, 0] },
    safari:    { tempo: 0.52, type: 'sine',     vol: 0.028, notes: [392.00, 440.00, 523.25, 659.25, 587.33, 523.25, 440.00, 392.00, 523.25, 587.33, 659.25, 783.99, 659.25, 523.25, 440.00, 0] },
    egypt:     { tempo: 0.64, type: 'triangle', vol: 0.026, notes: [440.00, 466.16, 554.37, 587.33, 659.25, 587.33, 554.37, 466.16, 440.00, 0, 587.33, 659.25, 698.46, 659.25, 554.37, 440.00] },
    marrakech: { tempo: 0.50, type: 'triangle', vol: 0.026, notes: [523.25, 587.33, 622.25, 783.99, 698.46, 622.25, 587.33, 523.25, 466.16, 523.25, 622.25, 783.99, 880.00, 783.99, 622.25, 0] }
  };

  LS.tickGhibliMusic = function (dt) {
    if (!LS.state.soundEnabled || !LS.runtime.audioUnlocked) return;
    if (LS.runtime.modalOpen) return; // stay quiet while playing piano or quizzes!
    musicTimer -= dt;
    if (musicTimer > 0) return;

    const wid = LS.state.currentWorld;
    const meta = LS.WORLDS[wid];
    const themeKey = (meta && meta.isInterior) ? 'indoor'
      : (GHIBLI_THEMES[wid] ? wid : 'home');
    const theme = GHIBLI_THEMES[themeKey] || GHIBLI_THEMES.home;
    musicTimer = theme.tempo;

    const freq = theme.notes[musicStep % theme.notes.length];
    if (freq > 0) {
      LS.playTone(freq, theme.tempo * 1.45, theme.type, 0, theme.vol);
      // Warm soft bass root every 4 beats
      if (musicStep % 4 === 0) {
        LS.playTone(freq * 0.5, theme.tempo * 2.2, 'sine', 0, theme.vol * 0.65);
      }
    }
    musicStep = (musicStep + 1) % 64;
  };

  // Gentle ambient African Savanna soundscape (soft periodic bird chirps & warm marimba breeze notes)
  let safariAmbTimer = 3.5;
  LS.tickSafariAmbience = function (dt) {
    if (!LS.state.soundEnabled || !LS.runtime.audioUnlocked || LS.state.currentWorld !== 'safari') return;
    safariAmbTimer -= dt;
    if (safariAmbTimer > 0) return;
    safariAmbTimer = 6.5 + Math.random() * 5.0;
    const roll = Math.random();
    if (roll < 0.6) {
      const f = 1480 + Math.random() * 520;
      LS.playTone(f, 0.07, 'sine', 0, 0.022);
      LS.playTone(f * 1.18, 0.09, 'sine', 0.09, 0.018);
    } else {
      LS.playTone(520, 0.14, 'sine', 0, 0.016);
      LS.playTone(690, 0.18, 'sine', 0.12, 0.014);
    }
  };
})(window.LailaSalma);
