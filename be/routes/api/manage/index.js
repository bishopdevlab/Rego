var express = require('express');
var createError = require('http-errors');
var router = express.Router();

router.all('*', function(req, res, next) {
  if (req.user.lv) throw createError(403, '권한이 없습니다.')
  
  next()
})

router.use('/user', require('./user'))

module.exports = router;
