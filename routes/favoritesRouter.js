const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authentication');
const cors = require('./cors');
const bodyParser = require('body-parser');
const {Favorite, Dish, User} = require('../models/');

router.use(bodyParser.json());

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {

    Favorite.findAll({
        include:[{model: User, as: 'User'}, {model: Dish, as: 'Dish'}], where: {'$User.email$' : req.user.email}})
    .then((favorites) => {

        res.statusCode = 200;
        res.setHeader('Conetent-Type', 'application/json');
        res.json(favorites);
        
    },(err) => next(err))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorite.findOne({
        include:[{model: User, as: 'User'}, {model: Dish, as: 'Dish'}], 
        where: {'$User.email$' : req.user.email, DishId : req.body.DishId}})

    .then((favorite) => {
        if(favorite) {
            res.statusCode = 200;
            res.setHeader('Conetent-Type', 'application/json');
            res.json({success: false, message: 'Favorite already exists!'});
        }
        else {
            User.findOne({where: {email: req.user.email}})
            .then(user => user.dataValues.id)
            .then(UserId => {
                req.body.UserId = UserId;
                Favorite.create(req.body)
                .then(() => {
                    Favorite.findAll({
                        include:[{model: User, as: 'User'}, {model: Dish, as: 'Dish'}], 
                        where: {'$User.email$' : req.user.email}})
                    .then(favorites => {
                        res.statusCode = 200;
                        res.setHeader('Conetent-Type', 'application/json');
                        res.json(favorites);
                    })
                    .catch(err => next(err));
                })
                .catch(err => next(err));
            })
        }
    },(err) => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.destroy({where: {'$User.email': req.user.email}})
    .then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, message: `All favorites deleted!`});
    },(err) => next(err))
    .catch(err => next(err));
})
router.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        include:[{model: User, as: 'User'}, {model: Dish, as: 'Dish'}], 
        where: {'$User.email$' : req.user.email, DishId : req.params.dishId}})
    .then((favorite) => {
        if(!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, message: `You dont have any favorite with dishId ${req.params.dishId}`});
        }
        else{
            Favorite.destroy({where: {DishId: req.params.dishId, UserId: favorite.dataValues.User.id}})
            .then(() => {

                Favorite.findAll({
                    include:[{model: User, as: 'User'}, {model: Dish, as: 'Dish'}], 
                    where: {'$User.email$' : req.user.email}})
                .then(favorites => {

                    console.log('Fav deleted!');
                    if(favorites === null) {
                        res.statusCode = 200;
                        res.setHeader('Conetent-Type', 'application/json');
                        res.json({success: false, message: `You don't have any favorites!`});
                    }
                    else {
                        res.statusCode = 200; 
                        res.setHeader('Conetent-Type', 'application/json');
                        res.json(favorites);
                    }
                },(err) => next(err))
                .catch(err => next(err));
            }, (err) => next(err))
            .catch(err => next(err)); 
        }
    })
})
module.exports = router;