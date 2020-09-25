var randomstring = require('randomstring')
var querystirng = require('querystring')
var config = require('./../config')
var md5 = require('md5')
var convert = require('xml-js');
// 获取随机字符串
exports.getNoncestr = function () {
  return randomstring.generate(32)
}

// 获取签名
exports.getSign = function (_prepay) {
  // 将集合M内非空参数值的参数按照参数名ASCII码从小到大排序
  // 将_prepay对象 的key值 按照abcd形式重新排列
  // 提取对象的所有的key值,存入一个数组 -- Object.keys()
  var keyarr = Object.keys(_prepay) // ["appid","mch_id","nonce_str","body","out_trade_no","total_fee","notify_url","trade_type"]
  // 排序
  var sortKeyArr = keyarr.sort() // ["appid","body","mch_id","nonce_str","notify_url","out_trade_no","total_fee","trade_type"]
  // 按照排序过后的顺序将 对象重组
  var asciiObj = sortKeyArr.reduce((obj, key) => {
    obj[key] = _prepay[key]
    return obj
  }, {}) // {"appid":"wx100749d4612ea385","body":"一瓶肥宅水","mch_id":"1448624302","nonce_str":"uDsNuTDNQrOKPQD8st1ayRuBy2EOFE2s","notify_url":"https://walter666.cn/wxpay/notify","out_trade_no":"sh2007_00001","total_fee":1,"trade_type":"NATIVE"}
  // 使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA --- querystirng.stringify()
  // 会转义特殊字符和中文字符
  // var stringA = querystirng.stringify(asciiObj) // appid=wx100749d4612ea385&body=%E4%B8%80%E7%93%B6%E8%82%A5%E5%AE%85%E6%B0%B4&mch_id=1448624302&nonce_str=Z4OjPD1EOmfcjhTPWKFYI3ycOj7JqjaV¬ify_url=https%3A%2F%2Fwalter666.cn%2Fwxpay%2Fnotify&out_trade_no=sh2007_00001&total_fee=1&trade_type=NATIVE
  var stringA = querystirng.stringify(asciiObj, null, null, {
    encodeURIComponent: (value) => {
      return decodeURIComponent(value)
    }
  }) // appid=wx100749d4612ea385&body=一瓶肥宅水&mch_id=1448624302&nonce_str=onqWzXdSPOfiPmMAGtOEKuPjR1jlvuK7¬ify_url=https://walter666.cn/wxpay/notify&out_trade_no=sh2007_00001&total_fee=1&trade_type=NATIVE
  // 在stringA最后拼接上key得到stringSignTemp字符串
  var stringSignTemp = stringA + '&key=' + config.key // appid=wx100749d4612ea385&body=一瓶肥宅水&mch_id=1448624302&nonce_str=hxp2iRNtkC5ZITG9mSCxOEqWjP1ot0sM¬ify_url=https://walter666.cn/wxpay/notify&out_trade_no=sh2007_00001&total_fee=1&trade_type=NATIVE&key=T8NHKqOfKWtqZPnQm8K77PtQtaRXluU8

  // stringSignTemp进行MD5运算，再将得到的字符串所有字符转换为大写，得到sign值signValue。
  var signValue = md5(stringSignTemp).toUpperCase()
  return signValue 
}

// js对象转xml
exports.getXml = function (_prepay, sign) {
  // 符合数据结构，添加一组xml节点
  var dataObj = {
    xml: {
      ..._prepay,
      sign
    }
  }

  var xml = convert.js2xml(dataObj, {
    compact: true
  })
  return xml
}

exports.getxml2js = function (xml) {
  let orderJS = convert.xml2js(xml, { compact: true, textKey: 'value', cdataKey: 'value' })
  // {"xml":{"return_code":{"value":"SUCCESS"},"return_msg":{"value":"OK"},"appid":{"value":"wx100749d4612ea385"},"mch_id":{"value":"1448624302"},"nonce_str":{"value":"Tlwnzaj0oOqyDi8e"},"sign":{"value":"6FE65923E806DB91D194FBB43CEF7CC9"},"result_code":{"value":"SUCCESS"},"prepay_id":{"value":"wx28142047680831191a60ad7973c68a0000"},"trade_type":{"value":"NATIVE"},"code_url":{"value":"weixin://wxpay/bizpayurl?pr=1tw0Gm5"}}}
  var keyArr = Object.keys(orderJS.xml)
  var dataObj = keyArr.reduce((obj, key) => {
    obj[key] = orderJS.xml[key].value
    return obj
  }, {}) // {"return_code":"SUCCESS","return_msg":"OK","appid":"wx100749d4612ea385","mch_id":"1448624302","nonce_str":"jeRjyDtoNeK9WeSm","sign":"C152A23D0B4BB9FD2FD7F09F8BEEB16F","result_code":"SUCCESS","prepay_id":"wx28142453363147191a60ad79c9464c0000","trade_type":"NATIVE","code_url":"weixin://wxpay/bizpayurl?pr=6geVwwG"}
  return dataObj
}
