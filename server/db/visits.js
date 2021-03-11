/*
  访问量表
*/
const mongoose = require('./config')
const visits = mongoose.Schema({
  counts: { type: Number, require: true },
  ip: { type: String, require: true }
})

const Visits = mongoose.model('visits', visits)

module.exports = Visits