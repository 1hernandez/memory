
const gameBoard = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const params = new URLSearchParams(window.location.search);
const level = params.get("level") || "medium";

const allImages = [
  "elan1.jpeg",
  "elan2.jpeg",
  "elan3.jpeg",
  "lem.jpeg",
  "lim.jpeg",
  "lom.jpeg"
];

const levelMap = {
  easy: 2,
  medium: 4,
  hard: 6
};

let flippedCards = [];
let matchedPairs = 0;
let totalPairs = levelMap[level] || 4;
let timer;
let startTime;

function prepareCards() {
  const selected = allImages.slice(0, totalPairs);
  const cards = [...selected, ...selected]; // duplicate
  return cards.sort(() => Math.random() - 0.5);
}

function renderBoard() {
  gameBoard.innerHTML = "";
  statusDisplay.textContent = "";
  matchedPairs = 0;
  flippedCards = [];

  const shuffled = prepareCards();
  shuffled.forEach((src, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.src = src;

    const img = document.createElement("img");
    img.src = src;
    img.style.visibility = "hidden"; // hide image initially
    card.appendChild(img);

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  startTime = Date.now();
  if (timer) clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function flipCard(card) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    card.querySelector("img").style.visibility = "visible";
    flippedCards.push(card);
    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 700);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.src === card2.dataset.src) {
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      gameWon();
    }
  } else {
    card1.classList.remove("flipped");
    card1.querySelector("img").style.visibility = "hidden";
    card2.classList.remove("flipped");
    card2.querySelector("img").style.visibility = "hidden";
  }
  flippedCards = [];
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  statusDisplay.textContent = `Time: ${seconds}s`;
}

function gameWon() {
  clearInterval(timer);
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  statusDisplay.textContent = `🎉 You win! Time: ${timeTaken}s`;

  setTimeout(() => {
    renderBoard(); // restart game
  }, 3000);
}

renderBoard();
