var express = require('express');
var utils = require('./../utils');
var Order = require('./../sql/Order');
var Cart = require('./../sql/collection/Cart');
var sql = require('./../sql');
var randomstring = require('randomstring');
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res, next) {
  res.send('订单相关接口')
});
/**
 * @api {post} /api/order/add 添加订单信息
 * @apiName postOrderAdd
 * @apiGroup order
 * @apiParam { array } list 购物车选中的商品信息
 * @apiParam { string } token 可以通过 头信息传递
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '添加订单信息'，
      data: time
    })
 * @apiSampleRequest /api/order/add
 * @apiVersion 0.0.0
 */
router.post('/add', function(req, res, next) {
  utils.validataToken(req, res).then(() => {
    let { list } = req.body // 传的是数组
    // 遍历list数据，为其添加 收货人信息，时间，状态
    const time = new Date().getTime()
    list.forEach(item => {
      item.name = ''
      item.tel = ''
      item.address = ''
      item.time = time
      item.status = 0
      item.orderid = 'order_' + randomstring.generate(13) + time // 支付要求订单编号不能超过32位
    })
    // 插入数据库
    sql.insert(Order, list).then(() => {
      // 返回时间戳
      res.send({
        code: '200',
        message: '添加订单信息',
        data: time
      })
    })
  })
});

/**
 * @api {post} /api/order/confirmOrderInfo 获取确认订单的数据列表
 * @apiName postConfirmOrderInfo
 * @apiGroup order
 * @apiParam { string } userid 用户id
 * @apiParam { string } time 时间
 * @apiParam { string } token 可以通过 头信息传递
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '获取确认订单的数据列表'，
      data
    })
 * @apiSampleRequest /api/order/confirmOrderInfo
 * @apiVersion 0.0.0
 */
router.post('/confirmOrderInfo', (req, res, next) => {
  utils.validataToken(req, res).then(() =>  {
    let { userid, time } = req.body
    sql.find(Order, { userid, time }, { _id: 0 }).then(data => {
      res.send({
        code: '200',
        message: '获取确认订单的数据列表',
        data
      })
    })
  })
})

/**
 * @api {post} /api/order/updateAddress 更新订单的地址
 * @apiName postUpdateAddress
 * @apiGroup order
 * @apiParam { string } userid 用户id
 * @apiParam { string } time 时间
 * @apiParam { string } name 姓名
 * @apiParam { string } tel 手机号
 * @apiParam { string } address 地址
 * @apiParam { string } token 可以通过 头信息传递
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '更新订单的地址'，
      data
    })
 * @apiSampleRequest /api/order/updateAddress
 * @apiVersion 0.0.0
 */
router.post('/updateAddress', (req, res, next) => {
  utils.validataToken(req, res).then(() =>  {
    const { userid, time, name, tel, address } = req.body
    sql.update(Order, { userid, time }, { $set: { name, tel, address }}, 1).then(() => {
      res.send({
        code: '200',
        message: '更新订单的地址',
        data
      })
    })
  })
})

/**
 * @api {post} /api/order/deleteCartData 删除购物车的数据
 * @apiName postDeleteCartData
 * @apiGroup order
 * @apiParam { string } userid 用户id
 * @apiParam { string } token 可以通过 头信息传递
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '删除购物车的数据'，
      data
    })
 * @apiSampleRequest /api/order/deleteCartData
 * @apiVersion 0.0.0
 */
router.post('/deleteCartData', (req, res, next) => {
  utils.validataToken(req, res).then(() =>  {
    // const { userid, list } = req.body
    // 遍历list调用删除压入数据，调用promise.all方法
    const { userid } = req.body
    sql.delete(Cart, { userid, flag:true }, 1).then(() => {
      res.send({
        code: '200',
        message: '删除购物车的数据',
      })
    })
  })
})


module.exports = router;
