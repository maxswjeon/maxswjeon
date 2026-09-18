# 방문 데이터 측정 설정

이 사이트의 측정 스크립트는 정적 빌드 시 `PUBLIC_*` 환경 변수로 켠다. ID를 설정하지 않았거나 형식이 잘못되면 해당 서비스에 대한 스크립트와 네트워크 요청은 생성되지 않는다. 실제 계정 ID는 저장소에 넣지 않는다.

## 동의 전 집계와 동의 후 상세 분석

동의 전에는 CloudFront가 기본 제공하는 전체 **요청 수**를 이용한다. CloudFront 콘솔의 Monitoring에서 배포별 `Requests` 지표를 확인하거나 Usage Reports에서 시간별·일별 집계와 CSV를 확인할 수 있다. 별도 브라우저 스크립트, 쿠키, 방문자 ID, 수집 서버, 액세스 로그 설정은 필요하지 않다. 이 저장소 변경은 운영 AWS 설정을 변경하지 않는다.

`Requests`에는 HTML뿐 아니라 이미지·CSS·JavaScript와 봇의 요청도 포함된다. 따라서 이를 방문자 수, 순 방문자 수, 페이지 조회 수로 표시하거나 환산하지 않는다. Usage Reports는 실시간이 아니며 보통 약 4시간, 드물게 24시간 지연될 수 있다.

페이지별 이용, 유입 경로, 기기 정보, 클릭·스크롤 같은 상세 측정은 아래의 기존 동의 분류를 따른다. 분석·마케팅 도구는 해당 동의 후에만 로드한다. Google의 쿠키 없는 측정 요청도 동의 전에 전송하도록 변경하지 않는다.

이 집계는 방문자별 정보를 처리하지 않으므로 방문자에게 보이는 개인정보 안내와 동의 배너에는 적지 않는다. 기본 집계를 위해 CloudFront 액세스 로그를 추가로 켜지 않는다. 액세스 로그를 켜게 되면 개인정보 안내에 수집 항목과 보관 기간을 추가해야 한다. 액세스 로그에는 IP 주소, 경로, user-agent, referrer 등 요청별 정보가 포함될 수 있어 집계 지표와 다르다. 브라우저 저장을 사용하지 않는다는 사실만으로 모든 지역의 개인정보 요건을 충족한다고 단정할 수는 없다.

확인한 공식 문서 (2026-09-17): [CloudFront 기본 지표](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html), [Usage Reports](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/usage-charts.html), [액세스 로그 필드](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/standard-logs-reference.html), [ICO 저장·접근 기술의 범위](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/).

## 동의 후 측정 서비스

| 환경 변수 | 서비스 | 동의 분류 |
| --- | --- | --- |
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4의 Google tag (`G-…`) | 분석 |
| `PUBLIC_GTM_CONTAINER_ID` | Google Tag Manager (`GTM-…`) | 분석 또는 마케팅 |
| `PUBLIC_GOOGLE_TAG_GATEWAY_PATH` | Google Tag Gateway의 same-origin 경로 (`/r8k3p/`) | GTM 보조 설정 |
| `PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity | 분석 |
| `PUBLIC_NAVER_WCS_ID` | Naver Analytics의 `wa` ID | 분석 |
| `PUBLIC_KAKAO_PIXEL_ID` | Kakao Pixel Track ID | 마케팅 |

`PUBLIC_GTM_CONTAINER_ID`가 있으면 직접 Google tag는 로드하지 않는다. GA4는 GTM 컨테이너 안에서 구성해야 하며, 두 방식을 함께 구성해서 페이지뷰가 중복되는 일을 피한다. GTM의 각 태그에는 내장 동의 검사를 설정하고, GA4 페이지 위치에는 데이터 레이어의 `tracking_page_location`을 사용한다.

## Google Tag Manager와 Google Tag Gateway

GA4를 GTM으로 운영할 때는 저장소에 `PUBLIC_GTM_CONTAINER_ID`만 설정하고 `PUBLIC_GA_MEASUREMENT_ID`는 비워 둔다. GTM에서 Google tag를 만들고 GA4의 `G-…` 측정 ID를 입력한다. 트리거는 All Pages 대신 `tracking_consent_ready` 맞춤 이벤트를 사용하고, `analytics_storage`가 허용될 때만 실행되도록 추가 동의 검사를 설정한다. `tracking_page_location` 데이터 영역 변수를 Google tag의 `page_location` 구성 매개변수로 전달한다.

Google Tag Gateway를 사용하면 GTM 스크립트와 일부 측정 요청을 `swjeon.kr`의 first-party 경로로 전달할 수 있다. Gateway 경로는 루트가 아니며 사이트에서 사용하지 않는 단일 경로여야 한다. 이 구현은 영문자, 숫자, `_`, `-`로 이루어진 한 구간만 허용하고 끝의 `/`를 자동으로 보완한다. 유효하지 않은 값은 무시하고 표준 Google endpoint를 사용한다.

```env
PUBLIC_GA_MEASUREMENT_ID=
PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
PUBLIC_GOOGLE_TAG_GATEWAY_PATH=/r8k3p/
```

CloudFront에는 GTM 컨테이너 ID를 소문자로 바꾼 `<gtm-container-id>.fps.goog` custom origin과 Gateway 경로용 behavior를 추가한다. 예를 들어 `GTM-ABC123`의 origin은 `gtm-abc123.fps.goog`다.

| CloudFront 항목 | 값 |
| --- | --- |
| Path pattern | `/r8k3p/*` |
| Origin protocol | HTTPS only |
| Viewer protocol policy | HTTPS only |
| Allowed methods | GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE |
| Compress objects automatically | No |
| Cache policy | CachingDisabled |
| Origin request policy | AllViewerExceptHostHeader |

Gateway behavior를 기본 S3 behavior보다 높은 우선순위에 두고, 사이트 경로를 변환하는 viewer-request CloudFront Function은 연결하지 않는다. 먼저 `/r8k3p/healthy`와 `/r8k3p/?validate_geo=healthy`가 모두 `ok`를 반환하는지 확인한 뒤 `PUBLIC_GOOGLE_TAG_GATEWAY_PATH`를 설정하고 다시 배포한다. [Google Tag Gateway self-service 설정](https://developers.google.com/tag-platform/tag-manager/gateway/setup-guide?setup=manual)

Gateway는 도메인 기반 차단에 대한 내구성을 높일 수 있지만 모든 콘텐츠 차단기를 우회한다고 보장하지 않는다. 방문자 동의와 개인정보 고지 요건도 바뀌지 않는다.

공통 레이아웃에서 `<Tracking />`을 한 번 렌더링한다. 푸터처럼 다른 컴포넌트에서 설정 창을 열려면 버튼이나 링크에 `data-tracking-settings` 속성을 붙인다. 연결된 서비스가 하나도 없을 때도 설정 창은 현재 활성 서비스가 없다고 설명한다.

```astro
<button type="button" data-tracking-settings>방문 데이터 설정</button>
```

첫 방문의 기본값은 분석·마케팅 모두 거부다. 사용자가 선택하기 전에는 외부 스크립트를 받지 않는다. 선택은 `localStorage`의 `swjeon:tracking-consent:v1`에 저장한다. 영구 저장이 막히면 같은 탭의 `sessionStorage`를 사용한 뒤 새로 불러오며, 둘 다 막힌 경우에만 이를 설정 창에 알리고 현재 페이지에서만 허용한 서비스를 시작한다. 철회할 때도 먼저 세션 선택을 남기고 페이지를 다시 불러와 이전 서비스의 스크립트가 더 실행되지 않게 한다. 외부 측정을 시작하기 직전에 주소 표시줄의 query를 제거하며, Google에 전달하는 `page_location`에도 origin과 path만 사용한다. 정적 페이지 기능을 query parameter에 의존시키지 않는다.

## 공급자 기준과 버전 확인

2026-09-13에 각 공급자의 공식 문서를 다시 확인했다.

- Google은 Google tag 또는 GTM을 각 페이지에 설치하고 Consent Mode의 `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`를 갱신하도록 안내한다. 이 구현은 기본 동의 상태에서 아무 요청도 보내지 않는 basic consent 방식으로 태그 자체를 지연한다. [Google tag 설치](https://support.google.com/analytics/answer/15756615), [웹 Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
- Microsoft는 Clarity의 수동 설치 코드를 `<head>`에 두도록 안내하며, 현재 권장 동의 API는 기존 `consent`를 대체한 `consentv2`다. 이 구현은 분석 동의 후 스크립트를 로드하며 `analytics_Storage`와 `ad_Storage`를 따로 전달한다. [Clarity 설치](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup), [Consent API V2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2)
- Naver Analytics 공식 도움말은 모든 측정 페이지에서 `wcs.naver.com` 요청과 발급 ID인 `wa` 값을 확인하도록 안내하며 HTTPS `wcslog.js` 사용을 요구한다. [설치 확인](https://help.naver.com/service/9864/contents/15516?lang=ko&osType=PC), [HTTPS 지원](https://help.naver.com/service/9864/contents/15373?lang=ko&osType=PC)
- Kakao Business 공식 가이드는 `kp.js`를 로드한 뒤 `kakaoPixel('Track ID').pageView()` 방문 이벤트를 보내도록 안내한다. [Kakao Pixel 설치](https://kakaobusiness.gitbook.io/main/tool/pixel-sdk/install)

이 공급자들은 브라우저 측정 스크립트에 SemVer 버전이나 고정 파일 버전을 공개하지 않고 동일한 호스팅 URL에서 최신 코드를 제공한다. 따라서 package version을 고정할 대상이 없다. 배포 전후에는 브라우저 개발자 도구와 각 서비스의 실시간/검증 화면에서 스크립트 URL, 동의 전 요청 0건, 동의별 요청, 중복 page view 여부를 확인한다.

Clarity는 미성년자를 대상으로 하는 사이트에 사용하면 안 된다고 공식 문서에 명시한다. 사이트 성격이 바뀌면 활성화 전에 이 조건을 다시 검토한다.
