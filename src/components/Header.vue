<template>
  <div class="header_title-style">

    <div class="header_second_title-style">
      <el-icon :size="26">
        <Platform/>
      </el-icon>
      Product lifecycle management system
    </div>
    <div style="padding-right: 30px">
      <el-button link class="header_button" @click="elOpen('北京时间' ,nowTime,'success')"
                 style="margin-right: 25px">
        <el-icon style="margin-right: 5px">
          <Watch />
        </el-icon>
        {{ nowTime }}
      </el-button>
      <el-button link class="header_button" @click="goBack" style="margin-right: 25px">
        <el-icon>
          <HomeFilled/>
        </el-icon>
        首页
      </el-button>
      <el-button link class="header_button" @click="elSout('拒绝协同')" style="margin-right: 25px">
        <el-icon>
          <Avatar/>
        </el-icon>
        协同
      </el-button>
      <el-button link class="header_button" @click="elSout('拒绝调整')" style="margin-right: 25px">

        <el-icon>
          <TrendCharts/>
        </el-icon>
        调整
      </el-button>
      <el-button link class="header_button" @click="elSout('订单拒绝')" style="margin-right: 25px">
        <el-icon>
          <List/>
        </el-icon>
        订单
      </el-button>
      <el-button link class="header_button" @click="elSout('其他拒绝')" style="margin-right: 25px">
        <el-icon>
          <Grid/>
        </el-icon>
        其他内容
      </el-button>


    </div>
    <div style="padding-right: 10px;">
      <!--   登录后   -->
      <el-dropdown v-if="systemUser!=null"> <!--  systemUser：使用验证参数，应放在homeview里面，使用inject和provide进行全局调用  -->
        <el-button type="info" style="width: 100px;margin-top: 20px;font-size: small;background-color: #424f63;">
          <el-icon :size="18">
            <User style="margin-right: 2px"/>
          </el-icon>
          {{ systemUser.username }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="userMessage">账号信息</el-dropdown-item>
            <el-dropdown-item style="color: darkblue" @click="userleave">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!--   登陆前   -->
      <el-dropdown v-else="systemUser!=null">
        <el-button type="info" style="width: 100px;margin-top: 20px;font-size: small;background-color: #424f63;">
          <el-icon class="el-icon--right" style="margin: auto;font-style: initial;font-weight: bold">登录/注册</el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>登录</el-dropdown-item>
            <!--这里提示账号信息，不自动关闭 -->
            <el-dropdown-item>
              <router-link to="/">注册</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {ref, inject, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {ElNotification} from 'element-plus'

export default {
  name: "Header",
  components: [],
  setup() {

    //读取其他组件传的值
    const systemUser = inject('systemUser');

    //返回首页
    const goBack = () => {
      /*二级路由写法*/
      router.push('/');
      // router.go(-1);
      elSout("返回首页", 'success');
    }

    //账号信息
    const userMessage = () => {
      elOpen('账号信息', '欢迎您:  ' + systemUser.value.username, 'success');
    }

    //退出登录
    const userleave = () => {
      ElMessageBox.confirm(
          '确认退出登录？',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            icon: 'UserFilled',
          }
      ).then(
          () => {
            elOpen('退出登录', systemUser.value.username + '  已退出登录', 'warning');
            systemUser.value = null;
            //跳转回登录/注册界面
          }
      )
          .catch(
              () => {
                elSout('取消', 'info');
              }
          )


    }


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

    //右侧账号提示消息通知
    const elOpen = (mTitle, mMessage, mType) => {
      ElNotification({
        title: mTitle,
        message: mMessage,
        type: mType,
        offset: 60,
        duration: 3000,
      })
    }

    //实时显示当前时间
    const nowTime = ref(new Date().toLocaleString('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }));

    // 更新时间
    setInterval(() => {
      nowTime.value = new Date().toLocaleString('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      });
    }, 1000);

    //=this.$router
    var router = useRouter();

    return {
      nowTime,
      goBack,
      elSout,
      systemUser,
      elOpen,
      userMessage,
      userleave,
    }
  }
}
</script>

<style scoped>


.header_button {
  /*顶部按钮*/
  margin-left: 50px;
  font-size: large;
  font-family: 黑体;
  font-weight: bold;
  letter-spacing: 2px;

}

.header_title-style {
  min-width: 300px;
  height: 70px;
  min-width: 1000px;
  line-height: 70px;
  border-bottom: 3px solid #ccc;
  flex: 1;
  display: flex;
}

.header_second_title-style {
  margin-left: 20px;
  flex: 1;
  font-weight: bold;
  color: #545c64;
  font-family: 'Microsoft YaHei UI';
  font-size: 25px;
}

* el-icon {
  size: "18";
  margin-right: 2px;

}

</style>