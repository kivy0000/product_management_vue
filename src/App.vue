<template>
  <div>
    <router-view :is="routerUrl" ></router-view>
  </div>

</template>
<script>

import {ref} from 'vue';

export default {
  name: "layout",
  components: {},

  setup(){

    //TODO 这里只是v-is,并没有用其中的值
    //通过修改routerUrl并保存登陆对象在sessionStonge中进行验证和跳转/*
    const routerUrl = ref("home");

    return {
      routerUrl
    };
  }
}
</script>
<style scoped>
</style>
