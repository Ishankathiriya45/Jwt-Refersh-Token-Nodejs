const { where } = require("sequelize");
const { db: { User } } = require("../../models");
const { responseMsg } = require("../../responses");
const { jwtSign, jwtVerify } = require("../../util/jwt.util");
const { refreshSign, refreshVerify } = require("../../util/refresh.util");

class AuthController {
    constructor() { }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            let getUser = await User.findOne({
                where: {
                    email: email,
                }
            })

            let comparePass = password === getUser.password;

            if (!getUser && comparePass == false) {
                return responseMsg.validationError(0, "User not found")
            }

            let tokenData = {
                id: getUser.id,
                email: getUser.email,
            }

            let accessToken = jwtSign(tokenData)
            let refreshToken = refreshSign(tokenData)

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true, // Use true in production with HTTPS
                sameSite: 'Strict', // Adjust for cross-site
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            }).status(200).send({ status: 200, responseCode: 1, success: true, message: "success", data: accessToken, error: null })
        } catch (error) {
            return res.status(500).send({ status: 500, responseCode: 0, success: false, message: "Something went wrong", data: null, error: error.message })
        }
    }

    async refreshToken(req, res) {
        try {
            const token = req.cookies.refreshToken;
            
            if (!token) {
                return responseMsg.validationError(0, "Token not found")
            }

            let decoded = refreshVerify(token)

            let getUser = await User.findOne({
                where: {
                    email: decoded.email,
                }
            })

            let tokenData = {
                id: getUser.id,
                email: getUser.email,
            }

            let newToken = jwtSign(tokenData)

            return responseMsg.successCode(1, "Success", newToken)
        } catch (error) {
            return responseMsg.serverError(0, "Something went wrong", error.message)
        }
    }
}

module.exports = {
    AuthController
}