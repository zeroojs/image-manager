import { request } from '../utils/request'

// 获取图片列表
export const queryImageList = (query = { limit: 10, offset: 0 }) => {
  return request.get('/image', { params: query })
}

// 获取图片详情
export const queryImage = (id: string | number) => {
  return request.get(`/image/${id}`)
}

// 上传图片
export const uploadImages = (files: File[], groupId: string | number) => {
  // 组装表单
  const form = new FormData()
  files.forEach((file, index) => {
    form.append('files', file, file.name)
  })
  
  form.append('groupId', groupId as string)
  
  return request.post('/image', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除照片
export const deleteImage = (id: number) => {
  return request.delete(`/image/${id}`)
}

// 批量删除照片
export const batchDeleteImage = (ids: number[]) => {
  return request.delete('/image', { data: { ids } })
}

// 下载图片
export const downloadImageAction = (id: string | number, size = 'mini'): Promise<BlobPart> => {
  return request.post('/image/download', { id, size }, {
    responseType: 'blob',
    // headers: {
    //   'content-type': 'application/octet-stream'
    // }
  })
}