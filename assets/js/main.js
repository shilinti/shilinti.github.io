/* Theme toggle — data-theme is pre-set in <head> to avoid flash */
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(document.documentElement.getAttribute('data-theme') === 'dark'));
  btn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.setAttribute('aria-pressed', String(next === 'dark'));
  });
})();

/* Reveal-on-scroll, scroll-spy + nav ink, progress bar */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a')).filter(function (l) { return l.hash.length > 1; });
  var ink = document.querySelector('.nav-ink');
  function moveInk(link) {
    if (!ink || !link) return;
    ink.style.left = link.offsetLeft + 'px';
    ink.style.width = link.offsetWidth + 'px';
  }
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute('id');
        links.forEach(function (l) {
          var on = l.hash === '#' + id;
          l.classList.toggle('active', on);
          if (on) moveInk(l);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { so.observe(s); });
  }

  var bar = document.getElementById('progress-bar');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking || !bar) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      ticking = false;
    });
  }, { passive: true });
})();

/* External links open in a new tab (mailto:, #anchors, and relative links untouched) */
(function () {
  document.querySelectorAll('a[href^="http"]').forEach(function (a) {
    a.target = '_blank';
    a.rel = 'noopener';
  });
})();

/* CV request modal */
(function () {
  var backdrop = document.getElementById('cv-modal');
  if (!backdrop) return;
  var closeBtn = document.getElementById('cv-close');
  var lastFocus = null;
  function open(e) {
    e.preventDefault();
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    (backdrop.querySelector('.btn') || closeBtn).focus();
  }
  function close() {
    backdrop.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('.cv-link').forEach(function (l) { l.addEventListener('click', open); });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !backdrop.hidden) close(); });
})();
