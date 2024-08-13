<template>
  <!--  注册页面  -->
  <div class="login-container">

    <!-- 背景-->
    <div class="imgeBack">
      <el-image :src="require('@/assets/logo3.jpg')"/>
    </div>

    <!--注册卡片-->
    <el-card class="login-card">
      <el-image class="logo-image" :src="require('@/assets/bird.jpg')"/>

      <!--  主标题-->
      <el-text class="titleText" tag="b">注册</el-text>

      <!-- 注册表单-->
      <div class="formStyle">
        <el-form :model="form" ref="formRef" label-width="80px" size="large" class="login-form" :rules="logrules">

          <el-form-item label="账号" prop="username">
            <el-input v-model="form.username" placeholder="请输入账号"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>

          <!--            手机号和验证码-->
          <!--   仍有样式需要调整，目前class和style混合使用       -->
          <el-form-item label="验证码" style="font-size: 20px;display: flex" prop="vcode">

            <el-input v-model="form.vcode" class="w-50 m-2" placeholder="验证码"
                      style="flex: 1"/>
            <el-button type="primary"
                       size="large"
                       style="margin-left: 10px;flex: 1"
                       :loading="form.disabledButton"
                       @click="getVcode(this.form.email)">{{ form.registerText }}
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" :loading="registerLoading" style="width: 320px;margin-bottom: 20px" @click="registerUser">注册账号
            </el-button>
            <el-link type="primary"  @click="jumpComponent('LoginView')">返回登录</el-link>
          </el-form-item>

        </el-form>
      </div>

    </el-card>

  </div>

</template>

<script>
import {reactive} from 'vue';
import {ElMessage} from 'element-plus'
//引入axios对象
import request from "@/utils/request";
import {useRouter, useRoute} from 'vue-router'
import {ref} from 'vue';


export default {
  name: 'register',
  components: {},
  //事件触发数组
  emits: [
    'changeRouterUrl'
  ],
  methods: {
    /*跳转路由的方法*/

    /*
    In this optimized code snippet, unnecessary comments and unused elements have been removed to make the code cleaner and more concise. The structure of the template and script sections has been maintained, and the styling is also included in the scoped style section.
    ------------------------------
    */
    /**注册方法*/
    registerUser(str) {
      if (this.form.username === '' || this.form.password === '') {
        this.open("请输入账号/密码", 'warning');
        return;
      }
      if (this.form.vcode === '') {
        this.open("请输入验证码", 'warning');
        return;
      }
      //前端验证
      this.$refs['formRef'].validate(
          (valid) => {
            //前端校验通过,正常提交
            if (valid) {
              //获取验证码有效期
              var item = sessionStorage.getItem('expireTime');
              //后端校验
              request.post("/api/register/" + this.form.vcode + "/" + item, this.form).then(res => {
                // console.log(res)
                //判断是否注册成功
                if (res.code === 200) {
                  this.open("注册成功，3秒后自动返回登陆页面", 'success', 3000,
                      () => {
                        //将注册表单数据转交到登陆页面
                        localStorage.setItem('loginData', JSON.stringify(this.form));
                        //注册完成使验证码失效,交给后端
                        this. jumpComponent('LoginView');
                      }
                  );
                } else if (res.code === 300) {
                  this.open("验证码已过期", 'warning')
                } else if (res.code === 600) {
                  this.open("验证码错误", 'warning')
                } else {
                  this.open("注册失败，请检查验证码", 'error')
                }
              })
            }else {
              this.open("校验不通过，请检查", 'warning');
              return false;
            }

          })



    },

    /**获取验证码的方法*/
    getVcode(vemail) {
      //防止大量验证码发送
      this.form.disabledButton = true;

      var demo = 400;
      if (this.form.username === '' || this.form.username === null || this.form.password === '' || this.form.password === null) {
        this.open("请输入账号/密码", 'warning');
        this.form.disabledButton = false;
        return;
      }
      //向后端发送请求验证码的通知,异步，
      request.post("/api/getVcode", this.form).then(res => {
            // console.log(res);
            //接收状态码
            demo = res.code;
            //判断验证码是否发送成功
            if (res.code === 200) {
              this.open('验证码发送成功，有效期120s', "success");
              //验证码不应使用明文,使用sessionid+redis验证，在注册方法中进行验证
              //设置过期时间，两分钟
              const expireTime = new Date().getTime() + 120 * 1000;
              sessionStorage.setItem('expireTime', expireTime);
            } else if (res.code === 300) {
              this.open("该账号/邮箱已注册", 'warning');
            } else {
              this.open("发送验证码失败，请检查账号/邮箱", 'error');
            }
            //验证码每60s点击一次,本地处理，较快
            if (this.form.registerTime > 0) {//如果已经在计时
              this.form.disabledButton = false;
              return;
              //错误访问，不计时
            }
            if (demo === 400 || demo === 300) {
              this.form.disabledButton = false;
              return;
            }
            //否则，开始计时
            this.form.registerTime = 60;
            //按时间减少
            const timer = setInterval(() => {
              this.form.registerTime--;
              //计时结束
              if (this.form.registerTime === 0) {
                clearInterval(timer);
                this.form.disabledButton = false;
                this.form.registerText = '获取';
                //正在计时
              } else {
                this.form.disabledButton = true;
                this.form.registerText = `${this.form.registerTime}秒后获取`;
              }
            }, 1000);
          }
      );
    },


    /**
     * 弹窗方法
     * @param str 提示信息
     * @param type 提示类型 success、warning等
     */
    open(str, type, duration, onClose) {
      ElMessage({
        message: str,
        type: type,
        duration: duration, //等待时间
        onClose: onClose, //是否有关掉框
      })
    },
  },
  setup(props, ctx) {

    //使用事件触发父组件app的 @changeMain="changeRouterUrl" 方法//跳转组件
    const jumpComponent = (targetComponent) => {
      ctx.emit('changeRouterUrl', targetComponent);
    }

    ///表单
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

    //注册按钮加载动画
    const registerLoading = ref(false);

    return {
      form,
      logrules,
      jumpComponent,
      registerLoading,
    };
  },
};
</script>

<style scoped>

/*主标题样式*/
.titleText {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  margin-top: 30px;
}

.login-container {
  z-index: 1;
  display: flex;
  justify-content: center; /*靠右*/
  align-items: center; /* 靠上*/
  height: 100vh;
  opacity: 0.88; /*透明度*/
}

.login-card {
  z-index: 1;
  height: 580px;
  width: 430px;
  padding: 15px;
  text-align: center;
}


.login-form {
  margin-top: 30px;
  margin-right: 30px;
  margin-left: -30px;
  font-size: 50px;

}

.imgeBack {
  position: fixed;
  flex: 1;
  z-index: 0;
}

.logo-image {
  width: 140px;
  height: 80px;
  margin: auto; /* 居中显示 */
  justify-content: center; /* 居中对齐 */
  opacity: 0.7;
}

</style>