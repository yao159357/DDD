var express = require("express");
var sql = require("./../sql");
var Pro = require("./../sql/collection/Pro")
var router = express.Router();

// router.get("/",function(req,res,next){
//     res.send("产品相关接口")
// })
//获取商品的列表数据
/**
 * @api {get} /api/pro 获取商品的列表数据
 * @apiName GetApiPro
 * @apiGroup pro
 * 
 * @apiParam { Number } limit 每页显示的个数，默认值为10
 * @apiParam { Number } count 页码，默认值为1
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '获取商品的列表数据',
      data
    })
 * @apiSampleRequest /api/pro
 * @apiVersion 0.0.0
 */
router.get("/",(req,res,next)=>{
    //获取分页的参数
    let {limit,count} = req.query;
    limit = limit *1 || 10
    count = count *1 || 1
    //查询数据
    sql.paging(Pro,{},{_id:0},limit,count).then(data=>{
        res.send({
            code:"200",
            message:"获取商品列表数据",
            data
        })
    })
})

/**
 * @api {get} /api/pro/categroy 获取商品的分类数据
 * @apiName GetApiProCategroy
 * @apiGroup pro
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '获取商品的分类数据',
      data
    })
 * @apiSampleRequest /api/pro/categroy
 * @apiVersion 0.0.0
 */
router.get("/categroy",(req,res,next)=>{
    //获取商品的分类数据
    sql.distinct(Pro,'category').then(data=>{
        // 给前端反馈接口数据
        res.send({
            code:"200",
            message:"获取商品的分类数据",
            data
        })
    })
})

/**
 * @api {get} /api/pro/categroybrand 获取分类下的品牌的数据
 * @apiName GetApiProCategroybrand
 * @apiGroup pro
 * 
 * @apiParam { String } category 分类名称
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '获取分类下的品牌的数据',
      data
    })
 * @apiSampleRequest /api/pro/categroybrand
 * @apiVersion 0.0.0
 */
router.get("/categroybrand",(req,res,next)=>{
    const { category } = req.query
    //proid 循环的key值
    sql.find(Pro,{ category }, { _id:0, proid:1, brand:1, logo: 1 }).then(data=>{
        // 打印data
        // console.log(data)
        //数组去重,把分类里面的重复的去掉
        const obj = {};
        const result = data.reduce((item,next) => {
            obj[next.brand] ? '' : obj[next.brand] = true && item.push(next);
            return item;
        },[])
        // 给前端反馈接口数据
        res.send({
            code:"200",
            message:"获取分类下的品牌的数据",
            data:result
        })
    })
})

/**
 * @api {get} /api/pro/categroybrandlist 获取分类下的品牌的列表数据
 * @apiName GetApiProCategroybrandList
 * @apiGroup pro
 * 
 * @apiParam { String } category 分类名称
 * @apiParam { String } brand 品牌
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '获取分类下的品牌的列表数据',
      data
    })
 * @apiSampleRequest /api/pro/categroybrandlist
 * @apiVersion 0.0.0
 */
router.get("/categroybrandlist",(req,res,next)=>{
    const { category, brand } = req.query
    //proid 循环的key值
    sql.find(Pro,{ category, brand }, { _id:0 }).then(data=>{
        // 给前端反馈接口数据
        res.send({
            code:"200",
            message:"获取分类下的品牌的列表数据",
            data
        })
    })
})

/**
 * @api {get} /api/pro/detail 获取商品详情接口
 * @apiName GetApiProDetail
 * @apiGroup pro
 * 
 * @apiParam {String} proid 产品id
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '10001',
      message: '查无此产品'
    })
 *  res.send({
      code: '200',
      message: '获取商品详情接口',
      data
    })
 * @apiSampleRequest /api/pro/detail
 * @apiVersion 0.0.0
 */
router.get("/detail",(req,res,next)=>{
    const {proid} = req.query
    sql.find(Pro,{proid},{_id:0}).then(data=>{
        if(data.length===0){
            res.send({
            code: '10001',
            message: '查无此产品'    
            })
        }else{
            res.send({
                code: '200',
                message: '获取商品详情接口',
                data:data[0]
              })
        }
    
    })
})


module.exports = router