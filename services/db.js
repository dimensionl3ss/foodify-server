const mysql = require('mysql2');
const config = require('../config/config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect
});

//connect sequelize to the database
sequelize.authenticate()
.then(() => {
  console.log('Connected to the databse.\n');
})
.catch((err) => {console.log(err)});

module.exports = sequelize;