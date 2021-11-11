import { reactive } from 'vue'

const state = reactive({
  isUploaded: false, // 上传回调值
  groups: [] as ImageGroupModule.Group[] // 只保存id 和 name 用于 select
})

const actions = {
  SET_GROUPS(groups: ImageGroupModule.Group[]) {
    state.groups = groups.map(group => ({ id: group.id, name: group.name }))
  },
  SET_IS_UPLOADED(isUploaded: boolean) {
    state.isUploaded = isUploaded
  }
}

export const store = reactive({
  state,
  actions
})

export const useStore = () => store