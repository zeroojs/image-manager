import { App } from 'vue'
import ZButton from './ZButton/index.vue'
import ZInput from './ZInput/index.vue'

// 全局组件
export default {
  install(app: App) {
    app.component('ZButton', ZButton)
    app.component('ZInput', ZInput)
  }
}
