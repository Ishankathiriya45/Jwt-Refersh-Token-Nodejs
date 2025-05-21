require('dotenv').config()

const config = {
    username: process.env[`DB_USERNAME_${process.env.RUN_MODE}`]
}

global.config = config;

module.exports = config