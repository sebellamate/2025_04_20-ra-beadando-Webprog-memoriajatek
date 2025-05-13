const KepekLista = [
  "axolt", "capibara", "golya", "kameleon", "lajhar", "lama", "macska", "mokus",
  "nyuszi", "oroszlan", "panda", "papagaj", "pava", "roka", "suni", "tehen"
];

let flippedCards = [];
let matchedCards = 0; 
let totalCards = 0; 
let timer = 0;
let interval = null;
let hibak = 0;
let hasznaltRevealOne = false;
let hasznaltRevealAll = false;

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("adatok-form")) {
    document.getElementById("adatok-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const nev = document.getElementById("nev").value;
      const kor = document.getElementById("kor").value;
      const email = document.getElementById("email").value;

      if (nev && kor && email) {
        localStorage.setItem("nev", nev);
        localStorage.setItem("kor", kor);
        localStorage.setItem("email", email);
        window.location.href = "szint-index.html";
      }
    });
  }

  if (document.getElementById("kartyak-lista")) {
    const level = localStorage.getItem("level");
    let cardCount = 8;

    if (level === "medium") cardCount = 12;
    if (level === "hard") cardCount = 16;

    totalCards = cardCount * 2;

    startTimer();
    generateCards(cardCount);
    addAbilityButtons();
  }

  const keresGomb = document.getElementById("kereses-gomb");
  const resetGomb = document.getElementById("reset-gomb");
  const emailInput = document.getElementById("email-kereses");
  const tablaBody = document.getElementById("statisztikak-tabla");


  if (keresGomb) {
    keresGomb.addEventListener("click", () => {
      const keresettEmail = emailInput.value.trim();
      if (!keresettEmail) {
        alert("Kérlek, add meg az email címet a kereséshez!");
        return;
      }

      const statok = JSON.parse(localStorage.getItem("statisztikak")) || [];
      const talalatok = statok.filter((stat) => stat.email === keresettEmail);

      tablaBody.innerHTML = ""; 
      if (talalatok.length > 0) {
        talalatok.forEach((stat) => {
          const sor = document.createElement("tr");
          sor.innerHTML = `
            <td>${stat.email}</td>
            <td>${stat.kor}</td>
            <td>${stat.szint}</td>
            <td>${stat.ido}</td>
            <td>${stat.hibak}</td>
            <td>${stat.datum}</td>
          `;
          tablaBody.appendChild(sor);
        });
      } else {
        alert("Nincs találat az adott email címre!");
      }
    });
  }

  // statisztikak megjelenítése
  if (resetGomb) {
    resetGomb.addEventListener("click", () => {
      const statok = JSON.parse(localStorage.getItem("statisztikak")) || [];
      tablaBody.innerHTML = ""; // Táblázat ürítése
      statok.forEach((stat) => {
        const sor = document.createElement("tr");
        sor.innerHTML = `
          <td>${stat.email}</td>
          <td>${stat.kor}</td>
          <td>${stat.szint}</td>
          <td>${stat.ido}</td>
          <td>${stat.hibak}</td>
          <td>${stat.datum}</td>
        `;
        tablaBody.appendChild(sor);
      });
    });
  }
});

function startGame(level) {
  localStorage.setItem("level", level);
  window.location.href = "jatek-index.html";
}

// Kártyák generálása
function generateCards(count) {
  const images = shuffle([...KepekLista.slice(0, count), ...KepekLista.slice(0, count)]);
  const ul = document.getElementById("kartyak-lista");
  ul.innerHTML = "";

  images.forEach((img) => {
    const li = document.createElement("li");
    li.classList.add("kartya");
    li.innerHTML = `
      <div class="kartya-elso"><img src="kepek/${img}.jpg" class="kartya-ertek" /></div>
      <div class="kartya-hatul">?</div>
    `;
    ul.appendChild(li);
  });

  document.querySelectorAll(".kartya").forEach((card) => card.classList.add("flipped"));
  setTimeout(() => {
    document.querySelectorAll(".kartya").forEach((card) => card.classList.remove("flipped"));
  }, 4000);

  ul.addEventListener("click", function (e) {
    const card = e.target.closest(".kartya");
    if (!card || card.classList.contains("flipped") || card.classList.contains("matched") || flippedCards.length >= 2) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  });
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const img1 = card1.querySelector("img").src;
  const img2 = card2.querySelector("img").src;

  if (img1 === img2) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedCards += 2;
  } else {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    hibak++;
    document.getElementById("hibak").textContent = hibak;
  }

  flippedCards = [];

  if (matchedCards === totalCards) {
    clearInterval(interval);
    saveStats();
    endGame();
  }
}

function endGame() {
  const endGameContainer = document.createElement("div");
  endGameContainer.id = "end-game-container";

  const message = document.createElement("h2");
  message.textContent = `Gratulálunk, teljesítetted a játékot! Idő: ${timer} mp, Hibák: ${hibak}`;
  endGameContainer.appendChild(message);

  const statsButton = document.createElement("button");
  statsButton.textContent = "Statisztikák megtekintése";
  statsButton.onclick = () => window.location.href = "statisztikak-index.html";
  endGameContainer.appendChild(statsButton);

  const restartButton = document.createElement("button");
  restartButton.textContent = "Új játék";
  restartButton.onclick = () => window.location.href = "szint-index.html";
  endGameContainer.appendChild(restartButton);

  document.body.innerHTML = ""; 
  document.body.appendChild(endGameContainer);
}

// kképességek gombok 
function addAbilityButtons() {
  const abilitiesContainer = document.createElement("div");
  abilitiesContainer.id = "abilities-container";

  const revealOneButton = document.createElement("button");
  revealOneButton.textContent = "Egy pár felfedése";
  revealOneButton.onclick = revealOnePair;
  abilitiesContainer.appendChild(revealOneButton);

  const revealAllButton = document.createElement("button");
  revealAllButton.textContent = "Összes felfedése";
  revealAllButton.onclick = revealAllCardsTemporarily;
  abilitiesContainer.appendChild(revealAllButton);

  document.body.insertBefore(abilitiesContainer, document.getElementById("kartyak-container"));
}

// egy par kepesseg
function revealOnePair() {
  if (hasznaltRevealOne) return; 
  hasznaltRevealOne = true;

  const unmatchedCards = Array.from(document.querySelectorAll(".kartya:not(.matched)"));
  const pairs = {};

  unmatchedCards.forEach((card) => {
    const imgSrc = card.querySelector("img").src;
    if (!pairs[imgSrc]) {
      pairs[imgSrc] = [];
    }
    pairs[imgSrc].push(card);
  });

  for (const pair in pairs) {
    if (pairs[pair].length === 2) {
      pairs[pair][0].classList.add("flipped");
      pairs[pair][1].classList.add("flipped");
      setTimeout(() => {
        pairs[pair][0].classList.remove("flipped");
        pairs[pair][1].classList.remove("flipped");
      }, 3000);
      break;
    }
  }
}

// osszes kartya kepesseg
function revealAllCardsTemporarily() {
  if (hasznaltRevealAll) return; 
  hasznaltRevealAll = true;

  const allCards = document.querySelectorAll(".kartya");
  allCards.forEach((card) => card.classList.add("flipped"));
  setTimeout(() => {
    allCards.forEach((card) => {
      if (!card.classList.contains("matched")) {
        card.classList.remove("flipped");
      }
    });
  }, 3000);
}

function saveStats() {
  
  const stat = {
    email: localStorage.getItem('email'),
    age: parseInt(localStorage.getItem('kor')),
    level: localStorage.getItem('level'),
    time: timer,
    mistakes: hibak
  };

  const statok = JSON.parse(localStorage.getItem('statisztikak')) || [];
  statok.push(stat);
  localStorage.setItem('statisztikak', JSON.stringify(statok));

  // küldé szerverre
  postStatsToServer(stat);
}

function postStatsToServer(stat) {
  fetch('http://localhost/memory/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stat)
  })
  .then(response => response.json())
  .then(data => {
    if (response.status === 201) {
      console.log("Sikeres mentés:", data);
    } else if (response.status === 200) {
      console.log("Korábbinál rosszabb eredmény:", data.message);
    } else {
      console.error("Mentés hiba:", data.error);
    }
  })
  .catch(error => console.error("Szerverhiba:", error));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById("ido").textContent = timer;
  }, 1000);
}

// Tovább gomb engedélyezése
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adatok-form");
  const nameInput = document.getElementById("nev");
  const ageInput = document.getElementById("kor");
  const emailInput = document.getElementById("email");
  const submitButton = document.getElementById("submit-button");

  // összes mező ki van-e töltve
  // trim => eltavolitja a felesleges szoközöket
  function validateForm() {
    const nev = nameInput ? nameInput.value.trim() : "";
    const kor = ageInput ? ageInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";

    const isFormValid = nev && kor && email;

    if (submitButton) {
      submitButton.disabled = !isFormValid;
    }
  }

  if (form) {
    nameInput.addEventListener("input", validateForm);
    ageInput.addEventListener("input", validateForm);
    emailInput.addEventListener("input", validateForm);
  }


  validateForm();
});
