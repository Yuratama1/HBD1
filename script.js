(() => {
    const el = {
      login: document.getElementById("login-screen"),
      game: document.getElementById("game-screen"),
      cake: document.getElementById("cake-screen"),
      surprise: document.getElementById("surprise-screen"),
      typing: document.getElementById("typing-text"),
      sig: document.getElementById("sig-text"),
      board: document.getElementById("game-board"),
      hearts: document.getElementById("hearts-container")
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
      
      // SVG hati biru persis seperti referensi gambar
      heart.innerHTML = `<svg viewBox="0 0 24 24" fill="#66a8ff" width="100%" height="100%">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`;
      
      // Ukuran acak antara 10px hingga 25px
      const size = Math.random() * 15 + 10;
      heart.style.width = size + "px";
      heart.style.height = size + "px";
      
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.animationDuration = Math.random() * 3 + 4 + "s"; // 4-7 detik
      
      // Opacity acak agar terlihat berdimensi seperti di screenshot
      heart.style.opacity = Math.random() * 0.5 + 0.3;
      
      el.hearts.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 7000);
    }
  
    setInterval(createHeart, 600); // Munculkan setiap 600ms
  
    // --- LOGIKA TOMBOL ---
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
  
    document.getElementById("btn-to-login").onclick = () => show("login-screen");
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
  
    // --- EFEK MENGETIK SURAT ---
    const message = `Selamat bertambah usia sayang 💙\n\nSemoga semua impianmu tercapai\ndan kamu selalu bahagia.\n\nSelamat juga sudah resmi menjadi Dokter Gigi! 🦷✨\n\nI love you ❤️`;
  
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
        }
      }
      type();
    }
  
  })();