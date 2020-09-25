const mongoose = require('mongoose');
const DB_URL = "mongodb://localhost:27017/sh2007"; // sh2007 数据库的地址

// mongoose.connect(DB_URL);
// 根据警告的提示信息进行配置
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('数据库连接成功')
})

mongoose.connection.on('disconnected', () => {
  console.log('数据库连接断开')
})

mongoose.connection.on('error', (err) => {
  console.log('数据库连接异常', err)
})

module.exports = mongoose