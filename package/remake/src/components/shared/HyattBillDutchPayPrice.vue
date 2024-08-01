<!-- <template>
  <div class="dutch-price-container">
    <div class="dutch-person">
      {{ person }}
    </div>
    <div class="dutch-price">
      {{ getPrice(price) }}
    </div>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps<{
  /** 가격을 나타내는 인자입니다. */
  price: string,
  /** 더치페이 문구입니다. */
  person: string,
  /** 가격 단위입니다. */
  priceUnit: string,
}>();

const getPrice = (value: string) => value + props.priceUnit;
</script>

<style lang='scss' scoped>
.dutch-price-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 8.4375vw;
  text-align: center;

  .dutch-person {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 2.3438vw;
    font-style: normal;
    font-weight: normal;
    font-stretch: normal;
    line-height: normal;
    color: #000;
    letter-spacing: normal;
  }

  .dutch-price {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 3.75vw;
    font-style: normal;
    font-weight: bold;
    font-stretch: normal;
    line-height: normal;
    color: #ab240f;
    letter-spacing: normal;
  }
}
</style> -->
