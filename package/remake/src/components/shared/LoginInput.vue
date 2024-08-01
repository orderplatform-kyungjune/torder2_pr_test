<template>
  <div class="wrapper">
    <div class="title">
      {{ title }}
    </div>
    <input
      class="input"
      :type="type"
      :value="value"
      @input="inputText"
    >
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  /** input의 제목입니다. (아이디, 비밀번호) */
  title: string,
  /** input에 들어가는 내용입니다. */
  value: string,
  /** 단방향 바인딩을 구현하기 위해 사용되는 함수 입니다. */
  type: string,
  inputText: (e: Event) => void,
}>();
</script>

<style lang='scss' scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  background-color: transparent;

  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 2vw;
    padding: 0 2vw;
    font-size: 1vw;
    line-height: 1em;
  }

  .input {
    box-sizing: border-box;
    width: 100%;
    height: 4vw;
    padding: 0 2vw;
    font-size: 2vw;
    font-weight: 100;
    background-color: #eaeaea;
    border: none;
    border-radius: 2vw;
    outline: none;
  }
}
</style>
