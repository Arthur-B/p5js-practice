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

  title = "Spiral";
  id = "#13";
  period = 300;

  // if (record) {
  //   saveGif('test.gif', period, { delay: 0, units: 'frames' });
  // }

  // Setup the canvas and frame

  // Reel:        1080x1920
  // Single post: 1080x1350
  // Carousel:    1080x1080
  border_width = 40;
  frame_size = createVector(1080, 1350);
  content_size = createVector(1080 - 2 * border_width, 1080 - 2 * border_width);
  createCanvas(frame_size.x, frame_size.y);

  // Setup the colors
  c_frame = [color('#F9F6EE'), // Background, Bone White
  color('#2C2D30')].reverse(); // Text, Ebony

  // Loop or not
  noLoop();

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

  let from = color("#032030");
  let to = color("006DA4");
  let n_iter = 7;

  // Drawing

  translate(frame_size.x / 2, frame_size.y / 2);
  fill(c_frame[1]);
  noStroke();
  rect(- content_size.x / 2, - content_size.y / 2, content_size.x, content_size.y);
  push();

  // blendMode(LIGHTEST);
  noFill();
  strokeWeight(5);
  stroke('black');
  let v = 3;
  let c = 0;
  let omega = 1;
  beginShape();
  vertex(0, 0);
  for (let t = 0; t < 200; t += 0.01) {
    vertex((v * t + c) * cos(omega * t),
      (v * t + c) * sin(omega * t));
  }
  endShape();




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

  return d + " " + months[m - 1] + " " + y;
}
