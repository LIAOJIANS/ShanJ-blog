import request from '@/utils/request'

export function blogDel(name, fz) {
  return request({
    url: '/api/admin/delBolg',
    method: 'post',
    data: {
      bolgTitle: name,
      fz
    }
  })
}

export function changeFz(name, fz, newFz) {
  return request({
    url: '/api/admin/changeFz',
    method: 'post',
    data: {
      bolgTitle: name,
      fz,
      newFz
    }
  })
}

export function getLunBoList() {
  return request({
    url: '/api/admin/lunboList',
    method: 'get'
  })
}

export function uploadLunBo(file) {
  return request({
    url: '/api/admin/uploadLunBo',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: file
  })
}

export function updataLunBo(file) {
  return request({
    url: '/api/admin/updataLunBo',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: file
  })
}

export function delLunBo(id) {
  return request({
    url: '/api/admin/delLunBo',
    method: 'post',
    data: { id }
  })
}
