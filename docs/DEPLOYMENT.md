# GitHub Pages 배포 가이드

## 배포 전 확인

- `.gitignore`의 `backups/`가 유지되는지 확인한다.
- 어떤 파일에도 TMDB Read Access Token을 넣지 않는다.
- 로컬 서버에서 `node --check app.js` 및 브라우저 수동 테스트를 실행한다.

## GitHub Pages

이 프로젝트에는 [배포 워크플로](../.github/workflows/deploy-pages.yml)가 포함되어 있다.

1. 이 폴더를 새 GitHub 저장소에 커밋하고 `main` 브랜치로 푸시한다.
2. 저장소 **Settings → Pages**에서 Source를 **GitHub Actions**로 선택한다.
3. `Deploy static site to GitHub Pages` 워크플로가 완료될 때까지 기다린다.
4. Actions 로그의 배포 URL을 열어 첫 방문에 7개 데모 콘텐츠가 보이는지 확인한다.

정적 파일만 사용하므로 빌드 단계·서버·GitHub Secret은 필요하지 않다. Pages를 처음 설정할 때만 GitHub가 워크플로의 Pages 권한을 승인하도록 요청할 수 있다.

## 공개 배포 보안 원칙

- 데모 콘텐츠의 텍스트 메타데이터는 저장소에 포함한다. 표지는 TMDB 이미지 CDN 또는 공식 배급사 자료의 원격 URL을 사용하며, 앱 설정의 데이터 출처 표기를 유지한다.
- 방문자가 입력한 TMDB 토큰은 해당 배포 도메인의 브라우저 `localStorage`에만 저장된다.
- 토큰은 공개 코드, GitHub Secret 설명, README 예시에 넣지 않는다.
- XSS 위험을 줄이기 위해 외부 API·사용자 입력을 HTML에 표시할 때 반드시 이스케이프한다.
