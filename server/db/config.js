// 1、链接数据库
const mongoose = require('mongoose')

// 1.2 链接制定数据
mongoose.connect('mongodb://localhost:27017/personal_blog')

// 1.3 获取链接对象
const conn = mongoose.connection

// 1.4 绑定链接完成的监听
conn.on('connected', () => {
  console.log('链接数据库成功咯！')
})

module.exports = mongoose
