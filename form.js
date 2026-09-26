// Signup / contact form for the "Coming soon" section.
// Backend contract: anotes-ops HANDOFF.md, "Laptops need to know" (2026-09-26).
// The checks here are only for the visitor's convenience; the server checks
// everything again. Both values below are public by design: never put a secret
// (Turnstile secret key, n8n credentials) in this file.
(function () {
  'use strict';

  var ENDPOINT = 'https://n8n.anotes.tech/webhook/anotes-form-48511fa6409755fd476d0cab0b261c87';
  // The Turnstile SITE key (24 characters). Empty = the form stays switched off.
  var TURNSTILE_SITE_KEY = '';

  var form = document.getElementById('signup');
  if (!form) return;

  var button = form.querySelector('button[type="submit"]');
  var statusEl = form.querySelector('.signup-status');
  var widgetId = null;
  var sending = false;

  function say(text, kind) {
    statusEl.textContent = text; // textContent only, never innerHTML
    statusEl.setAttribute('data-kind', kind || '');
  }

  function msSincePageLoad() {
    return Math.round(window.performance && performance.now ? performance.now() : 0);
  }

  if (!TURNSTILE_SITE_KEY) {
    say('Signup opens in a day or two.', '');
    return;
  }

  // The button stays disabled until Turnstile hands us a token.
  window.anotesTurnstileReady = function () {
    widgetId = window.turnstile.render('#su-turnstile', {
      sitekey: TURNSTILE_SITE_KEY,
      action: 'signup',
      theme: 'dark',
      size: 'flexible',
      callback: function () { button.disabled = sending; },
      'expired-callback': function () { button.disabled = true; },
      'error-callback': function () {
        button.disabled = true;
        say('The spam check could not load. Please reload the page and try again.', 'error');
      }
    });
  };
  var script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=anotesTurnstileReady';
  script.async = true;
  script.defer = true;
  script.onerror = function () {
    say('The spam check could not load. If you use a content blocker, allow challenges.cloudflare.com for this page.', 'error');
  };
  document.head.appendChild(script);

  var FIELD_ERRORS = {
    email: 'Please check your email address.',
    message: 'Your message is too long (2000 characters at most).',
    notify: 'Tick the box or write a message, so we know what you want.'
  };

  function errorFor(res) {
    if (res.status === 400) {
      return res.json().then(function (data) {
        var fields = (data && data.fields) || [];
        for (var i = 0; i < fields.length; i++) {
          if (FIELD_ERRORS[fields[i]]) return FIELD_ERRORS[fields[i]];
        }
        return 'Something in the form isn\'t right. Please check it and try again.';
      }, function () {
        return 'Something in the form isn\'t right. Please check it and try again.';
      });
    }
    if (res.status === 413) return Promise.resolve('Your message is too long. Please shorten it.');
    if (res.status === 429) return Promise.resolve('Too many tries from your connection. Please try again in an hour.');
    return Promise.resolve('Something went wrong on our side. Please try again later.');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (sending) return;

    var email = form.elements.email;
    var notify = form.elements.notify.checked;
    var message = form.elements.message.value.trim();

    // A bot filled in the hidden field: act as if it worked, send nothing.
    if (form.elements.website.value) {
      form.reset();
      say('Thanks! We got it.', 'ok');
      return;
    }
    if (!email.value.trim() || !email.checkValidity()) {
      say(FIELD_ERRORS.email, 'error');
      email.focus();
      return;
    }
    if (!notify && !message) {
      say(FIELD_ERRORS.notify, 'error');
      return;
    }
    var token = widgetId !== null && window.turnstile ? window.turnstile.getResponse(widgetId) : '';
    if (!token) {
      say('Please wait a moment for the spam check to finish.', 'error');
      return;
    }

    // Form-encoded body and no custom headers: anything else triggers a CORS
    // preflight, which the server refuses.
    var body = new URLSearchParams();
    body.set('email', email.value.trim());
    body.set('notify', notify ? 'yes' : 'no');
    body.set('message', message);
    body.set('website', '');
    body.set('elapsed_ms', String(msSincePageLoad()));
    body.set('token', token);

    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 15000);

    sending = true;
    button.disabled = true;
    say('Sending…', '');

    fetch(ENDPOINT, {
      method: 'POST',
      body: body,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: controller.signal
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        say(notify ? 'Thanks! You\'ll get one email when ANotes is ready.' : 'Thanks! You\'ll get a reply by email.', 'ok');
        return;
      }
      return errorFor(res).then(function (text) { say(text, 'error'); });
    }).catch(function () {
      say('Could not send. Please check your connection and try again.', 'error');
    }).then(function () {
      clearTimeout(timer);
      sending = false;
      // A Turnstile token works once; get a fresh one for the next send.
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
      button.disabled = true;
    });
  });
})();
