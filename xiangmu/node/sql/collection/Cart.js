const mongoose = require("./../db");
const Schema = mongoose.Schema;

const schema = new Schema({
  cartid: { type: String }, // 购物车id
  proid: { type: String }, // 产品id
  userid: { type: String }, // 用户id
  num: { type: Number }, // 数量
  flag: { type: Boolean }, // true 选中false未选中
})

module.exports = mongoose.model("Cart",schema)