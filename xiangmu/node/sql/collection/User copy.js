// 先保证数据库是联通状态
const mongoose = require('./../db.js');
// 集合的基类
const Schema = mongoose.Schema;

// 创建集合的内容 - 字段 + 数据类型
const schema = new Schema({
  // 配置用户集合相关的字段以及数类型
  userid: { type: String },
  username: { type: String },
  password: { type: String },
  age: { type: Number },
  lesson: { type: Number },
})

// 生成数据库集合  --- 方便进行数据的增删改查
// 在数据库中生成了 users 的数据库集合
// Pro --- pros
// Address --- addresses
const collection = mongoose.model('User', schema)

module.exports = collection

