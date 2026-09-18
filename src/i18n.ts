export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const ui = {
  ko: {
    homeLabel: '전상완 홈',
    skip: '본문으로 건너뛰기',
    primaryNav: '주요 메뉴',
    nav: { about: '소개', work: '작업', writing: '글' },
    role: '제품 개발, 운영, 인프라를 함께 다룹니다.',
    otherLocale: { locale: 'en', label: 'English' },
    privacy: '개인정보',
    trackingSettings: '방문 데이터 설정',
    sourceLinks: '원문 링크',
  },
  en: {
    homeLabel: 'Sangwan Jeon’s homepage',
    skip: 'Skip to main content',
    primaryNav: 'Primary navigation',
    nav: { about: 'About', work: 'Work', writing: 'Writing' },
    role: 'Works across product development, operations, and infrastructure.',
    otherLocale: { locale: 'ko', label: '한국어' },
    privacy: 'Privacy',
    trackingSettings: 'Visitor data settings',
    sourceLinks: 'Sources',
  },
} as const;

export function removeLocalePrefix(pathname: string) {
  const path = pathname.replace(/^\/(?:ko|en)(?=\/|$)/, '');
  return path || '/';
}

/** Renders a `2024.04-2026.05` range with an en dash. */
export function period(value: string) {
  return value.replace(/(\d{4}(?:\.\d{2})?)-(\d{4}(?:\.\d{2})?)/g, '$1–$2');
}
