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
// let total_width = 1080;
// let total_height = 1080;
let total_width = 1080;
let total_height = 1080;

let border = 200;

// Variables for 2D array
let nx = 40; // Unit cell along x 
let ny = 40; // Unit cell along y
let unit_width = total_width / nx;
let unit_height = total_width / ny;
let grid;
let distances;         // Future 2D array, storing the distances
let angles;

// let d1 = 0.15 * unit_width; // diameter of nodes
let d1 = 0.15 * unit_width; // diameter of nodes
// let d1 = 20; // diameter of nodes
let d2 = d1 / 2;
// let l_width = d1 / 4; // Linewidth
let l_width = 4; // Linewidth

// colors

// Honey's pick
// let c = [[250, 202, 231], [187, 185, 240], [200, 253, 248]];
// let c = ["#FCFAEF", "#FF6700", "#DBD0BD", "#0C5446"];
// let c = ["#EEF99D", "#546FFF", "#C5DBFF", "#FFF7EF"];
let c;


// Else
let xc;   // Center of interest
let yc;
// let theta0 = - 30 * Math.PI / 180; // Initial angle for pendulum
// let l = 500; //
// let g = 9.81;
// let period = 2 * Math.PI * Math.sqrt(l / g);
// let period = 120;

let centers = [];
let centers_strength = [];

// =============================================================================
// Setup
// =============================================================================

function setup() {

  // c = [color(240, 37, 25),
  // color(255, 167, 100),
  // color(245, 255, 128),
  // color(174, 255, 144),
  // ];
  c = [color(250, 202, 231), color(187, 185, 240), color(200, 253, 248)];

  frameRate(30);
  // Initialize the canvas
  createCanvas(total_width, total_height);
  if (record) {
    saveGif('test.gif', 3 * period, { delay: 0, units: 'frames' });
  }

  // Initialize the grid
  grid = get_grid_vectors(nx, ny, border);
  // add_noise_grid(grid, 0.3 * unit_width, 0.3 * unit_height);


  noLoop();
}


// =============================================================================
// Draw
// =============================================================================

function draw() {

  // xc = mouseX;
  // yc = mouseY;

  // Define centers
  // let n_center = get_random_int(10);
  let n_center = 5;
  for (let n = 0; n < n_center; n++) {
    centers[n] = createVector(get_random_float(border * 1.2, width - border * 1.2),
      get_random_float(border * 1.2, height - border * 1.2));
    centers_strength[n] = get_random_float(20, 60);
  }

  // centers[0] = createVector(width / 2, height / 2);
  // centers[1] = createVector(width * 3 / 4, height * 3 / 4);

  // // 50 ok value
  // centers_strength[0] = 50;
  // centers_strength[1] = get_random_float(10, 90);



  // Circulqr motion
  // xc = (0.5 + 0.25 * Math.sin(2 * PI * frameCount / period)) * total_width;
  // yc = (0.5 + 0.25 * Math.cos(2 * PI * frameCount / period)) * total_height;

  // let theta = theta0 * Math.cos(2 * PI * frameCount / period);
  // xc = l * Math.sin(theta) + total_width / 2;
  // yc = l * Math.cos(theta);


  // Adjust the grid
  let grid_adjusted = [];
  let delta_tot = [];
  let delta_scaled_tot = []

  for (let ix = 0; ix < nx; ix++) {
    grid_adjusted[ix] = [];
    delta_tot[ix] = [];
    delta_scaled_tot[ix] = [];
    for (let iy = 0; iy < ny; iy++) {
      delta_tot[ix][iy] = createVector(0, 0);
      delta_scaled_tot[ix][iy] = createVector(0, 0);

      for (let ic = 0; ic < centers.length; ic++) {
        let delta = p5.Vector.sub(grid[ix][iy], centers[ic]);
        let delta_scaled = p5.Vector.mult(delta, centers_strength[ic] / delta.mag());
        // Overall delta
        delta_tot[ix][iy].add(delta);
        delta_scaled_tot[ix][iy].add(delta_scaled);

      }
      // Overall grid
      grid_adjusted[ix][iy] = p5.Vector.add(grid[ix][iy], delta_scaled_tot[ix][iy]);
    }
  }

  // draw
  background(c[1]);
  draw_grid(grid_adjusted, c[2], 'curve');
  // draw_grid(grid, 'line');

  fill(c[2]);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      circle(grid_adjusted[i][j].x, grid_adjusted[i][j].y, d1);
    }
  }
  // for (let i = 0; i < nx; i++) {
  //   for (let j = 0; j < ny; j++) {
  //     push();

  //     noStroke();

  //     // Deformed grid
  //     // fill(grid_adjusted[i][j].heading() + PI, 1 * PI, 1.6 * PI);
  //     // let delta = p5.Vector.sub(grid_adjusted[i][j], center);
  //     let grid_diff = p5.Vector.sub(grid_adjusted[i][j], grid[i][j]);
  //     // console.log(grid_diff.mag());
  //     // let my_color = get_color(c, grid_diff.mag() / 50);
  //     // let my_color = lerpColor(c[0], c[1], 0 / grid_diff.mag());
  //     // let my_color = get_color(c, delta_tot[i][j].mag() / (1 * width));
  //     // let my_color = get_color(c, delta_scaled_tot[i][j].mag() / (1000 * width));
  //     // fill(my_color);

  //     // fill(c[1]);
  //     // translate(grid_adjusted[i][j].x, grid_adjusted[i][j].y);
  //     // rotate(grid_diff.heading() + PI / 2);

  //     // // circle(grid_adjusted[i][j].x, grid_adjusted[i][j].y, d1);
  //     // triangle(- unit_width / 3,
  //     //   - unit_height / 3,
  //     //   0,
  //     //   unit_height / 3,
  //     //   unit_width / 3,
  //     //   - unit_height / 3);

  //     // ellipse(0, 0, 0.6 * unit_width, 0.3 * unit_height);
  //     pop();
  //   }
  // }
  // // Draw normal grid for debugging
  // for (let i = 0; i < nx; i++) {
  //   for (let j = 0; j < ny; j++) {
  //     circle(grid[i][j].x, grid[i][j].y, d1);
  //     line(grid[i][j].x, grid[i][j].y, grid_adjusted[i][j].x, grid_adjusted[i][j].y);
  //   }
  // }
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

function get_random_float(min, max) {
  return min + Math.random() * (max - min);
}

function get_grid_vectors(nx, ny, border) {
  /*
  Create a grid of nx by ny points within the canvas (width, height).  
  */
  let grid = [];
  let unit_width = (width - 2 * border) / nx;
  let unit_height = (height - 2 * border) / ny;

  for (let ix = 0; ix < nx; ix++) {
    grid[ix] = [];
    let x = border + (ix + 0.5) * unit_width;
    for (let iy = 0; iy < ny; iy++) {
      let y = border + (iy + 0.5) * unit_height;
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

function draw_grid(grid, stroke_color, style) {
  push();
  // Drawing options
  stroke(stroke_color);
  strokeWeight(l_width);
  noFill();

  if (style == 'line') {
    // Lines along y
    for (let i = 0; i < nx; i++) {
      beginShape();
      vertex(grid[i][0].x, grid[i][0].y);
      for (let j = 0; j < ny; j++) {
        vertex(grid[i][j].x, grid[i][j].y);
      }
      vertex(grid[i][grid[i].length - 1].x, grid[i][grid[i].length - 1].y);
      endShape();
    }
    // Lines along x
    for (let j = 0; j < ny; j++) {
      beginShape();
      vertex(grid[0][j].x, grid[0][j].y);
      for (let i = 0; i < nx; i++) {
        vertex(grid[i][j].x, grid[i][j].y);
      }
      vertex(grid[grid[j].length - 1][j].x, grid[grid[j].length - 1][j].y);
      endShape();
    }
  } else if (style == 'curve') {
    // Lines along y
    for (let i = 0; i < nx; i++) {
      beginShape();
      curveVertex(grid[i][0].x, grid[i][0].y);
      for (let j = 0; j < ny; j++) {
        curveVertex(grid[i][j].x, grid[i][j].y);
      }
      curveVertex(grid[i][grid[i].length - 1].x, grid[i][grid[i].length - 1].y);
      endShape();
    }
    // Lines along x
    for (let j = 0; j < ny; j++) {
      beginShape();
      curveVertex(grid[0][j].x, grid[0][j].y);
      for (let i = 0; i < nx; i++) {
        curveVertex(grid[i][j].x, grid[i][j].y);
      }
      curveVertex(grid[grid[j].length - 1][j].x, grid[grid[j].length - 1][j].y);
      endShape();
    }

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

