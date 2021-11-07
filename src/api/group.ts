import { request } from '../utils/request'

// 获取分组列表
export const queryGroupList = (query = { limit: 10, offset: 0 }) => {
  return request.get('/group', { params: query })
}