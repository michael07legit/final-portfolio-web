gsap.registerPlugin(ScrollTrigger);

// ── Scroll: name reveal ──
gsap.set("#face-reveal", {
  xPercent: -50,
  yPercent: -50,
  y: "100vh",
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#section-name",
    start: "top top",
    end: "+=380%",
    pin: true,
    scrub: 1.2,
  }
});

tl.to("#word-dinh",  { y: "0%", ease: "power2.out", duration: 0.9 }, 0)
  .to("#word-quang", { y: "0%", ease: "power2.out", duration: 0.9 }, 0.8)
  .to("#word-minh",  { y: "0%", ease: "power2.out", duration: 0.9 }, 1.6)
  .to("#name-row",   { y: "-26vh", ease: "power1.inOut", duration: 1.2 }, 2.9)
  .to("#face-reveal", { y: 0, ease: "power2.out", duration: 1.6 }, 3.0);


// ── Header button click blur ──
document.querySelectorAll('.header-center a, .ping-btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.classList.remove('btn-clicked');
    void btn.offsetWidth; // restart animation
    btn.classList.add('btn-clicked');
  });
  btn.addEventListener('animationend', () => {
    btn.classList.remove('btn-clicked');
  });
});


// ── Pixel cursor trail (pointer devices only) ──
if (window.matchMedia('(pointer: fine)').matches) {
  const PIXEL_SIZE = 10;
  const TRAIL_LENGTH = 35;
  const FADE_SPEED = 0.045;

  const pixels = [];
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.sqrt(dx * dx + dy * dy) < PIXEL_SIZE) return;

    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;background:#111;will-change:opacity,width,height,left,top;';
    document.body.appendChild(el);

    pixels.push({ el, cx: e.clientX, cy: e.clientY, opacity: 1, age: 0 });
    lastX = e.clientX;
    lastY = e.clientY;

    if (pixels.length > TRAIL_LENGTH) {
      const old = pixels.shift();
      old.el.remove();
    }
  });

  function animateTrail() {
    for (let i = pixels.length - 1; i >= 0; i--) {
      const p = pixels[i];
      p.opacity -= FADE_SPEED;
      p.age++;
      if (p.opacity <= 0) {
        p.el.remove();
        pixels.splice(i, 1);
        continue;
      }
      const size = PIXEL_SIZE * Math.max(0.3, 1 - p.age / 80);
      p.el.style.opacity = p.opacity;
      p.el.style.width  = size + 'px';
      p.el.style.height = size + 'px';
      p.el.style.left   = (p.cx - size / 2) + 'px';
      p.el.style.top    = (p.cy - size / 2) + 'px';
    }
    requestAnimationFrame(animateTrail);
  }

  requestAnimationFrame(animateTrail);
}
