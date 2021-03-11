import request from '@/utils/request'

export function userLogin(options) { // 登录
  return request({
    url: '/api/user/login',
    method: 'post',
    data: options
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user/userInfo',
    method: 'get'
  })
}

export function sendMsg(username) {
  return request({
    url: '/api/user/sendEmail',
    method: 'post',
    data: {
      username
    }
  })
}

export function registerSub(options) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data: options
  })
}
