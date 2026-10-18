let lengths = [90, 80, 70];
let angles = [-1.2, 0.7, 0.5];
let target, slider;
let active = 2;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent(document.body);

  target = createVector(400, 150);

  slider = createSlider(1, 30, 1);
  slider.position(190, 360);
  slider.size(200);
}

function getJoints() {
  let joints = [createVector(150, 200)];
  let angle = 0;

  for (let i = 0; i < lengths.length; i++) {
    angle += angles[i];
    let p = joints[i];

    joints.push(createVector(
      p.x + cos(angle) * lengths[i],
      p.y + sin(angle) * lengths[i]
    ));
  }
  return joints;
}

function solveStep() {
  let joints = getJoints();
  let pivot = joints[active];
  let end = joints[3];

  let a = atan2(end.y - pivot.y, end.x - pivot.x);
  let b = atan2(target.y - pivot.y, target.x - pivot.x);

  let delta = atan2(sin(b - a), cos(b - a));

  angles[active] += constrain(delta, -0.04, 0.04);
  active = (active + 2) % 3;
}

function draw() {
  background(255);

  for (let i = 0; i < slider.value(); i++) {
    solveStep();
  }

  let joints = getJoints();

  // Rotation circles around joints
  noFill();
  stroke(210);
  strokeWeight(1);

  for (let i = 0; i < 3; i++) {
    circle(joints[i].x, joints[i].y, lengths[i] * 2);
  }

  // Chain
  stroke(40);
  strokeWeight(7);

  for (let i = 0; i < 3; i++) {
    line(joints[i].x, joints[i].y,
         joints[i+1].x, joints[i+1].y);
  }

  // Joints
  fill(255);
  stroke(40);
  strokeWeight(2);

  for (let p of joints) {
    circle(p.x, p.y, 16);
  }

  // Target
  noStroke();
  fill("red");
  circle(target.x, target.y, 22);

  // UI
  fill(30);
  textSize(17);
  text("Cyclic Coordinate Descent", 15, 30);
  text("Steps per frame: " + slider.value(), 12, 375);
}

function mousePressed() {
  if (mouseY < 330) {
    target.set(mouseX, mouseY);
  }
}

function mouseDragged() {
  if (mouseY < 330) {
    target.set(mouseX, mouseY);
  }
}

function keyPressed() {
  if (key === 'g' || key === 'G') {
    saveGif('CCD_animation', 5);
  }
}
