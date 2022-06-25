var express = require("express");
var dishRouter = express.Router();
const bodyParser = require("body-parser");
const {Dish, User, Comment} = require('../models/');
const passport = require('passport');
const authenticate = require('../authentication');
const cors = require('./cors');

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => {
    Dish.findAll(req.query)
    .then((dishes) => {
      console.log(dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.create(req.body)
    .then((dishes) => {
      console.log(dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => {
    Dish.findByPk(req.params.dishId)
    .then((dishes) => {
      console.log(dishes);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

      Dish.findOne({where: {id: req.params.dishId}})
      .then((dish) => {
        if(dish) {
          return dish;
        }
        else throw new Error('Dish doesnt exist!');
      }, (err) => next(err))
      .then((dish) => dish.dataValues)
      .then((dish) => {

        req.body.name = dish.name;
        req.body.description = dish.description;
        console.log(req.body);
        Dish.update(req.body, {where: {id: dish.id}})
        .then(() => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, message: 'Dish updated sucessfully!'});
        })
      })
      .catch((err) => next(err));
      /*Dish.update(req.body, {where: {id: req.params.dishId}})
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
      .catch((err) => next(err));*/
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
