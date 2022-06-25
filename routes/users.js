var express = require("express");
var router = express.Router();
const {User} = require("../models/");
const bodyParser = require('body-parser');
const passport = require('passport');
const { where, Op } = require("sequelize/dist");
const authenticate = require('../authentication');
const { token } = require("morgan");
const cors = require('./cors');
/* GET users listing. */

router.use(bodyParser.json());

router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
    User.findAll({})
    .then((users) => {
      console.log(users);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post('/signUp', cors.corsWithOptions, function (req, res, next) {

    User.findOne({where: {email: req.body.email}})
    .then((user) => {
      if(user) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        return res.json({success: false, status: 'Registration Unsuccessful!', message: 'Already Registered! Please Login'});
      }
      else {
        User.create(req.body)
        .then((user) => {
          console.log(user);
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!', newUser: user});
          })
        }, (err) => next(err))
        .catch((err) => next(err));
      }  
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .post('/login', cors.corsWithOptions, (req, res, next) => {

    passport.authenticate('local', (err, user, info) =>{
      if(err) 
        return next(err);

        if (!user) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: info});
        }

        req.logIn(user, (err) => {
          if (err) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
          }

          var token = authenticate.getToken({email: req.user.email});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');;
          res.json({success: true, token: token, status: 'You are successfully logged in!'});
        });
    }) (req, res, next);
  })
  
  .get('/logout', cors.corsWithOptions, (req, res) => {
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
  .delete('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.route('/:id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.findOne({where: {id: req.params.id}})
  .then((user) => {
    console.log(user);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
}) 
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.destroy({
    where: {
      email: req.params.id
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