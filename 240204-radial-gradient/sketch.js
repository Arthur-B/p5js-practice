/*
GIF to mp4:
ffmpeg -i test.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" video.mp4

Bunch of images to mp4:
ffmpeg -pattern_type glob -i '*.png' test.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" video.mp4
*/

// =============================================================================
// Variables
// =============================================================================

let record;

// Layers
let content;
let frame;

// 135 px at top and 135 px at bottom?
let frame_size;
let content_size;
let border_width;

// colors

// Honey's pick
// let c = [[250, 202, 231], [187, 185, 240], [200, 253, 248]];
// let c = ["#FCFAEF", "#FF6700", "#DBD0BD", "#0C5446"];
// let c = ["#EEF99D", "#546FFF", "#C5DBFF", "#FFF7EF"];
let c_frame;
let c_content;

let title;
let id;

let period;
let nx;
let ny;


// =============================================================================
// Setup
// =============================================================================

function setup() {
  record = false;
  if (record) {
    frameRate(15);
  } else {
    frameRate(30);
  }

  title = "Radial gradients";
  id = "#10";
  period = 300;

  // if (record) {
  //   saveGif('test.gif', period, { delay: 0, units: 'frames' });
  // }

  // Setup the canvas and frame

  // Reel:        1080x1920
  // Single post: 1080x1350
  // Carousel:    1080x1080
  border_width = 40;
  frame_size = createVector(1080, 1920);
  content_size = createVector(1080 - 2 * border_width, 1080 - 2 * border_width);
  createCanvas(frame_size.x, frame_size.y);

  // Setup the colors
  c_frame = [
    color('#F9F6EE'), // Background, Bone White
    color('#2C2D30'), // Text, Ebony
  ].reverse();

  c_content = [color(250, 202, 231), color(187, 185, 240), color(200, 253, 248)];


  // Loop or not
  // noLoop();

}


// =============================================================================
// Draw
// =============================================================================

function draw() {

  //----------------------------------------------------------------------------
  // Format the frame
  let y_text = frame_size.y - (frame_size.y - content_size.y) / 4;
  setup_frame(c_frame, title, id, y_text);

  //----------------------------------------------------------------------------
  // Prepare the content

  // Locations of circles
  let p1 = 75;
  let p2 = 100;
  let p3 = 150;
  let l = 500; //
  let theta0 = - 30 * Math.PI / 180; // Initial angle for pendulum

  let theta1 = theta0 * Math.cos(2 * PI * frameCount / p1);
  let theta2 = theta0 * Math.cos(2 * PI * frameCount / p2);
  let theta3 = theta0 * Math.cos(2 * PI * frameCount / p3);
  // xc = l * Math.sin(theta) + content_size.x / 2;
  // yc = l * Math.cos(theta);

  // Drawing

  translate(frame_size.x / 2, frame_size.y / 2);
  fill('white');
  noStroke();
  rect(- content_size.x / 2, - content_size.y / 2, content_size.x, content_size.y);


  // First circle
  push();
  let c1 = color(255, 0, 0, 128);
  let c2 = color(255, 0, 0, 32);
  let R = content_size.x / 4;
  let loc_circle = createVector(
    l * Math.sin(theta1),
    l * Math.cos(theta1) - content_size.y / 2.5);
  // let loc_circle = createVector(mouseX, mouseY);

  get_radial_gradient(
    loc_circle.x, loc_circle.y, 0,
    loc_circle.x, loc_circle.y, R,
    c1, c2);
  circle(loc_circle.x, loc_circle.y, 2 * R);
  pop();

  // Second circle
  push();
  c1 = color(0, 255, 0, 128);
  c2 = color(0, 255, 0, 32);
  loc_circle = createVector(
    l * Math.sin(theta2),
    l * Math.cos(theta2) - content_size.y / 2.5);

  get_radial_gradient(
    loc_circle.x, loc_circle.y, 0,
    loc_circle.x, loc_circle.y, R,
    c1, c2);
  circle(loc_circle.x, loc_circle.y, 2 * R);
  pop();

  // Third circle
  push();
  c1 = color(0, 0, 255, 128);
  c2 = color(0, 0, 255, 32);
  loc_circle = createVector(
    l * Math.sin(theta3),
    l * Math.cos(theta3) - content_size.y / 2.5);

  get_radial_gradient(
    loc_circle.x, loc_circle.y, 0,
    loc_circle.x, loc_circle.y, R,
    c1, c2);
  circle(loc_circle.x, loc_circle.y, 2 * R);
  pop();

  // Record
  if (record) {
    if (frameCount < period) {
      save('output_' + String(frameCount).padStart(3, '0') + '.png');
    } else {
      noLoop();
    }
  }

  // // Variables
  // nx = 8;
  // ny = 8;
  // let unit_width = content_size.x / nx;
  // let unit_height = content_size.y / ny;

  // // Drawing
  // // background(c_frame[1]);

  // for (let i = 0; i < nx; i++) {
  //   for (let j = 0; j < ny; j++) {
  //     // Select the parameters
  //     let color_bg = color(get_random_int(255), get_random_int(255), get_random_int(255));
  //     let color_shape = color(get_random_int(255), get_random_int(255), get_random_int(255));
  //     let rand_shape = get_random_int(3);
  //     // Draw the unit cell
  //     unit_cell(i * unit_width + (frame_size.x - content_size.x) / 2,
  //       j * unit_height + (frame_size.y - content_size.y) / 2,
  //       unit_width, unit_height, rand_shape, color_bg, color_shape);
  //   }
  // }


}


// =============================================================================
// Helper
// =============================================================================

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}


// function get_linear_gradient(s_x, s_y, e_x, e_y, c_s, c_e) {
//   let gradient = drawingContext.createLinearGradient(s_x, s_y, e_x, e_y);
//   grad.addColorStop(0, c_grad0);
//   grad.addColorStop(1, c_grad1);
// }

function get_radial_gradient(s_x, s_y, s_r, e_x, e_y, e_r, c_s, c_e) {
  let grad = drawingContext.createRadialGradient(s_x, s_y, s_r, e_x, e_y, e_r);
  grad.addColorStop(0, c_s);
  grad.addColorStop(1, c_e);
  drawingContext.fillStyle = grad;
}

function setup_frame(c_frame, title, id, y_text) {
  push();
  // Set colors
  background(c_frame[0]);
  stroke(c_frame[1]);
  fill(c_frame[1]);
  // Set text attributes
  textFont('Courier New');

  // Title
  textSize(48);
  textAlign(CENTER, BOTTOM);
  text(title, 540, y_text);

  // Get and format the date
  textSize(36);
  textAlign(CENTER, TOP);
  let d = day(); // from p5js
  let m = month();
  let y = year();
  text(format_date(d, m, y), 540, y_text);

  // Piece number
  textSize(48);
  textAlign(LEFT, CENTER);
  text(id, 1080 * 7 / 8, 135 / 2);
  pop();
}

function format_date(d, m, y) {
  let first = new Set([1, 21, 31]);
  let second = new Set([2, 22]);
  let third = new Set([3, 23]);

  if (first.has(d)) {
    d = String(d) + "st";
  } else if (second.has(d)) {
    d = String(d) + "nd";
  } else if (third.has(d)) {
    d = String(d) + "rd";
  } else {
    d = String(d) + "th";
  }

  // Constants
  let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

  return d + " " + months[m] + " " + y;
}
