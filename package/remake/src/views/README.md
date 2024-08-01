# Views

## Views란?
현 프로젝트는 [아토믹 디자인](https://kciter.so/posts/effective-atomic-design)을 지향하고 있다.

단위 : **Views** > Container > Component

Component를 품은 Container를 Views에서 불러와 뷰를 그린다.<br/>
Views에는 CSS 로직은 존재하지 않으며, 파일별로 고유의 `router path`를 가진다.<br/>
필요에 따라 API 통신 로직이나 container에 필요한 로직을 views에 작성할 수도 있다.

```typescript
// ex

{
  path: '/loginPage',
  name: 'loginPage',
  component: () => import('@views/LoginPage.vue')
},
{
  path: '/userProfilePage',
  name: 'userProfilePage',
  component: () => import('@views/UserProfilePage.vue')
},{
  path: '/menuPage',
  name: 'menuPage',
  component: () => import('@views/MenuPage.vue')
},
.
.
.

```
