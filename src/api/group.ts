import { request } from '../utils/request'

// 获取分组列表
export const queryGroupList = (query = { limit: 10, offset: 0 }) => {
  return request.get('/group', { params: query })
}

type GroupRestfulAction = 'GET' | 'POST' | 'PATCH' | 'DEL'
type GroupRestfulParams = { limit: number, offset: number } | ImageGroupModule.Group
// 创建分组
export const groupRestful = (action: GroupRestfulAction, params: GroupRestfulParams) => {
  let url = '/group'
  let data = {}
  let sendParams: any = params
  if (/DEL|PATCH/.test(action)) {
    url += `/${(params as ImageGroupModule.Group).id}`
  }
  if (/POST|PATCH/.test(action)) {
    data = params
    sendParams = {}
  }
  return request({
    url,
    method: action === 'DEL' ? 'DELETE' : action,
    params: sendParams,
    data
  })
}