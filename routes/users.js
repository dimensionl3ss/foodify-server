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

  .post('/login', (req, res, next) => {

    if(!req.session.user) {

      let authHeader = req.headers.authorization;
      if (!authHeader) {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
  
      let auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      let username = auth[0];
      let password = auth[1];
  
      sql.promise().query('select * from users where id = ?', username)
      .then(([rows, fields]) => {
        if (rows[0].id === username && rows[0].password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
        else if (rows[0].password !== password) {
          let err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        }
        else if (rows === null) {
          let err = new Error('User ' + username + ' does not exist!');
          err.status = 403;
          return next(err);
        }
      })
      .catch((err) => next(err));
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
  })

  .get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
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