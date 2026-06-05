const IMAGES = [
  'images/do resources/bolonese.JPG',
  'images/do resources/chair.jpg',
  'images/do resources/chess.jpg',
  'images/do resources/chessboard.jpg',
  'images/do resources/city.jpg',
  'images/do resources/englishteam.jpg',
  'images/do resources/presentation.jpg',
  'images/do resources/team.JPG',
  'images/do resources/tngl.png',
];

function bgUrl(path) {
  return `url('${path.replace(/ /g, '%20')}')`;
}

// Preload all images into browser cache so there's no flash on first display
IMAGES.forEach(path => {
  const img = new Image();
  img.src = path.replace(/ /g, '%20');
});

// ── Build two slide slots for crossfade ──
const container = document.getElementById('bg-container');

const slots = [0, 1].map(() => {
  const slide = document.createElement('div');
  slide.className = 'bg-slide';
  const blur = document.createElement('div');
  blur.className = 'bg-blur';
  const img = document.createElement('div');
  img.className = 'bg-img';
  slide.append(blur, img);
  container.appendChild(slide);
  return { slide, blur, img };
});

function loadSlot(slotIdx, imgIdx) {
  const url = bgUrl(IMAGES[imgIdx]);
  slots[slotIdx].blur.style.backgroundImage = url;
  slots[slotIdx].img.style.backgroundImage  = url;
}

let current  = 0;
let activeSlot = 0;

// Prime both slots
loadSlot(0, 0);
loadSlot(1, 1 % IMAGES.length);
slots[0].slide.classList.add('active');

function advance() {
  const nextImgIdx = (current + 1) % IMAGES.length;
  const nextSlot   = 1 - activeSlot;
  const oldSlot    = activeSlot;

  slots[nextSlot].slide.classList.add('active');
  slots[oldSlot].slide.classList.remove('active');

  activeSlot = nextSlot;
  current    = nextImgIdx;

  // Delay loading the new image until the fade-out finishes (60ms transition + buffer).
  // Loading immediately while opacity > 0 causes the new image to bleed through,
  // making it appear twice per cycle.
  setTimeout(() => {
    loadSlot(oldSlot, (current + 1) % IMAGES.length);
  }, 90);
}

setInterval(advance, 571);


// ── Header button click blur ──
document.querySelectorAll('.header-center a, .ping-btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.classList.remove('btn-clicked');
    void btn.offsetWidth;
    btn.classList.add('btn-clicked');
  });
  btn.addEventListener('animationend', () => btn.classList.remove('btn-clicked'));
});


// ── Pixel cursor trail — white pixels over photos ──
if (window.matchMedia('(pointer: fine)').matches) {
  const PIXEL_SIZE   = 10;
  const TRAIL_LENGTH = 35;
  const FADE_SPEED   = 0.045;
  const pixels = [];
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < PIXEL_SIZE) return;
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;background:#fff;will-change:opacity,width,height,left,top;';
    document.body.appendChild(el);
    pixels.push({ el, cx: e.clientX, cy: e.clientY, opacity: 1, age: 0 });
    lastX = e.clientX;
    lastY = e.clientY;
    if (pixels.length > TRAIL_LENGTH) pixels.shift().el.remove();
  });

  (function animateTrail() {
    for (let i = pixels.length - 1; i >= 0; i--) {
      const p = pixels[i];
      p.opacity -= FADE_SPEED;
      p.age++;
      if (p.opacity <= 0) { p.el.remove(); pixels.splice(i, 1); continue; }
      const size = PIXEL_SIZE * Math.max(0.3, 1 - p.age / 80);
      p.el.style.opacity = p.opacity;
      p.el.style.width   = size + 'px';
      p.el.style.height  = size + 'px';
      p.el.style.left    = (p.cx - size / 2) + 'px';
      p.el.style.top     = (p.cy - size / 2) + 'px';
    }
    requestAnimationFrame(animateTrail);
  })();
}
