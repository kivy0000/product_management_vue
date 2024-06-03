<template>
  <div>
<!--  在这里进行登录/产品模块的切换  -->
    <component  :is="routerUrl" ref="chirdRef" @changeRouterUrl="changeRouterUrl"></component>
  </div>

</template>
<script>

import {ref} from 'vue';
import HomeView from "@/views/HomeView";
import LoginView from "@/components/logins/LoginView";
import RegisterView from "@/components/logins/RegisterView";

export default {
  name: "layout",
  components: {
    HomeView,
    LoginView,
    RegisterView,
  },

  setup(){


    //todo 使用provide添加一个对象，包含登录用户，token时间等等，先保存到session，然后再全局共享

    //通过修改routerUrl并保存登陆对象在sessionStonge中进行验证和跳转/*
    const routerUrl = ref("LoginView");

    //方便父子组件来回调用方法，使用这引用子组件
    const chirdRef = ref(null);

    //更改显示的组件
    const changeRouterUrl = (value)=>{
      routerUrl.value = value;
    }

    return {
      routerUrl,
      changeRouterUrl,
      chirdRef,
    };
  }
}
</script>
<style scoped>
</style>
