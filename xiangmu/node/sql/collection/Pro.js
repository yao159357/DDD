const mongoose = require("./../db");
const Schema = mongoose.Schema;

const schema = new Schema({
  proid: { type: String }, // 产品id
  proname: { type: String }, // 产品名称
  category: { type: String }, // 分类
  brand: { type: String }, // 品牌
  logo: { type: String }, // 品牌logo
  proimg: { type: String }, // 产品的单张图片
  price: { type: Number }, // 原价
  desc: { type: String }, // 描述
  stock: { type: Number }, // 库存
  sales: { type: Number }, // 销量
  discount: { type: Number }, // 折扣
  rating: { type: Number } // 评分
})

module.exports = mongoose.model("Pro",schema)