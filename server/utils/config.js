const { env } = require('./env')

const UPLOAD_URL = env === 'dev' ? 'http://localhost:3000/' : 'http://47.112.156.65:3000/'

module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 200,
  PWD_SALT: 'blog_imooc_node',
  PRIVATE_KEY: 'blog_imooc_node_shan',
  JWT_EXPIRED: 60 * 60,
  CODE_TOKEN_ERROR: -2,
  UPLOAD_URL,
  COLLECT_PATH: './public/blog',
  IMAGE_PATH: './public/images',
  FAVORITES_PATH: './public/uploads',
  TIAN_API_PATH: 'http://api.tianapi.com/it/index',
  TIAN_API_KEY: '14ec84bf63d64c075e4d1744dc4110ac',
  MAIL_USER: '272781702@qq.com',
  MAIL_KEY: 'bnyrpbpubydicbbh',
  MAIL_HOST: 'smtp.qq.com',
  GIT_LOGIN_URL: 'https://api.github.com/user?access_token=',
  GET_GIT_ACCESS_TOKEN_URL: 'https://github.com/login/oauth/access_token'
}
