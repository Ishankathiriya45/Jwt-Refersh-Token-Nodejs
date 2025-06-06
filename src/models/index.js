'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const clc = require('cli-color');
const basename = path.basename(__filename);
const config = require('../config/config')
const db = {};

const username = process.env[`DB_USERNAME_${process.env.RUN_MODE}`]
const password = process.env[`DB_PASSWORD_${process.env.RUN_MODE}`]
const database = process.env[`DB_NAME_${process.env.RUN_MODE}`]
const hostname = process.env[`DB_HOSTNAME_${process.env.RUN_MODE}`]

let sequelize;
sequelize = new Sequelize(database, username, password, {
  host: hostname,
  dialect: "mysql",
  logging: false,
})

sequelize.authenticate().then(() => {
  console.log(clc.magenta(`Connection has been successfully`), clc.cyan.underline(`DB_NAME::${config.database}`))
}).catch((error) => {
  console.error(clc.red('Unable has been connection', error.message))
})

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = { db, sequelize };
