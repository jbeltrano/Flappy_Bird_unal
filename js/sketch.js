const FIXED_DELTA = 1000 / 60;
const DEFAULT_GRAVITY_SCALE = 0.001;

const STATE_READY = 'ready';
const STATE_PLAYING = 'playing';
const STATE_GAMEOVER = 'gameover';
const RESTART_DELAY = 500;
const DIE_SOUND_DELAY = 250;

let engine;
let world;
let birdBody;
let groundBody;

let messageImg;
let gameOverImg;

let gameState = STATE_READY;
let gameOverAt = 0;
let dieTimer;
let score = 0;

let numbers = []

async function loadNumbers(){
  for(let i = 0; i < 10; i++){
    numbers[i] = await loadImage('assets/UI/Numbers/' + i + '.png');
  }
}

async function setup() {
  createCanvas(WORLD_WIDTH, WORLD_HEIGHT);
  scaler.apply();
  noSmooth();

  await loadNumbers();
  const birdImg = await loadImage('assets/Objetcts/yellowbird-upflap.png');
  const birdImg1 = await loadImage('assets/Objetcts/yellowbird-midflap.png');
  const birdImg2 = await loadImage('assets/Objetcts/yellowbird-downflap.png');
  bgImg = await loadImage('assets/Objetcts/background-day.png');
  baseImg = await loadImage('assets/Objetcts/base.png');
  pipeImg = await loadImage('assets/Objetcts/pipe-green.png');
  messageImg = await loadImage('assets/UI/message.png');
  gameOverImg = await loadImage('assets/UI/gameover.png');


  await loadSounds();

  engine = Matter.Engine.create();
  world = engine.world;

  birdBody = createBird(BIRD_START_X, BIRD_START_Y, [birdImg, birdImg1, birdImg2]);
  groundBody = createGround();
  pipePair = createPipePair();

  Matter.Composite.add(world, [
    birdBody,
    groundBody,
    pipePair.topBody,
    pipePair.bottomBody
  ]);

  Matter.Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const labels = [pair.bodyA.label, pair.bodyB.label];
      if (
        labels.includes('bird') &&
        (labels.includes('ground') || labels.includes('pipe'))
      ) {
        endGame();
      }
    }
  });

  startReady();
}

function draw() {
  if (!engine) return;

  drawBackground();

  if (gameState === STATE_READY) {
    Matter.Body.setVelocity(birdBody, { x: 0, y: 0 });
  }

  Matter.Engine.update(engine, FIXED_DELTA);

  if (gameState === STATE_PLAYING && birdBody.position.y < 0) {
    Matter.Body.setPosition(birdBody, { x: birdBody.position.x, y: 0 });
    Matter.Body.setVelocity(birdBody, { x: 0, y: 0 });
  }

  updatePipes();

  if (gameState !== STATE_GAMEOVER) {
    updateGround();
  }

  

  drawBird(birdBody, gameState !== STATE_GAMEOVER);
  drawPipes();
  drawGround();
  drawOverlay();

  if(gameState !== STATE_READY){
    drawScore();
  }
}

function drawScore() {

  let actual = [];
  let score_aux = score;

  while(true){
    if(score_aux <= 0){
      break;
    }

    actual.push(score_aux % 10);
    score_aux = floor(score_aux / 10);

  }

  push();
  translate(width - 30, 0);
  for(let i = 0; i < actual.length; i++){
    image(numbers[actual[i]], -i*25,30);
  }
  pop();
  
}

function drawOverlay() {
  push();
  imageMode(CENTER);
  if (gameState === STATE_READY) {
    image(messageImg, width / 2, 450, messageImg.width * 1.25, messageImg.height * 1.25);
  } else if (gameState === STATE_GAMEOVER) {
    image(gameOverImg, width / 2, 300, gameOverImg.width * 1.5, gameOverImg.height * 1.5);
  }
  pop();
}

function startReady() {
  clearTimeout(dieTimer);
  gameState = STATE_READY;
  engine.gravity.scale = 0;
  score = 0;
  BirdReset(birdBody);
  resetPipes();
}

function startPlaying() {
  gameState = STATE_PLAYING;
  engine.gravity.scale = DEFAULT_GRAVITY_SCALE;
}

function endGame() {
  if (gameState === STATE_GAMEOVER) return;
  gameState = STATE_GAMEOVER;
  gameOverAt = millis();
  playSfx('hit');
  dieTimer = setTimeout(() => playSfx('die'), DIE_SOUND_DELAY);
  playSfx('swoosh');
}

function handleInput() {
  userStartAudio();
  if (!engine) return;

  if (gameState === STATE_READY) {
    startPlaying();
    BirdJump(birdBody);
  } else if (gameState === STATE_PLAYING) {
    BirdJump(birdBody);
  } else if (millis() - gameOverAt > RESTART_DELAY) {
    playSfx('swoosh');
    startReady();
  }
}

function mousePressed() {
  handleInput();
}

function keyPressed() {
  if (key === ' ') {
    handleInput();
    return false;
  }
}

function windowResized() {
  scaler.apply();
}