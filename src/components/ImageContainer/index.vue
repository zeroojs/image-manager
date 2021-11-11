<template>
  <!-- 图片分组容器 -->
  <div class="image-container" :class="{ 'is-selected': selected }">
    <!-- 操作组 actions:图片组|单图片可自定义 -->
    <div class="action-group">
      <div
        v-if="layout.includes('select')"
        class="action-item flex center middle action-select"
        :class="{ 'is-selected': selected }"
        @click.stop="select()"
      >
        <i v-if="selected" class="iconfont icon-check"></i>
        <span v-else class="action-select-box"></span>
      </div>
      <div
        v-if="layout.includes('edit')"
        class="action-item flex center middle"
        @click.stop="$emit('edit')"
      >
        <i class="iconfont icon-edit"></i>
      </div>
      <div
        v-if="layout.includes('copy')"
        class="action-item flex center middle"
        @click.stop="(e) => $emit('copy', e)"
      >
          <i class="iconfont icon-copy"></i>
        </div>
      <div
        v-if="layout.includes('del')"
        class="action-item flex center middle"
        @click.stop="$emit('del')"
      >
        <i class="iconfont icon-del"></i>
      </div>
    </div>
    <div class="img-body" :class="{ 'is-vertical': isVertical }">
      <img v-if="src" :src="src" alt="">
      <div v-else class="no-src">{{ name }}</div>
    </div>
    <div v-if="layout.includes('name')" class="image-container-footer flex between bottom">
      {{ name }}
      <span class="image-count">{{ count }} 张图片</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'

export default defineComponent({
  props: {
    layout: {
      type: Array as PropType<string[]>,
      default: () => ['select', 'edit', 'copy', 'del', 'name']
    },
    name: String,
    count: {
      type: Number,
      default: 0
    },
    src: String,
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  emits: ['select', 'edit', 'copy', 'del'],
  setup(props, { emit }) {
    const selected = ref(false)
    const isVertical = computed(() => props.width < props.height) // 根据图片宽高确定布局

    const select = () => {
      selected.value = !selected.value
      emit('select', selected.value)
    }
    return {
      select,
      selected,
      isVertical
    }
  }
})
</script>

<style lang="less" scoped>
.image-container {
  height: 273px;
  max-width: 285px;
  width: 100%;
  background-color: fade(#ccc, 10);
  position: relative;
  z-index: 1;
  box-shadow: 0 0 15px fade(#ccc, 50);
  transition: .3s ease;
  &:hover {
    .action-item {
      transform: translateX(0);
    }
  }
  &.is-selected {
    box-shadow: 0 0 15px fade(#409EFF, 40);
  }
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .img-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    &.is-vertical {
      img {
        height: 100%;
        width: auto;
      }
    }
  }
  .no-src {
    width: 100%;
    font-size: 24px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
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
    
    .Loop(@index) when(@index <= 4) {
      &:nth-child(@{index}) {
        transition-duration: (@index + 2) * 0.1s;
      }
      .Loop(@index + 1)
    }
    .Loop(0);
    & ~ .action-item {
      margin-top: 10px;
    }
    &:hover {
      background-color: fade(#ccc, 70);
    }
    .iconfont {
      font-size: 24px;
      color: var(--white);
      transition: .3s ease;
    }
    .icon-del {
      color: var(--red);
    }
  }
  // 选择框
  .action-select {
    .action-select-box {
      width: 22px;
      height: 22px;
      display: inline-block;
      border: 2px solid var(--white);
      border-radius: 2px;
    }
    &.is-selected {
      transform: translateX(0)
    }
  }

  // 底部
  .image-container-footer {
    width: 100%;
    color: var(--white);
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: fade(#ccc, 50);
    min-height: 40px;
    padding: 10px;
    line-height: 1.5em;
    .image-count {
      margin-left: 10px;
      display: inline-block;
      white-space: nowrap;
    }
  }
}
</style>
