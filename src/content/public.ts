export type Project = {
  slug: string;
  title: string;
  group: ProjectGroup;
  eyebrow: string;
  summary: string;
  problem: string;
  contribution: string;
  change: string;
  status: string;
  link?: string;
  links?: readonly {
    label: string;
    href: string;
  }[];
  organizations?: readonly {
    label: string;
    href: string;
  }[];
  featured?: boolean;
};

export type ProjectGroup = 'client' | 'personal' | 'school' | 'community';

export type ExperienceWorkItem = {
  title: string;
  body: string;
  link?: string;
  media?: 'nine-account-recovery';
  links?: readonly {
    label: string;
    source: string;
    href: string;
  }[];
};

export const projectGroups: readonly { id: ProjectGroup; label: string; title: string }[] = [
  { id: 'client', label: 'Client work', title: '외주로 맡은 작업' },
  { id: 'personal', label: 'Personal', title: '개인 프로젝트' },
  { id: 'school', label: 'School', title: '학교에서 시작한 프로젝트' },
  { id: 'community', label: 'Community', title: '동아리·학회에서 만든 프로젝트' },
];

export const projectGroupLabels: Record<ProjectGroup, string> = {
  client: '외주',
  personal: '개인 프로젝트',
  school: '학교 프로젝트',
  community: '동아리·학회',
};

export const primaryExperience = {
  id: 'nexon-ngine-studios',
  organization: '엔진스튜디오 (NGINE STUDIOS) · 넥슨컴퍼니',
  role: 'Frontend Engineer · 정규직',
  period: '2024.04-2026.05',
  body: '넥슨코리아의 자회사 엔진스튜디오에서 프론트엔드 엔지니어로 근무했습니다. 넥슨 게임의 활성 이용자를 늘리고 넥슨 임직원의 업무 효율을 높이는 사내 웹 솔루션을 개발했습니다. NEXON 플랫폼본부(구 인텔리전스랩스)와 협업했으며, 제품 개발부터 인프라 구축·운영까지 담당했습니다.',
} as const;

export const experienceEntries = [
  {
    id: 'nine-corporation',
    organization: '플라네타리움 (나인코퍼레이션)',
    role: 'Frontend Engineer · 정규직',
    period: '2023.01-2023.04',
    body: '완전 탈중앙화 게임 Nine Chronicles의 DAU를 높이고 더 원활한 플레이 경험을 제공하는 Publishing Product Team에서 프론트엔드 엔지니어로 근무했습니다.',
    work: [
      {
        title: 'Nine Chronicles Launcher',
        body: '게임 런처의 활성화 흐름을 개선해 사용자 이탈 감소에 기여했습니다.',
        link: 'https://github.com/planetarium/9c-launcher',
      },
      {
        title: 'Nine Chronicles Account Recovery',
        body: '사용자가 계정을 복구해 게임에 복귀할 수 있는 포털 계정 복구 서비스를 개발해 복귀 사용자 유입과 DAU 증가에 기여했습니다.',
        media: 'nine-account-recovery',
      },
      {
        title: 'Dongrami',
        body: '블록체인 액션을 생성하고 스테이징하는 PoC 애플리케이션을 개발했습니다.',
        link: 'https://github.com/planetarium/dongrami',
      },
    ],
    organizationLinks: [
      { label: 'Nine Corporation', href: 'https://nine-corporation.com/' },
      { label: 'Planetarium Labs', href: 'https://www.planetariumlabs.com/' },
    ],
  },
  {
    id: 'zible',
    organization: 'DCION · ZIBLE',
    role: 'Full Stack Engineer',
    period: '2022.09-2023.01',
    body: '내 집 마련 정보를 모으는 서비스에서 OpenGraph 기반 공유 효과를 측정하고, Datahog와 Sentry로 사용 흐름을 확인해 퍼널을 개선했습니다.',
  },
  {
    id: 'promedius',
    organization: '프로메디우스 (Promedius Inc.)',
    role: '인턴',
    period: '2022.01-2022.02',
    body: '폐쇄망 온프레미스 제품 인프라와 사내 인프라를 함께 다루며 엔터프라이즈 환경의 구축·운영 방식을 경험했습니다.',
    work: [
      {
        title: '온프레미스 라이선스 관리 시스템',
        body: '폐쇄망 온프레미스 제품을 위한 라이선스 관리 시스템의 PoC를 구현했습니다.',
      },
      {
        title: 'FreeIPA 기반 시스템 구축',
        body: '온프레미스 사내 서버 사용자 관리를 위해 FreeIPA를 도입하고 연동했습니다.',
      },
      {
        title: 'Prometheus와 Grafana 기반 GPU 사용량 모니터링 시스템 구축',
        body: 'GPU 사용량을 모니터링할 수 있도록 Prometheus와 Grafana를 구축하고 연동했습니다.',
      },
    ],
    link: 'https://promedius.ai/',
  },
] as const;

export const purpose = {
  headline: '세상이 더 효율적으로 움직이고, 사람들이 더 능숙하게 일할 수 있도록.',
  introduction:
    '불필요한 수고를 줄이는 도구와 시스템을 만들고, 사람들이 이를 이해하고 활용할 수 있도록 경험과 지식을 나눕니다.',
};

export const approaches = [
  {
    title: '수고를 줄입니다',
    body: '반복되는 일과 막히는 지점을 살펴보고, 사람이 판단과 창의적인 일에 더 집중할 수 있는 도구를 만듭니다.',
  },
  {
    title: '복잡함을 다룰 수 있게 만듭니다',
    body: '제품과 운영, 인프라를 따로 떼어 보지 않고 실제로 일을 수행하는 사람의 흐름에서 문제를 정리합니다.',
  },
  {
    title: '다음 사람이 이어갈 수 있게 남깁니다',
    body: '구현으로 끝내지 않고 문서와 경험을 공유해, 다른 사람이 이해하고 더 나은 선택을 할 수 있도록 돕습니다.',
  },
];

export const companyWork = [
  {
    title: 'AD Creator',
    body: '사내 배너 제작 서비스의 기능과 운영 환경을 개선했습니다. 마지막 두 분기에는 개발과 운영 전반을 전담해 기능 개선, 배포·인프라 운영, 서비스 이관과 인계까지 마무리했습니다.',
    links: [
      { label: 'AD Creator', source: 'GameScale', href: 'https://developers.gamescale.io/ko/services/47' },
      { label: '넥슨이 AI를 활용하는 방법 (Feat. 실제 사례)', source: 'NEXON 플랫폼본부', href: 'https://www.intelligencelabs.tech/310dadb5-6b2f-8120-b4d2-c7b961c904e4' },
      { label: '마케팅 전략에서 찾아보는 넥슨 게임의 장수 비결', source: 'GameScale', href: 'https://www.gamescale.io/ko/news/9' },
      { label: '[MGS 2023] 넥슨, 게임 업계 UA 고민에 ‘개인화 마케팅’ 꺼내들다', source: 'Digital Insight', href: 'https://ditoday.com/%EB%84%A5%EC%8A%A8-%EA%B2%8C%EC%9E%84-%EC%97%85%EA%B3%84-ua-%EA%B3%A0%EB%AF%BC%EC%97%90-%EA%B0%9C%EC%9D%B8%ED%99%94-%EB%A7%88%EC%BC%80%ED%8C%85-%EA%BA%BC%EB%82%B4%EB%93%A4%EB%8B%A4/' },
      { label: '[광고도 AI시대②] 넥슨, AI로 초개인화 마케팅 구사', source: '문화경제', href: 'https://blog.naver.com/weekly-cnb/223717915172' },
      { label: '[디마人]넥슨 "초개인화 마케팅, 어디까지 해봤니?"', source: 'Bloter', href: 'https://www.bloter.net/news/articleView.html?idxno=47449' },
      { label: '개인화 배너 지식으로 본 NPTI 개인화 배너 사례', source: 'NEXON 플랫폼본부', href: 'https://www.intelligencelabs.tech/310dadb5-6b2f-8158-b0e8-c82e2824393f' },
    ],
  },
  {
    title: 'NEXON 내부 CRM을 위한 다매체 발송 시스템',
    body: '대시보드와 캠페인 운영 기능 개발에 참여했습니다. 운영자가 발송을 관리하고 결과를 파악할 수 있도록 사용자 경험을 개선하고, 테스트와 개발 과정의 자동화를 통해 서비스 품질을 높였습니다.',
  },
  {
    title: 'Voice Creator',
    body: '서비스 리소스 이관을 지원하고 관련 이슈를 안내했으며, 서비스 정리 업무의 일부를 마지막까지 담당했습니다.',
    links: [
      { label: '홍대 가려면 어디로 가요? 🎤 뉴진스의 하입Voice Creator', source: 'NEXON 플랫폼본부', href: 'https://www.intelligencelabs.tech/310dadb5-6b2f-813d-abbb-f28c50ea3678' },
      { label: '넥슨의 근거 있는 자신감 ‘인텔리전스랩스’', source: '바이라인네트워크', href: 'https://byline.network/2024/01/8-219/' },
      { label: '넥슨, 인텔리전스랩스로 새로운 게임 경험 예고', source: 'IB토마토', href: 'https://www.ibtomato.com/ExternalView.aspx?type=1&no=11258' },
      { label: '넥슨, 생성AI 연구로 맞춤형 NPC 출시…"유저 즐거움 극대화"', source: '뉴스1', href: 'https://www.news1.kr/it-science/game-review/5280930' },
      { label: '넥슨, ‘인텔리전스랩스’로 새로운 게임 경험 도전', source: '국민일보', href: 'https://www.kmib.co.kr/article/view.asp?arcid=0019093300' },
      { label: '‘세계 최장수 게임’ 둔 넥슨…운영 전략 풀고 AI NPC 만든다', source: '한국경제', href: 'https://plus.hankyung.com/apps/newsinside.view?aid=202401065991i&category=&sns=y' },
      { label: "게임 판 바꾸는 '생성형 AI'…개발·운영부터 B2B 확장까지", source: '톱데일리', href: 'https://www.topdaily.kr/articles/96211' },
      { label: '넥슨 ‘인텔리전스랩스’, 게임업계 ‘미래의 창’', source: '파이낸셜투데이', href: 'https://www.ftoday.co.kr/news/articleView.html?idxno=314294' },
      { label: '"플레이어 즐거움의 극대화"... 넥슨, \'인텔리전스랩스\' 고도화', source: '뉴데일리', href: 'https://biz.newdaily.co.kr/site/data/html/2024/01/04/2024010400173.html' },
      { label: "Nexon CEO: It's important to assume that every game company is now using AI", source: 'Game Developer', href: 'https://www.gamedeveloper.com/business/nexon-ceo-it-s-important-to-assume-that-every-game-company-is-now-using-ai' },
    ],
  },
  {
    title: '모바일 웹 기반 AI 이미지 데모',
    body: 'AI 기반 프로젝트의 사내 데모를 위한 모바일 웹 프론트엔드를 개발했습니다. WASM ImageMagick으로 기기 안에서 이미지 크기와 형식을 변환해, 고용량 이미지와 HEIF 등 모바일 입력의 제약을 줄였습니다.',
  },
] as const;

export const projects: Project[] = [
  {
    slug: 'blis',
    group: 'client',
    title: 'BLIS 연고편입 LMS',
    eyebrow: '학습관리 플랫폼',
    summary: '학습자와 운영자가 교육 콘텐츠를 더 수월하게 이용하고 관리할 수 있도록 학습 경험과 운영 흐름을 개선했습니다.',
    problem: '학습자와 운영자가 교육 콘텐츠를 이용하고 관리하는 학습관리 플랫폼입니다.',
    contribution: '웹과 모바일 학습 환경, 관리자 기능, 백엔드 개발에 참여했습니다.',
    change: '학습과 콘텐츠 운영의 흐름을 하나의 서비스 경험으로 연결했습니다.',
    status: '웹·모바일·관리자·백엔드 개발 참여',
    featured: true,
  },
  {
    slug: 'coryose-process',
    group: 'client',
    title: '고려씰링 업무 프로세스 관리',
    eyebrow: '업무 프로세스 관리 · 2021년 개발 · 완료',
    summary: '화이트보드로 관리하던 업무를 웹으로 옮겨 공정·발주·외주와 사용자별 작업 기록을 한곳에서 관리하도록 구현했습니다.',
    problem: '공정·발주·외주와 사용자별 작업 기록을 화이트보드로 관리하던 업무가 있었습니다.',
    contribution: '기존 업무 과정을 웹에서 다룰 수 있도록 공정, 발주, 외주, 사용자별 기록 기능을 구현했습니다.',
    change: '흩어진 작업 정보를 한곳에서 확인하고 관리할 수 있는 업무 흐름으로 옮겼습니다.',
    status: '2021년 개발 · 완료',
    featured: true,
  },
  {
    slug: 'rp2040-hub75',
    group: 'personal',
    title: 'RP2040 HUB75',
    eyebrow: 'LED 패널 제어와 회로 설계',
    summary: 'RP2040의 PIO·DMA를 활용하는 LED 패널 라이브러리와 회로·PCB 설계 자료를 작성했습니다.',
    problem: 'RP2040으로 여러 HUB75 LED 패널을 하나의 화면처럼 제어하는 작업을 다뤘습니다.',
    contribution: 'RP2040의 PIO와 DMA를 활용하는 제어 라이브러리를 만들고 회로와 PCB 설계 자료를 작성했습니다.',
    change: '여러 패널을 하나의 화면으로 구성하는 제어 방식을 다뤘습니다.',
    status: 'LED 패널 제어 라이브러리와 회로·PCB 설계 자료',
    link: 'https://github.com/maxswjeon/rp2040-hub75',
    featured: true,
  },
  {
    slug: 'bear-oj',
    group: 'community',
    title: 'Bear OJ',
    eyebrow: '프로그래밍 대회 운영 도구',
    summary: 'DMOJ 채점 엔진을 바탕으로 참가 화면, 관리자 화면과 백엔드를 구성했습니다.',
    problem: '프로그래밍 대회를 진행하고 참가 상황을 확인할 수 있는 운영 도구가 필요했습니다.',
    contribution: 'DMOJ 채점 엔진을 활용해 참가자와 관리자를 위한 화면 및 백엔드를 구성했습니다.',
    change: '대회 진행과 참가 상황 확인에 필요한 운영 기능을 마련했습니다.',
    status: 'DMOJ 채점 엔진 기반 대회 운영 도구',
    links: [
      { label: 'Frontend', href: 'https://github.com/maxswjeon/Bear-OJ-frontend' },
      { label: 'Admin', href: 'https://github.com/maxswjeon/Bear-OJ-admin' },
      { label: 'Backend', href: 'https://github.com/maxswjeon/Bear-OJ-backend' },
    ],
    organizations: [
      { label: 'YCC', href: 'https://www.ycc.club/' },
      { label: 'KUCC', href: 'https://kucc.co.kr/' },
    ],
  },
  {
    slug: 'yonsei-mileage',
    group: 'school',
    title: '연세대학교 마일리지 검색',
    eyebrow: '수강 신청 정보 탐색',
    summary: '수강 신청에 필요한 마일리지 정보를 찾아볼 수 있는 웹 서비스를 개발했습니다.',
    problem: '수강 신청 판단에 필요한 마일리지 정보를 쉽게 찾아보기 어려웠습니다.',
    contribution: '프론트엔드와 백엔드, 데이터 수집 작업을 하나의 서비스로 개발했습니다.',
    change: '분산된 정보를 검색 가능한 웹 경험으로 연결했습니다.',
    status: '프론트엔드·백엔드·데이터 수집 개발',
    link: 'https://github.com/maxswjeon/yonsei-mileage-frontend',
  },
  {
    slug: 'outta-certificates',
    group: 'community',
    title: 'OUTTA 수료증 관리',
    eyebrow: '수료증 발급과 관리',
    summary: '수료증 발급과 관리를 위한 웹 시스템을 개발했습니다.',
    problem: '수료증을 발급하고 관리하는 과정을 웹에서 다룰 필요가 있었습니다.',
    contribution: '수료증 발급과 관리를 위한 웹 시스템을 개발했습니다.',
    change: '발급과 관리 업무를 하나의 시스템에서 처리하도록 구성했습니다.',
    status: '수료증 발급·관리 웹 시스템',
    organizations: [{ label: 'OUTTA', href: 'https://outta.ai/' }],
  },
  {
    slug: 'monika',
    group: 'personal',
    title: 'MoniKa',
    eyebrow: '개인 데이터 활용 도구',
    summary: '본인 PC와 계정의 로컬 데이터를 읽고 활용할 수 있도록 Windows 도구와 MCP 연동을 개발했습니다.',
    problem: '본인 기기와 계정에 흩어진 로컬 데이터를 다른 도구에서 안전하게 읽고 활용할 연결점이 필요했습니다.',
    contribution: 'Windows 도구와 MCP 연동, 로컬 데이터 변경 감지와 읽기 기능을 개발했습니다.',
    change: '개인 데이터에 로컬 환경에서 접근하고 도구와 연결할 수 있는 기반을 만들었습니다.',
    status: '네이티브 새 메시지 알림은 아직 구현하지 않았습니다.',
    link: 'https://github.com/maxswjeon/MoniKa',
  },
  {
    slug: 'cadence',
    group: 'personal',
    title: 'Cadence',
    eyebrow: '일정과 맥락을 돕는 시스템',
    summary: '계정과 기기의 정보를 바탕으로 일정과 우선순위를 파악하도록 돕는 개인 프로젝트입니다.',
    problem: '여러 맥락에 흩어진 일정과 우선순위를 파악하는 데 반복적인 정리가 필요합니다.',
    contribution: '계정과 기기의 정보를 바탕으로 다음 행동을 제안하는 시스템을 개발했습니다.',
    change: '실제 알림을 보내기 전에 제안 결과를 검토할 수 있는 shadow mode를 구현했습니다.',
    status: '현재는 shadow mode이며 실제 알림을 전달하는 운영 상태가 아닙니다.',
    link: 'https://github.com/maxswjeon/cadence',
  },
  {
    slug: 'shepherd',
    group: 'personal',
    title: 'Shepherd',
    eyebrow: '개발 중 · 파일 저장 공간 관리',
    summary: '로컬·원격 저장소를 함께 활용하는 파일 관리 시스템의 초기 기반을 개발하고 있습니다.',
    problem: '로컬 저장 공간과 원격 저장소를 함께 사용하면서 파일의 위치와 가용성을 효율적으로 관리할 방법이 필요합니다.',
    contribution: '파일 관리 시스템을 위한 초기 구조와 기반 구현을 진행하고 있습니다.',
    change: '로컬과 원격 저장소를 연결하기 위한 토대를 마련하는 단계입니다.',
    status: '개발 중인 초기 단계이며 실제 파일 이동·복원 기능이 완성된 제품은 아닙니다.',
    link: 'https://github.com/maxswjeon/shepherd',
  },
  {
    slug: 'fairtrade',
    group: 'school',
    title: '공정무역 제품 판별',
    eyebrow: 'Android · 4인 공동',
    summary: '제품 바코드를 스캔해 공정무역 인증 여부를 확인하는 Android 앱을 학교 프로젝트로 개발했습니다.',
    problem: '공정무역 제품 여부를 모바일에서 확인하는 학교 프로젝트였습니다.',
    contribution: '4인 공동 프로젝트에서 Android 앱 개발을 담당했습니다.',
    change: '바코드 입력·스캔 결과와 조회 기록을 앱 화면에 연결했습니다.',
    status: '4인 공동 학교 프로젝트 · Android 개발 담당',
    link: 'https://github.com/maxswjeon/Fairtrade',
  },
  {
    slug: 'spacey-passion',
    group: 'community',
    title: 'SpaceY 강연 안내 사이트',
    eyebrow: '강연 안내 · 2023.11',
    summary: 'SpaceY 강연의 일정과 장소를 안내하는 웹사이트를 짧은 시간 안에 개발하고 배포했습니다.',
    problem: '강연 직전에 참가자가 일정과 장소를 바로 확인할 수 있는 안내 페이지가 필요했습니다.',
    contribution: 'React, Vite, Tailwind CSS로 전체 사이트를 개발하고 배포했습니다.',
    change: '필요한 정보만 빠르게 읽을 수 있는 단일 안내 화면을 두 시간 안에 완성했습니다.',
    status: '전체 개발·배포 · 2023.11',
    link: 'https://passion.spacey.kr',
    organizations: [{ label: 'SpaceY', href: 'https://spacey.kr' }],
  },
  {
    slug: 'clubroom',
    group: 'community',
    title: '동방에 누구?',
    eyebrow: '실시간 재실 확인 · 2022.09',
    summary: '동아리 Wi-Fi 접속 정보를 바탕으로 동아리방에 있는 사람을 실시간으로 확인하는 서비스를 만들었습니다.',
    problem: '동아리방에 누가 있는지 확인하려면 직접 연락하거나 방문해야 했습니다.',
    contribution: 'FreeRADIUS 기반 802.1X 인프라를 구축하고, LDAP와 ARP scanning을 연결해 접속 사용자를 확인했습니다.',
    change: 'Wi-Fi 접속 상태를 동아리방 재실 정보로 바꾸어 웹에서 확인할 수 있게 했습니다.',
    status: 'UbuCon Asia 2022 발표',
    organizations: [{ label: 'YCC', href: 'https://www.ycc.club/' }],
  },
];

export const smallTools = [
  { title: 'psql-mcp', body: 'AI 도구에 읽기 전용 PostgreSQL 조회 기능을 제공하는 MCP 서버.', link: 'https://github.com/maxswjeon/psql-mcp' },
  { title: 'git-wip', body: '작업 중 변경을 보존하고 임시 커밋의 실수로 인한 공유를 방지하는 Git 보조 도구.', link: 'https://github.com/maxswjeon/git-wip' },
  { title: 'FlatType', body: '중첩 객체를 다루는 상태 관리를 돕는 라이브러리.', link: 'https://github.com/maxswjeon/flattype' },
  { title: 'Google Meet Link Generator', body: '조직 인증과 캘린더를 연동한 회의 링크 생성 도구.', link: 'https://github.com/maxswjeon/google-meet-link-generator' },
] as const;

export const archive: readonly (readonly [string, string, string?])[] = [
  ['마케팅 데이터 수집 프로그램', '2021.03-2021.04 · 광고 플랫폼·Cafe24 데이터 수집 및 Sheets 통합'],
  ['질문·투표 웹사이트', '2021.02-2021.03 · 소셜 로그인 및 통계'],
  ['쿠팡 상품가격 자동 수정', '2021.02-2021.06 · 가격 계산 및 API 자동화'],
  ['Discord SSH Key 관리', '2021.02 · 인증서 기반 접근·키 차단 관리'],
  ['Bluetooth 이미지 송수신', '2021.02 · Android·임베디드 연동'],
  ['OpenCV Atari Breakout', '2019.10-2019.12 · 영상 기반 색 영역 추출·게임 입력'],
  ['Bluetooth Beacon 실내 위치 측정', '2019.08-2019.09 · 2인 공동 연구, RSSI·삼각법·Kalman Filter'],
  ['동아리 회원 포털', 'Go 및 웹 개발 경험'],
  ['가상 Gmail 수신자 서버', 'LMTP·IMAP 활용'],
  ['휴대폰 재생 음악 정보의 데스크톱 표시', 'Android 개발 경험'],
  ['Home Server', '2022.10 시작 기록'],
] as const;

export const legacyProjectAliases: Record<string, string> = {
  'online-judge': '/ko/work/bear-oj/',
  'outta-certificate': '/ko/work/outta-certificates/',
  'yonsei-mileage': '/ko/work/yonsei-mileage/',
  'process-management': '/ko/work/coryose-process/',
  'clubroom': '/ko/work/clubroom/',
  '9c-account-recovery': '/ko/work/#nine-corporation',
  'zible': '/ko/work/#zible',
  'spacey-passion': '/ko/work/spacey-passion/',
};
