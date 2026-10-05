const SFX_NAMES = ['wing', 'hit', 'die', 'point', 'swoosh'];
const sfx = {};

async function loadSounds() {
  await Promise.all(SFX_NAMES.map(async (name) => {
    sfx[name] = await loadSound(`assets/Sound/${name}.ogg`);
  }));
}

function playSfx(name) {
  const sound = sfx[name];
  if (!sound) return;
  sound.stop();
  sound.play();
}
