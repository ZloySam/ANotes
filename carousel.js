// Features carousel: arrows, and a gentle auto-scroll that stops while the
// visitor hovers, touches or focuses it.
(function () {
  var grid = document.querySelector('.feature-grid');
  var nav = document.querySelector('.car-nav');
  if (!grid) return;
  var STEP_MS = 3000;

  function step(dir) {
    var card = grid.querySelector('.feature');
    var width = card ? card.getBoundingClientRect().width + 20 : 300;
    var atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
    var atStart = grid.scrollLeft <= 4;
    if (dir > 0 && atEnd) grid.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && atStart) grid.scrollTo({ left: grid.scrollWidth, behavior: 'smooth' });
    else grid.scrollBy({ left: dir * width, behavior: 'smooth' });
  }

  if (nav) {
    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (btn) step(btn.dataset.dir === 'prev' ? -1 : 1);
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var paused = false;
  var visible = false;
  ['mouseenter', 'touchstart', 'focusin'].forEach(function (ev) {
    grid.addEventListener(ev, function () { paused = true; }, { passive: true });
  });
  ['mouseleave', 'focusout'].forEach(function (ev) {
    grid.addEventListener(ev, function () { paused = false; });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(grid);
  } else {
    visible = true;
  }
  setInterval(function () {
    if (!paused && visible && !document.hidden) step(1);
  }, STEP_MS);
})();
