<!-- <template>
  <div class="container-person-button">
    <div class="wrap-person-button">
      <div
        id="person-button-sub-element"
        class="person-count-text"
      >
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  /** 총 인원 입력 버튼에 들어가는 문구입니다. */
  content: string,
}>();
</script>

<style lang='scss' scoped>
.container-person-button {
  position: fixed;
  right: 83vw;
  bottom: 9.453125vw;
  left: 0;
  z-index: 12;
  display: flex;
  align-items: center;
  height: 4.6875vw;

  .wrap-person-button {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14.6875vw;
    height: 3.90625vw;
    margin: 0 0 0 0.390625vw;
    font-size: 1.6vw;
    font-weight: 700;
    color: #fff;
    background-color: #000;
    border: 0.1563vw solid red;
    border-radius: 0.7813vw;
    box-shadow: 0.2344vw 0.2344vw 0.3125vw 0 rgb(0 0 0 / 40%);

    &.button-active {
      filter: brightness(0.9);
    }

    .person-count-text {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.15625vw;
    }
  }
}
</style> -->
