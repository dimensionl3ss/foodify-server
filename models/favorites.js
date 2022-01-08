const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Favorite = sequelize.define('Favorite', {

        DishId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
    },{
        tableName: 'favorites'
    });

    /*Favorite.associate = models => {
        Favorite.hasMany(models.Dish, {
            onDelete: 'cascade',
            foreignKey: {
                fieldName: 'dishId',
                allowNull: false,
            }
        })
    }*/
    Favorite.associate = models => {
        Favorite.belongsTo(models.User, {
            onDelete: 'cascade',
            foreignKey: {
                allowNull: false,
            }
        })
        Favorite.belongsTo(models.Dish, {
            onDelete: 'cascade',
            foreignKey: {
                allowNull: false,
            }
        })
    }
    /*Favorite.associate = models => {
        Favorite.belongsTo(models.Dish, {
            onDelete: 'cascade',
            foreignKey: {
                allowNull: false,
            }
        })
    }*/
    return Favorite;
}