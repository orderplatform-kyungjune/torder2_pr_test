<template>
  <div class="login-button-layout">
    <button class="login-button">
      {{ title }}
    </button>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  /** 로그인 버튼 이름입니다. */
  title: string,
  /** background 색상 입니다. */
  background: string,
  /** font-color 색상 입니다. */
  color: string,
}>();
</script>

<style lang='scss' scoped>
.login-button-layout {
  display: flex;
  align-items: center;
  height: 100%;

  .login-button {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 2vw;
    font-weight: 100;
    color: v-bind(color);
    background-color: v-bind(background);
    border: none;
    border-radius: 100vw;
  }
}
</style>
