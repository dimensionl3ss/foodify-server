const Sequelize = require("sequelize");
//const sequelize = require("../services/db");
// const Comment = require("./comments");

//user-schema

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        field: "first_name",
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        field: "last_name",
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      pin: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
      },
    },
    {
      tableName: "users",
    }
  );

  User.associate = models => {
    User.hasMany(models.Comment, { 
      onDelete: 'cascade',
      foreignKey: {
        allowNull: false,
  }});
  };

 return User;
};

//module.exports = User;
