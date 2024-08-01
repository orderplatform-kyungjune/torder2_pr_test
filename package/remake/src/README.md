# 프로젝트 디렉토리 구조

> src <br/>
⎣&nbsp;**api** - rest api 및 주소 <br/>
⎣&nbsp;**assets** - image 파일 <br/>
⎣&nbsp;**codecs** - 런타임 타입 체커 <br/>
⎣&nbsp;**components** - 자신의 state가 없고, props와 CSS만 존재하는 최소단위 컴포넌트<br/>
⎣&nbsp;**composables** - Vue Mixins을 대체할 공용으로 쓰일 상태값을 정리 해둔 이펙터<br/>
⎣&nbsp;**containers** - 컨트롤 로직이 존재하는 뷰 컴포넌트. 상태값이 없는 다수의 뷰 컴포넌트와 조합하여 사용한다.<br/>
⎣&nbsp;**interface** - Typescript 객체에 대한 타입 지정을 모아두고 있다.<br/>
⎣&nbsp;**layouts** - 상단에 고정되어 페이지 이동이 되어도 렌더링 되지 않는 영역<br/>
⎣&nbsp;**router** - vue router 정보<br/>
⎣&nbsp;**store** - vuex 관련 파일<br/>
⎣&nbsp;**styles** - css 모음<br/>
⎣&nbsp;**utils** - vue 컴포넌트 helper util<br/>
⎣&nbsp;**views** - 페이지 단위의 vue 컴포넌트<br/>
