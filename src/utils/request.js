import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

// create an axios instance
const request = axios.create({
  // baseURL: "/api", // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // console.log(response);
    const res = response.data
    const { success, message } = res
    if (!success) {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
    return res
  },
  function(error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // console.dir(error);
    if (error.response.status === 401 && error.response.data.code === 10002) {
      Message.error('亲，你登录信息已过期请重新登录')
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
)

export default request
