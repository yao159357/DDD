const Core = require('@alicloud/pop-core');
const jwt = require('jsonwebtoken')
module.exports = {
  validataToken (req,res) {
    //头信息/get/post
    const token = req.headers.token || req.query.token || req.body.token
    // 使用promise解决异步操作，验证token是异步
    return new Promise((resolve, reject) => {
      if (token) {
        jwt.verify(token,'sh2007',(err, decoded) => {
          if (err) {
            // reject()
            res.send({
              code: '10119',
              message: 'token验证失败'
            })
          }else {
            //验证成功
            req.decoded = decoded
            resolve()
          }
        })
      } else {
        // reject()
        res.send({
          code: '10119',
          message: 'token验证失败'
        })
      }
    })
  },
    //发送短信验证码
    sendCode(PhondeNumbers,code){
        var client = new Core({
          accessKeyId: 'LTAI4G2fmndwJkYUUou9xdmS', //之前遮挡的账号
          accessKeySecret: 'DazO8RDwD3SGwTx6J6HXozUnGIimUn',//之前遮挡的密码
          endpoint: 'https://dysmsapi.aliyuncs.com',
          apiVersion: '2017-05-25'
        });
        
        var params = {
          "RegionId": "cn-hangzhou",
          "PhoneNumbers": PhondeNumbers, //电话号码
          "SignName": "BC商城",
          "TemplateCode": "SMS_199217544",
          "TemplateParam": "{code:"+code+"}" //验证码
        }
        
        var requestOption = {
          method: 'POST'
        };
        
        // client.request('SendSms', params, requestOption).then((result) => {
        //   console.log(JSON.stringify(result));
        // }, (ex) => {
        //   console.log(ex);
        // })

        return new Promise((resolve,reject)=>{
            client.request('SendSms', params, requestOption).then((result) => {
                console.log(JSON.stringify(result));
                resolve()
              }, (ex) => {
                console.log(ex);
                reject()
              })
        })

    }
}
