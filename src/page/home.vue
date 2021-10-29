<template>
  <div class="home flex between">
    <ImageGroup />
    <ImageGroup />
    <ImageGroup />
    <ImageGroup />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ImageGroup from '../components/ImageGroup/index.vue'

export default defineComponent({
  components: {
    ImageGroup
  },
  setup() {
    return {
    }
  }
})
</script>

<style lang="less" scoped>
</style>
