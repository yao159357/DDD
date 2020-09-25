var express = require("express");
var sql = require('../sql')
var Pro = require('../sql/collection/Pro');;
var router = express.Router();

/**
 * @api {GET} /api/search 搜索
 * @apiDescription 搜索
 * @apiGroup search
 * @apiParam { string } searchText 搜索关键字
 * @apiSuccess {json} data
 * @apiSuccessExample {json} Success-Response:
  {
      code: '200',
      message: '搜索关键字',
      data
  }
 * @apiSampleRequest /api/search
 * @apiVersion 0.0.0
 */

router.get("/",function(req,res,next){
    const { searchText } = req.query
    const reg = new RegExp(searchText)
    sql.find(Pro, { $or: [{proname:reg}, {desc:reg}]}, {_id: 0}).then(data => {
        res.send({
            code: '200',
            message: '搜索',
            data
        })

    })
})
module.exports = router