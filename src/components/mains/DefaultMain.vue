<template>
  <div>
        <p class="tipsText">
          欢迎来到管理系统，您可以点选左侧列表以切换业务</p>
        <p class="tipsText">
          管理システムへようこそ。左側のリストをクリックしてビジネスを切り替えることができます</p>
        <p class="tipsText">
          관리 시스템에 오신 것을 환영합니다. 왼쪽 목록을 클릭하여 업무를 전환할 수 있습니다.</p>
        <p class="tipsText">
          Welcome to the management system , you can click on the left to change the business</p>
  </div>

</template>

<script>
import {ref} from 'vue';

export default {
  name: "DefaultMain",
  components: [],
  setup() {
    return {
    }

  }
}
</script>
<style scoped>
.tipsText {
  margin-bottom: 5px;
  margin-left: 10px;
  font-size: large;
  font-family: 'Microsoft YaHei UI', monospace;
  color: #545c64;
  letter-spacing: 6px;
  line-height: 30px;
  /*font-weight: bold;*/
}

.tipsText1 {
  /*width: 1360px;*/
  /*height: 670px;*/
  /*顶部按钮*/
  color: #545c64;
  margin-left: 50px;
  font-size: 700px;
  font-family: "Microsoft YaHei";
  font-weight: bolder;
  letter-spacing: 50px;
  text-align: center;
}
</style>