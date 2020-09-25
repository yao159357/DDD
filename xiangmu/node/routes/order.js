var express = require('express');
var router = express.Router();

/* GET order page. */
router.get('/', function(req, res, next) {
  res.render('order', {
    activeindex: 4,
    //role:req.cookies.role *1
    role:req.session.role
  });
});

module.exports = router;
