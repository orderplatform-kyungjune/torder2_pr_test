<template>
  <div class="devtool-container">
    <ul>
      <li @click="sendBeep">
        Beep 전송
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  sendBeep: () => void,
}>();
</script>

<style scoped lang='scss'>
.devtool-container {
  position: absolute;
  left: 11.7188vw;
  z-index: 9999;

  > ul > li {
    padding: 0.7vw;
    color: #fff;
    background-color: black;
    border-radius: 1.1719vw;
  }
}
</style>
