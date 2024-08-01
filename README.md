# 프로젝트 기술 명세

- vite
- pnpm
- typescript
- vue3 Composition api
- pinia
- socket io
- vue-i18n
- axios
- aws sdk
- scss
- stylelint
- eslint

# 프로젝트 버전 명세

- Nodejs - 20.10.4

# 프로젝트 커밋 컨벤션

- feat : 새로운 기능 추가
- edit : 기존 로직 수정
- fix : 버그 수정
- style : Style 변경
- refactor : 코드 리펙토링
- chore : 빌드 업무 수정, 패키지 매니저 수정

# 프로젝트 디렉토리 구조

> package <br/>
>
> > package name(하위 패키지) : common, remake, singapore, united_states 등... <br/>
> > - remake (현행)
      > >

- 운영 버전 (https://order2.torder.io/)

> > - Stage 버전 (https://stage-order2.torder.io/)
> >   - QA 버전 (https://qa-order2.torder.io/)
> >   - Dev 버전 (http://dev-order2.torder.io/)
> > - us-east (캐나다)
      > >

- 운영 버전 (https://us-east.order2.io/)

> > - Stage 버전 (https://stage-us-east-order2.torder.io/)
> >   - QA 버전 (https://us-east-order2.torder.io/)
> > - united_states (미국)
      > >

- 운영 버전 (https://us-order2.torder.io/)

> > - Stage 버전 (https://stage-us-order2.torder.io/)
> > - singapore (싱가폴)
      > >

- 운영 버전 (https://sg-order2.torder.io/)

> > - Stage 버전 (https://sg-stage.orderhae.com/)
> > - sydney (시드니)
      > >

- 운영 버전 (https://sydney.order2.io/)

> > - Stage 버전 (https://stage-sydney-order2.torder.io/)
> > > src <br/>
> > > ⎣&nbsp;**api** - rest api 및 주소 <br/>
> > > ⎣&nbsp;**assets** - image 파일 <br/>
> > > ⎣&nbsp;**codecs** - 런타임 타입 체커 <br/>
> > > ⎣&nbsp;**common** - 노드환경체크 및 상수 등의 고정값에 대한 정의 <br/>
> > > ⎣&nbsp;**components** - 자신의 state가 없고, props와 CSS만 존재하는 최소단위 컴포넌트 <br/>
> > > ⎣&nbsp;**composables** - 자체 state를 가지며 함수형태로 사용되는 hooks <br/>
> > > ⎣&nbsp;**containers** - 논리 로직을 가지는 UI <br/>
> > > ⎣&nbsp;**interface** - Typescript 객체에 대한 타입 <br/>
> > > ⎣&nbsp;**i18n** - 국제화 관련 설정 <br/>
> > > ⎣&nbsp;**locale** - 언어팩 관련 json <br/>
> > > ⎣&nbsp;**layouts** - 루트 라우트에서 그려지는 UI 레이아웃 <br/>
> > > ⎣&nbsp;**plugin** - socket 등의 inject 라이브러리 커스텀 파일 <br/>
> > > ⎣&nbsp;**router** - vue router 정보 <br/>
> > > ⎣&nbsp;**store** - 프론트 전역 state(pinia) 관련 파일 <br/>
> > > ⎣&nbsp;**styles** - css 모음<br/>
> > > ⎣&nbsp;**utils** - 자체 state를 가지지 않고 공통으로 사용되는 함수 <br/>
> > > ⎣&nbsp;**views** - 페이지 단위의 vue 컴포넌트 <br/>

# monorepo 설정

- pnpm workspace 사용

    - pnpm-workspace.yaml
  ```
  packages:
  - 'package/*'
  ```

    - root
  ```
  {
    "name": "front_remake_torder",
    "private": true,
    "scripts": {
      "lint": "eslint --ext .js,.ts,.vue --ignore-path .gitignore --fix package", // 전역 린트 검사 실행
      "torder:serve": "pnpm run --filter torder torder:serve", // 국내망 개발
      "torder:serve:prod": "pnpm run --filter torder torder:serve:prod", // 국내망 운영
      "torder:preview": "pnpm run --filter torder torder:preview", // 국내망 운영 (빌드 환경)
      "torder:build": "pnpm run --filter torder torder:build", // 국내망 운영 빌드
      "torder:build:dev": "pnpm run --filter torder torder:build:dev", // 국내망 개발 빌드
      "us-east:serve": "pnpm run --filter torder us-east:serve", // 캐나다망 운영
      "us-east:preview": "pnpm run --filter torder us-east:preview", // 캐나다망 (운영 빌드 환경)
      "us-east:build": "pnpm run --filter torder us-east:build", // 캐나다망 빌드
      "us:serve": "pnpm run --filter torder us:serve", // us망 운영
      "us:preview": "pnpm run --filter torder us:preview", // us망 (운영 빌드 환경)
      "us:build": "pnpm run --filter torder us:build", // us망 빌드
      "singapore:serve": "pnpm run --filter torder singapore:serve", // 싱가포르망 운영
      "singapore:preview": "pnpm run --filter torder singapore:preview", // 싱가포르망 운영 (빌드 환경)
      "singapore:build": "pnpm run --filter torder singapore:build", // 싱가포르망 빌드
      "sydney:serve": "pnpm run --filter torder sydney:serve", // 시드니 운영
      "sydney:preview": "pnpm run --filter torder sydney:preview", // 시드니 운영 (빌드 환경)
      "sydney:build": "pnpm run --filter torder sydney:build", // 시드니 빌드
      "torder:deploy:action": "pnpm run --filter torder deploy:action", // 단일 배포 (dev, qa)
      "torder:deploy:action:version": "pnpm run --filter torder deploy:action:version", // 버저닝 배포
      "torder:tsc": "pnpm run --filter torder tsc" // 전역 type 및 에러 검사
    },
    "dependencies": {
      "@aws-sdk/client-cloudfront": "^3.212.0",
      "@aws-sdk/client-s3": "^3.32.0",
      "@types/md5": "^2.3.2",
      "@types/uuid": "^9.0.7",
      "axios": "^1.6.2",
      "fp-ts": "2.11.5",
      "io-ts": "2.2.16",
      "md5": "^2.3.0",
      "pinia": "^2.0.14",
      "socket.io-client": "2.4.0",
      "uuid": "^9.0.1",
      "vue": "^3.2.45",
      "vue-i18n": "^9.1.10",
      "vue-router": "^4.0.0-0",
      "vue3-slider": "^1.8.0"
    },
    "devDependencies": {
      "@babel/core": "^7.17.9",
      "@sentry/vite-plugin": "^2.14.0",
      "@sentry/vue": "^7.101.0",
      "@types/node": "^20.10.4",
      "@types/socket.io-client": "^1.4.36",
      "@typescript-eslint/eslint-plugin": "^5.62.0",
      "@typescript-eslint/parser": "^5.52.0",
      "@vitejs/plugin-vue": "^4.0.0",
      "@vue/eslint-config-airbnb": "^7.0.0",
      "@vue/eslint-config-typescript": "^9.1.0",
      "eslint": "^7.32.0",
      "eslint-plugin-import": "^2.25.3",
      "eslint-plugin-newline": "1.5.0",
      "eslint-plugin-vue": "^9.19.2",
      "lint-staged": "^15.2.0",
      "mime": "^4.0.0",
      "postcss-html": "^1.4.1",
      "sass": "^1.26.5",
      "stylelint": "^14.16.1",
      "stylelint-config-recommended-scss": "^6.0.0",
      "stylelint-config-recommended-vue": "^1.4.0",
      "stylelint-order": "^5.0.0",
      "typescript": "^4.9.5",
      "vite": "^5.0.6",
      "vite-plugin-stylelint": "^4.2.0",
      "vite-plugin-vue-devtools": "1.0.0-rc.7",
      "vite-plugin-vue-inspector": "^4.0.2",
      "vue-tsc": "^1.8.25",
      "webpack": "5"
    },
    "lint-staged": {
      "*.{js,jsx,vue,ts,tsx}": [
        "eslint --ext .js,.vue --ignore-path .gitignore --fix src"
      ],
      "*.{js,vue}": "eslint --cache --fix",
      "*.css": "stylelint --fix"
    },
    "packageManager": "pnpm@8.4.0"
    }
  ```
  package/common
  ```
  {
    "name": "@torder/common",
    "version": "1.0.0",
    "description": "",
    "main": "index.ts",
    "author": "",
    "license": "ISC"
  }
  ```
  package/remake
  ```
  {
    "name": "torder",
    "version": "2.12.2",
    "private": true,
    "type": "module",
    "scripts": {
      "tsc": "vue-tsc --noEmit",
      "update:html": "node ./script/update-html.mjs",
      "deploy:action": "node ./script/deploy.action.mjs",
      "deploy:action:version": "node ./script/live-deploy.action.mjs",
      "torder:serve": "VITE_TORDER_FLAG=true vite --port 8080 --host --mode development",
      "torder:serve:prod": "VITE_TORDER_FLAG=true vite --port 8080 --host --mode production",
      "us-east:serve": "VITE_US_EAST_FLAG=true vite --port 8080 --host --mode production",
      "us:serve": "VITE_US_FLAG=true vite --port 8080 --host --mode production",
      "singapore:serve": "VITE_SINGAPORE_FLAG=true vite --port 8080 --host --mode production",
      "sydney:serve": "VITE_SYDNEY_FLAG=true vite --port 8080 --host --mode production",
      "torder:build": "pnpm tsc && VITE_TORDER_FLAG=true vite build && pnpm update:html",
      "torder:build:dev": "pnpm tsc && VITE_TORDER_FLAG=true vite build --mode development && pnpm update:html",
      "us-east:build": "pnpm tsc && VITE_US_EAST_FLAG=true vite build && pnpm update:html",
      "us:build": "pnpm tsc && VITE_US_FLAG=true vite build && pnpm update:html",
      "singapore:build": "pnpm tsc && VITE_SINGAPORE_FLAG=true vite build && pnpm update:html",
      "sydney:build": "pnpm tsc && VITE_SYDNEY_FLAG=true vite build && pnpm update:html",
      "torder:preview": "pnpm torder:build && vite preview --port 8080 --host",
      "us-east:preview": "pnpm us-east:build && vite preview --port 8080 --host",
      "us:preview": "pnpm us:build && vite preview --port 8080 --host",
      "singapore:preview": "pnpm singapore:build && vite preview --port 8080 --host",
      "sydney:preview": "pnpm sydney:build && vite preview --port 8080 --host"
    },
    "dependencies": {
      "@torder/common": "*"
    }
  }
  ```
- root dependencies 참조해 하위 패키지 상속
- common에 정의한 공통 모듈 사용하기 위해서는
  ```
  "dependencies": {
    "@torder/common": "*"
  }
  ```
  위와 같이 패키지간 의존성 주입 필요
  주입 후 yarn 명령어로 linking 필요

- common 패키지 export 예시
  ```
  export * from './components';
  export * from './sample';
  export * from './utils';
  export * from './composables';
  export * from './constant';
  export * from './codecs';
  export * from './interface';
  ```
  common 하위에 폴더구조로 정의한 내용 전부 index.ts에서 export

## 깃액션 배포 관련

### 1. Git Flow

- 개별 브랜치 -> develop -> stage -> master

### 2. CI/CD Role

- github labels를 사용하여 선택적으로 CI/CD를 실행할 수 있다.

> #### 개별 브랜치 -> pull request -> develop 의 경우

|       라벨        |    실행 파일    |       결과       |
|:---------------:|:-----------:|:--------------:|
|                 |   dev.yml   |    dev망 배포     |
| `qa`, `torder2` | develop.yml |   현행 qa망 배포    |
| `qa`, `us-east` | develop.yml | us-east qa망 배포 |

> #### develop -> pull request -> stage 의 경우

|          라벨          |   실행 파일   |        결과         |
|:--------------------:|:---------:|:-----------------:|
|  `stage`, `torder2`  | stage.yml |     stage망 배포     |
|  `stage`, `us-east`  | stage.yml | us-east stage망 배포 |
| `stage`, `singapore` | stage.yml |  싱가포르 stage망 배포   |
|    `stage`, `us`     | stage.yml |   us stage망 배포    |
|  `stage`, `sydney`   | stage.yml | sydney stage망 배포  |

> #### stage -> pull request -> master 의 경우

|         라벨          |   실행 파일    |       결과       |
|:-------------------:|:----------:|:--------------:|
|  `live`, `torder2`  | master.yml |     운영망 배포     |
|  `live`, `us-east`  | master.yml | us-east 운영망 배포 |
| `live`, `singapore` | master.yml |  싱가포르 운영망 배포   |
|    `live`, `us`     | master.yml |   us 운영망 배포    |
|  `live`, `sydney`   | master.yml | sydney 운영망 배포  |

## 버저닝

- 티오더1과 동일하게 버전을 이용한 배포 관리 시스템을 도입.
- 배포 관리 문제로 인해 **국내, us-east, 시드니, 싱가포르 배포**에 버저닝 기능이 적용.
- s3 버킷에 폴더링을 통한 버저닝을 구축하고 클라우드프론트를 적용하면 원하는 버전의 index.html 파일을 찾지 못하는 이슈가 발생.
    - aws Lambda를 클라우드프론트가 index.html 파일을 찾고 경로에 index.html를 제거하도록 Function 추가.
- CI/CD를 통해 현재 버전에 +1한 버전으로 배포.
    - 항상 새로운 버전을 생성하므로 재배포가 필요할 경우에는 수동 배포 진행.
    - s3 버킷에 currentVersion.json 파일을 통해 현재까지 배포된 최신 버전 정보를 확인할 수 있음.

## 해외망 프로젝트별 차이점

- 로고 이미지
    - 국내망: BI
      ![torder_BI_logo](https://static.torder.co.kr/torder2/icon_torder_logo_gray_200.svg)
    - 해외망: CI
      ![torder_CI_logo](https://static.torder.co.kr/torder2/icon_torder_logo_CI_gray_200.svg)
- 커스텀 테마 이벤트 버튼
    - us-east(캐나다)망 관리자 요청으로 해당 버튼 숨김처리 적용
- 정적 텍스트 번역
    - 해외망은 모두 **영어**로 표기
- 배너 노출 로그
    - 데이터 플랫폼팀 요청으로 배너가 노출되는 횟수와 관련된 로그를 쌓기 위한 로직은 **국내망**에만 적용.

## 프로젝트 변경 사항

- 패키지 매니저 yarn => pnpm 으로 변경
- 버저닝 기능 도입
- 모노레포를 통해 해외망 서비스를 각자 관리하는 방식에서 환경변수 플래그를 통해 하나의 프로젝트로 관리하는 방식으로 변경
    - 새로운 기능이나 변경 사항이 있을 경우 모든 해외망 프로젝트 각각 적용해줘야 하는 비효율성 및 휴먼 에러가 발생하여 모노레포 방식의 불필요함을 느낌
    - 해외망 프로젝트별로 특이사항 및 차이점이 거의 존재하지 않음

## 로컬 https 테스트

- 해당 [링크](https://web.dev/articles/how-to-use-local-https?hl=ko#quick-reference) 의 빠른 참조대로만 진행
