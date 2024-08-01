<!-- <template>
  <div class="store-table-info-container">
    <div class="store-table-info-wrap">
      <div class="table-info-wrap">
        <div class="title">
          {{ title }}
        </div>
        <div class="table-name">
          {{ tableName }}
        </div>
      </div>
      <div
        class="store-name"
        :class="theme"
      >
        {{ storeName }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  /** 컴포넌트 상단 제목이 들어가는 곳입니다 */
  title: string,
  /** 컴포넌트 내부 테이블 이름이 들어가는 곳입니다 */
  tableName: string,
  /** 컴포넌트 내부 가게 이름이 들어가는 곳입니다 */
  storeName: string,
  /** 컴포넌트 내부 테마입니다. */
  theme: string,
}>();
</script>

<style lang='scss' scoped>
.store-table-info-container {
  position: fixed;
  top: 0;
  right: 0.78125vw;
  z-index: 20;
  display: flex;
  justify-content: flex-end;
  min-width: 10.546875vw;
  max-width: 14vw;
  max-height: 11vw;
  word-break: break-all;

  .store-table-info-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .table-info-wrap {
      z-index: 10;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.4688vw;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.7vw;
      overflow: hidden;
      color: #fff;
      background-color: red;
      border-bottom-right-radius: 0.7vw;
      border-bottom-left-radius: 0.7vw;
      box-shadow: 0 0 0.5vw -0.1vw #000;

      .title {
        z-index: 10;
        font-family: "Noto Sans SC", sans-serif;
        font-size: 0.8937vw;
        font-style: normal;
        font-weight: 700;
        font-stretch: normal;
        color: #fff;
        text-align: center;
        letter-spacing: normal;
      }

      .table-name {
        flex: 1;
        width: 100%;
        padding-top: 0.8vw;
        font-family: "Noto Sans SC", sans-serif;
        font-size: 2.1937vw;
        font-weight: 900;
        text-align: center;
        letter-spacing: -0.078125vw;
      }
    }

    .store-name {
      font-size: 0.86vw;
      font-style: normal;
      font-weight: 400;
      font-stretch: normal;
      line-height: 1.55;
      letter-spacing: normal;

      &.black {
        color: #f5f5f5;
      }

      &.white {
        color: #000;
      }
    }
  }
}
</style> -->
