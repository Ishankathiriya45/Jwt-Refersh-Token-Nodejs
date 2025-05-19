const crypto = require('node:crypto')
const { Buffer } = require('node:buffer')

const password = process.env["CRYPTO_PASSWORD_" + process.env.RUN_MODE]
const algorithm = process.env["CRYPTO_ALGORITHM_" + process.env.RUN_MODE]
const key = crypto.scryptSync(password, "salt", 32)
const iv = Buffer.alloc(16, 0)

module.exports = {
    encrypt: (data) => {
        let cipher = crypto.createCipheriv(algorithm, key, iv)
        let encryptData = cipher.update(data, "utf-8", "hex")
        encryptData += cipher.final("hex")
        return encryptData
    },

    decrypt: (data) => {
        let cipher = crypto.createDecipheriv(algorithm, key, iv)
        let encryptData = cipher.update(data, "hex", "utf-8")
        encryptData += cipher.final("utf-8")
        return encryptData
    }
}