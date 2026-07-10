/*
 * Hoosier Dirt & Gravel — cookie consent banner
 * US opt-out model + Google Consent Mode v2 (GTM-MH7ZBGD4).
 *
 * The Consent Mode DEFAULT state is set inline in each page's <head>,
 * BEFORE GTM loads. This file renders the UI and pushes the 'update'
 * once the visitor makes (or changes) a choice.
 *
 * Self-contained: no dependencies, injects its own styles.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hdg_consent_v1';
  var ACCENT = '#dda745';

  // Categories. "necessary" is always on and cannot be toggled.
  var CATEGORIES = [
    {
      key: 'analytics',
      name: 'Analytics',
      desc: 'Helps us understand which pages are visited and how the site is used, so we can improve it. (Google Analytics via Google Tag Manager.)'
    },
    {
      key: 'marketing',
      name: 'Marketing',
      desc: 'Used to measure ad campaigns and, if enabled, personalize marketing. (Google Ads / Meta, when active in Tag Manager.)'
    },
    {
      key: 'functional',
      name: 'Functional',
      desc: 'Enables embedded tools such as the contact form provider so features work correctly.'
    }
  ];

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function readConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function saveConsent(state) {
    var payload = {
      analytics: !!state.analytics,
      marketing: !!state.marketing,
      functional: !!state.functional,
      ts: new Date().toISOString(),
      v: 1
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
    return payload;
  }

  // Push the Consent Mode v2 update so GTM tags fire (or don't) accordingly.
  function applyConsent(state) {
    gtag('consent', 'update', {
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
      analytics_storage: state.analytics ? 'granted' : 'denied',
      functionality_storage: state.functional ? 'granted' : 'denied',
      personalization_storage: state.functional ? 'granted' : 'denied',
      security_storage: 'granted'
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cookie_consent_update' });
  }

  function gpcActive() {
    return navigator.globalPrivacyControl === true;
  }

  // ---- Styles -------------------------------------------------------------
  function injectStyles() {
    if (document.getElementById('hdg-cc-styles')) return;
    var css =
      '.hdg-cc *{box-sizing:border-box;}' +
      '.hdg-cc{position:fixed;z-index:2147483000;right:20px;bottom:20px;width:380px;max-width:calc(100vw - 32px);' +
        'background:#0a0a0a;color:#fbfaf8;border:2px solid rgba(221,167,69,.35);border-radius:4px;' +
        'box-shadow:0 12px 40px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'font-size:14px;line-height:1.5;padding:20px 20px 18px;transform:translateY(16px);opacity:0;' +
        'transition:opacity .25s ease,transform .25s ease;}' +
      '.hdg-cc.hdg-cc--show{opacity:1;transform:translateY(0);}' +
      '.hdg-cc h2{margin:0 0 8px;font-size:16px;font-weight:700;color:#fbfaf8;}' +
      '.hdg-cc p{margin:0 0 14px;color:#d8d4cc;}' +
      '.hdg-cc a{color:' + ACCENT + ';text-decoration:underline;}' +
      '.hdg-cc-actions{display:flex;flex-wrap:wrap;gap:8px;}' +
      '.hdg-cc-btn{flex:1 1 auto;min-width:110px;cursor:pointer;font:inherit;font-weight:600;' +
        'padding:10px 14px;border-radius:999px;border:2px solid transparent;transition:opacity .15s,transform .15s;}' +
      '.hdg-cc-btn:hover{transform:translateY(-1px);}' +
      '.hdg-cc-btn--primary{background:' + ACCENT + ';color:#0a0a0a;}' +
      '.hdg-cc-btn--ghost{background:transparent;color:#fbfaf8;border-color:rgba(221,167,69,.4);}' +
      '.hdg-cc-btn--link{flex:1 1 100%;background:none;border:none;color:#b7b2a8;text-decoration:underline;' +
        'padding:6px 0 0;min-width:0;font-weight:500;}' +
      /* Preferences modal */
      '.hdg-cc-overlay{position:fixed;inset:0;z-index:2147483001;background:rgba(0,0,0,.6);' +
        'display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .2s;}' +
      '.hdg-cc-overlay.hdg-cc--show{opacity:1;}' +
      '.hdg-cc-modal{background:#0a0a0a;color:#fbfaf8;border:2px solid rgba(221,167,69,.35);border-radius:4px;' +
        'width:560px;max-width:100%;max-height:calc(100vh - 40px);overflow:auto;padding:26px;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}' +
      '.hdg-cc-modal h2{margin:0 0 6px;font-size:20px;}' +
      '.hdg-cc-modal>p{color:#d8d4cc;font-size:14px;margin:0 0 18px;}' +
      '.hdg-cc-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;' +
        'padding:16px 0;border-top:1px solid rgba(221,167,69,.2);}' +
      '.hdg-cc-row h3{margin:0 0 4px;font-size:15px;}' +
      '.hdg-cc-row p{margin:0;font-size:13px;color:#b7b2a8;}' +
      '.hdg-cc-modal-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px;}' +
      /* Toggle switch */
      '.hdg-cc-switch{position:relative;flex:0 0 auto;width:46px;height:26px;}' +
      '.hdg-cc-switch input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer;}' +
      '.hdg-cc-track{position:absolute;inset:0;background:#3a3a34;border-radius:999px;transition:background .2s;}' +
      '.hdg-cc-track:before{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;' +
        'background:#fbfaf8;border-radius:50%;transition:transform .2s;}' +
      '.hdg-cc-switch input:checked+.hdg-cc-track{background:' + ACCENT + ';}' +
      '.hdg-cc-switch input:checked+.hdg-cc-track:before{transform:translateX(20px);}' +
      '.hdg-cc-switch input:disabled+.hdg-cc-track{opacity:.55;cursor:not-allowed;}' +
      '.hdg-cc-switch input:focus-visible+.hdg-cc-track{outline:2px solid ' + ACCENT + ';outline-offset:2px;}' +
      '.hdg-cc-btn:focus-visible{outline:2px solid ' + ACCENT + ';outline-offset:2px;}' +
      '@media (max-width:480px){.hdg-cc{right:12px;left:12px;bottom:12px;width:auto;}}' +
      '@media (prefers-reduced-motion:reduce){.hdg-cc,.hdg-cc-overlay,.hdg-cc-track:before{transition:none;}}';
    var style = document.createElement('style');
    style.id = 'hdg-cc-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- Banner -------------------------------------------------------------
  var bannerEl = null;

  function showBanner() {
    if (bannerEl) return;
    bannerEl = document.createElement('div');
    bannerEl.className = 'hdg-cc';
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-live', 'polite');
    bannerEl.setAttribute('aria-label', 'Cookie consent');
    bannerEl.innerHTML =
      '<h2>We value your privacy</h2>' +
      '<p>We use cookies to analyze site traffic and improve your experience. ' +
      'You can accept all, reject non-essential, or choose which to allow. ' +
      'See our <a href="/cookie-policy">Cookie Policy</a> and <a href="/privacy">Privacy Policy</a>.</p>' +
      '<div class="hdg-cc-actions">' +
        '<button type="button" class="hdg-cc-btn hdg-cc-btn--primary" data-cc="accept">Accept all</button>' +
        '<button type="button" class="hdg-cc-btn hdg-cc-btn--ghost" data-cc="reject">Reject all</button>' +
        '<button type="button" class="hdg-cc-btn hdg-cc-btn--link" data-cc="prefs">Manage preferences</button>' +
      '</div>';
    document.body.appendChild(bannerEl);
    // Force reflow then animate in.
    void bannerEl.offsetWidth;
    bannerEl.classList.add('hdg-cc--show');

    bannerEl.querySelector('[data-cc="accept"]').addEventListener('click', function () {
      finish({ analytics: true, marketing: true, functional: true });
    });
    bannerEl.querySelector('[data-cc="reject"]').addEventListener('click', function () {
      finish({ analytics: false, marketing: false, functional: false });
    });
    bannerEl.querySelector('[data-cc="prefs"]').addEventListener('click', openPreferences);
  }

  function hideBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove('hdg-cc--show');
    var el = bannerEl;
    bannerEl = null;
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }

  function finish(state) {
    var saved = saveConsent(state);
    applyConsent(saved);
    hideBanner();
  }

  // ---- Preferences modal --------------------------------------------------
  function openPreferences() {
    var current = readConsent() || {
      analytics: !gpcActive(),
      marketing: !gpcActive(),
      functional: !gpcActive()
    };

    var overlay = document.createElement('div');
    overlay.className = 'hdg-cc-overlay';

    var rows = CATEGORIES.map(function (c) {
      var checked = current[c.key] ? ' checked' : '';
      return (
        '<div class="hdg-cc-row">' +
          '<div><h3>' + c.name + '</h3><p>' + c.desc + '</p></div>' +
          '<label class="hdg-cc-switch">' +
            '<input type="checkbox" data-cc-cat="' + c.key + '"' + checked + ' aria-label="' + c.name + ' cookies">' +
            '<span class="hdg-cc-track"></span>' +
          '</label>' +
        '</div>'
      );
    }).join('');

    overlay.innerHTML =
      '<div class="hdg-cc-modal" role="dialog" aria-modal="true" aria-labelledby="hdg-cc-title">' +
        '<h2 id="hdg-cc-title">Cookie preferences</h2>' +
        '<p>Choose which cookies we may use. Strictly necessary cookies keep the site working and are always on. ' +
        'Read our <a href="/cookie-policy">Cookie Policy</a>.</p>' +
        '<div class="hdg-cc-row">' +
          '<div><h3>Strictly necessary</h3><p>Required for the site to function and to remember your cookie choice. Always active.</p></div>' +
          '<label class="hdg-cc-switch">' +
            '<input type="checkbox" checked disabled aria-label="Strictly necessary cookies (always on)">' +
            '<span class="hdg-cc-track"></span>' +
          '</label>' +
        '</div>' +
        rows +
        '<div class="hdg-cc-modal-actions">' +
          '<button type="button" class="hdg-cc-btn hdg-cc-btn--primary" data-cc="save">Save preferences</button>' +
          '<button type="button" class="hdg-cc-btn hdg-cc-btn--ghost" data-cc="accept-all">Accept all</button>' +
          '<button type="button" class="hdg-cc-btn hdg-cc-btn--ghost" data-cc="reject-all">Reject all</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    void overlay.offsetWidth;
    overlay.classList.add('hdg-cc--show');

    function close() {
      overlay.classList.remove('hdg-cc--show');
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 200);
    }

    function collect() {
      var state = {};
      CATEGORIES.forEach(function (c) {
        var input = overlay.querySelector('[data-cc-cat="' + c.key + '"]');
        state[c.key] = !!(input && input.checked);
      });
      return state;
    }

    overlay.querySelector('[data-cc="save"]').addEventListener('click', function () {
      finish(collect());
      close();
    });
    overlay.querySelector('[data-cc="accept-all"]').addEventListener('click', function () {
      finish({ analytics: true, marketing: true, functional: true });
      close();
    });
    overlay.querySelector('[data-cc="reject-all"]').addEventListener('click', function () {
      finish({ analytics: false, marketing: false, functional: false });
      close();
    });
    // Click outside the modal closes without saving.
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }

  // Public hook for the footer link / manual reopen.
  window.openCookieSettings = openPreferences;

  // Inject a persistent "Cookie Settings" link into the footer legal nav.
  function injectFooterLink() {
    var nav = document.querySelector('.footer-legal');
    if (!nav || nav.querySelector('[data-cc-settings]')) return;
    var a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-cc-settings', '');
    a.textContent = 'Cookie Settings';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openPreferences();
    });
    nav.appendChild(a);
  }

  // ---- Init ---------------------------------------------------------------
  function init() {
    injectStyles();
    injectFooterLink();
    var saved = readConsent();
    if (saved) {
      // Re-assert the stored choice on every page load (Consent Mode is per-page).
      applyConsent(saved);
    } else {
      // No choice yet — show the banner. Default state was already set inline.
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
