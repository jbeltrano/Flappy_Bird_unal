const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;

function createBird(x, y) {
  return Matter.Bodies.rectangle(x, y, BIRD_WIDTH, BIRD_HEIGHT, {
    restitution: 0,
    label: 'bird'
  });
}

function drawBird(body, img) {
  imageMode(CENTER);
  image(img, body.position.x, body.position.y);
}