var express = require("express");
var dishRouter = express.Router();
const bodyParser = require("body-parser");
const Dish = require("../models/dishes");
const passport = require('passport');
const authenticate = require('../authentication');

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    Dish.findAll({})
    .then((dishes) => {
      console.log(dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.create(req.body)
    .then((dishes) => {
      console.log(dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.destroy({truncate: true})
    .then((dishes) => {
      console.log(dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status:'All dishes has been deleted'});
    }, (err) => next(err))
    .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dish.findOne({
      where: {id: req.params.dishId}
    })
    .then((dishes) => {
      console.log(dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Dish.update(req.body, {where: {id: req.params.dishId}})
      .then((dish) => {

        if(dish) {
          Dish.findOne({where: {id: dish}})
          .then((dish) => {
            console.log(dish);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
          })
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  })

  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.destroy({
      where: {id: req.params.dishId}
    })
    .then((dish) => {
      console.log(dish);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status:'Dish with id '+ req.params.dishId + ' has been deleted.'});
    }, (err) => next(err))
    .catch((err) => next(err));
  });

module.exports = dishRouter;
