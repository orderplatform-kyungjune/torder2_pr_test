<template>
  <div class="login-number-button-container">
    {{ text }}
  </div>
</template>

<script lang='ts' setup>
defineProps<{
  /** 버튼에 들어갈 내용입니다. */
  text: string,
  /** 버튼 배경 색상 입니다. */
  background: string,
  /** font-color 입니다. */
  color: string,
}>();
</script>

<style lang='scss' scoped>
.login-number-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 7.5000vw;
  padding: 1.5625vw 1.8750vw;
  font-family: 'Pretendard', sans-serif;
  font-size: 3.2813vw;
  font-weight: 700;
  line-height: 4.3750vw;
  letter-spacing: -0.0656vw;
  background-color: v-bind(background);
  border-radius: 1.25vw;
}
</style>
