const MAX_SIZE = 8;

const TILE = {
  GRASS: 0,
  FLOOR: 1,
};

let gridSize = 8;
let cellSize = 64;

let imgs = {};
let grid = [];
let hasGenerated = false;

function preload() {
  imgs.floor = loadImage("tiles/floor.png");
  imgs.grass = loadImage("tiles/grass.png");

  imgs.wallTop = loadImage("tiles/floor_wall_top.png");
  imgs.wallBottom = loadImage("tiles/floor_wall_bottom.png");
  imgs.wallLeft = loadImage("tiles/floor_wall_left.png");
  imgs.wallRight = loadImage("tiles/floor_wall_right.png");

  imgs.cornerTL = loadImage("tiles/floor_wall_corner_top_left.png");
  imgs.cornerTR = loadImage("tiles/floor_wall_corner_top_right.png");
  imgs.cornerBL = loadImage("tiles/floor_wall_corner_bottom_left.png");
  imgs.cornerBR = loadImage("tiles/floor_wall_corner_bottom_right.png");

  imgs.innerDiagTL = loadImage("tiles/floor_inner_diagonal_top_left.png");
  imgs.innerDiagTR = loadImage("tiles/floor_inner_diagonal_top_right.png");
  imgs.innerDiagBL = loadImage("tiles/floor_inner_diagonal_bottom_left.png");
  imgs.innerDiagBR = loadImage("tiles/floor_inner_diagonal_bottom_right.png");
}

function setup() {
  if (imgs.floor && imgs.floor.width > 0) cellSize = imgs.floor.width;

  gridSize = constrain(gridSize, 2, MAX_SIZE);
  createCanvas(gridSize * cellSize, gridSize * cellSize);
  noSmooth();

  generateDungeon();
}

function draw() {
  background(255,255,255,1);
  if (!hasGenerated) return;
  renderDungeon();
}

function keyPressed() {
  if (key === "r" || key === "R" || key === " ") generateDungeon();
}

function generateDungeon() {
  gridSize = constrain(gridSize, 2, MAX_SIZE);
  resizeCanvas(gridSize * cellSize, gridSize * cellSize);

  const wfc = new WfcBinary(gridSize, gridSize);

  let result = wfc.run(8000);

result = keepLargestFloorRegion(result);
result = closeDungeonMask(result, 3);
result = fillDiagonalGaps(result, 2);
result = removeThinNotches(result, 2);
result = closeDungeonMask(result, 2);

  grid = result;
  hasGenerated = true;
}

function renderDungeon() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const px = x * cellSize;
      const py = y * cellSize;

      if (grid[y][x] === TILE.GRASS) {
        image(imgs.grass, px, py, cellSize, cellSize);
        continue;
      }

      const neigh = {
        n: getCell(x, y - 1),
        s: getCell(x, y + 1),
        w: getCell(x - 1, y),
        e: getCell(x + 1, y),
        nw: getCell(x - 1, y - 1),
        ne: getCell(x + 1, y - 1),
        sw: getCell(x - 1, y + 1),
        se: getCell(x + 1, y + 1),
      };

      const variant = pickTileVariant(neigh);
      image(variant, px, py, cellSize, cellSize);
    }
  }
}

function pickTileVariant(neigh) {
  const nF = neigh.n === TILE.FLOOR;
  const sF = neigh.s === TILE.FLOOR;
  const wF = neigh.w === TILE.FLOOR;
  const eF = neigh.e === TILE.FLOOR;

  const nG = neigh.n === TILE.GRASS;
  const sG = neigh.s === TILE.GRASS;
  const wG = neigh.w === TILE.GRASS;
  const eG = neigh.e === TILE.GRASS;

  // Inner diagonals case A (your first request):
  // Two adjacent floors, but diagonal is grass.
  if (nF && wF && neigh.nw === TILE.GRASS) return imgs.innerDiagTL;
  if (nF && eF && neigh.ne === TILE.GRASS) return imgs.innerDiagTR;
  if (sF && wF && neigh.sw === TILE.GRASS) return imgs.innerDiagBL;
  if (sF && eF && neigh.se === TILE.GRASS) return imgs.innerDiagBR;

  // Two adjacent grass sides, but diagonal is floor (diagonal touch).
  if (nG && wG && neigh.nw === TILE.FLOOR) return imgs.innerDiagTL;
  if (nG && eG && neigh.ne === TILE.FLOOR) return imgs.innerDiagTR;
  if (sG && wG && neigh.sw === TILE.FLOOR) return imgs.innerDiagBL;
  if (sG && eG && neigh.se === TILE.FLOOR) return imgs.innerDiagBR;

  // Outer corners: two adjacent grass sides.
  if (nG && wG) return imgs.cornerTL;
  if (nG && eG) return imgs.cornerTR;
  if (sG && wG) return imgs.cornerBL;
  if (sG && eG) return imgs.cornerBR;

  // Straight walls.
  if (nG) return imgs.wallTop;
  if (sG) return imgs.wallBottom;
  if (wG) return imgs.wallLeft;
  if (eG) return imgs.wallRight;

  return imgs.floor;
}

function getCell(x, y) {
  if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return TILE.GRASS;
  return grid[y][x];
}
function removeThinNotches(src, iterations = 2) {
  let out = src.map(r => r.slice());
  const h = out.length;
  const w = out[0].length;

  for (let it = 0; it < iterations; it++) {
    const next = out.map(r => r.slice());

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        if (out[y][x] !== TILE.GRASS) continue;

        const n = out[y - 1][x];
        const s = out[y + 1][x];
        const wv = out[y][x - 1];
        const e = out[y][x + 1];

        const verticalFloor = n === TILE.FLOOR && s === TILE.FLOOR;
        const horizontalFloor = wv === TILE.FLOOR && e === TILE.FLOOR;

        if (verticalFloor || horizontalFloor) {
          next[y][x] = TILE.FLOOR;
        }
      }
    }

    out = next;
    forceBorderGrass(out);
  }

  return out;
}
function fillDiagonalGaps(src, iterations = 2) {
  let out = src.map(r => r.slice());
  const h = out.length;
  const w = out[0].length;

  for (let it = 0; it < iterations; it++) {
    const next = out.map(r => r.slice());

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        if (out[y][x] !== TILE.GRASS) continue;

        let diagFloors = 0;
        if (out[y - 1][x - 1] === TILE.FLOOR) diagFloors++;
        if (out[y - 1][x + 1] === TILE.FLOOR) diagFloors++;
        if (out[y + 1][x - 1] === TILE.FLOOR) diagFloors++;
        if (out[y + 1][x + 1] === TILE.FLOOR) diagFloors++;

        if (diagFloors >= 2) {
          next[y][x] = TILE.FLOOR;
        }
      }
    }

    out = next;
    forceBorderGrass(out);
  }

  return out;
}


/* WFC binary mask: GRASS or FLOOR, with a center bias to get cave blobs */
class WfcBinary {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    this.cells = [];
    for (let y = 0; y < h; y++) {
      const row = [];
      for (let x = 0; x < w; x++) {
        row.push({ options: [TILE.GRASS, TILE.FLOOR] });
      }
      this.cells.push(row);
    }

    // Force border grass so outside exists
    for (let x = 0; x < w; x++) {
      this.force(x, 0, TILE.GRASS);
      this.force(x, h - 1, TILE.GRASS);
    }
    for (let y = 0; y < h; y++) {
      this.force(0, y, TILE.GRASS);
      this.force(w - 1, y, TILE.GRASS);
    }

    // Seed floors near center
    const seeds = max(2, floor((w * h) / 16));
    for (let i = 0; i < seeds; i++) {
      const p = this.pickCenterBiasedCell();
      this.force(p.x, p.y, TILE.FLOOR);
    }
  }

  run(maxSteps) {
    // Propagate from forced cells first
    this.propagateAllForced();

    let steps = 0;
    while (steps < maxSteps) {
      steps++;

      const next = this.findLowestEntropyCell();
      if (!next) break;

      this.collapseCell(next.x, next.y);
      this.propagate([{ x: next.x, y: next.y }]);
    }

    const out = [];
    for (let y = 0; y < this.h; y++) {
      const row = [];
      for (let x = 0; x < this.w; x++) {
        const c = this.cells[y][x];
        if (c.options.length === 1) row.push(c.options[0]);
        else row.push(this.weightedPick(x, y, c.options));
      }
      out.push(row);
    }

    // Ensure some floor exists
    if (countTiles(out, TILE.FLOOR) < 6) {
      const cx = floor(this.w / 2);
      const cy = floor(this.h / 2);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx > 0 && ny > 0 && nx < this.w - 1 && ny < this.h - 1) out[ny][nx] = TILE.FLOOR;
        }
      }
    }

    return out;
  }

  force(x, y, value) {
    this.cells[y][x].options = [value];
  }

  pickCenterBiasedCell() {
    const cx = (this.w - 1) / 2;
    const cy = (this.h - 1) / 2;

    let bestX = 1;
    let bestY = 1;
    let bestD = 1e9;

    for (let i = 0; i < 12; i++) {
      const x = floor(random(1, this.w - 1));
      const y = floor(random(1, this.h - 1));
      const dx = x - cx;
      const dy = y - cy;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        bestX = x;
        bestY = y;
      }
    }
    return { x: bestX, y: bestY };
  }

  findLowestEntropyCell() {
    let best = null;
    let bestEntropy = 1e9;

    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const c = this.cells[y][x];
        if (c.options.length <= 1) continue;

        const e = c.options.length + random(0.0001, 0.01);
        if (e < bestEntropy) {
          bestEntropy = e;
          best = { x, y };
        }
      }
    }
    return best;
  }

  collapseCell(x, y) {
    const c = this.cells[y][x];
    if (c.options.length <= 1) return;
    const picked = this.weightedPick(x, y, c.options);
    c.options = [picked];
  }

  weightedPick(x, y, options) {
    // More floor near center, more grass near border
    const cx = (this.w - 1) / 2;
    const cy = (this.h - 1) / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = sqrt(dx * dx + dy * dy);
    const maxDist = sqrt(cx * cx + cy * cy);
    const t = maxDist > 0 ? dist / maxDist : 0;

    const floorWeight = lerp(5.0, 0.9, t);
    const grassWeight = lerp(0.9, 5.0, t);

    let sum = 0;
    const weights = [];
    for (const o of options) {
      const w = (o === TILE.FLOOR) ? floorWeight : grassWeight;
      weights.push(w);
      sum += w;
    }

    let r = random(0, sum);
    for (let i = 0; i < options.length; i++) {
      r -= weights[i];
      if (r <= 0) return options[i];
    }
    return options[options.length - 1];
  }

  propagateAllForced() {
    const q = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.cells[y][x].options.length === 1) q.push({ x, y });
      }
    }
    this.propagate(q);
  }

  propagate(queue) {
    while (queue.length > 0) {
      const cur = queue.shift();
      const x = cur.x;
      const y = cur.y;

      const c = this.cells[y][x];
      if (c.options.length !== 1) continue;

      const curVal = c.options[0];

      const ns = [
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y },
      ];

      for (const n of ns) {
        if (n.x < 0 || n.y < 0 || n.x >= this.w || n.y >= this.h) continue;

        const nc = this.cells[n.y][n.x];
        if (nc.options.length <= 1) continue;

        const before = nc.options.slice();
        nc.options = this.softBiasPrune(n.x, n.y, nc.options, curVal);

        if (nc.options.length !== before.length) queue.push({ x: n.x, y: n.y });
      }
    }
  }

  softBiasPrune(x, y, options, neighborVal) {
    // Mild pruning to reduce checkerboards on tiny grids, without hard rules.
    if (options.length <= 1) return options;
    const keepFloorMore = neighborVal === TILE.FLOOR;

    // 20 percent chance to prune one option based on neighbor
    const roll = random();
    if (roll > 0.20) return options;

    if (keepFloorMore && options.includes(TILE.GRASS) && options.includes(TILE.FLOOR)) {
      return [TILE.FLOOR, TILE.GRASS]; // keep both, no hard prune
    }
    if (!keepFloorMore && options.includes(TILE.GRASS) && options.includes(TILE.FLOOR)) {
      return [TILE.GRASS, TILE.FLOOR]; // keep both, no hard prune
    }
    return options;
  }
}

/* Post processing */

function keepLargestFloorRegion(src) {
  const h = src.length;
  const w = src[0].length;

  const visited = Array.from({ length: h }, () => Array(w).fill(false));

  let best = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (visited[y][x]) continue;
      if (src[y][x] !== TILE.FLOOR) continue;

      const region = [];
      const q = [{ x, y }];
      visited[y][x] = true;

      while (q.length > 0) {
        const p = q.shift();
        region.push(p);

        const ns = [
          { x: p.x, y: p.y - 1 },
          { x: p.x, y: p.y + 1 },
          { x: p.x - 1, y: p.y },
          { x: p.x + 1, y: p.y },
        ];

        for (const n of ns) {
          if (n.x < 0 || n.y < 0 || n.x >= w || n.y >= h) continue;
          if (visited[n.y][n.x]) continue;
          if (src[n.y][n.x] !== TILE.FLOOR) continue;
          visited[n.y][n.x] = true;
          q.push(n);
        }
      }

      if (region.length > best.length) best = region;
    }
  }

  const out = src.map(r => r.slice());
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[y][x] = TILE.GRASS;
  for (const p of best) out[p.y][p.x] = TILE.FLOOR;

  forceBorderGrass(out);
  return out;
}

function closeDungeonMask(src, iterations) {
  let out = src.map(r => r.slice());
  const h = out.length;
  const w = out[0].length;

  for (let it = 0; it < iterations; it++) {
    const next = out.map(r => r.slice());

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const here = out[y][x];

        const n = out[y - 1][x];
        const s = out[y + 1][x];
        const wv = out[y][x - 1];
        const e = out[y][x + 1];

        const grassSides =
          (n === TILE.GRASS ? 1 : 0) +
          (s === TILE.GRASS ? 1 : 0) +
          (wv === TILE.GRASS ? 1 : 0) +
          (e === TILE.GRASS ? 1 : 0);

        const floorSides =
          (n === TILE.FLOOR ? 1 : 0) +
          (s === TILE.FLOOR ? 1 : 0) +
          (wv === TILE.FLOOR ? 1 : 0) +
          (e === TILE.FLOOR ? 1 : 0);

        // Remove spikes that create "open" boundary cases
        if (here === TILE.FLOOR && grassSides >= 3) {
          next[y][x] = TILE.GRASS;
          continue;
        }

        // Fill holes that can create leaks and awkward cavities
        if (here === TILE.GRASS && floorSides >= 3) {
          next[y][x] = TILE.FLOOR;
          continue;
        }

        next[y][x] = here;
      }
    }

    out = next;
    forceBorderGrass(out);
  }

  return out;
}

function smoothOnce(src) {
  const h = src.length;
  const w = src[0].length;
  const out = src.map(r => r.slice());

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const floors = neighborCount4(src, x, y, TILE.FLOOR);
      if (src[y][x] === TILE.FLOOR && floors <= 1) out[y][x] = TILE.GRASS;
      if (src[y][x] === TILE.GRASS && floors >= 3) out[y][x] = TILE.FLOOR;
    }
  }

  forceBorderGrass(out);
  return out;
}

function neighborCount4(src, x, y, value) {
  let c = 0;
  if (src[y - 1][x] === value) c++;
  if (src[y + 1][x] === value) c++;
  if (src[y][x - 1] === value) c++;
  if (src[y][x + 1] === value) c++;
  return c;
}

function forceBorderGrass(arr) {
  const h = arr.length;
  const w = arr[0].length;

  for (let x = 0; x < w; x++) {
    arr[0][x] = TILE.GRASS;
    arr[h - 1][x] = TILE.GRASS;
  }
  for (let y = 0; y < h; y++) {
    arr[y][0] = TILE.GRASS;
    arr[y][w - 1] = TILE.GRASS;
  }
}

function countTiles(src, value) {
  let c = 0;
  for (let y = 0; y < src.length; y++) {
    for (let x = 0; x < src[0].length; x++) {
      if (src[y][x] === value) c++;
    }
  }
  return c;
}