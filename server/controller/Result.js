const {
  CODE_SUCCESS,
  CODE_ERROR,
  CODE_TOKEN_ERROR
} = require('../utils/config')

class Result {
  constructor(data, msg, options) {
    this.data = null
    if(arguments.length === 0) {
      this.msg = '操作成功！'
    } else if (arguments.length === 1) {
      this.msg = typeof data !== 'string' ? '操作成功！' : data
      this.data = data
    } else {
      this.data = data
      this.msg = msg
      if(options) this.options = options
    }
  }

  content() {
    if(!this.code) {
      this.code = CODE_SUCCESS
    }

    let base = {
      code:this.code,
      msg: this.msg
    }

    if(this.data) {
      base.data = this.data
    }

    if(this.options) {
      base.options = this.options
    }

    return base
  }

  success(res) {
    this.code = CODE_SUCCESS
    this.send(res)
  }

  fail(res) {
    this.code = CODE_ERROR
    this.send(res)
  }

  send(res) {
    res.send(this.content())
  }

  tokenError(res) {
    this.code = CODE_TOKEN_ERROR
    this.send(res)
  }
}

module.exports = Result
