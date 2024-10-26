//
// Maurer Rose Visualization
//

let canvasX = 500;
let canvasY = 500;

let n = 6; // Start n at 6
let d = 71; // Start d at 71
let multiply = 200;

let targetN = n; // Target n for animation
let targetD = d; // Target d for animation

let smoothAnimation = true; // Toggle between smooth and instant
let currentStep = 0; // Tracks the current step for redrawing the shape

let buttons = []; // Array to store buttons
let activeButton = null; // To track the currently active button
let toggleButton; // Toggle for smooth vs instant transition

function setup() {
  createCanvas(canvasX, canvasY);
  angleMode(DEGREES);

  // Create toggle button
  toggleButton = createButton("Switch to Instant Transition");
  toggleButton.position(10, canvasY + 80);
  toggleButton.mousePressed(toggleLerpSpeed); // Set toggle button action

  // Create 10 buttons with predefined n and d values
  buttons.push(createButton("n= 2, d=39").mousePressed(() => setTarget(2, 39)));
  buttons.push(createButton("n= 3, d=47").mousePressed(() => setTarget(3, 47)));
  buttons.push(createButton("n= 4, d=31").mousePressed(() => setTarget(4, 31)));
  buttons.push(createButton("n= 5, d=97").mousePressed(() => setTarget(5, 97)));
  buttons.push(createButton("n= 6, d=71").mousePressed(() => setTarget(6, 71)));
  buttons.push(createButton("n= 7, d=19").mousePressed(() => setTarget(7, 19)));
  buttons.push(createButton("n= 8, d=45").mousePressed(() => setTarget(8, 45)));
  buttons.push(createButton("n= 9, d=33").mousePressed(() => setTarget(9, 33)));
  buttons.push(
    createButton("n=10, d=67").mousePressed(() => setTarget(10, 67))
  );
  buttons.push(
    createButton("n=11, d=55").mousePressed(() => setTarget(11, 55))
  );

  // Position buttons in a 2 row, 5 column layout
  let buttonWidth = 100;
  let buttonHeight = 30;
  let padding = 2;

  for (let i = 0; i < buttons.length; i++) {
    let x = (i % 5) * (buttonWidth + padding) + 10; // Position buttons in 5 columns
    let y = Math.floor(i / 5) * (buttonHeight + padding) + canvasY + 10; // Position buttons in 2 rows
    buttons[i].position(x, y);
  }

  // Set the default button (n=6, d=71) as active
  setActiveButton(buttons[4]); // n=6, d=71 is the starting default
}

function toggleLerpSpeed() {
  // Toggle between smooth and instant transitions
  smoothAnimation = !smoothAnimation;
  if (smoothAnimation) {
    toggleButton.html("Switch to Instant Transition");
  } else {
    toggleButton.html("Switch to Smooth Animation");
    // If switching to instant, set currentStep to maximum for instant drawing
    currentStep = 361;
  }
}

function setTarget(newN, newD) {
  targetN = newN;
  targetD = newD;

  // Reset currentStep to redraw the figure from scratch
  if (smoothAnimation) {
    currentStep = 0;
  } else {
    currentStep = 361; // For instant mode, draw the full figure in one frame
  }

  // Find the button that matches the current (newN, newD) values
  let index = null;
  if (newN === 2 && newD === 39) index = 0;
  if (newN === 3 && newD === 47) index = 1;
  if (newN === 4 && newD === 31) index = 2;
  if (newN === 5 && newD === 97) index = 3;
  if (newN === 6 && newD === 71) index = 4;
  if (newN === 7 && newD === 19) index = 5;
  if (newN === 8 && newD === 45) index = 6;
  if (newN === 9 && newD === 33) index = 7;
  if (newN === 10 && newD === 67) index = 8;
  if (newN === 11 && newD === 55) index = 9;

  if (index !== null) {
    setActiveButton(buttons[index]);
  }
}

function setActiveButton(button) {
  // Reset style for the previously active button
  if (activeButton) {
    activeButton.style("background-color", "");
  }

  // Set the new active button and update its style
  activeButton = button;
  activeButton.style("background-color", "#4CAF50"); // Green background for active button
}

function draw() {
  background(0);

  translate(width / 2, height / 2);

  noFill();
  strokeWeight(1);

  // Handle smooth or instant transition
  if (smoothAnimation) {
    n = lerp(n, targetN, 0.02); // Smooth animation
    d = lerp(d, targetD, 0.02);
  } else {
    n = targetN; // Instant transition
    d = targetD;
  }

  // Increment currentStep for drawing only in smooth mode
  if (smoothAnimation && currentStep < 361) {
    currentStep += 1;
  }

  // Draw the shape with white color for n
  stroke(255); // White color
  beginShape();

  for (let i = 0; i < currentStep; i++) {
    let k = i * d;
    let r = multiply * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }

  endShape(CLOSE);

  // Draw the shape with magenta color for d
  stroke(255, 0, 255); // Magenta color
  strokeWeight(2);
  beginShape();

  for (let i = 0; i < currentStep; i++) {
    let k = i;
    let r = multiply * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }

  endShape(CLOSE);
}
