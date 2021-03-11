const mongoose = require('./config')

const carousel = mongoose.Schema({
  IconImgUrl: {type: String, require: true},
  iconId: {type: String, require: true},
})

const Carousel = mongoose.model('carousel', carousel)

module.exports = Carousel