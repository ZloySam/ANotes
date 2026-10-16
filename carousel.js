// Previous / next buttons for the features carousel.
(function () {
  var grid = document.querySelector('.feature-grid');
  var nav = document.querySelector('.car-nav');
  if (!grid || !nav) return;
  nav.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var card = grid.querySelector('.feature');
    var step = card ? card.getBoundingClientRect().width + 20 : 300;
    grid.scrollBy({ left: btn.dataset.dir === 'prev' ? -step : step, behavior: 'smooth' });
  });
})();
