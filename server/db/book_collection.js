/*

  书籍收藏夹

*/

const mongoose = require('./config')

const bookCollection = mongoose.Schema({
  book_id: { type: String }, // 书籍ID
  user_id: { type: String }, // 收藏用户ID
  look_position: { type: String } // 看到哪
})

const BookCollection = mongoose.model('book_collection', bookCollection)

module.exports = BookCollection