import sizeOf from 'image-size'

// 获取图片大小（宽、高）
export function getPixelSize(input: Buffer | string) {
  return sizeOf(input)
}