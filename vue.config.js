const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
//解决跨域问题
module.exports = {
  devServer: {
    port: 8989, //前端启动端口
    proxy: { //拦截器
      '/api': {
        target: "http://36.138.22.19:9090/",//代理目标服务器地址
        changeOrigin: true,//允许跨源
        pathRewrite: {
          '/api': ''
        }
      }
    },
    client: {
      //  解决页面弹出红色报错遮罩层,将overlay设置为false即可
      overlay: false
    },
  },

  //解决__VUE_PROD_HYDRATION_MISMATCH_DETAILS__警告，需要显式的配置
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }

}
