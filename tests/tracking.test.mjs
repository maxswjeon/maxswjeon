import assert from 'node:assert/strict';
import test from 'node:test';

import {
  TRACKING_CONSENT_KEY,
  enabledTrackers,
  initializeTracking,
  normalizeGatewayPath,
  normalizeTrackingConfig,
  parseStoredConsent,
  safePageUrl,
} from '../src/scripts/tracking.ts';

class MockElement {
  constructor(selectors = []) {
    this.selectors = new Set(selectors);
    this.listeners = new Map();
    this.hidden = true;
    this.checked = false;
    this.open = false;
  }

  closest(selector) {
    return this.selectors.has(selector) ? this : null;
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  emit(type, event) {
    this.listeners.get(type)?.(event);
  }

  setAttribute(name) {
    if (name === 'open') this.open = true;
  }

  showModal() {
    this.open = true;
  }

  close() {
    this.open = false;
  }
}

function installMockBrowser({
  storedConsent = null,
  storageBlocked = false,
  storageWriteBlocked = false,
  sessionBlocked = false,
} = {}) {
  const banner = new MockElement();
  const form = new MockElement();
  const analyticsInput = new MockElement();
  const marketingInput = new MockElement();
  const emptyMessage = new MockElement();
  const options = new MockElement();
  const storageNote = new MockElement();
  const dialog = new MockElement();
  const dialogElements = new Map([
    ['form', form],
    ['[name="analytics"]', analyticsInput],
    ['[name="marketing"]', marketingInput],
    ['[data-tracking-empty]', emptyMessage],
    ['[data-tracking-options]', options],
    ['[data-tracking-storage-note]', storageNote],
  ]);
  dialog.querySelector = selector => dialogElements.get(selector) ?? null;

  const scripts = new Map();
  const document = new MockElement();
  document.title = 'Test page';
  document.querySelector = selector => {
    if (selector === '[data-tracking-banner]') return banner;
    if (selector === '[data-tracking-dialog]') return dialog;
    return null;
  };
  document.getElementById = id => scripts.get(id) ?? null;
  document.createElement = () => {
    const script = new MockElement();
    script.id = '';
    script.src = '';
    return script;
  };
  document.head = {
    append(script) {
      scripts.set(script.id, script);
    },
  };

  let savedValue = storedConsent;
  let reloads = 0;
  const storage = {
    getItem: () => {
      if (storageBlocked) throw new Error('blocked');
      return savedValue;
    },
    setItem: (_key, value) => {
      if (storageBlocked || storageWriteBlocked) throw new Error('blocked');
      savedValue = value;
    },
  };
  let sessionValue = null;
  const session = {
    getItem: () => {
      if (sessionBlocked) throw new Error('blocked');
      return sessionValue;
    },
    setItem: (_key, value) => {
      if (sessionBlocked) throw new Error('blocked');
      sessionValue = value;
    },
    removeItem: () => {
      if (sessionBlocked) throw new Error('blocked');
      sessionValue = null;
    },
  };
  const window = {
    location: {
      href: 'https://swjeon.kr/work/?email=private@example.com#project',
      pathname: '/work/',
      search: '?email=private@example.com',
      hash: '#project',
      reload: () => { reloads += 1; },
    },
    history: {
      state: null,
      replaceState: (_state, _unused, url) => {
        window.replacedUrl = url;
        window.location.search = '';
      },
    },
  };

  globalThis.Element = MockElement;
  globalThis.document = document;
  globalThis.window = window;
  globalThis.localStorage = storage;
  globalThis.sessionStorage = session;

  return {
    analyticsInput,
    banner,
    dialog,
    document,
    emptyMessage,
    form,
    marketingInput,
    options,
    scripts,
    storageNote,
    window,
    get savedValue() { return savedValue; },
    get sessionValue() { return sessionValue; },
    get reloads() { return reloads; },
  };
}

function click(target) {
  return { target, preventDefault() {} };
}

test('tracking stays disabled when IDs are missing or malformed', () => {
  const config = normalizeTrackingConfig({
    googleAnalyticsId: '<script>',
    googleTagManagerId: 'not-a-container',
    googleTagGatewayPath: '//tracker.example/',
    clarityProjectId: 'contains/slash',
    naverAnalyticsId: 'contains space',
    kakaoPixelId: 'not-numeric',
  });

  assert.deepEqual(config, {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    googleTagGatewayPath: '',
    clarityProjectId: '',
    naverAnalyticsId: '',
    kakaoPixelId: '',
  });
  assert.deepEqual(enabledTrackers(config, { analytics: true, marketing: true }), []);
});

test('Google Tag Gateway paths stay same-origin and normalize a trailing slash', () => {
  assert.equal(normalizeGatewayPath('/r8k3p'), '/r8k3p/');
  assert.equal(normalizeGatewayPath('/r8k3p/'), '/r8k3p/');
  assert.equal(normalizeGatewayPath('/nested/path/'), '');
  assert.equal(normalizeGatewayPath('https://tracker.example/'), '');
  assert.equal(normalizeGatewayPath('/'), '');
});

test('stored consent requires both explicit boolean categories', () => {
  assert.deepEqual(parseStoredConsent('{"analytics":true,"marketing":false}'), {
    analytics: true,
    marketing: false,
  });
  assert.equal(parseStoredConsent('{"analytics":true}'), null);
  assert.equal(parseStoredConsent('{bad json'), null);
  assert.equal(parseStoredConsent(null), null);
});

test('page URLs sent to trackers omit query strings and fragments', () => {
  assert.equal(
    safePageUrl('https://swjeon.kr/work/?email=private@example.com#secret'),
    'https://swjeon.kr/work/',
  );
});

test('GTM replaces direct Google Analytics and respects consent categories', () => {
  const config = {
    googleAnalyticsId: 'G-ABCDEFG123',
    googleTagManagerId: 'GTM-ABC1234',
    clarityProjectId: 'clarity123',
    naverAnalyticsId: 'naver_123',
    kakaoPixelId: '1234567890',
  };

  assert.deepEqual(enabledTrackers(config, { analytics: true, marketing: false }), [
    'google-tag-manager',
    'microsoft-clarity',
    'naver-analytics',
  ]);
  assert.deepEqual(enabledTrackers(config, { analytics: false, marketing: true }), [
    'google-tag-manager',
    'kakao-pixel',
  ]);
  assert.deepEqual(enabledTrackers(config, { analytics: false, marketing: false }), []);
});

test('configured runtime loads only consented analytics scripts and strips query data', () => {
  const browser = installMockBrowser({
    storedConsent: JSON.stringify({ analytics: true, marketing: false }),
  });

  initializeTracking({
    googleAnalyticsId: 'G-ABCDEFG123',
    clarityProjectId: 'clarity123',
    naverAnalyticsId: 'naver_123',
    kakaoPixelId: '1234567890',
  });

  assert.deepEqual([...browser.scripts.keys()], [
    'google-tag',
    'microsoft-clarity',
    'naver-analytics',
  ]);
  assert.equal(browser.scripts.has('kakao-pixel'), false);
  assert.equal(browser.window.replacedUrl, '/work/#project');
  assert.equal(Array.isArray(browser.window.dataLayer[0]), false, 'gtag queues the official arguments object');
  assert.equal(browser.window.dataLayer[0][0], 'consent');
  const pageView = browser.window.dataLayer.find(command => command[0] === 'event');
  assert.equal(pageView[2].page_location, 'https://swjeon.kr/work/');
});

test('GTM runtime replaces direct GA and marketing-only consent loads no analytics vendors', () => {
  const browser = installMockBrowser({
    storedConsent: JSON.stringify({ analytics: false, marketing: true }),
  });

  initializeTracking({
    googleAnalyticsId: 'G-ABCDEFG123',
    googleTagManagerId: 'GTM-ABC1234',
    googleTagGatewayPath: '/r8k3p/',
    clarityProjectId: 'clarity123',
    naverAnalyticsId: 'naver_123',
    kakaoPixelId: '1234567890',
  });

  assert.deepEqual([...browser.scripts.keys()], ['google-tag-manager', 'kakao-pixel']);
  assert.equal(browser.scripts.has('google-tag'), false);
  assert.equal(browser.scripts.get('google-tag-manager').src, '/r8k3p/?id=GTM-ABC1234');
});

test('GTM falls back to the standard Google endpoint without a gateway path', () => {
  const browser = installMockBrowser({
    storedConsent: JSON.stringify({ analytics: true, marketing: false }),
  });

  initializeTracking({ googleTagManagerId: 'GTM-ABC1234' });

  assert.equal(
    browser.scripts.get('google-tag-manager').src,
    'https://www.googletagmanager.com/gtm.js?id=GTM-ABC1234',
  );
});

test('settings remain useful with no services, and withdrawal persists before reload', () => {
  const emptyBrowser = installMockBrowser();
  initializeTracking({});
  emptyBrowser.document.emit(
    'click',
    click(new MockElement(['[data-tracking-settings]'])),
  );
  assert.equal(emptyBrowser.dialog.open, true);
  assert.equal(emptyBrowser.emptyMessage.hidden, false);
  assert.equal(emptyBrowser.options.hidden, true);

  const configuredBrowser = installMockBrowser({
    storedConsent: JSON.stringify({ analytics: true, marketing: true }),
  });
  initializeTracking({ googleAnalyticsId: 'G-ABCDEFG123', kakaoPixelId: '1234567890' });
  configuredBrowser.document.emit(
    'click',
    click(new MockElement(['[data-tracking-reject-all]'])),
  );
  assert.equal(configuredBrowser.savedValue, JSON.stringify({ analytics: false, marketing: false }));
  assert.equal(configuredBrowser.reloads, 1);
  assert.equal(TRACKING_CONSENT_KEY, 'swjeon:tracking-consent:v1');
});

test('blocked storage applies opt-in for the current page without throwing or reloading', () => {
  const browser = installMockBrowser({ storageBlocked: true, sessionBlocked: true });
  initializeTracking({ googleAnalyticsId: 'G-ABCDEFG123' });

  browser.document.emit(
    'click',
    click(new MockElement(['[data-tracking-accept-all]'])),
  );

  assert.equal(browser.scripts.has('google-tag'), true);
  assert.equal(browser.reloads, 0);
  assert.equal(browser.banner.hidden, true);
  assert.equal(browser.dialog.open, true);
  assert.equal(browser.storageNote.hidden, false);
});

test('session preference safely carries withdrawal when durable storage cannot be updated', () => {
  const browser = installMockBrowser({
    storedConsent: JSON.stringify({ analytics: true, marketing: true }),
    storageWriteBlocked: true,
  });
  initializeTracking({ googleAnalyticsId: 'G-ABCDEFG123', kakaoPixelId: '1234567890' });

  browser.document.emit(
    'click',
    click(new MockElement(['[data-tracking-reject-all]'])),
  );

  assert.equal(browser.sessionValue, JSON.stringify({ analytics: false, marketing: false }));
  assert.equal(browser.reloads, 1);
});
