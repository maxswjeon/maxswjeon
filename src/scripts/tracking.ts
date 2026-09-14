export const TRACKING_CONSENT_KEY = 'swjeon:tracking-consent:v1';
const TRACKING_SESSION_KEY = `${TRACKING_CONSENT_KEY}:session`;

export type TrackingConsent = {
  analytics: boolean;
  marketing: boolean;
};

export type TrackingConfig = {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  clarityProjectId?: string;
  naverAnalyticsId?: string;
  kakaoPixelId?: string;
};

export type NormalizedTrackingConfig = Required<TrackingConfig>;

type GoogleCommand = (...args: unknown[]) => void;
type ClarityCommand = (...args: unknown[]) => void;

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: GoogleCommand;
  clarity?: ClarityCommand & { q?: IArguments[] };
  wcs_add?: Record<string, string>;
  wcs_do?: () => void;
  kakaoPixel?: (id: string) => { pageView: () => void };
};

const cleanId = (value: string | undefined, pattern: RegExp): string => {
  const id = value?.trim() ?? '';
  return pattern.test(id) ? id : '';
};

export function normalizeTrackingConfig(config: TrackingConfig): NormalizedTrackingConfig {
  return {
    googleAnalyticsId: cleanId(config.googleAnalyticsId, /^G-[A-Z0-9]+$/i),
    googleTagManagerId: cleanId(config.googleTagManagerId, /^GTM-[A-Z0-9]+$/i),
    clarityProjectId: cleanId(config.clarityProjectId, /^[a-z0-9]+$/i),
    naverAnalyticsId: cleanId(config.naverAnalyticsId, /^[a-z0-9_-]+$/i),
    kakaoPixelId: cleanId(config.kakaoPixelId, /^\d+$/),
  };
}

export function parseStoredConsent(value: string | null): TrackingConsent | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as TrackingConsent).analytics === 'boolean' &&
      typeof (parsed as TrackingConsent).marketing === 'boolean'
    ) {
      return {
        analytics: (parsed as TrackingConsent).analytics,
        marketing: (parsed as TrackingConsent).marketing,
      };
    }
  } catch {
    // A malformed preference is treated as no decision so the visitor can choose again.
  }

  return null;
}

export function safePageUrl(value: string, base = 'https://localhost'): string {
  try {
    const url = new URL(value, base);
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
}

export function enabledTrackers(config: TrackingConfig, consent: TrackingConsent): string[] {
  const normalized = normalizeTrackingConfig(config);
  const enabled: string[] = [];

  if (normalized.googleTagManagerId && (consent.analytics || consent.marketing)) {
    enabled.push('google-tag-manager');
  } else if (normalized.googleAnalyticsId && consent.analytics) {
    enabled.push('google-analytics');
  }
  if (normalized.clarityProjectId && consent.analytics) enabled.push('microsoft-clarity');
  if (normalized.naverAnalyticsId && consent.analytics) enabled.push('naver-analytics');
  if (normalized.kakaoPixelId && consent.marketing) enabled.push('kakao-pixel');

  return enabled;
}

function loadScript(id: string, source: string, onLoad?: () => void): void {
  if (document.getElementById(id)) return;

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = source;
  script.referrerPolicy = 'no-referrer';
  if (onLoad) script.addEventListener('load', onLoad, { once: true });
  document.head.append(script);
}

function prepareGoogleConsent(consent: TrackingConsent): TrackingWindow {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer ?? [];
  trackingWindow.gtag =
    trackingWindow.gtag ??
    function gtag() {
      trackingWindow.dataLayer?.push(arguments);
    };

  const granted = (value: boolean) => (value ? 'granted' : 'denied');
  trackingWindow.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });
  trackingWindow.gtag('consent', 'update', {
    ad_storage: granted(consent.marketing),
    ad_user_data: granted(consent.marketing),
    ad_personalization: granted(consent.marketing),
    analytics_storage: granted(consent.analytics),
  });

  return trackingWindow;
}

function loadGoogleAnalytics(id: string, consent: TrackingConsent, pageLocation: string): void {
  const trackingWindow = prepareGoogleConsent(consent);
  trackingWindow.gtag?.('js', new Date());
  trackingWindow.gtag?.('config', id, { send_page_view: false });
  trackingWindow.gtag?.('event', 'page_view', {
    page_location: pageLocation,
    page_title: document.title,
  });
  loadScript('google-tag', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

function loadGoogleTagManager(id: string, consent: TrackingConsent, pageLocation: string): void {
  const trackingWindow = prepareGoogleConsent(consent);
  trackingWindow.dataLayer?.push({
    event: 'tracking_consent_ready',
    tracking_page_location: pageLocation,
  });
  trackingWindow.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  loadScript('google-tag-manager', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`);
}

function loadClarity(id: string, consent: TrackingConsent): void {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.clarity =
    trackingWindow.clarity ??
    function clarity() {
      const clarityQueue = trackingWindow.clarity?.q ?? [];
      clarityQueue.push(arguments);
      if (trackingWindow.clarity) trackingWindow.clarity.q = clarityQueue;
    };
  trackingWindow.clarity('consentv2', {
    ad_Storage: consent.marketing ? 'granted' : 'denied',
    analytics_Storage: 'granted',
  });
  loadScript('microsoft-clarity', `https://www.clarity.ms/tag/${encodeURIComponent(id)}`);
}

function loadNaverAnalytics(id: string): void {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.wcs_add = { ...(trackingWindow.wcs_add ?? {}), wa: id };
  loadScript('naver-analytics', 'https://wcs.naver.net/wcslog.js', () => trackingWindow.wcs_do?.());
}

function loadKakaoPixel(id: string): void {
  const trackingWindow = window as TrackingWindow;
  loadScript('kakao-pixel', 'https://t1.daumcdn.net/kas/static/kp.js', () => {
    trackingWindow.kakaoPixel?.(id).pageView();
  });
}

function removeQueryBeforeTracking(): string {
  const pageLocation = safePageUrl(window.location.href);
  if (window.location.search) {
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.hash}`,
    );
  }
  return pageLocation;
}

function activateTracking(config: NormalizedTrackingConfig, consent: TrackingConsent): string[] {
  const trackers = enabledTrackers(config, consent);
  if (trackers.length === 0) return trackers;

  const pageLocation = removeQueryBeforeTracking();
  if (trackers.includes('google-tag-manager')) {
    loadGoogleTagManager(config.googleTagManagerId, consent, pageLocation);
  } else if (trackers.includes('google-analytics')) {
    loadGoogleAnalytics(config.googleAnalyticsId, consent, pageLocation);
  }
  if (trackers.includes('microsoft-clarity')) loadClarity(config.clarityProjectId, consent);
  if (trackers.includes('naver-analytics')) loadNaverAnalytics(config.naverAnalyticsId);
  if (trackers.includes('kakao-pixel')) loadKakaoPixel(config.kakaoPixelId);
  return trackers;
}

export function initializeTracking(config: TrackingConfig): void {
  const normalized = normalizeTrackingConfig(config);
  const hasConfiguredServices = Object.values(normalized).some(Boolean);

  const banner = document.querySelector<HTMLElement>('[data-tracking-banner]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-tracking-dialog]');
  const form = dialog?.querySelector<HTMLFormElement>('form');
  const analyticsInput = dialog?.querySelector<HTMLInputElement>('[name="analytics"]');
  const marketingInput = dialog?.querySelector<HTMLInputElement>('[name="marketing"]');
  const emptyMessage = dialog?.querySelector<HTMLElement>('[data-tracking-empty]');
  const options = dialog?.querySelector<HTMLElement>('[data-tracking-options]');
  const storageNote = dialog?.querySelector<HTMLElement>('[data-tracking-storage-note]');

  if (!hasConfiguredServices) {
    if (emptyMessage) emptyMessage.hidden = false;
    if (options) options.hidden = true;
  }

  const openSettings = () => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  let storedConsent: TrackingConsent | null = null;
  let storageAvailable = true;
  try {
    storedConsent = parseStoredConsent(sessionStorage.getItem(TRACKING_SESSION_KEY));
    if (!storedConsent) storedConsent = parseStoredConsent(localStorage.getItem(TRACKING_CONSENT_KEY));
  } catch {
    try {
      storedConsent = parseStoredConsent(localStorage.getItem(TRACKING_CONSENT_KEY));
    } catch {
      storageAvailable = false;
    }
  }
  if (storageNote && !storageAvailable) storageNote.hidden = false;

  let loadedTrackers: string[] = [];
  if (storedConsent) {
    if (analyticsInput) analyticsInput.checked = storedConsent.analytics;
    if (marketingInput) marketingInput.checked = storedConsent.marketing;
    loadedTrackers = activateTracking(normalized, storedConsent);
  } else if (banner && hasConfiguredServices) {
    banner.hidden = false;
  }

  const saveConsent = (consent: TrackingConsent) => {
    if (!hasConfiguredServices) {
      dialog?.close();
      return;
    }

    try {
      localStorage.setItem(TRACKING_CONSENT_KEY, JSON.stringify(consent));
      try {
        sessionStorage.removeItem(TRACKING_SESSION_KEY);
      } catch {
        // The durable preference is already saved.
      }
      window.location.reload();
      return;
    } catch {
      storageAvailable = false;
    }

    try {
      sessionStorage.setItem(TRACKING_SESSION_KEY, JSON.stringify(consent));
      window.location.reload();
      return;
    } catch {
      // Fall back to an explicit current-page choice below.
    }

    const desiredTrackers = enabledTrackers(normalized, consent);
    const mustUnload = loadedTrackers.some((tracker) => !desiredTrackers.includes(tracker));
    if (mustUnload) {
      window.location.reload();
      return;
    }

    loadedTrackers = [...new Set([...loadedTrackers, ...activateTracking(normalized, consent)])];
    if (analyticsInput) analyticsInput.checked = consent.analytics;
    if (marketingInput) marketingInput.checked = consent.marketing;
    if (storageNote && !storageAvailable) storageNote.hidden = false;
    if (banner) banner.hidden = true;
    if (dialog && !dialog.open) openSettings();
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[data-tracking-settings]')) {
      event.preventDefault();
      openSettings();
    } else if (target.closest('[data-tracking-close]')) {
      dialog?.close();
    } else if (target.closest('[data-tracking-accept-all]')) {
      saveConsent({ analytics: true, marketing: true });
    } else if (target.closest('[data-tracking-reject-all]')) {
      saveConsent({ analytics: false, marketing: false });
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    saveConsent({
      analytics: analyticsInput?.checked ?? false,
      marketing: marketingInput?.checked ?? false,
    });
  });
}
