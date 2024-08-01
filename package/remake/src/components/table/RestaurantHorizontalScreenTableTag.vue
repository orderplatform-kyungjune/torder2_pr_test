<template>
  <div class="table-tag-container">
    <div class="table-tag-title">
      Table NO.
    </div>
    <div class="table-tag-name">
      {{ tableNO }}
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  tableNO: string,
  customTableBackgroundColor: string,
  customTableFontColor: string,
}>();
</script>

<style lang='scss' scoped>
.table-tag-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.625vw;
  align-items: center;
  justify-content: center;
  padding: 1.3281vw 1.5234vw;
  font-family: 'Pretendard', sans-serif;
  background-color: v-bind(customTableBackgroundColor);
  border-bottom-right-radius: 1.5625vw;
  border-bottom-left-radius: 1.5625vw;
  box-shadow: 0.3906vw 0.3906vw 1.1719vw 0 rgba(0, 0, 0, 0.05);

  .table-tag-title {
    font-size: 1.0938vw;
    font-weight: 200;
    color: v-bind(customTableFontColor);
  }

  .table-tag-name {
    font-size: 2.1875vw;
    font-weight: 600;
    color: v-bind(customTableFontColor);
    text-align: center;
    letter-spacing: -0.0438vw;
  }
}
</style>
