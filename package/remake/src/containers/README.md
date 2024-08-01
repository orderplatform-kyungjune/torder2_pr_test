# Containers

## Containers란?
현 프로젝트는 [아토믹 디자인](https://kciter.so/posts/effective-atomic-design)을 지향하고 있다.

단위 : Views > **Container** > Component

![ex2](https://user-images.githubusercontent.com/91718091/144580824-eed21ac5-0882-42c9-96e0-519f0c569643.png)

> 버튼들을 감싸고 있는 Container.

하나의 Page에서 속성별로 나누는 큰 단위의 묶음이다.
속성별로 나눈 묶음이기 때문에 유지보수성이 높다.

> 아토믹 디자인 패턴의 organism과 유사

<br/>

## containers 특징
자신의 state 값을 가질 수 있다.<br/>
다수의 component들의 조합체이다.<br/>
Component에 필요한 로직을 여기에서 작성하여 Props로 넘긴다.<br/>

<br/>

## containers 주의사항
내부의 style 코드가 너무 많아질 경우, 유지보수를 탁월하게 하기 위해 속성별 component로 분할하여 개발하는 것을 추천한다.