const jwt = require('jsonwebtoken')
const refreshSecretKey = process.env["REFRESH_SECRET_" + process.env.RUN_MODE]
const refreshAlgorithm = process.env["REFRESH_ALGORITHM_" + process.env.RUN_MODE]
const refreshTokenLife = process.env["REFRESH_TOKEN_LIFE_" + process.env.RUN_MODE]

const refreshSignOptions = {
    algorithm: refreshAlgorithm,
    expiresIn: refreshTokenLife,
}

module.exports = {
    refreshSign: (token) => {
        return jwt.sign(token, refreshSecretKey, refreshSignOptions)
    },

    refreshVerify: (token) => {
        return jwt.verify(token, refreshSecretKey)
    },
}