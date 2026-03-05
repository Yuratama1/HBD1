// script.js — versi final: pastel biru, tulip, flip kartu diperbaiki, cake SVG, dan ucapan custom
(() => {
    const pairedEmojis = ['💖','🎁','🌸','🎀']; // 4 pairs
    const specialCard = '🦷'; // kartu spesial (sesuai ucapan Dokter Gigi)
    let firstCard = null, secondCard = null, lockBoard = false, matchedPairs = 0;
    let heartsInterval = null, loginConfettiInterval = null;
  
    const el = {
      loginScreen: document.getElementById('login-screen'),
      gameScreen: document.getElementById('game-screen'),
      cakeScreen: document.getElementById('cake-screen'),
      surpriseScreen: document.getElementById('surprise-screen'),
      gameBoard: document.getElementById('game-board'),
      bgMusic: document.getElementById('bg-music'),
      typingText: document.getElementById('typing-text'),
      sigText: document.getElementById('sig-text'),
      heartsContainer: document.getElementById('hearts-container')
    };
  
    // safe confetti
    function doConfetti(opts = {}) {
      try { if (typeof confetti === 'function') confetti(opts); } catch(e) {}
    }
  
    // UI: switch screen (show only one)
    function switchScreen(showId) {
      ['login-screen','game-screen','cake-screen','surprise-screen'].forEach(id => {
        const s = document.getElementById(id);
        if (!s) return;
        if (s.id === showId) s.classList.add('active');
        else s.classList.remove('active');
      });
    }
  
    // shuffle
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    // hearts floating
    function startHearts() {
      if (heartsInterval) return;
      heartsInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.min(Math.max(4, Math.random() * 92), 92) + 'vw';
        heart.style.fontSize = (Math.random() * 26 + 12) + 'px';
        heart.innerText = '💙'; // gunakan hati biru untuk tema
        el.heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 4500);
      }, 520);
    }
    function stopHearts() {
      if (heartsInterval) { clearInterval(heartsInterval); heartsInterval = null; }
    }
  
    // login confetti loop
    function startLoginConfetti() {
      if (loginConfettiInterval) return;
      loginConfettiInterval = setInterval(() => {
        doConfetti({ particleCount: 6, angle: 60, spread: 45, origin: { x: 0.08 }, colors: ['#7db7ff','#cfe9ff','#ffffff'] });
        doConfetti({ particleCount: 6, angle: 120, spread: 45, origin: { x: 0.92 }, colors: ['#7db7ff','#cfe9ff','#ffffff'] });
      }, 800);
    }
    function stopLoginConfetti() {
      if (loginConfettiInterval) { clearInterval(loginConfettiInterval); loginConfettiInterval = null; }
    }
  
    // login handling
    function checkLogin() {
      const nama = (document.getElementById('nama')?.value || '').trim();
      const tanggal = (document.getElementById('tanggal')?.value || '').trim();
      if (!nama || !tanggal) {
        alert('Isi dulu nama & tanggal ya sayang 💙');
        return;
      }
      stopLoginConfetti();
      if (el.bgMusic) {
        el.bgMusic.currentTime = 0;
        el.bgMusic.play().catch(()=> {
          // fallback: play after click
          const startOnClick = () => { el.bgMusic.play().catch(()=>{}); document.removeEventListener('click', startOnClick); };
          document.addEventListener('click', startOnClick, { once: true });
        });
      }
      switchScreen('game-screen');
      startHearts();
      initGame();
    }
  
    // init game: build cards with flip structure
    function initGame() {
      matchedPairs = 0;
      firstCard = null; secondCard = null; lockBoard = false;
      const board = el.gameBoard;
      board.innerHTML = '';
  
      let cards = [...pairedEmojis, ...pairedEmojis, specialCard];
      shuffle(cards);
  
      cards.forEach((emoji, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'memory-card';
        btn.setAttribute('data-emoji', emoji);
        btn.setAttribute('aria-label', 'kartu tertutup');
  
        // inner structure for flip
        const inner = document.createElement('div');
        inner.className = 'card-inner';
  
        const front = document.createElement('div');
        front.className = 'card-face card-front';
        front.innerHTML = `<span aria-hidden="true">?</span>`;
  
        const back = document.createElement('div');
        back.className = 'card-face card-back';
        back.innerHTML = `<span aria-hidden="true">${emoji}</span>`;
  
        inner.appendChild(front);
        inner.appendChild(back);
        btn.appendChild(inner);
  
        // click handler
        btn.addEventListener('click', (e) => {
          // prevent click when locked or already flipped
          if (lockBoard) return;
          const thisInner = inner;
          if (thisInner.classList.contains('is-flipped')) return;
  
          // flip
          thisInner.classList.add('is-flipped');
  
          // special card -> go to cake
          if (emoji === specialCard) {
            doConfetti({ particleCount: 100, spread: 120, colors: ['#7db7ff','#cfe9ff','#ffffff'] });
            setTimeout(() => { switchScreen('cake-screen'); }, 420);
            return;
          }
  
          // normal flow matching
          if (!firstCard) {
            firstCard = { btn, emoji, inner: thisInner };
            return;
          }
  
          // prevent clicking the same physical card
          if (btn === firstCard.btn) return;
  
          secondCard = { btn, emoji, inner: thisInner };
          lockBoard = true;
  
          if (firstCard.emoji === secondCard.emoji) {
            // matched: disable both
            setTimeout(() => {
              firstCard.btn.disabled = true;
              secondCard.btn.disabled = true;
              matchedPairs++;
              resetBoardState();
              if (matchedPairs === pairedEmojis.length) {
                setTimeout(() => doConfetti({ particleCount: 140, spread: 140 }), 350);
              }
            }, 250);
          } else {
            // not matched: flip back
            setTimeout(() => {
              if (firstCard?.inner) firstCard.inner.classList.remove('is-flipped');
              if (secondCard?.inner) secondCard.inner.classList.remove('is-flipped');
              resetBoardState();
            }, 700);
          }
        });
  
        board.appendChild(btn);
      });
    }
  
    function resetBoardState() {
      firstCard = null; secondCard = null; lockBoard = false;
    }
  
    // blow candle -> confetti -> surprise -> typing message
    function blowCandle() {
      const cake = document.getElementById('cake-container');
      if (cake) { cake.style.transform = 'scale(0.96)'; setTimeout(()=> cake.style.transform = '', 260); }
      doConfetti({ particleCount:200, spread:170, colors: ['#7db7ff','#cfe9ff','#ffd36b'] });
      setTimeout(() => {
        switchScreen('surprise-screen');
        startTypingSequence();
      }, 750);
    }
  
    // the exact message you gave (can be edited)
    const customMessage = `Selamat bertambah usia, sayang! 💙
  
  Semoga di umur yang baru ini kamu selalu bahagia, sehat, dan semua impianmu terwujud. Kamu hebat sekali sudah sampai di titik ini. Aku bangga banget sama kamu!
  
  Selamat juga ya sudah resmi menjadi Dokter Gigi! Yeyeyyy! 🦷✨
  
  I love you! 🥰`;
  
    // typing effect (with preserved newlines)
    function startTypingSequence() {
      const text = customMessage;
      el.typingText.innerHTML = '';
      el.sigText.style.opacity = 0;
      let i = 0;
      function typeNext() {
        if (i < text.length) {
          const ch = text.charAt(i);
          el.typingText.innerHTML += (ch === '\n') ? '<br>' : ch;
          i++;
          setTimeout(typeNext, 28); // kecepatan ketik
        } else {
          el.sigText.style.opacity = 1;
        }
      }
      typeNext();
    }
  
    // events wiring
    function wireEvents() {
      document.getElementById('btn-masuk')?.addEventListener('click', checkLogin);
      document.getElementById('btn-restart-game')?.addEventListener('click', initGame);
      document.getElementById('btn-back-to-login')?.addEventListener('click', () => {
        switchScreen('login-screen'); stopHearts(); startLoginConfetti();
      });
      document.getElementById('btn-back-to-game')?.addEventListener('click', () => switchScreen('game-screen'));
      document.getElementById('btn-blow')?.addEventListener('click', blowCandle);
      document.getElementById('btn-play-again')?.addEventListener('click', () => { switchScreen('game-screen'); initGame(); startHearts(); });
      document.getElementById('btn-to-login')?.addEventListener('click', () => { switchScreen('login-screen'); stopHearts(); startLoginConfetti(); });
  
      // unlock music after first click if blocked
      const unlockMusic = () => {
        if (el.bgMusic && el.bgMusic.paused) { el.bgMusic.play().catch(()=>{}); }
        document.removeEventListener('click', unlockMusic);
      };
      document.addEventListener('click', unlockMusic, { once: true });
    }
  
    // start
    document.addEventListener('DOMContentLoaded', () => {
      startHearts();
      startLoginConfetti();
      wireEvents();
    });
  
    // expose some functions for debugging (optional)
    window.__birthdayApp = { initGame, blowCandle, switchScreen };
  })();