var express = require("express");
var sql = require("./../sql");
var Banner = require("./../sql/collection/Banner")
var router = express.Router();

// router.get("/",function(req,res,next){
//     res.send("轮播图相关接口")
// })

/**
 * @api {get} /api/banner 获取轮播图数据
 * @apiName GetApiProBanner
 * @apiGroup banner
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '获取轮播图数据',
      data
    })
 * @apiSampleRequest /api/banner
 * @apiVersion 0.0.0
 */
router.get("/",(req,res,next)=>{
    sql.find(Banner,{},{_id:0}).then(data=>{
            res.send({
            code: '200',
            message: '获取轮播图数据',
            data    
            })
    })
})

module.exports = router