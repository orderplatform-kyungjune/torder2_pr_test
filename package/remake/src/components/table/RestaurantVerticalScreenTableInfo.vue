<template>
  <div class="table-info-wrap">
    <span class="table-head">Table NO.</span>
    <span class="table-name">{{ tableName }}</span>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  tableName: string,
  customTableFontColor: string,
}>();
</script>

<style lang='scss' scoped>
.table-info-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: 'Pretendard', sans-serif;
  color: v-bind(customTableFontColor);

  .table-head {
    font-size: 1.0938vw;
  }

  .table-name {
    font-size: 2.5vw;
    font-weight: bold;
  }
}
</style>
