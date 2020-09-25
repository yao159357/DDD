var express = require('express');
var sql = require('./../sql')
var Banner = require('./../sql/collection/Banner')
var uuid = require('node-uuid')
var router = express.Router();

/* GET user page. */
router.get('/', function(req, res, next) {
  res.render('banner', {
    activeindex: 6,
     // role: req.cookies.role * 1
     role: req.session.role
  });
});

router.post('/add', function(req, res, next) {
  console.log('11111', req.body)
  const { alt, href, img } = req.body
  sql.insert(Banner, {
    bannerid: 'banner_' + uuid.v1(),
    alt,
    href,
    img
  }).then(() => {
    res.redirect('/')
  })
});

module.exports = router;
