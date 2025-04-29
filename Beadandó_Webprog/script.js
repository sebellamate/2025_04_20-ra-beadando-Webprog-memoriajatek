const images = [
    '🐶', '🐱', '🦊', '🐸', '🐵', '🐼', '🐯', '🐰'
  ];

  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let canClick = false;
  let mistakes = 0;
  let remainingPairs = 0;
  let usedRevealPair = false;
  let usedRevealAll = false;
  let timerInterval;
  let startTime;
  let gameStarted = false;

  function startGame() {
    gameStarted = true;
    document.getElementById('revealPairBtn').disabled = false;
    document.getElementById('revealAllBtn').disabled = false;
    const difficulty = document.getElementById('difficulty').value;
    let pairCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(pairCount * 2))}, 1fr)`;
    mistakes = 0;
    usedRevealPair = false;
    usedRevealAll = false;
    updateInfo();

    let selectedImages = images.slice(0, pairCount);
    cards = shuffle([...selectedImages, ...selectedImages].map((image, index) => ({ id: index, image, matched: false })));
    remainingPairs = pairCount;

    for (const card of cards) {
      const div = document.createElement('div');
      div.className = 'card';
      div.dataset.id = card.id;
      div.dataset.image = card.image;
      div.innerHTML = `<span>${card.image}</span>`;
      board.appendChild(div);
    }

    showAllCardsTemporary();
    board.addEventListener('click', handleCardClick);
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateInfo, 1000);
  }

  function handleCardClick(e) {
    const target = e.target.closest('.card');
    if (!canClick || !target || target.classList.contains('matched') || target.classList.contains('flipped')) return;

    target.classList.add('flipped');
    target.innerHTML = `<span>${target.dataset.image}</span>`;

    if (!firstCard) {
      firstCard = target;
    } else {
      secondCard = target;
      canClick = false;

      setTimeout(() => {
        if (firstCard.dataset.image === secondCard.dataset.image) {
          firstCard.classList.add('matched');
          secondCard.classList.add('matched');
          remainingPairs--;
          if (remainingPairs === 0) endGame();
        } else {
          mistakes++;
          firstCard.innerHTML = '';
          secondCard.innerHTML = '';
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
        }
        firstCard = null;
        secondCard = null;
        updateInfo();
        canClick = true;
      }, 1000);
    }
  }

  function revealRandomPair() {
    if (!gameStarted) return;
  }

  function revealAllTemporary() {
    if (!gameStarted) return;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function showAllCardsTemporary() {
    const cardDivs = document.querySelectorAll('.card');
    cardDivs.forEach(div => {
      div.innerHTML = `<span>${div.dataset.image}</span>`;
    });
    setTimeout(() => {
      cardDivs.forEach(div => {
        if (!div.classList.contains('matched')) div.innerHTML = '';
      });
      canClick = true;
    }, 3000);
  }

  function revealRandomPair() {
    usedRevealPair = true;

    const unmatched = cards.filter(c => !document.querySelector(`[data-id='${c.id}']`).classList.contains('matched'));
    const shuffled = shuffle(unmatched);
    const first = shuffled[0];
    const second = shuffled.find(c => c.image === first.image && c.id !== first.id);
    if (first && second) {
      document.querySelector(`[data-id='${first.id}']`).innerHTML = `<span>${first.image}</span>`;
      document.querySelector(`[data-id='${second.id}']`).innerHTML = `<span>${second.image}</span>`;

      setTimeout(() => {
        if (!document.querySelector(`[data-id='${first.id}']`).classList.contains('matched'))
          document.querySelector(`[data-id='${first.id}']`).innerHTML = '';
        if (!document.querySelector(`[data-id='${second.id}']`).classList.contains('matched'))
          document.querySelector(`[data-id='${second.id}']`).innerHTML = '';
      }, 2000);
    }
  }

  function revealAllTemporary() {
    usedRevealAll = true;

    const cardDivs = document.querySelectorAll('.card');
    cardDivs.forEach(div => {
      if (!div.classList.contains('matched')) {
        div.innerHTML = `<span>${div.dataset.image}</span>`;
      }
    });
    setTimeout(() => {
      cardDivs.forEach(div => {
        if (!div.classList.contains('matched') && !div.classList.contains('flipped')) {
          div.innerHTML = '';
        }
      });
    }, 3000);
  }

  function sendToServer(data) {
    fetch('https://sajat-szerver.hu/api/stats', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(response => {
      if (!response.ok) console.error('Hiba a küldésnél');
    }).catch(console.error);
  }

  function updateInfo() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('info').textContent = `Idő: ${elapsed} mp | Hibák: ${mistakes}`;
  }
  function endGame() {
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const difficulty = document.getElementById('difficulty').value;
    const date = new Date().toLocaleDateString();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  
    const stat = {
      email,
      age,
      difficulty,
      time: timeSpent,
      errors,
      date
    };
  
    const stats = JSON.parse(localStorage.getItem('memoryStats') || "[]");
    stats.push(stat);
    localStorage.setItem('memoryStats', JSON.stringify(stats));
  
    sendToServer(stat); // POST küldés
  }