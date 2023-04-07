import axios from 'axios'
import { Message } from 'element-ui'
// import { Message, Loading } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000 // request timeout
})

// let loadingInstance

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers = config.headers || {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Accept: 'application/json, text/plain, */*'
    }
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    // Do something before request is sent
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    // loadingInstance = Loading.service({ fullscreen: true })
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
const href = location.href.split('#')[1]
service.interceptors.response.use(
  // response => response,
  response => {
    // loadingInstance.close()
    if (response.data.errcode === 1001) {
      // 在hash模式下才可这样分离
      removeToken()
      if (href) {
        location.href = '/#/login' + '?redirect=' + encodeURIComponent(href)
      } else {
        location.href = '/#/login'
      }
      return Promise.reject('error')
    } else if (response.data.errcode === 405) {
      location.href = '#/403'
    }
    if (response.data.errcode !== 0 && response.data.errcode !== 405) {
      Message({
        message: response.data.errmsg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    }

    return response.data
  },

  error => {
    console.log('err' + error) // for debug
    Message({
      message: '啊哦，服务开小差了-_-',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
