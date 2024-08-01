# Components

## Components란?

현 프로젝트는 [아토믹 디자인](https://kciter.so/posts/effective-atomic-design)을 지향하고 있다.

단위 : Views > Container > **Component**

![ex](https://user-images.githubusercontent.com/91718091/144579382-2e8abd91-1e85-45a1-8b55-fee978209597.png)

> 하나의 버튼 Component가 (Container 내부에) 여러 개 존재한다.

Button, Header 또는 Banner 등 동일한 style의 UI가 다중으로 사용될 때 재사용성의 증대를 위해 사용한다.<br/>
하나의 Page에서 똑같은 UI을 여러 개 표현해야 하는 경우(ex. 상단 이미지 참조), CSS 로직과 단순 데이터를 가공하는 로직이 Page에 구분없이 모두 존재한다면 유지보수성이 떨어진다. 그러므로 최소 단위 컴포넌트로 나눈다.
> 아토믹 디자인 패턴의 atoms, molecules를 합친 개념과 유사

<br/>

## components 특징

뷰를 디자인하는 CSS 코드 위주로 구성한다.<br/>
자신의 state 값이 존재하지 않고, props를 통해 부모에게 data를 전달받아 사용한다.

<br/>

## components 주의사항

methods를 사용할 수는 있으나, props로 전달받은 data를 직접 수정할 수 없다.<br/>
props를 통해 전달받은 data를 가공해서 사용해야하는 경우 computed를 통해 사용하거나, 부모에서 data를 가공하는 methods 만든 후 props로 methods를 전달받아 사용한다.<br/>
타 component의 data를 변경해야하거나 자신의 state를 보유하지 않으면 로직적으로 개발하기 힘든 경우에는 container로 구성한다.
