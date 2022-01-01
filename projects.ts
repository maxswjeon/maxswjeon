export interface Project {
    name: string;
    description: string;
    duration: string;
    languages: string[];
    libraries: string[];
    source?: string;
}

const Projects: Project[] = [
    {
        name: '사내 작업 경과 확인 웹사이트',
        description:
            '사용자는 할당된 작업을 확인하고, 작업 과정을 실시간으로 기록하기 위한 웹사이트를 제작했습니다. ' +
            '관리자 페이지에서 작업 과정들을 모니터링할 수 있는 웹사이트를 제작하고, GitLab CI를 통해 자동 빌드까지 구현하였습니다.',
        duration: '2021.08. ~ 2021.10.',
        languages: ['Typescript'],
        libraries: [
            'react',
            'react-router',
            'redux',
            'redux-persist',
            'styled-components',
            'eslint',
            'prettier',
            'axios',
            'dayjs',
            'react-google-charts',
            'swr',
            'nest.js',
            'prisma',
            'fastify',
            'docker',
            'docker-compose',
        ],
    },
    {
        name: '마케팅 데이터 수집 프로그램',
        description:
            '페이스북 광고, 네이버 광고, 카카오 광고 및 Cafe24 관리자에서 마케팅 데이터 크롤링 후, ' +
            'Google Spreadsheet에 통합 작성하는 프로그램을 제작하였습니다.',
        duration: '2021.03. ~ 2021.04.',
        languages: ['Python'],
        libraries: ['wxPython', 'Selenium'],
    },
    {
        name: '소셜 로그인 연동 투표 웹사이트',
        description:
            '네이버, 카카오 로그인 연동하여 유저 가입 / 로그인 기능을 제작하였습니다. ' +
            '연동된 정보를 통해 투표 후 성별 분포를 확인할 수 있는 웹사이트를 제작하였습니다. ' +
            '이미지를 업로드하여 이미지 관련 투표를 할 수 있습니다.',
        duration: '2021/02 ~ 2021/03',
        languages: ['Typescript'],
        libraries: [
            'react',
            'react-router',
            'redux',
            'redux-persist',
            'sass',
            'nest.js',
            'typeorm',
            'eslint',
            'prettier',
            'axios',
            'docker',
            'docker-compose',
        ],
    },
    {
        name: '쿠팡 상품가격 수정 프로그램',
        description:
            '쿠팡 상단노출을 위해 경쟁사들의 가격을 실시간으로 확인하고 이를 통해 가격을 조정하는 프로그램을 제작하였습니다.',
        duration: '2021.03. ~ 2021.04.',
        languages: ['C# 8.0', '.Net Core'],
        libraries: ['Selenium'],
    },
    {
        name: '디스코드 봇을 이용한 SSH Key 관리',
        description:
            'SSH 접근권한 제어를 위해 Certificate 기반으로 인증서가 있어야만 로그인 가능하도록 서버를 셋팅하였습니다. ' +
            'Certificate의 발급 / KBL(Key Block List)에 등록 등은 Discord Bot을 통해 구현하였습니다.',
        duration: '2021.02. ~ 2021.02.',
        languages: ['Python'],
        libraries: ['Discord.py'],
        source: 'https://github.com/maxswjeon/authentication-bot',
    },
    {
        name: '블루투스를 통한 이미지 수신 후 영상처리',
        description:
            '블루투스를 이용하여 임베디드 기기에서 휴대전화로 사진을 받아오는 앱을 제작하였습니다. ' +
            '앱으로 전달된 사진은 휴대전화에서 Tensorflow를 통해 분석 후 사용되게 하였습니다.',
        duration: '2021.02 ~ 2021.02.',
        languages: ['Python', 'Java'],
        libraries: ['Tensorflow Lite', 'bluez'],
        source: 'https://github.com/maxswjeon/BlutoothImage',
    },
    {
        name: 'OpenCV를 이용한 Atari Breakout 구현',
        description:
            '웹캠으로 받은 영상에서 특정 색 영역을 추출하며 좌표를 구하고, 좌표를 게임과 연동시켜 인터렉티브한 게임을 제작하였습니다.',
        duration: '2019.10 ~ 2019.12.',
        languages: ['Python'],
        libraries: ['OpenCV'],
        source: 'https://github.com/maxswjeon/OpenCV_Brick',
    },
    {
        name: 'Bluetooth Beacon을 이용한 실내에서의 위치 측정',
        description:
            '블루투스 비콘 수신기를 고정, 블루투스 비콘이 움직이는 형태의 기법을 사용하였습니다.' +
            '고정된 수신기에서 읽어온 RSSI값을 기반으로 삼각법(Trigonometry)을 사용하여 실내애네서의 위치를 추정하였습니다' +
            'Kalman Filter를 사용하여 측정 정확도를 향상하였습니다.',
        duration: '2019.08. ~ 2019.09.',
        languages: ['Python'],
        libraries: ['wxPython', 'Selenium'],
        source: 'https://github.com/maxswjeon/Mapo2019',
    },
];

export default Projects;
