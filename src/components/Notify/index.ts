import { createApp } from 'vue'
import Notify from './index.vue'

export const useNotify = () => {
  return ({ title, message }: { title?: string, message: string }) => {
    const notifyEle = document.createElement('div')
    notifyEle.setAttribute('class', 'notify-container')
    document.body.appendChild(notifyEle)
    const app = createApp(Notify, {
      title,
      message
    })
    app.mount(notifyEle)
  }
}