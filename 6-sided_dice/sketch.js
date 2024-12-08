let img;
let pos = 100;  // half of 200
let texW = 600;
let texH = 450;
let faceSize = 150; // Each face is 150x150 in the texture

function preload() {
  img = loadImage("cube-texture.png");
}

function setup() {
  createCanvas(600, 600, WEBGL);
  textureMode(NORMAL);
  noStroke();
}

function draw() {
  background("#e26159");

  orbitControl(10,10);

  texture(img);
  beginShape(TRIANGLES);

  // front face: (150,150) to (300,300)
  drawFace(-pos, -pos, pos,
            pos, -pos, pos,
            pos,  pos, pos,
           -pos,  pos, pos,
           150,150);

  // back face: (450,150) to (600,300)
  drawFace(pos, -pos, -pos,
           -pos, -pos, -pos,
           -pos,  pos, -pos,
            pos,  pos, -pos,
           450,150);

  // left face: (0,150) to (150,300)
  drawFace(-pos, -pos, -pos,
           -pos, -pos,  pos,
           -pos,  pos,  pos,
           -pos,  pos, -pos,
           0,150);

  // right face: (300,150) to (450,300)
  drawFace(pos, -pos, pos,
           pos, -pos, -pos,
           pos,  pos, -pos,
           pos,  pos, pos,
           300,150);

  // top face: (150,0) to (300,150)
  drawFace(-pos, -pos, -pos,
            pos, -pos, -pos,
            pos, -pos,  pos,
           -pos, -pos,  pos,
           150,0);

  // bottom face: (150,300) to (300,450)
  drawFace(-pos, pos, pos,
            pos, pos, pos,
            pos, pos, -pos,
           -pos, pos, -pos,
           150,300);

  endShape();
}

function drawFace(x1, y1, z1,
                  x2, y2, z2,
                  x3, y3, z3,
                  x4, y4, z4,
                  tx, ty) {
  // Half-pixel inset
  let halfPixelU = 0.5 / texW;
  let halfPixelV = 0.5 / texH;

  let u1 = tx / texW + halfPixelU;
  let v1 = ty / texH + halfPixelV;
  let u2 = (tx + faceSize) / texW - halfPixelU;
  let v2 = (ty + faceSize) / texH - halfPixelV;

  // 1 triangle: top-left, top-right, bottom-right
  vertex(x1, y1, z1, u1, v1);
  vertex(x2, y2, z2, u2, v1);
  vertex(x3, y3, z3, u2, v2);

  // 2 triangle: top-left, bottom-right, bottom-left
  vertex(x1, y1, z1, u1, v1);
  vertex(x3, y3, z3, u2, v2);
  vertex(x4, y4, z4, u1, v2);
}
