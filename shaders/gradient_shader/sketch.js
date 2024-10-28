let exampleShader;

// load in the shader
function preload() {
  exampleShader = loadShader('gradient.vert', 'gradient.frag');
}

function setup() {
  createCanvas(800, 800, WEBGL);
  shader(exampleShader);
}

function draw() {
  // Run shader
  rect(- width/2, - height/2, width);
}