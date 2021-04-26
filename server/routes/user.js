const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const multer = require('multer')
const md5 = require('blueimp-md5')
const fetch = require('node-fetch')
const moment = require('moment');
const { FAVORITES_PATH, UPLOAD_URL, GIT_LOGIN_URL, TIAN_API_KEY, TIAN_API_PATH } = require('../utils/config')
const { errorChecking, getClientIP } = require('../utils')
const { Collection, User, Visits, Like, FeedbackWall } = require('../db')
const fs = require('fs')
const sendMail = require('../utils/send')
const { DatabaseOperation, Result, UserHandle } = require('../controller')
const { decoded } = require('../utils/user')

const filter = { password: 0, __v: 0 } // 指定过滤的属性

router.post('/addWork',
multer({ dest: `${ FAVORITES_PATH }`}).single('file'), (req, res) => {
  const decode = decoded(req)
  if(decode && decode.username) {
    const { workName, workSrc, workIntroduction } = req.body
    const fileObj = {
      workName,
      workSrc,
      workIntroduction,
      workImg: UPLOAD_URL + req.file.path,
      isLook: false
    }
    new DatabaseOperation(Collection, res).save(fileObj).then(data => {
      new Result(data, '上传成功！').success(res)
    })
  }
})

// 更新收藏夹
router.post('/updataWork', multer({ dest: `${ FAVORITES_PATH }` }).single('file'), (req, res) => {
  const { workName, workSrc, workIntroduction, workId } = req.body
  const workImg = UPLOAD_URL + req.file.path
  new DatabaseOperation(Collection, res).findOne({_id: workId}).then(data => {
    const imgArr = data.workImg.split('\\')
    let boldList = fs.readdirSync(FAVORITES_PATH)
    boldList.forEach(item => {
      if (item === imgArr[2]) {
        return fs.unlink(item, (error) => {
          new DatabaseOperation(Collection, res).findByIdAndUpdate({_id: workId}, {
            workName,
            workSrc,
            workIntroduction,
            workImg
          }).then(data => {
            new Result(data, '更新成功!').success(res)
          })
        })
      }
    })
  })
})

// 项目列表
router.get('/workList', (req, res, next) => {
  try {
    new DatabaseOperation(Collection, res).find({}, { isPaging: true }).then(data => {
      new Result(data, '获取成功').success(res)
    })
  }catch(e) {
    console.log(e)
  }
})

router.post('/peopleLook',
  [
    body('isLook').isLength({ min: 0 }).withMessage('isLook不能为空'),
    body('id').isLength({ min: 0 }).withMessage('当前项目ID不能为空')
  ], (req, res, next) => {
    errorChecking(next, req, () => {
      const { isLook, id } = req.body
      new DatabaseOperation(Collection, res).findByIdAndUpdate({ _id: id }, { isLook }).then(data => {
        new Result(data, '获取成功！').success(res)
      })
    })
})

// 会员注册
let YZM_CODE = '';//新建一个空字符存放验证码，可供全局调用
router.post('/register',
[
  body('username').isLength({ min: 0 }).withMessage('用户名不能为空'),
  body('password').isLength({ min: 0 }).withMessage('密码不能为空'),
  body('yzm').isLength({ min: 4, max: 4 }).withMessage('验证码不正确')
], (req, res, next) => {
  errorChecking(next, req, () => {
    const { username, password, yzm } = req.body
    if (yzm !== YZM_CODE) {
      return new Result('验证码不正确').fail()
    }
    new DatabaseOperation(User, res).findOne({ username }).then(data => {
      data ? new Result(data, '此用户已注册').fail(res) 
      : new DatabaseOperation(User, res).save({ username, password: md5(password), countIp: 0, isZan: false, jurisdiction: 1 }).then(data => {
        new UserHandle().handleJwt(data, data.jurisdiction, res, 'register')
      })
      
    })
  })
})

//邮箱验证接口
router.post('/sendEmail',  
[
  body('username').isEmail().withMessage('邮箱格式不正确')
], (req, res, next) => {
  errorChecking(next, req, () => {
    YZM_CODE = '' // 初始化验证码容器
    let { username } = req.body
    for (let i = 0; i < 4; i++) {
      YZM_CODE += Math.floor(Math.random() * 10) // 生成4个随机数
    }
    sendMail.send(username, YZM_CODE)
    new Result(YZM_CODE, '已发送至邮箱').success(res)
  })
})

// 获取用户信息
router.get('/userInfo', (req, res, next) => {
  const decode = decoded(req)
  if(decode?.username) {
    let countIp = 0
    new DatabaseOperation(User, res).findOne({ username: decode.username }, filter).then(info => {
      countIp = info.countIp + 1
      new DatabaseOperation(User, res).findByIdAndUpdate({ _id: info._id }, { countIp: Number(countIp) }).then(user => {
        new DatabaseOperation(Like, res).find({}, true).then(list => {
          new Result({
            userInfo: user,
            dianA: list.data.map(i => i.userId === user._id)
          }, '获取成功').success(res)
        })
      })
    })
  }
})

// 会员登录
router.post('/login', [
  body('password').isLength({ min: 0 }).withMessage('账号不能为空'),
  body('username').isLength({ min: 0 }).withMessage('密码不能为空')
], (req, res, next) => {
  errorChecking(next, req, () => {
    const { username, password } = req.body
    new DatabaseOperation(User, res).findOne({username, password: md5(password)}, filter).then(user => {
      if(!user) { return  new Result('登录失败').fail(res) }
      new UserHandle().handleJwt(username, user.jurisdiction, res, 'login')
    })
  })
})

// 统计总访问次数
router.get('/counts', (req, res) => {
  const ip = getClientIP(req)
  new DatabaseOperation(Visits, res).findOne({ ip }).then(async curUser => {
    if(!curUser) {
      await new DatabaseOperation(Visits, res).save({ counts: 1, ip })
    } else {
      curUser.counts += 1
      await new DatabaseOperation(Visits, res).findByIdAndUpdate({ _id: curUser._id }, { counts: Number(curUser.counts), })
    }
    new DatabaseOperation(Visits, res).find({}, true).then(counts => {
      new Result(counts.data, '查找成功').success(res)
    })
  })
})

// 删除项目
router.post('/delWork',  [
  body('id').isLength({ min: 0 }).withMessage('项目ID不能为空')
], (req, res, next) => {
  const { id } = req.body
  errorChecking(next, req, () => {
    const decode = decoded(req)
    if(decode && decode.jurisdiction) {
      new UserHandle(decode.jurisdiction).isAdmin() ? new DatabaseOperation(Collection, res).remove({ _id: id }).then(data => {
        new Result('删除成功').success(res)
      }) : new Result('权限不够，删除失败').fail(res)
    }
  })
})

// git登录
router.post('/accessToken', [
  body('client_id').isLength({ min: 0 }).withMessage('client_id不能为空'),
  body('client_secret').isLength({ min: 0 }).withMessage('client_secret不能为空'),
  body('code').isLength({ min: 0 }).withMessage('code不能为空')
], (req, res, next) => {
  errorChecking(next, req, async () => {
    const config = req.body
    const params = {
      client_id: config.client_id,
      client_secret: config.client_secret,
      code: config.code
    }
    let access_token = await new UserHandle().getGitAccessToken(params)
    await fetch(GIT_LOGIN_URL + access_token).then(token => {
        return token.json();
      }).then(gitUserInfo => {
        new DatabaseOperation(User, res).findOne({username: gitUserInfo.login}).then(user => {
          if (!users) {
            new DatabaseOperation(User, res).save({
              username: gitUserInfo.login,
              password: md5('123456'),
              avatar_url: gitUserInfo.avatar_url,
              countIp: 0,
              isZan: false,
              jurisdiction: 0
            }).then(data => {
              new UserHandle().handleJwt(data.username, data.jurisdiction, res)
            })
          } else {
            new UserHandle().handleJwt(gitUserInfo.username, gitUserInfo.jurisdiction, res)
          }
        })
      }).catch(e => {
        console.log(e)
        new Result('登录失败').fail(res)
      })
  })
})

// 对博客点赞
router.get('/zan', (req, res) => {
  const { username } = decoded(req)
  new DatabaseOperation(User, res).findOne({ username }).then(user => {
    if(user.isZan) { 
      return  new Result('已经点过赞了，请勿点赞！').fail(res)
    }
    new DatabaseOperation(User, res).findByIdAndUpdate({ _id: user._id }, { isZan: true }).then(info => {
      new Result('点赞成功').success(res)
    })
  })
})

// 查询反馈前博客点赞人数
// router.get('/zanNumber', (req, res) => {
//   new DatabaseOperation(FeedbackWall, res).find({}, { isPaging: true }).then(list => {
//     let zanNumber = 0
//     list.forEach(item => {
//       if (item.isZan) {
//         zanNumber += 1
//       }
//     })
//     new Result(zanNumber).success(res)
//   })
// })

// 发布反馈
router.post('/subWall', [
  body('wallInfo').isLength({ min: 0 }).withMessage('wallInfo不能为空'),
], (req, res, next) => {
  errorChecking(next, req, () => {
    const { username } = decoded(req)
    const { wallInfo } = req.body
    new DatabaseOperation(User, res).findOne({ username }).then(user => {
      const current_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      new DatabaseOperation(FeedbackWall, res).save({
        userId: user._id,
        username: user.username,
        avatar_url: user.avatar_url || '',
        content: wallInfo,
        current_time
      }).then(info => {
        new Result('感谢您的反馈，祝您生活愉快！').success(res)
      })
    })
  })
})

// 反馈墙列表
router.get('/wallList', (req, res, next) => {
  new DatabaseOperation(FeedbackWall, res).find({}, { isPaging: true }).then(list => {
    new Result({
      list,
      total: list.length
    }).success(res)
  })
})

// 随机IT新闻资讯
router.post('/newsData', [
  body('page').isLength({ min: 0 }).withMessage('page不能为空'),
], (req, res, next) => {
  errorChecking(next, req, () => {
    let path = `${ TIAN_API_PATH }?key=${ TIAN_API_KEY }&page=${ req.body.page }`
    fetch(path).then(res => { // 转为JSON格式
      return res.json();
    }).then(data => {
      new Result(data).success(res)
    })
  })
})


module.exports = router;
