const Sequelize = require('sequelize');
const db = require('../config/database');

const Inventory = db.define('inventory', {
        medicine:{
            type: Sequelize.STRING
        },

        batch:{
            type: Sequelize.STRING
        },

        expiry:{
            type: Sequelize.DATEONLY
        },

        quantity:{
            type: Sequelize.STRING
        },

        available:{
            type: Sequelize.STRING
        },

        category:{
            type: Sequelize.STRING
        },

        note:{
            type: Sequelize.TEXT
        }

    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);

module.exports = Inventory;