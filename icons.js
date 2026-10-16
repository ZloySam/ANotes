// Click an app icon: show it big, and use it for the page logo and tab icon.
(function () {
  var swatches = document.querySelectorAll('.icon-swatch');
  var big = document.getElementById('icon-big');
  var bigName = document.getElementById('icon-big-name');
  if (!swatches.length || !big) return;
  var topLogo = document.querySelector('.topbar .logo-img');
  var favicon = document.querySelector('link[rel="icon"]');

  function pick(sw) {
    var src = sw.querySelector('img').getAttribute('src');
    var name = sw.querySelector('.name').textContent;
    swatches.forEach(function (s) { s.setAttribute('aria-pressed', s === sw ? 'true' : 'false'); });
    big.src = src;
    big.alt = name + ' icon';
    bigName.textContent = name;
    if (topLogo) topLogo.src = src;
    if (favicon) favicon.href = src;
  }

  swatches.forEach(function (sw) {
    sw.addEventListener('click', function () { pick(sw); });
  });
})();
