
const { Carousel } = require('../db')
const DatabaseOperation = require('./DatabaseOperation')

class Admin {
  LunboIcon(iconId, oldIconId, callback) {
    new DatabaseOperation(Carousel).findOne({ iconId }).then(list => {
      new DatabaseOperation(Carousel).findByIdAndUpdate({ _id: list._id }, { iconId: oldIconId })
      callback()
    })
  }
}

module.exports = Admin