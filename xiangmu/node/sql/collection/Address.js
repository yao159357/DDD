const mongoose = require("../db");
const Schema = mongoose.Schema;

const schema = new Schema({
  addressid: { type: String },
  userid: { type: String },
  name: { type: String },
  tel: { type: String },
  province: { type: String }, 
  city: { type: String },
  county: { type: String }, 
  addressDetail: { type: String }, 
  isDefault: { type: Boolean }, 
  time: { type: String }
})

module.exports = mongoose.model("Address",schema)