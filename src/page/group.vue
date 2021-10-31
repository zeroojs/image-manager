<template>
  <div>
    <div class="group-header flex between bottom">
      <div>
        <p class="image-total-container">
          现有
          <span class="image-total">1</span>
          个分组
        </p>
      </div>
      <div class="flex">
        <z-button :disabled="false" danger>批量删除</z-button>
        <div v-if="isCreating" class="flex create-group">
          <z-input v-model="groupName" placeholder="请输入分组名称" />
          <z-button @click="isCreating = false">保存</z-button>
        </div>
        <z-button v-else @click="isCreating = true">创建分组</z-button>
      </div>
    </div>
    <div class="img-layout">
      <ImageContainer
        :layout="['select', 'edit', 'del', 'name']"
        @click="checkGroup()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    const router = useRouter()
    const groupName = ref('')
    const isCreating = ref(false)

    // id -> 先模拟生成
    const checkGroup = (id: string = Math.random().toString(16).substr(2)) => {
      router.push(`/group/${id}`)
    }
    return {
      checkGroup,
      groupName,
      isCreating
    }
  }
})
</script>

<style lang="less" scoped>
.group-header {
  height: 60px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--gray);
  .flex {
    gap: 20px;
  }
  .image-total-container {
    color: var(--gray-d);
    .image-total {
      font-size: 24px;
      color: var(--text-color);
    }
  }
}
</style>