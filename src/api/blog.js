import request from '@/utils/request'

export function uploadBold(file) { // 发布博客
  return request({
    url: '/api/blog/uploadBold',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: file
  })
}

export function blodInfo(id) { // 博客详情
  return request({
    url: '/api/blog/blodInfo',
    method: 'post',
    data: {
      id
    }
  })
}

export function createFz(fzName) { // 创建分组
  return request({
    url: '/api/blog/createFz',
    method: 'post',
    data: {
      fzName
    }
  })
}

export function getFzList() { // 获取分组列表
  return request({
    url: '/api/blog/getFzList',
    method: 'get'
  })
}

export function getBoldList(listQuery) { // 获取所有博客
  return request({
    url: '/api/blog/getBoldList',
    method: 'post',
    data: {
      pageNum: listQuery.pageNum,
      pageSize: listQuery.pageSize
    }
  })
}

export function getBlodfzinfo() { // 分组数据
  return request({
    url: '/api/blog/blodfzinfo',
    method: 'get'
  })
}

export function blogTitleList() { // 热门文章
  return request({
    url: '/api/blog/blogTitleList',
    method: 'get'
  })
}

export function blogD(id, userId) { // 文章点赞
  return request({
    url: '/api/blog/blogD',
    method: 'post',
    data: {
      id,
      userId
    }
  })
}

export function fzItemList() {
  return request({
    url: '/api/blog/fzItemList',
    method: 'get'
  })
}

export function fuzzySearch(fzName) {
  return request({
    url: '/api/blog/fuzzySearch',
    method: 'post',
    data: {
      fzName
    }
  })
}

export function getBlogLikeList(userId) {
  return request({
    url: `/api/blog/blog_like_list?id=${userId}`
  })
}

export function checkBlogUnique(blogTitle) {
  return request({
    url: '/api/blog/check_blog_unique',
    method: 'post',
    data: {
      blogTitle
    }
  })
}

export function publishBlog(options) {
  return request({
    url: '/api/blog/publishBlog',
    method: 'post',
    data: options
  })
}
