<template>
  <div class="group-details">
    <div class="group-details__header flex between">
      <div class="flex bottom">
        <h2 class="title">相册名称</h2>
        <span class="edit-btn">编辑</span>
        <span class="del-btn">删除</span>
      </div>
      <div class="flex bottom">
        <p class="image-total-container">
          现有
          <span class="image-total">20</span>
          张照片
        </p>
        <z-button @click="openUploadDialog()">上传到相册</z-button>
      </div>
    </div>
    <div class="img-container flex between">
      <ImageContainer @click="checkImage()" :layout="['select', 'edit', 'del']" />
      <ImageContainer :layout="['select', 'edit', 'del']" />
      <ImageContainer :layout="['select', 'edit', 'del']" />
      <ImageContainer :layout="['select', 'edit', 'del']" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    const router = useRouter()
    const openUploadDialog = inject('openUploadDialog') as Function

    // 查看图片详情
    const checkImage = () => {
      router.push('/image/aad')
    }
    return {
      openUploadDialog,
      checkImage
    }
  }
})
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
