var express = require("express");
var router = express.Router();
const User = require("../models/users");
const bodyParser = require('body-parser');
const passport = require('passport');
const { where, Op } = require("sequelize/dist");
/* GET users listing. */

router.use(bodyParser.json());

router.get('/', function (req, res, next) {
    User.findAll({})
    .then((users) => {
      console.log(users);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post('/signUp', function (req, res, next) {

    User.findOne({where: {email: req.body.email}})
    .then((user) => {
      if(user) {
        var err = new Error('User ' + req.body.email + ' already exists!');
        err.status = 403;
        next(err);
      }
      else {
        User.create(req.body)
        .then((user) => {
          console.log(user);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
        }, (err) => next(err))
        .catch((err) => next(err));
      }  
    }, (err) => next(err))
    .catch((err) => next(err));
  })

/*  .post('/login', (req, res, next) => {

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
*/
  .post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
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
    User.destroy({truncate: true})
    .then((user) => {
      console.log(user);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json('All users has been deleted');
    }, (err) => next(err))
    .catch((err) => next(err));
  });

router
.get('/:id', (req, res, next) => {
  User.findOne({where: {id: req.params.id}})
  .then((user) => {
    console.log(user);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
}) 
.delete('/:id', (req, res, next) => {
  User.destroy({
    where: { 
      [Op.or]: [{id: req.params.id}, {email: req.params.id}]
    }})
  .then((user) => {
    console.log(user)
    console.log('User with id: '+ req.params.id + ' has been deleted.');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send('User with id: '+ req.params.id + ' has been deleted.');
  }, (err) => next(err))
  .catch((err) => next(err));
})


  
module.exports = router;