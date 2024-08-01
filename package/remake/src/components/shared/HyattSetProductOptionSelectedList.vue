<!-- <template>
  <li class="selected-option-item">
    <div class="option-detail-wrap">
      <div class="option-group-wrap">
        <div class="option-group">
          {{ selectedOptionGroupName }}
        </div>
        <div
          class="delete-option-group-button"
          @click="deleteOptionGroupByIndex"
        >
          <img
            src="https://static.torder.co.kr/torder2/btn_close_white_25.2px.svg"
            alt="close-button"
          >
        </div>
      </div>
    </div>
    <slot/>
  </li>
</template>

<script setup lang='ts'>

defineProps<{
  selectedOptionGroupName: string,
  deleteOptionGroupByIndex: () => void,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-option-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: .7813vw;
  padding: .7813vw;
  margin-top: 1vw;
  background-color: #fff;
  border: .0781vw solid #999;
  border-radius: .7813vw;

  .option-detail-wrap{
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: .7813vw;

    .option-group {
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.25vw;
      font-weight: 500;
      color: #999;
      word-break: break-all;
    }

    .option-group-wrap {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;

      .delete-option-group-button {
        position: absolute;
        top: -0.7813vw;
        right: -0.7813vw;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5vw;
        height: 2.5vw;
        padding: .7813vw;
        color: #fff;
        background-color: #818181;
        border-radius: .3906vw;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style> -->
