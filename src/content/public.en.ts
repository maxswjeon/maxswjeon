import type { Project, ProjectGroup } from './public';

export const projectGroups: readonly { id: ProjectGroup; label: string; title: string }[] = [
  { id: 'client', label: 'Client work', title: 'Client work' },
  { id: 'personal', label: 'Personal', title: 'Personal projects' },
  { id: 'school', label: 'School', title: 'School projects' },
  { id: 'community', label: 'Community', title: 'Club and academic society projects' },
];

export const projectGroupLabels: Record<ProjectGroup, string> = {
  client: 'Client work',
  personal: 'Personal projects',
  school: 'School projects',
  community: 'Clubs and academic societies',
};

export const primaryExperience = {
  id: 'nexon-ngine-studios',
  organization: 'NGINE STUDIOS · NEXON COMPANY',
  role: 'Frontend Engineer · Full-time',
  period: '2024.04-2026.05',
  body: 'Worked as a Frontend Engineer at NGINE STUDIOS, a subsidiary of NEXON Korea. Built internal web solutions to grow the active user base of NEXON games and help employees work more efficiently. Collaborated with NEXON’s Platform Division, formerly Intelligence Labs, on product development, infrastructure setup, and operations.',
} as const;

export const experienceEntries = [
  {
    id: 'nine-corporation',
    organization: 'Planetarium (Nine Corporation)',
    role: 'Frontend Engineer · Full-time',
    period: '2023.01-2023.04',
    body: 'Worked as a Frontend Engineer on Planetarium’s Publishing Product Team, with a focus on improving the player experience and increasing daily active users for Nine Chronicles, a fully decentralized game.',
    work: [
      {
        title: 'Nine Chronicles Launcher',
        body: 'Improved the game launcher’s activation flow to reduce player drop-off.',
        link: 'https://github.com/planetarium/9c-launcher',
      },
      {
        title: 'Nine Chronicles Account Recovery',
        body: 'Built a portal account recovery service that helped players regain access and return to the game, contributing to DAU growth.',
        media: 'nine-account-recovery',
      },
      {
        title: 'Dongrami',
        body: 'Built a proof-of-concept application for creating and staging blockchain actions.',
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
    organization: 'ZIBLE',
    role: 'Full Stack Engineer',
    period: '2022.09',
    body: 'Worked as a Full Stack Engineer on a home-buying information service. Measured the effect of OpenGraph link previews on sharing, analyzed user journeys with Datahog and Sentry, and used the findings to improve the conversion funnel.',
  },
  {
    id: 'promedius',
    organization: 'Promedius Inc.',
    role: 'Intern',
    period: '2022.01-2022.02',
    body: 'Worked as an intern on infrastructure for both air-gapped, on-premises products and internal systems. Gained hands-on experience building and operating enterprise environments.',
    work: [
      {
        title: 'On-premises License Management System',
        body: 'Built a proof-of-concept license management system for an air-gapped, on-premises product.',
      },
      {
        title: 'FreeIPA-based User Management System',
        body: 'Introduced and integrated FreeIPA to manage users across internal on-premises servers.',
      },
      {
        title: 'GPU Monitoring with Prometheus and Grafana',
        body: 'Deployed and integrated Prometheus and Grafana to monitor GPU usage.',
      },
    ],
    link: 'https://promedius.ai/',
  },
] as const;

export const purpose = {
  headline: 'Helping the world run more efficiently, so people can work more effectively.',
  introduction:
    'Tools and systems can remove unnecessary work. Sharing the experience and knowledge behind them helps others understand and use them.',
};

export const approaches = [
  {
    title: 'Reduce unnecessary effort',
    body: 'Identify repetitive tasks and everyday friction, then build tools that leave more time for judgment and creative work.',
  },
  {
    title: 'Make complexity manageable',
    body: 'Consider products, operations, and infrastructure together, framing each problem around how people actually work.',
  },
  {
    title: 'Make work easy to carry forward',
    body: 'Go beyond implementation by documenting the context and sharing lessons that help others make better decisions.',
  },
];

export const companyWork = [
  {
    title: 'AD Creator',
    body: 'Improved an internal banner creation service and its operational infrastructure. Took full ownership of development and operations during the final two quarters, covering feature delivery, deployments, infrastructure, service migration, and handoff.',
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
    title: 'Multichannel Delivery System for NEXON’s Internal CRM',
    body: 'Developed dashboard and campaign operations features that helped operators manage deliveries and interpret results. Automated parts of the testing and development workflow to improve service quality.',
  },
  {
    title: 'Voice Creator',
    body: 'Supported resource migration, communicated related issues, and remained involved in the service cleanup through completion.',
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
    title: 'Mobile Web AI Image Demo',
    body: 'Developed a mobile web frontend for an internal AI project demo. Used WASM ImageMagick to resize and convert images on-device, reducing issues with large files and mobile formats such as HEIF.',
  },
] as const;

export const projects: Project[] = [
  {
    slug: 'blis',
    group: 'client',
    title: 'BLIS 연고편입 LMS',
    eyebrow: 'Learning management platform',
    summary: 'Improved learning and operational workflows so learners and administrators could access and manage educational content more easily.',
    problem: 'Learners and administrators needed a single platform for accessing and managing educational content.',
    contribution: 'Contributed to the web and mobile learning experiences, administrative features, and backend development.',
    change: 'Unified learning and content operations into a single service experience.',
    status: 'Web, mobile, admin, and backend development',
    featured: true,
  },
  {
    slug: 'coryose-process',
    group: 'client',
    title: '고려씰링 Workflow Management',
    eyebrow: 'Workflow management · Built in 2021 · Complete',
    summary: 'Moved a whiteboard-based workflow to the web, centralizing production processes, purchase orders, outsourced work, and individual work records.',
    problem: 'Production processes, purchase orders, outsourced work, and individual work records were managed on a whiteboard.',
    contribution: 'Built web features around the existing workflow for production processes, purchase orders, outsourced work, and individual records.',
    change: 'Centralized scattered work information in a workflow that teams could view and manage in one place.',
    status: 'Built in 2021 · Complete',
    featured: true,
  },
  {
    slug: 'rp2040-hub75',
    group: 'personal',
    title: 'RP2040 HUB75',
    eyebrow: 'LED panel control and circuit design',
    summary: 'Created an LED panel library using the RP2040’s PIO and DMA, together with circuit and PCB designs.',
    problem: 'The project explored how to drive multiple HUB75 LED panels as a single display using the RP2040.',
    contribution: 'Built the control library and produced the circuit and PCB designs.',
    change: 'Developed an approach for controlling multiple panels as a single display.',
    status: 'LED panel control library and circuit and PCB design materials',
    link: 'https://github.com/maxswjeon/rp2040-hub75',
    featured: true,
  },
  {
    slug: 'bear-oj',
    group: 'community',
    title: 'Bear OJ',
    eyebrow: 'Programming contest operations tool',
    summary: 'Built contestant and administrator interfaces, plus a backend powered by the DMOJ judging engine.',
    problem: 'Organizers needed a tool for running programming contests and monitoring participation.',
    contribution: 'Built the contestant interface, administration interface, and backend around DMOJ.',
    change: 'Delivered the operational tools required to run contests and track participation.',
    status: 'Contest operations tool built on the DMOJ judging engine',
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
    title: 'Yonsei University Mileage Search',
    eyebrow: 'Course registration information search',
    summary: 'Developed a web service for searching the mileage data used in course registration.',
    problem: 'Students had difficulty finding the mileage data they needed to make course registration decisions.',
    contribution: 'Developed the frontend, backend, and data collection pipeline.',
    change: 'Turned scattered data into a searchable web experience.',
    status: 'Frontend, backend, and data collection development',
    link: 'https://github.com/maxswjeon/yonsei-mileage-frontend',
  },
  {
    slug: 'outta-certificates',
    group: 'community',
    title: 'OUTTA Certificate Management',
    eyebrow: 'Certificate issuance and management',
    summary: 'Developed a web system for issuing and managing completion certificates.',
    problem: 'Certificate issuance and management needed to move to the web.',
    contribution: 'Built the certificate issuance and management system.',
    change: 'Brought certificate issuance and management into one system.',
    status: 'Web system for issuing and managing certificates',
    organizations: [{ label: 'OUTTA', href: 'https://outta.ai/' }],
  },
  {
    slug: 'monika',
    group: 'personal',
    title: 'MoniKa',
    eyebrow: 'Personal data utility',
    summary: 'Developed a Windows application and MCP integration for accessing local data from a PC and connected accounts.',
    problem: 'Other tools needed a safe way to access data distributed across a PC and connected accounts.',
    contribution: 'Developed the Windows application, MCP integration, change detection, and data-reading capabilities.',
    change: 'Created a foundation for accessing personal data locally and making it available to other tools.',
    status: 'Native notifications for new messages are not yet implemented.',
    link: 'https://github.com/maxswjeon/MoniKa',
  },
  {
    slug: 'cadence',
    group: 'personal',
    title: 'Cadence',
    eyebrow: 'Schedule and context assistant',
    summary: 'Uses account and device data to surface schedules and priorities.',
    problem: 'Keeping track of schedules and priorities across multiple contexts requires repeated manual organization.',
    contribution: 'Developed a system that recommends next actions based on data from connected accounts and devices.',
    change: 'Implemented a shadow mode for reviewing recommendations before enabling real notifications.',
    status: 'Runs in shadow mode and does not send live notifications.',
    link: 'https://github.com/maxswjeon/cadence',
  },
  {
    slug: 'shepherd',
    group: 'personal',
    title: 'Shepherd',
    eyebrow: 'In development · File storage management',
    summary: 'Shepherd is an early-stage file management system that combines local and remote storage.',
    problem: 'Using local and remote storage together requires an efficient way to manage file locations and availability.',
    contribution: 'Current work focuses on the initial architecture and core foundation.',
    change: 'The project is laying the groundwork for connecting local and remote storage.',
    status: 'Early in development; file movement and restoration are not yet complete.',
    link: 'https://github.com/maxswjeon/shepherd',
  },
  {
    slug: 'fairtrade',
    group: 'school',
    title: 'Fair Trade Product Identification',
    eyebrow: 'Android · Team of four',
    summary: 'Developed an Android app that scans product barcodes and checks their fair trade certification status.',
    problem: 'The project explored how mobile users could verify whether a product carried fair trade certification.',
    contribution: 'Handled Android development as part of a four-person team.',
    change: 'Integrated barcode input, scan results, and lookup history into the app interface.',
    status: 'Four-person school project · Android development',
    link: 'https://github.com/maxswjeon/Fairtrade',
  },
  {
    slug: 'spacey-passion',
    group: 'community',
    title: 'SpaceY Talk Information Site',
    eyebrow: 'Talk information · 2023.11',
    summary: 'Developed and deployed an event information site for a SpaceY talk on short notice.',
    problem: 'Attendees needed a page where they could quickly check the schedule and venue just before the talk.',
    contribution: 'Built and deployed the entire site with React, Vite, and Tailwind CSS.',
    change: 'Delivered a focused, single-page site within two hours.',
    status: 'Full development and deployment · 2023.11',
    link: 'https://passion.spacey.kr',
    organizations: [{ label: 'SpaceY', href: 'https://spacey.kr' }],
  },
  {
    slug: 'clubroom',
    group: 'community',
    title: 'Who’s in the Clubroom?',
    eyebrow: 'Real-time presence · 2022.09',
    summary: 'Built a service that used club Wi-Fi connection data to show who was in the clubroom in real time.',
    problem: 'Finding out who was in the clubroom required contacting someone or visiting in person.',
    contribution: 'Set up FreeRADIUS-based 802.1X infrastructure and combined LDAP with ARP scanning to identify connected users.',
    change: 'Converted Wi-Fi connection status into real-time presence information available on the web.',
    status: 'Presented at UbuCon Asia 2022',
    organizations: [{ label: 'YCC', href: 'https://www.ycc.club/' }],
  },
];

export const smallTools = [
  { title: 'psql-mcp', body: 'An MCP server that lets AI tools run read-only queries against PostgreSQL.', link: 'https://github.com/maxswjeon/psql-mcp' },
  { title: 'git-wip', body: 'A Git helper that preserves work in progress and prevents temporary commits from being shared accidentally.', link: 'https://github.com/maxswjeon/git-wip' },
  { title: 'FlatType', body: 'A library for managing state with nested objects.', link: 'https://github.com/maxswjeon/flattype' },
  { title: 'Google Meet Link Generator', body: 'A meeting link generator integrated with organizational authentication and calendars.', link: 'https://github.com/maxswjeon/google-meet-link-generator' },
] as const;

export const archive: readonly (readonly [string, string, string?])[] = [
  ['Marketing data collection tool', '2021.03-04 · Collected data from advertising platforms and Cafe24 and consolidated it in Google Sheets'],
  ['Question and polling website', '2021.02-03 · Social login and statistics'],
  ['Automated Coupang price updates', '2021.02-06 · Price calculation and API automation'],
  ['Discord SSH key management', '2021.02 · Certificate-based access and key revocation management'],
  ['Bluetooth image transfer', '2021.02 · Android and embedded systems integration'],
  ['OpenCV Atari Breakout', '2019.10-12 · Image-based color region extraction and game input'],
  ['Indoor positioning with Bluetooth beacons', '2019.08-09 · Two-person research project using RSSI, triangulation, and a Kalman filter'],
  ['Club member portal', 'Experience with Go and web development'],
  ['Virtual recipient server for Gmail', 'Used LMTP and IMAP'],
  ['Desktop display for music playing on a mobile device', 'Android development'],
  ['Home server', 'Project log started in 2022.10'],
] as const;
