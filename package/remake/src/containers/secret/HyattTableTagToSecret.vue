<!-- <template>
  <div
    class="table-tag-wrap"
    @click="onNextSecret"
  >
    <HyattTableTag
      :tableNO="getInitTableName()"
      :customTableBackgroundColor="tableNumBackgroundColor"
      :customTableFontColor="tableNumFontColor"
      :tabletLogoImage="tabletLogoImage"
    />
  </div>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { getInitTableName } from '@torder/common/utils';
import useInitStore from '@store/storeInit';
import { useSecret } from '@composables/secret';
import { HyattTableTag } from '@components';

defineProps<{
  tabletLogoImage: string,
}>();

const { onNextSecret } = useSecret();

// 커스텀 디자인
const {
  tableNumBackgroundColor,
  tableNumFontColor,
} = storeToRefs(useInitStore());
</script> -->
