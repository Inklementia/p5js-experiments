let cubePosInRectX = 0;
let cubePosInRectZ = 0;

let rectSize = 200; // Bounds for the rectangle
let cubeSize = 10;
let left = false, right = false, forward = false, back = false;

let targetAngle = 0; // Target rotation angle
let currentAngle = 0; // Current rotation angle of the cube

// Camera position
let cameraX = 0, cameraZ = 0;
let lookAtX = 0, lookAtZ = 0;

// Flag to track whether the avatar is inside the rectangle
let insideRectangle = true;

// Shake variables
let isShaking = false;
let shakeAmount = 0;
let shakeTime = 0;

function setup() {
  createCanvas(640, 480, WEBGL);
}

function draw() {
  background(128);

  // Cube movement
  let cubeX = 0;
  let cubeZ = 0;

  if (back) cubeZ -= 1.0;
  if (forward) cubeZ += 1.0;
  if (left) cubeX -= 1.0;
  if (right) cubeX += 1.0;

  // Update position
  cubePosInRectX += cubeX;
  cubePosInRectZ += cubeZ;

  // Calculate target rotation angle
  if (cubeX !== 0 || cubeZ !== 0) {
    targetAngle = atan2(cubeZ, cubeX); // Calculate target angle of movement
  }

  // Smoothly interpolate the current angle towards the target angle
  currentAngle = lerp(currentAngle, targetAngle, 0.1);

  // Draw rectangle bounds
  stroke("red");
  line(rectSize, 0, -rectSize, rectSize, 0, rectSize);
  line(-rectSize, 0, rectSize, rectSize, 0, rectSize);
  line(rectSize, 0, -rectSize, -rectSize, 0, -rectSize);
  line(-rectSize, 0, rectSize, -rectSize, 0, -rectSize);

  // Check if the cube is inside the rectangle
  let currentlyInside = abs(cubePosInRectX) <= rectSize && abs(cubePosInRectZ) <= rectSize;

  if (currentlyInside && !insideRectangle) {
    // Trigger camera shake when entering the rectangle
    shakeCamera(20, 10);
  } else if (!currentlyInside && insideRectangle) {
    // Trigger camera shake when exiting the rectangle
    shakeCamera(20, 10);
  }

  insideRectangle = currentlyInside;

  // Apply camera shake if active
  let shakeOffsetX = 0, shakeOffsetY = 0, shakeOffsetZ = 0;
  if (isShaking) {
    shakeOffsetX = random(-shakeAmount, shakeAmount);
    shakeOffsetY = random(-shakeAmount, shakeAmount);
    shakeOffsetZ = random(-shakeAmount, shakeAmount);
    shakeTime--;
    if (shakeTime <= 0) isShaking = false; // Stop shaking when time runs out
  }

  // Camera setup
  if (insideRectangle) {
    cameraX = lerp(cameraX, cubePosInRectX, 0.05);
    cameraZ = lerp(cameraZ, cubePosInRectZ, 0.05);
    lookAtX = lerp(lookAtX, cubePosInRectX, 0.05);
    lookAtZ = lerp(lookAtZ, cubePosInRectZ, 0.05);
  }

  camera(
    cameraX + shakeOffsetX, -200 + shakeOffsetY, cameraZ + 200 + shakeOffsetZ, // Eye position
    lookAtX, 0, lookAtZ,                                                       // Look-at point
    0, 1, 0                                                                    // Up vector
  );

  // Cube
  stroke("yellow");
  push();
  translate(cubePosInRectX, 0, cubePosInRectZ);
  rotateY(currentAngle); // Rotate cube with smoothed angle
  
  stroke("#FFEB3B");
  
  // Front face (green)
  fill("#CDDC39");
  beginShape();
  vertex(-cubeSize, -cubeSize, cubeSize);
  vertex(cubeSize, -cubeSize, cubeSize);
  vertex(cubeSize, cubeSize, cubeSize);
  vertex(-cubeSize, cubeSize, cubeSize);
  endShape(CLOSE);

  // Back face (yellow)
  fill("#FFC107");
  beginShape();
  vertex(-cubeSize, -cubeSize, -cubeSize);
  vertex(cubeSize, -cubeSize, -cubeSize);
  vertex(cubeSize, cubeSize, -cubeSize);
  vertex(-cubeSize, cubeSize, -cubeSize);
  endShape(CLOSE);

  // Left face
  beginShape();
  vertex(-cubeSize, -cubeSize, -cubeSize);
  vertex(-cubeSize, -cubeSize, cubeSize);
  vertex(-cubeSize, cubeSize, cubeSize);
  vertex(-cubeSize, cubeSize, -cubeSize);
  endShape(CLOSE);

  // Right face
  beginShape();
  vertex(cubeSize, -cubeSize, -cubeSize);
  vertex(cubeSize, -cubeSize, cubeSize);
  vertex(cubeSize, cubeSize, cubeSize);
  vertex(cubeSize, cubeSize, -cubeSize);
  endShape(CLOSE);

  // Top face
  beginShape();
  vertex(-cubeSize, -cubeSize, -cubeSize);
  vertex(cubeSize, -cubeSize, -cubeSize);
  vertex(cubeSize, -cubeSize, cubeSize);
  vertex(-cubeSize, -cubeSize, cubeSize);
  endShape(CLOSE);

  // Bottom face
  beginShape();
  vertex(-cubeSize, cubeSize, -cubeSize);
  vertex(cubeSize, cubeSize, -cubeSize);
  vertex(cubeSize, cubeSize, cubeSize);
  vertex(-cubeSize, cubeSize, cubeSize);
  endShape(CLOSE);

  pop();
}

// Trigger the camera shake
function shakeCamera(amount, time) {
  isShaking = true;
  shakeAmount = amount;
  shakeTime = time;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    back = true;
  }
  if (keyCode === DOWN_ARROW) {
    forward = true;
  }
  if (keyCode === LEFT_ARROW) {
    left = true;
  }
  if (keyCode === RIGHT_ARROW) {
    right = true;
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW) {
    back = false;
  }
  if (keyCode === DOWN_ARROW) {
    forward = false;
  }
  if (keyCode === LEFT_ARROW) {
    left = false;
  }
  if (keyCode === RIGHT_ARROW) {
    right = false;
  }
}
