const { body } = require('express-validator');
const { DatabaseOperation, Result } = require('../controller');
const express = require('express');
const router = express.Router();
const { Blog } = require('../db');
const { errorChecking } = require('../utils');

router.post('/content', [
  body('searchValue').isLength({ min: 0 }).withMessage('searchValue不能为空')
], (req, res, next) => {
    errorChecking(req, next, () => {
      const { searchValue } = req.body
      new DatabaseOperation(Blog, res).find({}, { isPaging: true }).then(list => {
        const result = list.filter(item => item.blogTitle.indexOf(searchValue) !== -1)
        new Result(result).success(res)
      })
    })
  })

    
module.exports = router
