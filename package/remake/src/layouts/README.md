# Layouts

## Layouts이란?
상단에 고정되어 페이지 이동이 되어도 렌더링 되지 않는 영역

![ex](https://user-images.githubusercontent.com/91718091/144561409-3cfc0c7b-2692-401a-8716-276d7ff1547d.png)

상단 이미지에서 메뉴바, 로그아웃 영역과 같이 고정되는 부분을 Layout이라고 한다.

<br/>

## 적용 방법
route 설정 방법

path '/'에 defaultLayout 컴포넌트를 적용하고, views 컴포넌트를 children으로 적용한다.

```typescript
// router/routePath.ts

export const login = '/';
export const defaultLayout = '/defaultLayout';
```

```typescript
// router/getRoutePath.ts

const getRemovedSlashPath = (path: string) => path.replace('/', '');

export const getRouteName = (path: string) : string => {
  if (path === '/') {
    const homeName = 'login';
    return homeName;
  }
  return getRemovedSlashPath(path);
```

```typescript
// router/index.ts

const routes: Array<RouteRecordRaw> = [
  {
    path: login,
    name: getRouteName(login),
    component: () => import('@layouts/LoginLayout.vue')
  },
  {
    path: defaultLayout,
    name: getRouteName(defaultLayout),
    component: () => import('@layouts/DefaultLayout.vue'),
    children: [
      {
        path: storeSearch,
        name: getRouteName(storeSearch),
        component: () => import('@views/StoreSearch.vue'),
      },
      {
        path: salesPeriod,
        name: getRouteName(salesPeriod),
        component: () => import('@views/SalesPeriod.vue')
      },
      {
        ...
      },
]
```
