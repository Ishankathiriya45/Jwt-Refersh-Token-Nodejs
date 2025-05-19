const express = require('express');
const { AdminModule } = require('../../controller');
const router = express.Router()

const AuthCtr1 = new AdminModule.authCtr1.AuthController()

router.post("/login",
    async (req, res) => {
        const result = await AuthCtr1.login(req, res)
        return result;
    }
)

router.post("/refresh-token",
    async (req, res) => {
        const result = await AuthCtr1.refreshToken(req, res)
        return res.status(result.status).send(result)
    }
)

module.exports = router;