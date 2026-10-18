let lengths = [90, 80, 70];
let joints = [];
let root, target, slider;
let step = 3, forward = true;
let lastStep = 0;

function setup() {
  createCanvas(600, 400);

  root = createVector(150, 200);
  target = createVector(350, 150);

  joints = [root.copy()];
  let angle = -1.2;

  for (let len of lengths) {
    let p = joints[joints.length - 1];
    joints.push(createVector(
      p.x + cos(angle) * len,
      p.y + sin(angle) * len
    ));
    angle += 0.5;
  }

  slider = createSlider(1, 30, 3);
  slider.position(190, 360);
  slider.size(200);
}

function solveStep() {
  let n = lengths.length;
  let total = lengths.reduce((a, b) => a + b, 0);

  // Unreachable target
  if (p5.Vector.dist(root, target) >= total) {
    let dir = p5.Vector.sub(target, root).normalize();
    joints[0] = root.copy();

    for (let i = 0; i < n; i++) {
      joints[i + 1] = p5.Vector.add(
        joints[i],
        dir.copy().mult(lengths[i])
      );
    }

    step = n;
    forward = true;
    return;
  }

  // Already converged
  if (forward && step === n &&
      p5.Vector.dist(joints[n], target) < 0.5 &&
      p5.Vector.dist(joints[0], root) < 0.01) {
    return;
  }

  if (forward) {
    // Forward pass: target to root
    if (step === n) joints[n] = target.copy();

    let i = step - 1;
    let dir = p5.Vector.sub(joints[i], joints[i + 1]);
    if (dir.mag() < 0.00001) dir.set(1, 0);
    dir.setMag(lengths[i]);

    joints[i] = p5.Vector.add(joints[i + 1], dir);

    step--;
    if (step === 0) forward = false;

  } else {
    // Backward pass: root to target
    if (step === 0) joints[0] = root.copy();

    let i = step;
    let dir = p5.Vector.sub(joints[i + 1], joints[i]);
    if (dir.mag() < 0.00001) dir.set(1, 0);
    dir.setMag(lengths[i]);

    joints[i + 1] = p5.Vector.add(joints[i], dir);

    step++;
    if (step === n) forward = true;
  }
}

function draw() {
  background(255);

  if (millis() - lastStep >= 1000 / slider.value()) {
    solveStep();
    lastStep = millis();
  }

  // Black chain
  stroke(40);
  strokeWeight(7);
  strokeCap(ROUND);

  for (let i = 0; i < lengths.length; i++) {
    line(
      joints[i].x, joints[i].y,
      joints[i + 1].x, joints[i + 1].y
    );
  }

  // White joints with black outlines
  fill(255);
  stroke(40);
  strokeWeight(2);

  for (let p of joints) {
    circle(p.x, p.y, 16);
  }

  // Red target
  noStroke();
  fill("red");
  circle(target.x, target.y, 22);

  // UI
  fill(30);
  textSize(17);
  text("Forward And Backward Reaching IK", 15, 30);
  textSize(14);
  fill(forward ? "#2196F3" : "#4CAF50");
  text("Phase: " + (forward ? "FORWARD" : "BACKWARD"), 15, 55);
  fill(30);
  textSize(13);
  text("Steps per second: " + slider.value(), 12, 375);
}

function mousePressed() {
  if (mouseY < 330 && mouseX < width) {
    target.set(mouseX, mouseY);
  }
}

function mouseDragged() {
  if (mouseY < 330 && mouseX < width) {
    target.set(mouseX, mouseY);
  }
}

function keyPressed() {
  if (key === 'g' || key === 'G') {
    saveGif('FABRIK_animation', 5);
  }
}
