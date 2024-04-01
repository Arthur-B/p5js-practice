/*
GIF to mp4:
ffmpeg -i animated.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" video.mp4


*/

// =============================================================================
// Variables
// =============================================================================

let record = false;
// let record = true;

// Variables for canvas
let total_width = 900;
let total_height = 900;
// Variables for 2D array
let nx = 10; // Unit cell along x 
let ny = 10; // Unit cell along y
let unit_width = total_width / nx;
let unit_height = total_width / ny;
let xc = total_width / 2;   // Center of interest
let yc = total_height / 2;
let distances = [];         // Future 2D array, storing the distances
let angles = [];

// colors
let c = [[250, 202, 231], [187, 185, 240], [200, 253, 248]];

// Else
let theta0 = - 30 * Math.PI / 180;
console.log(theta0);
let l = 500; //
let g = 9.81;
let period = 2 * Math.PI * Math.sqrt(l / g);

// =============================================================================
// Setup
// =============================================================================

function setup() {
  frameRate(30);
  // Initialize the canvas
  createCanvas(nx * unit_width, ny * unit_height);
  if (record) {
    saveGif('test.gif', 3 * period, { delay: 0, units: 'frames' });
  }

}


// =============================================================================
// Draw
// =============================================================================

function draw() {

  // xc = mouseX;
  // yc = mouseY;

  // // Circulqr motion
  // xc = (0.5 + 0.25 * Math.sin(2 * PI * frameCount / period)) * total_width;
  // yc = (0.5 + 0.25 * Math.cos(2 * PI * frameCount / period)) * total_height;

  let theta = theta0 * Math.cos(2 * PI * frameCount / period);
  xc = l * Math.sin(theta) + total_width / 2;
  yc = l * Math.cos(theta);

  // re-compute the values
  compute_distance_and_angle();

  // draw
  background(c[0]);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      // Draw the unit cell
      unit_cell(i, j);
    }
  }
  // Add white circle in the middle
  fill(c[2]);
  noStroke();
  circle(xc, yc, 0.325 * unit_width);
}

// =============================================================================
// Unit cell behavior
// =============================================================================

function unit_cell(ix, iy) {
  ellipseMode(RADIUS);
  angleMode(RADIANS);
  // colorMode(HSL, 2 * PI);

  let color_shape = color(angles[ix][iy], 2 * PI, 1 * PI * (1 - distances[ix][iy] / (0.5 * total_height)));

  // color_shape = color(100, 0, 0);
  push();
  noStroke();
  translate((ix + 0.5) * unit_width, (iy + 0.5) * unit_height);

  // Draw ellipse
  rotate(angles[ix][iy]);
  fill(c[1]); // Fill with random grayscale value
  ellipse(0, 0, 0.325 * unit_width, 0.15 * unit_height);

  pop();
}

// =============================================================================
// Helper
// =============================================================================

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}

function compute_distance_and_angle() {
  for (let ix = 0; ix < nx; ix++) {
    distances[ix] = [];
    angles[ix] = [];
    let x = (ix + 0.5) * unit_width;
    for (let iy = 0; iy < ny; iy++) {
      let y = (iy + 0.5) * unit_height;
      distances[ix][iy] = dist(xc, yc, x, y);
      angles[ix][iy] = Math.atan2(y - yc, x - xc) + PI / 2;
    }
  }
}
