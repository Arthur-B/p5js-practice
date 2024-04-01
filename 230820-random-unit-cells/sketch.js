let nx = 30; // Unit cell along x 
let ny = 30; // Unit cell along y
let width = 1000;
let height = 1000;
unit_width = width / nx;
unit_height = width / ny;

function setup() {
  createCanvas(nx * unit_width, ny * unit_height);
  noLoop();
}

function draw() {
  background(0);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      // Select the parameters
      let color_bg = color(get_random_int(255), get_random_int(255), get_random_int(255));
      let color_shape = color(get_random_int(255), get_random_int(255), get_random_int(255));
      let rand_shape = get_random_int(3);
      // Draw the unit cell
      unit_cell(i * unit_width, j * unit_height,
        unit_width, unit_height, rand_shape, color_bg, color_shape);
    }
  }
}

function unit_cell(x, y, width, height, shape, color_bg, color_shape) {
  push();
  noStroke();
  translate(x, y);
  // Background
  fill(color_bg); // Fill with random grayscale value
  rect(0, 0, width, height);
  // Shape
  fill(color_shape); // Fill with random grayscale value

  if (shape == 0) {
    rect(0.25 * width, 0.25 * height, 0.5 * width, 0.5 * height);
  } else if (shape == 1) {
    triangle(0.25 * width, 0.25 * height,
      0.50 * width, 0.75 * height,
      0.75 * width, 0.25 * height);
  } else {
    circle(0.5 * width, 0.5 * height, width * 0.5)
  }
  pop();
}

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}