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
  birthday: { type: Number },
  email: { type: String },
  tel: { type: String },
  sex: { type: Number },
  avatar: { type: String }, //头像
  regTime: { type: Number }, //注册时间
  telCode: { type: String },//手机验证码
  loginSTate: { type: Number },//登陆状态 ---单点登陆
})


const collection = mongoose.model('User', schema)

module.exports = collection

