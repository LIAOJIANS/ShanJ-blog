import request from '@/utils/request'

export function counts() {
  return request({
    url: '/api/user/counts',
    method: 'get'
  })
}

export function gitHubLogin(client_id, client_secret, code) {
  return request({
    url: '/api/user/accessToken',
    method: 'post',
    data: {
      client_id,
      client_secret,
      code
    }
  })
}

export function newsData(page) {
  return request({
    url: '/api/user/newsData',
    method: 'post',
    data: {
      page
    }
  })
}
