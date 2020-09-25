const mongoose = require("./../db");
const Schema = mongoose.Schema;

const schema = new Schema({
  adminid: { type: String }, // 管理员id
  adminname: { type: String },//管理员账号
  password: { type: String }, //管理员密码
  role: { type: Number }, //管理元角色--权限2.表示超级管理员 1.表示普通管理员

})

module.exports = mongoose.model("Admin",schema)