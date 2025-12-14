let theShader;

function preload() {
  theShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  shader(theShader);
  theShader.setUniform("uResolution", [width, height]);
  theShader.setUniform("uTime", millis() / 1000);

  rect(-width / 2, -height / 2, width, height);
}

function windowResized() {
  resizeCanvas(600, 600);
}
