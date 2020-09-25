var express = require('express');
var router = express.Router();

/* GET user page. */
router.get('/', function(req, res, next) {
  res.render('user', {
    activeindex: 2,
    //role:req.cookies.role *1
    role:req.session.role
  });
});

module.exports = router;
