(() => {
    const el = {
      login: document.getElementById("login-screen"),
      game: document.getElementById("game-screen"),
      cake: document.getElementById("cake-screen"),
      surprise: document.getElementById("surprise-screen"),
      typing: document.getElementById("typing-text"),
      sig: document.getElementById("sig-text"),
      board: document.getElementById("game-board"),
      hearts: document.getElementById("hearts-container"),
      
      // Elemen tambahan untuk fitur Prank
      prankContainer: document.getElementById("prank-container"),
      btnSayang: document.getElementById("btn-sayang"),
      btnNggak: document.getElementById("btn-nggak")
    };
  
    function show(id) {
      ["login-screen", "game-screen", "cake-screen", "surprise-screen"].forEach(s => {
        document.getElementById(s).classList.remove("active");
      });
      document.getElementById(id).classList.add("active");
    }
  
    // --- EFEK BACKGROUND HATI VECTOR BIRU ---
    function createHeart() {
      const heart = document.createElement("div");
      heart.classList.add("heart-shape");
      
      heart.innerHTML = `<svg viewBox="0 0 24 24" fill="#66a8ff" width="100%" height="100%">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`;
      
      const size = Math.random() * 15 + 10;
      heart.style.width = size + "px";
      heart.style.height = size + "px";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.animationDuration = Math.random() * 3 + 4 + "s";
      heart.style.opacity = Math.random() * 0.5 + 0.3;
      
      el.hearts.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 7000);
    }
  
    setInterval(createHeart, 600);
  
    // --- LOGIKA TOMBOL MASUK ---
    document.getElementById("btn-masuk").onclick = () => {
      const nama = document.getElementById("nama").value;
      const tgl = document.getElementById("tanggal").value;
  
      if (!nama || !tgl) {
        alert("Isi nama dan tanggalnya dulu ya 💙");
        return;
      }
      
      document.getElementById("bg-music").play().catch(() => {});
      initGame();
      show("game-screen");
    };
  
    document.getElementById("btn-to-login").onclick = () => {
      show("login-screen");
      // Reset prank button saat kembali
      el.prankContainer.classList.remove("show");
      el.prankContainer.style.display = 'block';
      el.btnNggak.style.position = 'static'; 
    };
    
    document.getElementById("btn-restart-game").onclick = () => initGame();
  
    document.getElementById("btn-blow").onclick = () => {
      confetti({
        particleCount: 150,
        spread: 90,
        colors: ['#71b1fc', '#93c9ff', '#ffffff']
      });
  
      setTimeout(() => {
        show("surprise-screen");
        typing();
      }, 600);
    };
  
    // --- LOGIKA MEMORY GAME ---
    const basicEmojis = ["💙", "🎁", "🎉", "🧸"];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
  
    function initGame() {
      el.board.innerHTML = "";
      
      let gameEmojis = [...basicEmojis, ...basicEmojis, "🦷"];
      gameEmojis.sort(() => 0.5 - Math.random());
  
      gameEmojis.forEach(emoji => {
        const cardBtn = document.createElement("button");
        cardBtn.classList.add("memory-card");
        cardBtn.dataset.emoji = emoji;
        
        cardBtn.innerHTML = `
          <div class="card-inner">
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${emoji}</div>
          </div>
        `;
        
        cardBtn.addEventListener("click", flipCard);
        el.board.appendChild(cardBtn);
      });
  
      resetBoard();
    }
  
    function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;
  
      this.querySelector(".card-inner").classList.add("is-flipped");
  
      if (this.dataset.emoji === "🦷") {
        lockBoard = true;
        setTimeout(() => {
          show("cake-screen");
        }, 1000);
        return;
      }
  
      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }
  
      secondCard = this;
      checkForMatch();
    }
  
    function checkForMatch() {
      let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
      isMatch ? disableCards() : unflipCards();
    }
  
    function disableCards() {
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
      resetBoard();
    }
  
    function unflipCards() {
      lockBoard = true;
      setTimeout(() => {
        firstCard.querySelector(".card-inner").classList.remove("is-flipped");
        secondCard.querySelector(".card-inner").classList.remove("is-flipped");
        resetBoard();
      }, 1000);
    }
  
    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }
  
    // --- EFEK MENGETIK SURAT TERBARU ---
    const message = `Happy Birthday, cintaku 💙\n\nTerima kasih sudah hadir dan selalu jadi alasan senyumku setiap hari.\n\nSemoga kamu senantiasa sehat, dilapangkan rezekinya, dan dipermudah segala urusannya. Teruslah tumbuh menjadi wanita salihah yang selalu mengejar kebaikan dunia maupun akhirat.\n\nOh iya, ada satu hal lagi yang bikin aku bangga... Selamat ya, sudah resmi menjadi Dokter Gigi! 🦷✨\n\nI love you so much ❤️`;
  
    function typing() {
      let i = 0;
      el.typing.innerHTML = "";
      el.sig.style.opacity = 0;
  
      function type() {
        if (i < message.length) {
          const c = message.charAt(i);
          el.typing.innerHTML += (c === "\n") ? "<br>" : c;
          i++;
          setTimeout(type, 35);
        } else {
          el.sig.style.opacity = 1;
          
          // Memunculkan kotak prank setelah surat selesai (delay 1 detik)
          setTimeout(() => {
            el.prankContainer.classList.add("show");
          }, 1000);
        }
      }
      type();
    }
  
    // --- LOGIKA TOMBOL PRANK ---
    const moveNggakButton = () => {
      // Ubah posisi ke fixed agar terbang bebas di layar
      el.btnNggak.style.position = 'fixed';
      
      // Hitung area maksimal layar
      const maxX = window.innerWidth - el.btnNggak.offsetWidth - 20;
      const maxY = window.innerHeight - el.btnNggak.offsetHeight - 20;
      
      // Tentukan koordinat acak
      const randomX = Math.max(10, Math.floor(Math.random() * maxX));
      const randomY = Math.max(10, Math.floor(Math.random() * maxY));
      
      // Pindahkan tombol
      el.btnNggak.style.left = randomX + 'px';
      el.btnNggak.style.top = randomY + 'px';
    };
  
    // Kabur saat didekati mouse (laptop)
    el.btnNggak.addEventListener('mouseover', moveNggakButton);
    
    // Kabur saat disentuh jari (HP/Tablet)
    el.btnNggak.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Mencegah terklik di HP
      moveNggakButton();
    });
  
    // Jika klik tombol sayang
    el.btnSayang.addEventListener('click', () => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#ff66b2', '#ffffff'] // Warna merah muda/cinta
      });
      alert("Awww, aku juga sayang banget sama kamu! 💙 hehehe");
      
      // Sembunyikan bagian prank setelah sukses ditekan
      el.prankContainer.style.display = 'none';
    });
  
  })();