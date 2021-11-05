export class QueryImageDto {
  groupId?: number // 分组名称
  filename?: string // 图片名称
  limit: number // 每页数目
  offset: number // 页码 0 开始
}
