(function () {
  var STORAGE_KEY = 'lelit_cookie_consent_v2';
  var MEASUREMENT_ID = 'G-ZE4MF08M7X';
  var ANALYTICS_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  var DEFAULT_PREFERENCES = {
    analytics: false
  };

  function clonePreferences(preferences) {
    return {
      analytics: Boolean(preferences && preferences.analytics)
    };
  }

  function readStoredPreferences() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      return {
        analytics: Boolean(parsed.analytics),
        updatedAt: parsed.updatedAt || null
      };
    } catch (error) {
      return null;
    }
  }

  function writeStoredPreferences(preferences) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        analytics: Boolean(preferences.analytics),
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      // Ignore storage failures and keep the current-page choice functional.
    }
  }

  function disableAnalytics() {
    window['ga-disable-' + MEASUREMENT_ID] = true;
  }

  function ensureAnalyticsLoaded() {
    if (window.__lelitAnalyticsLoaded) {
      window['ga-disable-' + MEASUREMENT_ID] = false;
      return;
    }

    window.__lelitAnalyticsLoaded = true;
    window['ga-disable-' + MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      anonymize_ip: true
    });

    var script = document.createElement('script');
    script.async = true;
    script.src = ANALYTICS_SRC;
    document.head.appendChild(script);
  }

  function applyTrackingPreferences(preferences) {
    if (preferences.analytics) {
      ensureAnalyticsLoaded();
    } else {
      disableAnalytics();
    }
  }

  function getBanner() {
    return document.getElementById('cookieConsentBanner');
  }

  function getModal() {
    return document.getElementById('cookiePreferencesModal');
  }

  function getAnalyticsToggle() {
    return document.getElementById('cookieAnalyticsToggle');
  }

  function setBannerVisible(isVisible) {
    var banner = getBanner();
    if (banner) {
      banner.classList.toggle('is-visible', isVisible);
    }
  }

  function setModalVisible(isVisible) {
    var modal = getModal();
    if (!modal) {
      return;
    }

    modal.classList.toggle('is-visible', isVisible);
    modal.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
  }

  function syncPreferenceUI(preferences) {
    var analyticsToggle = getAnalyticsToggle();
    if (analyticsToggle) {
      analyticsToggle.checked = Boolean(preferences.analytics);
    }
  }

  function getCurrentPreferences() {
    var stored = readStoredPreferences();
    return stored ? clonePreferences(stored) : clonePreferences(DEFAULT_PREFERENCES);
  }

  function persistAndApply(preferences) {
    var normalized = clonePreferences(preferences);
    writeStoredPreferences(normalized);
    applyTrackingPreferences(normalized);
    syncPreferenceUI(normalized);
    setBannerVisible(false);
    setModalVisible(false);
  }

  function openPreferences() {
    syncPreferenceUI(getCurrentPreferences());
    setModalVisible(true);
  }

  function injectConsentUI() {
    if (getBanner() || getModal()) {
      return;
    }

    var banner = document.createElement('section');
    banner.id = 'cookieConsentBanner';
    banner.className = 'cookie-consent-banner';
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cookie-consent-copy">' +
        '<p class="cookie-consent-eyebrow">Privacy choices</p>' +
        '<h2>This site uses optional analytics cookies.</h2>' +
        '<p>Google Analytics helps measure visits and page use. It stays off unless you opt in. You can reject, accept, or customize now, and revisit your choice at any time.</p>' +
        '<p class="cookie-consent-meta"><a href="privacy.html#cookies">Read the privacy and cookies notice</a></p>' +
      '</div>' +
      '<div class="cookie-consent-actions">' +
        '<button type="button" class="cookie-consent-button cookie-consent-button-secondary" data-cookie-action="reject-all">Reject all</button>' +
        '<button type="button" class="cookie-consent-button cookie-consent-button-secondary" data-cookie-action="customize">Customize</button>' +
        '<button type="button" class="cookie-consent-button cookie-consent-button-primary" data-cookie-action="accept-all">Accept all</button>' +
      '</div>';
    document.body.appendChild(banner);

    var modal = document.createElement('section');
    modal.id = 'cookiePreferencesModal';
    modal.className = 'cookie-preferences-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-label', 'Cookie preferences');
    modal.innerHTML =
      '<div class="cookie-preferences-card">' +
        '<div class="cookie-preferences-header">' +
          '<div>' +
            '<p class="cookie-consent-eyebrow">Cookie settings</p>' +
            '<h2>Choose which cookies are allowed.</h2>' +
          '</div>' +
          '<button type="button" class="cookie-icon-button" data-cookie-action="close-preferences" aria-label="Close cookie settings">Close</button>' +
        '</div>' +
        '<p class="cookie-preferences-intro">Essential storage keeps basic site functions working. Analytics is optional and uses Google Analytics for aggregate usage measurement.</p>' +
        '<div class="cookie-preferences-list">' +
          '<article class="cookie-preference-item">' +
            '<div>' +
              '<h3>Essential</h3>' +
              '<p>Required for the site to work and to remember your consent choice.</p>' +
            '</div>' +
            '<span class="cookie-status-lock">Always active</span>' +
          '</article>' +
          '<article class="cookie-preference-item">' +
            '<div>' +
              '<h3>Analytics</h3>' +
              '<p>Google Analytics for visit counts, page usage, and performance reporting. Provider: Google LLC.</p>' +
            '</div>' +
            '<label class="cookie-toggle">' +
              '<input id="cookieAnalyticsToggle" type="checkbox">' +
              '<span class="cookie-toggle-ui" aria-hidden="true"></span>' +
              '<span class="cookie-toggle-label">Allow analytics</span>' +
            '</label>' +
          '</article>' +
        '</div>' +
        '<div class="cookie-preferences-footer">' +
          '<a href="privacy.html#cookies" class="cookie-inline-link">Privacy and cookies notice</a>' +
          '<div class="cookie-preferences-actions">' +
            '<button type="button" class="cookie-consent-button cookie-consent-button-secondary" data-cookie-action="reject-all">Reject all</button>' +
            '<button type="button" class="cookie-consent-button cookie-consent-button-primary" data-cookie-action="save-preferences">Save preferences</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    var settingsButton = document.createElement('button');
    settingsButton.type = 'button';
    settingsButton.id = 'cookieSettingsButton';
    settingsButton.className = 'cookie-settings-button';
    settingsButton.textContent = 'Cookie settings';
    settingsButton.setAttribute('aria-label', 'Open cookie settings');
    settingsButton.setAttribute('data-cookie-action', 'open-preferences');
    document.body.appendChild(settingsButton);

    document.body.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      var actionElement = target.closest('[data-cookie-action]');
      if (!(actionElement instanceof HTMLElement)) {
        return;
      }

      var action = actionElement.getAttribute('data-cookie-action');
      if (!action) {
        return;
      }

      if (action === 'accept-all') {
        persistAndApply({ analytics: true });
      } else if (action === 'reject-all') {
        persistAndApply({ analytics: false });
      } else if (action === 'customize' || action === 'open-preferences') {
        openPreferences();
      } else if (action === 'close-preferences') {
        setModalVisible(false);
      } else if (action === 'save-preferences') {
        var analyticsToggle = getAnalyticsToggle();
        persistAndApply({
          analytics: analyticsToggle ? analyticsToggle.checked : false
        });
      }
    });
  }

  disableAnalytics();

  document.addEventListener('DOMContentLoaded', function () {
    injectConsentUI();

    var stored = readStoredPreferences();
    if (stored) {
      var preferences = clonePreferences(stored);
      applyTrackingPreferences(preferences);
      syncPreferenceUI(preferences);
      return;
    }

    syncPreferenceUI(DEFAULT_PREFERENCES);
    setBannerVisible(true);
  });
})();
