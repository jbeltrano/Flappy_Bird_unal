const WORLD_WIDTH = 400;
const WORLD_HEIGHT = 800;

const MIN_PIXEL_DENSITY = 1;
const MAX_PIXEL_DENSITY = 4;
const DENSITY_RECOMPUTE_THRESHOLD = 0.15;

class GameScaler {
  constructor(worldWidth, worldHeight) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.pixelDensity = -1;
  }

  computeScale() {
    return Math.min(
      window.innerWidth / this.worldWidth,
      window.innerHeight / this.worldHeight
    );
  }

  computePixelDensity(scale) {
    const dpr = window.devicePixelRatio || 1;
    return Math.min(
      Math.max(scale * dpr, MIN_PIXEL_DENSITY),
      MAX_PIXEL_DENSITY
    );
  }

  apply() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const scale = this.computeScale();
    const displayWidth = Math.floor(this.worldWidth * scale);
    const displayHeight = Math.floor(this.worldHeight * scale);

    const targetDensity = this.computePixelDensity(scale);
    if (Math.abs(targetDensity - this.pixelDensity) > DENSITY_RECOMPUTE_THRESHOLD) {
      this.pixelDensity = targetDensity;
      pixelDensity(targetDensity);
      noSmooth();
    }

    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
  }
}

const scaler = new GameScaler(WORLD_WIDTH, WORLD_HEIGHT);
