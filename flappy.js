const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ---------------- IMAGES (FROM /images FOLDER) ----------------
const birdImage = new Image();
birdImage.src = "images/richard.png";

const bgImage = new Image();
bgImage.src = "images/background.jpg";

// ---------------- GAME STATE ----------------
let gameStarted = false;
let gameOverState = false;

// ---------------- SCORE ----------------
let score = 0;

// ---------------- BIRD ----------------
const bird = {
  x: 100,
  y: 300,
  velocity: 0,
  gravity: 0.5,
  jump: -8
};

// ---------------- PIPES ----------------
let pipes = [];

// ---------------- CONTROLS ----------------
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") flap();
});

document.addEventListener("click", flap);

function flap() {
  if (!gameStarted || gameOverState) return;
  bird.velocity = bird.jump;
}

// ---------------- START GAME ----------------
function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  gameOverState = false;

  document.getElementById("startScreen").style.display = "none";

  loop();
}

// ---------------- PIPE SPAWN ----------------
function spawnPipe() {
  if (!gameStarted || gameOverState) return;

  const gap = 150;
  const topHeight = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    width: 60,
    top: topHeight,
    bottom: topHeight + gap,
    passed: false
  });
}

setInterval(spawnPipe, 1800);

// ---------------- GAME OVER ----------------
function gameOver() {
  gameOverState = true;

  document.getElementById("gameOverScreen").style.display = "flex";
  document.getElementById("finalScore").innerText = "Score: " + score;
}

// ---------------- RESTART ----------------
function restartGame() {
  gameOverState = false;
  gameStarted = true;

  score = 0;
  bird.y = 300;
  bird.velocity = 0;
  pipes = [];

  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("gameOverScreen").style.display = "none";

  loop();
}

// ---------------- HOME ----------------
function goHome() {
  window.location.href = "index.html";
}

// ---------------- ACHIEVEMENTS ----------------
function showAchievement(text) {
  const box = document.getElementById("achievement");

  if (!box) return;

  box.innerText = "🏆 " + text;
  box.classList.remove("hidden");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 2000);
}

// ---------------- GAME LOOP ----------------
function loop() {
  if (!gameStarted || gameOverState) return;

  requestAnimationFrame(loop);

  // BACKGROUND (SAFE)
  if (bgImage.complete && bgImage.naturalWidth > 0) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // BIRD PHYSICS
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // DRAW BIRD (SAFE)
  if (birdImage.complete && birdImage.naturalWidth > 0) {
    ctx.drawImage(
      birdImage,
      bird.x - 22,
      bird.y - 22,
      44,
      44
    );
  } else {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // PIPES
  pipes.forEach((pipe, i) => {
    pipe.x -= 3;

    ctx.fillStyle = "green";

    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(
      pipe.x,
      pipe.bottom,
      pipe.width,
      canvas.height - pipe.bottom
    );

    // SCORE
    if (!pipe.passed && pipe.x < bird.x) {
      pipe.passed = true;
      score++;

      document.getElementById("score").innerText = "Score: " + score;

      // ACHIEVEMENTS
      if (score === 5) showAchievement("Getting the hang of it");
      if (score === 10) showAchievement("Flappy Pro");
      if (score === 20) showAchievement("Richard Unlocked Chaos Mode");
    }

    // COLLISION
    if (
      bird.x + 20 > pipe.x &&
      bird.x - 20 < pipe.x + pipe.width &&
      (bird.y - 20 < pipe.top || bird.y + 20 > pipe.bottom)
    ) {
      gameOver();
    }

    // REMOVE OFFSCREEN
    if (pipe.x + pipe.width < 0) {
      pipes.splice(i, 1);
    }
  });

  // FLOOR / CEILING
  if (bird.y > canvas.height || bird.y < 0) {
    gameOver();
  }
}