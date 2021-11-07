declare module ImageModule {
  export interface Image {
    id: number
    filename: string // 文件名称
    size: number // 文件大小 （字节）
    mime: string // 文件 mime 类型
    ext: string // 文件扩展名
    width: number // 图片宽度 px
    height: number // 图片高度 px
    mini: string // 64x64 | 50% 小图标
    thumb: string // 100x100 | 50% 缩略图
    middle: string // auto | 75% 中等
    url: string // auto | 100% 原图
    group: ImageGroupModule.Group // 分组
    createAt?: Date
    updateAt?: Date
  }
}