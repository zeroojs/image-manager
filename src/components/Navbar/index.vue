<template>
  <div class="navbar">
    <div class="app-container flex end middle navbar-inner">
      <div>
        <z-input v-model="keywords" placeholder="请输入关键字" />
      </div>
      <div>
        <z-button @click="openDialog()">上传图片</z-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  setup() {
    const keywords = ref<string>('')
    const openUploadDialog = inject<Function>('openUploadDialog') as Function
    const openDialog = () => {
      openUploadDialog()
    }
    return {
      keywords,
      openDialog
    }
  }
})
</script>

<style lang="less" scoped>
.navbar {
  box-shadow: 0 0 15px fade(#000, 10);
  background-color: var(--white);
  .navbar-inner {
    height: 60px;
    gap: 20px;
  }
}
</style>
