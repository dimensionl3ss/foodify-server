var express = require('express');
var router = express.Router();
const sql = require('../services/db');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
})
module.exports = router;
