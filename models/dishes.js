const Sequelize = require('sequelize');
const sequelize = require('../services/db');

//user-schema
const Dish = sequelize.define('dish', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      field: 'name',
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      field: 'description',
      type: Sequelize.STRING(4096),
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
  }, {
    tableName: 'dishes'
  });
  
sequelize.sync()
.then(() => console.log('Dishes table created.'))
.catch((err) => console.log(err));
module.exports = Dish;