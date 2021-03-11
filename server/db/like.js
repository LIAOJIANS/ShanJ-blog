
/*
博客点赞表
*/

const mongoose = require('./config')

const like = mongoose.Schema({
  userId: {type: String},
  bId: { type: String },
  dianA: {type: String}
})

const Like = mongoose.model('like', like)

module.exports = Like
