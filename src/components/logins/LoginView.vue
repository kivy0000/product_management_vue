<template>

  <!--  登陆页面  -->
  <div class="login-container">

    <!--  背景部分  -->
    <div class="imgeBack">
      <el-image :src="require('@/assets/logo3.jpg')"/>
    </div>

    <!--  忘记密码弹窗-->
    <el-dialog style="width: 330px;height: 460px" title="找回密码" v-model="this.logform.dialogVisible">

      <!--   重置密码表单   -->
      <el-form :model="reform" label-width="80px" class="login-form" :rules="logrules">

        <el-form-item label="账 号" prop="username">
          <el-input v-model="reform.username" placeholder="请输入账号"></el-input>
        </el-form-item>

        <el-form-item label="邮 箱" prop="email">
          <el-input v-model="reform.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input v-model="reform.password" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>

        <!-- 手机号和验证码-->
        <el-form-item label="验证码" prop="vcode">
          <el-input v-model="reform.vcode" class="vcodeclass" placeholder="验证码" style="width: 115px"/>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary"
                     size="default"
                     style="width: 75px"
                     :disabled="reform.disabledButton" @click="getVcode(this.reform.email)">{{ reform.registerText }}
          </el-button>
        </el-form-item>

        <!--重置        -->
        <el-form-item>
          <el-button type="primary" size="large" style="width: 320px" :disabled="resetlock" @click="resetPassword">重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--   登录卡片   -->
    <el-card class="login-card">
      <!--      logo-->
      <el-image class="logo-image" :src="require('@/assets/bird.jpg')"/>

      <!--   主标题   -->
      <el-text class="titleText" tag="b">LOGIN TEST INTERFACE</el-text>

      <!-- 登陆表单     -->
      <div class="formStyle">
        <el-form :model="form" label-width="80px" :rules="logrules" class="login-form">

          <!--   使用 prop指定校验规则       -->
          <el-form-item label="账 号" prop="username">
            <el-input v-model="form.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密 码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" style="width: 280px;margin: auto" size="large"
                       :disabled="this.form.disabledButton" @click="userLogin">登录
            </el-button>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 280px;margin: auto" size="large" @click="jumpComponent('RegisterView')">
              注册
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="primary" @click="userForget">忘记密码?</el-link>
          </el-form-item>

        </el-form>
      </div>
    </el-card>

  </div>

</template>

<script>
import {reactive} from 'vue';
import {ElMessage} from 'element-plus'
import {ElNotification} from 'element-plus'
import {useRouter, useRoute} from 'vue-router'
//引入axios对象
import request from "@/utils/request";
import {ref} from 'vue';

export default {
  name: 'Login',
  components: {},
  //事件触发数组
  emits: [
    'changeRouterUrl'
  ],
  created() {
    this.Rparse = {};
    //从注册页面填充（如果有），通过本地缓存，同样可作为登陆超时判定
    this.Rparse = JSON.parse(localStorage.getItem('loginData'));
    if (this.Rparse !== null) {
      // console.log(this.Rparse);
      if (this.Rparse.username) {
        this.form.username = this.Rparse.username;
      }
      if (this.Rparse.password) {
        this.form.password = this.Rparse.password;
      }
      localStorage.clear();
    }
  },/*// 初始化钩子函数，不在method里面*/
  methods: {


    //打开忘记密码表单
    userForget() {
      this.logform.dialogVisible = true;
    },

    //弹窗方法
    /**
     * @param str 提示信息
     * @param type 提示类型 success、warning等
     * @param duration 等待时间(毫秒)
     */
    open(str, type, duration) {
      ElMessage({
        message: str,
        type: type,
        duration: duration, //等待时间(毫秒)
      })
    },

    /**重置获取验证码的方法*/
    getVcode(vemail) {
      this.reform.disabledButton = true;
      var demo = 400;
      if (this.reform.username === '' || this.reform.username === null || this.reform.email === '' || this.reform.email === null) {
        this.open("请输入账号/邮箱", 'warning');
        this.reform.disabledButton = false;
        return;
      }
      //向后端发送重置密码通知,异步，
      request.post("/api/reSetVcode", this.reform).then(res => {
            // console.log(res);
            //接收状态码
            demo = res.code;
            //判断验证码是否发送成功
            if (demo === 200) {
              this.open('验证码发送成功，有效期120s', "success");
              this.resetlock = false;
              //验证码不应使用明文,使用sessionid+redis验证，在重置方法中进行验证
              //设置过期时间，两分钟
              const expireTime = new Date().getTime() + 120 * 1000;
              sessionStorage.setItem('expireTime', expireTime);
            } else if (demo === 300) {
              this.open("该账号未注册，请注册", 'warning');
            } else if (demo === 500) {
              this.open("账号/邮箱不匹配，请检查", 'warning');
            } else {
              this.open("发送验证码失败，请检查账号/邮箱", 'error');
            }
            //验证码每60s点击一次,本地处理，较快
            if (this.reform.registerTime > 0) {//如果已经在计时
              this.reform.disabledButton = false;
              return;
              //错误访问，不计时
            }
            if (demo === 400 || demo === 300) {
              this.reform.disabledButton = false;
              return;
            }
            //否则，开始计时
            this.reform.registerTime = 60;
            //按时间减少
            const timer = setInterval(() => {
              this.reform.registerTime--;
              //计时结束
              if (this.reform.registerTime === 0) {
                clearInterval(timer);
                this.reform.disabledButton = false;
                this.reform.registerText = '获取';
                //正在计时
              } else {
                this.reform.disabledButton = true;
                this.reform.registerText = `${this.reform.registerTime}秒后获取`;
              }
            }, 1000);
          }
      );
    },

    /**重置密码的方法*/
    resetPassword() {
      if (this.reform.username === '' || this.reform.password === '') {
        this.open("请输入账号/密码", 'warning');
        return;
      }
      if (this.reform.vcode === '') {
        this.open("请输入验证码", 'warning');
        return;
      }
      var item = sessionStorage.getItem('expireTime');
      request.put("/api/resetPassword/" + this.reform.vcode + "/" + item, this.reform).then(res => {
        // console.log(res)
        //判断是否重置成功
        if (res.code === 200) {
          this.open("重置密码成功", 'success', 3000,
              () => {
                //注册完成使验证码失效
                this.reform.icode = '';
                //关闭页面
                this.logform.dialogVisible = false;

              }
          );
        } else if (res.code === 300) {
          this.open("验证码已过期", 'warning')
        } else if (res.code === 600) {
          this.open("验证码错误", 'warning')
        } else {
          this.open("重置失败，请检查验证码", 'error')
        }
      })


    },

    //侧面弹窗方法
    /**
     * @param str 提示信息
     * @param type 提示类型 success、warning等
     */
    notiOpen(titles, type, username) {
      if (type === 'success') {
        ElNotification.success({
          title: titles + username,
          offset: 50,
          duration: 4500,
        })
      } else if (type === 'warning') {
        ElNotification.warning({
          title: titles,
          offset: 50,
          duration: 4500,
        })
      } else {
        ElNotification.error({
          title: titles,
          offset: 50,
          duration: 4500,
        })
      }

    },

    /**
     * 登陆方法
     */
    userLogin() {
      this.form.disabledButton = true;
      //账号密码未填充
      if (!(this.form.username != '' && this.form.username != null
          && this.form.password != '' && this.form.password != null)) {
        this.open("请输入账号/密码", 'warning');
        this.form.disabledButton = false;
        return;
      }

      //登陆逻辑实际验证
      request.post("/api/login", this.form).then(res => {
            if (res.code === 200) {
              //跳转,userdata和expiretime已经在session中
            }
            //提示信息
            this.notiOpen(res.text, res.vcode, this.form.username);

          }
      )
      this.form.disabledButton = false;
    }
  },
  setup(props, ctx) {
    //也可以在script中直接添加表单
    //登陆表单
    const form = reactive({
      username: '',
      password: '',
      email: '',
      vcode: '',
      disabledButton: false,
      registerText: '获取', //获取验证码按钮
      registerTime: 0, //获取验证码倒计时
      icode: '',//服务端获取的验证码
    });

    //重置密码用的表单
    const reform = reactive({
      username: '',
      password: '',
      email: '',
      vcode: '',
      disabledButton: false,
      registerText: '获取', //获取验证码按钮
      registerTime: 0, //获取验证码倒计时
      icode: '',//服务端获取的验证码
    });

    //使用reactive、ref等方法来创建响应式数据和引用数据
    const logform = reactive({
      dialogVisible: false,
    });

    const resetlock = ref(true);//只读变量，地址不变，值变化了

    //前端校验规则,后端校验规则采取提示信息,不再使用表单校验-
    const logrules = reactive({
      username: [
        //账号校验规则
        //required 是否必填项,已在登陆方法中提示,这里不使用了,message 提示信息,trigger 逻辑触发方式
        {required: false, message: "请输入账号", trigger: "blur"},
        {pattern: /^[A-Za-z0-9]{6,18}$/, message: "账号格式错误,长度6-18", trigger: "blur"}
      ],
      password: [
        //密码校验规则
        {required: false, message: "请输入密码", trigger: "blur"},
        {pattern: /^[a-zA-Z0-9_.-]{6,18}$/, message: "密码格式错误,长度6-18", trigger: "blur"}
      ],
      email: [
        //邮箱校验规则
        {required: false, message: "请输入邮箱", trigger: "blur"},
        {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/, message: "邮箱格式错误,请检查", trigger: "blur"}
      ],
      vcode: [
        //验证码校验规则
        {required: false, message: "请输入验证码", trigger: "blur"},
        {pattern: /^[0-9]{6}$/, message: "验证码格式错误,请检查", trigger: "blur"}
      ],

    })

    //使用事件触发父组件app的 @changeMain="changeRouterUrl" 方法//跳转组件
    const jumpComponent = (targetComponent) => {
      ctx.emit('changeRouterUrl', targetComponent);
    }

    return {
      form, reform, logform, resetlock, logrules,jumpComponent,
    };
  },
};
</script>
<style scoped>

/* 登陆页面 */
.login-container {
  z-index: 1;
  display: flex;
  justify-content: center; /*靠右*/
  align-items: center; /* 靠上*/
  height: 90vh;
  opacity: 0.88; /*透明度*/
}

/*登录卡片*/
.login-card {
  z-index: 1;
  height: 550px;
  width: 430px;
  padding: 15px;
  text-align: center;
}

/*主标题样式*/
.titleText {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  margin-top: 30px;
}

/*忘记密码*/
.el-link {
  margin-top: -10px;
  /*margin-right: 4px;*/
  /*font-size: 12px;*/
}

/*登陆表单*/
.login-form {

  label-width: 80px;
  margin-top: 30px;
  margin-right: 30px;
  margin-left: -30px;
  font-size: 50px


}

/*logo*/
.logo-image {
  width: 140px;
  height: 60px;
  margin: auto; /* 居中显示 */
  justify-content: center; /* 居中对齐 */
  opacity: 0.7;
}

/*背景图*/
.imgeBack {
  position: fixed;
  width: 1920px;
  height: 1080px;
  z-index: 0;
}


</style>