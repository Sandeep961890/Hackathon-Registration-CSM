const dragon = document.querySelector('.scene__dragon');

function updateDragonAnimation() {
  if (!dragon) return;

  const viewportWidth = window.innerWidth;
  const minPath = 120;
  const maxPath = 280;
  const calcPath = Math.round(Math.min(Math.max(viewportWidth * 0.2, minPath), maxPath));
  const duration = 28;

  dragon.style.setProperty('--dragon-path', `${calcPath}px`);
  dragon.style.setProperty('--dragon-motion-duration', `${duration}s`);
}

function initDragonAnimation() {
  updateDragonAnimation();
  window.addEventListener('resize', updateDragonAnimation);
}

initDragonAnimation();
