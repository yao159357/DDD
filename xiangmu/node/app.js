var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); 
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var proRouter = require('./routes/pro');
var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
var messageRouter = require('./routes/message');
var bannerRouter = require('./routes/banner');

//接口
var addressApiRouter = require('./api/address');
var bannerApiRouter = require('./api/banner');
var cartApiRouter = require('./api/cart');
var commentApiRouter = require('./api/comment');
var orderApiRouter = require('./api/order');
var proApiRouter = require('./api/pro');
var searchApiRouter = require('./api/search');
var userApiRouter = require('./api/user');
var payApiRouter = require('./api/pay');

var app = express();

// 自定义中间件 ---  解决跨域问题
var allowCrossDomain = (req, res, next) => {
  // get req.query post req.body
  // res
  // 所有接口均可以访问服务器
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
}
// 使用自定义跨域中间件
app.use(allowCrossDomain)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret : "nihao", //加密session，随便写 
  // cookie : {maxAge : 5*1000},
  cookie : {maxAge : 60*1000*30}, //设置过期时间 --- 半小时 
  resave : true, //强制保存session 默认为 true，建议设置成false 
  saveUninitialized : false ////强制将未初始化的session存储 默认为true，建议设置成true 
}));

app.use("/api/address",addressApiRouter)
app.use("/api/banner",bannerApiRouter)
app.use("/api/cart",cartApiRouter)
app.use("/api/comment",commentApiRouter)
app.use("/api/order",orderApiRouter)
app.use("/api/pro",proApiRouter)
app.use("/api/search",searchApiRouter)
app.use("/api/user",userApiRouter)
app.use("/api/pay",payApiRouter)


//除了/login /loginAction 其余都是需要校验的
app.all("*",(req,res,next)=>{
  //判断是不是登陆和登陆操作，如果不是，验证登陆状态。如果是，则继续
  if(req.url ==="/login" || req.url ==="/loginAction"){
    next()
  }else{
    // res.send(req.cookies)
    // if(req.cookies.loginState ==="true"){
      if(req.session.loginState === true){

      next()
    }else{
      res.redirect("/login")
    }
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pro', proRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/message', messageRouter);
app.use('/banner', bannerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
