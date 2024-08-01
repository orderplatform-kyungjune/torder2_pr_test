import {
  computed,
  Ref,
  ref,
} from 'vue';
import { defineStore } from 'pinia';

import { cartProductType } from '@torder/common/interface/cartProduct';
import { CART } from '@torder/common/constant';
import useModalStore from '@store/storeModal';

const useCartStore = defineStore(CART, () => {
  const cartProducts: Ref<cartProductType[]> = ref([]);
  const cartConfirmStatus: Ref<boolean> = ref(false);
  const duplicateCartCode: Ref<string> = ref('');
  // eslint-disable-next-line no-undef
  const cartTimeId: Ref<NodeJS.Timeout | undefined> = ref(undefined);

  const setCartConfirmStatus = (status: boolean): void => {
    cartConfirmStatus.value = status;
  };

  const addCartProduct = (product: cartProductType): void => {
    cartProducts.value.push(product);
  };

  const setCartProduct = (defaultProduct: cartProductType[]): void => {
    cartProducts.value = defaultProduct;
  };

  const spliceCartProduct = (productIndex: number): void => {
    cartProducts.value.splice(productIndex, 1);
  };

  const replaceCartProduct = (product: cartProductType, targetIndex?: number): void => {
    const findIndex = cartProducts.value.findIndex((cart, index) => {
      if (targetIndex) return cart.id === product.id && index === targetIndex;

      return cart.id === product.id;
    });
    if (findIndex < 0) return;
    cartProducts.value.splice(findIndex, 1, product);
  };

  // 장바구니 비우기
  const deleteCartProductAll = (): void => {
    cartProducts.value = [];
  };

  const increaseCartProductQuantity = (productIndex: number): void => {
    cartProducts.value[productIndex].quantity += 1;
  };

  const multiIncreaseCartProductQuantity = (productIndex: number, count: number): void => {
    cartProducts.value[productIndex].quantity += count;
  };

  const decreaseCartProductQuantity = (productIndex: number): void => {
    cartProducts.value[productIndex].quantity -= 1;
  };

  const pushUpItemIndex = (productIndex: number) => {
    const target = cartProducts.value.splice(productIndex, 1);

    if (target) {
      cartProducts.value.push(target[0]);
    }
  };

  const isActiveCart = computed(() => {
    const { flag } = useModalStore();
    const isCartProducts = cartProducts.value.length >= 1;
    const isActive = flag.cart && isCartProducts;

    return isActive;
  });

  const isHaveCartProduct = computed(() => {
    const isCartProducts = cartProducts.value.length >= 1;

    return isCartProducts;
  });

  // 주문 중복 방지를 위한 장바구니 키
  const createDuplicateCartCode = (storeCode: string, tabletId: string, uCode: string) => {
    duplicateCartCode.value = `${storeCode}-${tabletId}-${uCode}-${Math.floor(Date.now() / 1000)}`;
  };

  const clearDuplicateCartCode = () => {
    duplicateCartCode.value = '';
  };

  return {
    cartProducts,
    addCartProduct,
    setCartProduct,
    spliceCartProduct,
    deleteCartProductAll,
    increaseCartProductQuantity,
    decreaseCartProductQuantity,
    multiIncreaseCartProductQuantity,
    pushUpItemIndex,
    cartConfirmStatus,
    setCartConfirmStatus,
    isActiveCart,
    isHaveCartProduct,
    replaceCartProduct,
    duplicateCartCode,
    createDuplicateCartCode,
    clearDuplicateCartCode,
    cartTimeId,
  };
});

export default useCartStore;
