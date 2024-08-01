# Apis

## apis 디렉토리
Rest API 및 관련 주소를 관리하는 폴더이다.

⎣ index.ts<br/> 여러 파일들을 하나의 객채로 묶어 한번에 import 하기 위해 index.ts에 export 해준다. (파일 생성 시점마다 작업)<br/>
<br/>
⎣ endpoints.ts<br/>
API가 서버에서 리소스에 접근할 수 있도록 가능하게 하는 URL들을 모아놓은 집합.<br/>
#네이밍 룰
API URL 경로와 같은 deps로 변수명을 지정한다.

```javascript
// ex

const URL = 'https://test.co.kr/table-game/room';

const endPoints = {
  tableGame: {
    room: `${API_URL}/table-game/room`,
  },
  admin: {
    // 관리자 로그인을 합니다. (POST)
    login: `${LoginURL}/admin/login`,
  }
};

```
<br/>
⎣ 그 외 기능별 파일들<br/>
API URL의 첫번째 경로를 파일명으로 한다.<br/>
파일명의 경로로 사용되는 CRUD의 로직은 그 파일 안에서 모두 이루어진다.<br/>

> ex )<br/>tableGame.ts, admin.ts ... (상단 코드 참조)<br/>tableGame에 관련된 CRUD 로직은 tableGame.ts 안에 작성
<br/>

### 예시파일: src/apis/tableGame.ts