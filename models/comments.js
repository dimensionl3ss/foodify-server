const Sequelize = require('sequelize');
//const sequelize = require('../services/db');
//const Dish = require('./dishes');
//const User = require('./users');

module.exports = (sequelize) => {
const Comment = sequelize.define('Comment', {
    commentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    stars: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'comments'
});

Comment.associate = models => {
    Comment.belongsTo(models.Dish, {
        foreignKey: {
            allowNull: false,
        }
    });
}

Comment.associate = models => {

    Comment.belongsTo(models.User, {
        foreignKey: {
            allowNull: false
        }
    });
}
return Comment; 
}

//module.exports= Comment;