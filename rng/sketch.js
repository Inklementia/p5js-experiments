// Samples per shoot
const N = 200;
const SCALE = 100;

let boxMullerPoints = [];
let builtinPoints = [];

let useBoxMuller = true;
let useBuiltin = true;

let btnShoot, btnClean, btnBox, btnBuilt;

function setup() {
  createCanvas(600, 600);
  noLoop();

  // Buttons
  btnShoot = createButton('Shoot');
  btnShoot.position(10, height + 10);
  btnShoot.mousePressed(shootOnce);

  btnClean = createButton('Clean');
  btnClean.position(65, height + 10);
  btnClean.mousePressed(cleanAll);

  btnBox = createButton('Box-Muller: ON');
  btnBox.position(120, height + 10);
  btnBox.mousePressed(toggleBox);

  btnBuilt = createButton('Built-in: ON');
  btnBuilt.position(230, height + 10);
  btnBuilt.mousePressed(toggleBuilt);

  redraw();
}

function toggleBox() {
  useBoxMuller = !useBoxMuller;
  btnBox.html(`Box-Muller: ${useBoxMuller ? 'ON' : 'OFF'}`);
}

function toggleBuilt() {
  useBuiltin = !useBuiltin;
  btnBuilt.html(`Built-in: ${useBuiltin ? 'ON' : 'OFF'}`);
}

// Box–Muller 2D normal
function boxMuller2D() {
  let u1 = random();
  let u2 = random();
  if (u1 === 0) u1 = Number.MIN_VALUE;

  let r = sqrt(-2 * log(u1));
  let theta = TWO_PI * u2;

  return {
    x: r * cos(theta),
    y: r * sin(theta)
  };
}

function shootOnce() {
  if (!useBoxMuller && !useBuiltin) return;

  for (let i = 0; i < N; i++) {
    if (useBoxMuller) {
      boxMullerPoints.push(boxMuller2D());
    }
    if (useBuiltin) {
      builtinPoints.push({
        x: randomGaussian(),
        y: randomGaussian()
      });
    }
  }
  redraw();
}

function cleanAll() {
  boxMullerPoints = [];
  builtinPoints = [];
  redraw();
}

function draw() {
  background(255);
  translate(width / 2, height / 2); //centering

  drawTarget();
  drawSamples();
}

function drawTarget() {
  noFill();
  stroke("red");
  strokeWeight(30);

  for (let r = 100; r <= 300; r += 100) {
    circle(0, 0, r);
  }
}

function drawSamples() {
  // Built-in - blue
  stroke("blue");
  strokeWeight(6);
  builtinPoints.forEach(p => {
    point(p.x * SCALE, p.y * SCALE);
  });

  // Box–Muller - green
  stroke("green");
  strokeWeight(6);
  boxMullerPoints.forEach(p => {
    point(p.x * SCALE, p.y * SCALE);
  });
}
