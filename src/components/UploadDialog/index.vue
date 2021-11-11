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
      @paste="handleCopy"
    >
      <div class="upload-dialog__header flex end">
        <span class="close-z-button" @click="handleClose()">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div class="upload-dialog__body">
        <template v-if="fileDatas.length">
          <div class="upload-img-container">
            <div
              v-for="(file, index) in fileDatas"
              :key="file.blobUrl + index"
              class="upload-img-item"
            >
              <div class="upload-img-mask" @click="removeFile(file)">
                <i class="iconfont icon-del"></i>
              </div>
              <img
                :src="file.blobUrl"
                class="upload-img"
                alt=""
              >
            </div>
          </div>
          <form>
            <label class="form-item">
              <p>选择分组</p>
              <div class="flex">
                <z-select v-model="groupId" placeholder="请选择分组">
                  <z-option
                    v-for="group in groups"
                    :key="group.id"
                    :value="group.id"
                    :label="group.name"
                  />
                </z-select>
              </div>
            </label>
            <label class="form-item action flex center">
              <z-button @click.prevent="handleUploadImages()">上传</z-button>
              <!-- <z-button>添加分组</z-button> -->
            </label>
          </form>
        </template>
        <template v-else>
          <img src="../../assets/upload.svg" class="upload-icon" alt="" :draggable="false">
          <h1>拖放或粘贴图像在这里上传</h1>
          <b>你也可以<a href="" class="link-btn" @click.prevent="openFilesDialog()">浏览您的计算机</a></b>
          <p>格式：JPG | PNG | GIF 大小：不超过10 MB</p>
           <!-- | SVG | SVGA -->
        </template>
      </div>
    </div>
    <input ref="fileInput" :style="{ display: 'none' }" type="file" multiple @change="handleFileInputChange">
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, SetupContext, watch } from 'vue'
import { useRoute } from 'vue-router'
import { queryGroupList } from '../../api/group'
import { uploadImages } from '../../api/image'
import { useStore } from '../../store'
import ZSelect from '../MSelect/index.vue'
import ZOption from '../MSelect/Option.vue'

export default defineComponent({
  components: {
    ZSelect,
    ZOption
  },
  props: {
    visible: Boolean
  },
  emits: ["update:visible"],
  setup(props, ctx) {
    const { dualogVisible, isShow, handleClose, handleShow } = useDialog(ctx)
    const { groups, groupId } = useGroup()
    const {
      fileInput,
      fileDatas,
      removeFile,
      handleDropOver,
      handleCopy,
      handleFileInputChange,
      openFilesDialog
    } = useFiles()
    const store = useStore()
    const route = useRoute()

    // 上传图片
    const handleUploadImages = async () => {
      store.actions.SET_IS_UPLOADED(false)
      const files = fileDatas.value.map(fd => fd.data as File)
      await uploadImages(files, groupId.value)
      handleClose()
      // 当前页面是上传分组页面时触发
      if (parseInt(route.params.id as string) === groupId.value) {
        store.actions.SET_IS_UPLOADED(true)
      }
    }

    watch(() => props.visible, (currentValue) => {
      if (currentValue) {
        handleShow()
        if (!route.params.id) return
        groupId.value = parseInt(route.params.id as string)
      }else {
        handleClose()
      }
    })

    return {
      isShow,
      groups,
      dualogVisible,
      groupId,
      handleClose,
      fileInput,
      fileDatas,
      removeFile,
      handleCopy,
      handleDropOver,
      openFilesDialog,
      handleUploadImages,
      handleFileInputChange
    }
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

// 分组hook
function useGroup() {
  const groupId = ref<number | string>('')
  const store = useStore()
  const groups = ref(store.state.groups)
  const group = ref<ImageGroupModule.Group>()

  // 获取分组列表
  const getGroupList = (q = { limit: 10, offset: 0 }) => {
    queryGroupList(q).then(({ data }) => {
      if (data.items.length) {
        groups.value = data.items
        groupId.value = data.items[0].id
      }
    })
  }
  if (groups.value.length) {
    if (!groupId.value) {
      groupId.value = groups.value[0].id as number
    }
  } else {
    getGroupList()
  }
  return {
    group,
    groups,
    groupId
  }
}

// 拖拽文件处理hook
function useFiles() {
  interface FileData {
    blobUrl: string // 浏览器预览
    data?: File // 要上传到服务器的数据
  }

  const fileInput = ref<HTMLInputElement>()
  const fileDatas = ref<FileData[]>([])

  // 文件数据填充
  const fillFileDatas = (file: File) => {
    const blob = new Blob([file])
    const blobUrl = URL.createObjectURL(blob)
    fileDatas.value.push({
      blobUrl: blobUrl,
      data: file
    })
  }

  // 删除文件
  const removeFile = ({ blobUrl }: FileData) => {
    fileDatas.value = fileDatas.value.filter(item => blobUrl !== item.blobUrl)
  }

  // 监听拖拽事件获取文件
  const handleDropOver = (e: DragEvent) => {
    const files = e.dataTransfer?.files
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        const index = parseInt(key)
        fillFileDatas(files[index])
      }
    }
  }

  // 监听粘贴事件获取文件
  const handleCopy = (e: ClipboardEvent) => {
    const clipboardData = e.clipboardData
    if (clipboardData && clipboardData.items) {
      const items = clipboardData.items
      for (let key in items) {
        const item = items[key]
        // 特别地：clipboardData.items 是一个异步对象，浏览器控制台展开是看不到相应的值，这里直接获取来判断即可
        if (item && item.kind === 'file' && /^(image\/)/.test(item.type)) {
          const file = item.getAsFile()
          if (!file) return
          fillFileDatas(file)
        }
      }
    }
  }

  // 监听文件input变化获取文件
  const handleFileInputChange = (e: Event) => {
    const files = (e.target as any).files
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        const index = parseInt(key)
        fillFileDatas(files[index])
      }
    }
  }

  // 打开文件选择对话框
  const openFilesDialog = () => {
    fileInput.value?.click()
  }
  
  return {
    fileInput,
    fileDatas,
    removeFile,
    handleCopy,
    handleDropOver,
    openFilesDialog,
    handleFileInputChange
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
  .link-btn {
    color: var(--primary-color);
    text-decoration: none;
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
    .upload-img-item {
      max-height: 273px * .5;
      max-width: 285px * .5;
      overflow: hidden;
      position: relative;
      z-index: 1;
      &:hover {
        .upload-img-mask {
          opacity: 1;
        }
      }
      .upload-img-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        background-color: fade(#000, 40);
        display: grid;
        place-items: center;
        opacity: 0;
        transition: .3s ease;
        cursor: pointer;
      }
      .iconfont {
        font-size: 24px;
        color: var(--red);
      }
    }
    .upload-img {
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
