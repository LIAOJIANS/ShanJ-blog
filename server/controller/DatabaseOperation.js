const Result = require('./Result')

class DatabaseOperation {
  constructor(DbExample, res = null) {
    this.DbExample = DbExample
    this.res = res
  }

  save(options) {
    const example = this.DbExample
    return new Promise((resolve, resject) => {
      new example(options).save((err, data) => {
        !err ? resolve(data) : new Result(err.message).fail(this.res)
      })
    })
  }

  find(options = {}, pagingOptions = { isPaging: false }) {
    const { pageSize, pageNum, isPaging } = pagingOptions
    return new Promise((resolve, resject) => {
      this.DbExample.find(options, (err, data) => {
        if(isPaging) {
          !err ? resolve(data) : new Result(err.message).fail(this.res)
        } else {
          this.DbExample.find(options).skip((pageNum - 1) * pageSize).limit(pageSize).exec((err, list) => {
            !err ? resolve({ allData: data, data: list, total: data.length, pageSize, pageNum}) : new Result(err.message).fail(this.res)
          })
        }
      })
    })
  }

  findOne(options) {
    return new Promise((resolve, resject) => {
      this.DbExample.findOne(options, (err, data) => {
        !err ? resolve(data) : new Result(err.message).fail(this.res)
      })
    })
  }

  findByIdAndUpdate(whereOptions, data) {
    return new Promise((resolve, resject) => {
      this.DbExample.findByIdAndUpdate(whereOptions, data, (err, list) => {
        !err ? resolve(list) : new Result(err.message).fail(this.res)
      })
    })
  }

  remove(options) {
    return new Promise((resolve, resject) => {
      this.DbExample.remove(options, (err, res) => {
        !err ? resolve(res) : new Result(err.message).fail(this.res)
      })
    })
  }
}

module.exports = DatabaseOperation