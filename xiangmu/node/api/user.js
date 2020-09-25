var express = require("express");
var sql = require("../sql")
var utils = require("../utils")
var User = require("../sql/collection/User")
var uuid = require('node-uuid')
var md5 = require('md5')
var router = express.Router();
var jwt = require('jsonwebtoken')
router.get("/",function(req,res,next){
    res.send("用户相关接口")
})

/**
 * @api {post} /api/user/docheckphone 注册:检测手机号
 * @apiName GetApiUserDocheckphone
 * @apiGroup user
 * 
 * @apiParam {string} tel 手机号
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '可以继续注册',
      data
    })
     res.send({
                code:"10002",
                message:"该用户已经注册",
                tel:data[0].tel
            })
 * @apiSampleRequest /api/user/docheckphone
 * @apiVersion 0.0.0
 */

router.post("/docheckphone",function(req,res,next){
    const { tel } = req.body
    sql.find(User,{ tel },{_id:0}).then(data=>{
        if(data.length ===0){
            res.send({
                code:"200",
                message:"可以继续注册"
            })
        }else{
            res.send({
                code:"10002",
                message:"该用户已经注册",
                tel:data[0].tel
            })
        }
    })
})

/**
 * @api {post} /api/user/dosendmsgcode 注册：发送短信验证码
 * @apiName GetApiUserDosendmsgcode
 * @apiGroup user
 * 
 * @apiParam {string} tel 手机号
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '发送短信验证码成功',
      data:telCode //正常不传此值，为了方便测试
    })
     res.send({
                code:"10003",
                message:"发送短信验证码失败",
            })
 * @apiSampleRequest /api/user/dosendmsgcode
 * @apiVersion 0.0.0
 */

router.post("/dosendmsgcode",(req,res,next)=>{
    const { tel } = req.body
    const telCode = Math.floor(Math.random()*900000) + 100000
    utils.sendCode(tel,telCode).then(()=>{
        //发送验证码成功，验证用户参在不存在，存在更新数据，不存在插入数据库
        sql.find(User,{tel},{_id:0}).then(data=>{
            //用户不存在--插入数据
            if(data.length ===0){
                const insertData={
                    userid:"user_" + uuid.v1(),
                    username:"",
                    password:"",
                    birthday:0,
                    email:"",
                    tel:tel,
                    sex:-1,
                    avatar:"",
                    regTime:new Date().getTime(),
                    telCode:telCode,
                    loginState:0
                }
                sql.insert(User,insertData).then(()=>{
                    res.send({
                        code: '200',
                        message: '发送短信验证码成功',
                        data:telCode //正常不传此值，为了方便测试
                      })
                })
            }else{
                //用户未完成注册
                if(data[0].password ===""){
                    //更新验证码
                    sql.update(User,{tel},{$set:{telCode}}).then(()=>{
                        res.send({
                            code: '200',
                            message: '发送短信验证码成功',
                            data:telCode //正常不传此值，为了方便测试
                        })

                    })
                }else{
                    //用户已注册
                    res.send({
                        code: '10002',
                        message: '该用户已注册',
                        tel:data[0].tel
                    })
                }
            }
               
        })
   }).catch(()=>{
        res.send({
            code:"10003",
            message:"发送短信验证码失败",
        })
    })  
})

/**
 * @api {post} /api/user/docheckcode 注册：验证码验证
 * @apiName GetApiUserDocheckcode
 * @apiGroup user
 * 
 * @apiParam {string} tel 手机号
 * @apiParam {string} telCode 手验证码
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '验证码验证成功',
      data
    })
     res.send({
                code:"10004",
                message:"验证码验证失败",
            })
 * @apiSampleRequest /api/user/docheckcode
 * @apiVersion 0.0.0
 */

router.post("/docheckcode",function(req,res,next){
    const { tel,telCode } = req.body
    sql.find(User,{ tel,telCode },{_id:0}).then(data=>{
        if(data.length ===0){
            res.send({
                code:"10004",
                message:"验证码验证失败"
            })
        }else{
            res.send({
                code:"200",
                message:"验证码验证成功",
                tel:data[0].tel
            })
        }
    })
})

/**
 * @api {post} /api/user/dosetpassword 注册结果
 * @apiName GetApiUserDosetpassword
 * @apiGroup user
 * 
 * @apiParam {String} tel 手机号
 * @apiParam {String} password 密码
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '注册成功',
    })
 * @apiSampleRequest /api/user/dosetpassword
 * @apiVersion 0.0.0
 */

router.post("/dosetpassword",(req,res,next)=>{
    let { tel,password } = req.body
    password = md5(password)
    sql.update(User,{ tel },{$set:{ password }}).then(()=>{
            res.send({
                code:"200",
                message:"注册成功"
            })
    })
})

//----------------------登陆-----------------------------------

/**
 * @api {post} /api/user/dosendloginCode 登陆：获取验证码
 * @apiName GetApiUserDosendloginCode
 * @apiGroup user
 * 
 * @apiParam { String } tel 手机号
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '200',
      message: '发送验证码成功',
    })
     res.send({
                code:"10005",
                message:"该用户还未注册",
            })
 * @apiSampleRequest /api/user/dosendloginCode
 * @apiVersion 0.0.0
 */

router.post("/dosendloginCode",function(req,res,next){
    const { tel } = req.body
    sql.find(User,{ tel },{_id:0}).then(data=>{
        if(data.length ===0 || data[0].password === ""){
            res.send({
                code:"10005",
                message:"该用户还未注册"
            })
        }else{
            const telCode = Math.floor(Math.random()*900000)+100000
            utils.sendCode(tel,telCode).then(()=>{
                sql.update(User,{ tel },{ $set:{ telCode }}).then(()=>{
                    res.send({
                        code:"200",
                        message:"发送验证码成功"
                    })
                })
            })
        }
    })
})

//验证码登陆
/**
 * @api {post} /api/user/dosmslogin 登陆：验证码登陆
 * @apiName GetApiUserDosmslogin
 * @apiGroup user
 * 
 * @apiParam { String } tel 手机号
 * @apiParam { String } telCode 验证码
 * 
 * @apiSuccess {json} Success-Response:
 *  res.send({
      code: '10006',
      message: '验证码错误',
    })
     res.send({
        code:"10005",
        message:"该用户还未注册",
    })
     res.send({
        code:"200",
        message:"登陆成功",
        data:{
            userid:data1[0].userid,
            //token:-------后端校验登陆的凭证
        }
    })
 * @apiSampleRequest /api/user/dosmslogin
 * @apiVersion 0.0.0
 */

router.post("/dosmslogin",(req,res,next)=>{
    const { tel,telCode } = req.body
    //先校验手机号是不是被注册过
    sql.find(User,{ tel },{_id:0}).then(data=>{
        if(data.length ===0 || data[0].password === ""){
            res.send({
                code:"10005",
                message:"该用户还未注册"
            })
        }else{
            //校验验证码的正确性
                sql.find(User,{ tel,telCode },{ _id:0 }).then((data1)=>{
                    if(data1.length ===0){
                        res.send({
                            code:"10006",
                            message:"验证码错误"
                        })  
                    }else{
                        const token = jwt.sign({ userid: data1[0].userid }, 'sh2007', {
                            expiresIn: 24 * 60 * 60
                            // expiresIn: 60 * 60
                          })
                        // 登录成功
                        res.send({
                          code: '200',
                          message: '登录成功',
                          data: {
                            userid: data1[0].userid,
                            token: token  // -----  后端校验登录的凭据
                          }                          
                        })
                    }
                })
            
        }
    })
})

// 账户名/手机号/邮箱 + 密码登录
/**
 * @api {post} /api/user/domlogin 登录：账户名/手机号/邮箱 + 密码登录
 * @apiName GetApiUserDomlogin
 * @apiGroup user
 * @apiParam { String } loginname 账户名/手机号/邮箱
 * @apiParam { String } password 密码
 * @apiSuccess {json} Success-Response:
*   res.send({
      code: '10007',
      message: '密码错误'
    })
    res.send({
      code: '10005',
      message: '该用户还未注册'
    })
    res.send({
      code: '200',
      message: '登录成功',
      data: {
        userid: data1[0].userid,
        // token:  -----  后端校验登录的凭据
      }
    })
 * @apiSampleRequest /api/user/domlogin
 * @apiVersion 0.0.0
 */
router.post('/domlogin', (req, res, next) => {
    let { loginname, password } = req.body
    password = md5(password)
    sql.find(User, { $or: [ { username: loginname }, { tel: loginname }, { email: loginname }]}, { _id: 0}).then(data => {
      if (data.length === 0) {
        res.send({
          code: '10005',
          message: '该用户还未注册'
        })
      } else {
          console.log(data[0].password);
        sql.find(User, { $or: [ { username: loginname }, { tel: loginname }, { email: loginname }], password}, { _id: 0}).then(data1 => {
          if (data1.length === 0) {
            res.send({
              code: '10007',
              message: '密码错误'
            })
          } else {
              const token = jwt.sign({ userid: data1[0].userid }, 'sh2007', {
                //expiresIn: 24 * 60 * 60
                expiresIn: 60 * 60
              })
            // 登录成功
            res.send({
              code: '200',
              message: '登录成功',
              data: {
                userid: data1[0].userid,
                token: token  // -----  后端校验登录的凭据
              }
            })
          }
        })
      }
    })
  })

// ---------------------获取个人信息-----------------------------------
/**
 * @api {post} /api/user/getUserInfo 获取个人信息
 * @apiName getUserInfo
 * @apiGroup user
 * @apiParam { String } userid 用户id
 * @apiParam { String } token token
 * @apiSuccess {json} Success-Response:
*   res.send({
      code: '200',
      message: '个人信息',
      data
    })
 * @apiSampleRequest /api/user/getUserInfo
 * @apiVersion 0.0.0
 */
router.post('/getUserInfo', (req, res, next) => {
    const { userid } = req.body
    utils.validataToken(req, res).then(() => {
      sql.find(User, { userid }, { _id: 0}).then(data => {
        res.send({
          code: '200',
          message: "获取用户信息",
          data: data[0] 
        })
      })
    })
  })

module.exports = router

// ------------------------------------------------- 获取个人信息 ------------------------------------------------------------------
// ------------------------------------------------- 绑定用户名 ------------------------------------------------------------------
// ------------------------------------------------- 绑定邮箱 ------------------------------------------------------------------
// ------------------------------------------------- 修改个人信息 ------------------------------------------------------------------
// ------------------------------------------------- 更新头像 ------------------------------------------------------------------
// ------------------------------------------------- 忘记密码 ------------------------------------------------------------------
