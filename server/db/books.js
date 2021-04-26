/*

  书籍列表

*/

const mongoose = require('./config')

const books = mongoose.Schema({
  book_name: { type: String }, // 书名
  book_type: { type: String }, // 分类
  book_url: { type: String }, // 访问地址
  book_dow_num: { type: Number }, // 下载数量
  book_collection_num: { type: Number }, // 收藏数量
  book_image_url: { type: String }, // 封面地址
  book_publisher_username: { type: String }, // 发布人
  book_publisher_time: { type: String } // 发布时间
})

const Books = mongoose.model('books', books)

module.exports = Books