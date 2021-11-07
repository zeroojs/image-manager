import { request } from '../utils/request'

// 获取图片列表
export const queryImageList = (query = { limit: 10, offset: 0 }) => {
  return request.get('/image', { params: query })
}

// 获取图片详情
export const queryImage = (id: string | number) => {
  return request.get(`/image/${id}`)
}