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

export function uploadBookInfo(url, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: `/api/admin/${url}`,
    method: 'post',
    data: formData
  })
}

export function checkBookType(book_type_name) {
  return request({
    url: '/api/admin/book_type_check',
    method: 'post',
    data: {
      book_type_name
    }
  })
}

export function createBookType(book_type_name) {
  return request({
    url: '/api/admin/create_book_type',
    method: 'post',
    data: {
      book_type_name
    }
  })
}

export function getBookType() {
  return request({
    url: '/api/admin/get_book_type'
  })
}

export function createBook(data) {
  return request({
    url: '/api/admin/create_book',
    method: 'post',
    data: data
  })
}

export function getBookList() {
  return request({
    url: '/api/admin/get_book_list'
  })
}

export function selectBook(_id) {
  return request({
    url: `/api/admin/select_book/?id=${_id}`
  })
}

export function delBook(_id) {
  return request({
    url: `/api/admin/del_book/?id=${_id}`
  })
}

export function getUserList() {
  return request({
    url: '/api/admin/get_user_list'
  })
}
