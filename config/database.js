const Sequelize = require('sequelize');
module.exports = new Sequelize('mozacs6znbnlfqn9', 'mmbd48vz4dw3os9h', 'xrfaljz6288cexcs', {
    host: 'pqxt96p7ysz6rn1f.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    operatorsAliases: 0,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

// const Sequelize = require('sequelize');
// module.exports = new Sequelize('acfng', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
//     operatorsAliases: 0,
//
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     },
// });