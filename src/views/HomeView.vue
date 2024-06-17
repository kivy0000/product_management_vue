<template>
  <div class="common-layout">
    <!--  一级容器  -->
    <el-container>
      <!--   一级容器头部   -->
      <el-header class="header_style">
        <Header ref="headerRef" @changeMain="changeMainVue"/>
      </el-header>
      <!--   二级容器   -->
      <el-container>
        <!--   三级容器   -->
        <el-container class="thrid_container_style">
          <el-aside class="aside_style">
            <Aside ref="asideRef" @changeMain="changeMainVue"/>
          </el-aside>
          <el-main class="main_style">
            <!--二级+三级路由写法 <router-view></router-view>-->
            <Main ref="mainRef"></Main>
          </el-main>
        </el-container>
        <!--   二级容器底部   -->
        <el-footer>
          <Foot ref="footRef"/>
        </el-footer>
      </el-container>
      <!--   回顶部   -->
      <el-backtop :right="100" :bottom="100"/>
    </el-container>

  </div>
</template>

<script>

import Header from "@/components/Header";
import Aside from "@/components/Aside";
import Main from "@/components/Main";
import Foot from "@/components/Foot";
import {ref, provide} from 'vue';


export default {
  name: 'HomeView',
  components: {
    Header,
    Aside,
    Main,
    Foot,
  },
  //事件触发数组
  emits: [
    'changeRouterUrl'
  ],
  activated() {
    //加载组件前验证是否过期,触发时机：keep-alive组件激活时使用；
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const expireTime = JSON.parse(sessionStorage.getItem("expireTime"));
    if (userData === null|| expireTime === null){
      this.jumpComponent('LoginView');
      return ;
    }
    if (new Date().getTime() > parseInt(expireTime)) {
      // 数据已过期
      alert("数据超时，请重新登录");
      sessionStorage.clear();
      this.jumpComponent('LoginView');
    } else {
      // 数据未过期
      this.systemUser = userData;
    }

  },
  deactivated() {
    //加载组件前验证是否过期,触发时机：keep-alive组件停用时调用；
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const expireTime = JSON.parse(sessionStorage.getItem("expireTime"));
    if (userData === null|| expireTime === null){
      this.jumpComponent('LoginView');
      return ;
    }
    if (new Date().getTime() > parseInt(expireTime)) {
      // 数据已过期
      alert("数据超时，请重新登录");
      sessionStorage.clear();
      this.jumpComponent('LoginView');
    } else {
      // 数据未过期
      this.systemUser = userData;
    }
  },


  created() {
    //这里放入和取出时，都会失去json格式，放入时直接放入对象，取出时进行jason转换
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const expireTime = JSON.parse(sessionStorage.getItem("expireTime"));
    if (userData === null|| expireTime === null){
      this.jumpComponent('LoginView');
      return ;
    }
    if (new Date().getTime() > parseInt(expireTime)) {
      // 数据已过期
      alert("数据超时，请重新登录");
      sessionStorage.clear();
      this.jumpComponent('LoginView');
    } else {
      // 数据未过期
      this.systemUser = userData;
    }
    //--------------------------
  },
  setup(props, ctx) {
    //方便父子组件来回调用方法，使用这四个引用子组件
    const headerRef = ref(null);
    const asideRef = ref(null);
    const mainRef = ref(null);
    const footRef = ref(null);


    //更改主页组件
    const changeMainVue = (vueName, newTitle) => {
      // console.log('父组件homeview得到事件：@' + vueName)
      mainRef.value.changeModol(vueName, newTitle);
    }
    //使用事件触发父组件app的 @changeMain="changeRouterUrl" 方法//跳转组件
    const jumpComponent = (targetComponent) => {
      ctx.emit('changeRouterUrl', targetComponent);
    }

    //用户信息
    const systemUser = ref();

    //向其他组件共享用户信息
    provide('systemUser', systemUser);

    return {
      headerRef,
      asideRef,
      mainRef,
      footRef,
      changeMainVue,
      systemUser,
      jumpComponent,
    }
  }
}
</script>

<style scoped>
.header_style {
  min-width: 1500px;
}

.thrid_container_style {
  flex: 1;
}

.aside_style {
  width: 250px;
  margin-left: 8px;
  margin-top: 2px;
}

.main_style {
  display: flex;
  height: 800;

}


</style>
