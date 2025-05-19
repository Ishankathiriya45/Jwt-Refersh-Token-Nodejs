const express = require('express');
const { AdminModule } = require('../../controller');
const { joyValidate } = require('../../middleware/validator.middleware');
const { ProductValidate } = require('../../validation/product.validate');
const { fileUpload } = require('../../util/multer.util');
const { authToken, productAuth } = require('../../middleware/authToken.middleware');
const router = express.Router()

const ProductCtr1 = new AdminModule.productCtr1.ProductController()

router.post('/create/:categoryId',
    fileUpload().single("product_img"),
    joyValidate(ProductValidate.createProduct),
    async (req, res) => {
        const result = await ProductCtr1.create(req, res)
        return res.status(result.status).send(result)
    }
)

router.get('/list',
    productAuth,
    async (req, res) => {
        const result = await ProductCtr1.list(req, res)
        return res.status(result.status).send(result)
    }
)

router.delete('/delete/:productId',
    async (req, res) => {
        const result = await ProductCtr1.delete(req, res)
        return res.status(result.status).send(result)
    }
)

router.put('/update/:productId',
    fileUpload().single("product_img"),
    async (req, res) => {
        const result = await ProductCtr1.update(req, res)
        return res.status(result.status).send(result)
    }
)

module.exports = router;