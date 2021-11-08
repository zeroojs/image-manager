import { reactive } from 'vue'

const state = reactive({
  groups: [] as ImageGroupModule.Group[] // 只保存id 和 name 用于 select
})

const actions = {
  SET_GROUPS(groups: ImageGroupModule.Group[]) {
    state.groups = groups.map(group => ({ id: group.id, name: group.name }))
  }
}

export const store = {
  state,
  actions
}

export const useStore = () => store