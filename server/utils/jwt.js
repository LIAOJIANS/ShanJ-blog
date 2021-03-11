const jwt = require('express-jwt')
const { PRIVATE_KEY } = require('./config')

const jwtAuth = jwt({
  secret: PRIVATE_KEY,
  credentialRequired: true
}).unless({
  path: [
    '/api',
    '/api/blog/blodfzinfo',
    '/api/blog/getBoldList',
    '/api/blog/fzItemList',
    '/api/blog/blogTitleList',
    '/api/blog/blodInfo',
    '/api/blog/blog_like_list',
    '/api/blog/getFzList',
    '/api/user/login',
    '/api/admin/lunboList',
    '/api/user/sendEmail',
    '/api/user/register',
    '/api/user/counts',
    '/api/user/workList',
    '/api/user/newsData',
    '/api/user/zanNumber',
    '/api/user/wallList',
    '/api/user/accessToken',
    '/api/search/content',
    '/api/blog/fuzzySearch'
  ]
})

module.exports = {
  jwtAuth
}
