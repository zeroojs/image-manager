<template>
  <div>
    <div class="group-header flex between bottom">
      <div>
        <p class="image-total-container">
          现有
          <span class="image-total">{{ total }}</span>
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
        v-for="group in groupList"
        :key="group.id"
        :name="group.name"
        :count="group.count"
        :src="getGroupBanner(group)"
        :layout="['select', 'edit', 'del', 'name']"
        @click="checkGroup(group)"
        @del.prevent="() => ({})"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'
import { queryGroupList } from '../api/group'
import { useStore } from '../store'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    const groupName = ref('')
    const isCreating = ref(false)
    const { total, groupList, getGroupBanner, checkGroup } = useGroupList()
    const store = useStore()

    watch(() => groupList.value, (currentVal) => {
      store.actions.SET_GROUPS(currentVal)
    })

    return {
      total,
      groupList,
      groupName,
      checkGroup,
      isCreating,
      getGroupBanner
    }
  }
})

function useGroupList() {
  const router = useRouter()
  const groupList = ref<ImageGroupModule.Group[]>([])
  const total = ref(0)
  const queryParams = reactive({
    limit: 10,
    offset: 0
  })
  // 获取分组列表
  const getGroupList = (q = queryParams) => {
    queryGroupList(q).then(({ data }) => {
      groupList.value = data.items
      total.value = data.total
    })
  }
  getGroupList()

  // 获取分组封面（默认取第一张图片）
  const getGroupBanner = (group: ImageGroupModule.Group) => {
    return group.images?.length ? group.images[0].middle : ''
  }

  // id -> 先模拟生成
  const checkGroup = (group: ImageGroupModule.Group) => {
    const { id, name, count } = group
    router.push({
      path: `/group/${id}`,
      query: { name, count }
    })
  }

  return {
    total,
    groupList,
    checkGroup,
    queryParams,
    getGroupList,
    getGroupBanner
  }
}
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