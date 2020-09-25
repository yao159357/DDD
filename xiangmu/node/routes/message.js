var express = require('express');
var router = express.Router();

/* GET message page. */
router.get('/', function(req, res, next) {
  res.render('message', {
    activeindex: 5,
    //role:req.cookies.role *1
    role:req.session.role
  });
});

module.exports = router;
