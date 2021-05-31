const { GET_GIT_ACCESS_TOKEN_URL, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/config')
const Result = require('./Result')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

class User {
  constructor(jurisdiction = 0) {
    this.jurisdiction = jurisdiction
    this.NUM = 1
    this.jurisdictObj = {
      TOURIST_JWT: this.NUM << 0, // 游客权限
      BLOGGER_JWT: this.NUM << 1, // 博主权限 （包含游客）
      ADMIN_JWT: this.NUM << 2 // 炒鸡管理员权限 （包含博主跟游客）
    }
  }

  isAdmin() {
    return this.NUM << this.jurisdiction === this.jurisdictObj.ADMIN_JWT
  }

  isBlogger() {
    return this.NUM << this.jurisdiction === this.jurisdictObj.BLOGGER_JWT
  }

  isTourist() {
    return this.NUM << this.jurisdiction === this.jurisdictObj.TOURIST_JWT
  }

  async getGitAccessToken(params) {
    await fetch(GET_GIT_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(res => {
      return res.text()
    }).then(body => {
      const args = body.split('&')
      const arg = args[0].split('=')
      const access_token = arg[1]
      return access_token
    })
  }

  handleJwt(username, jurisdiction, res, type = 'login') {
    const token = jwt.sign(
      { username, jurisdiction: jurisdiction },
      PRIVATE_KEY,
      { expiresIn: JWT_EXPIRED }
    )
    new Result({ token }, type === 'login' ? '登录成功！' : '注册成功！').success(res)
  }
}

module.exports = User
