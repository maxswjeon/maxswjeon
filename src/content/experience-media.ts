import type { ImageMetadata } from 'astro';
import nineAccountRecovery from '../assets/projects/nine-account-recovery.webp';
import zible from '../assets/projects/zible.webp';

export type ExperienceMedia = {
  src: ImageMetadata;
  alt: string;
  caption: string;
};

export const experienceMedia: Record<string, ExperienceMedia> = {
  'nine-account-recovery': {
    src: nineAccountRecovery,
    alt: 'Nine Chronicles 포털 계정 복구 서비스에서 지갑 연결을 안내하는 화면',
    caption: 'Nine Chronicles 포털 계정 복구 화면',
  },
  zible: {
    src: zible,
    alt: 'ZIBLE 모바일 서비스의 로그인과 스크랩북 화면 세 가지',
    caption: 'ZIBLE 모바일 서비스 화면',
  },
};
