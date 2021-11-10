<template>
  <div class="group-details">
    <div class="group-details__header flex between">
      <div class="flex bottom">
        <h2 class="title">{{ group.name }}</h2>
        <span class="edit-btn" @click="openDialog()">编辑</span>
        <span class="del-btn" @click="openDelDialog()">删除</span>
      </div>
      <div class="flex bottom">
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
        :layout="['select', 'del', 'copy']"
        @click="checkImage(image.id)"
        @copy="(e) => handleClipboard(image.middle, e)"
        @del="delImage(image.id)"
      />
    </div>
    <Dialog v-model="dialog">
      <div class="edit-group-dialog">
        <z-input v-model="groupName" placeholder="分组名称" />
        <div class="flex center">
          <z-button @click="updateGroup(groupName)">就改这个名字</z-button>
          <z-button plain @click="dialog = false">我再想想</z-button>
        </div>
      </div>
    </Dialog>
    <Dialog v-model="delDialog">
      <div class="edit-group-dialog">
        <p>删除分组会将分组中的图片也全部删除哦！！！</p>
        <p>您是否继续删除当前分组？</p>
        <div class="flex center">
          <z-button @click="delGroup()" danger>我就要删</z-button>
          <z-button plain @click="delDialog = false">不删了</z-button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'
import Dialog from '../components/Dialog/index.vue'
import { queryImageList, deleteImage } from '../api/image'
import { handleClipboard } from '../utils/clipboard'
import { groupRestful } from '../api/group'
import { useNotify } from '../components/Notify'

export default defineComponent({
  components: {
    Dialog,
    ImageContainer
  },
  setup() {
    const dialog = ref(false)
    const delDialog = ref(false)
    const groupName = ref('')
    const { checkImage, imageList, delImage, total } = useImage()
    const { group, delGroup, updateGroup } = useGroup(dialog)

    const openDialog = () => {
      groupName.value = group.name
      dialog.value = true
    }

    const openDelDialog = () => {
      delDialog.value = true
    }

    return {
      group,
      total,
      dialog,
      delGroup,
      delImage,
      delDialog,
      imageList,
      groupName,
      checkImage,
      openDialog,
      updateGroup,
      openDelDialog,
      handleClipboard
    }
  }
})

function useGroup(dialog: Ref<boolean>) {
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
      dialog.value = false
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
      dialog.value = false
      router.push('/')
    }
  }
  return {
    group,
    delGroup,
    updateGroup
  }
}

function useImage() {
  const router = useRouter()
  const route = useRoute()
  const imageList = ref<ImageModule.Image[]>([])
  const total = ref(0)
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

  // 删除照片
  const delImage = async (id: number) => {
    await deleteImage(id)
    imageList.value = imageList.value.filter(item => item.id !== id)
    total.value -= 1
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
    getImageList
  }
}
</script>

<style lang="less" scoped>
.edit-group-dialog {
  padding: 20px 0;
  & > .flex {
    margin-top: 20px;
    gap: 20px;
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
