import { storeToRefs } from 'pinia';
import useInitStore from '@store/storeInit';

const checkStandardPriceUnit = (price: string | number) => {
  if (price === '') return '';

  const { getStoreInfo } = storeToRefs(useInitStore());
  const unit = getStoreInfo.value?.standardPriceUnit;

  switch (unit) {
    case '$':
      if (typeof price === 'number') {
        return `$ ${price.toFixed(2)}`;
      }
      return `$ ${Number(price.replace(/,/g, '')).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    case '¥':
      return `¥ ${price}`;
    default:
      return `${price}원`;
  }
};

export default checkStandardPriceUnit;
