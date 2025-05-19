const express = require('express')
const router = express.Router()

router.use('/product', require('./product.routes'))
router.use('/productImages', require('./productImages.routes'))
router.use('/auth', require('./auth.routes'))

module.exports = router;