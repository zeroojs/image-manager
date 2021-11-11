<template>
  <Navbar />
  <UploadDialog v-model:visible="visible" />
  <router-view class="app-container sub-page" />
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import Navbar from './components/Navbar/index.vue'
import UploadDialog from './components/UploadDialog/index.vue'
import Radio from './components/Radio/index.vue'
import RadioGroup from './components/Radio/RadioGroup.vue'

export default defineComponent({
  components: {
    Navbar,
    Radio,
    RadioGroup,
    UploadDialog
  },
  setup() {
    const visible = ref(false)
    // 打开上传对话框
    const openUploadDialog = () => {
      visible.value = true
    }
    provide('openUploadDialog', openUploadDialog)
    return {
      visible
    }
  }
})

</script>
