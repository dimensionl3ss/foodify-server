/*const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const config = require('../config/config');
const Sequelize = require('sequelize');

const db = {};
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect
});

connect sequelize to the database
sequelize.authenticate()
.then(() => {
  sequelize.sync();
  console.log('Connected to the databse and synced.\n');
})
.catch((err) => {console.log(err)});
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.Sequelize= Sequelize;
db.sequelize= sequelize;
*/