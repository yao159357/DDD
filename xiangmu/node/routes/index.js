var express = require('express');
const sql = require("./../sql");
const Admin = require("./../sql/collection/Admin")
const md5 = require("md5");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    activeindex: 0,
    //role:req.cookies.role *1
    role:req.session.role
  });
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post("/loginAction",(req,res,next)=>{
  let {adminname,password} = req.body
  password = md5(password) //密码先加密然后再对比
  sql.find(Admin,{adminname,password},{_id:0}).then(data=>{
    if(data.length === 0){
      res.redirect("/login") //没有查询到数据--未登录--去登陆
    }else{
      // res.send(data)
      // res.cookie("loginState",true)
      // res.cookie("role",data[0].role)
      req.session.loginState = true
      req.session.role = data[0].role
      res.redirect("/")
    }
  })
})

// //支付结果的回调
// router.post('/wxpay/notify', (req, res, next) => {
//   // 使用socket通知前端
// })
module.exports = router;
