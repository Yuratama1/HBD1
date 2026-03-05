// === 1. KONFIGURASI LOGIN ===
const NAMA_BENAR = "afiqoh hesti qurrotu'aini";
const TGL_BENAR = "2006-03-06";

function validasiAkses() {
    const inputNamaValue = document.getElementById('inputNama').value.toLowerCase().trim();
    const inputDateValue = document.getElementById('inputDate').value;
    const errorMsg = document.getElementById('error-msg');

    if (inputNamaValue.includes("afiqoh") && inputDateValue === TGL_BENAR) {
        errorMsg.style.display = 'none';
        mulaiGame(); // Lanjut ke Game
    } else {
        errorMsg.style.display = 'block';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
    }
}

// === 2. LOGIKA MEMORY GAME ===
const emojis = ['💖', '🤍', '🩷', '🎉', '❤️', '🎂'];
let cardsArray = [...emojis, ...emojis]; // Gandakan jadi 12 kartu
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCount = 0;

function mulaiGame() {
    // Sembunyikan login, Munculkan Game
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'flex';
    
    // Ubah background jadi gelap ala malam hari
    document.body.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';

    setupBoard();
}

function setupBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Bersihkan papan
    matchCount = 0;

    // Acak urutan kartu
    cardsArray.sort(() => 0.5 - Math.random());

    // Buat elemen HTML untuk tiap kartu
    cardsArray.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="front-face"></div>
            <div class="back-face">${emoji}</div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // Jangan biarkan klik kartu yang sama 2x

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Klik pertama
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Klik kedua
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        disableCards();
        matchCount++;
        // Jika semua 6 pasang cocok, lanjut ke kejutan!
        if (matchCount === 6) {
            setTimeout(tampilkanKue, 1000);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true; // Kunci papan agar tidak bisa klik kartu lain dulu
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000); // Tunggu 1 detik lalu tutup lagi
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// === 3. LOGIKA KUE & KEJUTAN ===
function tampilkanKue() {
    document.getElementById('game-page').style.display = 'none';
    document.getElementById('surprise-page').style.display = 'block';
}

function tiupLilin() {
    // Sembunyikan tombol
    document.getElementById('btn-tiup').style.display = 'none';
    
    // Munculkan teks dan dekorasi balon/kembang api
    document.getElementById('surprise-text').style.display = 'block';
    document.getElementById('decorations').style.display = 'block';
    
    // Efek kue membesar sedikit
    const kue = document.getElementById('kue-ultah');
    kue.style.transform = 'scale(1.2)';
    kue.style.animation = 'none'; // Hentikan efek mengambang biar fokus ke tengah
}