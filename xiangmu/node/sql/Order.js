const mongoose = require("./db");
const Schema = mongoose.Schema;

const schema = new Schema({
  orderid: { type: String },
  cartid: { type: String },
  userid: { type: String },
  proname: { type: String }, 
  proimg: { type: String },
  price: { type: Number }, 
  num: { type: Number }, 
  time: { type: String }, 
  status: { type: Number },  // 0待支付 1待收货 2 已完成
  name: { type: String }, 
  tel: { type: String }, 
  address: { type: String } 
})

module.exports = mongoose.model("Order",schema)