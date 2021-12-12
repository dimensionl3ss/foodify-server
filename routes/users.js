var express = require("express");
var router = express.Router();
const User = require("../models/users");
const bodyParser = require('body-parser');
const passport = require('passport');
const { where, Op } = require("sequelize/dist");
const authenticate = require('../authentication');
const { token } = require("morgan");
/* GET users listing. */

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
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
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          })
        }, (err) => next(err))
        .catch((err) => next(err));
      }  
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .post('/login', passport.authenticate('local'), (req, res) => {
    var token = authenticate.getToken({email: req.user.email});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');;
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
    
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
  .delete('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.destroy({truncate: true})
    .then((user) => {
      console.log(user);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status:'All users has been deleted'});
    }, (err) => next(err))
    .catch((err) => next(err));
  });

router
.get('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.findOne({where: {id: req.params.id}})
  .then((user) => {
    console.log(user);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
}) 
.delete('/:id', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.destroy({
    where: { 
      [Op.or]: [{id: req.params.id}, {email: req.params.id}]
    }})
  .then((user) => {
    console.log(user)
    console.log('User with id: '+ req.params.id + ' has been deleted.');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send({success: true, status:'User with id: '+ req.params.id + ' has been deleted.'});
  }, (err) => next(err))
  .catch((err) => next(err));
})


  
module.exports = router;