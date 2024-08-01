/* eslint-disable vue/max-len */
import { Ref } from 'vue';
import axios from 'axios';

import { translateLanguage } from '@utils/langTransfer';
import { removeSymbol } from '@torder/common/utils';
import { cartProductType } from '@torder/common/interface/cartProduct';

const requestDescription = async (product: Ref<cartProductType>): Promise<string> => {
  try {
    const JsonFileURLByLanguage = translateLanguage(product.value.descriptionLanguage, product.value.descriptionLanguage.ko);

    if (!JsonFileURLByLanguage || JsonFileURLByLanguage === '') return removeSymbol(product.value.description);

    const { data } = await axios.get(JsonFileURLByLanguage);

    if (typeof data === 'string' && data !== '') return removeSymbol(data);

    return removeSymbol(product.value.description);
  } catch (error) {
    console.error(error);
    return removeSymbol(product.value.description);
  }
};

export default requestDescription;
