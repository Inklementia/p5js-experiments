// reflect the ball

let move;
let ball;
let canvasX = 640;
let canvasY = 640;

let ballRadius = 10;

let isStarted = false;

function setup() {
  createCanvas(canvasX, canvasY);
  ball = createVector(width / 2, height / 2); // Ball initially in the center
  move = createVector(0, 0);
}

function draw() {
  background(0);

  if (!isStarted) {
   
    ball.x = width / 2;
    ball.y = height / 2;

    // Calculate and draw the initial arrow based on mouse position
    let v1 = createVector(mouseX - ball.x, mouseY - ball.y); // Initial arrow vector
    let boundaryPoint = findBoundaryPoint(ball, v1); // Find where the vector hits a wall
    let n = calculateNormal(boundaryPoint);
    let v2 = customReflect(v1, n); // Reflected vector from the collision point

    paintArrow(createVector(ball.x, ball.y), p5.Vector.sub(boundaryPoint, ball), '#FF0000'); // Initial arrow towards mouse
    paintArrow(boundaryPoint, v2,'#40FF00'); // Reflected arrow
    
    if (mouseIsPressed) {
      let initialSpeedMultiplier = map(v1.mag(), 0, canvasY, 5, 15);
      // Speed based on arrow length
      move.set(v1.normalize().mult(initialSpeedMultiplier)); // Set the initial movement
      isStarted = true;
    }
  } else {
    
    // Push the ball
    ball.add(move);

 
    if (ball.x >= width - ballRadius / 2 || ball.x <= ballRadius / 2) {
      let normalV = createVector(1, 0); //Normal for vertical walls
      
      console.log("Checking borders Horizonal");
      move.set(customReflect(move, normalV));
    }
    
    if (ball.y <= ballRadius / 2) {
      let normalV = createVector(0, 1); // Normal for top edge
      
      console.log("Checking borders Vertical");
      move.set(customReflect(move, normalV));
    }

    // Ball should stay within the canvas vertically (prevents going off bottom)
    if (ball.y >= height - ballRadius / 2) {
      move.y *= -1; // Reflecting down direction
      console.log("Hitting from TOP");
    }
  }

  // Paint the ball white
  stroke("#FFFFFF");
  ellipse(ball.x, ball.y, ballRadius, ballRadius);
}

// Reflect function from slides
function customReflect(v, n) {
  return p5.Vector.add(v, p5.Vector.mult(n, -2 * p5.Vector.dot(v, n)));
}

// Function to find where the vector hits the canvas boundary (chat gpt helped with this)
function findBoundaryPoint(start, direction) {
  let endPoint = createVector(start.x + direction.x, start.y + direction.y);
  let slope = direction.y / direction.x;

  if (endPoint.x > width) {
    endPoint.x = width;
    endPoint.y = start.y + slope * (width - start.x);
    
  } else if (endPoint.x < 0) {
    endPoint.x = 0;
    endPoint.y = start.y - slope * start.x;
  }
  if (endPoint.y > height) {
    
    endPoint.y = height;
    endPoint.x = start.x + (height - start.y) / slope;
    
  } else if (endPoint.y < 0) {
    endPoint.y = 0;
    endPoint.x = start.x - start.y / slope;
  }
  return endPoint;
}

// returns normal vector 
function calculateNormal(point) {
  if (point.x === 0 || point.x === width) {
    return createVector(1, 0); // Normal for vertical walls
  } else if (point.y === 0 || point.y === height) {
    return createVector(0, 1); // Normal for horizontal walls
  }
  return createVector(0, 0);
}


function paintArrow(base, vec, color1) {
  push();
  stroke(color1);
  strokeWeight(2);
  fill(color1);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
