var express = require('express');
var xlsx = require('node-xlsx');
var uuid = require('node-uuid');
var sql = require('./../sql')
var Pro = require('./../sql/collection/Pro')
var router = express.Router();

/* GET pro page. */
router.get('/', function(req, res, next) {
//查询所有的数据---为了计算总页数

  sql.find(Pro,{},{_id:0}).then(data=>{
    const totalNum = data.length
    let {limit,count} = req.query
    limit = limit*1 || 10
    count = count*1 || 1
    //获取总页码--向上取
    const totalCount = Math.ceil(totalNum/limit)
      // 调用分页的操作 -- 获取相应页码对应的数据
    sql.paging(Pro,{},{_id:0},limit,count).then(data1=>{
      res.render('pro', {
        activeindex: 1,
        data:data1,
        totalCount,
        limit,
        count,
        //role:req.cookies.role *1
        role:req.session.role
      });

    })
  })
});
//排序的路由
router.get("/sort",(req,res,next)=>{
  let{type,num} = req.query
  num = num *1 //1 表示升序  -1表示降序----number
  // 调用排序方法 
  //type 为 键值对的key值，是一个变量。使用[type]代替
  sql.sort(Pro,{},{_id:0},{[type]:num}).then(data =>{
    res.render("pro",{
      activeindex:1,// 菜单栏哪一个被选中
      data,// 排序的数据
      totalCount:1,// 总页数 -- 不能少
      limit:data.length,// 每页显示的条数 - 总个数
      //role:req.cookies.role *1
      role:req.session.role
    });
  })
})
//搜索产品路由----模糊查找产品名称或者产品描述
router.get('/search', (req, res, next)=> {
  const{searchText } = req.query
  const reg = new RegExp(searchText)
  sql.find(Pro,{$or:[{proname:reg},{desc:reg}]},{_id:0}).then(data=>{
    res.render("pro",{
      activeindex:1,
      data,
      totalCount:1,
      limit:data.length,
      count:1,
      //role:req.cookies.role *1
      role:req.session.role
    })
  })
})

// 跳转到添加商品的路由
router.get('/add', function(req, res, next) {
  res.render('pro_add', {
    activeindex: 1,
    //role:req.cookies.role *1
    role:req.session.role
  });
});

router.post("/addAction",(req,res,next)=>{
  //获取表单的数据
  let obj = req.body
  //修改接收的字符串为number
  obj.price *=1,
  obj.stock *=1,
  obj.sales *=1,
  obj.discount *=1,
  obj.rating *=1
  //添加proid
  obj.proid = "pro_" + uuid.v1()
  //插入数据
  sql.insert(Pro,obj).then(()=>{
    //插入后回到列表页面
    res.redirect("/pro")
  })
  // res.send(obj)
})

//删除数据
router.get("/delete",(req,res,next)=>{
  // 获取
  const {proid} = req.query
  // 删除

  sql.delete(Pro,{proid}).then(()=>{
    res.redirect("/pro")
  })
})


//去修改的页面的路由
router.get("/update",(req,res,next)=>{
  const {proid} = req.query
  // 依据商品查询数据库，返回商品的信息，填入表单
  sql.find(Pro,{proid},{_id:0}).then(data=>{
    res.render("pro_update",{
      activeindex:1,// 菜单栏哪一个被选中
      proid:data[0].proid,
      category:data[0].category,
      brand:data[0].brand,
      logo:data[0].logo,
      proname:data[0].proname,
      proimg:data[0].proimg,
      price:data[0].price,
      stock:data[0].stock,
      sales:data[0].sales,
      discount:data[0].discount,
      rating:data[0].rating,
      desc:data[0].desc,
      role:req.session.role
    });
  })
})

//修改完成过发送到页面
router.post("/updateAction",(req,res,next)=>{
  let obj = req.body
  obj.price *=1
  obj.stock *=1
  obj.sales *=1
  obj.discount *=1
  obj.rating *=1
  //一句proid修改数据
  sql.update(Pro,{proid:obj.proid},{$set:obj}).then(()=>{
    res.redirect("/pro")
  })
})


// 读取excel表格的数据
// __dirname 代表当前这个文件处于系统中的绝对路径
const file = __dirname + '/pro.xlsx';
router.get('/upload', (req, res, next) => {
  // 读取文件的信息
  const data1 = xlsx.parse(file) // [{name: '工作表1', data: []},{name: 'Sheet1', data: [] }]
  const data = data1[0].data // [[], [], []] 第一个元素是表头，其余的元素是每一行的数据
  const insertData = []
  data.forEach((item, index) => {
    if (index > 0) {
      insertData.push({
        proid: 'pro_' + uuid.v1(),
        proname: item[1],
        category: item[2],
        brand: item[3],
        logo: item[4],
        proimg: item[5],
        price: item[6] * 1,
        desc: item[7],
        stock: item[8] * 1,
        sales: item[9] * 1,
        discount: item[10] * 1,
        rating: item[11] * 1,
      })
    }
  })
  // res.send(insertData)
  //为了避免重复数据,在此处可以先删除所有的数据，然后再执行
  sql.delete(Pro,{},1).then(()=>{
    //如果不需要先删除，可以直接写里面的
    sql.insert(Pro, insertData).then(() => {
      // 导入数据库成功之后返回列表页面
      // 重定向路由到 /pro
      res.redirect('/pro')
    })
  })
})

module.exports = router;
