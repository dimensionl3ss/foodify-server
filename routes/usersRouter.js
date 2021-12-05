var express = require("express");
var userRouter = express.Router();
const Users = require("../models/users");
const sql = require('../services/db');
/* GET users listing. */

userRouter.route('/')
  .get(function (req, res, next) {
    sql.promise().query('select * from users')
    .then(([rows, fields]) => {
      console.log(rows);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rows);
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .post(function (req, res, next) {
    const newUser = new Users({
      name: req.body.name,
      id: req.body.email,
      password: req.body.password,
      address: req.body.address,
      pin: req.body.pin,
    });
    sql.promise().query('insert into users set ?', newUser)
    .then(([rows, fields]) => {
      console.log({id: rows.insertId, ...newUser});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({id: rows.insertId, ...newUser});
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    sql.promise().query('delete from users')
    .then(([rows, fields]) => {
      console.log(rows);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rows);
    }, (err) => next(err))
    .catch((err) => next(err));
  });

userRouter.route('/:id')
.get((req, res, next) => {
  sql.promise().query('select * from users where id = ?', req.params.id)
  .then(([rows, fields]) => {
    console.log(rows);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rows);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /users/id');
})
.delete((req, res, next) => {
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

module.exports = userRouter;
