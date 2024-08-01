<template>
  <div
    v-if="tabletLogoImage"
    class="table-tag-with-logo-container"
  >
    <div class="table-number">
      {{ tableNO }}
    </div>
  </div>
  <div
    v-else
    class="table-tag-container"
  >
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
  tabletLogoImage: string,
  customTableFontColor: string,
}>();
</script>

<style lang='scss' scoped>
.table-tag-with-logo-container {
  display: flex;
  gap: .3906vw;
  align-items: center;
  justify-content: right;
  margin-right: 2.1875vw;
  font-family: "Noto Sans KR", sans-serif;

  .logo-image-wrap {
    width: 7.8125vw;
    height: 3.125vw;

    .logo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      margin-top: .7813vw;
    }
  }

  .table-number {
    margin-top: 0.7813vw;
    font-size: 1.7188vw;
    font-weight: bold;
    color: v-bind(customTableFontColor);
    text-align: center;
    letter-spacing: -0.0438vw;
  }
}

.table-tag-container {
  box-sizing: border-box;
  display: flex;
  gap: 0.625vw;
  align-items: center;
  justify-content: right;
  padding: 1vw 1.5234vw;
  font-family: "Noto Sans SC", sans-serif;

  .table-tag-title {
    font-size: 0.9375vw;
    font-weight: 300;
    color: v-bind(customTableFontColor);
  }

  .table-tag-name {
    height: 2.3438vw;
    overflow: hidden;
    font-size: 2.1875vw;
    font-weight: bold;
    color: v-bind(customTableFontColor);
    text-align: center;
    text-overflow: ellipsis;
    letter-spacing: -0.0438vw;
    white-space: nowrap;
  }
}
</style>
