var express = require("express");
var router = express.Router();
const Users = require("../models/users");
const sql = require('../services/db');
const bodyParser = require('body-parser');
/* GET users listing. */

router.use(bodyParser.json());

router.get('/', function (req, res, next) {
    sql.promise().query('select * from users')
    .then(([rows, fields]) => {
      console.log(rows);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rows);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post('/signUp', function (req, res, next) {

    sql.promise().query('select * from users where id = ?', req.body.id)
    .then(([rows, fields]) => {
      if(rows.length >= 1) {
        var err = new Error('User ' + req.body.id + ' already exists!');
        err.status = 403;
        next(err);
      }
      else {
        let newUser = new Users(req.body);
        newUser = Object.assign(newUser, {admin: '0'});
        sql.promise().query('insert into users set ?', newUser)
        .then(([rows, fields]) => {
          console.log({id: rows.insertId, ...newUser});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({id: rows.insertId, ...newUser});
        }, (err) => next(err))
        .catch((err) => next(err));
        
      }  
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .delete('/', (req, res, next) => {
    sql.promise().query('delete from users')
    .then(([rows, fields]) => {
      console.log(rows);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rows);
    }, (err) => next(err))
    .catch((err) => next(err));
  });

router
.get('/:id', (req, res, next) => {
  sql.promise().query('select * from users where id = ?', req.params.id)
  .then(([rows, fields]) => {
    console.log(rows);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rows);
  }, (err) => next(err))
  .catch((err) => next(err));
}) 
.delete('/:id', (req, res, next) => {
  sql.promise().query('delete from users where id = ?', req.params.id)
  .then(([rows,fields]) => {

    if(rows.affectedRows < 1) {
      err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    console.log('User with id: '+ req.params.id + ' has been deleted.');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send('User with id: '+ req.params.id + ' has been deleted.');
  }, (err) => next(err))
  .catch((err) => next(err));
})


  
module.exports = router;