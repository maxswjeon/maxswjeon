export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const ui = {
  ko: {
    homeLabel: '전상완 홈',
    skip: '본문으로 건너뛰기',
    language: '언어 선택',
    languageName: '한국어',
    footerTitle: ['연락하기'],
    privacy: 'Privacy',
    trackingSettings: '방문 데이터 설정',
    sourceLinks: '원문 링크',
  },
  en: {
    homeLabel: 'Sangwan Jeon’s homepage',
    skip: 'Skip to main content',
    language: 'Choose language',
    languageName: 'English',
    footerTitle: ['Get in touch'],
    privacy: 'Privacy',
    trackingSettings: 'Visitor data settings',
    sourceLinks: 'Sources',
  },
} as const;

export function removeLocalePrefix(pathname: string) {
  const path = pathname.replace(/^\/(?:ko|en)(?=\/|$)/, '');
  return path || '/';
}
