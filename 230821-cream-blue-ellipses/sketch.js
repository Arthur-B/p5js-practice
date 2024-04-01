let nx = 9; // Unit cell along x 
let ny = 9; // Unit cell along y
let total_width = 900;
let total_height = 900;
unit_width = total_width / nx;
unit_height = total_width / ny;

function setup() {
  createCanvas(nx * unit_width, ny * unit_height);
  noLoop();
}

function draw() {
  background(0);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      // Select the parameters
      let color_bg = color(10, 73, 136);
      let color_shape = color(255, 253, 208);
      // Draw the unit cell
      unit_cell(i * unit_width, j * unit_height,
        unit_width, unit_height, color_bg, color_shape);
    }
  }
}

function unit_cell(x, y, width, height, color_bg, color_shape) {
  push();
  noStroke();
  translate(x + 0.5 * width, y + 0.5 * height);
  // Background
  fill(color_bg); // Fill with random grayscale value
  rect(-0.5 * width, -0.5 * height, width, height);
  // Shape
  fill(color_shape); // Fill with random grayscale value

  // Draw ellipse
  ellipseMode(RADIUS);
  let my_angle = 0.75 * PI * (x + 0.5 * width + y + 0.5 * height) / (total_width);
  rotate(my_angle);
  ellipse(0, 0, 0.325 * width, 0.15 * height);

  pop();
}

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}