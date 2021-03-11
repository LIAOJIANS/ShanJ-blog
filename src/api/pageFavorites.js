import request from '@/utils/request'

export function reqWorkList() { // 收藏列表
  return request({
    url: '/api/user/workList',
    method: 'get'
  })
}

export function reqAddWorkList(filename) { // 添加收藏
  return request({
    url: '/api/user/addWork',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: filename
  })
}

export function reqUpdataWorkList(filename) {
  return request({
    url: '/api/user/updataWork',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: filename
  })
}

export function reqDelWorkList(id) { // 删除项目
  return request({
    url: '/api/user/delWork',
    method: 'post',
    data: {
      id
    }
  })
}

export function reqIsLook(id, isLook) {
  return request({
    url: '/api/user/peopleLook',
    method: 'post',
    data: {
      id: id,
      isLook: isLook
    }
  })
}
