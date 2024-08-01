<template>
  <div class="store-table-info-container">
    <div class="store-table-info-wrap">
      <div class="table-info-wrap">
        <div class="title">
          {{ title }}
        </div>
        <div class="table-name-wrap">
          <span
            class="table-name"
            :class="{ newline: getInitTableName()?.length > 4 }"
          >
            {{ tableName }}
          </span>
        </div>
      </div>
      <div
        class="store-name ellipsis-text-1"
        :class="{ white: cartActive || themeColor === WHITE, black: cartActive && themeColor === BLACK }"
      >
        {{ storeName }}
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getInitTableName } from '@torder/common/utils';
import {
  WHITE,
  BLACK,
} from '@torder/common/constant';

defineProps<{
  title: string,
  tableName: string,
  storeName: string,
  themeColor: string,
  cartActive?: boolean,
}>();
</script>

<style lang='scss' scoped>
.store-table-info-container {
  display: flex;
  justify-content: flex-end;
  font-family: 'Pretendard', sans-serif;
  word-break: break-all;

  .store-table-info-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.3125vw;
    align-items: center;

    .table-info-wrap {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.625vw;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.625vw 0.625vw 0.9375vw 0.625vw;
      color: #fff;
      background-color: #F91515;
      border-radius: 0 0 0.9375vw 0.9375vw;
      box-shadow: 0 0.1563vw 0.3125vw 0 rgba(0, 0, 0, 0.25), 0 -0.1172vw 0.0781vw 0 rgba(0, 0, 0, 0.25) inset;

      .title {
        font-size: 1.0938vw;
        font-weight: 500;
        line-height: 1.7188vw;
        color: #fff;
        text-align: center;
        letter-spacing: -0.0219vw;
      }

      .table-name-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 11.25vw;
        min-height: 2.9688vw;

        .table-name {
          font-size: 3.125vw;
          font-weight: 700;
          line-height: 2.9688vw;
          text-align: center;
          letter-spacing: -0.0625vw;

          &.newline {
            display: -webkit-box;
            overflow: hidden;
            font-size: 1.4063vw;
            font-weight: 900;
            line-height: normal;
            text-overflow: ellipsis;
            letter-spacing: -0.0281vw;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
    }

    .store-name {
      width: 12.5vw;
      font-size: 1.0938vw;
      font-style: normal;
      font-weight: 500;
      line-height: 1.7188vw;
      color: #FFF;
      text-align: center;
      text-shadow: 0 0 0.3125vw rgba(0, 0, 0, 0.5);
      letter-spacing: -0.0219vw;

      &.black {
        color: #fff;
      }

      &.white {
        color: #5B5B5B;
      }
    }
  }
}
</style>
