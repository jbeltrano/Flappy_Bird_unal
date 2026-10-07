// base.png es 336x112; misma escala que el fondo
const GROUND_SCALE = BG_SCALE;
const GROUND_TILE_WIDTH = 336 * GROUND_SCALE;
const GROUND_HEIGHT = 112 * GROUND_SCALE;
const GROUND_TOP = 800 - GROUND_HEIGHT;

// el cuerpo físico es más grueso que el sprite para que el pájaro no lo atraviese
const GROUND_BODY_HEIGHT = 200;

let baseImg;
let groundOffset = 0;

function createGround() {
  return Matter.Bodies.rectangle(200, GROUND_TOP + GROUND_BODY_HEIGHT / 2, 600, GROUND_BODY_HEIGHT, {
    isStatic: true,
    label: 'ground'
  });
}

function updateGround() {
  groundOffset = (groundOffset + getSceneSpeed()) % GROUND_TILE_WIDTH;
}

function drawGround() {
  push();
  imageMode(CORNER);
  for (let x = -Math.floor(groundOffset); x < width; x += Math.floor(GROUND_TILE_WIDTH)) {
    image(baseImg, x, GROUND_TOP, GROUND_TILE_WIDTH + 1, GROUND_HEIGHT);
  }
  pop();
}
