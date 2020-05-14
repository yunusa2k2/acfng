const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
        username:{
            type: Sequelize.STRING
        },

        password:{
            type: Sequelize.STRING
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = User;