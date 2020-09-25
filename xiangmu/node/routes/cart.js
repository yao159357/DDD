var express = require('express');
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res, next) {
  if(req.session.role > 1){   
    res.render('cart', {
      activeindex: 3,
      //role:req.cookies.role *1
      role:req.session.role
    });
  }else{
    res.render("noPermission")
  }
});

module.exports = router;
