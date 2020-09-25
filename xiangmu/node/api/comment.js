var express = require("express");
var router = express.Router();

router.get("/",function(req,res,next){
    res.send("评论相关接口")
})
module.exports = router