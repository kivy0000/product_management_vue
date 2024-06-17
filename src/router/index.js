import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes = [

  {
    //这里不注销掉，因为router组件需要有一个默认的 path: '/'
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