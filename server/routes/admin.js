const express = require('express')
const router = express.Router()
const multer = require('multer')
const { Carousel, Books, BookCollection, BookType, User } = require('../db')
const { body } = require('express-validator')
const { IMAGE_PATH, UPLOAD_URL, BOOK_IMG_PATH, BOOL_PATH } = require('../utils/config')
const { errorChecking } = require('../utils')
const { BlogHandle, Result, DatabaseOperation, File, Admin } = require('../controller')
const { decoded } = require('../utils/user')
const { time } = require('js-hodgepodge')

router.post('/delBolg',
  [
    body('fz').isLength({ min: 0 }).withMessage('当前分组不能为空'),
    body('bolgTitle').isLength({ min: 0 }).withMessage('博客名称不能为空')
  ], (req, res, next) => {
    errorChecking(req, next, () => {
      const { fz, bolgTitle } = req.body
      new BlogHandle().delBlog(new BlogHandle().isAllBlog(fz), bolgTitle, () => {
        new Result('删除成功').success(res)
      })
    })
  })

router.post('/changeFz',
  [
    body('fz').isLength({ min: 0 }).withMessage('当前分组不能为空'),
    body('bolgTitle').isLength({ min: 0 }).withMessage('博客名称不能为空'),
    body('newFz').isLength({ min: 0 }).withMessage('新分组名不能为空')
  ], (req, res, next) => {
    errorChecking(req, next, () => {
      const { fz, bolgTitle, newFz } = req.body
      new BlogHandle().changeFz(new BlogHandle().isAllBlog(fz), bolgTitle, newFz, () => {
        new Result('更新成功').success(res)
      })
    })
  })

router.post('/uploadLunBo',
  multer({ dest: `${IMAGE_PATH}` }).single('file'),
  [
    body('iconId').isLength({ min: 0 }).withMessage('轮播ID不能为空')
  ], (req, res, next) => {
    errorChecking(req, next, () => {
      const { iconId } = req.body
      const IconImgUrl = UPLOAD_URL + req.file.path
      new DatabaseOperation(Carousel).find({}, { isPaging: true }).then(list => {
        if (list.length >= 5) {
          new Result('轮播图数量上线').fail(res)
          new File().unlink(req.file.path)
        } else {
          new DatabaseOperation(Carousel).save({
            IconImgUrl,
            iconId
          }).then(data => {
            new Result(data, '上传成功！').success(res)
          })
        }
      })
    })
  })

router.get('/lunboList', (req, res, next) => { // 轮播图列表
  new DatabaseOperation(Carousel).find({}, { isPaging: true }).then(data => {
    new Result(data).success(res)
  })
})

router.post('/updataLunBo',
  multer({ dest: `${IMAGE_PATH}` }).single('file'),
  [
    body('iconId').isLength({ min: 0 }).withMessage('iconId不能为空'),
    body('id').isLength({ min: 0 }).withMessage('id不能为空'),
    body('oldIconId').isLength({ min: 0 }).withMessage('oldIconId不能为空')
  ],
  (req, res, next) => {
    errorChecking(req, next, () => {
      const { iconId, id, oldIconId } = req.body
      if (!req.file) {
        new Admin().LunboIcon(iconId, oldIconId, () => {
          new DatabaseOperation(Carousel, res).findByIdAndUpdate({ _id: id }, { iconId }).then(list => {
            new Result('更新成功').success(res)
          })
        })
        return
      }
      const IconImgUrl = UPLOAD_URL + req.file.path
      new DatabaseOperation(Carousel, res).findOne({ _id: id }).then(info => {
        const oldLunbo = './' + info.IconImgUrl.split('/')[3]
        new File().unlink(oldLunbo, error => {
          if (error) return
          new Admin().LunboIcon(iconId, oldIconId, () => {
            new DatabaseOperation(Carousel, res).findByIdAndUpdate({ _id: id }, { iconId, IconImgUrl }).then(list => {
              new Result('更新成功').success(res)
            })
          })
        })
      })
    })
  })

// 上传书籍封面图
router.post('/upload_book_img',
  multer({ storage: multer.diskStorage({ destination: (req, file, cb) => {
    cb(null, `${BOOK_IMG_PATH}`)
  }, filename: (req, file, cb) => {
    cb(null, file.originalname)
  } }) }).single('file'), (req, res) => {
    req.file ? new Result({ imgUrl: UPLOAD_URL + req.file.path }, '上传成功').success(res) : new Result('上传失败').fail(res)
  })

// 上传书籍
router.post('/upload_book',
  multer({ storage: multer.diskStorage({ destination: (req, file, cb) => {
    cb(null, `${BOOL_PATH}`)
  }, filename: (req, file, cb) => {
    cb(null, file.originalname)
  } }) }).single('file'), (req, res) => {
    req.file ? new Result({ bookUrl: UPLOAD_URL + req.file.path }, '上传成功').success(res) : new Result('上传失败').fail(res)
  })

// 检查分类名称是否存在
router.post('/book_type_check', [
  body('book_type_name').isLength({ min: 0 }).withMessage('分类名称不能为空')
], (req, res, next) => {
  errorChecking(req, next, () => {
    new DatabaseOperation(BookType, res).findOne({ book_type_name: req.body.book_type_name }).then(data => {
      data ? new Result('分类名称已存在').fail(res) : new Result().success(res)
    })
  })
})

// 创建分类名称
router.post('/create_book_type', [
  body('book_type_name').isLength({ min: 0 }).withMessage('分类名称不能为空')
], (req, res, next) => {
  errorChecking(req, next, () => {
    new DatabaseOperation(BookType, res).save({ book_type_name: req.body.book_type_name }).then(() => new Result('创建成功').success(res))
  })
})

// 查询分类名称列表
router.get('/get_book_type', (req, res, next) => {
  new DatabaseOperation(BookType, res).find({}, { isPaging: true }).then(data => new Result(data).success(res))
})

// 新增书籍
router.post('/create_book', [
  body('book_name').isLength({ min: 0 }).withMessage('书籍名称不能为空'),
  body('book_type').isLength({ min: 0 }).withMessage('分类名称不能为空'),
  body('book_image_url').isLength({ min: 0 }).withMessage('封面地址不能为空'),
  body('book_url').isLength({ min: 0 }).withMessage('书籍地址不能为空')
], (req, res, next) => {
  errorChecking(req, next, () => {
    const {
      book_name,
      book_type,
      book_image_url,
      book_url,
      _id
    } = req.body
    if (!_id) {
      new DatabaseOperation(Books, res).save({
        book_name,
        book_type,
        book_image_url,
        book_url,
        book_publisher_username: decoded(req).username,
        book_dow_num: 0,
        book_collection_num: 0,
        book_publisher_time: time.dateFormat({ time: new Date().getTime() })
      }).then(data => new Result(data).success(res))
    } else {
      new DatabaseOperation(Books, res)
        .findOne({ _id })
        .then(info => new DatabaseOperation(Books, res)
          .findByIdAndUpdate({ _id }, {
            ...JSON.parse(JSON.stringify(info)),
            book_name,
            book_type,
            book_image_url,
            book_url
          })
          .then(data => {
            new Result(data).success(res)
          })
        )
    }
  })
})

// 书籍列表
router.get('/get_book_list', (req, res, next) => {
  new DatabaseOperation(Books, res).find({}, { isPaging: true }).then(data => new Result(data).success(res))
})

// 查询单个书籍
router.get('/select_book', (req, res, next) => {
  new DatabaseOperation(Books, res).findOne({ _id: req.query.id }).then(info => new Result(info).success(res))
})

// 删除书籍
router.get('/del_book', (req, res, next) => {
  new DatabaseOperation(Books, res).remove({ _id: req.query.id }).then(info => new Result(info).success(res))
})

// 保存书籍状态
router.post('/set_book_state',
  [
    body('book_id').isLength({ min: 0 }).withMessage('书名ID不能为空'),
    body('user_id').isLength({ min: 0 }).withMessage('用户ID不能为空'),
    body('look_position').isLength({ min: 0 }).withMessage('查看状态不能为空')
  ], (req, res, next) => {
    const {
      book_id,
      user_id,
      look_position
    } = req.body
    errorChecking(req, next, () => {
      new DatabaseOperation(BookCollection, res).findOne({ book_id, user_id }).then(info => {
        info
          ? new DatabaseOperation(BookCollection, res)
            .findByIdAndUpdate({ _id: info._id }, { ...JSON.parse(JSON.stringify(info)), look_position })
            .then(data => new Result(data).success(res))
          : new DatabaseOperation(BookCollection, res).save({ book_id, user_id, look_position }).then(info => new Result(info).success(res))
      })
    })
  })

router.get('/get_book_state', [
  body('user_id').isLength({ min: 0 }).withMessage('用户ID不能为空'),
  body('book_id').isLength({ min: 0 }).withMessage('书籍ID不能为空')
], (req, res, next) => {
  errorChecking(req, next, () => {
    const { book_id, user_id } = req.query
    new DatabaseOperation(BookCollection, res).findOne({ user_id, book_id }).then(info => {
      new DatabaseOperation(Books, res).findOne({ _id: book_id }).then(book =>
        new Result({
          bookTile: book.book_name,
          look_position: info.look_position,
          url: book.book_url
        }).success(res)
      )
    })
  })
})

router.post('/delLunBo',
  [
    body('id').isLength({ min: 0 }).withMessage('id不能为空')
  ], (req, res, next) => {
    errorChecking(req, next, () => {
      const { id } = req.body
      new DatabaseOperation(Carousel).findOne({ _id: id }).then(info => {
        const oldLunbo = './' + info.IconImgUrl.split('/')[3]
        new File().unlink(oldLunbo, error => {
          if (error) return
          new DatabaseOperation(Carousel).remove({ _id: id }).then(info => {
            new Result('删除成功').success(res)
          })
        })
      })
    })
  })

router.get('/get_user_list', (req, res) => {
  new DatabaseOperation(User, res).find({}, { isPaging: true }).then(list => new Result(list).success(res))
})

module.exports = router
