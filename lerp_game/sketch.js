let canvasWidth = 640;
let canvasHeight = 640;

// enemies
let e_a = [];
let e_b = [];
let e_p = [];
let e_f = [];
let e_m = [];
let num_enemies = 5;
let enemyRadius = 13;

// player
let player;
let playerRadius = 10;
let playerSpeed = 0.05;

let collisions = 0;
let gameEnded = false;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  resetGame();
}

function draw() {
  if (gameEnded) {
    drawWin();
  } else {
    drawUI();
    drawEnemies();
    drawPlayer();
    checkForCollision();
    checkForWin();
  }
}

function drawUI() {
  background(0);
  fill("#FFFFFF");
  textSize(16);

  // Draw start point
  textAlign(LEFT, TOP);
  text('Start', 10, 10);

  // Draw finish point
  textAlign(RIGHT, BOTTOM);
  text('Finish', canvasWidth - 10, canvasHeight - 10);

  // Display collisions
  textAlign(LEFT, BOTTOM);
  text(`Collisions: ${collisions}`, 10, canvasHeight - 10);
}

function mousePressed() {
  if (gameEnded) {
    resetGame();
  }
}

function resetGame() {
  // Initialize enemies
  e_a = [];
  e_b = [];
  e_f = [];
  e_m = [];
  for (let i = 0; i < num_enemies; i++) {
    e_a[i] = createVector(random(20, canvasWidth - 10), random(20, canvasHeight - 10));
    e_b[i] = createVector(random(20, canvasWidth - 10), random(20, canvasHeight - 10));
    e_f[i] = random(0, 1);
    e_m[i] = random(0.005, 0.025);
  }

  // Reset player and collisions
  player = createVector(10, 10); // Start at top-left corner
  collisions = 0;
  gameEnded = false;
}

function drawWin() {
  background(0);
  fill("#FFFFFF");
  textSize(32);
  textAlign(CENTER, CENTER);
  text('You Win! Click to Restart', canvasWidth / 2, canvasHeight / 2);
}

function drawEnemies() {
  // Render and move enemies
  stroke("#FF0000");
  fill("#FF0000");
  for (let i = 0; i < num_enemies; i++) {
    e_p[i] = p5.Vector.add(
      p5.Vector.mult(e_a[i], 1 - ease(e_f[i])),
      p5.Vector.mult(e_b[i], ease(e_f[i]))
    );
    ellipse(e_p[i].x, e_p[i].y, enemyRadius * 2, enemyRadius * 2);
    e_f[i] += e_m[i];
    if (e_f[i] >= 1 || e_f[i] <= 0) e_m[i] = -e_m[i];
  }
}

function drawPlayer() {
  // Player smoothly follows the mouse
  let target = createVector(mouseX, mouseY);
  player.lerp(target, playerSpeed);
  noStroke();
  fill("#00FF00");
  ellipse(player.x, player.y, playerRadius * 2, playerRadius * 2);
}

function checkForCollision() {
  // Detect collisions between the player and enemies
  for (let i = 0; i < num_enemies; i++) {
    let distance = dist(player.x, player.y, e_p[i].x, e_p[i].y);
    if (distance < playerRadius + enemyRadius) {
      collisions++;
      player.set(10, 10); // Reset player to the start
    }
  }
}

function checkForWin() {
  // Check if the player reaches the finish point
  if (
    dist(player.x, player.y, canvasWidth - 40, canvasHeight - 20) <
    playerRadius + 10
  ) {
    gameEnded = true;
  }
}

function ease(f) {
  return (
    (1 - f) * (f * f * f) + f * (1 - (1 - f) * (1 - f) * (1 - f))
  ); // Blend both easing functions
}
