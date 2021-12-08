var express = require("express");
var dishRouter = express.Router();
const bodyParser = require("body-parser");
const Dishes = require("../models/dishes");
const sql = require("../services/db");

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    sql
      .promise()
      .query("select * from dishes")
      .then(
        ([rows, fields]) => {
          console.log(rows);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(rows);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    const newDish = new Dishes(req.body);
    sql
      .promise()
      .query("insert into dishes set ?", newDish)
      .then(
        ([rows, fields]) => {
          console.log("new dish added", { id: rows.insertId, ...newDish });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ id: rows.insertId, ...newDish });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    sql
      .promise()
      .query("delete from dishes")
      .then(
        ([rows, fields]) => {
          console.log(rows.affectedRows + "rows deleted");
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json("All dishes has been deleted");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    sql
      .promise()
      .query("select * from dishes where id = ?", req.params.dishId)
      .then(
        ([rows, fields]) => {
          console.log(rows);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(rows);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    sql
      .promise()
      .query("update dishes set ? where id = ?", [req.body, req.params.dishId])
      .then(
        ([rows, fields]) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          console.log(rows.affectedRows, "rows affected");
          res.json(rows);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    sql
      .promise()
      .query("delete from user where id= ?", req.params.dishId)
      .then(([rows, field]) => {});
  });

module.exports = dishRouter;
