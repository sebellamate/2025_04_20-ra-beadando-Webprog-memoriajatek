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
//------------------------------
// A felhasználói adatokat a localStorage-ból töltjük be
const user = {
    nev: localStorage.getItem('nev'),
    kor: localStorage.getItem('kor'),
    email: localStorage.getItem('email')
};

//const userDataElement = document.getElementById('felhasznalo-adatok');
/*if (user.nev && user.kor && user.email) {
    userDataElement.textContent = `Név: ${user.nev}, Életkor: ${user.kor}, E-mail: ${user.email}`;
}*/
//----------------------------------
function startGame(level) {
        // Tároljuk a szintet localStorage-ban
        localStorage.setItem('level', level);
        
        // Átirányítjuk a játék oldalra
        window.location.href = "jatek-index.html";
        console.log(`Játék kezdése ${level} szinten.`);
    
    // Kártyák generálása szinttől függően
    let numCards;
    if (level === 'easy') {
        numCards = 8; // Könnyű: 8 kártya (4 pár)
    } else if (level === 'medium') {
        numCards = 18; // Közepes: 18 kártya (9 pár)
    } else if (level === 'hard') {
        numCards = 32; // Nehéz: 32 kártya (16 pár)
    }

    // Kártyák generálása
    createCards(numCards);
}
//-------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Beolvassuk a szintet a localStorage-ból
    const level = localStorage.getItem('level');
    let numCards;
    let cardData = [];

    // A szinttől függően meghatározzuk a kártyák számát
    if (level === 'easy') {
        numCards = 8;  
    } else if (level === 'medium') {
        numCards = 18; // Közepes: 18 kártya (9 pár)
    } else if (level === 'hard') {
        numCards = 32; // Nehéz: 32 kártya (16 pár)
    }

    // Kártyák adatainak generálása (párok)
    for (let i = 1; i <= numCards / 2; i++) {
        cardData.push({ value: i, flipped: false });
        cardData.push({ value: i, flipped: false });
    }

    // Kártyák keverése
    shuffle(cardData);

    // Kártyák megjelenítése
    createCards(cardData);

    // Kártyák generálása és megjelenítése
    function createCards(cardData) {
        const kartyakContainer = document.getElementById('kartyak-container');
        kartyakContainer.innerHTML = ''; // Töröljük a régi kártyákat, ha vannak

        // Ha a kártyák üresek, ne folytassuk
        if (!cardData || cardData.length === 0) {
            console.error('Nincsenek kártyák!');
            return;
        }

        // Kártyák generálása
        cardData.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('kartya');
            cardElement.setAttribute('data-index', index);

            // Hozzáadjuk a kártyák megjelenítését
            cardElement.innerHTML = `
                <div class="kartya-ertek">${card.flipped ? card.value : ''}</div>
            `;
            cardElement.addEventListener('click', flipCard);
            kartyakContainer.appendChild(cardElement);
        });
    }

    // Kártyák keverése
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // swap elements
        }
    }

});
