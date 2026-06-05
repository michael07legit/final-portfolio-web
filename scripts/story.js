gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();


// ── DESKTOP (≥768px) ──────────────────────────────────────────────────────────
mm.add("(min-width: 768px)", () => {

  const faceCenter = document.getElementById('face-center');
  const faceNormal = document.getElementById('face-normal');
  const faceLeft   = document.getElementById('face-left');
  const faceRight  = document.getElementById('face-right');

  // Face starts below screen, centered horizontally via xPercent
  gsap.set(faceCenter, { xPercent: -50, yPercent: -50, y: '100vh' });
  gsap.set([faceLeft, faceRight], { autoAlpha: 0 });

  const acts = [1, 2, 3, 4].map(n => ({
    title: document.querySelector(`#act-${n} .act-title`),
    body:  document.querySelector(`#act-${n} .act-body`),
  }));
  acts.forEach(({ title, body }) => gsap.set([title, body], { y: '100vh' }));

  // One long pinned timeline covering face + all 4 paragraphs
  // Total duration: ~15.3 GSAP units mapped to 700vh of scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#face-act',
      start: 'top top',
      end: '+=700%',
      pin: true,
      scrub: 1,
    }
  });

  // ── Face enters (0–1.2), holds at center until 1.7 ──
  tl.to(faceCenter, { y: 0, ease: 'expo.out', duration: 2.6 }, 0);

  // ── Para 1 enters (1.7) + face → faceleft ──
  tl.to(acts[0].title, { y: 0, ease: 'power2.out', duration: 0.8 }, 1.7);
  tl.to(faceNormal,    { autoAlpha: 0, duration: 0.05 }, 1.7);
  tl.to(faceLeft,      { autoAlpha: 1, duration: 0.05 }, 1.7);
  tl.to(acts[0].body,  { y: 0, ease: 'power2.out', duration: 0.8 }, 2.6);
  // hold 3.4–3.55
  tl.to([acts[0].title, acts[0].body], { y: '-110vh', ease: 'power2.in', duration: 0.9 }, 3.55);

  // ── Para 2 enters (4.45), face still faceleft ──
  tl.to(acts[1].title, { y: 0, ease: 'power2.out', duration: 0.8 }, 4.45);
  tl.to(acts[1].body,  { y: 0, ease: 'power2.out', duration: 0.8 }, 5.35);
  // hold 6.15–6.3
  tl.to([acts[1].title, acts[1].body], { y: '-110vh', ease: 'power2.in', duration: 0.9 }, 6.3);

  // ── Face → normal (7.2), holds until 8.0 ──
  tl.to(faceLeft,   { autoAlpha: 0, duration: 0.05 }, 7.2);
  tl.to(faceNormal, { autoAlpha: 1, duration: 0.05 }, 7.2);

  // ── Para 3 enters (8.0) + face → faceright ──
  tl.to(acts[2].title, { y: 0, ease: 'power2.out', duration: 0.8 }, 8.0);
  tl.to(faceNormal,    { autoAlpha: 0, duration: 0.05 }, 8.0);
  tl.to(faceRight,     { autoAlpha: 1, duration: 0.05 }, 8.0);
  tl.to(acts[2].body,  { y: 0, ease: 'power2.out', duration: 0.8 }, 8.9);
  // hold 9.7–9.85
  tl.to([acts[2].title, acts[2].body], { y: '-110vh', ease: 'power2.in', duration: 0.9 }, 9.85);

  // ── Para 4 enters (10.75), face still faceright ──
  tl.to(acts[3].title, { y: 0, ease: 'power2.out', duration: 0.8 }, 10.75);
  tl.to(acts[3].body,  { y: 0, ease: 'power2.out', duration: 0.8 }, 11.65);
  // hold 12.45–12.6
  tl.to([acts[3].title, acts[3].body], { y: '-110vh', ease: 'power2.in', duration: 0.9 }, 12.6);

  // ── Face → normal (13.5), holds until 14.3 ──
  tl.to(faceRight,  { autoAlpha: 0, duration: 0.05 }, 13.5);
  tl.to(faceNormal, { autoAlpha: 1, duration: 0.05 }, 13.5);

  // ── Face exits (14.3) — autoAlpha:0 ensures it's invisible when section scrolls away ──
  tl.to(faceCenter, { y: '-110vh', autoAlpha: 0, ease: 'power2.in', duration: 1.0 }, 14.3);

  // ── Paragraphs 5–7 (shared, center-aligned) ──
  gsap.utils.toArray('.story-entry.center-entry:not(.mobile-only)').forEach(entry => {
    const title = entry.querySelector('.entry-title');
    const body  = entry.querySelector('.entry-body');
    gsap.set([title, body], { y: '100vh' });
    gsap.timeline({
      scrollTrigger: {
        trigger: entry,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
      }
    })
    .to(title, { y: 0, ease: 'power2.out', duration: 0.8 }, 0)
    .to(body,  { y: 0, ease: 'power2.out', duration: 0.8 }, 0.9)
    .to({}, { duration: 0.15 })
    .to([title, body], { y: '-110vh', ease: 'power2.in', duration: 0.9 });
  });

});


// ── MOBILE (<768px) ───────────────────────────────────────────────────────────
mm.add("(max-width: 767px)", () => {

  // Face: simple fade-in, no pin — scrolls away naturally
  const mobileImg = document.querySelector('#face-mobile .mobile-face-img');
  gsap.set(mobileImg, { autoAlpha: 0, y: 40 });
  ScrollTrigger.create({
    trigger: '#face-mobile',
    start: 'top 70%',
    onEnter: () => gsap.to(mobileImg, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }),
  });

  // All center entries (mobile-only 1–4 + shared 5–7)
  gsap.utils.toArray('.story-entry.center-entry').forEach(entry => {
    const title = entry.querySelector('.entry-title');
    const body  = entry.querySelector('.entry-body');
    gsap.set([title, body], { y: '100vh' });
    gsap.timeline({
      scrollTrigger: {
        trigger: entry,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
      }
    })
    .to(title, { y: 0, ease: 'power2.out', duration: 0.8 }, 0)
    .to(body,  { y: 0, ease: 'power2.out', duration: 0.8 }, 0.9)
    .to({}, { duration: 0.15 })
    .to([title, body], { y: '-110vh', ease: 'power2.in', duration: 0.9 });
  });

});


// ── Header button click blur ──────────────────────────────────────────────────
document.querySelectorAll('.header-center a, .ping-btn').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.classList.remove('btn-clicked');
    void btn.offsetWidth;
    btn.classList.add('btn-clicked');
  });
  btn.addEventListener('animationend', () => btn.classList.remove('btn-clicked'));
});


// ── Meteor shower — white squares, 30° from horizontal, story page only ──────
if (window.matchMedia('(pointer: fine)').matches) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9997;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const HEAD  = 6;           // px — slightly smaller than the 10px cursor
  const TRAIL = 10;          // trail history length per meteor
  const MAX   = 8;
  // 30° from horizontal: vx = cos30, vy = sin30
  const COS30 = Math.cos(Math.PI / 6);
  const SIN30 = Math.sin(Math.PI / 6);

  const meteors = [];

  function spawnMeteor() {
    const speed  = 3 + Math.random() * 2;
    const onTop  = Math.random() < 0.65;
    meteors.push({
      x:     onTop ? Math.random() * (canvas.width + 60) - 30 : -HEAD,
      y:     onTop ? -HEAD : Math.random() * canvas.height * 0.6,
      vx:    speed * COS30,
      vy:    speed * SIN30,
      trail: [],
    });
  }

  let lastSpawn = 0, nextGap = 700;

  (function loop(ts) {
    // Clear completely each frame — no lingering marks
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];

      m.trail.push({ x: m.x, y: m.y });
      if (m.trail.length > TRAIL) m.trail.shift();

      m.x += m.vx;
      m.y += m.vy;

      if (m.x > canvas.width + 20 || m.y > canvas.height + 20) {
        meteors.splice(i, 1);
        continue;
      }

      // Fading trail squares
      for (let t = 0; t < m.trail.length; t++) {
        const frac = t / m.trail.length;
        const sz   = HEAD * (0.25 + frac * 0.75);
        ctx.fillStyle = `rgba(255,255,255,${frac * 0.7})`;
        ctx.fillRect(m.trail[t].x - sz / 2, m.trail[t].y - sz / 2, sz, sz);
      }

      // Head
      ctx.fillStyle = '#fff';
      ctx.fillRect(m.x - HEAD / 2, m.y - HEAD / 2, HEAD, HEAD);
    }

    if (ts - lastSpawn > nextGap && meteors.length < MAX) {
      spawnMeteor();
      lastSpawn = ts;
      nextGap   = 500 + Math.random() * 400;
    }

    requestAnimationFrame(loop);
  })(0);
}

// ── Pixel cursor trail — white pixels on orange ───────────────────────────────
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
