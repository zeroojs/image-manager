<template>
  <!-- 
    上传对话框
    1. 点击上传
    2. 拖拽上传
   -->
  <div class="upload-dialog" :class="{ 'is-show': visible }">
    <!-- 遮罩 -->
    <div class="upload-dialog-mask" @click.self="handleClose()"></div>
    <div class="upload-dialog__container">
      <div class="upload-dialog__header flex end">
        <span class="close-button" @click="handleClose()">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div class="upload-dialog__body">
        <img src="../../assets/upload.svg" class="upload-icon" alt="">
        <h1>拖放或粘贴图像在这里上传</h1>
        <b>你也可以浏览您的计算机</b>
        <p>格式：JPG | PNG | GIF | SVG | SVGA 大小：不超过10 MB</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppContext, defineComponent, ref, SetupContext, watch } from 'vue'

export default defineComponent({
  props: {
    visible: Boolean
  },
  emits: ['update:visible'],
  setup(props, ctx) {
    const { visible, handleClose } = useDialog(ctx)

    watch(() => props.visible, (currentValue) => {
      visible.value = currentValue
    })
    return {
      visible,
      handleClose
    }
  }
})

function useDialog(ctx: SetupContext<'update:visible'[]>) {
  const visible = ref<boolean>(false)

  const handleClose = () => {
    visible.value = false
    ctx.emit('update:visible')
  }
  const handleShow = () => {
    visible.value = true
  }
  return {
    visible,
    handleClose,
    handleShow
  }
}
</script>

<style lang="less" scoped>
.upload-dialog {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: none;
  &.is-show {
    display: block;
    .upload-dialog-mask {
      display: block;
      animation: opacityAnimate .3s ease forwards;
    }
    .upload-dialog__container {
      opacity: 1;
      transform: translateY(0);
      animation: translateYAnimate .3s ease forwards;
    }
  }
  .upload-dialog-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 99;
    background-color: fade(#000, 20);
    display: none;
    opacity: 0;
  }
  .upload-dialog__container {
    min-height: 30vh;
    background-color: var(--white);
    position: relative;
    z-index: 101;
    // animate
    opacity: 0;
    transform: translateY(-10%);
  }
  .upload-dialog__header {
    padding: 20px;
  }
  .close-button {
    cursor: pointer;
    &:hover .icon-close {
      transform: rotate(720deg);
    }
    .icon-close {
      font-size: 24px;
      transition: 1s ease-in-out;
      transform: rotate(0);
      display: block;
    }
  }
  .upload-dialog__body {
    display: grid;
    place-items: center;
    h1 {
      font-size: 24px;
      margin: 10px 0;
    }
    p {
      margin-top: 10px;
      color: var(--gray-d);
      font-size: 12px;
    }
  }
  .upload-icon {
    display: block;
    width: 98px;
    height: 98px;
  }
}

@keyframes opacityAnimate {
  0% {
     opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
@keyframes translateYAnimate {
  0% {
      opacity: 0;
     transform: translateY(-10%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
