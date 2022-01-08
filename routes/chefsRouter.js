const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {Dish, Chef} = require('../models/');
const passport = require('passport');
const authenticate = require('../authentication');
const cors = require('./cors');


router.use(bodyParser.json());

router
.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {

    Chef.findAll({include: [{model: Dish, as: 'Dish'}]},req.query)
    .then((chefs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(chefs);
    },(err) => next(err))
    .catch(err => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Chef.create(req.body)
    .then((chefs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(chefs);
    },(err) => next(err))
    .catch(err => next(err));
})

module.exports = router;