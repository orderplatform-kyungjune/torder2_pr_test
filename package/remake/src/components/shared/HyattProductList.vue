<template>
  <div class="product-main-category-observe">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>
.product-main-category-observe {
  display: flex;
  flex-direction: column;

  &:last-child {
    padding-bottom: 31.25vw;
  }
}
</style>
