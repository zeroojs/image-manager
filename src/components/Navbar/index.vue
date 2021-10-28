<template>
  <div class="navbar">
    <div class="app-container flex end middle navbar-inner">
      <div>
        <SearchInput v-model="keywords" placeholder="请输入关键字" />
      </div>
      <div>
        <Button>上传图片</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SearchInput from '../SearchInput/index.vue'

export default defineComponent({
  components: {
    SearchInput
  },
  setup() {
    const keywords = ref<string>('')
    return {
      keywords
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
