<template>
  <div class="foot_style">
    <p style="margin-top: 5px;">版权所有 © 2024 AutoIKunGoose</p>
    <p>备案号：京审备案字JS1457531131798</p>
  </div>

</template>

<script>
import { ElMessage } from 'element-plus'
export default {
  name: "Foot",
  components: {},
  setup(){
    //消息通知
    const elSout = (mMessage,mType) => {
      ElMessage({
        message: mMessage,
        type:mType,
        center:true,
        duration:3000,
        showClose:true,
        grouping: false,
      })
    }
    return{
      elSout,
    }
  }
}
</script>

<style scoped>


.foot_style{
  color: grey;
  margin-top: 25px;
  text-align: center;
  width: auto;
  font-size: small;
  border-top: 3px solid #ccc;
}
</style>