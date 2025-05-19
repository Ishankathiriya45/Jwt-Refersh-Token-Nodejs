const jwt = require('jsonwebtoken')
const jwtSecretKey = process.env["JWT_SECRET_" + process.env.RUN_MODE]
const jwtAlgorithm = process.env["JWT_ALGORITHM_" + process.env.RUN_MODE]
const jwtTokenLife = process.env["JWT_TOKEN_LIFE_" + process.env.RUN_MODE]

const jwtSignOptions = {
    algorithm: jwtAlgorithm,
    expiresIn: jwtTokenLife,
}

module.exports = {
    jwtSign: (token) => {
        return jwt.sign(token, jwtSecretKey, jwtSignOptions)
    },

    jwtVerify: (token) => {
        return jwt.verify(token, jwtSecretKey)
    },
}