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
let total_width = 1080;
let total_height = 1080;

// Variables for 2D array
let nx = 10; // Unit cell along x 
let ny = 10; // Unit cell along y
let unit_width = total_width / nx;
let unit_height = total_width / ny;
let grid;
let distances;         // Future 2D array, storing the distances
let angles;

// let d1 = 0.15 * unit_width; // diameter of nodes
let d1 = 0.15 * unit_width; // diameter of nodes
// let d1 = 0.75 * unit_width; // diameter of nodes
let d2 = d1 / 2;
let l_width = d1 / 4; // Linewidth

// colors

// Honey's pick
let c = [[250, 202, 231], [187, 185, 240], [200, 253, 248]];
// let c = ["#FCFAEF", "#FF6700", "#DBD0BD", "#0C5446"];
// let c = ["#EEF99D", "#546FFF", "#C5DBFF", "#FFF7EF"];


// Else
let xc;   // Center of interest
let yc;
let theta0 = - 30 * Math.PI / 180; // Initial angle for pendulum
let l = 500; //
let g = 9.81;
let period = 2 * Math.PI * Math.sqrt(l / g);

// =============================================================================
// Setup
// =============================================================================

function setup() {
  frameRate(30);
  // Initialize the canvas
  createCanvas(total_width, total_height);
  if (record) {
    saveGif('test.gif', 3 * period, { delay: 0, units: 'frames' });
  }

  // xc = width / 2;
  // yc = height / 2;
  grid = get_grid_coordinates(nx, ny);
  add_noise_grid(grid, 0.3 * unit_width, 0.3 * unit_height);

  noLoop();
}


// =============================================================================
// Draw
// =============================================================================

function draw() {

  colorMode(HSL, 2 * PI);
  xc = width / 2;
  yc = height / 2;
  // xc = mouseX;
  // yc = mouseY;

  // Circulqr motion
  // xc = (0.5 + 0.25 * Math.sin(2 * PI * frameCount / period)) * total_width;
  // yc = (0.5 + 0.25 * Math.cos(2 * PI * frameCount / period)) * total_height;

  // let theta = theta0 * Math.cos(2 * PI * frameCount / period);
  // xc = l * Math.sin(theta) + total_width / 2;
  // yc = l * Math.cos(theta);

  // re-compute the values
  [distances, angles] = compute_distance_and_angle(grid, xc, yc);

  // draw
  // background(c[0]);
  // background(2 * PI, 2 * PI, 2 * PI);
  // draw_grid(grid);
  background(2 * PI, 2 * PI, 2 * PI);
  draw_grid(grid);


  noStroke();
  // fill(c[1]);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      // fill(angles[i][j], 2 * PI, 1 * PI * (1 - distances[i][j] / (0.5 * height)));

      // fill(angles[i][j] + PI, 2 * PI, PI);
      fill(angles[i][j] + PI, 1 * PI, 1.6 * PI);
      circle(grid[i][j][0], grid[i][j][1], d1);
      // // Draw the unit cell
      // unit_cell(grid[i][j][0], grid[i][j][1], distances[i][j], angles[i][j]);
    }
  }
  // // Add white circle in the middle
  // fill(c[2]);
  // noStroke();
  // circle(xc, yc, d1);
}

// =============================================================================
// Unit cell behavior
// =============================================================================

function unit_cell(x, y, distance, angle) {
  ellipseMode(RADIUS);
  angleMode(RADIANS);
  // colorMode(HSL, 2 * PI);

  // let color_shape = color(angles[ix][iy], 2 * PI, 1 * PI * (1 - distances[ix][iy] / (0.5 * total_height)));

  // color_shape = color(100, 0, 0);
  push();
  noStroke();
  translate(x, y);

  // Draw ellipse
  rotate(angle);
  fill(c[1]); // Fill with random grayscale value
  ellipse(0, 0, d1, d2);

  pop();
}

// =============================================================================
// Helper
// =============================================================================

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}

function get_grid_coordinates(nx, ny) {
  /*
  Create a grid of nx by ny points within the canvas (width, height).  
  */
  let grid = [];
  let unit_width = width / nx;
  let unit_height = height / ny;

  for (let ix = 0; ix < nx; ix++) {
    grid[ix] = [];
    let x = (ix + 0.5) * unit_width;
    for (let iy = 0; iy < ny; iy++) {
      let y = (iy + 0.5) * unit_height;
      // grid[ix][iy] = [x, y];
      grid[ix][iy] = [x, y];
    }
  }
  return grid
}

function add_noise_grid(grid, xmax, ymax) {
  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      grid[ix][iy] = [grid[ix][iy][0] + 2 * (Math.random() - 0.5) * xmax,
      grid[ix][iy][1] + 2 * (Math.random() - 0.5) * ymax];
    }
  }
}

function draw_grid(grid) {
  // push();
  // Drawing options
  stroke("#C7DCE3");
  strokeWeight(l_width);

  // Draw line between grid nodes
  for (let i = 0; i < nx - 1; i++) {
    for (let j = 0; j < ny - 1; j++) {
      // stroke(color(angles[i][j], 2 * PI, 1 * PI * (1 - distances[i][j] / (0.5 * height))));

      // Line to the right
      line(grid[i][j][0], grid[i][j][1],
        grid[i + 1][j][0], grid[i + 1][j][1]);
      // Line to top
      line(grid[i][j][0], grid[i][j][1],
        grid[i][j + 1][0], grid[i][j + 1][1]);
    }
  }
  // Draw last bottom line
  for (let i = 0; i < nx - 1; i++) {
    line(grid[i][ny - 1][0], grid[i][ny - 1][1],
      grid[i + 1][ny - 1][0], grid[i + 1][ny - 1][1]);
  }
  // Draw most right line
  for (let j = 0; j < ny - 1; j++) {
    line(grid[nx - 1][j][0], grid[nx - 1][j][1],
      grid[nx - 1][j + 1][0], grid[nx - 1][j + 1][1]);
  }
  // pop();
}

function compute_distance_and_angle(grid, xc, yc) {
  let distances = [];
  let angles = [];
  for (let ix = 0; ix < nx; ix++) {
    distances[ix] = [];
    angles[ix] = [];
    for (let iy = 0; iy < ny; iy++) {
      let y = (iy + 0.5) * unit_height;
      distances[ix][iy] = dist(grid[ix][iy][0], grid[ix][iy][1], xc, yc);
      angles[ix][iy] = Math.atan2(grid[ix][iy][1] - yc, grid[ix][iy][0] - xc);
    }
  }
  return [distances, angles]
}
