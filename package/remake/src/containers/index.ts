// index.ts에는 2개 이상의 항목이 있어야 에러x
// 한 개일 경우 index.ts를 통하지 않고 직접 import해서 사용하거나 임시로 2개 항목 사용

// 공통
export { default as SelectLanguage } from './shared/SelectLanguage.vue';
export { default as LayoutMoreList } from './shared/LayoutMoreList.vue';
export { default as LayoutFloatingList } from './shared/LayoutFloatingList.vue';

// 상품
export { default as ProductContainer } from './product/ProductContainer.vue';
export { default as HyattProductContainer } from './product/HyattProductContainer.vue';
export { default as BasicDefaultOptionLayout } from './product/BasicDefaultOptionLayout.vue';
export { default as BasicImageOptionLayout } from './product/BasicImageOptionLayout.vue';
export { default as BasicTextOptionLayout } from './product/BasicTextOptionLayout.vue';

// 직원 호출
export { default as StaffCallItemSelect } from './staffCall/StaffCallItemSelect.vue';
export { default as StaffCallSelectedItemList } from './staffCall/StaffCallSelectedItemList.vue';

export { default as HyattStaffCallSelectedItemList } from './staffCall/HyattStaffCallSelectedItemList.vue';

// 카테고리
export { default as BasicCategoryFirstList } from './category/BasicCategoryFirstList.vue';
export { default as BasicCategorySubList } from './category/BasicCategorySubList.vue';

export { default as RestaurantCategoryFirstList } from './category/RestaurantCategoryFirstList.vue';
export { default as RestaurantCategorySubList } from './category/RestaurantCategorySubList.vue';

export { default as HyattCategoryFirstList } from './category/HyattCategoryFirstList.vue';
export { default as HyattCategorySubList } from './category/HyattCategorySubList.vue';

// 모달
export { default as FlashModal } from './modal/FlashModal.vue';
export { default as ModalSelectTheme } from './modal/ModalSelectTheme.vue';
export { default as ModalSelectLanguage } from './modal/ModalSelectLanguage.vue';
export { default as CustomModalSelectLanguage } from './modal/CustomModalSelectLanguage.vue';
export { default as PickUpItemModal } from './modal/PickUpItemModal.vue';
export { default as CustomVisitPeople } from './modal/CustomVisitPeople.vue';
export { default as PaymentRefundAlarmModal } from './modal/PaymentRefundAlarmModal.vue';
export { default as ConfirmAlertModal } from './modal/ConfirmAlertModal.vue';
export { default as CustomConfirmModal } from './modal/CustomConfirmModal.vue';
export { default as BasicConfirmModal } from './modal/BasicConfirmModal.vue';
export { default as TimerMessageModal } from './modal/TimerMessageModal.vue';
export { default as CallRobotConfirm } from './modal/CallRobotConfirm.vue';

// 장바구니
export { default as CartContainer } from './cart/CartContainer.vue';
export { default as HyattCartContainer } from './cart/HyattCartContainer.vue';

export { default as HyattCartModalListOptionList } from './cart/HyattCartModalListOptionList.vue';

// 사이드메뉴
export { default as RestaurantToolBox } from './sideMenu/RestaurantToolBox.vue';
export { default as RestaurantToolBoxSimple } from './sideMenu/RestaurantToolBoxSimple.vue';
export { default as RestaurantVerticalScreenMenuBar } from './sideMenu/RestaurantVerticalScreenMenuBar.vue';

export { default as HyattBottomBar } from './sideMenu/HyattBottomBar.vue';

// 시크릿메뉴
export { default as TableTagToSecret } from './secret/TableTagToSecret.vue';

// 주문내역
export { default as RestaurantVerticalScreenOrderHistoryList } from './orderHistory/RestaurantVerticalScreenOrderHistoryList.vue';

// 계산서
export { default as RestaurantVerticalScreenBillList } from './bill/RestaurantVerticalScreenBillList.vue';

// 사용안함 추후 제거
// export { default as HyattTableTagToSecret } from './secret/HyattTableTagToSecret.vue';
// export { default as HyattCartConfirmModalListOptionItem } from './cart/HyattCartConfirmModalListOptionItem.vue';
// export { default as HyattSelectLanguage } from './bottomBar/HyattSelectLanguage.vue';
// export { default as HyattProductOptionGroupList } from './product/HyattProductOptionGroupList.vue';
// export { default as HyattStaffCallCompletion } from './modal/HyattStaffCallCompletion.vue';
