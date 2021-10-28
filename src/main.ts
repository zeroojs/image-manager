import { createApp } from 'vue'
import App from './App.vue'
// 全局注册 Button
import Button from './components/Button'

// Style
import './style/index.less'

const app = createApp(App)
app
  .use(Button)
  .mount('#app')
