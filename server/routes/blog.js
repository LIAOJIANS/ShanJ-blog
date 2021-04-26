const express = require('express');
const router = express.Router();
const multer = require('multer')
const { Blog, Like } = require('../db')
const { time } = require('js-hodgepodge')
const { body } = require('express-validator')
const { COLLECT_PATH } = require('../utils/config')
const { errorChecking } = require('../utils')
const { DatabaseOperation, Result, BlogHandle, File } = require('../controller')

// 上传博客 => 上传现成MD文件
router.post('/uploadBold', multer({ storage: multer.diskStorage({ destination: (req, file, cb) => {
  cb(null, `${COLLECT_PATH}`)
}, filename: (req, file, cb) => {
  cb(null, file.originalname)
}}) }).single('file'), 
[
  body('fz').isLength({ min: 0 }).withMessage('当前分组不能为空'),
], (req, res, next) => {
  try {
    errorChecking(req, next, async () => {
      const { fz } = req.body
      let blogTitle = req.file.originalname
      const blogLookNumber = 0,
        blogDNumber = 0
      const blogUrl = `${ COLLECT_PATH }${ fz ? '/' + fz : '' }/${ blogTitle }`
      if(await new BlogHandle().fileGroup(fz, blogTitle)) {
        return new Result('标题已存在，请更换标题再次上传').fail(res)
      }
      if (fz) {
        new Result(`上传成功，已上传至${fz}分组`).success(res)
      } else {
        new Result(`已上传至无分组`).success(res)
      }
      const currentTime = time.dateFormat({
        time: new Date().getTime()
      })
      new DatabaseOperation(Blog, res).save({
        blogTitle: blogTitle.split('.md')[0],
        blogLookNumber,
        blogDNumber,
        fzName: fz || '全部',
        currentTime,
        content: await new BlogHandle().getBlogContent(blogUrl, blogTitle),
        blogUrl
      })
    })
  } catch(e) {
    new Result('未知错误').success(res)
  }
})

// 上传博客-> 写入MD文件
router.post('/publishBlog', [
  body('mdContent').isLength({ min: 0 }).withMessage('发布内容不能为空'),
  body('fz').isLength({ min: 0 }).withMessage('当前分组不能为空'),
  body('blogTitle').isLength({ min: 0 }).withMessage('博客名称不能为空'),
], (req, res, next) => {
  errorChecking(req, next, async () => {
    const { mdContent, fz, blogTitle } = req.body
    const blogLookNumber = 0,
        blogDNumber = 0
    const blogUrl = `${ COLLECT_PATH }${ fz ? '/' + fz : '' }/${ blogTitle }.md`
    new File().writeFile({
      filename: blogUrl,
      data: mdContent,
      cb: err => !err && new Result(fz ? `上传成功，已上传至${fz}分组` : '已上传至无分组').success(res)
    })

    new DatabaseOperation(Blog, res).save({
      blogTitle: blogTitle,
      blogLookNumber,
      blogDNumber,
      fzName: fz || '全部',
      currentTime: time.dateFormat({ time: new Date().getTime()}),
      content: await new BlogHandle().getBlogContent(blogUrl, blogTitle),
      blogUrl
    })
  })
})

// 写入MD，校验博客标题唯一性
router.post('/check_blog_unique', [
  body('blogTitle').isLength({ min: 0 }).withMessage('博客名称不能为空')
], (req, res, next) => {
  errorChecking(req, next, () => {
    const { blogTitle } = req.body

    if(!blogTitle) {
      return  new Result('博客名不能为空').fail(res)
    }

    new DatabaseOperation(Blog, res).find({}, { isPaging: true }).then(list => {
      list.some(c => c.blogTitle === blogTitle) ?
       new Result('博客名已存在').fail(res) : 
       new Result().success(res)
    })
  })
})

// 获取所有博客
router.post('/getBoldList', 
[
  body('pageNum').isLength({ min: 0 }).withMessage('页码不能为空'),
  body('pageSize').isLength({ min: 0 }).withMessage('每页数不能为空'),
], (req, res, next) => {
  errorChecking(req, next, ()=> {
    const { pageNum, pageSize } = req.body
    try {
      // new BlogHandle().getBoldList(COLLECT_PATH, data => {
      //   const total = data.length
      //   let allLookNumber = 0
      //   let dzNumber = 0
      //   let newArr = []
      //   data.forEach((item, index) => {
      //     if (item.blogLookNumber) allLookNumber += item.blogLookNumber
      //     if (item.blogDNumber) dzNumber += item.blogDNumber
      //     if (pageNum === 1) {
      //       if (index < pageSize) {
      //         newArr.push(item)
      //       }
      //     } else {
      //       if (pageSize * (pageNum - 1) <= index && pageSize * pageNum >= index) {
      //         newArr.push(item)
      //       }
      //     }
      //   })
      //   new Result({ data: newArr, total, dzNumber, allLookNumber }).success(res)
      // })
      new DatabaseOperation(Blog, res).find({}, { pageSize, pageNum, isPaging: false }).then(data => {
        new Result({
          ...data,
          allLookNumber: data.allData.reduce((n, i) => (i.blogLookNumber + n), 0),
          dzNumber: data.allData.reduce((n, i) => (i.blogDNumber + n), 0)
        }).success(res)
      })
    } catch(e) {
      console.log(e)
    }
  })
})

// 创建博客分组
router.post('/createFz', [
  body('fzName').isLength({ min: 0 }).withMessage('分组名称不能为空')
], (req, res, next) => {
  errorChecking(req, next, () => {
    const { fzName } = req.body
    let boldList = new File().readdirSync(COLLECT_PATH)
    if (boldList.some(item => (item === fzName))) { 
      return new Result('创建失败，已有该分组，请重新创建！').fail(res)
    }
    new File().mkdir(`${ COLLECT_PATH }/${ fzName }`, (err) => {
      new Result( `创建${fzName}分组成功`).success(res)
    });
  })
})

// 获取分组列表
router.get('/getFzList',  (req, res) => {
  let boldList = new File().readdirSync(COLLECT_PATH)
  let result = [] // 分组数组
  boldList.forEach(item => {
    if (!item.endsWith('.md')) {
      result.push(item)
    }
  })
  new Result(result).success(res)
})

// 获取博客详情
router.post('/blodInfo', [
  body('id').isLength({ min: 0 }).withMessage('ID不能为空')
], (req, res, next) => {
  errorChecking(req, next, () => {
    try {
      const { id } = req.body
      new DatabaseOperation(Blog, res).findOne({_id: id}).then(async info => {
        const { fzName, blogTitle, currentTime } = info
        const path = fzName !== '全部' ?  `${COLLECT_PATH}/${fzName}/${blogTitle}.md` : `${COLLECT_PATH}/${blogTitle}.md`
        let counts = info.blogLookNumber + 1
        let obj = {
          id: info._id,
          blogDNumber: info.blogDNumber,
          blogLookNumber: counts
        }
        await new DatabaseOperation(Blog, res).findByIdAndUpdate({_id: info.id}, {blogLookNumber: counts * 1})
        new BlogHandle().blogInfo(path, blogTitle, fzName, currentTime, data => {
          new Result({
            ...obj,
            ...data
          }).success(res)
        })
      })
    } catch(e) {
      console.log(e)
    }
  })
})

// 分类查询
router.get('/blodfzinfo', function (req, res) {
  new BlogHandle().getFzList(data => {
    new Result(data).success(res)
  })
})

// 热门阅读
router.get('/blogTitleList', (req, res) => {
  new DatabaseOperation(Blog).find().then(list => {
    let data = list.data.sort((a, b) => {
      return b.blogLookNumber - a.blogLookNumber
    })
    new Result(data).success(res)
  })
})

// 博客点赞
router.post('/blogD', [
  body('id').isLength({ min: 0 }).withMessage('博客标题id不能为空！')
], (req, res, next) => {
  errorChecking(req, next, ()=> {
    const { id, userId } = req.body
    new DatabaseOperation(Like, res).find({ userId }, { isPaging: true }).then(list => {
      new DatabaseOperation(Blog, res).findOne({ _id: id }).then(async info => {
        if (list.some(i => i.dianA === info.blogTitle)) {
          return new Result('已经点过赞！').fail(res)
        }
        await new DatabaseOperation(Blog, res).findByIdAndUpdate({ _id: info._id }, { blogDNumber: info.blogDNumber + 1 })
          new BlogHandle().details(userId, id, info.blogTitle, res)
      })
    })
  })
})

router.get('/blog_like_list', [
  body('id').isLength({ min: 0 }).withMessage('用户ID不能为空！')
], (req, res, next) => {
  errorChecking(req, next, () => {
    const { id } = req.query
    new DatabaseOperation(Like, res).find({ userId: id }, { isPaging: true }).then(list => {
      new Result(list).success(res)
    })
  })
})

// 博客分组列表
router.get('/fzItemList', (req, res) => {
  let boldList = new File().readdirSync(COLLECT_PATH)
  let result = []
  boldList.forEach(item => {
    if (!item.endsWith('.md')) {
      result.push(item)
    }
  })
  new Result(result).success(res)
})

// 博客模糊查询
router.post('/fuzzySearch', [
  body('fzName').isLength({ min: 0 }).withMessage('分组名不能为空！')
], (req, res, next) => {
  errorChecking(req, next, () => {
    const { fzName } = req.body
    new DatabaseOperation(Blog, res).find({ fzName }).then(info => {
      new Result(info.data).success(res)
    })
  })
})




// 搜索分组

module.exports = router;

/* 明天待改：，2、分组详情的数据不全*/
