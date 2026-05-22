const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 600;

// =====================
// IMAGES
// =====================
const finishImg = new Image();
finishImg.src = "images/you.png"; // change to your image path

// =====================
// PLAYER
// =====================
const player = {
  x: 10,
  y: 10,
  r: 5
};

let running = true;
let canCollide = true;
let popCooldown = false;

// =====================
// FINISH ZONE
// =====================
const winZone = {
  x: 450,
  y: 550,
  w: 40,
  h: 40
};

// =====================
// MAZE SETTINGS
// =====================
const cols = 10;
const rows = 12;
const cellSize = 50;

// =====================
// CELL CLASS
// =====================
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = [true, true, true, true]; // top right bottom left
    this.visited = false;
  }
}

const grid = [];

// build grid
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    grid.push(new Cell(x, y));
  }
}

function index(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return -1;
  return x + y * cols;
}

// =====================
// MAZE GENERATION
// =====================
function getNeighbors(cell) {
  const neighbors = [];

  const top = grid[index(cell.x, cell.y - 1)];
  const right = grid[index(cell.x + 1, cell.y)];
  const bottom = grid[index(cell.x, cell.y + 1)];
  const left = grid[index(cell.x - 1, cell.y)];

  if (top && !top.visited) neighbors.push(top);
  if (right && !right.visited) neighbors.push(right);
  if (bottom && !bottom.visited) neighbors.push(bottom);
  if (left && !left.visited) neighbors.push(left);

  return neighbors;
}

function removeWalls(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  if (dx === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (dx === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  if (dy === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (dy === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

// generate maze
let stack = [];
let current = grid[0];
current.visited = true;

function generateStep() {
  const neighbors = getNeighbors(current);

  if (neighbors.length > 0) {
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    stack.push(current);
    removeWalls(current, next);
    current = next;
    current.visited = true;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

// fully generate before game starts
while (stack.length >= 0) {
  const prev = stack.length;
  generateStep();
  if (stack.length === 0 && getNeighbors(current).length === 0) break;
}

// =====================
// INPUT
// =====================
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  player.x = e.clientX - rect.left;
  player.y = e.clientY - rect.top;

  if (running) checkCollision();
});

// =====================
// DRAW
// =====================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // maze walls
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;

  for (let cell of grid) {
    const x = cell.x * cellSize;
    const y = cell.y * cellSize;

    if (cell.walls[0]) line(x, y, x + cellSize, y);
    if (cell.walls[1]) line(x + cellSize, y, x + cellSize, y + cellSize);
    if (cell.walls[2]) line(x, y + cellSize, x + cellSize, y + cellSize);
    if (cell.walls[3]) line(x, y, x, y + cellSize);
  }

  // finish image
  ctx.drawImage(finishImg, winZone.x, winZone.y, winZone.w, winZone.h);

  // player
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// =====================
// COLLISION
// =====================
function checkCollision() {
  if (!canCollide) return;

  const col = Math.floor(player.x / cellSize);
  const row = Math.floor(player.y / cellSize);
  const cell = grid[index(col, row)];
  if (!cell) return;

  // wall hit → fail popup
  if (
    player.x < 0 ||
    player.y < 0 ||
    player.x > canvas.width ||
    player.y > canvas.height
  ) {
    triggerFail();
  }

  // win
  if (
    player.x > winZone.x &&
    player.x < winZone.x + winZone.w &&
    player.y > winZone.y &&
    player.y < winZone.y + winZone.h
  ) {
    winGame();
  }
}

// =====================
// FAIL POPUP
// =====================
function triggerFail() {
  if (popCooldown) return;

  popCooldown = true;

  document.getElementById("failPopup").style.display = "flex";

  resetMaze();

  setTimeout(() => {
    popCooldown = false;
  }, 800);
}

// =====================
// RESET
// =====================
function resetMaze() {
  player.x = 10;
  player.y = 10;

  canCollide = false;
  setTimeout(() => {
    canCollide = true;
  }, 200);
}

// =====================
// WIN
// =====================
function winGame() {
  running = false;
  document.getElementById("winScreen").style.display = "flex";
}

// =====================
// UI
// =====================
function restartMaze() {
  location.reload();
}

function goHome() {
  window.location.href = "index.html";
}

// =====================
// START
// =====================
draw();