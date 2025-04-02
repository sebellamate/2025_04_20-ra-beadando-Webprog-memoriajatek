document.getElementById('adatok-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Adatok bekérése
    const nev = document.getElementById('nev').value;
    const kor = document.getElementById('kor').value;
    const email = document.getElementById('email').value;

    // Adatok validálása
    if (nev && kor && email) {
        // Adatok elmentése localStorage-ba
        localStorage.setItem('nev', nev);
        localStorage.setItem('kor', kor);
        localStorage.setItem('email', email);

        // Átirányítás a szintválasztó oldalra
        window.location.href = "szint-index.html";  // Átirányítás a szintválasztás oldalra
    } else {
        alert("Kérlek, töltsd ki az összes mezőt!");
    }
});


// A felhasználói adatokat a localStorage-ból töltjük be
const user = {
    nev: localStorage.getItem('nev'),
    kor: localStorage.getItem('kor'),
    email: localStorage.getItem('email')
};

console.log(`Felhasználó adatai: ${user.nev}, ${user.kor}, ${user.email}`);

// A játék szintjének választása
function startGame(level) {
    console.log(`Játék kezdése ${level} szinten.`);
    document.getElementById('szint-valaszto').style.display = 'none';
    document.getElementById('jatek-ter').style.display = 'block';


    window.location.href = "jatek.html";
    // Kártyák generálása szinttől függően
    let numCards;
    if (level === 'easy') {
        numCards = 8; // Könnyű: 8 kártya (4 pár)
    } else if (level === 'medium') {
        numCards = 18; // Közepes: 18 kártya (9 pár)
    } else if (level === 'hard') {
        numCards = 32; // Nehéz: 32 kártya (16 pár)
    }

    createCards(numCards);
}

// Kártyák létrehozása és keverése
function createCards(numCards) {
    const kartyakContainer = document.getElementById('kartyak-container');
    const cardValues = [];
    const totalPairs = numCards / 2;

    // Kártya értékek generálása (párok)
    for (let i = 1; i <= totalPairs; i++) {
        cardValues.push(i);
        cardValues.push(i);
    }

    // Kártyák keverése
    shuffle(cardValues);

    // Kártyák megjelenítése
    kartyakContainer.innerHTML = ''; // Töröljük a régi kártyákat
    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('kartya');
        card.setAttribute('data-value', value);

        card.addEventListener('click', flipCard);
        kartyakContainer.appendChild(card);
    });
}



