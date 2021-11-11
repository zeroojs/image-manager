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
        <!-- <z-button :disabled="false" danger>批量删除</z-button> -->
        <div v-if="isCreating" class="flex create-group">
          <z-input v-model="group.name" placeholder="请输入分组名称" />
          <z-button @click="createGroup()">保存</z-button>
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
        :layout="['edit', 'del', 'name']"
        @click="checkGroup(group)"
        @del="delGroup(group)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ImageContainer from '../components/ImageContainer/index.vue'
import { groupRestful } from '../api/group'
import { useStore } from '../store'

export default defineComponent({
  components: {
    ImageContainer
  },
  setup() {
    const isCreating = ref(false)
    const { group, total, groupList, getGroupBanner, checkGroup, createGroup, delGroup } = useGroupList(isCreating)
    const store = useStore()

    watch(() => groupList.value, (currentVal) => {
      store.actions.SET_GROUPS(currentVal)
    })

    return {
      total,
      group,
      delGroup,
      groupList,
      checkGroup,
      isCreating,
      createGroup,
      getGroupBanner
    }
  }
})

function useGroupList(isCreating: Ref<boolean>) {
  const router = useRouter()
  const groupList = ref<ImageGroupModule.Group[]>([])
  const total = ref(0)
  const group = reactive({
    name: ''
  })
  const queryParams = reactive({
    limit: 10,
    offset: 0
  })
  // 获取分组列表
  const getGroupList = (q = queryParams) => {
    groupRestful('GET', q).then(({ data }) => {
      groupList.value = data.items
      total.value = data.total
    })
  }
  getGroupList()

  // 创建分组
  const createGroup = async () => {
    if (!group.name) {
      isCreating.value = false
      return
    }
    const result = await groupRestful('POST', group)
    if (result) {
      groupList.value.unshift(result.data)
      total.value += 1
      isCreating.value = false
    }
  }

  // 删除分组
  const delGroup = async (group: ImageGroupModule.Group) => {
    const result = await groupRestful('DEL', group)
    if (result) {
      groupList.value = groupList.value.filter(item => item.id !== group.id)
      total.value -= 1
    }
  }

  // 获取分组封面（默认取第一张图片）
  const getGroupBanner = (group: ImageGroupModule.Group) => {
    return group.images?.length ? group.images[0].middle : ''
  }

  // 前往分组详情
  const checkGroup = (group: ImageGroupModule.Group) => {
    const { id, name, count } = group
    router.push({
      path: `/group/${id}`,
      query: { name, count }
    })
  }

  return {
    total,
    group,
    delGroup,
    groupList,
    checkGroup,
    queryParams,
    createGroup,
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