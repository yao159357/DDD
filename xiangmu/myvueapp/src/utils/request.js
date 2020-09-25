import axios from 'axios'
import Router from './../router'
// 开发阶段  http://localhost:3000/api
// 上线     http://sh2007.wudaxun.top/api
// 判定当前的服务器 是 开发 还是线上
const isDev = process.env.NODE_ENV === 'development' // npm run serve 时 值为真， npm run build 时 值为假
const request = axios.create({
  baseURL: isDev ? '/api' : 'http://39.98.162.120:3000/api'
})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么 --- 统一给所有的请求都加loading的效果， 头信息传递token
  // config.common.headers['token'] = localStorage.getItem('token') // 所有的请求 都会将本地的token值传递到服务器
  config.headers.common.token = localStorage.getItem('token') // 所有的请求 都会将本地的token值传递到服务器
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么  ----  取消loading的效果，响应token的有效性
  // 获取响应的字段
  if (response.data.code === '10119') {
    // 直接跳转到登陆页面
    Router.push('/login')
    return
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request
