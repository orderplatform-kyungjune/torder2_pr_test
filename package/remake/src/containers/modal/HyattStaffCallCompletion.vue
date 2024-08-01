<!-- <template>
  <Teleport
    v-if="flag.staffCallCompletion"
    to="#modal"
  >
    <div class="staff-call-container">
      <div class="staff-call-wrapper">
        <div class="staff-call-title">
          <span v-if="haveSelectedServiceItems">
            {{ t('티오더로 선택하신 항목을 요청했습니다.') }}
          </span>
          <span v-else>
            {{ t('티오더로 직원을 호출했습니다.') }}
          </span>
        </div>
        <div class="staff-call-button-wrap">
          <div
            class="yes-button"
            @click="closeModal(STAFF_CALL_COMPLETION)"
          >
            {{ t('확인') }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { STAFF_CALL_COMPLETION } from '@torder/common/constant';
import useStaffCallItems from '@store/storeStaffCallItems';
import useModalStore from '@store/storeModal';
import useInitStore from '@store/storeInit';

const { t } = useI18n();

const {
  buttonBackgroundColor,
  buttonFontColor,
} = storeToRefs(useInitStore());

const {
  flag,
  closeModal,
} = useModalStore();

const { haveSelectedServiceItems } = storeToRefs(useStaffCallItems());
</script>

<style lang='scss' scoped>
.staff-call-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: "Noto Sans SC", sans-serif;
  background-color: rgba(0, 0, 0, 0.83);

  .staff-call-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .staff-call-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3.125vw;
      font-size: 4vw;
      font-weight: 400;
      color: #fff;
    }

    .staff-call-button-wrap {
      display: flex;
      gap: 2vw;
      align-items: center;
      justify-content: center;
      width: 46.875vw;
      font-weight: 900;
      opacity: 1;

      .yes-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 19.5313vw;
        height: 7vw;
        font-size: 2.7344vw;
        font-weight: 700;
        color: v-bind(buttonFontColor);
        background-color: v-bind(buttonBackgroundColor);
        border-radius: 0.7813vw;
      }
    }
  }
}
</style> -->
