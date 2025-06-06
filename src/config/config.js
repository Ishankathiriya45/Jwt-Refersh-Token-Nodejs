require('dotenv').config()
let envMode = process.env.RUN_MODE;

const config = {
    username: process.env[`DB_USERNAME_${envMode}`],
    password: process.env[`DB_PASSWORD_${envMode}`],
    database: process.env[`DB_NAME_${envMode}`],
    hostname: process.env[`DB_HOSTNAME_${envMode}`],
    dialect: "mysql",
    pool: {
        min: parseInt(process.env.DB_POOL_MIN),
        max: parseInt(process.env.DB_POOL_MAX),
        idle: parseInt(process.env.DB_POOL_IDLE),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE),
    },
    run_mode: process.env.RUN_MODE,
}

global.config = config;

module.exports = config