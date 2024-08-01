<template>
  <div class="store-name-wrap">
    <span class="store-title">Table No</span>
    <span class="store-name">{{ tableName }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tableName: string,
}>();
</script>

<style scoped lang='scss'>
.store-name-wrap {
  position: absolute;
  top: 0;
  right: 1vw;
  display: flex;
  flex-direction: column;
  gap: 1.1719vw;
  align-items: center;
  justify-content: center;
  width: 15.2344vw;
  height: 7.1094vw;
  font-family: 'Pretendard', sans-serif;
  color: #fff;
  word-break: break-all;
  background-color: #F91515;
  border-radius: 0 0 1.1719vw 1.1719vw;

  .store-title {
    font-size: 1.0938vw;
    font-weight: 200;
  }

  .store-name {
    margin-bottom: 0.3vw;
    font-size: 2.1875vw;
    font-weight: bold;
    text-align: center;
  }
}
</style>
