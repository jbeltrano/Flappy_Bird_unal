const PIPE_WIDTH = 62.4;
const PIPE_GAP = BIRD_HEIGHT * 6;
const PIPE_BASE_SPEED = 2;
const PIPE_SPEED_INCREASE = 1.2;
const PIPE_START_X = 450;
const PIPE_GAP_TOP_MIN = 120;
const PIPE_GAP_TOP_MAX = GROUND_TOP - PIPE_GAP - 80;
const PIPE_SOURCE_WIDTH = 52;
const PIPE_SOURCE_HEIGHT = 320;
const PIPE_CAP_HEIGHT = 26;

let pipeImg;
let pipePair;
let sceneSpeed = PIPE_BASE_SPEED;
let pipesPassed = 0;
let pipePassedBird = false;

function getSceneSpeed() {
  return sceneSpeed;
}

function createPipePair(x = PIPE_START_X) {
  const gapTop = floor(random(PIPE_GAP_TOP_MIN, PIPE_GAP_TOP_MAX + 1));
  const gapBottom = gapTop + PIPE_GAP;
  const topHeight = gapTop;
  const bottomHeight = GROUND_TOP - gapBottom;

  const topBody = Matter.Bodies.rectangle(x, topHeight / 2, PIPE_WIDTH, topHeight, {
    isStatic: true,
    label: 'pipe'
  });

  const bottomBody = Matter.Bodies.rectangle(
    x,
    gapBottom + bottomHeight / 2,
    PIPE_WIDTH,
    bottomHeight,
    { isStatic: true, label: 'pipe' }
  );

  return { x, gapTop, gapBottom, topHeight, bottomHeight, topBody, bottomBody };
}

function resetPipes() {
  if (pipePair) {
    Matter.Composite.remove(world, [pipePair.topBody, pipePair.bottomBody]);
  }

  pipePair = createPipePair();
  sceneSpeed = PIPE_BASE_SPEED;
  pipesPassed = 0;
  pipePassedBird = false;
  Matter.Composite.add(world, [pipePair.topBody, pipePair.bottomBody]);
}

function respawnPipes() {
  Matter.Composite.remove(world, [pipePair.topBody, pipePair.bottomBody]);
  pipePair = createPipePair(width + PIPE_WIDTH);
  pipePassedBird = false;
  Matter.Composite.add(world, [pipePair.topBody, pipePair.bottomBody]);
}

function syncPipeBodies() {
  Matter.Body.setPosition(pipePair.topBody, {
    x: pipePair.x,
    y: pipePair.topHeight / 2
  });
  Matter.Body.setPosition(pipePair.bottomBody, {
    x: pipePair.x,
    y: pipePair.gapBottom + pipePair.bottomHeight / 2
  });
}

function updatePipes() {
  if (gameState !== STATE_PLAYING) return;

  pipePair.x -= sceneSpeed;

  if (!pipePassedBird && pipePair.x + PIPE_WIDTH / 2 < birdBody.position.x) {
    pipePassedBird = true;
    pipesPassed += 1;
    score += 5;
    playSfx("point")

    if (pipesPassed % 2 === 0) {
      sceneSpeed *= PIPE_SPEED_INCREASE;
    }
  }

  if (pipePair.x < -PIPE_WIDTH) {
    respawnPipes();
    return;
  }
  syncPipeBodies();
}

function drawPipes() {
  if (!pipePair) return;

  imageMode(CORNER);

  push();
  translate(pipePair.x - PIPE_WIDTH / 2, pipePair.gapTop);
  scale(1, -1);
  image(pipeImg, 0, 0, PIPE_WIDTH, PIPE_CAP_HEIGHT, 0, 0, PIPE_SOURCE_WIDTH, PIPE_CAP_HEIGHT);
  image(
    pipeImg,
    0,
    PIPE_CAP_HEIGHT,
    PIPE_WIDTH,
    pipePair.topHeight - PIPE_CAP_HEIGHT,
    0,
    PIPE_CAP_HEIGHT,
    PIPE_SOURCE_WIDTH,
    PIPE_SOURCE_HEIGHT - PIPE_CAP_HEIGHT
  );
  pop();

  image(
    pipeImg,
    pipePair.x - PIPE_WIDTH / 2,
    pipePair.gapBottom,
    PIPE_WIDTH,
    PIPE_CAP_HEIGHT,
    0,
    0,
    PIPE_SOURCE_WIDTH,
    PIPE_CAP_HEIGHT
  );
  image(
    pipeImg,
    pipePair.x - PIPE_WIDTH / 2,
    pipePair.gapBottom + PIPE_CAP_HEIGHT,
    PIPE_WIDTH,
    pipePair.bottomHeight - PIPE_CAP_HEIGHT,
    0,
    PIPE_CAP_HEIGHT,
    PIPE_SOURCE_WIDTH,
    PIPE_SOURCE_HEIGHT - PIPE_CAP_HEIGHT
  );
}
