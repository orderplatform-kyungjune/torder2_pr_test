# Router

## router 디렉토리

Vue Router config를 지정해주는

## router 해설

```javascript
// 라우터 정보가 변경 될때마다 호출
// 매 페이지 인증검사 실시
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated()) {
      next();
      return;
    }
    next('/login');
  }
  next();
});
```

## 참고 레퍼런스

- <https://router.vuejs.org/kr/guide/advanced/navigation-guards.html>
- <https://tenmilesquare.com/resources/software-development/creating-an-authentication-navigation-guard-in-vue/>
