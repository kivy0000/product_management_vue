<template>

  <div style="flex: 1;height: 770px;width: 1400px">

    <div v-if=mainDialog >

      <el-breadcrumb separator=">" style=
          "font-size: medium;font-family: 'Microsoft YaHei UI Light';height: 35px;
          margin-top: 10px;margin-left: 25px;color: #cccccc">
        <el-breadcrumb-item><a  @click="goBack">首页</a></el-breadcrumb-item>
<!--        <el-breadcrumb-item><a>{{ pageTitle }}</a></el-breadcrumb-item>-->
<!--        <el-breadcrumb-item><a>{{ pageTitle }}</a></el-breadcrumb-item>-->
        <el-breadcrumb-item v-if="pageTitle"><a>{{ pageTitle }}</a></el-breadcrumb-item>
      </el-breadcrumb>
      <!--            <el-page-header @back="goBack" title="回首页" style=-->
      <!--                "font-size: largeer;font-family: 'Microsoft YaHei UI';height: 35px;margin-top: 10px;margin-left: 25px;">-->
      <!--              <template #content>-->
      <!--                &lt;!&ndash;       使用span容器标签来拼合     &ndash;&gt;-->
      <!--                <span style="font-size: 15px;font-family: 'Microsoft YaHei UI'"> {{ pageTitle }} </span>-->
      <!--              </template>-->
      <!--            </el-page-header>-->
    </div>

    <div style="margin-top: 8px;flex: 1">
      <!--  二级+三级路由写法  -->
      <!--      <router-view v-is="urlComponents"></router-view>-->
      <!--   组件写法   -->
      <component  :is="urlComponents"></component>
    </div>

  </div>



</template>

<script>
import {ref, provide} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import DemoMain from "@/components/mains/DemoMain";
import DefaultMain from "@/components/mains/DefaultMain";
import {ElMessage} from 'element-plus'
import {ArrowRight} from '@element-plus/icons-vue'


export default {
  name: "Main",
  components: {
    DemoMain,
    DefaultMain,
  },

  setup() {

    // //传递给其他组件值provide("mynum", 666)

    //消息通知
    const elSout = (mMessage, mType) => {
      ElMessage({
        message: mMessage,
        type: mType,
        center: true,
        duration: 2500,
        showClose: false,
        grouping: false,
      })
    }

    //返回上一页/组件
    const goBack = () => {
      changeModol('DefaultMain');

    }

    //返回上一页选项是否显示，默认不显示
    const mainDialog = ref(false);

    //更改main的二级组件
    const changeModol = (targetComponent, newTitle) => {
      //组件写法
      if (targetComponent) {
        urlComponents.value = targetComponent;
        //如果返回首页，直接返回，不显示标题栏目
        if (targetComponent == 'DefaultMain'){
          mainDialog.value = false;
          elSout("返回首页", 'success');
          return ;
        }
        //否则显示标题栏,提示未开发界面
        changePageTitle(newTitle);
        if(newTitle != '设备处理'){
          elSout(newTitle + ' , 正在开发,暂时使用设备界面', 'info');
        }
      } else {
        //未传递要跳转的组件名
        urlComponents.value = 'DefaultMain';
      }
      mainDialog.value = true;
    }

    //main默认显示的子组件
    const urlComponents = ref('DefaultMain');

    //标题关键字
    const pageTitle = ref('');

    //修改标题
    const changePageTitle = (newTitle) => {
      if (newTitle) {
        pageTitle.value = newTitle;
      }
      return;
    }

    //等于this.$Router
    const router = useRouter();

    return {
      urlComponents,
      pageTitle,
      goBack,
      changeModol,
      mainDialog,
      changePageTitle,
      elSout,
    };
  }

}
</script>

<style scoped>

</style>