//
// Qix-style movement in p5.js: A dynamic line that bounces off edges, inspired by the classic arcade game.
//

let myLines = [];

let canvasX = 600;
let canvasY = 600;

let maxLines = 550;

let d1 = { x: 2, y: 1 };
let d2 = { x: 1, y: -2 };

// Define two colors to lerp between
let colorStart, colorEnd;
let nextColorEnd;
let lerpProgress = 0; // Track progress of the lerp

let colorChangeInterval = 200; // Change colors every 200 frames
let fadeSpeed = 1; // Speed at which lines fade

// Function to generate a random color
function getRandomColor() {
  return color(random(255), random(255), random(255));
}

// run once at the beginning
function setup() {
  // Set square canvas
  createCanvas(canvasX, canvasY);

  // Define the starting and ending colors
  colorStart = getRandomColor(); // Constant color for first line(s)
  colorEnd = getRandomColor(); // First color transition
  nextColorEnd = getRandomColor(); // Next target color for smooth transition

  // Create a list of random points and assign the first line the constant color and full opacity
  myLines.push({
    x1: Math.random() * canvasX,
    y1: Math.random() * canvasX,
    x2: Math.random() * canvasY,
    y2: Math.random() * canvasY,
    color: colorStart,
    opacity: 255, // Start new lines with full opacity
  });

  strokeWeight(1);
}

// run every frame
function draw() {
  background(0);

  // Gradually increase lerpProgress over time for smooth color transition
  lerpProgress += 1 / colorChangeInterval;

  if (lerpProgress >= 1) {
    // Once the color transition is done, set new colors for the next transition
    colorStart = colorEnd;
    colorEnd = nextColorEnd;
    nextColorEnd = getRandomColor();
    lerpProgress = 0; // Reset progress for the next transition
  }

  // Draw the lines in reverse order (oldest lines drawn last)
  for (let i = myLines.length - 1; i >= 0; i--) {
    let l = myLines[i];

    // Decrease opacity for older lines
    l.opacity = max(l.opacity - fadeSpeed, 0); // Fade line gradually

    // Set stroke color with the current opacity
    let fadedColor = color(
      red(l.color),
      green(l.color),
      blue(l.color),
      l.opacity
    );
    stroke(fadedColor);

    // Draw the line with fading effect
    line(l.x1, l.y1, l.x2, l.y2);
  }

  // Check for collision and move the first line
  let l = myLines[0];
  if (l.x1 + d1.x > canvasX || l.x1 + d1.x < 0) d1.x = -d1.x;
  if (l.x2 + d2.x > canvasX || l.x2 + d2.x < 0) d2.x = -d2.x;
  if (l.y1 + d1.y > canvasY || l.y1 + d1.y < 0) d1.y = -d1.y;
  if (l.y2 + d2.y > canvasY || l.y2 + d2.y < 0) d2.y = -d2.y;

  // Add a new line with interpolated color between colorStart and colorEnd
  let newLineColor = lerpColor(colorStart, colorEnd, lerpProgress);

  let newLine = {
    x1: l.x1 + d1.x,
    y1: l.y1 + d1.y,
    x2: l.x2 + d2.x,
    y2: l.y2 + d2.y,
    color: newLineColor,
    opacity: 255, // New lines start with full opacity
  };

  myLines.unshift(newLine);

  // Remove last line if opacity is zero (fully faded out)
  if (myLines.length > maxLines && myLines[myLines.length - 1].opacity <= 0) {
    myLines.pop();
  }
}
