import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
// 全局注册 Button
import GlobalComponents from './components'

// Style
import './style/index.less'

const app = createApp(App)
app
  .use(router)
  .use(GlobalComponents)
  .mount('#app')
