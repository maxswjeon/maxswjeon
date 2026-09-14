import type { ImageMetadata } from 'astro';
import bearOj from '../assets/projects/bear-oj.webp';
import clubroom from '../assets/projects/clubroom.webp';
import coryoseProcess from '../assets/projects/coryose-process.webp';
import fairtrade from '../assets/projects/fairtrade.webp';
import outtaCertificates from '../assets/projects/outta-certificates.webp';
import spaceyPassion from '../assets/projects/spacey-passion.webp';
import yonseiMileage from '../assets/projects/yonsei-mileage.webp';

export type ProjectMedia = {
  src: ImageMetadata;
  alt: string;
  caption: string;
  source?: string;
  layout?: 'wide' | 'portrait';
};

export const projectMedia: Record<string, readonly ProjectMedia[]> = {
  'coryose-process': [
    {
      src: coryoseProcess,
      alt: '고려씰링 업무 프로세스 관리 솔루션의 공지와 발주량 통계 관리자 화면',
      caption: '업무 프로세스 관리 솔루션의 관리자 화면',
    },
  ],
  'bear-oj': [
    {
      src: bearOj,
      alt: 'YCC 온라인 저지 시작 안내 화면',
      caption: '온라인 저지의 시작 안내 화면',
    },
  ],
  'yonsei-mileage': [
    {
      src: yonseiMileage,
      alt: '연세대학교 과목별 마일리지 기록과 강의 정보를 보여주는 화면',
      caption: '과목별 마일리지 기록과 강의 정보 조회 화면',
    },
  ],
  'outta-certificates': [
    {
      src: outtaCertificates,
      alt: 'OUTTA 수료증 발급센터에서 증서 배경과 문구를 편집하는 관리자 화면',
      caption: '수료증 배경과 문구를 편집하는 관리자 화면',
    },
  ],
  'spacey-passion': [
    {
      src: spaceyPassion,
      alt: '우주로의 열정 강연 일정과 장소를 안내하는 SpaceY 웹사이트',
      caption: 'SpaceY 강연 일정과 장소 안내 화면',
    },
  ],
  clubroom: [
    {
      src: clubroom,
      alt: '문 그림과 함께 동아리방 재실 여부를 보여주는 동방에 누구 서비스 화면',
      caption: '동아리방 재실 확인 화면',
    },
  ],
  fairtrade: [
    {
      src: fairtrade,
      alt: '바코드 조회 후 공정무역 제품 정보를 보여주는 FairTrade Android 앱 화면',
      caption: '공개 저장소의 Android 결과 화면',
      source: 'https://github.com/maxswjeon/Fairtrade',
      layout: 'portrait',
    },
  ],
};
