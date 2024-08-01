// index.ts에는 2개 이상의 항목이 있어야 에러x
// 한 개일 경우 index.ts를 통하지 않고 직접 import해서 사용하거나 임시로 2개 항목 사용

// 공통
export { default as LoginInput } from './shared/LoginInput.vue';
export { default as LoginButton } from './shared/LoginButton.vue';
export { default as LoginNumberButton } from './shared/LoginNumberButton.vue';

export { default as HyattButton } from './shared/HyattButton.vue';
export { default as HyattCloseButton } from './shared/HyattCloseButton.vue';
export { default as HyattNumberButton } from './shared/HyattNumberButton.vue';
export { default as StaffCallItem } from './shared/StaffCallItem.vue';
export { default as ItemCount } from './shared/ItemCount.vue';

export { default as DevTool } from './shared/DevTool.vue';
export { default as LogoWhite } from './shared/LogoWhite.vue';
export { default as CloseButton } from './shared/CloseButton.vue';

// 공통 - 메뉴 설명
export { default as ViewOrderHead } from './shared/ViewOrderHead.vue';
export { default as ProductDetailBody } from './shared/ProductDetailBody.vue';
export { default as ProductDetailHeader } from './shared/ProductDetailHeader.vue';

// 공통 - 계산서
export { default as BillListItem } from './shared/BillListItem.vue';
export { default as BillTotalSum } from './shared/BillTotalSum.vue';
export { default as BillDutchPayPrice } from './shared/BillDutchPayPrice.vue';

// 공통 - 모달
export { default as ModalHead } from './shared/ModalHead.vue';

// 공통 - 기본 장바구니 모달
export { default as CartModal } from './shared/CartModal.vue';
export { default as CartModalListItem } from './shared/CartModalListItem.vue';
export { default as CartModalListOptionItem } from './shared/CartModalListOptionItem.vue';

// 공통 - 장바구니 모달
export { default as CartConfirmModal } from './shared/CartConfirmModal.vue';
export { default as CartConfirmModalListItem } from './shared/CartConfirmModalListItem.vue';
export { default as CartConfirmModalListOptionItem } from './shared/CartConfirmModalListOptionItem.vue';

// 공통 - 상품 옵션 선택
export { default as ProductOptionBody } from './shared/ProductOptionBody.vue';
export { default as ProductOptionHeader } from './shared/ProductOptionHeader.vue';
export { default as ProductOptionGroupList } from './shared/ProductOptionGroupList.vue';
export { default as ProductOptionSelectList } from './shared/ProductOptionSelectList.vue';
export { default as ProductOptionSelectedList } from './shared/ProductOptionSelectedList.vue';

// 공통 - 레스토랑 테마
export { default as RestaurantLayoutStoreInfo } from './shared/RestaurantLayoutStoreInfo.vue';
export { default as RestaurantStoreInfo } from './shared/RestaurantStoreInfo.vue';
export { default as RestaurantProductList } from './shared/RestaurantProductList.vue';
export { default as RestaurantProductItem } from './shared/RestaurantProductItem.vue';
export { default as RestaurantProductChildList } from './shared/RestaurantProductChildList.vue';
export { default as RestaurantProductOptionBody } from './shared/RestaurantProductOptionBody.vue';
export { default as RestaurantProductOptionGroupList } from './shared/RestaurantProductOptionGroupList.vue';
export { default as RestaurantProductOptionSelectList } from './shared/RestaurantProductOptionSelectList.vue';
export { default as RestaurantProductOptionSelectedList } from './shared/RestaurantProductOptionSelectedList.vue';

// 공통 - 하얏트 테마
export { default as HyattProductList } from './shared/HyattProductList.vue';
export { default as HyattProductItem } from './shared/HyattProductItem.vue';
export { default as HyattProductChildList } from './shared/HyattProductChildList.vue';

export { default as HyattCartModal } from './shared/HyattCartModal.vue';
export { default as HyattCartModalListItem } from './shared/HyattCartModalListItem.vue';

export { default as HyattCartConfirmModal } from './shared/HyattCartConfirmModal.vue';

export { default as HyattStaffCallSelectedItem } from './shared/HyattStaffCallSelectedItem.vue';
export { default as HyattStaffCallItem } from './shared/HyattStaffCallItem.vue';

export { default as CustomHyattCartConfirmModal } from './shared/CustomHyattCartConfirmModal.vue';

// 기존 테마 공통
export { default as BasicLayoutEventButton } from './shared/BasicLayoutEventButton.vue';
export { default as BasicLayoutPersonButton } from './shared/BasicLayoutPersonButton.vue';
export { default as BasicLayoutMoreListItem } from './shared/BasicLayoutMoreListItem.vue';
export { default as BasicLayoutStoreTableInfo } from './shared/BasicLayoutStoreTableInfo.vue';

// 상품
export { default as RestaurantVerticalScreenProductDetailQuantity } from './product/RestaurantVerticalScreenProductDetailQuantity.vue';
export { default as RestaurantVerticalScreenProductDetailHeader } from './product/RestaurantVerticalScreenProductDetailHeader.vue';
export { default as RestaurantVerticalScreenProductDetailDescription } from './product/RestaurantVerticalScreenProductDetailDescription.vue';
export { default as RestaurantVerticalScreenProductDetailButton } from './product/RestaurantVerticalScreenProductDetailButton.vue';
export { default as RestaurantVerticalScreenProductOptionGroup } from './product/RestaurantVerticalScreenProductOptionGroup.vue';
export { default as RestaurantVerticalScreenProductOptionItem } from './product/RestaurantVerticalScreenProductOptionItem.vue';

export { default as BasicVerticalScrollProductList } from './product/BasicVerticalScrollProductList.vue';
export { default as BasicVerticalScrollProductChildList } from './product/BasicVerticalScrollProductChildList.vue';
export { default as BasicVerticalScrollProductItem } from './product/BasicVerticalScrollProductItem.vue';

export { default as BasicHorizontalScrollProductList } from './product/BasicHorizontalScrollProductList.vue';
export { default as BasicHorizontalScrollProductChildList } from './product/BasicHorizontalScrollProductChildList.vue';
export { default as BasicHorizontalScrollProductItem } from './product/BasicHorizontalScrollProductItem.vue';

// 직원 호출
export { default as RestaurantVerticalScreenStaffCallItemList } from './staffCall/RestaurantVerticalScreenStaffCallItemList.vue';

// 카테고리
export { default as HyattCategoryFirstListItem } from './category/HyattCategoryFirstListItem.vue';
export { default as HyattCategorySubListItem } from './category/HyattCategorySubListItem.vue';

export { default as RestaurantHorizontalScreenCategoryFirstListItem } from './category/RestaurantHorizontalScreenCategoryFirstListItem.vue';
export { default as RestaurantHorizontalScreenActiveCategoryFirstListItem } from './category/RestaurantHorizontalScreenActiveCategoryFirstListItem.vue';
export { default as RestaurantHorizontalScreenCategorySubListItem } from './category/RestaurantHorizontalScreenCategorySubListItem.vue';

export { default as RestaurantVerticalScreenCategoryFirstListItem } from './category/RestaurantVerticalScreenCategoryFirstListItem.vue';
export { default as RestaurantVerticalScreenCategorySubListItem } from './category/RestaurantVerticalScreenCategorySubListItem.vue';

export { default as BasicHorizontalScrollCategoryFirstListItem } from './category/BasicHorizontalScrollCategoryFirstListItem.vue';
export { default as BasicHorizontalScrollCategorySubListItem } from './category/BasicHorizontalScrollCategorySubListItem.vue';

export { default as BasicVerticalScrollCategoryFirstListItem } from './category/BasicVerticalScrollCategoryFirstListItem.vue';
export { default as BasicVerticalScrollCategorySubListItem } from './category/BasicVerticalScrollCategorySubListItem.vue';

// 장바구니 모달
export { default as RestaurantVerticalScreenCartModal } from './cartModal/RestaurantVerticalScreenCartModal.vue';
export { default as RestaurantVerticalScreenCartModalItem } from './cartModal/RestaurantVerticalScreenCartModalItem.vue';
export { default as RestaurantVerticalScreenCartModalOptionItem } from './cartModal/RestaurantVerticalScreenCartModalOptionItem.vue';
export { default as HyattCartModalProductBasicInformation } from './cartModal/HyattCartModalProductBasicInformation.vue';

// 테이블
export { default as CustomTableTag } from './table/CustomTableTag.vue';
export { default as HyattTableTag } from './table/HyattTableTag.vue';

export { default as RestaurantHorizontalScreenTableTag } from './table/RestaurantHorizontalScreenTableTag.vue';
export { default as RestaurantHorizontalScreenTablePeopleCount } from './table/RestaurantHorizontalScreenTablePeopleCount.vue';
export { default as RestaurantHorizontalScreenTableButton } from './table/RestaurantHorizontalScreenTableButton.vue';

export { default as RestaurantVerticalScreenTableInfo } from './table/RestaurantVerticalScreenTableInfo.vue';

// 아이콘 카드
export { default as RestaurantVerticalScreenIconCard } from './iconCard/RestaurantVerticalScreenIconCard.vue';

// 주문내역
export { default as RestaurantVerticalScreenOrderHistoryItem } from './orderHistory/RestaurantVerticalScreenOrderHistoryItem.vue';
export { default as RestaurantVerticalScreenOrderHistoryListHead } from './orderHistory/RestaurantVerticalScreenOrderHistoryListHead.vue';
export { default as RestaurantVerticalScreenOrderHistoryOptionItem } from './orderHistory/RestaurantVerticalScreenOrderHistoryOptionItem.vue';

export { default as RestaurantHorizontalScreenMenuButtonBox } from './buttons/RestaurantHorizontalScreenMenuButtonBox.vue';
export { default as RestaurantVerticalScreenPlusMinusControl } from './buttons/RestaurantVerticalScreenPlusMinusControl.vue';

export { default as HyattBottomBarButton } from './buttons/HyattBottomBarButton.vue';

// 계산서
export { default as RestaurantVerticalScreenBillItem } from './bill/RestaurantVerticalScreenBillItem.vue';
export { default as RestaurantVerticalScreenBillOptionItem } from './bill/RestaurantVerticalScreenBillOptionItem.vue';

// 헤더
export { default as RestaurantVerticalScreenStickyHeader } from './header/RestaurantVerticalScreenStickyHeader.vue';

// 사용 안함 추후 제거
// export { default as HyattBillTotalSum } from './shared/HyattBillTotalSum.vue';
// export { default as HyattProductDetailHeader } from './shared/HyattProductDetailHeader.vue';
// export { default as HyattProductDetailBody } from './shared/HyattProductDetailBody.vue';
// export { default as HyattMenuButtonBox } from './buttons/HyattMenuButtonBox.vue';
// export { default as BasicVerticalScrollLayoutPersonButton } from './buttons/BasicVerticalScrollLayoutPersonButton.vue';
// export { default as HyattTablePeopleCount } from './table/HyattTablePeopleCount.vue';
// export { default as HyattTableButton } from './table/HyattTableButton.vue';
// export { default as ScrollDownAnimationGuide } from './cartModal/ScrollDownAnimationGuide.vue';
// export { default as HyattLayoutStoreTableInfo } from './shared/HyattLayoutStoreTableInfo.vue';
// export { default as HyattCartConfirmModalListItem } from './shared/HyattCartConfirmModalListItem.vue';
// export { default as HyattBillDutchPayPrice } from './shared/HyattBillDutchPayPrice.vue';
// export { default as HyattBillListItem } from './shared/HyattBillListItem.vue';
// export { default as HyattProductOptionBody } from './shared/HyattProductOptionBody.vue';
// export { default as HyattProductOptionSelectList } from './shared/HyattProductOptionSelectList.vue';
// export { default as HyattProductOptionSelectedList } from './shared/HyattProductOptionSelectedList.vue';
// export { default as HyattSetProductOptionSelectedList } from './shared/HyattSetProductOptionSelectedList.vue';
// export { default as HyattStoreInfo } from './shared/HyattStoreInfo.vue';
