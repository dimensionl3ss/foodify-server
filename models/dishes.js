const Sequelize = require('sequelize');
// const Comment = require('./comments');

module.exports = (sequelize) => {
const Dish = sequelize.define('Dish', {
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

  Dish.associate = (models) => {

    Dish.hasMany(models.Comment, { 
      onDelete: 'cascade',
      foreignKey: {
      fieldName: 'dishId',
      allowNull: false,
    }});
  }
return Dish; 
}

//module.exports = Dish;