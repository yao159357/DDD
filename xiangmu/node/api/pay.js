var express = require('express');
var config = require('./../config')
var { getNoncestr, getSign, getXml, getxml2js } = require('./../utils/tools')
var axios = require('axios')
var qrcode = require('qrcode')
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res, next) {
  res.send('支付')
});

/**
 * @api {post} /api/pay/payment 生成支付二维码
 * @apiDescription 生成支付二维码
 * @apiGroup pay
 * @apiParam { string } body 订单描述
 * @apiParam { string } out_trade_no 订单id
 * @apiParam { Number } total_fee 订单金额
 * @apiSuccessExample {json} Success-Response:
 *  res.send({
      code: '200',
      message: '生成支付二维码'，
      data： url
    })
 * @apiSampleRequest /api/pay/payment
 * @apiVersion 0.0.0
 */

router.get('/payment', (req, res, next) => {
  // 所有发送或者接收到的数据为集合M
  var _prepay = {
    appid: config.appid, // 公众号id
    mch_id: config.mch_id, // 商户id
    nonce_str: getNoncestr(), // 随机字符串
    // body: '一瓶肥宅水', // req.query.body
    body: req.query.body, //商品的描述后续由接口提供数据
    // out_trade_no: 'sh2007_00001', // req.query.out_trade_no
    out_trade_no: req.query.out_trade_no, // 珊瑚订单号，后续由接口提供数据
    total_fee: 1, // req.query.total_fee * 100  //订单金额，单位为分，后续由接口提供数据
    notify_url: config.notify_url, // 支付回调地址
    trade_type: 'NATIVE'
  }
  var sign = getSign(_prepay)
  // 支付的统一下单接口 接收的参数类型格式为 xml 格式
  var xmlbody = getXml(_prepay, sign)
  axios({
    url: config.unifiedorder,
    method:'post',
    data: xmlbody
  }).then(response => {
    // console.log(response)
    // <xml><return_code><![CDATA[SUCCESS]]></return_code>\n<return_msg><![CDATA[OK]]></return_msg>\n<appid><![CDATA[wx100749d4612ea385]]></appid>\n<mch_id><![CDATA[1448624302]]></mch_id>\n<nonce_str><![CDATA[bIsNNHVLS17AdQ9n]]></nonce_str>\n<sign><![CDATA[CBD1DDD1E343DF4D9FCB5C0603919B74]]></sign>\n<result_code><![CDATA[SUCCESS]]></result_code>\n<prepay_id><![CDATA[wx28141506721724191a60ad79bd4f2e0000]]></prepay_id>\n<trade_type><![CDATA[NATIVE]]></trade_type>\n<code_url><![CDATA[weixin://wxpay/bizpayurl?pr=LHrXGfi]]></code_url>\n</xml>
    // 将得到的xml格式转成js对象的格式
    var obj = getxml2js(response.data)
    // 获取支付的地址
    var { code_url } = obj
    qrcode.toDataURL(code_url, (err, url) => {
      if (err) throw err
      res.send({
        code: '200',
        message: '支付',
        url
      })
    })
  })
})

module.exports = router;
