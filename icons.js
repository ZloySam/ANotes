// App icons: tap one in the strip to use it for the page logo and tab icon;
// tap the logo itself to jump to a random other icon.
(function () {
  var swatches = Array.prototype.slice.call(document.querySelectorAll('.icon-strip .icon-swatch'));
  var logo = document.querySelector('.topbar .logo-img');
  var favicon = document.querySelector('link[rel="icon"]');
  if (!swatches.length) return;
  var current = 0;

  var preview = document.querySelector('.icon-preview img');
  var previewName = document.querySelector('.icon-preview-name');

  function use(i) {
    current = i;
    var img = swatches[i].querySelector('img');
    var src = img.getAttribute('src');
    swatches.forEach(function (s, k) { s.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    if (preview) {
      preview.src = src;
      preview.classList.remove('pop');
      void preview.offsetWidth; // restart the animation
      preview.classList.add('pop');
    }
    if (previewName) previewName.textContent = img.getAttribute('alt');
    if (logo) {
      logo.src = src;
      logo.classList.remove('spin');
      void logo.offsetWidth; // restart the animation
      logo.classList.add('spin');
    }
    if (favicon) favicon.href = src;
  }

  swatches.forEach(function (sw, i) {
    sw.addEventListener('click', function () {
      use(i);
      var row = sw.parentNode;
      row.scrollTo({ left: sw.offsetLeft - (row.clientWidth - sw.offsetWidth) / 2, behavior: 'smooth' });
    });
  });

  if (logo) {
    logo.setAttribute('role', 'button');
    logo.setAttribute('tabindex', '0');
    logo.setAttribute('aria-label', 'Change the app icon');
    var random = function () {
      var next = Math.floor(Math.random() * (swatches.length - 1));
      use(next >= current ? next + 1 : next);
    };
    logo.addEventListener('click', random);
    logo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); random(); }
    });
  }
})();
