import axios from 'axios'
import Vue from 'vue'
import { messages } from '@/utils/message'
import { getToken } from '@/utils/token'
import { removeToken } from './token'
// import store from '@/store'

axios.defaults.withCredentials = true
Vue.prototype.$http = axios
const service = axios.create({
  timeout: 15000 // 请求超时时间
})

service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['Authorization'] = `Bearer ${getToken()}`
    return config
  },
  error => {
    messages('网络错误！', 'error')
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0 && res.code !== 200 && res.code !== 2) {
      messages(res.msg || '失败', 'error')
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log(error.message)
    if (error?.message.indexOf('401') !== -1) {
      messages('会话失效!', 'error')
      removeToken()
      const timer = setTimeout(() => {
        location.reload()
        clearTimeout(timer)
      }, 500)
      return
    }
    messages('网络错误！', 'error')
    return Promise.reject(error)
  }
)

export default service
