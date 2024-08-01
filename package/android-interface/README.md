# torderservice-android-interface-client

## 티오더 FE ↔ 안드로이드 인터페이스/메서드 통신 명세

> 노션 문서 링크  
> https://www.notion.so/torderkorea/FE-e8ab1eefc2ba40788b4db573fd806f48?pvs=4

# Git SubModule 사용 방법

원격 저장소 : https://github.com/torderdev/torderservice-android-interface-client

### 1. SubModule 등록

```
    git submodule add <저장소 주소> <폴더명>
```
```
    git submodule add https://github.com/torderdev/torderservice-android-interface-client packages/android-interface
```

### 2. SubModule 업데이트
```
    git submodule update --remote --merge
```