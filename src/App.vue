<template>
  <Navbar />
  <UploadDialog v-model:visible="visible" />
  <Button @click="visible = true">Open Dialog</Button>
  <router-view class="app-container sub-page" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchInput from './components/SearchInput/index.vue'
import Navbar from './components/Navbar/index.vue'
import UploadDialog from './components/UploadDialog/index.vue'
import Button from './components/Button/index.vue'
export default defineComponent({
  components: {
    Navbar,
    SearchInput,
    UploadDialog,
    Button
},
  data() {
    return {
      visible: false
    }
  }
})

</script>
