const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const BIRD_JUMP_VELOCITY = -8;
const WINGSOUND = 0;


let totalImages = 3; 
let fotogramaActual = 0;
let velocidadCambioFotograma = 8;
let birdAngle = 0;
let animatedImages;
let birdSounds;

function createBird(x, y, images, sounds) {

  animatedImages = images; 
  birdSounds= sounds 
  return Matter.Bodies.rectangle(x, y, BIRD_WIDTH, BIRD_HEIGHT, {
    restitution: 0,
    label: 'bird'
  });

}

function drawBird(body) {
  imageMode(CENTER);

  BirdRotate(body);

  push();

  translate(body.position.x, body.position.y);
  rotate(birdAngle);

  image(animatedImages[fotogramaActual], 0, 0);

  pop();

  if (frameCount % velocidadCambioFotograma === 0) {
    fotogramaActual = (fotogramaActual + 1) % totalImages;
  }
}


function BirdReset(body) {
  Matter.Body.setPosition(body, { x: 120, y: 300})
  Matter.Body.setVelocity(body, { x: 0, y: 0})
}

function BirdJump(body) {
  
  Matter.Body.setVelocity(body, { x: 0, y: BIRD_JUMP_VELOCITY});
  birdSounds[WINGSOUND].play()
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

