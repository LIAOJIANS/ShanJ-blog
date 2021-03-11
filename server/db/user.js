/**
 * 用户表
 */


const mongoose = require('./config')

const user = mongoose.Schema({
  avatar_url: {type: String},
  username: {type: String, require: true},
  password: {type: String, require: true},
  countIp: {type: Number},
  isZan: {type: Boolean},
  jurisdiction: { type: Number, require: true }
})

const User = mongoose.model('user', user)

module.exports = User
