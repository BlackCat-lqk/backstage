import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '@/assets/css/rest.css'
import '@/assets/css/global.css'

import ZkTable from 'vue-table-with-tree-grid'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ZkTable)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
