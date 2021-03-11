/*
  博客列表
*/

const mongoose = require('./config')

const blog = mongoose.Schema({
  blogTitle: {type: String, require: true},
  blogLookNumber: {type: Number, require: true},
  blogDNumber: {type: Number, require: true},
  fzName: {type: String, require: true},
  currentTime: {type: String, require: true},
  content: { type: String, require: true },
  blogUrl: { type: String, require: true }
})

const Blog = mongoose.model('blog', blog)
module.exports = Blog
