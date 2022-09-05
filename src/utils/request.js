import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getRefreshToken, getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

let refreshing = false // 正在刷新标识，避免重复刷新
let waitQueue = [] // 请求等待队列

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { config, data: res } = response
    // 二进制数据则直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 10230) {
        if (refreshing === false) {
          refreshing = true // 切换正在刷新标识，其他请求先进请求等待队列中
          const refreshToken = getRefreshToken()
          return store
            .dispatch('user/refreshToken', refreshToken)
            .then(token => {
              // debugger
              // config.headers['Authorization'] = token
              // config.baseURL = '' // 请求重试时，url已包含baseURL
              waitQueue.forEach(callback => callback()) // 已成功刷新token，队列中的所有请求重试
              waitQueue = []
              return service(config)
            })
            .catch(() => {
              // token续期失败
              // to re-login
              MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                  location.reload()
                })
              })
            })
            .finally(() => {
              refreshing = false
            })
        } else {
          return new Promise(resolve => {
            waitQueue.push(token => {
              config.headers.Authorization = token
              config.baseURL = ''
              resolve(service(config))
            })
          })
        }
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    const { message } = error.response.data
    Message({
      message: message || error.message || error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
