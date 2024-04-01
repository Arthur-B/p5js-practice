/*
GIF to mp4:
ffmpeg -i test.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" video.mp4


*/

// =============================================================================
// Variables
// =============================================================================

let record;
let period;

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


// =============================================================================
// Setup
// =============================================================================

function setup() {
  title = "Linear gradient";
  id = "#9";
  record = false;
  period = 240;

  if (record) {
    saveGif('test.gif', 2 * period, { delay: 0, units: 'frames' });
  }

  // Setup the canvas and frame
  border_width = 40;
  frame_size = createVector(1080, 1350);
  content_size = createVector(1080 - 2 * border_width, 1080 - 2 * border_width);
  createCanvas(frame_size.x, frame_size.y);
  content = createGraphics(content_size.x, content_size.y);
  frame = createGraphics(frame_size.x, frame_size.y);

  // Setup the colors
  c_frame = [color('#F9F6EE'), // Background, Bone White
  color('#2C2D30')]; // Text, Ebony
  c_content = [color(250, 202, 231), color(187, 185, 240), color(200, 253, 248)];


  // Loop or not
  noLoop();
}


// =============================================================================
// Draw
// =============================================================================

function draw() {

  //----------------------------------------------------------------------------
  // Format the frame
  setup_frame(frame, c_frame.reverse(), title, id);

  //----------------------------------------------------------------------------
  // Prepare the content
  content.background(c_frame[1]);

  content.push()
  content.translate(content.width / 2, content.height / 2);
  content.noFill();
  content.strokeWeight(10);
  // content.stroke(c_frame[0]);

  let R = content.height / 4;
  let x_min = - content.width / 4;
  let x_max = content.width / 4;

  // let y0 = get_y(x_min, R, content.width);
  // let y1 = get_y(x_min + 1, R, content.width);
  for (let x = x_min; x <= x_max - 1; x++) {
    let y0 = get_y(x, R, content.width / 2);
    let y1 = get_y(x + 1, R, content.width / 2);
    let inter = map(x, x_min, x_max, 0, 1);
    let c = lerpColor(c_frame[0], c_frame[1], inter);
    content.stroke(c);
    content.line(x, y0, x + 1, y1);
  }
  content.pop();

  //----------------------------------------------------------------------------
  // Final draw
  // Frame
  image(frame, 0, 0);
  // Border
  fill(c_frame[1]);
  noStroke();
  // Content
  image(content, border_width, 135 + border_width);


  // Prepare gradient
  // let R = 500;
  // background(220);
  // strokeWeight(10);
  // let x_min = - content.width / 2;
  // let x_max = content.width / 2;
  // let y0 = get_y(x_min, R, content.width);
  // let y1 = get_y(x_min + 1, R, content.width);
  // for (let x = x_min; x <= x_max - 1; x++) {
  //   let inter = map(x, x_min, x_max, 0, 1);
  //   let c = lerpColor(c_frame[0], c_frame[1], inter);
  //   stroke(c);
  //   line(x, y0, x + 1, y1);
  //   y0 = get_y(x, R, content.width);
  //   y1 = get_y(x + 1, R, content.width);
  // }

  // gradientLine(0, 0, width, height, 'black', 'white');

  // image(content, border_width, 135 + border_width);
}


// =============================================================================
// Helper
// =============================================================================

function get_y(x, R, width) {
  return R * sin(2 * PI * (x + 1) / width);
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

function setup_frame(frame, c_frame, title, id) {
  // Set colors
  frame.background(c_frame[0]);
  frame.stroke(c_frame[1]);
  frame.fill(c_frame[1]);
  // Set text attributes
  frame.textFont('Courier New');

  // Title
  frame.textSize(48);
  frame.textAlign(CENTER, BOTTOM);
  frame.text(title, 540, 1282.5);

  // Get and format the date
  frame.textSize(36);
  frame.textAlign(CENTER, TOP);
  let d = day(); // from p5js
  let m = month();
  let y = year();
  frame.text(format_date(d, m, y), 540, 1282.5);

  // Piece number
  frame.textSize(48);
  frame.textAlign(LEFT, CENTER);
  frame.text(id, 1080 * 7 / 8, 135 / 2);
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
