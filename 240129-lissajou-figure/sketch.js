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
  title = "Study: Lissajou's figure";
  id = "#8";
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
  c_content = [[250, 202, 231], [187, 185, 240], [200, 253, 248]];


  // Loop or not
  // noLoop();
}


// =============================================================================
// Draw
// =============================================================================

function draw() {

  //----------------------------------------------------------------------------
  // Format the frame
  setup_frame(frame, c_frame, title, id);

  //----------------------------------------------------------------------------
  // Prepare the content
  content.background(c_content[1]);


  // Lissajou curve
  let R = content.width / 4;
  let x_ratio = 4;
  // let x_ratio = 4 + modulo
  let y_ratio = 5;
  // let phi = PI / 2;
  // let phi = 2 * PI * millis() / 4000;
  let phi = 2 * PI * frameCount / period;

  // content.pop();
  content.push()
  content.translate(content.width / 2, content.height / 2);
  content.noFill();
  content.strokeWeight(10);
  content.stroke(c_content[0]);

  content.beginShape()
  for (let x = 0; x < 2 * PI; x += 0.01) {
    content.vertex(R * sin(x_ratio * x), R * sin(y_ratio * x + phi));
  }
  content.endShape(CLOSE);
  content.pop();
  // content.push();

  //----------------------------------------------------------------------------
  // Final draw
  // Frame
  image(frame, 0, 0);
  // Border
  fill(c_frame[1]);
  noStroke();
  // rect(0, 135, frame_size.x, content_size.y + 2 * border_width);
  // Content
  image(content, border_width, 135 + border_width);
}


// =============================================================================
// Helper
// =============================================================================


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
