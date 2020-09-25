var express = require('express');
var sql = require('./../sql')
var Address = require('./../sql/collection/Address')
var utils = require('./../utils')
var uuid = require('node-uuid')
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res, next) {
  res.send('地址相关接口')
});

/**
 * @api {post} /api/address/add 添加地址
 * @apiName postAddressAdd
 * @apiGroup address
 * 
 * @apiParam { string } userid 用户id
 * @apiParam { string } name 收货人姓名
 * @apiParam { string } tel 收货人手机号
 * @apiParam { string } provice 省
 * @apiParam { string } city 市
 * @apiParam { string } county 区/县
 * @apiParam { string } addressDetail 详细地址
 * @apiParam { Boolean } isDefault 默认地址
 * @apiParam { string } token 可以通过 头信息传递
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '购物车数据',
      data
    })
 * @apiSampleRequest /api/cart
 * @apiVersion 0.0.0
 */
router.post('/add', function(req, res, next) {
  // 区分默认
  utils.validataToken(req, res).then(() => {
    let obj = req.body
    obj.addressid = 'address_' + uuid.v1()
    obj.time = new Date().getTime()
    // 如果当前的地址是默认地址，保证默认地址只有一个
    if (obj.isDefault) {
      // 先更新再插入
      sql.update(Address, { userid:obj.userid }, { $set: { isDefault: false }}, 1).then(() => {
        sql.insert(Address, obj).then(() => {
          res.send({
            code: '200',
            message: '插入地址'
          })
        })
      })
    } else {
      // 直接插入
      sql.insert(Address, obj).then(() => {
        res.send({
          code: '200',
          message: '插入地址'
        })
      })
    }
  })
});

// /* GET cart page. */
// router.get('/', function(req, res, next) {
//   res.send('地址相关接口')
// });

//获取默认地址
/**
 * @api {post} /api/address/defualtAddress 获取默认地址
 * @apiName postDefualtAddress
 * @apiGroup address
 * 
 * @apiParam { string } userid 用户id
 * @apiParam { Boolean } isDefault 默认地址
 * @apiParam { string } token 可以通过 头信息传递
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '获取默认地址',
      data
    })
 * @apiSampleRequest /api/address/defualtAddress
 * @apiVersion 0.0.0
 */
router.post('/defualtAddress', function(req, res, next) {
  // 区分默认
  utils.validataToken(req, res).then(() => {
    let { userid } = req.body
    //请求的默认地址
    sql.find(Address, { userid, isDefault: true}, {_id: 0}).then(data => {
      res.send({
        code: '200',
        message: '获取默认地址',
        data
      })
    })
  })
});

//请求地址列表
/**
 * @api {post} /api/address/addresslist 请求地址列表
 * @apiName postAddresslist
 * @apiGroup address
 * 
 * @apiParam { string } userid 用户id
 * @apiParam { string } token 可以通过 头信息传递
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '请求地址列表',
      data
    })
 * @apiSampleRequest /api/address/addresslist
 * @apiVersion 0.0.0
 */
router.post('/addresslist', function(req, res, next) {
  // 区分默认
  utils.validataToken(req, res).then(() => {
    const { userid } = req.body
    //请求的默认地址
    sql.sort(Address, { userid }, { _id: 0 }, { time: -1 }).then(data => {
      res.send({
        code: '200',
        message: '请求地址列表',
        data
      })
    })
  })
});

// 修改默认地址接口
/**
* @api {post} /api/address/addressdefaultupdate 4 修改默认地址接口
* @apiName postAddressdefaultupdate
* @apiGroup address
* 
* @apiparam { String }  userid   用户id
* @apiparam { String }  time   id 唯一值
* @apiparam { String }  token    可以通过 头信息传递
* @apiSuccess {json} Success-Response:   描述  根据请求接口的状态会返回对应的数据
*  res.send({
*      code:'200',
*      message:'请求地址列表',
*      data
* })
* @apiSampleRequest /api/address/addressdefaultupdate
* @apiVersion 0.0.0
*/
// 修改默认地址接口
router.post('/addressdefaultupdate',(req, res, next) => {
  utils.validataToken(req, res).then(() => {
      const { time, userid} = req.body
      // 按时间戳条件修改
      sql.update(Address, { userid, isDefault: true }, { $set: { isDefault: false }}).then(() => {
          sql.update(Address, { userid, time },{ $set: { isDefault: true }} ).then(() => {
              res.send({
                  code: '200',
                  message:'修改订单默认地址'
              })
          })
      })
  })
})

module.exports = router;
