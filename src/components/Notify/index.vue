<template>
  <div ref="self" class="notify" :class="isCreated ? 'is-show' : 'is-hide'">
    <h4 class="notify-title flex between">
      {{ title }}
      <a href="" @click.prevent="handleClose" class="notify-close-btn">
        <i class="iconfont icon-close"></i>
      </a>
    </h4>
    <slot>{{ message }}</slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '提示'
    },
    message: String,
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup(props) {
    const isCreated = ref(false)
    const self = ref()
    // const height = ref(0)
    let globalTimer: NodeJS.Timeout

    const handleClose = () => {
      isCreated.value = false
      if (!self.value) return
      const timer = setTimeout(() => {
        self.value.parentNode.remove()
        clearTimeout(timer)
      }, 300)
    }

    onMounted(() => {
      isCreated.value = true
      globalTimer = setTimeout(() => {
        handleClose()
        clearTimeout(globalTimer)
      }, props.duration)
    })

    onBeforeUnmount(() => clearTimeout(globalTimer))
    return {
      self,
      isCreated,
      handleClose
    }
  }
})
</script>

<style lang="less" scoped>
.notify {
  width: 200px;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  min-height: 60px;
  padding: 10px;
  box-shadow: 0 0 15px fade(#000, 10);
  position: fixed;
  z-index: 999;
  right: 10px;
  top: 30px;
  opacity: 0;
  transform: translateX(100%) translateY(0);
  background-color: var(--white);
  transition: all .3s ease;
  &.is-show {
    animation: slidIn .3s ease forwards;
  }
  &.is-hide {
    animation: slidOut .3s ease forwards;
  }
  .notify-title {
    margin-bottom: 10px;
  }
  .notify-close-btn {
    text-decoration: none;
    cursor: pointer;
  }
  .icon-close {
    font-size: 12px;
  }
}

// 进入动画
@keyframes slidIn {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slidOut {
  0% {
    opacity: 1;
    transform: translateX(0)
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
