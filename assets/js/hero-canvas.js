/* Ambient design-space animation: drifting candidate points over a faint Pareto frontier. */
(function () {
  var c = document.getElementById('hero-canvas');
  if (!c || !c.getContext) return;
  var mq = window.matchMedia('(max-width: 768px)');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      mq.matches) { c.remove(); return; }

  var ctx = c.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var pts = [], raf = null, W = 0, H = 0, N = 42;

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0d9488';
  }
  function resize() {
    W = c.width = c.offsetWidth * dpr;
    H = c.height = c.offsetHeight * dpr;
  }
  function reset() {
    pts = [];
    for (var i = 0; i < N; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15 * dpr,
        vy: (Math.random() - 0.5) * 0.15 * dpr,
        r: (Math.random() * 1.6 + 0.8) * dpr
      });
    }
  }
  function frontier() {
    if (!W || !H) return;
    ctx.beginPath();
    for (var x = 0; x <= W; x += W / 60) {
      var t = x / W;
      ctx.lineTo(x, H * 0.92 - (H * 0.55) * t / (t + 0.18));
    }
    ctx.strokeStyle = accent();
    ctx.globalAlpha = 0.10;
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    frontier();
    ctx.fillStyle = accent();
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) { raf = requestAnimationFrame(tick); }
  });
  window.addEventListener('resize', function () { resize(); reset(); });
  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      if (e.matches) { cancelAnimationFrame(raf); raf = null; c.style.display = 'none'; }
      else { c.style.display = ''; resize(); reset(); if (!raf) raf = requestAnimationFrame(tick); }
    });
  }

  resize(); reset(); tick();
})();
