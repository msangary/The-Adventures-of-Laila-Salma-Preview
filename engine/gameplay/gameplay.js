window.LailaSalma = window.LailaSalma || {};

(function (LS) {
  const TOKYO_GK_POOL = [
    { q: 'Which planet is known as the Red Planet?', opts: ['Mars', 'Venus', 'Jupiter', 'Saturn'], a: 0 },
    { q: 'What is the capital city of Japan?', opts: ['Osaka', 'Kyoto', 'Tokyo', 'Sapporo'], a: 2 },
    { q: 'How many legs does a butterfly have?', opts: ['4', '6', '8', '10'], a: 1 },
    { q: 'Which gas do plants absorb from the air to make food?', opts: ['Oxygen', 'Carbon Dioxide', 'Helium', 'Neon'], a: 1 },
    { q: 'What is the largest ocean on Earth?', opts: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], a: 3 },
    { q: 'Which season do sakura (cherry blossoms) bloom in Japan?', opts: ['Spring', 'Summer', 'Autumn', 'Winter'], a: 0 },
    { q: 'How many continents are there on Earth?', opts: ['5', '6', '7', '8'], a: 2 },
    { q: 'Which animal is the tallest land mammal?', opts: ['Elephant', 'Giraffe', 'Camel', 'Horse'], a: 1 },
    { q: 'What colors make green when mixed together?', opts: ['Red & Blue', 'Blue & Yellow', 'Red & Yellow', 'Blue & White'], a: 1 },
    { q: 'How many days are in a leap year?', opts: ['364', '365', '366', '367'], a: 2 },
    { q: 'Which organ pumps blood through your body?', opts: ['Lungs', 'Brain', 'Heart', 'Stomach'], a: 2 },
    { q: 'What is the freezing point of water in Celsius?', opts: ['0°C', '10°C', '32°C', '100°C'], a: 0 }
  ];

  const KYOTO_GK_POOL = [
    { q: 'What famous high-speed train connects Tokyo and Kyoto?', opts: ['Shinkansen', 'Submarine', 'Cable Car', 'Gondola'], a: 0 },
    { q: 'What is the name of the tall red gate at a Japanese shrine?', opts: ['Tatami', 'Torii', 'Bento', 'Origami'], a: 1 },
    { q: 'Which tall green plant grows in Kyoto’s Arashiyama Grove?', opts: ['Cactus', 'Bamboo', 'Palm Tree', 'Oak'], a: 1 },
    { q: 'What friendly animal is the messenger of Inari shrines in Kyoto?', opts: ['Kitsune (Fox)', 'Penguin', 'Kangaroo', 'Giraffe'], a: 0 },
    { q: 'What colorful fish swims in Japanese temple ponds?', opts: ['Shark', 'Koi', 'Tuna', 'Whale'], a: 1 },
    { q: 'What is the green tea powder famous in Uji, near Kyoto?', opts: ['Matcha', 'Cocoa', 'Vanilla', 'Cinnamon'], a: 0 },
    { q: 'What wooden wish plaque do visitors hang at shrines?', opts: ['Ema', 'Sushi', 'Kimono', 'Origami'], a: 0 },
    { q: 'What is a traditional Japanese inn with tatami mats called?', opts: ['Igloo', 'Ryokan', 'Castle', 'Lighthouse'], a: 1 },
    { q: 'What paper fortune slip do people draw at shrines?', opts: ['Omikuji', 'Ramen', 'Gachapon', 'Shiba'], a: 0 },
    { q: 'Which city was Japan’s ancient imperial capital for over 1,000 years?', opts: ['Kyoto', 'Sapporo', 'Okinawa', 'Yokohama'], a: 0 }
  ];

  const SAFARI_GK_POOL = [
    { q: 'Which animal is the tallest land mammal on the African savanna?', opts: ['Elephant', 'Giraffe', 'Zebra', 'Lion'], a: 1 },
    { q: 'What is a family group of lions called?', opts: ['A Herd', 'A Flock', 'A Pride', 'A Pack'], a: 2 },
    { q: 'What is Africa’s tallest mountain, famous for its snowy peak?', opts: ['Mt. Fuji', 'Mt. Kilimanjaro', 'Mt. Everest', 'Mt. Blanc'], a: 1 },
    { q: 'Which giant animal uses its long trunk to drink water and say hello?', opts: ['Hippo', 'Rhino', 'Elephant', 'Giraffe'], a: 2 },
    { q: 'What iconic flat-topped tree shades giraffes across the savanna?', opts: ['Acacia Tree', 'Pine Tree', 'Maple Tree', 'Willow Tree'], a: 0 },
    { q: 'Which black-and-white striped animal runs in savanna herds?', opts: ['Tiger', 'Panda', 'Zebra', 'Penguin'], a: 2 },
    { q: 'Why are flamingos bright pink?', opts: ['From sunny weather', 'From the food they eat', 'From painted feathers', 'From swimming in mud'], a: 1 },
    { q: 'What is the fastest land animal in Africa?', opts: ['Cheetah', 'Elephant', 'Giraffe', 'Tortoise'], a: 0 },
    { q: 'Which ancient African tree has a huge bottle-shaped trunk that stores water?', opts: ['Cherry Tree', 'Baobab Tree', 'Bamboo', 'Cedar'], a: 1 },
    { q: 'What do elephants flap to cool themselves down on hot savanna days?', opts: ['Their tails', 'Their big ears', 'Their tusks', 'Their hooves'], a: 1 }
  ];

  const HOME_GK_POOL = [
    { q: 'Which meal gives Laila & Salma healthy energy from fruits and yogurt?', opts: ['Healthy Snack', 'Salty Chips Only', 'Candy Bar Only', 'Soda'], a: 0 },
    { q: 'How many keys are in one full musical octave from C to C on a piano?', opts: ['5', '6', '8', '12'], a: 2 },
    { q: 'Which tool in the sisters’ bedroom lets you spin and explore countries around Earth?', opts: ['A World Globe', 'A Toaster', 'A Hammer', 'A Clock'], a: 0 },
    { q: 'What helps plants in a community courtyard grow tall and green?', opts: ['Sunlight & Water', 'Dark Closets', 'Ice Cubes Only', 'Sand Only'], a: 0 },
    { q: 'How many minutes are in one full hour?', opts: ['30', '45', '60', '100'], a: 2 },
    { q: 'Which shape has 4 equal sides and 4 square corners?', opts: ['Triangle', 'Square', 'Circle', 'Oval'], a: 1 },
    { q: 'What should good neighbors always say when greeting the security guard?', opts: ['Good morning & Thank you!', 'Nothing at all', 'Run away fast', 'Hide behind a bush'], a: 0 },
    { q: 'Which sense do we use to hear Laila play a song on the dining room piano?', opts: ['Smell', 'Taste', 'Hearing', 'Touch'], a: 2 }
  ];

  // Salma-friendly Age-5 Picture Quiz Pool (big visual emojis + simple counting/matching)
  const SALMA_POOL = [
    { q: '🐱🐱 + 🐱 = How many kitties altogether?', opts: ['2 🐱', '3 🐱', '4 🐱', '5 🐱'], a: 1 },
    { q: '🦊 Which animal is a cute orange fox?', opts: ['🐕 Dog', '🐱 Cat', '🦊 Fox', '🦆 Duck'], a: 2 },
    { q: '🍓 What color is a sweet strawberry?', opts: ['🔴 Red', '🔵 Blue', '🟡 Yellow', '🟢 Green'], a: 0 },
    { q: '🐟🐟🐟 + 🐟 = How many koi fish in the pond?', opts: ['2 🐟', '3 🐟', '4 🐟', '6 🐟'], a: 2 },
    { q: '🚅 Which one zooms on train tracks?', opts: ['⛵ Boat', '🚅 Bullet Train', '🚲 Bike', '🎈 Balloon'], a: 1 },
    { q: '🌸 What color are cherry blossom petals?', opts: ['🩷 Pink', '⚫ Black', '🟢 Green', '🟤 Brown'], a: 0 },
    { q: '🍜 Which yummy treat has hot noodles?', opts: ['🍎 Apple', '🍜 Ramen', '🍦 Ice Cream', '🧀 Cheese'], a: 1 },
    { q: '🎋 Which plant grows super tall and green?', opts: ['🎋 Bamboo', '🌷 Tulip', '🍄 Mushroom', '🌻 Sunflower'], a: 0 },
    { q: '🦆 What sound does a happy lake duck make?', opts: ['Meow!', 'Woof!', 'Quack!', 'Moo!'], a: 2 },
    { q: '⭐ + ⭐⭐ = How many shiny stars?', opts: ['1 ⭐', '2 ⭐', '3 ⭐', '5 ⭐'], a: 2 },
    { q: '🦒 Which tall spotted friend eats leaves from treetops?', opts: ['🦒 Giraffe', '🐧 Penguin', '🐟 Fish', '🐢 Turtle'], a: 0 },
    { q: '🐘🐘 + 🐘 = How many gentle elephants at the pond?', opts: ['2 🐘', '3 🐘', '4 🐘', '5 🐘'], a: 1 },
    { q: '🦁 What sound does a playful lion cub make?', opts: ['Quack!', 'Roar!', 'Tweet!', 'Splash!'], a: 1 },
    { q: '🦩 What color is a pretty savanna flamingo?', opts: ['🩷 Pink', '🔵 Blue', '🟢 Green', '⚫ Black'], a: 0 }
  ];

  const OMIKUJI_FORTUNES = [
    { rank: '大吉 • Dai-kichi (GREAT LUCK!)', emoji: '🌟', text: 'Sparkling adventures await Laila & Salma! A hidden friend is smiling nearby!', bonusCoins: 25, bonusXp: 20 },
    { rank: '中吉 • Chu-kichi (Middle Luck!)', emoji: '🌸', text: 'A sweet treat and a sister high-five will bring extra speed and giggles today!', bonusCoins: 18, bonusXp: 15 },
    { rank: '小吉 • Sho-kichi (Cozy Luck!)', emoji: '🎋', text: 'Take a peaceful walk by the koi pond — good things come to kind explorers!', bonusCoins: 15, bonusXp: 12 },
    { rank: '吉 • Kichi (Happy Luck!)', emoji: '🦊', text: 'The playful kitsune foxes bless your Travel Passport with bright new stamps!', bonusCoins: 20, bonusXp: 15 }
  ];

  const RAMEN_CATALOG = {
    shoyu: { name: 'Shoyu Ramen', short: 'Speed+', cost: 40, speedMult: 1.2, infiniteStamina: false, durationMs: 180000, bonusXp: 0 },
    miso: { name: 'Miso Ramen', short: 'Inf.Run', cost: 60, speedMult: 1.1, infiniteStamina: true, durationMs: 180000, bonusXp: 0 },
    tonkotsu: { name: 'Special Tonkotsu', short: 'Turbo', cost: 90, speedMult: 1.3, infiniteStamina: true, durationMs: 240000, bonusXp: 25 }
  };

  const SUSHI_CATALOG = {
    tamago: { name: 'Sweet Tamago Sushi', short: 'Speed+', cost: 35, speedMult: 1.2, infiniteStamina: false, durationMs: 180000, bonusXp: 5 },
    salmon: { name: 'Fresh Salmon Nigiri', short: 'Inf.Run', cost: 55, speedMult: 1.15, infiniteStamina: true, durationMs: 180000, bonusXp: 10 },
    sushi_boat: { name: 'Royal Kyoto Sushi Boat ⭐', short: 'Kyoto⚡', cost: 85, speedMult: 1.32, infiniteStamina: true, durationMs: 240000, bonusXp: 25 }
  };

  const EGYPT_GK_POOL = [
    { q: 'Which long, sparkling river flows right through Egypt?', opts: ['Amazon River', 'Nile River', 'Thames River', 'Seine River'], a: 1 },
    { q: 'What were the picture-symbols written by Ancient Egyptian scribes called?', opts: ['Hieroglyphs', 'Origami', 'Calligraphy', 'Runes'], a: 0 },
    { q: 'Which famous statue near the Great Pyramids has the body of a lion?', opts: ['The Minotaur', 'The Great Sphinx', 'Pegasus', 'A Griffin'], a: 1 },
    { q: 'What is a traditional wooden Egyptian boat with a tall white triangular sail called?', opts: ['Gondola', 'Felucca', 'Longship', 'Canoe'], a: 1 },
    { q: 'Which animal was treasured as a royal friend in Ancient Egyptian homes?', opts: ['Penguins', 'Cats', 'Koalas', 'Polar Bears'], a: 1 },
    { q: 'What giant golden stone monuments were built for Egyptian Pharaohs?', opts: ['Pagodas', 'Pyramids', 'Igloos', 'Castles'], a: 1 }
  ];

  const MARRAKECH_GK_POOL = [
    { q: 'What is the name of the colorful geometric Moroccan mosaic tilework?', opts: ['Zellige', 'Tatami', 'Origami', 'Stained Wood'], a: 0 },
    { q: 'Which majestic snow-dusted mountain range rises near Marrakech?', opts: ['The Alps', 'The Atlas Mountains', 'The Andes', 'Mount Fuji'], a: 1 },
    { q: 'What sweet, fragrant drink is famously poured from high up in Morocco?', opts: ['Mint Tea', 'Lemonade', 'Matcha', 'Apple Cider'], a: 0 },
    { q: 'What cone-shaped clay pot is used to cook delicious Moroccan stews?', opts: ['Wok', 'Tagine', 'Skillet', 'Teapot'], a: 1 },
    { q: 'Which tiny Sahara desert fox has super-big cute ears to stay cool?', opts: ['Arctic Fox', 'Fennec Fox', 'Red Fox', 'Kitsune'], a: 1 },
    { q: 'What does "Marhaba" mean in Arabic when greeting friends in Marrakech?', opts: ['Goodnight', 'Welcome / Hello', 'See you later', 'Thank you'], a: 1 }
  ];

  function seededRand(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function generateQuiz(seed, worldId, salmaMode) {
    const rng = seededRand(seed);
    const questions = [];

    if (salmaMode) {
      const pool = SALMA_POOL.slice();
      for (let i = 0; i < 4; i++) {
        const idx = Math.floor(rng() * pool.length);
        const item = pool.splice(idx, 1)[0];
        questions.push({ cat: "Salma's Picture Quiz 🌈", q: item.q, opts: item.opts, a: item.a });
      }
      return questions;
    }

    const pool = (
      worldId === 'home_neighborhood' ? HOME_GK_POOL :
      worldId === 'safari' ? SAFARI_GK_POOL :
      worldId === 'egypt' ? EGYPT_GK_POOL :
      worldId === 'marrakech' ? MARRAKECH_GK_POOL :
      worldId === 'kyoto' ? KYOTO_GK_POOL : TOKYO_GK_POOL
    ).slice();
    const catName =
      worldId === 'home_neighborhood' ? 'Sunny Oaks School' :
      worldId === 'safari' ? 'Safari Wildlife' :
      worldId === 'egypt' ? 'Ancient Egypt' :
      worldId === 'marrakech' ? 'Marrakech & Morocco' :
      worldId === 'kyoto' ? 'Kyoto Discovery' : 'Tokyo & World Quiz';
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(rng() * pool.length);
      const item = pool.splice(idx, 1)[0];
      questions.push({ cat: catName, q: item.q, opts: item.opts, a: item.a });
    }

    for (let i = 0; i < 2; i++) {
      const a = 4 + Math.floor(rng() * 18);
      const b = 3 + Math.floor(rng() * 14);
      const isAdd = rng() > 0.4;
      const ans = isAdd ? a + b : (a + b) - b;
      const qText = isAdd ? ('What is ' + a + ' + ' + b + '?') : ('What is ' + (a + b) + ' - ' + b + '?');
      const set = new Set([ans]);
      while (set.size < 4) {
        const delta = Math.floor(rng() * 9) - 4;
        if (ans + delta >= 0) set.add(ans + delta);
      }
      const opts = Array.from(set).sort(() => rng() - 0.5);
      questions.push({ cat: 'Math', q: qText, opts: opts.map(String), a: opts.indexOf(ans) });
    }
    return questions;
  }

  let activeQuiz = null;
  let activeQuizWorld = 'tokyo';
  let timerInterval = null;
  let activeShopTab = 'laila';
  let activeShopFilter = 'all';
  let activeRoomTab = 'wallpaper';
  let activeRyokanTab = 'tatami';

  function formatMs(ms) {
    const total = Math.ceil(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
  }

  function refreshSchoolLobby() {
    const cd = LS.getQuizCooldownMs(activeQuizWorld);
    const box = document.getElementById('quiz-timer-box');
    const startBtn = document.getElementById('btn-start-quiz');
    const salmaBtn = document.getElementById('btn-salma-quiz');
    if (cd <= 0) {
      box.innerHTML = '✅ <strong>New 2-Hour Quiz Ready!</strong> Earn up to <strong>+60 XP</strong> &amp; <strong>+75c</strong>.';
      startBtn.disabled = false;
      if (salmaBtn) salmaBtn.disabled = false;
    } else {
      box.innerHTML = '⏳ Next graded quiz refreshes in <strong>' + formatMs(cd) + '</strong>. Practice Mode is always open!';
      startBtn.disabled = true;
      if (salmaBtn) salmaBtn.disabled = false; // Salma's Picture Quiz can always be played for gentle fun!
    }
  }

  LS.openSchoolModal = function (worldId) {
    activeQuizWorld = worldId || LS.state.currentWorld;
    LS.runtime.modalOpen = true;
    const titleEl = document.getElementById('school-modal-title');
    const backBtn = document.getElementById('btn-school-back');
    if (titleEl) {
      titleEl.textContent = activeQuizWorld === 'home_neighborhood'
        ? '🏫 Sunny Oaks School — Ms. Nadia\'s Quiz'
        : (activeQuizWorld === 'safari'
          ? '👨‍🏫 Dr. Kofi — Safari Wildlife Quiz'
          : (activeQuizWorld === 'egypt'
            ? '📜 Scribe Imhotep — Ancient Egypt Quiz'
            : (activeQuizWorld === 'marrakech'
              ? '🕌 Teacher Youssef — Marrakech Discovery Quiz'
              : (activeQuizWorld === 'kyoto'
                ? '👨‍🏫 Sensei Kenji — Kyoto Discovery Quiz'
                : '👩‍🏫 Sensei Haruka — Tokyo Town Quiz'))));
    }
    if (backBtn) {
      backBtn.textContent = activeQuizWorld === 'home_neighborhood'
        ? 'Back to Home Community'
        : (activeQuizWorld === 'safari'
          ? 'Back to Safari'
          : (activeQuizWorld === 'egypt'
            ? 'Back to Ancient Egypt'
            : (activeQuizWorld === 'marrakech'
              ? 'Back to Marrakech'
              : (activeQuizWorld === 'kyoto' ? 'Back to Kyoto' : 'Back to Tokyo'))));
    }
    document.getElementById('school-modal').classList.remove('hidden');
    document.getElementById('school-lobby').classList.remove('hidden');
    document.getElementById('school-question').classList.add('hidden');
    document.getElementById('school-report').classList.add('hidden');
    refreshSchoolLobby();
    clearInterval(timerInterval);
    timerInterval = setInterval(refreshSchoolLobby, 1000);
  };

  function renderQuestion() {
    const qObj = activeQuiz.questions[activeQuiz.index];
    document.getElementById('q-progress').textContent = 'Question ' + (activeQuiz.index + 1) + ' / ' + activeQuiz.questions.length;
    document.getElementById('q-category').textContent = qObj.cat;
    document.getElementById('q-text').textContent = qObj.q;

    const fb = document.getElementById('q-feedback');
    fb.classList.add('hidden');

    const grid = document.getElementById('q-options');
    grid.innerHTML = '';
    qObj.opts.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(idx, btn);
      grid.appendChild(btn);
    });
  }

  function handleAnswer(idx, btn) {
    if (activeQuiz.locked) return;
    activeQuiz.locked = true;
    const qObj = activeQuiz.questions[activeQuiz.index];
    const buttons = document.querySelectorAll('#q-options .option-btn');
    const fb = document.getElementById('q-feedback');
    fb.classList.remove('hidden');

    if (idx === qObj.a) {
      activeQuiz.score += 1;
      btn.classList.add('correct');
      fb.textContent = '🌟 Great job, Laila & Salma! That is correct!';
      LS.playSFX('correct');
    } else {
      btn.classList.add('wrong');
      if (buttons[qObj.a]) buttons[qObj.a].classList.add('correct');
      fb.textContent = '💡 Good try! The right answer is: ' + qObj.opts[qObj.a];
      LS.playSFX('wrong');
    }

    setTimeout(() => {
      activeQuiz.index += 1;
      activeQuiz.locked = false;
      if (activeQuiz.index < activeQuiz.questions.length) {
        renderQuestion();
      } else {
        finishQuiz();
      }
    }, 1050);
  }

  function finishQuiz() {
    document.getElementById('school-question').classList.add('hidden');
    document.getElementById('school-report').classList.remove('hidden');

    const total = activeQuiz.questions.length;
    const s = activeQuiz.score;
    const tag = activeQuiz.salmaMode ? " (Salma's Picture Quiz 🌈)" : (activeQuiz.practice ? ' (Practice Mode)' : '');
    document.getElementById('report-summary').textContent =
      'Laila & Salma scored ' + s + ' out of ' + total + tag + '!';

    const rew = document.getElementById('report-rewards');
    if (activeQuiz.salmaMode) {
      const cGain = 15 + s * 6;
      const xGain = 12 + s * 6;
      LS.addCoins(cGain);
      LS.addXP(xGain);
      LS.markQuizCompleted(activeQuizWorld);
      rew.innerHTML = '🌈 Amazing work, Salma & Laila! Earned <strong>+' + xGain + ' XP</strong> and <strong>+' + cGain + ' Coins</strong>!';
    } else if (activeQuiz.practice) {
      rew.innerHTML = '📝 Practice complete! Come back when the 2-hour timer refreshes for graded XP &amp; Coins.';
    } else {
      const xpGain = 15 + s * 9;
      const coinGain = 20 + s * 11;
      LS.markQuizCompleted(activeQuizWorld);
      LS.addCoins(coinGain);
      LS.addXP(xpGain);
      rew.innerHTML = '✨ Earned <strong>+' + xpGain + ' XP</strong> and <strong>+' + coinGain + ' Coins</strong>!';
    }
    if (LS.advanceStoryStep) {
      if (activeQuizWorld === 'tokyo') LS.advanceStoryStep('tokyo', 'tokyo_teacher');
      else if (activeQuizWorld === 'kyoto') LS.advanceStoryStep('kyoto', 'kyoto_teacher');
      else if (activeQuizWorld === 'safari') LS.advanceStoryStep('safari', 'safari_teacher');
    }
    if (LS.completeCozyMission) LS.completeCozyMission('quiz');
  }

  // Travel Passport & World Map
  LS.openPassportModal = function () {
    LS.runtime.modalOpen = true;
    const worldsBox = document.getElementById('passport-worlds');
    const stampsBox = document.getElementById('passport-stamps');
    const enabledWorlds = LS.getEnabledOutdoorWorlds ? LS.getEnabledOutdoorWorlds() : ['home_neighborhood', 'safari', 'egypt', 'marrakech', 'tokyo'];
    const pSub = document.querySelector('#passport-modal .ramen-sub');
    if (pSub) {
      const names = enabledWorlds.map(wid => (wid === 'tokyo' ? 'Japan (Tokyo & Kyoto)' : (LS.WORLDS[wid] ? LS.WORLDS[wid].title : wid)));
      pSub.textContent = 'Travel between ' + names.join(', ') + ' anytime — coins, outfits, toys, and stamps travel with you!';
    }
    if (worldsBox) {
      worldsBox.innerHTML = '';
      enabledWorlds.forEach(wid => {
        const w = LS.WORLDS[wid];
        if (!w) return;
        const curW = LS.state.currentWorld;
        const isJapan = wid === 'tokyo';
        const inTokyo = curW === 'tokyo' || curW === 'tokyo_room';
        const inKyoto = curW === 'kyoto' || curW === 'kyoto_room';
        const isHere = isJapan
          ? (inTokyo || inKyoto)
          : (curW === wid
            || (wid === 'home_neighborhood' && (curW === 'home_apartment' || curW.indexOf('dest_') === 0))
            || (wid === 'safari' && curW === 'safari_tent')
            || (wid === 'egypt' && curW === 'egypt_chamber')
            || (wid === 'marrakech' && curW === 'marrakech_riad'));

        const foundCount = wid === 'home_neighborhood'
          ? (LS.state.foundHomePets ? LS.state.foundHomePets.length : 0)
          : (wid === 'safari'
            ? (LS.state.foundLionCubs ? LS.state.foundLionCubs.length : 0)
            : (wid === 'egypt'
              ? (LS.state.foundEgyptCats ? LS.state.foundEgyptCats.length : 0)
              : (wid === 'marrakech'
                ? (LS.state.foundMarrakechFoxes ? LS.state.foundMarrakechFoxes.length : 0)
                : (LS.state.foundCats ? LS.state.foundCats.length : 0))));
        const kyotoCount = LS.state.foundKitsune ? LS.state.foundKitsune.length : 0;
        const remMs = LS.getAnimalResetRemainingMs(wid);
        const resetHtml = foundCount >= 5
          ? ('<div class="ramen-desc" style="color:#1b7a43;font-weight:700;">✨ All 5 found! New hiding spots in ' +
             (remMs > 0 ? formatMs(remMs) : 'Ready now!') + '</div>')
          : '';

        const displayEmoji = isJapan ? '🇯🇵' : w.emoji;
        const displayTitle = isJapan ? 'Japan (Tokyo & Kyoto)' : w.title;
        const displaySub = isJapan ? 'Sakura-cho Tokyo • Kyoto Lanterns & Shrine (Connected by Shinkansen 🚅)' : w.subtitle;
        const displayDesc = isJapan
          ? 'Land in expanded Sakura-cho Tokyo and ride the Shinkansen Bullet Train straight to Kyoto! Quiz with Sensei Haruka & Sensei Kenji, share ramen & matcha, visit Gion Lantern Street & Bamboo Grove, and find 5 Tokyo Cats + 5 Kyoto Kitsune Foxes!'
          : w.description;
        const progressHtml = isJapan
          ? ('🐱 ' + foundCount + '/5 • 🦊 ' + kyotoCount + '/5')
          : (w.collectibleEmoji + ' ' + foundCount + '/5');

        const card = document.createElement('div');
        card.className = 'passport-world-card' + (isHere ? ' current-world' : '');
        card.innerHTML =
          '<div class="pw-head">' +
            '<div><strong>' + displayEmoji + ' ' + displayTitle + '</strong> <span class="pw-sub">' + displaySub + '</span></div>' +
            '<span class="pw-progress">' + progressHtml + '</span>' +
          '</div>' +
          '<p class="ramen-desc">' + displayDesc + '</p>' + resetHtml;

        const actions = document.createElement('div');
        actions.className = 'modal-actions';
        const btn = document.createElement('button');
        if (isHere) {
          btn.className = 'btn-secondary';
          btn.textContent = isJapan ? (inKyoto ? 'Currently in Kyoto ✓' : 'Currently in Tokyo ✓') : 'Currently Here ✓';
          btn.disabled = true;
          actions.appendChild(btn);
          if (isJapan) {
            const shinkBtn = document.createElement('button');
            shinkBtn.className = 'btn-primary';
            shinkBtn.textContent = inKyoto ? '🚅 Ride Shinkansen to Tokyo' : '🚅 Ride Shinkansen to Kyoto';
            shinkBtn.onclick = () => LS.travelToWorld(inKyoto ? 'tokyo' : 'kyoto');
            actions.appendChild(shinkBtn);
          }
        } else {
          btn.className = 'btn-primary';
          const isGlobe = wid === 'home_neighborhood' || curW === 'home_neighborhood' || curW === 'home_apartment' || curW.indexOf('dest_') === 0;
          btn.textContent = (isGlobe ? '🌍 Magic Globe to ' : '✈️ Fly to ') + (isJapan ? 'Japan' : w.title);
          btn.onclick = () => LS.travelToWorld(wid);
          actions.appendChild(btn);
        }

        if (foundCount >= 5) {
          const resetBtn = document.createElement('button');
          resetBtn.className = 'btn-small';
          resetBtn.textContent = '🔄 Hide in New Spots Now';
          resetBtn.onclick = () => {
            LS.closeAllModals();
            LS.startNewAnimalRound(wid);
          };
          actions.appendChild(resetBtn);
        }
        card.appendChild(actions);
        worldsBox.appendChild(card);
      });

      if (LS.shouldShowUpcomingWorlds && LS.shouldShowUpcomingWorlds()) {
        const airportNote = document.createElement('div');
        airportNote.className = 'passport-world-card upcoming-world';
        airportNote.innerHTML =
          '<div class="pw-head"><div><strong>🌍 Magic Globe — Upcoming Worlds</strong></div><span class="pw-soon">' + LS.UPCOMING_WORLDS.length + ' Coming Soon</span></div>' +
          '<p class="ramen-desc">Next destinations: ' + LS.UPCOMING_WORLDS.map(u => u.emoji + ' ' + u.title).join(' • ') + '</p>';
        worldsBox.appendChild(airportNote);
      }
    }

    if (stampsBox) {
      stampsBox.innerHTML = '';
      const activeStamps = LS.getActivePassportStamps ? LS.getActivePassportStamps() : LS.PASSPORT_STAMPS;
      activeStamps.forEach(st => {
        const earned = LS.state.stamps.includes(st.id);
        const el = document.createElement('div');
        el.className = 'stamp-slot ' + (earned ? 'earned' : 'locked');
        el.title = st.desc;
        el.innerHTML =
          '<div class="stamp-emoji">' + (earned ? st.emoji : '⬜') + '</div>' +
          '<div class="stamp-name">' + (earned ? st.title : 'Locked Stamp') + '</div>';
        stampsBox.appendChild(el);
      });
    }
    const resetBtn = document.getElementById('btn-reset-progress');
    const resetBox = document.getElementById('reset-confirm-box');
    if (resetBtn) resetBtn.classList.remove('hidden');
    if (resetBox) resetBox.classList.add('hidden');
    document.getElementById('passport-modal').classList.remove('hidden');
  };

  // International Airport & Safari Airstrip Departures Board (Present-Day Locations Only!)
  LS.openAirportModal = function () {
    LS.runtime.modalOpen = true;
    const curW = LS.state.currentWorld;
    const leader = LS.getLeaderName ? LS.getLeaderName() : 'Laila';
    const showUpcoming = Boolean(LS.shouldShowUpcomingWorlds && LS.shouldShowUpcomingWorlds());
    if (curW === 'tokyo' && LS.isWorldEnabled && LS.isWorldEnabled('tokyo')) LS.unlockStamp('tokyo_airport');

    const titleEl = document.getElementById('airport-modal-title');
    const subEl = document.getElementById('airport-modal-sub');
    if (titleEl) {
      titleEl.textContent = curW === 'safari'
        ? '✈️ Serengeti Safari Airstrip'
        : (curW === 'tokyo' ? '✈️ Haneda-Tokyo International Airport' : '✈️ Sunnyside International Airport');
    }
    if (subEl) {
      subEl.textContent = '“Welcome aboard, ' + leader + '! Fly from here to any present-day destination around the world!”';
    }

    const grid = document.getElementById('airport-flights-grid');
    if (grid) {
      grid.innerHTML = '';
      const liveHdr = document.createElement('div');
      liveHdr.className = 'airport-section-hdr';
      liveHdr.textContent = '✈️ Now Boarding — Present-Day International Flights!';
      grid.appendChild(liveHdr);

      const allPresentDayFlights = [
        { id: 'safari', emoji: '🦁', title: 'African Safari & Wildlife Zoo (Serengeti)', gate: 'Gate A1 • Open', desc: 'Ride a zebra-striped Safari Jeep, feed tall giraffes & elephants, ride the Hot Air Balloon & find 5 playful lion cubs!' },
        { id: 'marrakech', emoji: '🏮', title: 'Marrakech Lantern Bazaar (Morocco)', gate: 'Gate A2 • Open', desc: 'Craft glowing stained-glass lanterns, sip high-poured Riad mint tea, decorate your rooftop suite & meet Fennec Foxes!' },
        { id: 'home_neighborhood', emoji: '🏡', title: 'Home Community (Egypt)', gate: 'Gate H0 • Home', desc: 'Fly straight back home to your Apartment, Gedo Mahmoud & Nana Omaima\'s House, and the Gray Nissan Qashqai!' },
        { id: 'tokyo', emoji: '🇯🇵', title: 'Japan (Tokyo & Kyoto)', gate: 'Gate J1 • Open', desc: 'Fly to Sakura-cho Tokyo and ride the Shinkansen Bullet Train straight to Kyoto\'s Shrine & Bamboo Grove!' }
      ];

      const isHomeArea = curW === 'home_neighborhood' || curW === 'home_apartment' || curW.indexOf('dest_') === 0;
      const liveFlights = allPresentDayFlights.filter(fl => {
        if (LS.isWorldEnabled && !LS.isWorldEnabled(fl.id)) return false;
        if (fl.id === 'home_neighborhood' && isHomeArea) return false;
        if (fl.id === curW) return false;
        return true;
      });

      liveFlights.forEach(fl => {
        const row = document.createElement('div');
        row.className = 'ramen-item bonus-flight';
        const info = document.createElement('div');
        info.innerHTML =
          '<strong>' + fl.emoji + ' ' + fl.title + '</strong> ' +
          '<span class="pw-bonus">' + fl.gate + '</span>' +
          '<div class="ramen-desc">' + fl.desc + '</div>';
        const btn = document.createElement('button');
        btn.className = 'btn-small';
        btn.textContent = '✈️ Board Flight!';
        btn.onclick = () => LS.travelToWorld(fl.id, 'plane');
        row.appendChild(info);
        row.appendChild(btn);
        grid.appendChild(row);
      });

      // Only show upcoming unbuilt routes in Preview — never spoil future worlds in the Live version!
      if (showUpcoming) {
        const nonPresentIds = { greece: true, egypt: true, outer_space: true, dinosaurs: true };
        const upcomingPresent = (LS.UPCOMING_WORLDS || []).filter(uw => !uw.bonus && !nonPresentIds[uw.id]);
        if (upcomingPresent.length > 0) {
          const upHdr = document.createElement('div');
          upHdr.className = 'airport-section-hdr';
          upHdr.textContent = '🌍 Upcoming Present-Day Flight Routes (Preview Roadmap)';
          grid.appendChild(upHdr);
          upcomingPresent.forEach(uw => {
            const row = document.createElement('div');
            row.className = 'ramen-item';
            row.innerHTML =
              '<div>' +
                '<strong>' + uw.emoji + ' ' + uw.title + '</strong> ' +
                '<span class="pw-soon">' + uw.gate + '</span>' +
                '<div class="ramen-desc">' + uw.description + '</div>' +
              '</div>' +
              '<span class="pw-soon">Coming Soon ✈️</span>';
            grid.appendChild(row);
          });
        }
      }

      // Friendly pointer to the Enchanted Bookshelf (never spoils unbuilt worlds in Live!)
      const tip = document.createElement('div');
      tip.className = 'ramen-item';
      tip.style.background = 'rgba(255, 244, 214, 0.72)';
      tip.innerHTML =
        '<div><strong>📚 Looking for Ancient Egypt &amp; Timeless Realms?</strong>' +
        '<div class="ramen-desc">Airplanes only fly to present-day places! Open the <strong>Enchanted Bookshelf</strong> inside Laila\'s Apartment to step into storybooks you can\'t reach by plane! ✨</div></div>';
      grid.appendChild(tip);
    }
    document.getElementById('airport-modal').classList.remove('hidden');
  };

  // Enchanted Adventure Bookshelf in Laila's Apartment (Time-Travel, Outer Space & Magical Worlds!)
  LS.openBookshelfModal = function () {
    LS.runtime.modalOpen = true;
    const leader = LS.getLeaderName ? LS.getLeaderName() : 'Laila';
    const showUpcoming = Boolean(LS.shouldShowUpcomingWorlds && LS.shouldShowUpcomingWorlds());
    const greet = document.getElementById('bookshelf-greeting');
    if (greet) {
      greet.textContent = showUpcoming
        ? ('Hi ' + leader + '! Open a glowing storybook to transport to places that don\'t exist today or can\'t be reached by airplane — like Ancient Egypt or Outer Space! 📚✨')
        : ('Hi ' + leader + '! Open a glowing storybook to transport to timeless places you can\'t reach by airplane! 📚✨');
    }
    const list = document.getElementById('bookshelf-worlds-list');
    if (list) {
      list.innerHTML = '';

      const liveHdr = document.createElement('div');
      liveHdr.className = 'airport-section-hdr';
      liveHdr.textContent = '✨ Glowing Storybooks — Ready to Open!';
      list.appendChild(liveHdr);

      if (!LS.isWorldEnabled || LS.isWorldEnabled('egypt')) {
        const egyptRow = document.createElement('div');
        egyptRow.className = 'ramen-item featured';
        const info = document.createElement('div');
        info.innerHTML =
          '<strong>🐪 The Golden Scrolls of Ancient Egypt</strong> <span class="pw-bonus">Time-Travel</span>' +
          '<div class="ramen-desc">Step back 4,500 years to the Great Pyramids, Golden Treasure Chamber, smiling Sphinx, Oasis Camels & white-sailed Nile Feluccas!</div>';
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = '📖 Open Book!';
        btn.onclick = () => LS.travelToWorld('egypt', 'book');
        egyptRow.appendChild(info);
        egyptRow.appendChild(btn);
        list.appendChild(egyptRow);
      }

      if (showUpcoming) {
        const soonHdr = document.createElement('div');
        soonHdr.className = 'airport-section-hdr';
        soonHdr.textContent = '🌟 Enchanted Volumes Coming Soon (Preview Roadmap)';
        list.appendChild(soonHdr);

        const futureBooks = [
          {
            emoji: '🚀',
            title: 'Starlight Atlas: Outer Space & Moon Base',
            tag: 'Space Adventure',
            desc: 'Blast off past Saturn\'s sparkling rings, bounce in low gravity across the Moon Garden, and peek through a giant cosmic telescope!'
          },
          {
            emoji: '🏺',
            title: 'Myths of Ancient Greece',
            tag: 'Wave 3A • Time-Travel',
            desc: 'Step back in time to Acropolis Hill, play joyful mini Olympic games, paint terracotta pottery & connect glowing constellations!'
          },
          {
            emoji: '🦕',
            title: 'Lost Valley of Gentle Dinosaurs',
            tag: 'Prehistoric Realm',
            desc: 'Journey 70 million years into the past to feed friendly leaf-eating Brachiosaurs and discover glowing golden amber!'
          }
        ];

        futureBooks.forEach(bk => {
          const row = document.createElement('div');
          row.className = 'ramen-item';
          row.innerHTML =
            '<div>' +
              '<strong>' + bk.emoji + ' ' + bk.title + '</strong> ' +
              '<span class="pw-soon">' + bk.tag + '</span>' +
              '<div class="ramen-desc">' + bk.desc + '</div>' +
            '</div>' +
            '<span class="pw-soon">Coming Soon 📚</span>';
          list.appendChild(row);
        });
      } else {
        const myst = document.createElement('div');
        myst.className = 'ramen-desc';
        myst.style.marginTop = '10px';
        myst.innerHTML = '✨ <em>More mysterious storybooks will magically appear on this shelf as new adventures arrive!</em>';
        list.appendChild(myst);
      }
    }
    const m = document.getElementById('bookshelf-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openShinkansenModal = function () {
    LS.runtime.modalOpen = true;
    const cur = LS.WORLDS[LS.state.currentWorld];
    const dest = LS.WORLDS[cur.destinationId];
    document.getElementById('shinkansen-title').textContent = '🚅 ' + cur.title + ' Shinkansen Station';
    document.getElementById('shinkansen-desc').textContent =
      'All aboard the N700S Bullet Train! Ride from ' + cur.title + ' to ' + dest.title + ' (' + dest.subtitle + ') with Laila, Salma & Mochi — all your coins, outfits, toys, and Passport stamps come with you!';
    const goBtn = document.getElementById('btn-board-shinkansen');
    goBtn.textContent = '🚅 Depart for ' + dest.emoji + ' ' + dest.title + '!';
    goBtn.onclick = () => LS.travelToWorld(dest.id);
    document.getElementById('shinkansen-modal').classList.remove('hidden');
  };

  LS.openRamenModal = function () {
    LS.runtime.modalOpen = true;
    document.getElementById('ramen-msg').textContent = '';
    document.getElementById('ramen-modal').classList.remove('hidden');
  };

  LS.openSushiModal = function () {
    LS.runtime.modalOpen = true;
    document.getElementById('sushi-msg').textContent = '';
    document.getElementById('sushi-modal').classList.remove('hidden');
  };

  LS.openTeaHouseModal = function () {
    LS.runtime.modalOpen = true;
    document.getElementById('tea-msg').textContent = '';
    document.getElementById('tea-modal').classList.remove('hidden');
  };

  function renderShopItems() {
    const grid = document.getElementById('shop-items-grid');
    const msgEl = document.getElementById('shop-msg');
    if (!grid) return;
    grid.innerHTML = '';

    document.getElementById('tab-laila').classList.toggle('active', activeShopTab === 'laila');
    document.getElementById('tab-salma').classList.toggle('active', activeShopTab === 'salma');

    const equippedId = activeShopTab === 'laila' ? LS.state.equippedLaila : LS.state.equippedSalma;
    const list = LS.OUTFITS.filter(o =>
      o.who === activeShopTab && (activeShopFilter === 'all' || o.shop === activeShopFilter)
    );

    list.forEach(item => {
      const unlocked = LS.state.unlockedOutfits.includes(item.id);
      const isEquipped = equippedId === item.id;

      const row = document.createElement('div');
      row.className = 'shop-item' + (isEquipped ? ' equipped' : '');

      const originTag = item.shop === 'egypt' ? '👑'
        : (item.shop === 'marrakech' ? '🏮'
          : (item.shop === 'safari' ? '🦁' : (item.shop === 'kyoto' ? '⛩️' : '🗼')));
      const info = document.createElement('div');
      info.innerHTML =
        '<strong><span class="swatch-dot" style="background:' + item.swatch + '"></span>' + item.name + ' ' + originTag + '</strong>' +
        '<div class="ramen-desc">' + item.desc + '</div>';

      const btn = document.createElement('button');
      if (isEquipped) {
        btn.className = 'btn-secondary';
        btn.textContent = 'Equipped ✓';
        btn.disabled = true;
      } else if (unlocked) {
        btn.className = 'btn-primary';
        btn.textContent = 'Wear';
        btn.onclick = () => {
          if (activeShopTab === 'laila') LS.state.equippedLaila = item.id;
          else LS.state.equippedSalma = item.id;
          LS.saveState();
          LS.applyOutfit(activeShopTab, item.id);
          LS.playSFX('coin');
          msgEl.textContent = '';
          renderShopItems();
          LS.showToast('✨ Equipped ' + item.name + '!');
        };
      } else {
        btn.className = 'btn-primary';
        btn.textContent = item.cost + 'c';
        btn.onclick = () => {
          if (LS.state.coins < item.cost) {
            msgEl.textContent = 'Not enough coins! Find hidden friends, feed koi, or take a quiz.';
            LS.playSFX('wrong');
            return;
          }
          LS.addCoins(-item.cost);
          LS.state.unlockedOutfits.push(item.id);
          if (activeShopTab === 'laila') LS.state.equippedLaila = item.id;
          else LS.state.equippedSalma = item.id;
          LS.saveState();
          LS.applyOutfit(activeShopTab, item.id);
          LS.playSFX('correct');
          msgEl.textContent = '';
          renderShopItems();
          LS.showToast('🎀 Unlocked & wearing ' + item.name + '!');
        };
      }

      row.appendChild(info);
      row.appendChild(btn);
      grid.appendChild(row);
    });
  }

  LS.openShopModal = function (shopStyle) {
    LS.runtime.modalOpen = true;
    activeShopFilter = shopStyle || 'all';
    const titleEl = document.getElementById('shop-modal-title');
    const subEl = document.getElementById('shop-modal-sub');
    if (titleEl) {
      titleEl.textContent = shopStyle === 'egypt'
        ? '👑 Royal Ancient Egypt Boutique — Gold-Collar Linen'
        : (shopStyle === 'marrakech'
          ? '🏮 Moroccan Kaftan Boutique — Embroidered Silks'
          : (shopStyle === 'safari'
            ? '🎒 Safari Outfitter Boutique — Explorer Gear'
            : (shopStyle === 'kyoto'
              ? '👘 Kyoto Kimono & Fox Mask Boutique'
              : '🎀 Harajuku Kiosk — Outfits & Hats')));
    }
    if (subEl) {
      subEl.textContent = shopStyle === 'egypt'
        ? '“Ahlan, Laila & Salma! Try shimmering golden pharaoh collars & turquoise Nile tunics — all outfits travel across every world!”'
        : (shopStyle === 'marrakech'
          ? '“Marhaba, Laila & Salma! Try ruby, emerald & saffron embroidered Moroccan kaftans — all outfits travel across every world!”'
          : (shopStyle === 'safari'
            ? '“Jambo, Laila & Salma! Gear up in khaki safari vests, sun hats & cozy lion cub hoodies — all outfits travel across every world!”'
            : (shopStyle === 'kyoto'
              ? '“Irasshaimase, Laila & Salma! Try silk kimonos & festival fox masks — all outfits travel across every world!”'
              : '“Konnichiwa, Laila & Salma! Spend your coins on stylish outfits & hats — all outfits travel across every world!”')));
    }
    document.getElementById('shop-msg').textContent = '';
    renderShopItems();
    document.getElementById('shop-modal').classList.remove('hidden');
  };

  let activeGachaponWorld = 'tokyo';
  function renderGachaponShelf() {
    const shelf = document.getElementById('gachapon-shelf');
    if (!shelf) return;
    shelf.innerHTML = '';
    LS.GACHAPON_TOYS.forEach(toy => {
      const owned = LS.state.unlockedToys.includes(toy.id);
      const card = document.createElement('div');
      card.className = 'toy-slot ' + (owned ? 'owned' : 'locked');
      const wBadge = toy.world === 'safari' ? '🦁' : (toy.world === 'kyoto' ? '⛩️' : '🗼');
      card.innerHTML =
        '<div class="toy-emoji">' + (owned ? toy.emoji : '❓') + '</div>' +
        '<div class="toy-name">' + (owned ? (toy.name + ' ' + wBadge) : ('Mystery ' + wBadge)) + '</div>';
      shelf.appendChild(card);
    });
  }

  LS.openGachaponModal = function (machineWorld) {
    LS.runtime.modalOpen = true;
    activeGachaponWorld = machineWorld || LS.state.currentWorld;
    const titleEl = document.getElementById('gachapon-title');
    const spinBtn = document.getElementById('btn-spin-gachapon');
    if (titleEl) {
      titleEl.textContent = activeGachaponWorld === 'all'
        ? '🎁 Toy Shelf & Sticker Album (' + LS.state.unlockedToys.length + '/' + LS.GACHAPON_TOYS.length + ')'
        : (activeGachaponWorld === 'safari'
          ? '📸 Safari Wildlife Photo Sticker Booth'
          : (activeGachaponWorld === 'kyoto' ? '🎁 Kyoto Gachapon Capsule Machine' : '🎁 Tokyo Gachapon Capsule Machine'));
    }
    if (spinBtn) {
      spinBtn.classList.toggle('hidden', activeGachaponWorld === 'all');
      spinBtn.textContent = activeGachaponWorld === 'safari'
        ? '📸 Snap & Print Wildlife Sticker (15c)'
        : (activeGachaponWorld === 'kyoto' ? '🎰 Spin Kyoto Capsule (15c)' : '🎰 Spin Tokyo Capsule (15c)');
    }
    document.getElementById('gachapon-msg').textContent = '';
    renderGachaponShelf();
    document.getElementById('gachapon-modal').classList.remove('hidden');
  };

  LS.openDrinkVendingModal = function () {
    LS.runtime.modalOpen = true;
    document.getElementById('drink-msg').textContent = '';
    document.getElementById('drink-modal').classList.remove('hidden');
  };

  LS.openMochiModal = function () {
    LS.runtime.modalOpen = true;
    document.getElementById('mochi-msg').textContent = '';
    document.getElementById('mochi-modal').classList.remove('hidden');
  };

  function renderClubhousePreview() {
    const preview = document.getElementById('clubhouse-preview');
    const catsRow = document.getElementById('clubhouse-cats-shelf');
    const grid = document.getElementById('clubhouse-items-grid');
    const msgEl = document.getElementById('clubhouse-msg');
    if (!preview || !grid) return;

    const wp = LS.ROOM_WALLPAPERS.find(w => w.id === LS.state.roomWallpaper) || LS.ROOM_WALLPAPERS[0];
    const bb = LS.ROOM_BEANBAGS.find(b => b.id === LS.state.roomBeanbag) || LS.ROOM_BEANBAGS[0];
    const po = LS.ROOM_POSTERS.find(p => p.id === LS.state.roomPoster) || LS.ROOM_POSTERS[0];

    preview.style.background = wp.color;
    preview.style.borderColor = wp.accent;
    preview.innerHTML =
      '<div class="room-poster-banner">' + po.label + '</div>' +
      '<div class="room-stage-row">' +
        '<span class="room-pill">👧 Laila</span>' +
        '<span class="room-beanbag" style="background:' + bb.color + '">🛋️ ' + bb.name + '</span>' +
        '<span class="room-pill">🧒 Salma</span>' +
      '</div>';

    if (catsRow) {
      const catNames = { cat_mikan: '🐱 Mikan', cat_kuro: '🐱 Kuro', cat_yuki: '🐱 Yuki', cat_sakura: '🐱 Sakura', cat_tama: '🐱 Tama' };
      const found = LS.state.foundCats || [];
      catsRow.innerHTML = '<strong>Tokyo Cats Cushion (' + found.length + '/5):</strong> ' +
        Object.keys(catNames).map(cid =>
          '<span class="cat-shelf-badge ' + (found.includes(cid) ? 'found' : '') + '">' +
          (found.includes(cid) ? catNames[cid] : '🐾 ???') + '</span>'
        ).join(' ');
    }

    document.getElementById('rtab-wallpaper').classList.toggle('active', activeRoomTab === 'wallpaper');
    document.getElementById('rtab-beanbag').classList.toggle('active', activeRoomTab === 'beanbag');
    document.getElementById('rtab-poster').classList.toggle('active', activeRoomTab === 'poster');

    const sourceList = activeRoomTab === 'wallpaper'
      ? LS.ROOM_WALLPAPERS
      : (activeRoomTab === 'beanbag' ? LS.ROOM_BEANBAGS : LS.ROOM_POSTERS);

    const activeId = activeRoomTab === 'wallpaper'
      ? LS.state.roomWallpaper
      : (activeRoomTab === 'beanbag' ? LS.state.roomBeanbag : LS.state.roomPoster);

    grid.innerHTML = '';
    sourceList.forEach(item => {
      const unlocked = LS.state.unlockedRoomItems.includes(item.id);
      const isActive = activeId === item.id;
      const row = document.createElement('div');
      row.className = 'shop-item' + (isActive ? ' equipped' : '');

      const dotHtml = item.color ? '<span class="swatch-dot" style="background:' + item.color + '"></span>' : '🖼️ ';
      const info = document.createElement('div');
      info.innerHTML = '<strong>' + dotHtml + item.name + '</strong>';

      const btn = document.createElement('button');
      if (isActive) {
        btn.className = 'btn-secondary'; btn.textContent = 'In Room ✓'; btn.disabled = true;
      } else if (unlocked) {
        btn.className = 'btn-primary'; btn.textContent = 'Place';
        btn.onclick = () => {
          if (activeRoomTab === 'wallpaper') LS.state.roomWallpaper = item.id;
          else if (activeRoomTab === 'beanbag') LS.state.roomBeanbag = item.id;
          else LS.state.roomPoster = item.id;
          LS.saveState();
          if (LS.activeWorld && LS.activeWorld.refreshDecor) LS.activeWorld.refreshDecor();
          msgEl.textContent = ''; renderClubhousePreview();
          LS.showToast('🏡 Updated 3D Room with ' + item.name + '!');
        };
      } else {
        btn.className = 'btn-primary'; btn.textContent = item.cost + 'c';
        btn.onclick = () => {
          if (LS.state.coins < item.cost) {
            msgEl.textContent = 'Need more coins! Try quizzes, hidden animals, or Mochi.';
            LS.playSFX('wrong'); return;
          }
          LS.addCoins(-item.cost);
          LS.state.unlockedRoomItems.push(item.id);
          if (activeRoomTab === 'wallpaper') LS.state.roomWallpaper = item.id;
          else if (activeRoomTab === 'beanbag') LS.state.roomBeanbag = item.id;
          else LS.state.roomPoster = item.id;
          LS.saveState();
          if (LS.activeWorld && LS.activeWorld.refreshDecor) LS.activeWorld.refreshDecor();
          LS.playSFX('correct'); msgEl.textContent = ''; renderClubhousePreview();
          LS.showToast('🏡 Added ' + item.name + " to Laila & Salma's 3D Room!");
        };
      }
      row.appendChild(info); row.appendChild(btn); grid.appendChild(row);
    });
  }

  LS.openClubhouseModal = function () {
    LS.runtime.modalOpen = true;
    document.getElementById('clubhouse-msg').textContent = '';
    renderClubhousePreview();
    document.getElementById('clubhouse-modal').classList.remove('hidden');
  };

  function renderRyokanPreview() {
    const preview = document.getElementById('ryokan-preview');
    const shelf = document.getElementById('ryokan-fox-shelf');
    const grid = document.getElementById('ryokan-items-grid');
    const msgEl = document.getElementById('ryokan-msg');
    if (!preview || !grid) return;

    const tat = LS.RYOKAN_TATAMI.find(t => t.id === LS.state.ryokanTatami) || LS.RYOKAN_TATAMI[0];
    const cush = LS.RYOKAN_CUSHIONS.find(c => c.id === LS.state.ryokanCushion) || LS.RYOKAN_CUSHIONS[0];
    const scr = LS.RYOKAN_SCROLLS.find(s => s.id === LS.state.ryokanScroll) || LS.RYOKAN_SCROLLS[0];

    preview.style.background = tat.color;
    preview.style.borderColor = tat.accent;
    preview.innerHTML =
      '<div class="room-poster-banner">' + scr.label + '</div>' +
      '<div class="room-stage-row">' +
        '<span class="room-pill">👧 Laila</span>' +
        '<span class="room-beanbag" style="background:' + cush.color + '">🏮 ' + cush.name + '</span>' +
        '<span class="room-pill">🧒 Salma</span>' +
      '</div>';

    if (shelf) {
      const foxNames = {
        kitsune_inari: '🦊 Inari', kitsune_take: '🦊 Take', kitsune_kawa: '🦊 Kawa',
        kitsune_matcha: '🦊 Matcha', kitsune_sakura: '🦊 Sakura'
      };
      const found = LS.state.foundKitsune || [];
      shelf.innerHTML = '<strong>Kyoto Kitsune Friends (' + found.length + '/5):</strong> ' +
        Object.keys(foxNames).map(fid =>
          '<span class="cat-shelf-badge ' + (found.includes(fid) ? 'found' : '') + '">' +
          (found.includes(fid) ? foxNames[fid] : '🦊 ???') + '</span>'
        ).join(' ');
    }

    document.getElementById('kytab-tatami').classList.toggle('active', activeRyokanTab === 'tatami');
    document.getElementById('kytab-cushion').classList.toggle('active', activeRyokanTab === 'cushion');
    document.getElementById('kytab-scroll').classList.toggle('active', activeRyokanTab === 'scroll');

    const sourceList = activeRyokanTab === 'tatami'
      ? LS.RYOKAN_TATAMI
      : (activeRyokanTab === 'cushion' ? LS.RYOKAN_CUSHIONS : LS.RYOKAN_SCROLLS);

    const activeId = activeRyokanTab === 'tatami'
      ? LS.state.ryokanTatami
      : (activeRyokanTab === 'cushion' ? LS.state.ryokanCushion : LS.state.ryokanScroll);

    grid.innerHTML = '';
    sourceList.forEach(item => {
      const unlocked = LS.state.unlockedRyokanItems.includes(item.id);
      const isActive = activeId === item.id;
      const row = document.createElement('div');
      row.className = 'shop-item' + (isActive ? ' equipped' : '');
      const dotHtml = item.color ? '<span class="swatch-dot" style="background:' + item.color + '"></span>' : '📜 ';
      const info = document.createElement('div');
      info.innerHTML = '<strong>' + dotHtml + item.name + '</strong>';
      const btn = document.createElement('button');
      if (isActive) {
        btn.className = 'btn-secondary'; btn.textContent = 'In Suite ✓'; btn.disabled = true;
      } else if (unlocked) {
        btn.className = 'btn-primary'; btn.textContent = 'Place';
        btn.onclick = () => {
          if (activeRyokanTab === 'tatami') LS.state.ryokanTatami = item.id;
          else if (activeRyokanTab === 'cushion') LS.state.ryokanCushion = item.id;
          else LS.state.ryokanScroll = item.id;
          LS.saveState();
          if (LS.activeWorld && LS.activeWorld.refreshDecor) LS.activeWorld.refreshDecor();
          msgEl.textContent = ''; renderRyokanPreview();
          LS.showToast('🏮 Updated 3D Kyoto Ryokan with ' + item.name + '!');
        };
      } else {
        btn.className = 'btn-primary'; btn.textContent = item.cost + 'c';
        btn.onclick = () => {
          if (LS.state.coins < item.cost) {
            msgEl.textContent = 'Need more coins! Feed koi, draw fortunes, or find kitsune foxes.';
            LS.playSFX('wrong'); return;
          }
          LS.addCoins(-item.cost);
          LS.state.unlockedRyokanItems.push(item.id);
          if (activeRyokanTab === 'tatami') LS.state.ryokanTatami = item.id;
          else if (activeRyokanTab === 'cushion') LS.state.ryokanCushion = item.id;
          else LS.state.ryokanScroll = item.id;
          LS.saveState();
          if (LS.activeWorld && LS.activeWorld.refreshDecor) LS.activeWorld.refreshDecor();
          LS.playSFX('correct'); msgEl.textContent = ''; renderRyokanPreview();
          LS.showToast('🏮 Added ' + item.name + ' to your 3D Kyoto Ryokan Suite!');
        };
      }
      row.appendChild(info); row.appendChild(btn); grid.appendChild(row);
    });
  }

  LS.openRyokanModal = function () {
    LS.runtime.modalOpen = true;
    document.getElementById('ryokan-msg').textContent = '';
    renderRyokanPreview();
    document.getElementById('ryokan-modal').classList.remove('hidden');
  };

  function renderShrineWishes() {
    const listEl = document.getElementById('ema-wishes-list');
    if (!listEl) return;
    if (!LS.state.emaWishes || LS.state.emaWishes.length === 0) {
      listEl.innerHTML = '<div class="ramen-desc">No Ema plaques hung yet — pick or write a wish below!</div>';
      return;
    }
    listEl.innerHTML = LS.state.emaWishes.slice(-4).reverse().map(w =>
      '<span class="ema-plaque-pill">🪵 ' + w + '</span>'
    ).join(' ');
  }

  LS.openShrineModal = function () {
    LS.runtime.modalOpen = true;
    const fBox = document.getElementById('omikuji-result');
    if (fBox) {
      if (LS.state.lastFortune) {
        fBox.innerHTML = '<strong>' + LS.state.lastFortune.emoji + ' ' + LS.state.lastFortune.rank + '</strong><div>' + LS.state.lastFortune.text + '</div>';
      } else {
        fBox.innerHTML = 'Shake the lucky red fortune box to reveal Laila &amp; Salma’s Kyoto fortune!';
      }
    }
    renderShrineWishes();
    document.getElementById('shrine-modal').classList.remove('hidden');
  };

  LS.feedKoiAndDucks = function () {
    LS.runtime.koiFeedTimer = 5.5;
    LS.state.koiFedCount = (LS.state.koiFedCount || 0) + 1;
    LS.addCoins(15);
    LS.addXP(12);
    LS.unlockStamp('kyoto_koi');
    if (LS.advanceStoryStep) LS.advanceStoryStep('kyoto', 'kyoto_koi');
    LS.playSFX('splash');
    LS.showToast('🐟🦆 Splash! The koi fish & ducks swim over happily! +15c & +12 XP!');
  };

  LS.feedSafariAnimals = function (kind) {
    LS.runtime.safariFeedTimer = 5.5;
    LS.state.safariFedCount = (LS.state.safariFedCount || 0) + 1;
    LS.addCoins(15);
    LS.addXP(12);
    LS.unlockStamp('safari_feed');
    if (LS.advanceStoryStep) LS.advanceStoryStep('safari', 'safari_feed');
    LS.playSFX(kind === 'elephant' ? 'splash' : 'animal');
    if (kind === 'elephant') {
      LS.showToast('🐘💦 Trumpet & splash! The gentle elephants wave their trunks & love the sweet melons! +15c & +12 XP!');
    } else {
      LS.showToast('🦒🌿 Crunch crunch! The tall giraffes dip their long necks for fresh acacia leaves! +15c & +12 XP!');
    }
  };

  const LOCAL_SHOPS = {
    sakura_bakery: {
      title: '🥐 Sakura Bakery — Fresh Tokyo Pastries',
      sub: '“Irasshaimase, Laila & Salma! Freshly baked melonpan, sakura cupcakes & strawberry cream puffs straight from the oven!”',
      items: [
        { name: '🍈 Crispy Melonpan', desc: 'Warm sugar-crust bun • Speed +25% & Infinite Run for 90s (+12 XP)', cost: 20, xp: 12, buff: { name: 'Crispy Melonpan', short: 'Melonpan⚡', speedMult: 1.25, infiniteStamina: true, durationMs: 90000 } },
        { name: '🧁 Sakura Cream Cupcake', desc: 'Pink blossom frosting • Magical Sparkle Trail for 60s (+12 XP)', cost: 20, xp: 12, sparkleMs: 60000 },
        { name: '🍓 Strawberry Shortcake Box', desc: 'Fluffy Tokyo cake • Super-Jump + Speed boost for 75s (+18 XP)', cost: 30, xp: 18, superJumpMs: 75000, buff: { name: 'Strawberry Shortcake', short: 'Cake⚡', speedMult: 1.28, infiniteStamina: true, durationMs: 75000 } }
      ]
    },
    sunny_florist: {
      title: '🌷 Sunny Florist — Tokyo Flower & Crown Shop',
      sub: '“Hello, sisters! Pick bright tulip crowns, sakura bouquets, or lucky clovers that help Salma spot hiding kitties!”',
      items: [
        { name: '🌸 Sakura Petal Crown', desc: 'Twinkling flower crown • Blossom Sparkle Trail for 75s (+12 XP)', cost: 18, xp: 12, sparkleMs: 75000 },
        { name: '🌻 Sunny Sunflower Bouquet', desc: 'Cheerful sunny energy • Super-Jump boost for 60s (+12 XP)', cost: 20, xp: 12, superJumpMs: 60000 },
        { name: '🍀 Lucky Four-Leaf Clover', desc: 'Salma senses the nearest hiding animal + Speed boost for 60s (+15 XP)', cost: 25, xp: 15, hint: true, buff: { name: 'Lucky Clover', short: 'Clover🍀', speedMult: 1.22, infiniteStamina: true, durationMs: 60000 } }
      ]
    },
    cozy_bookshop: {
      title: '📚 Cozy Bookshop — Picture Books & Explorer Guides',
      sub: '“Welcome to Sakura-cho’s cozy reading nook! Pick an adventure storybook or a secret town guide!”',
      items: [
        { name: '📖 Cat Detective Picture Book', desc: 'Clever clues! Salma reveals the nearest hiding friend (+18 XP)', cost: 15, xp: 18, hint: true },
        { name: '🗺️ Japan Adventure Atlas', desc: 'Inspiring explorer facts • Big +35 XP learning boost!', cost: 22, xp: 35 },
        { name: '✨ Magic Origami Craft Kit', desc: 'Sparkle Trail + Super-Jump for 60s (+20 XP)', cost: 28, xp: 20, sparkleMs: 60000, superJumpMs: 60000 }
      ]
    },
    kyoto_pottery: {
      title: '🏺 Kyoto Pottery Studio — Kiyomizu Ceramics',
      sub: '“Welcome to our traditional Kyoto kiln! Paint glazed teacups, lucky fox figurines, or shimmering lotus bowls!”',
      items: [
        { name: '🍵 Paint a Matcha Teacup', desc: 'Cozy kiln crafting • +30 XP & warm Speed boost for 75s', cost: 20, xp: 30, buff: { name: 'Crafted Teacup', short: 'Pottery⚡', speedMult: 1.24, infiniteStamina: true, durationMs: 75000 } },
        { name: '🦊 Lucky Ceramic Kitsune Charm', desc: 'Guides Salma straight toward the nearest hiding Kyoto fox (+18 XP)', cost: 20, xp: 18, hint: true },
        { name: '🪷 Shimmering Lotus Bowl', desc: 'Sparkle Trail + Super-Jump for 65s (+22 XP)', cost: 28, xp: 22, sparkleMs: 65000, superJumpMs: 65000 }
      ]
    },
    kyoto_fans: {
      title: '🪭 Kyoto Folding Fan Atelier — Sensu Workshop',
      sub: '“Step right in, Laila & Salma! Wave a hand-painted Kyoto sensu fan for breeze-light leaps and blossom trails!”',
      items: [
        { name: '🍁 Autumn Maple Breeze Fan', desc: 'Breeze-light steps • Speed +30% & Infinite Run for 90s (+15 XP)', cost: 22, xp: 15, buff: { name: 'Maple Breeze Fan', short: 'Breeze🪭', speedMult: 1.30, infiniteStamina: true, durationMs: 90000 } },
        { name: '🌸 Sakura Wind-Jump Fan', desc: 'Soar over gardens • Super-Jump + Sparkle Trail for 65s (+16 XP)', cost: 25, xp: 16, superJumpMs: 65000, sparkleMs: 65000 },
        { name: '✨ Golden Festival Master Fan', desc: 'Speed + Super-Jump + Sparkle Trail + Salma Animal Hint (+25 XP)', cost: 35, xp: 25, hint: true, superJumpMs: 65000, sparkleMs: 65000, buff: { name: 'Golden Festival Fan', short: 'Golden🪭', speedMult: 1.30, infiniteStamina: true, durationMs: 90000 } }
      ]
    },
    safari_cafe: {
      title: '🥭 Mama Nia’s Mango Smoothie Cafe',
      sub: '“Jambo, Laila & Salma! Cool off in the savanna shade with fresh-blended tropical smoothies & explorer snacks!”',
      items: [
        { name: '🥭 Mango Sunrise Smoothie', desc: 'Golden tropical energy • Speed +28%, Infinite Run & Sparkles for 75s (+12 XP)', cost: 20, xp: 12, sparkleMs: 55000, buff: { name: 'Mango Sunrise Smoothie', short: 'Mango⚡', speedMult: 1.28, infiniteStamina: true, durationMs: 75000 } },
        { name: '🍉 Baobab Melon Splash', desc: 'Bouncy savanna refresher • Super-Jump for 65s (+14 XP)', cost: 20, xp: 14, superJumpMs: 65000 },
        { name: '🍍 Safari Explorer Trail Mix', desc: 'Full energy + Salma spots the nearest hiding Lion Cub! (+18 XP)', cost: 25, xp: 18, hint: true, buff: { name: 'Safari Trail Mix', short: 'Safari🦁', speedMult: 1.25, infiniteStamina: true, durationMs: 85000 } }
      ]
    },
    safari_crafts: {
      title: '🎨 Maasai Bead & Savanna Craft Market',
      sub: '“Karibu, Laila & Salma! Admire hand-beaded necklaces, painted savanna gourds & woven explorer baskets!”',
      items: [
        { name: '📿 Sunrise Beaded Bracelet', desc: 'Vibrant crimson & gold beads • Golden Sparkle Trail for 75s (+15 XP)', cost: 18, xp: 15, sparkleMs: 75000 },
        { name: '🪘 Mini Pocket Shaker', desc: 'Joyful savanna rhythm • Speed +26% & Infinite Run for 80s (+18 XP)', cost: 22, xp: 18, buff: { name: 'Savanna Rhythm', short: 'Rhythm🥁', speedMult: 1.26, infiniteStamina: true, durationMs: 80000 } },
        { name: '🦁 Carved Baobab Lion Charm', desc: 'Salma senses the nearest hiding Lion Cub + Super-Jump for 65s (+24 XP)', cost: 28, xp: 24, hint: true, superJumpMs: 65000 }
      ]
    },
    tokyo_crepes: {
      title: '🍓 Harajuku Crêpe & Sakura Tea Plaza',
      sub: '“Welcome to Tokyo’s sweetest plaza, Laila & Salma! Pick a freshly folded Harajuku crêpe or blossom tea!”',
      items: [
        { name: '🍓 Strawberry Cream Crêpe', desc: 'Fluffy berries & cream • Speed +26% & Sparkle Trail for 75s (+18 XP)', cost: 22, xp: 18, sparkleMs: 75000, buff: { name: 'Harajuku Crêpe', short: 'Crêpe🍓', speedMult: 1.26, infiniteStamina: true, durationMs: 75000 } },
        { name: '🍵 Iced Sakura Bubble Tea', desc: 'Bouncy tapioca pearls • Super-Jump power for 65s (+16 XP)', cost: 20, xp: 16, superJumpMs: 65000 },
        { name: '🍌 Chocolate Banana Crêpe', desc: 'Full energy + Salma spots a nearby Tokyo cat (+20 XP)', cost: 25, xp: 20, hint: true, buff: { name: 'Choco Crêpe', short: 'Sweet⚡', speedMult: 1.24, infiniteStamina: true, durationMs: 80000 } }
      ]
    },
    tokyo_cat_cafe: {
      title: '🐱 Neko Cat Café — Lantern Canal Street',
      sub: '“Meow! Relax with fluffy neighborhood kitties along West Lantern Canal Street!”',
      items: [
        { name: '🐾 Kitty Paw Waffle', desc: 'Warm maple waffle • Speed +24% for 80s (+15 XP)', cost: 18, xp: 15, buff: { name: 'Paw Waffle', short: 'Kitty⚡', speedMult: 1.24, infiniteStamina: true, durationMs: 80000 } },
        { name: '🐟 Catnip Treat Bag', desc: 'Salma immediately hears the nearest hiding Tokyo cat! (+18 XP)', cost: 20, xp: 18, hint: true }
      ]
    },
    tokyo_origami: {
      title: '🕊️ Tokyo Origami Studio — East Alley',
      sub: '“Fold golden paper cranes & paper stars in our colorful East Tokyo alley!”',
      items: [
        { name: '🕊️ Golden Paper Crane', desc: 'Feather-light jumps • Super-Jump + Sparkles for 70s (+20 XP)', cost: 20, xp: 20, superJumpMs: 70000, sparkleMs: 70000 },
        { name: '⭐ Origami Star Garland', desc: 'Big explorer learning boost (+35 XP)!', cost: 24, xp: 35 }
      ]
    },
    kyoto_wagashi: {
      title: '🍡 Gion Lantern Wagashi Sweet Shop',
      sub: '“Welcome to Gion Lantern Street! Handcrafted seasonal Kyoto sweets & yuzu tea!”',
      items: [
        { name: '🍡 Sakura Mochi Set', desc: 'Sweet pink mochi • Sparkle Trail + Infinite Run for 80s (+18 XP)', cost: 22, xp: 18, sparkleMs: 80000, buff: { name: 'Sakura Mochi', short: 'Mochi🌸', speedMult: 1.25, infiniteStamina: true, durationMs: 80000 } },
        { name: '🦊 Sweet Kitsune Cookie', desc: 'Guides Salma toward the nearest hiding Kyoto fox (+18 XP)', cost: 20, xp: 18, hint: true }
      ]
    }
  };

  LS.openLocalShopModal = function (shopKey) {
    const shop = LOCAL_SHOPS[shopKey];
    if (!shop) return;
    LS.runtime.modalOpen = true;
    const titleEl = document.getElementById('local-shop-title');
    const subEl = document.getElementById('local-shop-sub');
    const grid = document.getElementById('local-shop-items');
    const msgEl = document.getElementById('local-shop-msg');
    if (titleEl) titleEl.textContent = shop.title;
    if (subEl) subEl.textContent = shop.sub;
    if (msgEl) msgEl.textContent = '';
    if (grid) {
      grid.innerHTML = '';
      shop.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'ramen-item';
        const info = document.createElement('div');
        info.innerHTML = '<strong>' + item.name + '</strong><div class="ramen-desc">' + item.desc + '</div>';
        const btn = document.createElement('button');
        btn.className = 'btn-small';
        btn.textContent = item.cost + 'c';
        btn.onclick = () => {
          if (LS.state.coins < item.cost) {
            if (msgEl) msgEl.textContent = 'Not enough coins (' + item.cost + 'c)! Feed animals, find friends, or take a quiz.';
            LS.playSFX('wrong');
            return;
          }
          LS.addCoins(-item.cost);
          if (item.xp) LS.addXP(item.xp);
          LS.runtime.stamina = 100;
          if (item.buff) {
            LS.runtime.buff = {
              name: item.buff.name,
              short: item.buff.short,
              speedMult: item.buff.speedMult,
              infiniteStamina: item.buff.infiniteStamina,
              expiresAt: Date.now() + item.buff.durationMs
            };
          }
          if (item.sparkleMs) LS.runtime.sparkleUntil = Date.now() + item.sparkleMs;
          if (item.superJumpMs) LS.runtime.superJumpUntil = Date.now() + item.superJumpMs;
          if (shopKey === 'tokyo_crepes' && LS.advanceStoryStep) LS.advanceStoryStep('tokyo', 'tokyo_crepes');
          if (LS.completeCozyMission) LS.completeCozyMission('meal');
          LS.closeAllModals();
          LS.playSFX('correct');
          LS.updateHUD();
          LS.showToast('✨ Enjoyed ' + item.name + (item.xp ? (' (+' + item.xp + ' XP)') : '') + '!');
          if (item.hint && LS.showSalmaAnimalHint) {
            setTimeout(() => LS.showSalmaAnimalHint(), 350);
          }
        };
        row.appendChild(info);
        row.appendChild(btn);
        grid.appendChild(row);
      });
    }
    const modal = document.getElementById('local-shop-modal');
    if (modal) modal.classList.remove('hidden');
  };

  LS.enjoySafariSmoothie = function () {
    LS.openLocalShopModal('safari_cafe');
  };

  LS.startSafariJeepRide = function () {
    if (LS.runtime.safariRide || LS.runtime.balloonRide || LS.runtime.modalOpen || LS.runtime.traveling) return;
    if (!LS.activeWorld || !LS.activeWorld.jeepPath || !LS.activeWorld.safariJeep) return;
    LS.runtime.safariRide = { t: 0, duration: 15.0 };
    if (LS.advanceStoryStep) LS.advanceStoryStep('safari', 'safari_jeep');
    LS.playSFX('train');
    LS.showToast('🚙🦁 All aboard the Safari Jeep! Cruising past Giraffes, Elephants, Pride Rock & Zebras!');
  };

  // --- GRAND AFRICAN SAFARI EXPANSION ACTIVITIES ---
  let activeSafariTentTab = 'rug';
  function renderSafariTentPreview() {
    const preview = document.getElementById('safari-tent-preview');
    const shelf = document.getElementById('safari-tent-cubs-shelf');
    const grid = document.getElementById('safari-tent-items-grid');
    const msgEl = document.getElementById('safari-tent-msg');
    if (!preview || !grid) return;

    const rug = LS.SAFARI_TENT_RUGS.find(r => r.id === LS.state.safariTentRug) || LS.SAFARI_TENT_RUGS[0];
    const cush = LS.SAFARI_TENT_CUSHIONS.find(c => c.id === LS.state.safariTentCushion) || LS.SAFARI_TENT_CUSHIONS[0];
    const tap = LS.SAFARI_TENT_TAPESTRIES.find(t => t.id === LS.state.safariTentTapestry) || LS.SAFARI_TENT_TAPESTRIES[0];

    preview.style.background = rug.color;
    preview.style.borderColor = rug.accent;
    preview.innerHTML =
      '<div class="room-poster-banner" style="background:' + tap.bg + ';border-color:' + tap.border + ';color:' + (tap.fg || '#332211') + '">' + tap.label + '</div>' +
      '<div class="room-stage-row">' +
        '<span class="room-pill">👧 Laila</span>' +
        '<span class="room-beanbag" style="background:' + cush.color + '">⛺ ' + cush.name + '</span>' +
        '<span class="room-pill">🧒 Salma</span>' +
      '</div>';

    if (shelf) {
      const cubNames = { cub_simba: '🦁 Simba', cub_nala: '🦁 Nala', cub_zuri: '🦁 Zuri', cub_kopa: '🦁 Kopa', cub_asha: '🦁 Asha' };
      const found = LS.state.foundLionCubs || [];
      shelf.innerHTML = '<strong>Safari Lion Cub Friends (' + found.length + '/5):</strong> ' +
        Object.keys(cubNames).map(cid =>
          '<span class="cat-shelf-badge ' + (found.includes(cid) ? 'found' : '') + '">' +
          (found.includes(cid) ? cubNames[cid] : '🐾 ???') + '</span>'
        ).join(' ');
    }

    const tRug = document.getElementById('sttab-rug');
    const tCush = document.getElementById('sttab-cushion');
    const tTap = document.getElementById('sttab-tapestry');
    if (tRug) tRug.classList.toggle('active', activeSafariTentTab === 'rug');
    if (tCush) tCush.classList.toggle('active', activeSafariTentTab === 'cushion');
    if (tTap) tTap.classList.toggle('active', activeSafariTentTab === 'tapestry');

    const sourceList = activeSafariTentTab === 'rug'
      ? LS.SAFARI_TENT_RUGS
      : (activeSafariTentTab === 'cushion' ? LS.SAFARI_TENT_CUSHIONS : LS.SAFARI_TENT_TAPESTRIES);
    const activeId = activeSafariTentTab === 'rug'
      ? LS.state.safariTentRug
      : (activeSafariTentTab === 'cushion' ? LS.state.safariTentCushion : LS.state.safariTentTapestry);

    grid.innerHTML = '';
    sourceList.forEach(item => {
      const unlocked = LS.state.unlockedSafariTentItems.includes(item.id);
      const isActive = activeId === item.id;
      const row = document.createElement('div');
      row.className = 'shop-item' + (isActive ? ' equipped' : '');
      const dotHtml = item.color ? '<span class="swatch-dot" style="background:' + item.color + '"></span>' : '🖼️ ';
      const info = document.createElement('div');
      info.innerHTML = '<strong>' + dotHtml + item.name + '</strong>';
      const btn = document.createElement('button');
      if (isActive) {
        btn.className = 'btn-secondary'; btn.textContent = 'In Tent ✓'; btn.disabled = true;
      } else if (unlocked) {
        btn.className = 'btn-primary'; btn.textContent = 'Place';
        btn.onclick = () => {
          if (activeSafariTentTab === 'rug') LS.state.safariTentRug = item.id;
          else if (activeSafariTentTab === 'cushion') LS.state.safariTentCushion = item.id;
          else LS.state.safariTentTapestry = item.id;
          LS.saveState();
          if (LS.activeWorld && LS.activeWorld.refreshDecor) LS.activeWorld.refreshDecor();
          if (msgEl) msgEl.textContent = '';
          renderSafariTentPreview();
          LS.showToast('⛺ Updated 3D Glamping Tent with ' + item.name + '!');
        };
      } else {
        btn.className = 'btn-primary'; btn.textContent = item.cost + 'c';
        btn.onclick = () => {
          if (LS.state.coins < item.cost) {
            if (msgEl) msgEl.textContent = 'Need more coins! Snap wildlife photos, race the Cheetah, or find lion cubs.';
            LS.playSFX('wrong'); return;
          }
          LS.addCoins(-item.cost);
          LS.state.unlockedSafariTentItems.push(item.id);
          if (activeSafariTentTab === 'rug') LS.state.safariTentRug = item.id;
          else if (activeSafariTentTab === 'cushion') LS.state.safariTentCushion = item.id;
          else LS.state.safariTentTapestry = item.id;
          LS.saveState();
          if (LS.activeWorld && LS.activeWorld.refreshDecor) LS.activeWorld.refreshDecor();
          LS.unlockStamp('safari_tent_decor');
          LS.playSFX('correct');
          if (msgEl) msgEl.textContent = '';
          renderSafariTentPreview();
          LS.showToast('⛺ Added ' + item.name + ' to your 3D Safari Glamping Tent!');
        };
      }
      row.appendChild(info); row.appendChild(btn); grid.appendChild(row);
    });
  }

  LS.openSafariTentModal = function () {
    LS.runtime.modalOpen = true;
    const m = document.getElementById('safari-tent-msg');
    if (m) m.textContent = '';
    renderSafariTentPreview();
    const modal = document.getElementById('safari-tent-modal');
    if (modal) modal.classList.remove('hidden');
  };

  function renderSafariWildlifeGuide() {
    const grid = document.getElementById('safari-guide-grid');
    const prog = document.getElementById('safari-guide-progress');
    if (!grid) return;
    const photos = LS.state.safariPhotos || [];
    if (prog) prog.textContent = 'Photographed: ' + photos.length + ' / ' + LS.SAFARI_WILDLIFE_GUIDE.length + ' Savanna Species 📸';
    grid.innerHTML = '';
    LS.SAFARI_WILDLIFE_GUIDE.forEach(sp => {
      const snapped = photos.includes(sp.id);
      const card = document.createElement('div');
      card.className = 'guide-card' + (snapped ? ' snapped' : '');
      card.innerHTML =
        '<div class="guide-head"><span>' + sp.emoji + ' <strong>' + sp.name + '</strong></span>' +
        '<span class="guide-badge">' + (snapped ? '✅ Snapped' : '📍 ' + sp.spot) + '</span></div>' +
        '<div class="guide-fact">' + (snapped ? sp.fact : 'Walk near the ' + sp.spot + ' and press [F] or click Snap Photo!') + '</div>';
      grid.appendChild(card);
    });
  }

  LS.openSafariGuideModal = function () {
    LS.runtime.modalOpen = true;
    const msg = document.getElementById('safari-guide-msg');
    if (msg) msg.textContent = '';
    renderSafariWildlifeGuide();
    const modal = document.getElementById('safari-guide-modal');
    if (modal) modal.classList.remove('hidden');
  };

  LS.snapSafariWildlifePhoto = function () {
    if (LS.state.currentWorld !== 'safari' || !LS.activeWorld || !LS.chars.laila) return false;
    const lp = LS.chars.laila.root.position;
    const targets = LS.activeWorld.wildlifePhotoTargets || [];
    let best = null;
    let bestDist = 26.0;
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const d = Math.hypot(lp.x - t.pos.x, lp.z - t.pos.z);
      if (d < bestDist) { bestDist = d; best = t; }
    }
    if (LS.playCameraShutter) LS.playCameraShutter();
    // Subtle quick camera flash pulse
    const flash = document.getElementById('camera-flash');
    if (flash) {
      flash.classList.remove('hidden');
      setTimeout(() => flash.classList.add('hidden'), 140);
    }
    if (!best) {
      LS.showToast('📸 Click! Walk a bit closer to Giraffes, Elephants, Hippos, Flamingos, Lions, Zebras, or Meerkats!');
      return false;
    }
    const meta = LS.SAFARI_WILDLIFE_GUIDE.find(g => g.id === best.species);
    if (!meta) return false;
    if (!LS.state.safariPhotos) LS.state.safariPhotos = [];
    const isNew = !LS.state.safariPhotos.includes(meta.id);
    if (isNew) {
      LS.state.safariPhotos.push(meta.id);
      LS.addCoins(15);
      LS.addXP(15);
      LS.saveState();
      LS.playSFX('animal');
      if (LS.state.safariPhotos.length >= LS.SAFARI_WILDLIFE_GUIDE.length) {
        LS.unlockStamp('safari_photographer');
        LS.showToast('📸🏆 ALL 7 Wildlife Species Photographed! Master Safari Photographer Stamp unlocked! (+15c, +15 XP)');
      } else {
        LS.showToast('📸 NEW Photo: ' + meta.emoji + ' ' + meta.name + ' (' + LS.state.safariPhotos.length + '/7)! +15c & +15 XP!');
      }
    } else {
      LS.showToast('📸 Great shot of the ' + meta.emoji + ' ' + meta.name + '! (' + LS.state.safariPhotos.length + '/7 in Field Guide)');
    }
    renderSafariWildlifeGuide();
    return true;
  };

  LS.openSafariCampfireModal = function () {
    LS.runtime.modalOpen = true;
    const msg = document.getElementById('safari-campfire-msg');
    if (msg) msg.textContent = 'Tap the African Djembe drums to jam around the fire or roast golden marshmallows!';
    const modal = document.getElementById('safari-campfire-modal');
    if (modal) modal.classList.remove('hidden');
  };

  LS.startBalloonRide = function () {
    if (LS.runtime.balloonRide || LS.runtime.safariRide || LS.runtime.modalOpen || LS.runtime.traveling) return;
    if (!LS.activeWorld || !LS.activeWorld.hotAirBalloon) return;
    LS.runtime.balloonRide = { t: 0, duration: 16.0 };
    const ban = document.getElementById('balloon-banner');
    if (ban) ban.classList.remove('hidden');
    LS.playSFX('train');
    LS.setSalmaBubbleText('WHOAAA!! We are flying over Pride Rock, the Hippos, and Mt. Kilimanjaro!! 🎈🏔️', 5000);
    LS.showToast('🎈 Lift off! Soaring 20m above the golden African Savanna!');
  };

  LS.finishBalloonRide = function (skipped) {
    if (!LS.runtime.balloonRide) return;
    LS.runtime.balloonRide = null;
    const ban = document.getElementById('balloon-banner');
    if (ban) ban.classList.add('hidden');
    const bal = LS.activeWorld && LS.activeWorld.hotAirBalloon;
    const home = LS.activeWorld && LS.activeWorld.balloonHome;
    if (bal && home) {
      bal.position.copy(home.pos);
      bal.rotation.set(0, 0, 0);
      if (LS.chars.laila) {
        LS.chars.laila.root.position.copy(home.exit);
        LS.chars.laila.rightArm.rotation.z = 0;
      }
      if (LS.chars.salma) {
        LS.chars.salma.root.position.set(home.exit.x - 1.0, 0, home.exit.z + 0.5);
        LS.chars.salma.rightArm.rotation.z = 0;
      }
    }
    LS.addCoins(30);
    LS.addXP(25);
    LS.unlockStamp('safari_balloon');
    LS.playSFX('correct');
    LS.showToast(skipped
      ? '🎈 Safely landed back at the Launch Pad! +30c & +25 XP!'
      : '🎈✨ Unforgettable Sunrise Balloon Flight! +30c & +25 XP!');
  };

  LS.startCheetahRace = function () {
    if (LS.runtime.cheetahRace || LS.runtime.balloonRide || LS.runtime.safariRide || LS.runtime.modalOpen) return;
    if (!LS.activeWorld || !LS.activeWorld.cheetahTrack || !LS.chars.laila) return;
    const tr = LS.activeWorld.cheetahTrack;
    LS.chars.laila.root.position.set(tr.start.x, 0, tr.start.z - 0.8);
    LS.chars.laila.root.rotation.y = tr.yaw;
    if (LS.chars.salma) {
      LS.chars.salma.root.position.set(tr.start.x - 0.9, 0, tr.start.z - 1.4);
      LS.chars.salma.root.rotation.y = tr.yaw;
    }
    LS.runtime.stamina = 100;
    LS.runtime.cheetahRace = { phase: 'countdown', countdown: 2.6, elapsed: 0, cheetahProg: 0 };
    LS.playSFX('jump');
    LS.setSalmaBubbleText('Go Laila GO!! Hold Shift to sprint past the spotted Cheetah! 🐆💨', 4200);
  };

  LS.finishCheetahRace = function (won, timeSec) {
    LS.runtime.cheetahRace = null;
    const ban = document.getElementById('cheetah-banner');
    if (ban) ban.classList.add('hidden');
    if (LS.activeWorld && LS.activeWorld.cheetahObj && LS.activeWorld.cheetahTrack) {
      const ch = LS.activeWorld.cheetahObj;
      const tr = LS.activeWorld.cheetahTrack;
      ch.position.set(tr.start.x, 0, tr.start.z + 1.1);
      ch.rotation.set(0, tr.yaw, 0);
    }
    if (won) {
      LS.addCoins(35);
      LS.addXP(30);
      LS.unlockStamp('safari_cheetah');
      LS.playSFX('levelup');
      LS.showToast('🐆🏆 YOU BEAT THE CHEETAH in ' + timeSec.toFixed(1) + 's! +35c & +30 XP!');
    } else {
      LS.addCoins(15);
      LS.addXP(15);
      LS.playSFX('coin');
      LS.showToast('🐆💨 Super speedy race! Grab a Mango Smoothie for turbo speed & try again! (+15c, +15 XP)');
    }
  };

  LS.triggerWatchtowerLookout = function () {
    if (LS.runtime.balloonRide || LS.runtime.safariRide) return;
    LS.runtime.watchtowerTimer = 6.0;
    LS.playSFX('shrine');
    LS.addXP(10);
    // Salma spots the direction of the nearest unfound Lion Cub from the Watchtower binoculars!
    const cubs = (LS.activeWorld && LS.activeWorld.hiddenAnimals) ? LS.activeWorld.hiddenAnimals.filter(c => !c.found) : [];
    if (cubs.length > 0 && LS.chars.laila) {
      const lp = LS.chars.laila.root.position;
      let nearest = cubs[0];
      let bestD = Infinity;
      cubs.forEach(c => {
        const d = lp.distanceTo(c.mesh.position);
        if (d < bestD) { bestD = d; nearest = c; }
      });
      LS.setSalmaBubbleText('🔭 Through the binoculars I spy ' + nearest.name + ' ' + nearest.hint + '!', 5800);
      LS.showToast('🔭 Watchtower Panorama! Salma spotted ' + nearest.name + ' ' + nearest.hint + '! (+10 XP)');
    } else {
      LS.setSalmaBubbleText('🔭 What a breathtaking 360° view of the whole African Savanna!!', 5500);
      LS.showToast('🔭 Breathtaking Savanna Watchtower Panorama! (+10 XP)');
    }
  };

  LS.triggerPrideRockRoar = function () {
    LS.runtime.prideRoarTimer = 2.2;
    if (LS.playLionRoar) LS.playLionRoar();
    LS.addCoins(10);
    LS.addXP(10);
    LS.setSalmaBubbleText('ROOOAAAR!! King Lion said hello to us from the top of Pride Rock! 🦁👑', 4200);
    LS.showToast('🦁👑 ROOOAAR! King Lion lifts his golden mane atop Pride Rock! +10c & +10 XP!');
  };

  LS.petHiddenAnimal = function (animalId) {
    const world = LS.activeWorld;
    if (!world || !world.hiddenAnimals) return;
    const animal = world.hiddenAnimals.find(a => a.id === animalId);
    if (!animal || animal.found) return;

    animal.found = true;
    if (animal.marker) animal.marker.visible = false;
    if (animal.mesh && LS.state.currentWorld === 'home_neighborhood') animal.mesh.visible = false;

    const isHomePup = animalId.startsWith('home_pup_') || LS.state.currentWorld === 'home_neighborhood';
    const isKitsune = animal.kind === 'kitsune';
    const isLionCub = animal.kind === 'lion_cub';
    const isEgyptCat = animal.kind === 'egypt_cat';
    const isMarrakechFox = animal.kind === 'marrakech_fox';
    if (isHomePup && !Array.isArray(LS.state.foundHomePets)) LS.state.foundHomePets = [];
    if (isEgyptCat && !Array.isArray(LS.state.foundEgyptCats)) LS.state.foundEgyptCats = [];
    if (isMarrakechFox && !Array.isArray(LS.state.foundMarrakechFoxes)) LS.state.foundMarrakechFoxes = [];
    const arr = isHomePup ? LS.state.foundHomePets
      : (isLionCub ? LS.state.foundLionCubs
        : (isEgyptCat ? LS.state.foundEgyptCats
          : (isMarrakechFox ? LS.state.foundMarrakechFoxes
            : (isKitsune ? LS.state.foundKitsune : LS.state.foundCats))));
    if (!arr.includes(animalId)) arr.push(animalId);

    world.zones = world.zones.filter(z => z.id !== 'animal:' + animalId);
    LS.runtime.nearZone = null;

    const count = arr.length;
    const isAll = count >= 5;
    if (isAll) {
      if (isHomePup) LS.state.homePetsCompletedAt = Date.now();
      else if (isLionCub) LS.state.lionCubsCompletedAt = Date.now();
      else if (isEgyptCat) LS.state.egyptCatsCompletedAt = Date.now();
      else if (isMarrakechFox) LS.state.marrakechFoxesCompletedAt = Date.now();
      else if (isKitsune) LS.state.kitsuneCompletedAt = Date.now();
      else LS.state.catsCompletedAt = Date.now();
    }

    const coinReward = isAll ? 90 : 35;
    const xpReward = isAll ? 55 : 22;

    LS.addCoins(coinReward);
    LS.addXP(xpReward);
    LS.saveState();
    LS.updateHUD();
    LS.playSFX('animal');
    if (LS.completeCozyMission) LS.completeCozyMission('pet');

    if (isAll) {
      LS.unlockStamp(isHomePup ? 'home_pets' : (isLionCub ? 'safari_cubs' : (isEgyptCat ? 'egypt_cats' : (isMarrakechFox ? 'marrakech_foxes' : (isKitsune ? 'kyoto_kitsune' : 'tokyo_cats')))));
      LS.showToast((isHomePup ? '🐶🎉 All 5 Community Puppies Found!'
        : (isLionCub ? '🦁🎉 All 5 Safari Lion Cubs Found!'
          : (isEgyptCat ? '🐱👑 All 5 Royal Egyptian Mau Cats Befriended!'
            : (isMarrakechFox ? '🦊✨ All 5 Sahara Fennec Foxes Befriended!'
              : (isKitsune ? '🦊🎉 All 5 Kyoto Kitsune Found!' : '🐾🎉 All 5 Tokyo Cats Found!'))))) +
        ' Bonus +' + coinReward + 'c! They will hide in brand-new spots in 2 hours!');
    } else {
      LS.showToast((isHomePup ? '🐶 Petted ' : (isLionCub ? '🦁 Befriended ' : (isEgyptCat ? '🐱👑 Befriended ' : (isMarrakechFox ? '🦊✨ Befriended ' : (isKitsune ? '🦊 Befriended ' : '🐱 Found '))))) + animal.name + ' (' + count + '/5)! +' + coinReward + 'c & +' + xpReward + ' XP!');
    }
  };

  let tvGameTimer = null;
  let cosmoGameTimer = null;
  let cosmoClawRAF = null;
  let ngscTimer = null;
  LS.closeAllModals = function () {
    LS.runtime.modalOpen = false;
    clearInterval(timerInterval);
    if (tvGameTimer) { clearInterval(tvGameTimer); tvGameTimer = null; }
    if (cosmoGameTimer) { clearInterval(cosmoGameTimer); cosmoGameTimer = null; }
    if (cosmoClawRAF) { cancelAnimationFrame(cosmoClawRAF); cosmoClawRAF = null; }
    if (ngscTimer) { clearInterval(ngscTimer); ngscTimer = null; }
    [
      'passport-modal', 'airport-modal', 'local-shop-modal', 'shinkansen-modal', 'school-modal', 'ramen-modal',
      'sushi-modal', 'tea-modal', 'shop-modal', 'gachapon-modal',
      'drink-modal', 'mochi-modal', 'clubhouse-modal', 'ryokan-modal', 'shrine-modal',
      'safari-guide-modal', 'safari-campfire-modal', 'safari-tent-modal',
      'kitchen-modal', 'piano-modal', 'tv-game-modal', 'home-restaurant-modal', 'globe-modal', 'quest-modal',
      'qashqai-modal', 'eatery-modal', 'yiwan-modal', 'cosmo-arcade-modal', 'mai-lasagna-modal', 'board-game-modal',
      'ngsc-game-modal', 'wave1-game-modal', 'bookshelf-modal'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  };

  function startMochiMiniGame(mode) {
    LS.closeAllModals();
    const lp = LS.chars.laila.root.position;
    const ballPos = new THREE.Vector3(
      Math.max(-3.2, Math.min(3.2, lp.x * 0.5)),
      0.14,
      Math.max(-24, Math.min(16, lp.z - (mode === 'fetch' ? 8.0 : 5.0)))
    );
    LS.runtime.mochiGame = {
      mode,
      timeLeft: 30,
      score: 0,
      ballPos,
      state: 'to_target'
    };
    if (LS.activeWorld && LS.activeWorld.mochiBall) {
      LS.activeWorld.mochiBall.visible = (mode === 'fetch');
      LS.activeWorld.mochiBall.position.copy(ballPos);
    }
    LS.playSFX('coin');
    LS.showToast(mode === 'fetch'
      ? '🎾 30s Ball Fetch Started! Run near Mochi to keep tossing the ball!'
      : '🐕 30s Street Tag Started! Chase & tag speedy Mochi!');
  }

  LS.finishMochiMiniGame = function () {
    const mg = LS.runtime.mochiGame;
    if (!mg) return;
    const earnedCoins = 20 + mg.score * 15;
    const earnedXP = 15 + mg.score * 10;
    LS.addCoins(earnedCoins);
    LS.addXP(earnedXP);
    LS.runtime.mochiGame = null;
    if (LS.activeWorld && LS.activeWorld.mochiBall) LS.activeWorld.mochiBall.visible = false;
    LS.playSFX('levelup');
    LS.showToast('🎉 Mochi ' + (mg.mode === 'fetch' ? 'Fetch' : 'Tag') + ' Done! Score ' + mg.score + ' • +' + earnedCoins + 'c & +' + earnedXP + ' XP!');
  };

  LS.startEatingAnimation = function (scene, mealKey, mealName, diningConfig) {
    if (LS.runtime.eating) LS.finishEatingAnimation(scene);
    const bowlObj = LS.spawnMealProps(scene, mealKey, diningConfig);
    LS.runtime.eating = {
      timer: 0,
      duration: 5.0,
      bowlObj,
      diningConfig,
      camPos: diningConfig.camPos,
      camLook: diningConfig.camLook
    };

    const laila = LS.chars.laila;
    const lSeat = diningConfig.lailaSeatPos || diningConfig.lailaSeat;
    const sSeat = diningConfig.salmaSeatPos || diningConfig.salmaSeat;
    const sYaw = (typeof diningConfig.seatRotY === 'number') ? diningConfig.seatRotY : (diningConfig.seatYaw || 0);
    if (lSeat) laila.root.position.copy(lSeat);
    laila.root.rotation.y = sYaw;
    laila.leftLeg.rotation.x = -1.25;
    laila.rightLeg.rotation.x = -1.25;

    const salma = LS.chars.salma;
    if (salma) {
      if (sSeat) salma.root.position.copy(sSeat);
      salma.root.rotation.y = sYaw;
      salma.leftLeg.rotation.x = -1.25;
      salma.rightLeg.rotation.x = -1.25;
    }

    document.getElementById('eating-status').textContent = '🍽️ Laila & Salma are enjoying ' + mealName + '... Yum! 😋';
    document.getElementById('eating-banner').classList.remove('hidden');
    LS.playSFX('coin');
  };

  LS.finishEatingAnimation = function (scene) {
    if (!LS.runtime.eating) return;
    const dc = LS.runtime.eating.diningConfig;
    scene.remove(LS.runtime.eating.bowlObj.group);

    const lSeat = dc.lailaSeatPos || dc.lailaSeat;
    const sSeat = dc.salmaSeatPos || dc.salmaSeat;
    const laila = LS.chars.laila;
    if (dc.exitPos) {
      laila.root.position.copy(dc.exitPos);
    } else if (lSeat && dc.exitOffset) {
      laila.root.position.copy(lSeat).add(dc.exitOffset);
    }
    laila.root.position.y = 0;
    laila.leftLeg.rotation.x = 0;
    laila.rightLeg.rotation.x = 0;
    laila.rightArm.rotation.x = 0;
    laila.headGroup.rotation.x = 0;

    const salma = LS.chars.salma;
    if (salma) {
      if (dc.exitPos) {
        salma.root.position.copy(dc.exitPos).add(new THREE.Vector3(0.85, 0, 0.35));
      } else if (sSeat && dc.exitOffset) {
        salma.root.position.copy(sSeat).add(dc.exitOffset);
      }
      salma.root.position.y = 0;
      salma.leftLeg.rotation.x = 0;
      salma.rightLeg.rotation.x = 0;
      salma.rightArm.rotation.x = 0;
      salma.headGroup.rotation.x = 0;
    }

    LS.runtime.eating = null;
    document.getElementById('eating-banner').classList.add('hidden');
    LS.showToast('😋 Delicious! Laila & Salma’s yummy boost is active!');
    LS.updateHUD();
  };

  LS.initGameplayUI = function (scene) {
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', LS.closeAllModals);
    });

    // Boutique Tabs & Filter
    document.getElementById('tab-laila').addEventListener('click', () => { activeShopTab = 'laila'; renderShopItems(); });
    document.getElementById('tab-salma').addEventListener('click', () => { activeShopTab = 'salma'; renderShopItems(); });
    const btnShowAll = document.getElementById('btn-shop-show-all');
    if (btnShowAll) {
      btnShowAll.addEventListener('click', () => {
        activeShopFilter = activeShopFilter === 'all' ? LS.state.currentWorld : 'all';
        btnShowAll.textContent = activeShopFilter === 'all' ? 'Showing All Worlds 🌍' : 'Show Both Tokyo & Kyoto Outfits 🌍';
        renderShopItems();
      });
    }

    // Tokyo Room Tabs
    document.getElementById('rtab-wallpaper').addEventListener('click', () => { activeRoomTab = 'wallpaper'; renderClubhousePreview(); });
    document.getElementById('rtab-beanbag').addEventListener('click', () => { activeRoomTab = 'beanbag'; renderClubhousePreview(); });
    document.getElementById('rtab-poster').addEventListener('click', () => { activeRoomTab = 'poster'; renderClubhousePreview(); });

    // Kyoto Ryokan Tabs
    document.getElementById('kytab-tatami').addEventListener('click', () => { activeRyokanTab = 'tatami'; renderRyokanPreview(); });
    document.getElementById('kytab-cushion').addEventListener('click', () => { activeRyokanTab = 'cushion'; renderRyokanPreview(); });
    document.getElementById('kytab-scroll').addEventListener('click', () => { activeRyokanTab = 'scroll'; renderRyokanPreview(); });

    // Gachapon spin (rolls Tokyo toys at Tokyo machine, Kyoto toys at Kyoto machine!)
    document.getElementById('btn-spin-gachapon').addEventListener('click', () => {
      const msgEl = document.getElementById('gachapon-msg');
      const cost = 15;
      if (LS.state.coins < cost) {
        msgEl.textContent = 'Need 15 coins! Earn more from quizzes, hidden animals, or Mochi.';
        LS.playSFX('wrong');
        return;
      }
      LS.addCoins(-cost);
      const pool = LS.GACHAPON_TOYS.filter(t => t.world === activeGachaponWorld);
      const source = pool.length > 0 ? pool : LS.GACHAPON_TOYS;
      const toy = source[Math.floor(Math.random() * source.length)];
      if (!LS.state.unlockedToys.includes(toy.id)) {
        LS.state.unlockedToys.push(toy.id);
        LS.addXP(15);
        msgEl.style.color = '#1b7a43';
        msgEl.textContent = '🎉 New Capsule Toy: ' + toy.emoji + ' ' + toy.name + ' added to your Toy Shelf!';
        LS.showToast('🎁 New Toy: ' + toy.emoji + ' ' + toy.name + '!');
        if (LS.state.unlockedToys.length >= 3) LS.unlockStamp('tokyo_toys');
      } else {
        LS.addCoins(5);
        msgEl.style.color = '#9c6514';
        msgEl.textContent = '✨ Got ' + toy.emoji + ' ' + toy.name + ' again (+5c refund)!';
      }
      LS.saveState();
      LS.updateHUD();
      renderGachaponShelf();
      LS.playSFX('correct');
    });

    // Tokyo Drink Vending Machine
    document.querySelectorAll('.buy-drink').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-drink');
        const msgEl = document.getElementById('drink-msg');
        if (LS.state.coins < 20) { msgEl.textContent = 'Not enough coins (20c)!'; LS.playSFX('wrong'); return; }
        LS.addCoins(-20);
        LS.runtime.stamina = 100;
        if (type === 'melon_soda') {
          LS.runtime.superJumpUntil = Date.now() + 45000;
          LS.closeAllModals(); LS.playSFX('correct');
          LS.showToast('🍈 Melon Soda Fizzy! Super-Jump active for 45s!');
        } else if (type === 'strawberry_milk') {
          LS.runtime.sparkleUntil = Date.now() + 45000;
          LS.closeAllModals(); LS.playSFX('correct');
          LS.showToast('🍓 Strawberry Milk Sweet! Sparkle Trail active for 45s!');
        } else {
          LS.runtime.buff = { name: 'Warm Taiyaki', short: 'Taiyaki+', speedMult: 1.25, infiniteStamina: true, expiresAt: Date.now() + 60000 };
          LS.closeAllModals(); LS.playSFX('correct');
          LS.showToast('🐟 Warm Taiyaki! Speed + Infinite Stamina boost for 60s!');
        }
        LS.updateHUD();
      });
    });

    // Kyoto Matcha & Wagashi Tea House
    document.querySelectorAll('.buy-tea').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-tea');
        const msgEl = document.getElementById('tea-msg');
        const cost = 25;
        if (LS.state.coins < cost) { msgEl.textContent = 'Not enough coins (25c)!'; LS.playSFX('wrong'); return; }
        LS.addCoins(-cost);
        LS.runtime.stamina = 100;
        LS.addXP(10);
        if (type === 'matcha_parfait') {
          LS.runtime.superJumpUntil = Date.now() + 50000;
          LS.closeAllModals(); LS.playSFX('correct');
          LS.showToast('🍨 Uji Matcha Parfait! Super-Jump active for 50s (+10 XP)!');
        } else if (type === 'dango') {
          LS.runtime.sparkleUntil = Date.now() + 50000;
          LS.closeAllModals(); LS.playSFX('correct');
          LS.showToast('🍡 Tri-Color Hanami Dango! Blossom Sparkle Trail for 50s (+10 XP)!');
        } else {
          LS.runtime.buff = { name: 'Sweet Dorayaki', short: 'Matcha⚡', speedMult: 1.28, infiniteStamina: true, expiresAt: Date.now() + 75000 };
          LS.closeAllModals(); LS.playSFX('correct');
          LS.showToast('🥞 Warm Kyoto Dorayaki! Speed + Infinite Stamina for 75s (+10 XP)!');
        }
        LS.updateHUD();
      });
    });

    // Mochi Play
    document.getElementById('btn-pet-mochi').addEventListener('click', () => {
      LS.runtime.mochiHeartTimer = 3.2;
      if (LS.chars.mochi) LS.chars.mochi.rotation.y += Math.PI * 2;
      LS.addXP(10);
      LS.closeAllModals();
      LS.playSFX('animal');
      LS.showToast('💖 Laila & Salma pet Mochi! Happy spin & +10 XP!');
    });
    document.getElementById('btn-start-fetch').addEventListener('click', () => startMochiMiniGame('fetch'));
    document.getElementById('btn-start-tag').addEventListener('click', () => startMochiMiniGame('tag'));

    // Quizzes
    document.getElementById('btn-start-quiz').addEventListener('click', () => {
      activeQuiz = {
        questions: generateQuiz(LS.getCurrentQuizWindow() * 97 + (activeQuizWorld === 'kyoto' ? 53 : 13), activeQuizWorld, false),
        index: 0, score: 0, practice: false, salmaMode: false, locked: false
      };
      document.getElementById('school-lobby').classList.add('hidden');
      document.getElementById('school-question').classList.remove('hidden');
      renderQuestion();
    });

    document.getElementById('btn-salma-quiz').addEventListener('click', () => {
      activeQuiz = {
        questions: generateQuiz(Math.floor(Math.random() * 99999), activeQuizWorld, true),
        index: 0, score: 0, practice: false, salmaMode: true, locked: false
      };
      document.getElementById('school-lobby').classList.add('hidden');
      document.getElementById('school-question').classList.remove('hidden');
      renderQuestion();
    });

    document.getElementById('btn-practice-quiz').addEventListener('click', () => {
      activeQuiz = {
        questions: generateQuiz(Math.floor(Math.random() * 99999), activeQuizWorld, false),
        index: 0, score: 0, practice: true, salmaMode: false, locked: false
      };
      document.getElementById('school-lobby').classList.add('hidden');
      document.getElementById('school-question').classList.remove('hidden');
      renderQuestion();
    });

    document.getElementById('btn-demo-skip').addEventListener('click', () => {
      LS.state.demoOffsetWindows = (LS.state.demoOffsetWindows || 0) + 1;
      LS.saveState();
      refreshSchoolLobby();
      LS.showToast('⏱️ Demo Skip: New graded quiz unlocked!');
    });

    // Ichiban Ramen (Tokyo)
    document.querySelectorAll('.buy-ramen').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-ramen');
        const item = RAMEN_CATALOG[key];
        if (!item) return;
        if (LS.state.coins < item.cost) {
          document.getElementById('ramen-msg').textContent = 'Not enough coins! Take a quiz with Sensei Haruka in Sakura Plaza to earn more.';
          LS.playSFX('wrong'); return;
        }
        LS.addCoins(-item.cost);
        LS.runtime.stamina = 100;
        LS.runtime.buff = { name: item.name, short: item.short, speedMult: item.speedMult, infiniteStamina: item.infiniteStamina, expiresAt: Date.now() + item.durationMs };
        if (item.bonusXp > 0) LS.addXP(item.bonusXp);
        LS.unlockStamp('tokyo_ramen');
        if (LS.advanceStoryStep) LS.advanceStoryStep('tokyo', 'tokyo_ramen');
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.closeAllModals();
        if (LS.activeWorld && LS.activeWorld.ramenDiningConfig) {
          LS.startEatingAnimation(scene, key, item.name, LS.activeWorld.ramenDiningConfig);
        }
      });
    });

    // Sakura Sushi (Kyoto)
    document.querySelectorAll('.buy-sushi').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-sushi');
        const item = SUSHI_CATALOG[key];
        if (!item) return;
        if (LS.state.coins < item.cost) {
          document.getElementById('sushi-msg').textContent = 'Not enough coins! Feed the koi, find kitsune, or quiz with Sensei Kenji.';
          LS.playSFX('wrong'); return;
        }
        LS.addCoins(-item.cost);
        LS.runtime.stamina = 100;
        LS.runtime.buff = { name: item.name, short: item.short, speedMult: item.speedMult, infiniteStamina: item.infiniteStamina, expiresAt: Date.now() + item.durationMs };
        if (item.bonusXp > 0) LS.addXP(item.bonusXp);
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.closeAllModals();
        if (LS.activeWorld && LS.activeWorld.sushiDiningConfig) {
          LS.startEatingAnimation(scene, key, item.name, LS.activeWorld.sushiDiningConfig);
        }
      });
    });

    // Sakurako Shrine Omikuji & Ema Wishes
    document.getElementById('btn-draw-omikuji').addEventListener('click', () => {
      const f = OMIKUJI_FORTUNES[Math.floor(Math.random() * OMIKUJI_FORTUNES.length)];
      LS.state.lastFortune = f;
      LS.addCoins(f.bonusCoins);
      LS.addXP(f.bonusXp);
      LS.unlockStamp('kyoto_shrine');
      if (LS.advanceStoryStep) LS.advanceStoryStep('kyoto', 'kyoto_shrine');
      LS.playSFX('shrine');
      document.getElementById('omikuji-result').innerHTML =
        '<strong>' + f.emoji + ' ' + f.rank + '</strong><div>' + f.text + ' (+' + f.bonusCoins + 'c, +' + f.bonusXp + ' XP)</div>';
    });

    document.querySelectorAll('.ema-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const wish = btn.getAttribute('data-wish');
        LS.state.emaWishes.push(wish);
        LS.addXP(12);
        LS.addCoins(10);
        LS.unlockStamp('kyoto_shrine');
        if (LS.advanceStoryStep) LS.advanceStoryStep('kyoto', 'kyoto_shrine');
        LS.saveState();
        LS.playSFX('shrine');
        renderShrineWishes();
        LS.showToast('🪵 Hung Ema Wish: "' + wish + '" (+10c, +12 XP)!');
      });
    });

    document.getElementById('btn-skip-eat').addEventListener('click', () => {
      LS.finishEatingAnimation(scene);
    });

    // Two-step kid-safe Reset All Progress controls inside Travel Passport
    const resetTrigger = document.getElementById('btn-reset-progress');
    const resetConfirmBox = document.getElementById('reset-confirm-box');
    const resetCancel = document.getElementById('btn-reset-cancel');
    const resetConfirm = document.getElementById('btn-reset-confirm');
    if (resetTrigger && resetConfirmBox) {
      resetTrigger.addEventListener('click', () => {
        resetTrigger.classList.add('hidden');
        resetConfirmBox.classList.remove('hidden');
      });
    }
    if (resetCancel && resetTrigger && resetConfirmBox) {
      resetCancel.addEventListener('click', () => {
        resetConfirmBox.classList.add('hidden');
        resetTrigger.classList.remove('hidden');
      });
    }
    if (resetConfirm) {
      resetConfirm.addEventListener('click', () => {
        if (LS.resetProgress) LS.resetProgress();
      });
    }

    // --- GRAND AFRICAN SAFARI UI LISTENERS ---
    const btnSafCam = document.getElementById('btn-safari-camera');
    if (btnSafCam) btnSafCam.addEventListener('click', () => LS.openSafariGuideModal());
    const btnSnapNow = document.getElementById('btn-snap-wildlife-now');
    if (btnSnapNow) {
      btnSnapNow.addEventListener('click', () => {
        LS.closeAllModals();
        LS.snapSafariWildlifePhoto();
      });
    }
    const btnSkipBalloon = document.getElementById('btn-skip-balloon');
    if (btnSkipBalloon) btnSkipBalloon.addEventListener('click', () => LS.finishBalloonRide(true));

    // Safari Glamping Tent Decorator Tabs
    const stRug = document.getElementById('sttab-rug');
    const stCush = document.getElementById('sttab-cushion');
    const stTap = document.getElementById('sttab-tapestry');
    if (stRug) stRug.addEventListener('click', () => { activeSafariTentTab = 'rug'; renderSafariTentPreview(); });
    if (stCush) stCush.addEventListener('click', () => { activeSafariTentTab = 'cushion'; renderSafariTentPreview(); });
    if (stTap) stTap.addEventListener('click', () => { activeSafariTentTab = 'tapestry'; renderSafariTentPreview(); });

    // Djembe Campfire Drum Circle Pads, Auto-Jam & Marshmallow Roast
    document.querySelectorAll('.djembe-pad').forEach(pad => {
      pad.addEventListener('click', () => {
        const kind = pad.getAttribute('data-drum');
        if (LS.playDjembeSound) LS.playDjembeSound(kind);
        pad.classList.add('active');
        setTimeout(() => pad.classList.remove('active'), 160);
        const msg = document.getElementById('safari-campfire-msg');
        if (msg) msg.textContent = '🥁 Boom-bap! Laila & Salma jam on the Savanna Djembe drum!';
      });
    });
    const btnJam = document.getElementById('btn-campfire-jam');
    if (btnJam) {
      btnJam.addEventListener('click', () => {
        const seq = ['bass', 'tone', 'slap', 'tone', 'marimba', 'bass', 'slap', 'marimba'];
        seq.forEach((k, idx) => {
          setTimeout(() => { if (LS.playDjembeSound) LS.playDjembeSound(k); }, idx * 190);
        });
        LS.addXP(10);
        const msg = document.getElementById('safari-campfire-msg');
        if (msg) msg.textContent = '🎶 Savanna Sunset Jam playing! The stars twinkle above Base Camp! (+10 XP)';
      });
    }
    const btnRoast = document.getElementById('btn-roast-marshmallow');
    if (btnRoast) {
      btnRoast.addEventListener('click', () => {
        LS.addCoins(15);
        LS.addXP(15);
        LS.unlockStamp('safari_campfire');
        LS.playSFX('coin');
        LS.runtime.sparkleUntil = Date.now() + 45000;
        const msg = document.getElementById('safari-campfire-msg');
        if (msg) msg.textContent = '🔥🍡 Golden toasted marshmallows! Warm campfire sparkle trail active! (+15c, +15 XP)';
        LS.showToast('🔥🍡 Toasted Campfire Marshmallows with Laila & Salma! +15c & +15 XP!');
      });
    }

    // --- HOME APARTMENT & STORYBOOK JOURNAL LISTENERS ---
    // 1. Kitchen Healthy Snacks
    document.querySelectorAll('.pick-snack').forEach(btn => {
      btn.addEventListener('click', () => {
        const snack = btn.getAttribute('data-snack');
        LS.runtime.stamina = 100;
        if (snack === 'apple') {
          LS.runtime.buff = { name: 'Apple & Almond Butter', short: 'Healthy🍎', speedMult: 1.24, infiniteStamina: true, expiresAt: Date.now() + 90000 };
        } else if (snack === 'yogurt') {
          LS.runtime.sparkleUntil = Date.now() + 75000;
          LS.runtime.buff = { name: 'Berry Yogurt Parfait', short: 'Berry🫐', speedMult: 1.20, infiniteStamina: true, expiresAt: Date.now() + 90000 };
        } else {
          LS.runtime.superJumpUntil = Date.now() + 75000;
          LS.runtime.buff = { name: 'Veggies & Hummus', short: 'Veggie🥕', speedMult: 1.22, infiniteStamina: true, expiresAt: Date.now() + 90000 };
        }
        LS.addXP(15);
        LS.unlockStamp('home_snack');
        if (LS.advanceStoryStep) LS.advanceStoryStep('home_neighborhood', 'home_snack');
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.playSFX('correct');
        LS.closeAllModals();
        LS.updateHUD();
        LS.showToast('🍎 Yum! Healthy home snack boost active! +15 XP!');
      });
    });

    // 2. Laila's 8-Key Upright Piano + Auto Ghibli Melody
    document.querySelectorAll('.piano-key').forEach(key => {
      key.addEventListener('click', () => {
        if (LS.unlockAudio) LS.unlockAudio();
        const noteIdx = parseInt(key.getAttribute('data-note'), 10) || 0;
        if (LS.playPianoNote) LS.playPianoNote(noteIdx, 0, 0.13);
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 180);
        const msg = document.getElementById('piano-msg');
        if (msg) msg.textContent = '🎹 Mom & Dad smile over their coffee: "Beautiful playing, Laila!" ☕💛';
        if (!LS.state.stamps.includes('home_piano')) {
          LS.addCoins(15);
          LS.addXP(20);
          LS.unlockStamp('home_piano');
        }
        if (LS.advanceStoryStep) LS.advanceStoryStep('home_neighborhood', 'home_piano');
        if (LS.completeCozyMission) LS.completeCozyMission('music');
      });
    });

    const btnGhibliSong = document.getElementById('btn-play-ghibli-song');
    if (btnGhibliSong) {
      btnGhibliSong.addEventListener('click', () => {
        if (LS.unlockAudio) LS.unlockAudio();
        const melody = [0, 2, 4, 7, 5, 4, 2, 0, 2, 4, 5, 4, 2, 0];
        const keys = document.querySelectorAll('.piano-key');
        melody.forEach((n, idx) => {
          setTimeout(() => {
            if (LS.playPianoNote) LS.playPianoNote(n, 0, 0.13);
            const k = keys[n];
            if (k) {
              k.classList.add('pressed');
              setTimeout(() => k.classList.remove('pressed'), 200);
            }
          }, idx * 240);
        });
        LS.addCoins(15);
        LS.addXP(20);
        LS.unlockStamp('home_piano');
        if (LS.advanceStoryStep) LS.advanceStoryStep('home_neighborhood', 'home_piano');
        if (LS.completeCozyMission) LS.completeCozyMission('music');
        const msg = document.getElementById('piano-msg');
        if (msg) msg.textContent = '✨🎶 Mom & Dad applaud Laila\'s Studio Ghibli recital! (+15c, +20 XP)';
        LS.showToast('🎹 Mom & Dad loved Laila\'s piano recital! +15c & +20 XP!');
      });
    }

    // 3. TV Room: Watch Cozy Cartoon OR Play 15s Star-Catcher Mini-Game!
    const btnWatchTv = document.getElementById('btn-watch-cartoon');
    if (btnWatchTv) {
      btnWatchTv.addEventListener('click', () => {
        if (tvGameTimer) { clearInterval(tvGameTimer); tvGameTimer = null; }
        const stage = document.getElementById('tv-stage');
        if (stage) {
          stage.innerHTML = '<div class="tv-cartoon-scene">☁️✨ 🏡 👧🧒 ✨☁️<div class="tv-sub">Cozy Studio Ghibli Adventure Cartoon Playing...</div></div>';
        }
        LS.runtime.stamina = 100;
        LS.addXP(12);
        LS.unlockStamp('home_gamer');
        if (LS.completeCozyMission) LS.completeCozyMission('play');
        LS.playSFX('correct');
        const msg = document.getElementById('tv-game-msg');
        if (msg) msg.textContent = '📺 Cozy cartoon time with Laila & Salma! Full energy restored (+12 XP)!';
      });
    }

    const btnStartTvGame = document.getElementById('btn-start-tv-game');
    if (btnStartTvGame) {
      btnStartTvGame.addEventListener('click', () => {
        if (tvGameTimer) { clearInterval(tvGameTimer); tvGameTimer = null; }
        const stage = document.getElementById('tv-stage');
        const msg = document.getElementById('tv-game-msg');
        if (!stage) return;
        let score = 0;
        let timeLeft = 15;
        stage.innerHTML = '<div class="tv-hud">⭐ Score: <strong id="tv-score">0</strong> • ⏱️ <strong id="tv-time">15</strong>s</div><div id="tv-playfield" class="tv-playfield"></div>';
        const pf = document.getElementById('tv-playfield');

        function spawnStar() {
          if (!pf) return;
          const star = document.createElement('button');
          star.type = 'button';
          star.className = 'tv-star-btn';
          star.textContent = Math.random() > 0.25 ? '⭐' : '🌟';
          star.style.left = (8 + Math.random() * 76) + '%';
          star.style.top = (10 + Math.random() * 68) + '%';
          star.onclick = () => {
            score += 1;
            const scEl = document.getElementById('tv-score');
            if (scEl) scEl.textContent = String(score);
            LS.playSFX('coin');
            star.remove();
            spawnStar();
          };
          pf.appendChild(star);
          setTimeout(() => { if (star.parentNode) star.remove(); }, 1800);
        }

        spawnStar();
        spawnStar();
        if (msg) msg.textContent = '🎮 Tap the glowing stars as fast as you can!';
        tvGameTimer = setInterval(() => {
          timeLeft -= 1;
          const tEl = document.getElementById('tv-time');
          if (tEl) tEl.textContent = String(Math.max(0, timeLeft));
          if (timeLeft > 0) spawnStar();
          if (timeLeft <= 0) {
            clearInterval(tvGameTimer);
            tvGameTimer = null;
            const coins = 15 + score * 4;
            const xp = 12 + score * 3;
            LS.addCoins(coins);
            LS.addXP(xp);
            LS.unlockStamp('home_gamer');
            if (LS.completeCozyMission) LS.completeCozyMission('play');
            LS.playSFX('levelup');
            if (pf) pf.innerHTML = '<div class="tv-done">🎉 High Score: ' + score + ' ⭐ (+' + coins + 'c, +' + xp + ' XP)!</div>';
            if (msg) msg.textContent = '🎮 Awesome video game session! Earned +' + coins + 'c & +' + xp + ' XP!';
          }
        }, 1000);
      });
    }

    // 4. Bella Bistro Family Dinner
    document.querySelectorAll('.buy-bistro').forEach(btn => {
      btn.addEventListener('click', () => {
        const meal = btn.getAttribute('data-bistro');
        const menu = {
          pasta: { name: 'Creamy Tomato Pasta', cost: 25, xp: 20 },
          grilled_salmon: { name: 'Lemon Herb Grilled Salmon', cost: 35, xp: 25 },
          family_pizza: { name: 'Family Wood-Fired Pizza ⭐', cost: 40, xp: 30 }
        }[meal];
        if (!menu) return;
        if (LS.state.coins < menu.cost) {
          const m = document.getElementById('bistro-msg');
          if (m) m.textContent = 'Not enough coins (' + menu.cost + 'c)!';
          LS.playSFX('wrong');
          return;
        }
        LS.addCoins(-menu.cost);
        LS.addXP(menu.xp);
        LS.runtime.stamina = 100;
        LS.runtime.buff = { name: menu.name, short: 'Dinner🍽️', speedMult: 1.28, infiniteStamina: true, expiresAt: Date.now() + 180000 };
        LS.unlockStamp('home_dinner');
        if (LS.advanceStoryStep) LS.advanceStoryStep('home_neighborhood', 'home_dinner');
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.closeAllModals();
        const dc = LS.activeWorld && LS.activeWorld.diningConfigs && LS.activeWorld.diningConfigs.home_restaurant;
        if (dc) {
          LS.startEatingAnimation(scene, meal, menu.name, {
            lailaSeatPos: dc.lailaSeat,
            salmaSeatPos: dc.salmaSeat,
            seatRotY: dc.seatYaw,
            exitOffset: new THREE.Vector3(-2.0, 0, 0),
            lailaDishPos: dc.lailaDishPos,
            salmaDishPos: dc.salmaDishPos,
            oishiiPos: dc.oishiiPos,
            camPos: dc.camPos,
            camLook: dc.camLook,
            caption: dc.caption
          });
        } else {
          LS.showToast('🍽️ Delicious Family Dinner at Bella Bistro! +' + menu.xp + ' XP!');
        }
      });
    });

    // 5. Cozy Mission Refresh Button inside Storybook Journal
    const btnRefreshMissions = document.getElementById('btn-refresh-missions');
    if (btnRefreshMissions) {
      btnRefreshMissions.addEventListener('click', () => {
        if (LS.refreshCozyMissions) LS.refreshCozyMissions();
        LS.playSFX('coin');
        LS.openQuestModal();
      });
    }
  };

  LS.openKitchenModal = function () {
    LS.runtime.modalOpen = true;
    const m = document.getElementById('kitchen-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openPianoModal = function () {
    LS.runtime.modalOpen = true;
    const msg = document.getElementById('piano-msg');
    if (msg) msg.textContent = 'Tap any key or press "Play Laila\'s Ghibli Song" while Mom & Dad sip coffee! ☕';
    const m = document.getElementById('piano-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openTvGameModal = function () {
    LS.runtime.modalOpen = true;
    const stage = document.getElementById('tv-stage');
    if (stage) stage.innerHTML = '<div class="tv-cartoon-scene">📺 Ready for Cozy TV or Star-Catcher Arcade! 🎮</div>';
    const msg = document.getElementById('tv-game-msg');
    if (msg) msg.textContent = '';
    const m = document.getElementById('tv-game-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openHomeRestaurantModal = function () {
    LS.runtime.modalOpen = true;
    const msg = document.getElementById('bistro-msg');
    if (msg) msg.textContent = '';
    const m = document.getElementById('home-restaurant-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openGlobeModal = function () {
    LS.runtime.modalOpen = true;
    const list = document.getElementById('globe-worlds-list');
    if (list) {
      list.innerHTML = '';
      const enabledWorlds = LS.getEnabledOutdoorWorlds ? LS.getEnabledOutdoorWorlds() : ['home_neighborhood', 'safari', 'egypt', 'marrakech', 'tokyo'];
      enabledWorlds.forEach(wid => {
        const w = LS.WORLDS[wid];
        if (!w) return;
        const isJapan = wid === 'tokyo';
        const curW = LS.state.currentWorld;
        const row = document.createElement('div');
        row.className = 'ramen-item';
        const isHere = isJapan
          ? (curW === 'tokyo' || curW === 'kyoto' || curW === 'tokyo_room' || curW === 'kyoto_room')
          : (curW === wid || (wid === 'home_neighborhood' && (curW === 'home_apartment' || curW.indexOf('dest_') === 0)));
        const title = isJapan ? '🇯🇵 Japan (Tokyo & Kyoto)' : (w.emoji + ' ' + w.title);
        const sub = isJapan ? 'Tokyo & Kyoto • Connected by Shinkansen Bullet Train 🚅' : w.subtitle;
        row.innerHTML = '<div><strong>' + title + '</strong><div class="ramen-desc">' + sub + '</div></div>';
        const btn = document.createElement('button');
        btn.className = isHere ? 'btn-secondary' : 'btn-primary';
        btn.textContent = isHere ? (wid === 'home_neighborhood' ? 'Home Base ✓' : 'Here ✓') : 'Spin & Go ✨';
        btn.disabled = isHere;
        btn.onclick = () => LS.travelToWorld(wid);
        row.appendChild(btn);
        list.appendChild(row);
      });
      // Preview next phase worlds ONLY in Preview build (never spoil unbuilt worlds in Live!)
      if (LS.shouldShowUpcomingWorlds && LS.shouldShowUpcomingWorlds()) {
        const up = document.createElement('div');
        up.className = 'ramen-desc';
        up.style.marginTop = '10px';
        up.innerHTML = '<strong>✨ Coming Soon on the Magic Globe:</strong> ' + LS.UPCOMING_WORLDS.slice(0, 4).map(u => u.emoji + ' ' + u.title + ' (' + u.gate + ')').join(' • ');
        list.appendChild(up);
      }
    }
    const m = document.getElementById('globe-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openQuestModal = function () {
    LS.runtime.modalOpen = true;
    const chapBox = document.getElementById('quest-chapters-list');
    const misBox = document.getElementById('quest-missions-list');
    if (chapBox && LS.STORY_CHAPTERS) {
      chapBox.innerHTML = '';

      // Africa Master Explorer Bonus Banner (completing Safari + Egypt + Marrakech unlocks Magic Carpet Glide!)
      const sp = LS.state.storyProgress || {};
      const africaDoneCount = ((sp.safari || 0) >= 3 ? 1 : 0) + ((sp.egypt || 0) >= 3 ? 1 : 0) + ((sp.marrakech || 0) >= 3 ? 1 : 0);
      const hasMaster = LS.hasAfricaMasterBonus && LS.hasAfricaMasterBonus();
      const bonusCard = document.createElement('div');
      bonusCard.className = 'passport-world-card';
      bonusCard.style.background = hasMaster
        ? 'linear-gradient(135deg, #fff6d6 0%, #fde68a 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #fef3c7 100%)';
      bonusCard.style.border = hasMaster ? '2px solid #d97706' : '2px dashed #d97706';
      bonusCard.innerHTML =
        '<div class="pw-head"><strong>🌍🪄 Wave 1 Africa Master Explorer Bonus</strong>' +
        '<span class="pw-progress">' + africaDoneCount + '/3 Africa Chapters</span></div>' +
        '<div class="ramen-desc" style="margin-top:4px;">' +
        (hasMaster
          ? 'You mastered Safari, Ancient Egypt & Marrakech! Activate your sparkling Magic Carpet Glide anytime!'
          : 'Complete all 3 Africa Chapters (Safari, Ancient Egypt & Marrakech) to unlock the sparkling Magic Carpet Glide speed boost forever!') +
        '</div>';
      if (hasMaster) {
        const glideBtn = document.createElement('button');
        glideBtn.className = 'btn-primary';
        glideBtn.style.marginTop = '8px';
        glideBtn.textContent = '🪄 Activate Magic Carpet Glide Boost! ✨';
        glideBtn.onclick = () => {
          LS.closeAllModals();
          LS.activateMagicCarpetGlide(false);
        };
        bonusCard.appendChild(glideBtn);
      }
      chapBox.appendChild(bonusCard);

      Object.keys(LS.STORY_CHAPTERS).forEach(wid => {
        if (LS.isWorldEnabled && !LS.isWorldEnabled(wid)) return;
        const chap = LS.STORY_CHAPTERS[wid];
        const prog = (LS.state.storyProgress && LS.state.storyProgress[wid]) || 0;
        const card = document.createElement('div');
        card.className = 'passport-world-card';
        let stepsHtml = chap.steps.map((st, idx) => {
          const done = idx < prog;
          const active = idx === prog;
          return '<div class="quest-step ' + (done ? 'done' : (active ? 'active' : '')) + '">' +
            (done ? '✅ ' : (active ? '⭐ ' : '⬜ ')) + st.title +
            (active ? '<div class="ramen-desc" style="margin-left:20px;">💡 ' + st.hint + '</div>' : '') +
            '</div>';
        }).join('');
        card.innerHTML =
          '<div class="pw-head"><strong>' + chap.emoji + ' ' + chap.title + '</strong>' +
          '<span class="pw-progress">' + Math.min(prog, chap.steps.length) + '/' + chap.steps.length + '</span></div>' +
          stepsHtml;
        chapBox.appendChild(card);
      });
    }
    if (misBox && Array.isArray(LS.state.cozyMissions)) {
      misBox.innerHTML = '';
      LS.state.cozyMissions.forEach(m => {
        const row = document.createElement('div');
        row.className = 'ramen-item';
        row.innerHTML =
          '<div><strong>' + (m.done ? '✅ ' : m.emoji + ' ') + m.title + '</strong>' +
          '<div class="ramen-desc">Reward: +' + m.rewardCoins + 'c &amp; +' + m.rewardXp + ' XP</div></div>' +
          '<span class="pw-progress">' + (m.done ? 'Done!' : 'Active') + '</span>';
        misBox.appendChild(row);
      });
    }
    const m = document.getElementById('quest-modal');
    if (m) m.classList.remove('hidden');
  };

  // =========================================================================
  // MOROCCAN RIAD ROOFTOP SUITE — LIVE 3D DECORATOR!
  // =========================================================================
  LS.openRiadDecorModal = function () {
    LS.runtime.modalOpen = true;
    const modal = document.getElementById('wave1-game-modal');
    const titleEl = document.getElementById('wave1-game-title');
    const bodyEl = document.getElementById('wave1-game-body');
    const msgEl = document.getElementById('wave1-game-msg');
    if (!modal || !bodyEl) return;
    if (titleEl) titleEl.textContent = '🕌 Decorate the Moroccan Riad Rooftop Suite 🏮✨';
    if (msgEl) msgEl.textContent = 'Every Zellige carpet, velvet pouf & glowing stained-glass lantern updates live in 3D!';

    function renderRiadDecor() {
      bodyEl.innerHTML = '';
      const unlocked = LS.state.unlockedRiadItems || ['riad_zellige', 'riad_saffron', 'riad_gold_glow'];
      const sections = [
        { label: '🧶 Rooftop Zellige Carpets', items: LS.RIAD_RUGS || [], stateKey: 'riadRug' },
        { label: '🛋️ Velvet Floor Poufs', items: LS.RIAD_CUSHIONS || [], stateKey: 'riadCushion' },
        { label: '🏮 Stained-Glass Brass Lanterns', items: LS.RIAD_LANTERNS || [], stateKey: 'riadLantern' }
      ];
      sections.forEach(sec => {
        const h = document.createElement('div');
        h.style.cssText = 'font-weight:800;color:#5b2f12;margin:10px 0 6px;font-size:14px;';
        h.textContent = sec.label;
        bodyEl.appendChild(h);

        const rowWrap = document.createElement('div');
        rowWrap.style.cssText = 'display:grid;gap:6px;';
        sec.items.forEach(it => {
          const owned = unlocked.includes(it.id) || it.cost === 0;
          const active = LS.state[sec.stateKey] === it.id;
          const row = document.createElement('div');
          row.className = 'shop-item' + (active ? ' equipped' : '');
          row.innerHTML = '<div><strong><span class="swatch-dot" style="background:' + it.color + '"></span>' + it.name + '</strong></div>';
          const btn = document.createElement('button');
          if (active) {
            btn.className = 'btn-secondary';
            btn.textContent = 'Placed ✓';
            btn.disabled = true;
          } else if (owned) {
            btn.className = 'btn-primary';
            btn.textContent = 'Place ✨';
            btn.onclick = () => {
              LS.state[sec.stateKey] = it.id;
              LS.saveState();
              if (LS.activeWorld && LS.activeWorld.applyRiadDecor) LS.activeWorld.applyRiadDecor();
              LS.unlockStamp('marrakech_riad');
              LS.playSFX('coin');
              if (msgEl) msgEl.textContent = '✨ Placed ' + it.name + ' on your Riad Rooftop!';
              renderRiadDecor();
            };
          } else {
            btn.className = 'btn-primary';
            btn.textContent = it.cost + 'c';
            btn.onclick = () => {
              if (LS.state.coins < it.cost) {
                if (msgEl) msgEl.textContent = 'Not enough coins (' + it.cost + 'c)! Play a Marrakech activity or quiz!';
                LS.playSFX('wrong');
                return;
              }
              LS.addCoins(-it.cost);
              if (!LS.state.unlockedRiadItems) LS.state.unlockedRiadItems = [];
              LS.state.unlockedRiadItems.push(it.id);
              LS.state[sec.stateKey] = it.id;
              LS.saveState();
              if (LS.activeWorld && LS.activeWorld.applyRiadDecor) LS.activeWorld.applyRiadDecor();
              LS.unlockStamp('marrakech_riad');
              LS.playSFX('correct');
              if (msgEl) msgEl.textContent = '🏮 Unlocked & placed ' + it.name + '!';
              renderRiadDecor();
            };
          }
          row.appendChild(btn);
          rowWrap.appendChild(row);
        });
        bodyEl.appendChild(rowWrap);
      });
    }

    renderRiadDecor();
    modal.classList.remove('hidden');
  };

  // =========================================================================
  // GRAY NISSAN QASHQAI & 5 REAL-LIFE DESTINATIONS CONTROLLERS!
  // =========================================================================
  LS.openQashqaiModal = function () {
    LS.runtime.modalOpen = true;
    const leader = LS.getLeaderName ? LS.getLeaderName() : 'Laila';
    const qGreet = document.getElementById('qashqai-greeting');
    if (qGreet) qGreet.textContent = 'Hop into the family gray Nissan Qashqai, ' + leader + '! Pick a destination to drive to:';
    const list = document.getElementById('qashqai-dest-list');
    if (list) {
      list.innerHTML = '';
      const destIds = ['dest_airport', 'dest_eatery', 'dest_yiwan', 'dest_cosmo_city', 'dest_grandparents', 'dest_mai_mostafa', 'dest_ngsc'];
      if (LS.state.currentWorld !== 'home_neighborhood') {
        destIds.unshift('home_neighborhood');
      }
      destIds.forEach(wid => {
        const w = LS.WORLDS[wid];
        if (!w) return;
        const isHere = LS.state.currentWorld === wid;
        const row = document.createElement('div');
        row.className = 'ramen-item' + (wid === 'dest_airport' || wid === 'dest_mai_mostafa' || wid === 'dest_ngsc' ? ' featured' : '');
        row.innerHTML = '<div><strong>' + w.emoji + ' ' + w.title + '</strong><div class="ramen-desc">' + w.subtitle + '</div></div>';
        const btn = document.createElement('button');
        btn.className = isHere ? 'btn-secondary' : 'btn-primary';
        btn.textContent = isHere ? 'Parked Here ✓' : (wid === 'home_neighborhood' ? 'Drive Home 🏡' : 'Drive 🚙');
        btn.disabled = isHere;
        btn.onclick = () => { if (LS.driveQashqaiTo) LS.driveQashqaiTo(wid); };
        row.appendChild(btn);
        list.appendChild(row);
      });
    }
    const m = document.getElementById('qashqai-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openEateryModal = function () {
    LS.runtime.modalOpen = true;
    const leader = LS.getLeaderName ? LS.getLeaderName() : 'Laila';
    const eg = document.getElementById('eatery-greeting');
    if (eg) eg.textContent = '“Ahlan ' + leader + '! Sit together at our warm family table — what sounds yummy today?”';
    const msg = document.getElementById('eatery-msg');
    if (msg) msg.textContent = '';
    const m = document.getElementById('eatery-modal');
    if (m) m.classList.remove('hidden');
    document.querySelectorAll('.btn-eatery-order').forEach(btn => {
      btn.onclick = () => {
        const key = btn.getAttribute('data-dish');
        const catalog = {
          molokhia_chicken: { name: 'Rice, Molokhia & Roasted Chicken 🍲🍗', cost: 25, xp: 24, short: 'Molokhia⚡' },
          eatery_pasta: { name: 'Creamy Eatery Pasta 🍝', cost: 20, xp: 18, short: 'Pasta⚡' }
        };
        const item = catalog[key];
        if (!item) return;
        if (LS.state.coins < item.cost) {
          if (msg) msg.textContent = 'Not enough coins (' + item.cost + 'c)! Play Cosmo City games or take a quiz.';
          LS.playSFX('wrong'); return;
        }
        LS.addCoins(-item.cost);
        LS.addXP(item.xp);
        LS.runtime.stamina = 100;
        LS.runtime.buff = { name: item.name, short: item.short, speedMult: 1.28, infiniteStamina: true, expiresAt: Date.now() + 120000 };
        LS.unlockStamp('dest_eatery');
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.closeAllModals();
        const cfg = LS.activeWorld && LS.activeWorld.diningConfigs && LS.activeWorld.diningConfigs.eatery_dining;
        if (cfg && LS.getScene) {
          LS.startEatingAnimation(LS.getScene(), key, item.name, cfg);
        } else {
          LS.showToast('🍲 Enjoyed ' + item.name + ' (+' + item.xp + ' XP)!');
        }
      };
    });
  };

  LS.openYiwanModal = function () {
    LS.runtime.modalOpen = true;
    const leader = LS.getLeaderName ? LS.getLeaderName() : 'Laila';
    const yg = document.getElementById('yiwan-greeting');
    if (yg) yg.textContent = '“Welcome to Yiwan, ' + leader + '! Order a favorite dish or mix & match your own combination feast!”';
    const msg = document.getElementById('yiwan-msg');
    if (msg) msg.textContent = '';
    const m = document.getElementById('yiwan-modal');
    if (m) m.classList.remove('hidden');

    function orderYiwan(dishKey, dishName, cost, xp) {
      if (LS.state.coins < cost) {
        if (msg) msg.textContent = 'Not enough coins (' + cost + 'c)! Play at Cosmo City or take a quiz.';
        LS.playSFX('wrong'); return;
      }
      LS.addCoins(-cost);
      LS.addXP(xp);
      LS.runtime.stamina = 100;
      LS.runtime.buff = { name: dishName, short: 'Yiwan🥟', speedMult: 1.30, infiniteStamina: true, expiresAt: Date.now() + 120000 };
      LS.unlockStamp('dest_yiwan');
      if (LS.completeCozyMission) LS.completeCozyMission('meal');
      LS.closeAllModals();
      const cfg = LS.activeWorld && LS.activeWorld.diningConfigs && LS.activeWorld.diningConfigs.yiwan_dining;
      if (cfg && LS.getScene) {
        LS.startEatingAnimation(LS.getScene(), dishKey, dishName, cfg);
      } else {
        LS.showToast('🥟 Enjoyed ' + dishName + ' (+' + xp + ' XP)!');
      }
    }

    document.querySelectorAll('.btn-yiwan-single').forEach(btn => {
      btn.onclick = () => {
        const k = btn.getAttribute('data-dish');
        const map = {
          yiwan_dumplings: ['Steamed & Crispy Dumplings 🥟', 20, 18],
          yiwan_sweet_sour: ['Sweet & Sour Chicken 🍗🍍', 24, 22],
          yiwan_rice: ['Fluffy Steamed Jasmine Rice 🍚', 15, 14]
        };
        if (map[k]) orderYiwan(k, map[k][0], map[k][1], map[k][2]);
      };
    });

    const comboBtn = document.getElementById('btn-yiwan-combo');
    if (comboBtn) {
      comboBtn.onclick = () => {
        const hasD = document.getElementById('chk-yiwan-dumplings') && document.getElementById('chk-yiwan-dumplings').checked;
        const hasS = document.getElementById('chk-yiwan-sweet') && document.getElementById('chk-yiwan-sweet').checked;
        const hasR = document.getElementById('chk-yiwan-rice') && document.getElementById('chk-yiwan-rice').checked;
        const parts = [];
        if (hasD) parts.push('Dumplings 🥟');
        if (hasS) parts.push('Sweet & Sour Chicken 🍗');
        if (hasR) parts.push('Jasmine Rice 🍚');
        if (parts.length === 0) {
          if (msg) msg.textContent = 'Pick at least one yummy item for your Yiwan combination!';
          LS.playSFX('wrong'); return;
        }
        const key = parts.length > 1 ? 'yiwan_combo' : (hasD ? 'yiwan_dumplings' : (hasS ? 'yiwan_sweet_sour' : 'yiwan_rice'));
        orderYiwan(key, 'Yiwan Combo: ' + parts.join(' + '), 12 + parts.length * 8, 12 + parts.length * 9);
      };
    }
  };

  LS.openCosmoGameModal = function (gameType) {
    LS.runtime.modalOpen = true;
    if (cosmoGameTimer) { clearInterval(cosmoGameTimer); cosmoGameTimer = null; }
    if (cosmoClawRAF) { cancelAnimationFrame(cosmoClawRAF); cosmoClawRAF = null; }

    const titleEl = document.getElementById('cosmo-arcade-title');
    const subEl = document.getElementById('cosmo-arcade-sub');
    const stage = document.getElementById('cosmo-arcade-stage');
    const msgEl = document.getElementById('cosmo-arcade-msg');
    if (msgEl) msgEl.textContent = '';

    if (gameType === 'meteors') {
      if (titleEl) titleEl.textContent = '🛸 Cosmo City — Space Meteor Catcher';
      if (subEl) subEl.textContent = 'Tap as many glowing space stars & comets as you can in 15 seconds!';
      let score = 0, timeLeft = 15;
      stage.innerHTML =
        '<div class="tv-hud"><span id="cm-score">⭐ Stars: 0</span><span id="cm-time">⏱️ 15s</span></div>' +
        '<div id="cm-field" class="tv-playfield"></div>';
      const field = document.getElementById('cm-field');
      function spawnMeteor() {
        if (!field) return;
        field.innerHTML = '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tv-star-btn';
        btn.textContent = ['⭐', '☄️', '🌟', '🪐'][Math.floor(Math.random() * 4)];
        btn.style.left = (8 + Math.random() * 76) + '%';
        btn.style.top = (8 + Math.random() * 68) + '%';
        btn.onclick = () => {
          score += 1;
          LS.playTone(580 + score * 45, 0.12, 'triangle', 0.16);
          const sc = document.getElementById('cm-score');
          if (sc) sc.textContent = '⭐ Stars: ' + score;
          spawnMeteor();
        };
        field.appendChild(btn);
      }
      spawnMeteor();
      cosmoGameTimer = setInterval(() => {
        timeLeft -= 1;
        const tm = document.getElementById('cm-time');
        if (tm) tm.textContent = '⏱️ ' + timeLeft + 's';
        if (timeLeft <= 0) {
          clearInterval(cosmoGameTimer); cosmoGameTimer = null;
          const rewardC = 15 + score * 4;
          const rewardX = 15 + score * 3;
          LS.addCoins(rewardC); LS.addXP(rewardX);
          LS.unlockStamp('dest_cosmo');
          if (LS.completeCozyMission) LS.completeCozyMission('play');
          LS.playSFX('correct');
          stage.innerHTML = '<div class="tv-done">🚀 Cosmo High Score! Caught <strong>' + score + '</strong> Space Stars!<br />Won <strong>+' + rewardC + 'c</strong> &amp; <strong>+' + rewardX + ' XP</strong>!</div>';
        }
      }, 1000);
    } else if (gameType === 'memory') {
      if (titleEl) titleEl.textContent = '🎨 Cosmo City — Cosmic Color Memory';
      if (subEl) subEl.textContent = 'Watch the glowing alien pads flash, then tap the exact same colors!';
      const pads = [
        { id: 0, label: '🌸 Pink', color: '#ec4899', freq: 523.25 },
        { id: 1, label: '💎 Cyan', color: '#06b6d4', freq: 659.25 },
        { id: 2, label: '⭐ Gold', color: '#eab308', freq: 783.99 },
        { id: 3, label: '🍀 Mint', color: '#22c55e', freq: 880.00 }
      ];
      let seq = [], userIdx = 0, round = 1, locked = true;
      stage.innerHTML =
        '<div class="tv-hud"><span id="mem-round">Round 1 / 3</span><span id="mem-status">Watch carefully...</span></div>' +
        '<div class="cosmo-mem-grid">' +
        pads.map(p => '<button type="button" class="cosmo-mem-pad" data-pad="' + p.id + '" style="background:' + p.color + '">' + p.label + '</button>').join('') +
        '</div>';

      function flashPad(id, delay) {
        setTimeout(() => {
          const el = stage.querySelector('.cosmo-mem-pad[data-pad="' + id + '"]');
          if (!el) return;
          el.classList.add('lit');
          LS.playTone(pads[id].freq, 0.22, 'sine', 0.18);
          setTimeout(() => el.classList.remove('lit'), 320);
        }, delay);
      }

      function startRound() {
        locked = true;
        userIdx = 0;
        seq.push(Math.floor(Math.random() * 4));
        if (round === 1) seq.push(Math.floor(Math.random() * 4));
        const rd = document.getElementById('mem-round');
        const st = document.getElementById('mem-status');
        if (rd) rd.textContent = 'Round ' + round + ' / 3';
        if (st) st.textContent = '👀 Watch the pattern...';
        seq.forEach((pId, i) => flashPad(pId, 450 + i * 520));
        setTimeout(() => {
          locked = false;
          if (st) st.textContent = '✨ Your turn! Tap it back!';
        }, 550 + seq.length * 520);
      }

      stage.querySelectorAll('.cosmo-mem-pad').forEach(btn => {
        btn.onclick = () => {
          if (locked) return;
          const id = parseInt(btn.getAttribute('data-pad'), 10);
          btn.classList.add('lit');
          setTimeout(() => btn.classList.remove('lit'), 200);
          LS.playTone(pads[id].freq, 0.16, 'sine', 0.16);
          if (id === seq[userIdx]) {
            userIdx += 1;
            if (userIdx >= seq.length) {
              if (round >= 3) {
                locked = true;
                LS.addCoins(40); LS.addXP(32);
                LS.unlockStamp('dest_cosmo');
                if (LS.completeCozyMission) LS.completeCozyMission('play');
                LS.playSFX('correct');
                stage.innerHTML = '<div class="tv-done">🎨🌟 Cosmic Memory Master!<br />Laila &amp; Salma won <strong>+40c</strong> &amp; <strong>+32 XP</strong>!</div>';
              } else {
                round += 1;
                startRound();
              }
            }
          } else {
            LS.playSFX('wrong');
            const st = document.getElementById('mem-status');
            if (st) st.textContent = 'Oops! Watch Round ' + round + ' again!';
            locked = true;
            userIdx = 0;
            seq.forEach((pId, i) => flashPad(pId, 500 + i * 520));
            setTimeout(() => { locked = false; if (st) st.textContent = '✨ Try again!'; }, 600 + seq.length * 520);
          }
        };
      });
      startRound();
    } else {
      // COSMO CLAW GRABBER!
      if (titleEl) titleEl.textContent = '🧸 Cosmo City — Cosmo Claw Grabber';
      if (subEl) subEl.textContent = 'Tap DROP CLAW when the crane swings right over the Golden Plushie!';
      stage.innerHTML =
        '<div class="claw-track">' +
          '<div class="claw-target">🧸✨</div>' +
          '<div id="claw-head" class="claw-head">🪝</div>' +
        '</div>' +
        '<button id="btn-drop-claw" class="btn-primary" style="margin-top:12px;width:100%;" type="button">🕹️ DROP CLAW NOW!</button>';
      let pos = 10, dir = 1, active = true;
      function stepClaw() {
        if (!active) return;
        pos += dir * 1.65;
        if (pos >= 90) { pos = 90; dir = -1; }
        if (pos <= 10) { pos = 10; dir = 1; }
        const head = document.getElementById('claw-head');
        if (head) head.style.left = pos + '%';
        cosmoClawRAF = requestAnimationFrame(stepClaw);
      }
      cosmoClawRAF = requestAnimationFrame(stepClaw);
      const dropBtn = document.getElementById('btn-drop-claw');
      if (dropBtn) {
        dropBtn.onclick = () => {
          if (!active) return;
          active = false;
          if (cosmoClawRAF) { cancelAnimationFrame(cosmoClawRAF); cosmoClawRAF = null; }
          const dist = Math.abs(pos - 50);
          const win = dist < 14;
          const coins = win ? 45 : 15;
          const xp = win ? 35 : 14;
          LS.addCoins(coins); LS.addXP(xp);
          LS.unlockStamp('dest_cosmo');
          if (LS.completeCozyMission) LS.completeCozyMission('play');
          LS.playSFX(win ? 'correct' : 'jump');
          if (msgEl) {
            msgEl.textContent = win
              ? '🎉 JACKPOT! Laila & Salma grabbed the Golden Cosmo Bear! (+45c, +35 XP!)'
              : '🧸 Nice try! Grabbed a mini Star Sticker! (+15c, +14 XP — tap to try again!)';
          }
          dropBtn.textContent = '🔄 Play Claw Again';
          dropBtn.onclick = () => LS.openCosmoGameModal('claw');
        };
      }
    }

    const m = document.getElementById('cosmo-arcade-modal');
    if (m) m.classList.remove('hidden');
  };

  LS.openMaiLasagnaModal = function () {
    LS.runtime.modalOpen = true;
    const isSalma = !!(LS.state && LS.state.activeLeader === 'salma');
    const mg = document.getElementById('mai-lasagna-greeting');
    if (mg) {
      mg.innerHTML = isSalma
        ? '<strong>Mai smiles warmly:</strong> “Hi Salouma, I missed you! I just pulled hot, cheesy homemade lasagna out of the oven — would you like to have some?”'
        : '<strong>Mai smiles warmly:</strong> “Hi Lailouta, I made you your favorite food! I just pulled hot, cheesy homemade lasagna out of the oven — would you like to have some?”';
    }
    const m = document.getElementById('mai-lasagna-modal');
    if (m) m.classList.remove('hidden');
    const yesBtn = document.getElementById('btn-yes-lasagna');
    if (yesBtn) {
      yesBtn.onclick = () => {
        LS.addCoins(15);
        LS.addXP(24);
        LS.runtime.stamina = 100;
        LS.runtime.buff = { name: "Mai's Homemade Lasagna", short: 'Lasagna🧀', speedMult: 1.30, infiniteStamina: true, expiresAt: Date.now() + 140000 };
        LS.unlockStamp('dest_mai_mostafa');
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.closeAllModals();
        const cfg = LS.activeWorld && LS.activeWorld.diningConfigs && LS.activeWorld.diningConfigs.mai_dining;
        if (cfg && LS.getScene) {
          LS.startEatingAnimation(LS.getScene(), 'mai_lasagna', "Mai's Homemade Lasagna 🧀🍝", cfg);
        } else {
          LS.showToast("🧀🍝 Yummy! Mai's warm homemade lasagna is the best! +15c & +24 XP!");
        }
      };
    }
  };

  LS.openBoardGameModal = function () {
    LS.runtime.modalOpen = true;
    const players = [
      { name: 'Laila', emoji: '👧', color: '#ec4899', pos: 0 },
      { name: 'Salma', emoji: '🧒', color: '#f59e0b', pos: 0 },
      { name: 'Nouzi', emoji: '🤸‍♀️', color: '#a855f7', pos: 0 },
      { name: 'Bibo', emoji: '🚗', color: '#3b82f6', pos: 0 }
    ];
    const GOAL = 15;
    let turn = 0;
    let finished = false;

    const boardEl = document.getElementById('bg-grid');
    const logEl = document.getElementById('bg-log');
    const rollBtn = document.getElementById('btn-roll-dice');

    function renderBoard() {
      if (!boardEl) return;
      boardEl.innerHTML = '';
      for (let i = 0; i <= GOAL; i++) {
        const cell = document.createElement('div');
        const isStar = (i === 4 || i === 9 || i === 12);
        const isGoal = i === GOAL;
        cell.className = 'bg-tile' + (isStar ? ' star-tile' : '') + (isGoal ? ' goal-tile' : '');
        const here = players.filter(p => p.pos === i).map(p => '<span class="bg-token" style="background:' + p.color + '">' + p.emoji + '</span>').join('');
        cell.innerHTML = '<div class="bg-num">' + (isGoal ? '🏆' : (isStar ? '⭐' : (i === 0 ? 'START' : i))) + '</div><div class="bg-tokens">' + here + '</div>';
        boardEl.appendChild(cell);
      }
      if (rollBtn && !finished) {
        const cur = players[turn];
        rollBtn.textContent = '🎲 Roll for ' + cur.emoji + ' ' + cur.name + '!';
        rollBtn.disabled = false;
      }
    }

    if (logEl) logEl.textContent = '🎲 All 4 kids — Laila, Salma, Nouzi & Bibo — are ready! Tap to roll the dice!';
    renderBoard();

    if (rollBtn) {
      rollBtn.onclick = () => {
        if (finished) {
          LS.openBoardGameModal();
          return;
        }
        const p = players[turn];
        const roll = 1 + Math.floor(Math.random() * 6);
        LS.playTone(460 + roll * 65, 0.14, 'triangle', 0.16);
        p.pos = Math.min(GOAL, p.pos + roll);
        let extra = '';
        if (p.pos === 4 || p.pos === 9 || p.pos === 12) {
          p.pos = Math.min(GOAL, p.pos + 2);
          extra = ' ⭐ Star Boost +2!';
        }
        if (p.pos >= GOAL) {
          finished = true;
          LS.addCoins(35); LS.addXP(30);
          LS.unlockStamp('dest_mai_mostafa');
          if (LS.completeCozyMission) LS.completeCozyMission('play');
          LS.playSFX('correct');
          if (logEl) logEl.innerHTML = '🏆 <strong>' + p.emoji + ' ' + p.name + ' rolled a ' + roll + ' and reached the Trophy!</strong> High-fives all around for Laila, Salma, Nouzi &amp; Bibo! (+35c &amp; +30 XP!)';
          rollBtn.textContent = '🔄 Play Another Round!';
        } else {
          if (logEl) logEl.textContent = p.emoji + ' ' + p.name + ' rolled a ' + roll + ' → Space ' + p.pos + '!' + extra;
          turn = (turn + 1) % players.length;
        }
        renderBoard();
      };
    }

    const m = document.getElementById('board-game-modal');
    if (m) m.classList.remove('hidden');
  };

  // =========================================================================
  // NGSC SPORTS CLUB: LAILA'S SQUASH RALLY & LAILA + SALMA SWIMMING POOL!
  // =========================================================================
  LS.openNGSCModal = function (mode) {
    if (ngscTimer) { clearInterval(ngscTimer); ngscTimer = null; }
    LS.runtime.modalOpen = true;
    const titleEl = document.getElementById('ngsc-game-title');
    const subEl = document.getElementById('ngsc-game-sub');
    const stage = document.getElementById('ngsc-game-stage');
    const msg = document.getElementById('ngsc-game-msg');
    if (!stage) return;
    stage.innerHTML = '';
    if (msg) msg.textContent = '';

    if (mode === 'squash') {
      if (titleEl) titleEl.textContent = "🎾 NGSC — Laila's Squash Rally!";
      if (subEl) subEl.textContent = 'Tap Swing Racket when the squash ball rebounds into the green strike zone! Reach 6 hits to win!';
      let hits = 0;
      let ballPos = 10; // 0 = front wall, 100 = back glass
      let dir = 1;
      let won = false;

      stage.innerHTML =
        '<div style="background:linear-gradient(180deg,#f8fafc 0%,#e2e8f0 40%,#f0c98a 40%,#dfb06c 100%);border:2px solid #dc2626;border-radius:12px;padding:12px;position:relative;min-height:155px;">' +
        '<div style="text-align:center;font-weight:800;color:#dc2626;font-size:12px;letter-spacing:1px;border-bottom:2px solid #dc2626;padding-bottom:4px;">FRONT WALL • SERVICE LINE</div>' +
        '<div id="sq-ball" style="position:absolute;left:50%;top:36px;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;background:#1e293b;border:3px solid #facc15;box-shadow:0 3px 8px rgba(0,0,0,0.35);"></div>' +
        '<div style="position:absolute;left:12px;right:12px;bottom:14px;height:38px;border:2px dashed #16a34a;border-radius:10px;background:rgba(34,197,94,0.16);display:flex;align-items:center;justify-content:center;font-weight:800;color:#15803d;font-size:12px;">👧 Laila Strike Zone</div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;gap:10px;">' +
        '<strong id="sq-score">Rally: 0 / 6 🎾</strong>' +
        '<button id="btn-sq-swing" class="btn-primary" type="button">🎾 Swing Racket!</button>' +
        '</div>';

      const ballEl = document.getElementById('sq-ball');
      const scoreEl = document.getElementById('sq-score');
      const swingBtn = document.getElementById('btn-sq-swing');

      ngscTimer = setInterval(() => {
        if (!document.getElementById('ngsc-game-modal') || document.getElementById('ngsc-game-modal').classList.contains('hidden')) {
          clearInterval(ngscTimer); ngscTimer = null; return;
        }
        ballPos += dir * 6.5;
        if (ballPos >= 96) { ballPos = 96; dir = -1; }
        if (ballPos <= 12) { ballPos = 12; dir = 1; LS.playTone(360, 0.05, 'sine', 0.08); }
        if (ballEl) {
          ballEl.style.top = (28 + ballPos * 0.95) + 'px';
          ballEl.style.left = (50 + Math.sin(ballPos * 0.08) * 18) + '%';
        }
      }, 65);

      if (swingBtn) {
        swingBtn.onclick = () => {
          if (won) { LS.openNGSCModal('squash'); return; }
          if (ballPos >= 58) {
            hits++;
            dir = -1;
            ballPos = 54;
            LS.playSFX('coin');
            if (scoreEl) scoreEl.textContent = 'Rally: ' + hits + ' / 6 🎾';
            if (msg) msg.textContent = 'Great shot, Laila! 🔥';
            if (hits >= 6) {
              won = true;
              clearInterval(ngscTimer); ngscTimer = null;
              LS.addCoins(30); LS.addXP(28);
              LS.unlockStamp('dest_ngsc');
              if (LS.completeCozyMission) LS.completeCozyMission('play');
              LS.playSFX('correct');
              if (msg) msg.innerHTML = '🏆 <strong>Awesome Squash Match, Laila!</strong> Coach Karim cheers! (+30c &amp; +28 XP!)';
              swingBtn.textContent = '🔄 Play Another Rally!';
            }
          } else {
            LS.playSFX('wrong');
            if (msg) msg.textContent = 'Wait for the ball to enter Laila\'s green strike zone!';
          }
        };
      }
    } else {
      // SWIM MODE: Both Laila AND Salma swim side by side!
      if (titleEl) titleEl.textContent = '🏊‍♀️ NGSC Pool — Laila & Salma Swim!';
      if (subEl) subEl.textContent = 'Tap Swim Together to splash across the sparkling NGSC pool with Laila & Salma!';
      let lailaProg = 6, salmaProg = 6, done = false;

      stage.innerHTML =
        '<div style="background:linear-gradient(180deg,#0ea5e9 0%,#0284c7 100%);border:3px solid #e0f2fe;border-radius:14px;padding:14px;color:#fff;">' +
        '<div style="margin-bottom:12px;">' +
        '<div style="font-size:12px;font-weight:800;margin-bottom:4px;">Lane 1 — 👧 Laila Swimming!</div>' +
        '<div style="position:relative;height:28px;background:rgba(255,255,255,0.22);border-radius:14px;overflow:hidden;">' +
        '<div id="swim-laila-bar" style="height:100%;width:6%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:14px;transition:width 0.16s;"></div>' +
        '<span id="swim-laila-ico" style="position:absolute;top:2px;left:6%;font-size:18px;transition:left 0.16s;">🏊‍♀️</span>' +
        '</div></div>' +
        '<div style="border-top:3px dashed rgba(239,68,68,0.8);margin:8px 0 10px;"></div>' +
        '<div>' +
        '<div style="font-size:12px;font-weight:800;margin-bottom:4px;">Lane 2 — 🧒 Salma Swimming!</div>' +
        '<div style="position:relative;height:28px;background:rgba(255,255,255,0.22);border-radius:14px;overflow:hidden;">' +
        '<div id="swim-salma-bar" style="height:100%;width:6%;background:linear-gradient(90deg,#facc15,#fb923c);border-radius:14px;transition:width 0.16s;"></div>' +
        '<span id="swim-salma-ico" style="position:absolute;top:2px;left:6%;font-size:18px;transition:left 0.16s;">🏊‍♀️</span>' +
        '</div></div>' +
        '</div>' +
        '<div style="text-align:center;margin-top:12px;">' +
        '<button id="btn-ngsc-stroke" class="btn-primary" type="button">💦 Swim &amp; Splash Together! (Laila &amp; Salma)</button>' +
        '</div>';

      const btn = document.getElementById('btn-ngsc-stroke');
      const lBar = document.getElementById('swim-laila-bar');
      const lIco = document.getElementById('swim-laila-ico');
      const sBar = document.getElementById('swim-salma-bar');
      const sIco = document.getElementById('swim-salma-ico');

      if (btn) {
        btn.onclick = () => {
          if (done) { LS.openNGSCModal('swim'); return; }
          lailaProg = Math.min(100, lailaProg + 14 + Math.floor(Math.random() * 6));
          salmaProg = Math.min(100, salmaProg + 14 + Math.floor(Math.random() * 6));
          LS.playTone(520 + lailaProg * 2.5, 0.10, 'sine', 0.12);
          if (lBar) lBar.style.width = lailaProg + '%';
          if (lIco) lIco.style.left = Math.min(88, lailaProg - 4) + '%';
          if (sBar) sBar.style.width = salmaProg + '%';
          if (sIco) sIco.style.left = Math.min(88, salmaProg - 4) + '%';
          if (msg) msg.textContent = 'Splash! Laila & Salma are swimming super fast! 💦';
          if (lailaProg >= 100 && salmaProg >= 100) {
            done = true;
            LS.addCoins(30); LS.addXP(28);
            LS.runtime.stamina = 100;
            LS.runtime.buff = { name: 'NGSC Swim Refresh', short: 'Swim💦', speedMult: 1.25, infiniteStamina: true, expiresAt: Date.now() + 90000 };
            LS.unlockStamp('dest_ngsc');
            if (LS.completeCozyMission) LS.completeCozyMission('play');
            LS.playSFX('correct');
            if (msg) msg.innerHTML = '🏆 <strong>Woohoo! Laila &amp; Salma finished their NGSC swim lap together!</strong> (+30c, +28 XP &amp; Swim Boost!)';
            btn.textContent = '🔄 Swim Another Lap!';
          }
        };
      }
    }

    const modal = document.getElementById('ngsc-game-modal');
    if (modal) modal.classList.remove('hidden');
  };

  // =========================================================================
  // WAVE 1 (AFRICA): ANCIENT EGYPT & MARRAKECH INTERACTIVE MINI-GAMES!
  // =========================================================================
  LS.openWave1Activity = function (actId) {
    LS.runtime.modalOpen = true;
    const titleEl = document.getElementById('wave1-game-title');
    const subEl = document.getElementById('wave1-game-sub');
    const stage = document.getElementById('wave1-game-stage');
    const msg = document.getElementById('wave1-game-msg');
    if (!stage) return;
    stage.innerHTML = '';
    if (msg) msg.textContent = '';

    if (actId === 'egypt_hieroglyphs') {
      if (titleEl) titleEl.textContent = '🔺 Temple Hieroglyph Code-Breaker';
      if (subEl) subEl.textContent = 'Tap the matching Egyptian hieroglyph symbols in order to unlock the Golden Chamber!';
      const symbols = [
        { s: '☀️', name: 'Sun (Ra)' },
        { s: '🌊', name: 'Nile Water' },
        { s: '🐱', name: 'Royal Cat' },
        { s: '🪷', name: 'Blue Lotus' }
      ];
      let step = 0;
      const render = () => {
        stage.innerHTML =
          '<div style="background:linear-gradient(180deg,#f3ddb0,#e2bd74);border:3px solid #1f4f94;border-radius:14px;padding:14px;text-align:center;">' +
          '<div style="font-size:13px;font-weight:800;color:#1f4f94;margin-bottom:8px;">CARVED TEMPLE CARTOUCHE:</div>' +
          '<div style="display:flex;justify-content:center;gap:10px;margin-bottom:14px;">' +
          symbols.map((it, idx) =>
            '<div style="width:54px;height:64px;border-radius:14px;border:2px solid ' + (idx < step ? '#16a34a' : (idx === step ? '#c84b31' : '#8a5a18')) +
            ';background:' + (idx < step ? '#dcfce7' : '#fff8e7') + ';display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:26px;">' +
            it.s + '<span style="font-size:9px;font-weight:700;color:#5c3a16;">' + (idx < step ? '✓' : (idx + 1)) + '</span></div>'
          ).join('') +
          '</div>' +
          '<div style="font-size:13px;font-weight:700;color:#5c2d16;margin-bottom:8px;">' +
          (step < symbols.length ? ('Find symbol #' + (step + 1) + ': <strong>' + symbols[step].name + '</strong>') : '✨ Golden Chamber Unlocked!') +
          '</div>' +
          '<div id="hiero-btns" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div></div>';
        const btnGrid = document.getElementById('hiero-btns');
        const shuffled = [symbols[2], symbols[0], symbols[3], symbols[1]];
        shuffled.forEach(item => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn-secondary';
          b.style.fontSize = '16px';
          b.textContent = item.s + ' ' + item.name;
          b.onclick = () => {
            if (step >= symbols.length) return;
            if (item.s === symbols[step].s) {
              step++;
              LS.playSFX('coin');
              if (msg) msg.textContent = '✨ Glowing match! The temple stone hums with golden light!';
              if (step >= symbols.length) {
                LS.addCoins(40); LS.addXP(32);
                LS.unlockStamp('egypt_hieroglyphs');
                LS.advanceStoryStep('egypt', 'egypt_hieroglyphs');
                if (LS.completeCozyMission) LS.completeCozyMission('play');
                LS.playSFX('correct');
                if (msg) msg.innerHTML = '🏆 <strong>Bravo, Laila &amp; Salma!</strong> You decoded the Royal Cartouche! (+40c &amp; +32 XP!)';
              }
              render();
            } else {
              LS.playSFX('wrong');
              if (msg) msg.textContent = 'Look closely at the next symbol: ' + symbols[step].name + '!';
            }
          };
          btnGrid.appendChild(b);
        });
      };
      render();
    } else if (actId === 'egypt_felucca') {
      if (titleEl) titleEl.textContent = '⛵ Nile Felucca Sailboat Voyage';
      if (subEl) subEl.textContent = 'Catch the Nile breeze to glide past lotus flowers & collect 6 Golden Scarabs!';
      let prog = 8, scarabs = 0, done = false;
      stage.innerHTML =
        '<div style="background:linear-gradient(180deg,#38bdf8 0%,#0f766e 100%);border:3px solid #f4c44e;border-radius:14px;padding:16px;color:#fff;">' +
        '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;margin-bottom:8px;">' +
        '<span>🪷 Shimmering Nile River</span><span id="fel-cnt">🪲 Scarabs: 0 / 6</span></div>' +
        '<div style="position:relative;height:42px;background:rgba(255,255,255,0.2);border-radius:20px;overflow:hidden;">' +
        '<div id="fel-bar" style="height:100%;width:8%;background:linear-gradient(90deg,#facc15,#fb923c);border-radius:20px;transition:width 0.18s;"></div>' +
        '<span id="fel-boat" style="position:absolute;top:5px;left:6%;font-size:26px;transition:left 0.18s;">⛵</span>' +
        '</div></div>' +
        '<div style="text-align:center;margin-top:12px;">' +
        '<button id="btn-fel-sail" class="btn-primary" type="button">💨 Catch the Nile Breeze!</button></div>';
      const btn = document.getElementById('btn-fel-sail');
      if (btn) {
        btn.onclick = () => {
          if (done) { LS.openWave1Activity('egypt_felucca'); return; }
          scarabs++;
          prog = Math.min(100, Math.round(8 + (scarabs / 6) * 92));
          LS.playTone(480 + scarabs * 55, 0.12, 'triangle', 0, 0.12);
          document.getElementById('fel-bar').style.width = prog + '%';
          document.getElementById('fel-boat').style.left = Math.min(86, prog - 6) + '%';
          document.getElementById('fel-cnt').textContent = '🪲 Scarabs: ' + scarabs + ' / 6';
          if (msg) msg.textContent = 'Whoosh! Sailing past blue Nile lotuses with Captain Tarek! 🪷';
          if (scarabs >= 6) {
            done = true;
            LS.addCoins(40); LS.addXP(32);
            LS.unlockStamp('egypt_felucca');
            LS.advanceStoryStep('egypt', 'egypt_felucca');
            if (LS.completeCozyMission) LS.completeCozyMission('play');
            LS.playSFX('correct');
            if (msg) msg.innerHTML = '🏆 <strong>Nile Felucca Captain!</strong> Laila &amp; Salma collected all 6 Golden Scarabs! (+40c &amp; +32 XP!)';
            btn.textContent = '🔄 Sail the Nile Again!';
          }
        };
      }
    } else if (actId === 'egypt_camel') {
      if (titleEl) titleEl.textContent = '🐪 Golden Oasis Camel Caravan';
      if (subEl) subEl.textContent = 'Guide Karim smiles: "Choose Habibi or Shams for a breezy sunset camel ride around the Date-Palm Oasis!"';
      stage.innerHTML =
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">' +
        '<button id="btn-cam-1" class="btn-primary" type="button">🐪 Ride Habibi (Crimson Saddle)</button>' +
        '<button id="btn-cam-2" class="btn-secondary" type="button">🐪 Ride Shams (Turquoise Saddle)</button></div>';
      const finishRide = (name) => {
        LS.addCoins(25); LS.addXP(22);
        LS.runtime.stamina = 100;
        LS.runtime.buff = { name: 'Oasis Camel Breeze', short: 'Camel🐪', speedMult: 1.28, infiniteStamina: true, expiresAt: Date.now() + 90000 };
        LS.playSFX('correct');
        if (msg) msg.innerHTML = '✨ <strong>Woohoo!</strong> Laila &amp; Salma rode ' + name + ' through the sunlit palm oasis! (+25c, +22 XP &amp; Speed Boost!)';
      };
      document.getElementById('btn-cam-1').onclick = () => finishRide('Habibi');
      document.getElementById('btn-cam-2').onclick = () => finishRide('Shams');
    } else if (actId === 'egypt_bakery') {
      if (titleEl) titleEl.textContent = "🍯 Nefertari's Ancient Bakery & Fruit Stall";
      if (subEl) subEl.textContent = 'Warm out of the clay oven! Choose a tasty Ancient Egyptian treat for Laila & Salma:';
      stage.innerHTML =
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
        '<button id="btn-eg-b1" class="btn-primary" type="button">🫓 Warm Honey-Date Aish Baladi Flatbread (+20c, +20 XP)</button>' +
        '<button id="btn-eg-b2" class="btn-secondary" type="button">🍷 Sweet Ruby Pomegranate &amp; Fig Juice (+20c, +20 XP)</button></div>';
      const serve = (dish) => {
        LS.addCoins(20); LS.addXP(20);
        LS.runtime.stamina = 100;
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.playSFX('correct');
        if (msg) msg.innerHTML = '😋 <strong>Yummy!</strong> Laila &amp; Salma shared ' + dish + '! Stamina 100% restored!';
      };
      document.getElementById('btn-eg-b1').onclick = () => serve('warm honey-date Aish Baladi');
      document.getElementById('btn-eg-b2').onclick = () => serve('sweet ruby pomegranate juice');
    } else if (actId === 'marrakech_lantern') {
      if (titleEl) titleEl.textContent = "🏮 Fatima's Stained-Glass Lantern Studio";
      if (subEl) subEl.textContent = 'Pick your jewel stained-glass color and pierced brass star pattern, then light up your lantern!';
      let glassCol = '#ffb703', glassName = 'Saffron Gold', pat = '⭐ 8-Point Star';
      const renderLantern = () => {
        stage.innerHTML =
          '<div style="background:linear-gradient(180deg,#25163a,#3d224f);border:3px solid #f4be44;border-radius:14px;padding:14px;text-align:center;color:#fff8e2;">' +
          '<div style="width:86px;height:112px;margin:0 auto 10px;border-radius:26px 26px 14px 14px;border:4px solid #e2ad3b;background:' + glassCol + ';box-shadow:0 0 28px ' + glassCol + ';display:flex;align-items:center;justify-content:center;font-size:34px;">' + pat.split(' ')[0] + '</div>' +
          '<div style="font-size:12px;margin-bottom:10px;">Glass: <strong>' + glassName + '</strong> • Pattern: <strong>' + pat + '</strong></div>' +
          '<div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:10px;">' +
          '<button class="btn-small" data-gc="#ffb703" data-gn="Saffron Gold">🟡 Saffron</button>' +
          '<button class="btn-small" data-gc="#fb5687" data-gn="Ruby Rose">🔴 Ruby</button>' +
          '<button class="btn-small" data-gc="#38bdf8" data-gn="Cobalt Sky">🔵 Cobalt</button>' +
          '<button class="btn-small" data-gc="#34d399" data-gn="Emerald Oasis">🟢 Emerald</button>' +
          '</div>' +
          '<div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' +
          '<button class="btn-small" data-pt="⭐ 8-Point Star">⭐ Star</button>' +
          '<button class="btn-small" data-pt="🌙 Crescent Moon">🌙 Moon</button>' +
          '<button class="btn-small" data-pt="💎 Zellige Diamond">💎 Diamond</button>' +
          '</div>' +
          '<button id="btn-light-lantern" class="btn-primary" type="button">✨ Light &amp; Hang Lantern in the Bazaar!</button></div>';
        stage.querySelectorAll('[data-gc]').forEach(b => {
          b.onclick = () => { glassCol = b.dataset.gc; glassName = b.dataset.gn; LS.playTone(620, 0.08, 'sine', 0, 0.09); renderLantern(); };
        });
        stage.querySelectorAll('[data-pt]').forEach(b => {
          b.onclick = () => { pat = b.dataset.pt; LS.playTone(720, 0.08, 'sine', 0, 0.09); renderLantern(); };
        });
        document.getElementById('btn-light-lantern').onclick = () => {
          LS.addCoins(40); LS.addXP(32);
          LS.unlockStamp('marrakech_lantern');
          LS.advanceStoryStep('marrakech', 'marrakech_lantern');
          if (LS.completeCozyMission) LS.completeCozyMission('play');
          LS.playSFX('correct');
          if (msg) msg.innerHTML = '🏮✨ <strong>Stunning!</strong> Your ' + glassName + ' ' + pat + ' lantern now glows above Marrakech! (+40c &amp; +32 XP!)';
        };
      };
      renderLantern();
    } else if (actId === 'marrakech_rug') {
      if (titleEl) titleEl.textContent = '🧶 Berber Mosaic Rug Pattern Matcher';
      if (subEl) subEl.textContent = 'Help Weaver Nadia finish the colorful diamond sequence on her Berber loom!';
      const seq = ['🟥', '🟨', '🟦', '🟥', '🟨', '❓'];
      stage.innerHTML =
        '<div style="background:#fdf3e0;border:3px solid #c83e37;border-radius:14px;padding:14px;text-align:center;">' +
        '<div style="font-size:28px;letter-spacing:8px;margin-bottom:12px;">' + seq.join(' ') + '</div>' +
        '<div style="font-size:13px;font-weight:700;color:#5c2d16;margin-bottom:10px;">Which woven tile completes the pattern?</div>' +
        '<div style="display:flex;justify-content:center;gap:10px;">' +
        '<button id="rug-opt-0" class="btn-secondary" style="font-size:20px;">🟥 Red</button>' +
        '<button id="rug-opt-1" class="btn-secondary" style="font-size:20px;">🟦 Blue</button>' +
        '<button id="rug-opt-2" class="btn-secondary" style="font-size:20px;">🟨 Gold</button></div></div>';
      document.getElementById('rug-opt-1').onclick = () => {
        LS.addCoins(35); LS.addXP(28);
        if (LS.completeCozyMission) LS.completeCozyMission('play');
        LS.playSFX('correct');
        if (msg) msg.innerHTML = '🎉 <strong>Perfect Pattern!</strong> Nadia weaves the 🟦 Cobalt Diamond right into the Berber rug! (+35c &amp; +28 XP!)';
      };
      ['rug-opt-0', 'rug-opt-2'].forEach(id => {
        document.getElementById(id).onclick = () => {
          LS.playSFX('wrong');
          if (msg) msg.textContent = 'Look at the repeating trio: Red, Gold, Blue — Red, Gold, ...!';
        };
      });
    } else if (actId === 'marrakech_tea') {
      if (titleEl) titleEl.textContent = '🫖 Riad Orange-Tree Mint Tea & Tagine';
      if (subEl) subEl.textContent = 'Tea Master Rashid lifts the silver teapot high to pour bubbly sweet mint tea! Pick your courtyard feast:';
      stage.innerHTML =
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
        '<button id="btn-mk-t1" class="btn-primary" type="button">🫖 High-Poured Sweet Moroccan Mint Tea &amp; Chebakia Honey Pastries</button>' +
        '<button id="btn-mk-t2" class="btn-secondary" type="button">🍲 Aromatic Chicken-Apricot Tagine &amp; Fluffy Golden Couscous</button></div>';
      const serveTea = (meal) => {
        LS.addCoins(30); LS.addXP(28);
        LS.runtime.stamina = 100;
        LS.runtime.buff = { name: 'Riad Mint Tea Refresh', short: 'Mint🫖', speedMult: 1.25, infiniteStamina: true, expiresAt: Date.now() + 90000 };
        LS.unlockStamp('marrakech_tea');
        LS.advanceStoryStep('marrakech', 'marrakech_tea');
        if (LS.completeCozyMission) LS.completeCozyMission('meal');
        LS.playSFX('correct');
        if (msg) msg.innerHTML = '🫖🍊 <strong>Bessaha!</strong> Laila &amp; Salma enjoyed ' + meal + ' under the orange trees! (+30c, +28 XP &amp; Speed Boost!)';
      };
      document.getElementById('btn-mk-t1').onclick = () => serveTea('high-poured sweet mint tea & honey pastries');
      document.getElementById('btn-mk-t2').onclick = () => serveTea('chicken-apricot Tagine & golden Couscous');
    } else if (actId === 'marrakech_drums') {
      if (titleEl) titleEl.textContent = '🥁 Jemaa el-Fnaa Evening Drum Circle';
      if (subEl) subEl.textContent = 'Tap the 3 colorful Moroccan drums to play 8 cheerful rhythm beats under the glowing lanterns!';
      let beats = 0, done = false;
      stage.innerHTML =
        '<div style="text-align:center;margin-bottom:10px;font-weight:800;" id="mk-drum-cnt">Rhythm Beats: 0 / 8 🥁</div>' +
        '<div style="display:flex;justify-content:center;gap:10px;">' +
        '<button class="btn-primary mk-d" data-f="220" type="button">🥁 Dum (Deep)</button>' +
        '<button class="btn-secondary mk-d" data-f="392" type="button">🪘 Tak (Bright)</button>' +
        '<button class="btn-secondary mk-d" data-f="523" type="button">✨ Ka (Sparkle)</button></div>';
      stage.querySelectorAll('.mk-d').forEach(b => {
        b.onclick = () => {
          LS.playTone(Number(b.dataset.f), 0.14, 'triangle', 0, 0.14);
          if (done) return;
          beats++;
          document.getElementById('mk-drum-cnt').textContent = 'Rhythm Beats: ' + beats + ' / 8 🥁';
          if (msg) msg.textContent = 'The whole Marrakech bazaar claps along to your beat! ✨';
          if (beats >= 8) {
            done = true;
            LS.addCoins(30); LS.addXP(26);
            if (LS.completeCozyMission) LS.completeCozyMission('music');
            LS.playSFX('correct');
            if (msg) msg.innerHTML = '🎶🏆 <strong>Amazing Moroccan Rhythm, Laila &amp; Salma!</strong> Storyteller Hassan cheers! (+30c &amp; +26 XP!)';
          }
        };
      });
    }

    const modal = document.getElementById('wave1-game-modal');
    if (modal) modal.classList.remove('hidden');
  };
})(window.LailaSalma);
