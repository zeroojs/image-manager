<template>
  <!-- 图片分组容器 -->
  <div class="image-group">
    <!-- 操作组 -->
    <div class="action-group">
      <div class="action-item"></div>
      <div class="action-item"></div>
      <div class="action-item"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
    }
  }
})
</script>

<style lang="less" scoped>
.image-group {
  min-height: 273px;
  max-width: 285px;
  width: 100%;
  background-color: fade(#ccc, 10);
  position: relative;
  z-index: 1;
  box-shadow: 5px 5px 15px fade(#ccc, 50);
  &:hover {
    .action-item {
      transform: translateX(0);
    }
  }
  .action-group {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    overflow: hidden;
  }
  .action-item {
    width: 40px;
    height: 40px;
    background-color: fade(#ccc, 50);
    cursor: pointer;
    transition: .3s ease;
    transform: translateX(100%);
    &:nth-child(2) {
      transition-duration: .5s;
    }
    &:nth-child(3) {
      transition-duration: .6s;
    }
    & ~ .action-item {
      margin-top: 10px;
    }
  }
}
</style>
