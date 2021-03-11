const File = require('./File')
const { Blog, Like } = require('../db')
const DatabaseOperation = require('./DatabaseOperation')
const Result = require('./Result')
const marked = require('marked')
const { COLLECT_PATH } = require('../utils/config')

class BlogHandle extends File {
  constructor() {
    super()
    this.readStream = null
    this.result = []

    this.folderArr = []


    this.fzReadStream = null
    this.fzList = []
  }

  fileGroup(fzName, blogTitle) {
    return new Promise(resolve => {
      this.fileRename(blogTitle, `${fzName}/${blogTitle}`, err => {
        resolve(err)
      })
    })
  }

  getBlogContent(path) {
    return new Promise(reslove => {
      try {
        let content = ''
        const readStream = this.createReadStream(path, { // 开启文档流
          highWaterMark: 500
        })
        readStream.setEncoding('utf8')
        readStream.once('data', (chunk) => {
          marked(chunk)
          content = chunk
        })
        readStream.on('close', () => { // 关闭文档流
          reslove(content)
        })
      } catch(e) {
        console.log(e)
      }
    })
  }

  getBoldList(path, callback = null) {
    this.recursiveBlogList(path, '', true, this.readStream, data => { // 拿到递归数据返回给前端
      callback?.(resultData)
    })
  }

  async recursiveBlogList(path, fz = '', flag = false, readStream, cb = null) {
    let boldList = this.readdirSync(path)
    console.log(
      this.result.length)
    this.result = []
    if (boldList.length === 0) {
      return
    }
    for(let i = 0; i < boldList.length; i++) { // Bug: 全部模式的md文件没循环完就递归了，导致返回全部列表数据不全
      let item = boldList[i]
      let obj = {}
      if (item.endsWith('.md')) { // md文件
        obj.name = item.split('.md')[0]
        await new DatabaseOperation(Blog).findOne({ blogTitle: item.split('.md')[0] }).then(info => {
          const { id, currentTime, blogLookNumber, blogDNumber, blogTitle } = info
          obj = {
            id,
            blogTitle,
            currentTime,
            blogLookNumber,
            blogDNumber
          }
        })

        readStream = this.createReadStream(path + '/' + item, { // 开启文档流
          highWaterMark: 500
        })
        readStream.setEncoding('utf8')
        await readStream.once('data', (chunk) => {
          marked(chunk)
          obj.content = chunk
          // 添加分类
          path === COLLECT_PATH ? obj.fz = '全部' : obj.fz = fz
          this.result.push(obj)
        })
        console.log(this.result.length)
      } else { // 如果是文件夹
        this.folderArr = [...this.folderArr, {
          newPath: path + '/' + item,
          fz: item
        }]
      }
    }

    readStream.on('close', () => { // 关闭文档流
      cb && cb(this.result)
    })

  }

  blogInfo(path, blogTitle, fzName, currentTime, callback) { // 获取博客详情
    this.readFile(path, (err, data) => {
      if (err) {
        callback && callback('文件不存在')
      } else {
        const htmlStr = marked(data.toString())
        callback?.({
          htmlStr,
          blogTitle,
          fzName,
          currentTime
        })
      }
    })
  }

  getFzList(callback) {
    this.rFzList(data => { 
      callback && callback(data)
    })
  }
  rFzList(cb) {
    let boldList = this.readdirSync(COLLECT_PATH)
    boldList.forEach(items => {
      if (!items.endsWith('.md')) { // 如果是文件夹
        let obj = {
          fzName: items
        }
        // 拿到文件夹的数据
        let path = COLLECT_PATH + '/' + items
        let list = this.readdirSync(path)
        let fz = []
        if (list.length === 0) { 
          return 
        }
        list.forEach(item => { // 循环文件夹下的以.md结尾的文件
          if (item.endsWith('.md')) {
            let itemObj = {}
            itemObj.name = item.split('.md')[0]
            this.fzReadStream = this.createReadStream(path + '/' + item, { // 开启文档流
              highWaterMark: 500
            })
            this.fzReadStream.setEncoding('utf8')
            this.fzReadStream.once('data', function (chunk) {
              marked(chunk)
              itemObj.content = chunk // 文件内容
              fz.push(itemObj) // 添加的分组文件数组
            })
          }
        })
        this.fzReadStream.on('end', () => { // 监听文档流的关闭并添加数据
          obj.fz = fz
          this.fzList.push(obj)
        })
      }
    })
    this.fzReadStream.on('end', () => { // 返回最终数据
      cb && cb(this.fzList)
    })
  }

  details(userId, bId, blogTitle, res) {
    new DatabaseOperation(Like, res).save({ userId, bId, dianA: blogTitle }).then(list => {
      new Result('点赞成功!').success(res)
    })
  }

  // async fzSearch(fzName, path, cb) {
  //   const blogList = this.readdirSync(path)
  //   let readStream = null
  //   let result = []
  //   for(let i = 0; i < blogList.length; i++) {
  //     const item = blogList[i]
  //     let obj = {}
  //     if (item.endsWith('.md')) {
  //       obj.name = item.split('.md')[0]
  //       obj.fz = fzName
  //       await new DatabaseOperation(Blog).findOne({blogTitle: item.split('.md')[0]}).then(info => {
  //         const { id, currentTime, blogLookNumber, blogDNumber, blogTitle } = info
  //         obj = {
  //           id,
  //           currentTime,
  //           blogLookNumber,
  //           blogDNumber,
  //           blogTitle,
  //           fz: fzName
  //         }
  //       })
  //       readStream = this.createReadStream(path + '/' + item, { // 开启文档流
  //         highWaterMark: 500
  //       })
  //       readStream.setEncoding('utf8')
  //       readStream.once('data', function (chunk) {
  //         marked(chunk)
  //         obj.content = chunk
  //         result.push(obj)
  //       })
  //     }
  //   }
  //   readStream.on('end', function () { // 关闭文档流
  //     cb && cb(result)
  //   })
  // }

  delBlog(path, bolgTitle, callback) {
    let boldList = this.readdirSync(`${ COLLECT_PATH }/${path}`)
    boldList.forEach(item => {
      if (item.endsWith('.md')) {
        item === `${ bolgTitle }.md` && this.unlink(path + '/' + item,  error => {
          new DatabaseOperation(Blog).findOne({ blogTitle: bolgTitle }).then(async info => {
            await new DatabaseOperation(Blog).remove({ _id: info._id })
            callback?.()
          })
        })
      }
    })
  }
  changeFz(path, bolgTitle, newFz, callback) {
    let boldList = this.readdirSync(`${ COLLECT_PATH }/${path}`)
    boldList.forEach(item => {
      if (item.endsWith('.md')) {
        if(item === `${ bolgTitle }.md`){
          new DatabaseOperation(Blog).findOne({ blogTitle: bolgTitle }).then(info => {
            new DatabaseOperation(Blog).findByIdAndUpdate({ _id: info._id }, { fzName: newFz })
          })
          let newPath = newFz !== '全部' ? `${ newFz }/${ item }` : `${ item }`
          this.fileRename(path + '/' + item, newPath, (err) => {
            callback && callback()
          })
        }
      }
    })
  }
  isAllBlog(fzname) {
    return fzname !== '全部' ? `${ fzname }` : ``
  }
}

module.exports = BlogHandle