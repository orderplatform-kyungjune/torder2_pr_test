<template>
  <div class="modal-head-container">
    <div class="modal-title">
      {{ content }}
    </div>
    <div class="modal-close-button">
      <img
        id="modal-close-sub-element"
        class="close-img"
        src="https://static.torder.co.kr/torder2/svg_closebutton_normal_black.svg"
      >
      {{ buttonText }}
    </div>
  </div>
</template>

<script setup lang='ts'>
defineProps < {
  content: string,
  buttonText: string,
}>();
</script>

<style lang='scss' scoped>
.modal-head-container {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  height: 4.8vw;
  margin: 1vw;

  .modal-title {
    display: inline-block;
    flex-grow: 1;
    padding: 0;
    margin-right: 1vw;
    overflow: hidden;
    font-size: 3vw;
    font-weight: 100;
    line-height: 1.5;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 0.1vw solid #fff;
  }

  .modal-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.8vw;
    padding: 0 2vw;
    font-size: 2vw;
    color: #000;
    background-color: #fff;
    border-radius: 100vw;
    box-shadow: 0 0 0.8vw -0.4vw #000;

    &.button-active {
      filter: brightness(0.8);
    }

    .close-img {
      width: auto;
      height: 1.6vw;
      margin-right: 0.8vw;
    }
  }
}
</style>
