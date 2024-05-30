import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

//引入全局样式
import "@/assets/css/global.css"

//引入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
//引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(store).use(router).use(ElementPlus, {locale: zhCn}).mount('#app')


