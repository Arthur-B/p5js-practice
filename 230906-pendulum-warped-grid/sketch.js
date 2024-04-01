/*
GIF to mp4:
ffmpeg -i test.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" video.mp4


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
let nx = 21; // Unit cell along x 
let ny = 21; // Unit cell along y
let unit_width = total_width / nx;
let unit_height = total_width / ny;
let grid;
let distances;         // Future 2D array, storing the distances
let angles;

// let d1 = 0.15 * unit_width; // diameter of nodes
// let d1 = 0.15 * unit_width; // diameter of nodes
let d1 = 0.5 * unit_width; // diameter of nodes
let d2 = d1 / 2;
let l_width = d1 / 4; // Linewidth

// colors

// Honey's pick
// let c = [[250, 202, 231], [187, 185, 240], [200, 253, 248]];
// let c = ["#FCFAEF", "#FF6700", "#DBD0BD", "#0C5446"];
// let c = ["#EEF99D", "#546FFF", "#C5DBFF", "#FFF7EF"];
let c;


// Else
let xc;   // Center of interest
let yc;
let theta0 = - 30 * Math.PI / 180; // Initial angle for pendulum
let l = 500; //
let g = 9.81;
// let period = 2 * Math.PI * Math.sqrt(l / g);
let period = 120;

// =============================================================================
// Setup
// =============================================================================

function setup() {

  c = [color(240, 37, 25),
  color(255, 167, 100),
  color(245, 255, 128),
  color(174, 255, 144),
  ];
  frameRate(30);
  // Initialize the canvas
  createCanvas(total_width, total_height);
  if (record) {
    saveGif('test.gif', 3 * period, { delay: 0, units: 'frames' });
  }

  // xc = width / 2;
  // yc = height / 2;
  grid = get_grid_vectors(nx, ny);
  // add_noise_grid(grid, 0.3 * unit_width, 0.3 * unit_height);

  // noLoop();
}


// =============================================================================
// Draw
// =============================================================================

function draw() {

  colorMode(HSL, 2 * PI);
  // xc = width / 2;
  // yc = height / 2;
  // xc = mouseX;
  // yc = mouseY;

  // Circulqr motion
  // xc = (0.5 + 0.25 * Math.sin(2 * PI * frameCount / period)) * total_width;
  // yc = (0.5 + 0.25 * Math.cos(2 * PI * frameCount / period)) * total_height;


  let theta = theta0 * Math.cos(2 * PI * frameCount / period);
  xc = l * Math.sin(theta) + total_width / 2;
  yc = l * Math.cos(theta);

  // Center point vector
  center = createVector(xc, yc);

  // Adjust the grid
  let grid_adjusted = [];
  for (let ix = 0; ix < nx; ix++) {
    grid_adjusted[ix] = [];
    for (let iy = 0; iy < ny; iy++) {
      let delta = p5.Vector.sub(grid[ix][iy], center);
      let delta_scaled = p5.Vector.mult(delta, 40 / delta.mag());
      grid_adjusted[ix][iy] = p5.Vector.add(grid[ix][iy], delta_scaled);
    }
  }

  // re-compute the values
  // [distances, angles] = compute_distance_and_angle(grid_adjusted, xc, yc);

  // draw
  // background(c[0]);
  // background(2 * PI, 2 * PI, 2 * PI);
  // draw_grid(grid);
  background(2 * PI, 2 * PI, 2 * PI);
  draw_grid(grid_adjusted);


  noStroke();
  // fill(c[1]);
  // fill(255, 124, 0);
  // circle(center.x, center.y, d1);

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {

      // Normal grid
      // fill(0, 0, 0);
      // circle(grid[i][j][0], grid[i][j][1], d1);

      // Deformed grid
      // fill(grid_adjusted[i][j].heading() + PI, 1 * PI, 1.6 * PI);
      let delta = p5.Vector.sub(grid[i][j], center);
      let my_color = get_color(c, delta.mag() / (0.5 * width));
      fill(my_color);
      circle(grid_adjusted[i][j].x, grid_adjusted[i][j].y, d1);
      // // Draw the unit cell
      // unit_cell(grid[i][j][0], grid[i][j][1], distances[i][j], angles[i][j]);
    }
  }
}

// =============================================================================
// Unit cell behavior
// =============================================================================

// function unit_cell(x, y, distance, angle) {
//   ellipseMode(RADIUS);
//   angleMode(RADIANS);
//   // colorMode(HSL, 2 * PI);

//   // let color_shape = color(angles[ix][iy], 2 * PI, 1 * PI * (1 - distances[ix][iy] / (0.5 * total_height)));

//   // color_shape = color(100, 0, 0);
//   push();
//   noStroke();
//   translate(x, y);

//   // Draw ellipse
//   rotate(angle);
//   fill(c[1]); // Fill with random grayscale value
//   ellipse(0, 0, d1, d2);

//   pop();
// }

// =============================================================================
// Helper
// =============================================================================

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}

function get_grid_vectors(nx, ny) {
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
      grid[ix][iy] = createVector(x, y);
    }
  }
  return grid
}

// function add_noise_grid(grid, xmax, ymax) {
//   for (let ix = 0; ix < nx; ix++) {
//     for (let iy = 0; iy < ny; iy++) {
//       grid[ix][iy] = [grid[ix][iy][0] + 2 * (Math.random() - 0.5) * xmax,
//       grid[ix][iy][1] + 2 * (Math.random() - 0.5) * ymax];
//     }
//   }
// }

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
      line(grid[i][j].x, grid[i][j].y,
        grid[i + 1][j].x, grid[i + 1][j].y);
      // Line to top
      line(grid[i][j].x, grid[i][j].y,
        grid[i][j + 1].x, grid[i][j + 1].y);
    }
  }
  // Draw last bottom line
  for (let i = 0; i < nx - 1; i++) {
    line(grid[i][ny - 1].x, grid[i][ny - 1].y,
      grid[i + 1][ny - 1].x, grid[i + 1][ny - 1].y);
  }
  // Draw most right line
  for (let j = 0; j < ny - 1; j++) {
    line(grid[nx - 1][j].x, grid[nx - 1][j].y,
      grid[nx - 1][j + 1].x, grid[nx - 1][j + 1].y);
  }
  // pop();
}

function get_color(c, ratio) {
  ratio = ratio * 4;
  if (ratio < 1) {
    return lerpColor(c[0], c[1], ratio)
  } else if (ratio < 2) {
    return lerpColor(c[1], c[2], ratio - 1)
  } else {
    return lerpColor(c[2], c[3], ratio - 2)
  }
}

// function compute_distance_and_angle(grid, xc, yc) {
//   let distances = [];
//   let angles = [];
//   for (let ix = 0; ix < nx; ix++) {
//     distances[ix] = [];
//     angles[ix] = [];
//     for (let iy = 0; iy < ny; iy++) {
//       let y = (iy + 0.5) * unit_height;
//       distances[ix][iy] = dist(grid[ix][iy][0], grid[ix][iy][1], xc, yc);
//       angles[ix][iy] = Math.atan2(grid[ix][iy][1] - yc, grid[ix][iy][0] - xc);
//     }
//   }
//   return [distances, angles]
// }
