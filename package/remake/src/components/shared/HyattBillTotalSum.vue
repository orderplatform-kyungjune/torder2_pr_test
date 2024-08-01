<!-- <template>
  <div class="bill-total-sum-container">
    <div class="bill-total-text">
      {{ sumTitle }}
    </div>
    <div class="bill-price-wrap">
      <span class="bill-price">
        {{ checkStandardPriceUnit(totalPrice) }}
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import useInitStore from '@store/storeInit';

const { checkStandardPriceUnit } = useInitStore();

defineProps<{
  totalPrice: string,
  sumTitle: string,
}>();
</script>

<style lang='scss' scoped>
.bill-total-sum-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 1.5625vw 3.125vw;
  box-shadow: 0 -0.0781vw 1.5625vw 0 rgba(0, 0, 0, 0.1);

  .bill-total-text {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 2.0313vw;
    font-weight: 500;
    line-height: 1.58;
    color: #131313;
  }

  .bill-price-wrap {
    display: flex;
    align-items: center;
    font-family: "Noto Sans SC", sans-serif;
    font-weight: bold;
    color: #131313;

    .bill-price {
      margin-right: .3906vw;
      font-size: 2.9688vw;
      letter-spacing: -0.0742vw;
    }
  }
}
</style> -->
