import request from '@/utils/request'

export function thumbsUp() { // 点赞
  return request({
    url: '/api/user/zan',
    method: 'get'
  })
}

export function subWall(content) { // 提交反馈墙
  return request({
    url: '/api/user/subWall',
    method: 'post',
    data: {
      wallInfo: content
    }
  })
}

export function wallList() {
  return request({
    url: '/api/user/wallList',
    method: 'get'
  })
}
