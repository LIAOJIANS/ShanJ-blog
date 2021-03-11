/*
反馈墙表
*/

const mongoose = require('./config')

const feedbackWall = mongoose.Schema({
  userId: {type: String, require: true},
  username: {type: String, require: true},
  avatar_url: {type: String, require: true},
  content: {type: String, require: true},
  current_time: {type: String, require: true}
})

const FeedbackWall = mongoose.model('feedback_wall', feedbackWall)

module.exports = FeedbackWall