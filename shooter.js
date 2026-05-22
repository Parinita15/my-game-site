const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// GAME STATE
let gameStarted = false;
let gameOverState = false;

// GAME DATA
let score = 0;
let shield = 50;
let difficulty = 1;

// OBJECTS
let asteroids = [];
let bullets = [];
let explosions = [];

// PLAYER
const player = {
  x: 180,
  y: 520,
  width: 40,
  height: 40,
  speed: 6
};

let keys = {};

// ---------------- CONTROLS ----------------
document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.code === "Space") {
    shoot();
  }
});

document.addEventListener("keyup", e => keys[e.key] = false);

// ---------------- START GAME ----------------
function startGame() {
  gameStarted = true;
  document.getElementById("startScreen").style.display = "none";
  update();
}

// ---------------- SHOOT HEARTS ----------------
function shoot() {
  if (!gameStarted || gameOverState) return;

  bullets.push({
    x: player.x + player.width / 2,
    y: player.y,
    speed: 7
  });
}

// ---------------- ASTEROIDS ----------------
function spawnAsteroid() {
  if (!gameStarted || gameOverState) return;

  asteroids.push({
    x: Math.random() * 360,
    y: -50,
    size: 30,
    speed: (2 + Math.random() * 2) * difficulty
  });
}

// ---------------- COLLISION ----------------
function hit(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.width > b.x &&
    a.y < b.y + b.size &&
    a.y + b.height > b.y
  );
}

// ---------------- EXPLOSION SYSTEM ----------------
function createExplosion(x, y) {
  explosions.push({
    x,
    y,
    radius: 5,
    alpha: 1
  });
}

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
  shield = 50;
  difficulty = 1;

  asteroids = [];
  bullets = [];
  explosions = [];

  player.x = 180;

  document.getElementById("gameOverScreen").style.display = "none";

  update();
}

// ---------------- HOME ----------------
function goHome() {
  window.location.href = "index.html";
}

// ---------------- DIFFICULTY + SHIELD ----------------
setInterval(() => {
  if (gameStarted && !gameOverState) {
    difficulty += 0.1;

    if (shield < 100) shield += 5;
  }
}, 2000);

// ---------------- ASTEROID SPAWN ----------------
setInterval(spawnAsteroid, 800);

// ---------------- GAME LOOP ----------------
function update() {
  if (!gameStarted || gameOverState) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // PLAYER MOVEMENT
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;

  // DRAW PLAYER
  ctx.fillStyle = "hotpink";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // UI
  document.getElementById("score").innerText =
    "Score: " + score + " | Shield: " + shield;

  // ---------------- BULLETS ----------------
  bullets.forEach((b, i) => {
    b.y -= b.speed;

    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
    ctx.fill();

    if (b.y < 0) bullets.splice(i, 1);

    asteroids.forEach((a, j) => {
      if (
        b.x < a.x + a.size &&
        b.x > a.x &&
        b.y < a.y + a.size &&
        b.y > a.y
      ) {
        asteroids.splice(j, 1);
        bullets.splice(i, 1);
        score++;
      }
    });
  });

  // ---------------- ASTEROIDS ----------------
  asteroids.forEach((a, i) => {
    a.y += a.speed;

    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.size / 2, 0, Math.PI * 2);
    ctx.fill();

    const collision =
      player.x < a.x + a.size &&
      player.x + player.width > a.x &&
      player.y < a.y + a.size &&
      player.y + player.height > a.y;

    if (collision && !gameOverState) {
      if (shield > 0) {
        shield -= 25;
        asteroids.splice(i, 1);
      } else {
        createExplosion(
          player.x + player.width / 2,
          player.y + player.height / 2
        );
        gameOver();
      }
    }

    if (a.y > canvas.height) {
      asteroids.splice(i, 1);
      score++;
    }
  });

  // ---------------- EXPLOSIONS (FIXED + VISIBLE) ----------------
  explosions.forEach((ex, i) => {
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(255, 140, 0, ${ex.alpha})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.radius * 1.8, 0, Math.PI * 2);

    ctx.strokeStyle = `rgba(255, 255, 255, ${ex.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ex.radius += 4;
    ex.alpha -= 0.04;

    if (ex.alpha <= 0) {
      explosions.splice(i, 1);
    }
  });

  requestAnimationFrame(update);
}