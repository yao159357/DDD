const mongoose = require("./../db");
const Schema = mongoose.Schema;

const schema = new Schema({
  bannerid: { type: String }, 
  alt: { type: String },
  href: { type: String }, 
  img: { type: String }, 

})

module.exports = mongoose.model("Banner",schema)