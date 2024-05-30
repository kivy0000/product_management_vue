//引入axios
import axios from "axios";


//创建axios对象,叫request
const request = axios.create({
    //要求在50s内请求完成
    timeout: 50000,
    /**允许cookie传递sessionId*/
    withCredentials: true
})

//设置拦截器,格式设置为json，编码utf-8
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config
}, error => {
    return Promise.reject(error)
})

//设置响应拦截器,将res直接设置为response.data
request.interceptors.response.use(
    response => {
        let res = response.data
        //如果是文件，直接放行
        if (response.config.responseType === 'blob') {
            return res
        }
        //如果是字符，转换为json对象
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        // console.log("err", error)
        return Promise.reject(error)
    }
)


//导出request对象给其他文件使用
export default request