const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authentication');
const cors = require('./cors');
const bodyParser = require('body-parser');

const {Dish, User, Comment} = require('../models/');

router.use(bodyParser.json());

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    
    Comment.findAll({include : [{model: User, as: 'User'}]}, req.query)
  .then((comments) => {
      console.log(comments)
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      res.json(comments);
  }, (err) => next(err))
  .catch(err => next(err));
})
 
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    User.findOne({where: {email: req.user.email }})
    .then((user) => user.dataValues.id)
    .then((userId) => {
      if(req.body !== null) {
        req.body.UserId = userId;
        Comment.create(req.body)
        .then(comment => comment.dataValues.commentId)
        .then(commentId => {
            Comment.findOne({where: {commentId: commentId},include:[{model: User, as: 'User'}]})
            .then(commentWithUser => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(commentWithUser);
              console.log(JSON.stringify(commentWithUser));
            })
        }, (err) => next(err)) 
        .catch(err => next(err));
     }
     else {
        let err = new Error('Comment not found in request body');
        err.status = 404;
        return next(err);
     }
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req, res, next) => {
  Comment.destroy({})
  .then(() => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, message: 'All comments deleted!'});
  })
})
router.route('/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
  Comment.findOne({
    include: [{
      model: User,
      as: 'Users',
    }]
  }, {where: {commentId: req.params.commentId}})
  .then((user))
})
/*.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Comment.findOne({where: {CommentId: req.params.commentId}})
  .then((comment) => {
      if(comment) {

        let userId;
        User.findOne({where: {email: req.user.email}})
        .then((user) => {userId = user.id})

       if(userId && comment.UserId === userId) {
        Comment.update(req.body, {where: {commentId: req.params.commentId}})
        .then(() => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json({success: true, message: 'Comment Updated Successfully'});
        }, (err) => next(err))
        .catch(err => next(err)); 
      } else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Access Denied'});
      }}
      else {
        let err = new Error('Cannot find comment with' + req.params.commentId);
        err.status = 404;
        return next(err);
      }
  }, (err) => next(err))
  .catch(err => next(err));
})*/
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Comment.findByPk(req.params.commentId)
  .then((comment) => comment === null ? next(new Error('Cannot find comment with' + req.params.commentId)) : comment)
  .then((comment) => comment.dataValues)
  .then((comment) => { 
      User.findOne({where: {email: req.user.email}})
      .then((user) => user.dataValues.id)
      .then((userId) => {
          if(comment.UserId !== userId) {
            let err = new Error('Access Denied');
            err.status = 401;
            next(err);
          }
          //console.log(comment);
           Comment.destroy({where: {commentId: req.params.commentId}})
          .then(() => console.log('Comment deleted'))
          .then(() => {
            Comment.findAll({where: {dishId: comment.dishId}, include: [{model: User, as: 'User'}]})
            .then((comments) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(comments);
              //console.log(JSON.stringify(comments))
            });
        });

    })},(err) => next(err))
  .catch(err => next(err));
})

module.exports = router;