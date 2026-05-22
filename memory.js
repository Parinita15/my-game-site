
const board = document.getElementById("gameBoard");
const statusText = document.getElementById("status");

const images = [
  "images/pic1.jpg", "images/pic1.jpg",
  "images/pic2.jpg", "images/pic2.jpg",
  "images/pic3.jpg", "images/pic3.jpg",
  "images/pic4.jpg", "images/pic4.jpg",
  "images/pic5.jpg", "images/pic5.jpg",
  "images/pic6.jpg", "images/pic6.jpg",
  "images/pic7.jpg", "images/pic7.jpg",
  "images/pic8.jpg", "images/pic8.jpg"
];

let flippedCards = [];
let matchedCount = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  board.innerHTML = "";
  flippedCards = [];
  matchedCount = 0;

  shuffle(images).forEach(imgSrc => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgSrc;

    // hidden state
    card.innerHTML = `<div class="hidden">❓</div>`;

    card.addEventListener("click", () => flipCard(card));

    board.appendChild(card);
  });

  statusText.innerText = "find the matching memories 💘😭";
}

function flipCard(card) {
  if (
    card.classList.contains("matched") ||
    flippedCards.includes(card)
  ) return;

  card.innerHTML = `<img src="${card.dataset.image}" />`;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flippedCards;

  if (a.dataset.image === b.dataset.image) {
    a.classList.add("matched");
    b.classList.add("matched");

    matchedCount += 2;

    statusText.innerText = "Aww 😭 that’s a match 💘";

    if (matchedCount === images.length) {
      statusText.innerText = "YOU WON 😭💖 (took you long enough!)";
    }

  } else {
    statusText.innerText = "nope 😭 try again";

    setTimeout(() => {
      a.innerHTML = `<div class="hidden">❓</div>`;
      b.innerHTML = `<div class="hidden">❓</div>`;
    }, 700);
  }

  flippedCards = [];
}

createBoard();

function goHome() {
  window.location.href = "index.html";
}