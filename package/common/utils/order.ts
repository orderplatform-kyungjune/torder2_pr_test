/* eslint-disable import/prefer-default-export */
import { StaffCallItemType } from '../interface/staffCall';
import {
  productGroupType,
  productOptionType,
  productType,
} from '../interface/product';
import {
  cartProductType,
  CartProductOptionGroupType,
  CartProductOptionType,
  OrderProductType,
  StoreInfoType,
} from '../interface/cartProduct';
import { LEGACY, NEXT } from '../constant/string';

export const generateProductCode = (product: cartProductType) => {
  const options = product.options?.flatMap((option) => {
    if (
      !option.isOptionExist &&
      !option.isProductExist &&
      !option.isProduct &&
      option.checked
    ) {
      const list = option;

      return `-${list.code}:${list.quantity}`;
    }

    if (!option.isOptionExist && option.isProductExist) {
      const group = option;
      const lists = group.items;

      return lists
        .filter((option) => option.checked)
        .map((product) => `-${product.productCode}:${product.quantity}`);
    }

    const group = option;
    const lists = group.items;

    return lists
      .filter((option) => option.checked)
      .map((option) => `-${option.code}:${option.quantity}`);
  });

  const productCode = [product.id, ...(options ?? '')].join('');

  return productCode;
};

type CartItemType =
  | cartProductType
  | productType
  | CartProductOptionGroupType
  | CartProductOptionType
  | productOptionType
  | productGroupType<productType>;

const covertOrderForm = (
  orderList: OrderProductType[],
  cartItem: CartItemType,
) => {
  // 단순상품일 경우
  if (
    cartItem.isOrder &&
    cartItem.isProduct &&
    !cartItem.isOptionExist &&
    !cartItem.isProductExist
  ) {
    const productItem = cartItem as cartProductType | productType;

    const formatOrder = {} as OrderProductType;

    if ('id' in productItem) {
      const cartProduct = productItem as cartProductType;

      formatOrder.good_code = cartProduct.id;
      formatOrder.good_qty = cartProduct.quantity;
    } else {
      const product = productItem as productType;

      formatOrder.good_code = product.productCode;
      formatOrder.good_qty = product.quantity;
    }

    orderList.push(formatOrder);
    return;
  }

  // 단순옵션아이템일 경우
  if (
    cartItem.isOrder &&
    !cartItem.isProduct &&
    !cartItem.isOptionExist &&
    !cartItem.isProductExist
  ) {
    const optionItem = cartItem as CartProductOptionType;

    const formatOrder = {} as OrderProductType;
    formatOrder.good_code = optionItem.code;
    formatOrder.good_qty = optionItem.quantity;

    orderList.push(formatOrder);
    return;
  }

  // 세트상품일 경우
  if (
    cartItem.isProduct &&
    !cartItem.isOptionExist &&
    cartItem.isProductExist
  ) {
    const setProduct = cartItem as cartProductType | productType;

    const formatOrder = {} as OrderProductType;

    if ('id' in setProduct) {
      const cartProduct = setProduct as cartProductType;

      formatOrder.good_code = cartProduct.id;
      formatOrder.good_qty = cartProduct.quantity;
      formatOrder.order_options = [];
      cartProduct.products
        .filter((product) => product.checked)
        .forEach((product) => {
          // 상품그룹타입일때
          if (product.isProductExist && !product.isProduct) {
            const productGroup = product as CartProductOptionGroupType;

            productGroup.items
              .filter((product) => product.checked)
              .forEach((product) => {
                covertOrderForm(formatOrder.order_options ?? [], product);
              });
            return;
          }

          // 옵션상품타입일때
          if (product.isOptionExist && product.isProduct) {
            const optionProduct = product as productType;

            const formatOrder = {} as OrderProductType;

            formatOrder.good_code = optionProduct.productCode;
            formatOrder.good_qty = product.quantity;
            formatOrder.order_options = [];
            optionProduct.option
              .filter((option) => option.checked)
              .forEach((option) => {
                // 옵션그룹타입일때
                if (option.isOptionExist) {
                  const optionGroup = option as CartProductOptionGroupType;

                  optionGroup.items
                    .filter((option) => option.checked)
                    .forEach((option) => {
                      covertOrderForm(formatOrder.order_options ?? [], option);
                    });
                  return;
                }

                const optionItem = option as CartProductOptionType;

                // 옵션 상품일때
                const optionFormatType = {
                  good_code: optionItem.code,
                  good_qty: optionItem.quantity,
                } as OrderProductType;

                formatOrder.order_options?.push(optionFormatType);
              });

            orderList.push(formatOrder);
            return;
          }

          const productItem = product as productType;

          // 단순상품일때
          const optionFormatType = {
            good_code: productItem.productCode,
            good_qty: productItem.quantity,
          } as OrderProductType;

          formatOrder.order_options?.push(optionFormatType);
        });
    } else {
      const product = setProduct as productType;

      formatOrder.good_code = product.productCode;
      formatOrder.good_qty = product.quantity;
      formatOrder.order_options = [];
      product.product
        .filter((product) => product.checked)
        .forEach((product) => {
          // 상품그룹타입일때
          if (product.isProductExist && !product.isProduct) {
            const productGroup = product as CartProductOptionGroupType;

            productGroup.items
              .filter((product) => product.checked)
              .forEach((product) => {
                covertOrderForm(orderList ?? [], product);
              });
            return;
          }

          // 옵션상품타입일때
          if (product.isOptionExist && product.isProduct) {
            const optionProduct = product as productType;

            const formatOrder = {} as OrderProductType;

            formatOrder.good_code = optionProduct.productCode;
            formatOrder.good_qty = product.quantity;
            formatOrder.order_options = [];
            optionProduct.option
              .filter((option) => option.checked)
              .forEach((option) => {
                // 옵션그룹타입일때
                if (option.isOptionExist) {
                  const optionGroup = option as CartProductOptionGroupType;

                  optionGroup.items
                    .filter((option) => option.checked)
                    .forEach((option) => {
                      covertOrderForm(formatOrder.order_options ?? [], option);
                    });
                  return;
                }

                const optionItem = option as CartProductOptionType;

                // 옵션 상품일때
                const optionFormatType = {
                  good_code: optionItem.code,
                  good_qty: optionItem.quantity,
                } as OrderProductType;

                formatOrder.order_options?.push(optionFormatType);
              });

            orderList.push(formatOrder);
            return;
          }

          const productItem = product as productType;

          // 단순상품일때
          const optionFormatType = {
            good_code: productItem.productCode,
            good_qty: productItem.quantity,
          } as OrderProductType;

          formatOrder.order_options?.push(optionFormatType);
        });
    }

    if (cartItem.isOrder) {
      orderList.push(formatOrder);
    } else {
      const quantityFixOrderOptions = formatOrder.order_options.map(
        (option) => ({
          ...option,
          good_qty: option.good_qty * cartItem.quantity,
        }),
      );
      orderList.push(...quantityFixOrderOptions);
    }
  }

  // 옵션상품일 경우
  if (
    cartItem.isOrder &&
    cartItem.isProduct &&
    cartItem.isOptionExist &&
    !cartItem.isProductExist
  ) {
    const optionProduct = cartItem as cartProductType | productType;

    const formatOrder = {} as OrderProductType;

    if ('id' in optionProduct) {
      const cartProduct = optionProduct as cartProductType;

      formatOrder.good_code = cartProduct.id;
      formatOrder.good_qty = cartProduct.quantity;
      formatOrder.order_options = [];
      cartProduct.options
        .filter((option) => option.checked)
        .forEach((option) => {
          // 옵션그룹타입일때
          if (option.isOptionExist) {
            const optionGroup = option;

            optionGroup.items
              .filter((option) => option.checked)
              .forEach((option) => {
                covertOrderForm(formatOrder.order_options ?? [], option);
              });
            return;
          }

          const optionItem = option;

          // 옵션 상품일때
          const optionFormatType = {
            good_code: optionItem.code,
            good_qty: optionItem.quantity,
          } as OrderProductType;
          formatOrder.order_options?.push(optionFormatType);
        });
    } else {
      const product = optionProduct as productType;

      formatOrder.good_code = product.productCode;
      formatOrder.good_qty = product.quantity;
      formatOrder.order_options = [];
      product.option
        .filter((option) => option.checked)
        .forEach((option) => {
          // 옵션그룹타입일때
          if (option.isOptionExist) {
            const optionGroup = option as CartProductOptionGroupType;

            optionGroup.items
              .filter((option) => option.checked)
              .forEach((option) => {
                covertOrderForm(formatOrder.order_options ?? [], option);
              });
            return;
          }

          const optionItem = option as CartProductOptionType;

          // 옵션 상품일때
          const optionFormatType = {
            good_code: optionItem.code,
            good_qty: optionItem.quantity,
          } as OrderProductType;
          formatOrder.order_options?.push(optionFormatType);
        });
    }
    orderList.push(formatOrder);
  }

  // 그룹일 경우
  if (
    !cartItem.isOrder &&
    !cartItem.isProduct &&
    (cartItem.isOptionExist || cartItem.isProductExist)
  ) {
    const groupType = cartItem as CartProductOptionGroupType;
    groupType.items
      .filter((option) => option.checked)
      .forEach((option) => {
        // 상품그룹타입일때
        if (option.isProductExist && !option.isProduct) {
          const productGroup = option as CartProductOptionGroupType;

          productGroup.items
            .filter((product) => product.checked)
            .forEach((product) => {
              covertOrderForm(orderList ?? [], product);
            });
          return;
        }

        // 옵션그룹타입일때
        if (option.isOptionExist && !option.isProduct) {
          const optionGroup = option as CartProductOptionGroupType;

          optionGroup.items
            .filter((option) => option.checked)
            .forEach((option) => {
              covertOrderForm(orderList ?? [], option);
            });
          return;
        }

        // 옵션상품타입일때
        if (option.isOptionExist && option.isProduct) {
          const optionProduct = option as productType;

          const formatOrder = {} as OrderProductType;

          formatOrder.good_code = optionProduct.productCode;
          formatOrder.good_qty = optionProduct.quantity;
          formatOrder.order_options = [];
          optionProduct.option
            .filter((option) => option.checked)
            .forEach((option) => {
              // 옵션그룹타입일때
              if (option.isOptionExist && !option.isProduct) {
                const optionGroup = option as CartProductOptionGroupType;

                optionGroup.items
                  .filter((option) => option.checked)
                  .forEach((option) => {
                    covertOrderForm(formatOrder.order_options ?? [], option);
                  });
                return;
              }

              const optionItem = option as CartProductOptionType;

              // 옵션 상품일때
              const optionFormatType = {
                good_code: optionItem.code,
                good_qty: optionItem.quantity,
              } as OrderProductType;

              formatOrder.order_options?.push(optionFormatType);
            });

          orderList.push(formatOrder);
          return;
        }

        if (option.isProduct) {
          const productItem = option as productType;

          const formatOrder = {} as OrderProductType;

          formatOrder.good_code = productItem.productCode;
          formatOrder.good_qty = productItem.quantity;

          orderList.push(formatOrder);
          return;
        }

        const optionItem = option as CartProductOptionType;

        // 옵션 상품일때
        const optionFormatType = {
          good_code: optionItem.code,
          good_qty: optionItem.quantity,
        } as OrderProductType;

        orderList.push(optionFormatType);
      });
  }
};

export const makeOrderForm = (
  orderLists: cartProductType[],
  storeInfo: StoreInfoType,
  type: typeof LEGACY | typeof NEXT,
  duplicateCartCode: string,
) => {
  // 상점 정보를 가져오지 못할시 return 처리
  if (!storeInfo || !storeInfo.storeCode || !storeInfo.tableNumber)
    return false;

  const { storeCode, tableNumber } = storeInfo;

  if (type === NEXT) {
    const convertedOrderList = [] as OrderProductType[];

    // 단순상품, 옵션상품, 세트상품, 옵션그룹 분기처리
    orderLists?.forEach((product) => {
      covertOrderForm(convertedOrderList, product);
    });

    const orderData = {
      storeCode,
      tabletId: tableNumber,
      order: convertedOrderList,
    };

    return orderData;
  }

  // 선택 안함 제거
  orderLists.forEach((item) => {
    const optionList = item.options;
    optionList.forEach((group) => {
      const itemList = group.items;
      group.items = itemList.filter((item) => item.code !== 'not_select');
    });
  });

  // legacy
  const formData = new FormData();
  formData.append('store_shop_code', storeCode);
  formData.append('tablet_number', tableNumber);

  orderLists?.forEach((product, index) => {
    const codeKey = `orders[${index}][code]`;
    const quantityKey = `orders[${index}][qty]`;
    const codeValue = generateProductCode(product);
    const quantityValue = String(product.quantity);
    formData.append(codeKey, codeValue);
    formData.append(quantityKey, quantityValue);
  });

  if (duplicateCartCode) {
    formData.append('duplicate_cart_code', duplicateCartCode);
  }

  return formData;
};

export const makeStaffCallForm = (
  orderLists: StaffCallItemType[],
  storeInfo: StoreInfoType,
  type: typeof LEGACY | typeof NEXT,
) => {
  if (!storeInfo || !storeInfo.storeCode || !storeInfo.tableNumber)
    return false;

  const { storeCode, tableNumber } = storeInfo;

  if (type === NEXT) {
    const convertedOrderList = [] as OrderProductType[];

    const convertOrders = (product: StaffCallItemType) => {
      const formatOrder = {
        good_code: product.productCode,
        good_qty: product.count,
      } as OrderProductType;

      convertedOrderList.push(formatOrder);
    };

    orderLists?.forEach(convertOrders);

    const orderData = {
      storeCode,
      tabletId: tableNumber,
      order: convertedOrderList,
    };

    return orderData;
  }

  // legacy
  const formData = new FormData();

  formData.append('store_shop_code', storeCode);
  formData.append('tablet_number', tableNumber);

  orderLists?.forEach((product, index) => {
    const codeKey = `orders[${index}][code]`;
    const quantityKey = `orders[${index}][qty]`;
    const codeValue = product.productCode;
    const quantityValue = String(product.count);
    formData.append(codeKey, codeValue);
    formData.append(quantityKey, quantityValue);
  });

  return formData;
};
