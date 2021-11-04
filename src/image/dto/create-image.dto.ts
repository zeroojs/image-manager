export class CreateImageDto {
  files: Express.Multer.File[]
  groupId: number // 分组 id
}