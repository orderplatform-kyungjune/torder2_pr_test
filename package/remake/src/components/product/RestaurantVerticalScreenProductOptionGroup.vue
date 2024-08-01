<template>
  <div class="product-option-group-wrap">
    <div class="option-group-title">
      <div class="require">
        {{ optionName }}
        /
        {{ isRequireOption ? t('필수옵션') : t('선택옵션') }}
      </div>
      <div
        v-if="limitSelect !== 0"
        class="comment"
      >
        *{{ getLimitSelectString(limitSelect) }}
      </div>
      <div
        v-else
        class="comment"
      >
        *{{ t('갯수 제한이 없습니다.') }}
      </div>
    </div>
    <slot/>
  </div>
</template>

<script setup lang='ts'>
defineProps<{
  optionName: string,
  isRequireOption: boolean,
  limitSelect: number,
  getLimitSelectString: (count: number) => string,
  t: (str: string) => string,
}>();
</script>

<style scoped lang='scss'>
.product-option-group-wrap {
  display: flex;
  flex-direction: column;
  gap: 2vw;
  margin-bottom: 3vw;

  .option-group-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.3vw;

    .require {
      font-family: 'Noto Serif KR', serif;
      font-size: 2.0313vw;
      font-weight: bold;
    }

    .comment {
      font-family: 'Pretendard',serif;
      font-size: 1.7969vw;
      color: #999;
    }
  }
}
</style>
