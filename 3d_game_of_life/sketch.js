// B5 / S45
const BIRTH = [5];// Dead cell becomes alive if neighbor count is in this list
const SURVIVE = [4, 5];// Live cell survives if neighbor count is in this list

let gridSize = 16;// number of cells per axis
let cellSize = 30;// visual size of each cube ~ 21
let grid;
let nextGrid;

function setup() {
  createCanvas(640, 640, WEBGL);
  frameRate(8);

  grid = create3DArray(gridSize);
  nextGrid = create3DArray(gridSize);

  randomizeGrid();
}

function draw() {
  background(0);
  orbitControl();
  ambientLight(200);
  directionalLight(255, 240, 100, 0.5, -1, -0.3);

  // center
  let offset = - (gridSize * cellSize) / 2;
  translate(offset, offset, offset);

  // draw cells
  noStroke();
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        if (grid[x][y][z] === 1) {
          push();
          translate(
            x * cellSize + cellSize * 0.5,
            y * cellSize + cellSize * 0.5,
            z * cellSize + cellSize * 0.5
          );

          // simple color variation by layer
          let c = map(z, 0, gridSize - 1, 50, 255);
          let g = random(255);
          let b = random(255);
          ambientMaterial(c, g, b);

          box(cellSize * 0.75);
          pop();
        }
      }
    }
  }

  // update to next generation
  updateGrid();
}

function create3DArray(n) {
  let arr = new Array(n);
  for (let x = 0; x < n; x++) {
    arr[x] = new Array(n);
    for (let y = 0; y < n; y++) {
      arr[x][y] = new Array(n).fill(0);
    }
  }
  return arr;
}

function randomizeGrid() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        grid[x][y][z] = random() < 0.25 ? 1 : 0;
      }
    }
  }
}

function updateGrid() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {

        let alive = grid[x][y][z] === 1;
        let neighbors = countNeighbors(x, y, z);
        let nextState = 0;

        if (alive) {
          nextState = SURVIVE.includes(neighbors) ? 1 : 0;
        } else {
          nextState = BIRTH.includes(neighbors) ? 1 : 0;
        }

        nextGrid[x][y][z] = nextState;
      }
    }
  }

  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;
}

function countNeighbors(x, y, z) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;

        let nx = (x + dx + gridSize) % gridSize;
        let ny = (y + dy + gridSize) % gridSize;
        let nz = (z + dz + gridSize) % gridSize;

        count += grid[nx][ny][nz];
      }
    }
  }
  return count;
}

function keyPressed() {
  if (key === ' ') {
    randomizeGrid();
  }
}