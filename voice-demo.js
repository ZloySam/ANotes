// "Two voices, one note": Read aloud marks the words one by one;
// Your voice shows the recording's waveform. It switches by itself until
// the visitor picks one.
(function () {
  var demo = document.getElementById('voice-demo');
  if (!demo) return;
  var tabs = demo.querySelectorAll('[data-mode]');
  var stage = demo.querySelector('.vd-stage');
  var words = demo.querySelectorAll('.vd-text span');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mode = 'read';
  var word = 0;
  var chosen = false;
  var ticks = 0;

  function show(m) {
    mode = m;
    stage.setAttribute('data-mode', m);
    Array.prototype.forEach.call(tabs, function (t) {
      if (t.tagName === 'BUTTON') t.setAttribute('aria-selected', t.dataset.mode === m ? 'true' : 'false');
    });
    word = 0;
    ticks = 0;
    mark();
  }

  function mark() {
    Array.prototype.forEach.call(words, function (w, i) {
      w.classList.toggle('on', mode === 'read' && (reduce ? i < 4 : i === word));
    });
  }

  Array.prototype.forEach.call(tabs, function (t) {
    if (t.tagName !== 'BUTTON') return;
    t.addEventListener('click', function () { chosen = true; show(t.dataset.mode); });
  });

  show('read');
  if (reduce) return;
  setInterval(function () {
    ticks++;
    if (mode === 'read') {
      word = (word + 1) % words.length;
      mark();
    }
    // About one sentence per mode, then switch, until the visitor chooses.
    if (!chosen && ticks >= words.length + 2) show(mode === 'read' ? 'voice' : 'read');
  }, 420);
})();
