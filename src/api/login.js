import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }

  // 登录
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}
// 退出
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

