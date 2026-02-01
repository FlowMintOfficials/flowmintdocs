/**
 * Apply contact emails from config to all [data-email="general"] and [data-email="privacy"].
 * Uses window.FLOWMINT_CONFIG (from config.js) first so it works without fetch (e.g. file://).
 * Falls back to fetch(config.json) if config.js is not loaded.
 */
(function() {
  function setEmails(general, privacy) {
    general = String(general || '').trim() || 'hello@flowmint.com';
    privacy = String(privacy || '').trim() || 'privacy@flowmint.com';
    var list = document.querySelectorAll('[data-email="general"]');
    for (var i = 0; i < list.length; i++) {
      list[i].href = 'mailto:' + general;
      list[i].textContent = general;
    }
    list = document.querySelectorAll('[data-email="privacy"]');
    for (var j = 0; j < list.length; j++) {
      list[j].href = 'mailto:' + privacy;
      list[j].textContent = privacy;
    }
  }

  function applyEmails() {
    var config = window.FLOWMINT_CONFIG;
    if (config) {
      var c = config.contact || {};
      var general = c.generalEmail || (config.payment && config.payment.supportEmail) || '';
      var privacy = c.privacyEmail || '';
      setEmails(general, privacy);
      return;
    }
    var configUrl = 'config.json';
    var script = document.currentScript;
    if (script && script.src) {
      var base = script.src.replace(/#.*$/, '').replace(/\?.*$/, '').replace(/[^/]+$/, '');
      if (base) configUrl = base + (base.slice(-1) === '/' ? '' : '/') + 'config.json';
      else configUrl = new URL(configUrl, script.src).href;
    } else {
      var baseEl = document.querySelector('base');
      if (baseEl && baseEl.href) configUrl = new URL(configUrl, baseEl.href).href;
    }
    fetch(configUrl)
      .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(cfg) {
        var c = cfg.contact || {};
        setEmails(c.generalEmail || (cfg.payment && cfg.payment.supportEmail) || '', c.privacyEmail || '');
      })
      .catch(function() { setEmails('', ''); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyEmails);
  } else {
    applyEmails();
  }
})();
