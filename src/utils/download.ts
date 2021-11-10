// import JsZip from 'jszip'
// import { saveAs } from 'file-saver'

export const downloadImg = (image: ImageModule.Image | undefined) => {
  if (!image) return
  const img = new Image()
  img.src = image.thumb
  img.onload = function() {
    console.log(this)
  }
}