let nx = 17; // Unit cell along x 
let ny = 17; // Unit cell along y
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
      // let color_bg = color(10, 73, 136);
      // let color_shape = color(255, 253, 208);
      // Draw the unit cell
      unit_cell(i * unit_width, j * unit_height,
        unit_width, unit_height);
    }
  }
  // Add white circle in the middle
  circle(total_width / 2, total_height / 2, 0.325 * unit_width);
}

function unit_cell(x, y, width, height) {
  ellipseMode(RADIUS);
  angleMode(RADIANS);
  colorMode(HSL, 2 * PI);

  let xc = x + 0.5 * width; // Position of the center of the unit cell
  let yc = y + 0.5 * height;
  let my_angle = Math.atan2(yc - total_height / 2, xc - total_width / 2) + PI / 2;
  let my_dist = get_length(xc - total_width / 2, yc - total_height / 2);

  let color_shape = color(my_angle, 2 * PI, 1 * PI * (1 - my_dist / (0.5 * total_height)));

  // color_shape = color(100, 0, 0);
  push();
  noStroke();
  translate(xc, yc);

  // Draw ellipse
  rotate(my_angle);
  fill(color_shape); // Fill with random grayscale value
  ellipse(0, 0, 0.325 * width, 0.15 * height);

  pop();
}

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}

function get_length(x, y) {
  return Math.sqrt(x * x + y * y);
}