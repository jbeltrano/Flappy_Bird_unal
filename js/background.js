// background-day.png es 288x512; se escala para cubrir el alto del canvas
const BG_SCALE = 800 / 512;
const BG_WIDTH = 288 * BG_SCALE;
const BG_HEIGHT = 512 * BG_SCALE;

let bgImg;

function drawBackground() {
  push();
  imageMode(CORNER);
  image(bgImg, (width - BG_WIDTH) / 2, 0, BG_WIDTH, BG_HEIGHT);
  pop();
}
