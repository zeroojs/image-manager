import { createApp } from 'vue'
import Notify from './index.vue'
const notifyOutContainer = document.createElement('div')
notifyOutContainer.setAttribute('class', 'notify-out-container')
document.body.appendChild(notifyOutContainer)

export const useNotify = () => {
  return ({ title, message }: { title?: string, message: string }) => {
    const notifyEle = document.createElement('div')
    notifyEle.setAttribute('class', 'notify-container')
    notifyOutContainer.appendChild(notifyEle)
    const app = createApp(Notify, {
      title,
      message
    })
    app.mount(notifyEle)
  }
}