<template>
  <div class="group-details">
    <div class="group-details__header flex between">
      <div class="flex bottom">
        <h2 class="title">{{ group.name }}</h2>
        <span class="edit-btn" @click="openEditGroupDialog()">换个名字</span>
        <span class="del-btn" @click="openDialog('delGroup')">不要这个分组了</span>
      </div>
      <div class="flex bottom">
        <z-button v-if="showBatchDelBtn" danger @click="openDialog('delImages')">选中的都删了</z-button>
        <p class="image-total-container">
          现有
          <span class="image-total">{{ total }}</span>
          张照片
        </p>
      </div>
    </div>
    <div class="img-container img-layout">
      <ImageContainer
        v-for="image in imageList"
        :key="image.id"
        :src="image.middle"
        :width="image.width"
        :height="image.height"
        :layout="['select', 'del', 'copy']"
        @click="checkImage(image.id)"
        @copy="(e) => handleClipboard(image.middle, e)"
        @del="delImage(image.id)"
        @select="selecteAction(image)"
      />
    </div>
    <Dialog v-model="showGroup.dialog">
      <!-- 编辑分组表单 -->
      <div v-if="showGroup.editGroup" class="edit-group-dialog">
        <z-input v-model="groupName" placeholder="分组名称" />
        <div class="flex center">
          <z-button @click="updateGroup(groupName)">就改这个名字</z-button>
          <z-button plain @click="closeDialog()">我再想想</z-button>
        </div>
      </div>
      <!-- 删除分组提示 -->
      <div v-if="showGroup.delGroup" class="del-group-dialog">
        <p>删除分组会将分组中的图片也全部删除哦！！！</p>
        <p>您是否继续删除当前分组？</p>
        <div class="flex center">
          <z-button @click="delGroup()" danger>我就要删</z-button>
          <z-button plain @click="closeDialog()">不删了</z-button>
        </div>
      </div>
      <!-- 批量删除图片提示 -->
      <div v-if="showGroup.delImages" class="del-images-dialog">
        <p>莫向我的思念！</p>
        <p>我的思念，恰似这一江春水，拦不住，剪不断。</p>
        <div class="flex center">
          <z-button @click="batchDelImage()" danger>这就剪</z-button>
          <z-button plain @click="closeDialog()">我还有点乱</z-button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref, computed, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { queryImageList, deleteImage, batchDeleteImage } from '../api/image'
import { handleClipboard } from '../utils/clipboard'
import { groupRestful } from '../api/group'
import { useNotify } from '../components/Notify'
import Dialog from '../components/Dialog/index.vue'
import ImageContainer from '../components/ImageContainer/index.vue'
import { useStore } from '../store'

export default defineComponent({
  components: {
    Dialog,
    ImageContainer
  },
  setup() {
    const groupName = ref('')
    const { showGroup, openDialog, closeDialog } = useDialog()
    const {
      checkImage,
      imageList,
      delImage,
      total,
      selecteAction,
      batchDelImage,
      showBatchDelBtn,
      getImageList
    } = useImage(closeDialog)
    const { group, delGroup, updateGroup } = useGroup(closeDialog)
    const store = useStore()

    watch(() => store.state.isUploaded, (currentValue) => {
      console.log('currentValue', currentValue)
      if (currentValue) {
        getImageList()
      }
    })

    const openEditGroupDialog = () => {
      groupName.value = group.name
      openDialog('editGroup')
    }

    return {
      group,
      total,
      delGroup,
      delImage,
      showGroup,
      imageList,
      groupName,
      checkImage,
      openDialog,
      closeDialog,
      updateGroup,
      selecteAction,
      batchDelImage,
      showBatchDelBtn,
      handleClipboard,
      openEditGroupDialog
    }
  }
})

function useGroup(closeDialog: Function) {
  const route = useRoute()
  const router = useRouter()
  const notify = useNotify()
  const group = reactive<ImageGroupModule.Group>({
    id: parseInt(route.params.id as string),
    name: route.query.name as string,
    count: parseInt(route.query.count as string)
  })

  // 更新 group
  const updateGroup = async (name: string) => {
    if (!name || name === group.name) return
    const result = await groupRestful('PATCH', { id: group.id, name })
    if (result) {
      notify({ message: '更新成功!' })
      closeDialog()
      group.name = name
      router.replace({
        path: route.path,
        query: { name },
        params: route.params
      })
    }
  }

  // 删除分组
  const delGroup = async () => {
    const result = await groupRestful('DEL', group)
    if (result) {
      notify({ message: `[${group.name}]分组已删除!` })
      closeDialog()
      router.push('/')
    }
  }
  return {
    group,
    delGroup,
    updateGroup
  }
}

function useImage(closeDialog: Function) {
  const router = useRouter()
  const route = useRoute()
  const notify = useNotify()
  const imageList = ref<ImageModule.Image[]>([])
  const total = ref(0)
  const selected = ref<number[]>([])
  const showBatchDelBtn = computed(() => selected.value.length > 0)
  const queryParams = reactive({
    limit: 10,
    offset: 0,
    groupId: route.params.id
  })
  // 获取图片列表
  const getImageList = (q = queryParams) => {
    queryImageList(q).then(({ data }) => {
      imageList.value = data.items
      total.value = data.total
    })
  }
  getImageList()

  // 选择图片
  const selecteAction = (image: ImageModule.Image) => {
    if (selected.value.includes(image.id)) {
      selected.value = selected.value.filter(id => id !== image.id)
      return
    }
    selected.value.push(image.id)
  }

  // 删除照片
  const delImage = async (id: number) => {
    await deleteImage(id)
    imageList.value = imageList.value.filter(item => item.id !== id)
    total.value -= 1
  }

  // 批量删除
  const batchDelImage = async () => {
    const result = await batchDeleteImage(selected.value)
    if (!result) return
    closeDialog()
    imageList.value = imageList.value.filter(item => !selected.value.includes(item.id))
    total.value -= selected.value.length
    notify({ message: '选中图片已全部删除！' })
  }

  // 查看图片详情
  const checkImage = (id: number) => {
    router.push(`/image/${id}`)
  }

  return {
    total,
    delImage,
    imageList,
    checkImage,
    queryParams,
    getImageList,
    selecteAction,
    batchDelImage,
    showBatchDelBtn
  }
}

function useDialog() {
  const showGroup = reactive({
    dialog: false,
    editGroup: false,
    delGroup: false,
    delImages: false
  })

  /**
   * 关闭弹窗
   * @param isDelay 解决弹窗动画要与子节点一直
   */
  const closeDialog = (isDelay = true) => {
    showGroup.dialog = false
    if (!isDelay) {
      showGroup.editGroup = false
      showGroup.delGroup = false
      showGroup.delImages = false
      return
    }
    const timer = setTimeout(() => {
      showGroup.editGroup = false
      showGroup.delGroup = false
      showGroup.delImages = false
      clearTimeout(timer)
    }, 300)
  }

  const openDialog = (name: 'editGroup' | 'delGroup' | 'delImages') => {
    closeDialog(false)
    showGroup[name] = true
    showGroup.dialog = true
  }

  return {
    showGroup,
    closeDialog,
    openDialog
  }
}
</script>

<style lang="less" scoped>
.edit-group-dialog,
.del-group-dialog,
.del-images-dialog {
  padding: 20px 0;
  & > .flex {
    margin-top: 20px;
    gap: 20px;
  }
  & > p {
    line-height: 2em;
  }
}
.group-details__header {
  height: 60px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--gray);
  .flex {
    gap: 20px;
  }
  .title {
    font-size: 24px;
  }
  [class*="-btn"] {
    cursor: pointer;
  }
  .edit-btn {
    color: var(--primary-color);
  }
  .del-btn {
    color: var(--red);
  }
  .image-total-container {
    color: var(--gray-d);
    .image-total {
      font-size: 24px;
      color: var(--text-color);
    }
  }
}
.img-container {
  flex-wrap: wrap;
  gap: 20px;
}
</style>
