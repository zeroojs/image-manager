<template>
  <div class="group-page flex between">
    <ImageContainer @click="checkGroup()">
      <template #actios>
        <div class="action-group">
          <div class="action-item flex center middle">
            <i class="iconfont icon-edit"></i>
          </div>
          <div class="action-item flex center middle">
            <i class="iconfont icon-del"></i>
          </div>
        </div>
      </template>
    </ImageContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    const router = useRouter()
    // id -> 先模拟生成
    const checkGroup = (id: string = Math.random().toString(16).substr(2)) => {
      router.push(`/group/${id}`)
    }
    return {
      checkGroup
    }
  }
})
</script>

<style lang="less" scoped>
</style>
