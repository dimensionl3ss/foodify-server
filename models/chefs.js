const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const Chef = sequelize.define(
    "Chef",
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
      phone: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(4096),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'images/chef.jpg'
      }
    },
    {
      tableName: "chefs",
    }
  );

  Chef.associate = models => {

    Chef.belongsTo(models.Dish, { 
      foreignKey: {
      fieldName: 'dishId',
      allowNull: false,
    }});
  }
 return Chef;
};

