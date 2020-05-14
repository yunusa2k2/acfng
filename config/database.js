const Sequelize = require('sequelize');
module.exports = new Sequelize('acfng', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: 0,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});