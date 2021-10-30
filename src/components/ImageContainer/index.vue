<template>
  <!-- 图片分组容器 -->
  <div class="image-container">
    <!-- 操作组 actions:图片组|单图片可自定义 -->
    <slot name="actions">
      <div class="action-group">
        <div class="action-item flex center middle">
          <i class="iconfont icon-edit"></i>
        </div>
        <div class="action-item flex center middle">
          <i class="iconfont icon-copy"></i>
        </div>
        <div class="action-item flex center middle">
          <i class="iconfont icon-del"></i>
        </div>
      </div>
    </slot>
    <div class="img-body">
      <img src="../../assets/demo.jpeg" alt="">
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
.image-container {
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
  img {
    display: block;
    width: 100%;
  }
  .img-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
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
    &:hover {
      background-color: fade(#ccc, 70);
      .iconfont {
        font-size: 22px;
      }
    }
    .iconfont {
      font-size: 24px;
      color: var(--text-color);
      transition: .3s ease;
    }
    .icon-del {
      color: var(--red);
    }
  }
}
</style>
