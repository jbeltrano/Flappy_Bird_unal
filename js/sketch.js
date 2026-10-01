const FIXED_DELTA = 1000 / 60;

const GROUND_TOP = 800;
const GROUND_HEIGHT = 100;

let engine;
let world;
let birdBody;
let groundBody;
let birdImg;

async function setup() {
  createCanvas(400, 800);

  birdImg = await loadImage('assets/Objetcts/yellowbird-midflap.png');

  engine = Matter.Engine.create();
  world = engine.world;

  birdBody = createBird(120, 300);
  groundBody = Matter.Bodies.rectangle(200, GROUND_TOP + GROUND_HEIGHT / 2, 400, GROUND_HEIGHT, {
    isStatic: true,
    label: 'ground'
  });

  Matter.Composite.add(world, [birdBody, groundBody]);
}

function draw() {
  background(0);

  Matter.Engine.update(engine, FIXED_DELTA);

  drawBird(birdBody, birdImg);
}