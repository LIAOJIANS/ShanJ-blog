import request from '@/utils/request'

export function searchContent(searchValue) {
  return request({
    url: '/api/search/content',
    method: 'post',
    data: {
      searchValue
    }
  })
}
