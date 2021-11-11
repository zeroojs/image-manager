<template>
  <div 
    class="dialog" 
    :class="{ 'is-show': visible }"
    :style="display ? 'display: none' : ''"
  >

    <!-- 不透明遮罩 -->
    <div class="dialog-modal" @click.self="closeDialog"></div>

    <!-- 主体 -->
    <div class="dialog-main">

      <div class="dialog-head">
        <button class="button icon-botton" @click="closeDialog">x</button>
      </div>
      
      <!-- 内容区 -->
      <div class="dialog-body">
        <slot></slot>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, watch } from 'vue'
export default defineComponent({
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const visible = ref(props.modelValue)
    const display = ref(true)
    let timer: NodeJS.Timer

    // 关闭弹窗
    const closeDialog = () => {
      clearTimeout(timer)
      visible.value = false
      timer = setTimeout(() => {
        display.value = false
        clearTimeout(timer)
      }, 300)
    }

    watch(() => props.modelValue, (currentValue) => {
      if (currentValue) {
        clearTimeout(timer)
        display.value = false
        timer = setTimeout(() => {
          visible.value = currentValue
          clearTimeout(timer)
        }, 20)
      } else {
        closeDialog()
      }
    })

    watch(() => visible.value, (currentValue) => {
      if (!currentValue) {
        ctx.emit('update:modelValue', currentValue)
      }
    })

    onBeforeUnmount(() => {
      clearTimeout(timer)
    })
    return {
      visible,
      display,
      closeDialog
    }
  }
})
</script>

<style lang="less" scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
  &.is-show {
    visibility: visible;
    opacity: 1;
    .dialog-main {
      transform: translateY(0);
    }
  }
  .dialog-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .dialog-main {
    transition: 0.3s;
    min-width: 450px;
    min-height: 100px;
    background-color: #fff;
    position: relative;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
    transform: translateY(10%);
  }
  .dialog-head {
    text-align: right;
  }
  .dialog-body {
    text-align: center;
  }
  .button {
    color: var(--primary-color);
    padding: 10px 15px;
    border-radius: 6px;
    outline: none;
    border: unset;
    cursor: pointer;
    background-color: initial;
    font-size: 20px;
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
@media screen and (max-width: 768px) {
  .dialog {
    flex-direction: column;
    justify-content: flex-end;
    .dialog-main {
      min-width: unset;
      width: 100%;
      border-radius: 20px 20px 0 0;
    }
  }
}
</style>