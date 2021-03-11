const express = require('express');
const router = express.Router();
const multer = require('multer')
const { Carousel } = require('../db')
const { body } = require('express-validator')
const { IMAGE_PATH, UPLOAD_URL } = require('../utils/config')
const { errorChecking } = require('../utils')
const { BlogHandle, Result, DatabaseOperation, File, Admin } = require('../controller')

router.post('/delBolg',
  [ 
    body('fz').isLength({ min: 0 }).withMessage('当前分组不能为空'),
    body('bolgTitle').isLength({ min: 0}).withMessage('博客名称不能为空'),
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
    body('bolgTitle').isLength({ min: 0}).withMessage('博客名称不能为空'),
    body('newFz').isLength({ min: 0}).withMessage('新分组名不能为空'),
  ], (req, res, next) => {
    errorChecking(req, next, () => {
      const { fz, bolgTitle, newFz } = req.body
      new BlogHandle().changeFz(new BlogHandle().isAllBlog(fz), bolgTitle, newFz, () => {
        new Result('更新成功').success(res)
      })
    })
  })

router.post('/uploadLunBo', 
  multer({ dest: `${ IMAGE_PATH }` }).single('file'),
  [ 
    body('iconId').isLength({ min: 0 }).withMessage('轮播ID不能为空'),
  ], (req, res, next) => {
    errorChecking(req, next, () => {
      const { iconId } = req.body
      const IconImgUrl = UPLOAD_URL + req.file.path
      new DatabaseOperation(Carousel).find({}, { isPaging: true }).then(list => {
        if(list.length >= 5) {
          new Result('轮播图数量上线').fail(res)
          new File().unlink(file.path)
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
  multer({ dest: `${ IMAGE_PATH }` }).single('file'), 
  [ 
    body('iconId').isLength({ min: 0 }).withMessage('iconId不能为空'),
    body('id').isLength({ min: 0}).withMessage('id不能为空'),
    body('oldIconId').isLength({ min: 0}).withMessage('oldIconId不能为空'),
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
      const oldLunbo = './' + info.IconImgUrl.split("/")[3]
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


router.post('/delLunBo', 
  [ 
    body('id').isLength({ min: 0 }).withMessage('id不能为空')
  ], (req, res, next) => {
    errorChecking(req, next, () => {
      const { id } = req.body
      new DatabaseOperation(Carousel).findOne({ _id: id }).then(info => {
        const oldLunbo = './' + info.IconImgUrl.split("/")[3]
        new File().unlink(oldLunbo, error => {
          if (error) return
          new DatabaseOperation(Carousel).remove({ _id: id }).then(info => {
            new Result('删除成功').success(res)
          })
        })
      })
    })
})


module.exports = router;