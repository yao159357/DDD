const sql = require("./index");
const Admin = require("./collection/Admin");
const md5 = require("md5");
const inserData = [{
    adminid:"admin_0001",
    adminname:"admin",
    password:md5("123456"),
    role:2
},{
    adminid:"admin_0002",
    adminname:"guolingyan",
    password:md5("123456"),
    role:1
}]
sql.insert(Admin,inserData).then(()=>{
    console.log("插入成功")

})