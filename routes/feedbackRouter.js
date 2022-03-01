const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require('./cors');
const {Feedback} = require('../models/');

router.use(bodyParser.json());
router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.cors, (req, res, next) => {
    console.log(req.body);
    Feedback.create(
        req.body)
    .then((feedback) => {
        res.sendStatus = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    }, (err) => next(err))  
    .catch(err => next(err));
})

module.exports = router;