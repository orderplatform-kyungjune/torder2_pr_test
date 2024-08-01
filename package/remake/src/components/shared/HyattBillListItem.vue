<!-- <template>
  <div class="bill-list-container">
    <div class="bill-left-wrap">
      <div class="bill-list-wrap">
        <div class="list-title">
          {{ getGoodName(order) }}
        </div>
        <div class="money-wrap">
          <div class="list-quantity">
            {{ getGoodQuantity(order) }}
          </div>
          <div class="list-price">
            {{ getGoodPrice(order) }}
          </div>
        </div>
      </div>
      <div
        v-if="isHasOptions(getGoodOptions(order))"
        class="bill-option-list-wrap"
      >
        <div
          v-for="option in getGoodOptions(order)"
          :key="getOptionsName(option)"
          class="bill-option-list-box"
        >
          <div>+ {{ getOptionsName(option) }}</div>
          <div class="money-wrap">
            <div>{{ getOptionsQuantity(option) }}</div>
            <div>{{ getOptionsPrice(option) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bill-right-wrap">
      <div>{{ getTotalPrice(totalPrice) }}</div>
    </div>
  </div>
</template>

<script setup lang='ts'>
interface billsArrayOptionType {
  optionName: string,
  optionOrderPrice: number,
  optionUnitPrice: number,
  // eslint-disable-next-line camelcase
  order_qty: number,
}

interface billsArrayType {
  creditPrice: number,
  goodName: string,
  goodPrice: number,
  option: billsArrayOptionType[],
  optionTotalPrice: number,
  orderPrice: number,
  orderQty: number,
  point: number,
  posOrderId: string,
  salePrice: number,
}

const props = defineProps<{
  /**
    주문에 대한 상세 내역으로 기본값으로 넣어준 형식에 맞게 넣어주면 작동합니다.
   */
  order: billsArrayType,
  /**
    한 항목에 대한 옵션가격과 메뉴가격을 합한 값을 넣어주면 됩니다.
   */
  totalPrice: string,
  /** 가격단위입니다. */
  priceUnit: string,
  /** 인원단위입니다. */
  quantityUnit: string,
}>();

const getGoodName = (order: billsArrayType) => {
  const goodName = order?.goodName;
  if (!goodName) return '';
  return goodName;
};

const getGoodPrice = (order: billsArrayType) => {
  if (!order?.goodPrice) return 0 + props.priceUnit;
  return order.goodPrice?.toLocaleString() + props.priceUnit;
};

const getGoodQuantity = (order: billsArrayType) => {
  if (!order?.orderQty) return 0 + props.quantityUnit;
  return order.orderQty + props.quantityUnit;
};

const getGoodOptions = (order: billsArrayType) => {
  if (!order?.option) return [];
  return order.option;
};

const getOptionsName = (option: billsArrayOptionType) => {
  if (!option?.optionName) return '';
  return option.optionName;
};

const getOptionsPrice = (option: billsArrayOptionType) => {
  if (!option?.optionOrderPrice) return 0 + props.priceUnit;
  return option.optionOrderPrice?.toLocaleString() + props.priceUnit;
};

const getOptionsQuantity = (option: billsArrayOptionType) => {
  if (!option?.order_qty) return 0 + props.quantityUnit;
  return option.order_qty + props.quantityUnit;
};

const isHasOptions = (options: billsArrayOptionType[]) => {
  const isOption = options.length > 0;
  return isOption;
};

const getTotalPrice = (price: string) => {
  if (!price) return 0 + props.priceUnit;
  return price + props.priceUnit;
};
</script>

<style lang='scss' scoped>
.bill-list-container {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .money-wrap {
    display: flex;
    justify-content: space-between;
    width: 30%;
  }

  .bill-left-wrap {
    width: 80%;

    .bill-list-wrap {
      display: flex;
      justify-content: space-between;
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.875vw;
      font-style: normal;
      font-weight: bold;
      font-stretch: normal;
      line-height: 1.58;
      color: #000;
      text-align: left;
      letter-spacing: -0.0469vw;

      .list-title {
        max-width: 30vw;
        word-break: break-all;
      }
    }

    .bill-option-list-wrap {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: .7813vw 0;
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.875vw;
      font-style: normal;
      font-weight: normal;
      font-stretch: normal;
      line-height: normal;
      color: #0080ff;
      letter-spacing: -0.0469vw;

      .bill-option-list-box{
        display: flex;
        justify-content: space-between;
        padding: .3906vw 0 .3906vw .7813vw;
      }
    }
  }

  .bill-right-wrap {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 1.875vw;
    font-style: normal;
    font-weight: 900;
    font-stretch: normal;
    line-height: 1.5;
    color: #000;
    letter-spacing: -0.0469vw;
  }
}
</style> -->
