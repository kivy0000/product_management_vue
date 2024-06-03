import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes = [

  {
    //这里不注销掉，因为父子组件互相触发方法需要使用
    // path: '/',
    name: 'home',
    component: HomeView,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router