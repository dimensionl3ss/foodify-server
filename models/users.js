const Sequelize = require('sequelize');
const sequelize = require('../services/db');

//user-schema
const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      field: 'first_name',
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      field: 'last_name',
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: '0'
    }
  }, {
    tableName: 'users'
  });
  
sequelize.sync()
.then(() => console.log('Users table created.'))
.catch((err) => console.log(err));
module.exports = User;