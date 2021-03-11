/*
  收藏夹列表
*/

const mongoose = require('./config')

const collection = mongoose.Schema({
  workName: {type: String, require: true},
  workSrc: {type: String, require: true},
  workImg: {type: String, require: true},
  isLook: { type: Boolean, require: true },
  workIntroduction: {type: String, require: true},
})

const Collection = mongoose.model('collection', collection)

module.exports = Collection