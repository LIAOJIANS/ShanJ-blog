const fs = require('fs')
const { COLLECT_PATH } = require('../utils/config')

class File {
  constructor() {}
  fileRename(fromPath, toPath, cb = null) { // 剪切
    fs.rename(`${COLLECT_PATH}/${fromPath}`, `${COLLECT_PATH}/${toPath}`,  (err) => {
      cb?.(err)
    })
  }

  readdirSync(path) { // 查找当前文件下的所有文件
    return fs.readdirSync(path)
  }
  
  createReadStream(path, options) { // 开启文档流
    return fs.createReadStream(path, options)
  }

  mkdir(path, cb) {
    fs.mkdir(path, cb)
  }

  readFile(path, cb) {
    fs.readFile(path, cb)
  }
  
  unlink(path, cb) {
    fs.unlink(path, cb)
  }

  writeFile(options) {
    const { filename, data, option = {}, cb } = options
    fs.writeFile(filename, data, option, cb)
  }
}

module.exports = File

