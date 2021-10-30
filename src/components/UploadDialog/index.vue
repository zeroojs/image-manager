<template>
  <!-- 
    上传对话框
    1. 点击上传
    2. 拖拽上传
   -->
  <div v-if="dualogVisible" :class="isShow ? 'is-show' : 'is-hide'" class="upload-dialog">
    <!-- 遮罩 -->
    <div class="upload-dialog-mask" @click.self="handleClose()"></div>
    <div
      class="upload-dialog__container"
      @dragover.prevent.stop="() => {}"
      @drop.stop.prevent="handleDropOver"
    >
      <div class="upload-dialog__header flex end">
        <span class="close-z-button" @click="handleClose()">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div class="upload-dialog__body">
        <template v-if="fileDatas.length">
          <div class="upload-img-container">
            <img
              v-for="(file, index) in fileDatas"
              :key="file.blobUrl + index"
              :src="file.blobUrl"
              class="upload-img"
              alt=""
            >
          </div>
          <form>
            <label class="form-item">
              <p>选择分组</p>
              <div class="flex">
                <z-input v-model="group" placeholder="请选择分组" />
              </div>
            </label>
            <label class="form-item action flex center">
              <z-button>上传</z-button>
              <z-button>添加分组</z-button>
            </label>
          </form>
        </template>
        <template v-else>
          <img src="../../assets/upload.svg" class="upload-icon" alt="" :draggable="false">
          <h1>拖放或粘贴图像在这里上传</h1>
          <b>你也可以浏览您的计算机</b>
          <p>格式：JPG | PNG | GIF | SVG | SVGA 大小：不超过10 MB</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, SetupContext, watch } from 'vue'

export default defineComponent({
    props: {
        visible: Boolean
    },
    emits: ["update:visible"],
    setup(props, ctx) {
        const { dualogVisible, isShow, handleClose, handleShow } = useDialog(ctx);
        watch(() => props.visible, (currentValue) => {
            if (currentValue) {
                handleShow();
            }
            else {
                handleClose();
            }
        });
        const { fileDatas, handleDropOver } = useDraggable();
        return {
          isShow,
          dualogVisible,
          group: ref(''),
          handleClose,
          fileDatas,
          handleDropOver
        };
    }
})

// 弹窗行为hook
function useDialog(ctx: SetupContext<'update:visible'[]>) {
  const dualogVisible = ref<boolean>(false)
  const isShow = ref<boolean>(false)

  // 关闭
  let timer: NodeJS.Timeout
  const handleClose = () => {
    isShow.value = false
    clearTimeout(timer)
    timer = setTimeout(() => {
      dualogVisible.value = false
      ctx.emit('update:visible')
      clearTimeout(timer)
    }, 300)
  }

  // 显示
  const handleShow = () => {
    dualogVisible.value = true
    isShow.value = true
  }

  // 保证定时器一定清除
  onBeforeUnmount(() => {
    clearTimeout(timer)
  })
  return {
    dualogVisible,
    isShow,
    handleClose,
    handleShow
  }
}

// 拖拽文件处理hook
function useDraggable() {
  interface FileData {
    blobUrl: string // 浏览器预览
    data?: File // 要上传到服务器的数据
  }
  const fileDatas = ref<FileData[]>([])
  const handleDropOver = (e: DragEvent) => {
    const files = e.dataTransfer?.files
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        const index = parseInt(key)
        const blob = new Blob([files[index]])
        const blobUrl = URL.createObjectURL(blob)
        fileDatas.value.push({
          blobUrl: blobUrl,
          data: files[index]
        })
      }
    }
  }
  
  return {
    fileDatas,
    handleDropOver
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
  &.is-show {
    .upload-dialog-mask {
      animation: fadeIn .3s ease forwards;
    }
    .upload-dialog__container {
      animation: slideIn .3s ease forwards;
    }
  }
  &.is-hide {
    display: block;
    .upload-dialog-mask {
      animation: fadeOut .3s ease alternate;
    }
    .upload-dialog__container {
      animation: slideOut .3s ease alternate;
    }
  }
  .upload-dialog-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 99;
    background-color: fade(#000, 20);
    opacity: 0;
  }
  .upload-dialog__container {
    min-height: 30vh;
    padding-bottom: 64px;
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
  .close-z-button {
    cursor: pointer;
    &:hover .icon-close {
      transform: rotate(270deg);
    }
    .icon-close {
      font-size: 24px;
      transition: .8s ease-in-out;
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

  // 上传内容以及表单
  .upload-img-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    .upload-img {
      max-height: 273px * .5;
      max-width: 285px * .5;
      width: 100%;
      display: block;
    }
  }

  .form-item {
    display: block;
    margin-top: 20px;
    width: 100%;
    &.action {
      display: flex;
      gap: 20px;
    }
  }
}

@keyframes fadeIn {
  0% {
     opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
@keyframes slideIn {
  0% {
      opacity: 0;
     transform: translateY(-10%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeOut {
  0% {
     opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
@keyframes slideOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-10%);
  }
}
</style>
