const Sequelize = require('sequelize');
const sequelize = require('../services/db');

const Feedback = sequelize.define('feedback', {
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
    phone: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    agree: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: '0',
    },
    contactType: {
        field: 'contact_type',
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'phone'
    },
    message: {
        type: Sequelize.STRING(4096),
        allowNull: false,
    }
  }, {
    tableName: 'feedbacks'
  });
  
sequelize.sync()
.then(() => console.log('Feedbacks table created.'))
.catch((err) => console.log(err));
module.exports = Feedback; 