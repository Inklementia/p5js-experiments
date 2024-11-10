let angle = 0;
let boxDistance = 120; // Distance from the center point
let boxSize = 120;
let rotationSpeed = 0.5;

function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(0); // Black background

  // Add a point light controlled by the mouse position
  pointLight(255, 255, 255, mouseX - width / 2, mouseY - height / 2, 200);

  ambientLight(60);

  strokeWeight(0);
  fill(80); // gray fill for the boxes

  // Rotate the entire scene around the center point
  rotateZ(angle);

  // first box
  push();
  translate(-boxDistance, 0, 0); // move to the left of the center pivot
  rotateY(HALF_PI); // align face to look toward the second box
  rotateZ(angle);
  box(boxSize);
  pop();

  //  second box
  push();
  translate(boxDistance, 0, 0); // move to the right of the center pivot
  rotateY(-HALF_PI); // align face to look toward the first box
  rotateZ(angle);
  box(boxSize);
  pop();

  // Animate rotation
  angle += radians(rotationSpeed);
}
