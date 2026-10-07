const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const BIRD_JUMP_VELOCITY = -(2 / 3);
const BIRD_START_X = 120;
const BIRD_START_Y = 250;

let totalImages = 3;
let fotogramaActual = 0;
let velocidadCambioFotograma = 8;
let birdAngle = 0;
let animatedImages;

function createBird(x, y, images) {

  animatedImages = images;
  return Matter.Bodies.rectangle(x, y, BIRD_WIDTH, BIRD_HEIGHT, {
    restitution: 0,
    inertia: Infinity,
    label: 'bird'
  });

}

function drawBird(body, animate = true) {
  imageMode(CENTER);

  BirdRotate(body);

  push();

  translate(body.position.x, body.position.y);
  rotate(birdAngle);

  image(animatedImages[fotogramaActual], 0, 0);

  pop();

  if (animate && frameCount % velocidadCambioFotograma === 0) {
    fotogramaActual = (fotogramaActual + 1) % totalImages;
  }
}


function BirdReset(body) {
  Matter.Body.setPosition(body, { x: BIRD_START_X, y: BIRD_START_Y })
  Matter.Body.setVelocity(body, { x: 0, y: 0})
  birdAngle = 0;
}

function BirdJump(body) {

  Matter.Body.setVelocity(body, { x: 0, y: BIRD_JUMP_VELOCITY});
  playSfx('wing');
}

function BirdRotate(body) {

  if (body.velocity.y < 0) {
    // Está subiendo
    birdAngle = map(body.velocity.y, BIRD_JUMP_VELOCITY, 0, -PI / 4, 0);

  } else {
    // Está cayendo
    let angle = map(body.velocity.y,0,10,0,PI / 2);
    birdAngle = constrain(angle, 0, PI / 2);

  }
}


function BirdFall(body) {
  Matter.Body.setVelocity(body, { x: 0, y: 0})
}
