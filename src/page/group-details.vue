<template>
  <div class="group-details">
    <div class="group-details__header flex between">
      <div class="flex bottom">
        <h2 class="title">{{ group.name }}</h2>
        <span class="edit-btn">编辑</span>
        <span class="del-btn">删除</span>
      </div>
      <div class="flex bottom">
        <p class="image-total-container">
          现有
          <span class="image-total">{{ total }}</span>
          张照片
        </p>
        <z-button @click="openUploadDialog()">上传到相册</z-button>
      </div>
    </div>
    <div class="img-container img-layout">
      <ImageContainer
        v-for="image in imageList"
        :key="image.id"
        :src="image.middle"
        :layout="['select', 'del', 'copy']"
        @click.self="checkImage(image.id)"
        @copy="(e) => handleClipboard(image.middle, e)"
        @del="delImage(image.id)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'
import { queryImageList, deleteImage } from '../api/image'
import { handleClipboard } from '../utils/clipboard'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    const openUploadDialog = inject('openUploadDialog') as Function
    const { checkImage, imageList, delImage, total } = useImage()
    const { group } = useGroup()
    return {
      group,
      total,
      delImage,
      imageList,
      checkImage,
      openUploadDialog,
      handleClipboard
    }
  }
})

function useGroup() {
  const route = useRoute()
  const group = reactive<ImageGroupModule.Group>({
    id: parseInt(route.params.id as string),
    name: route.query.name as string,
    count: parseInt(route.query.count as string)
  })
  return {
    group
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
