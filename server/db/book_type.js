/*

  书籍分类

*/

const mongoose = require('./config')

const bookType = mongoose.Schema({
  book_type_name: { type: String }, // 分类名称
})

const BookType = mongoose.model('book_type', bookType)

module.exports = BookType