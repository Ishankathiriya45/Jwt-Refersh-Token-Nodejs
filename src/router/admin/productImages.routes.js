const express = require('express');
const { AdminModule } = require('../../controller');
const { fileUpload, upload } = require('../../util/multer.util');
const router = express.Router()

let ProductImagesCtr1 = new AdminModule.productImagesCtr1.ProductImagesController()

router.post("/create",
    upload().array("product_imges"),
    async (req, res) => {
        const result = await ProductImagesCtr1.create(req, res)
        return res.status(result.status).send(result)
    }
)

router.get("/list",
    async (req, res) => {
        const result = await ProductImagesCtr1.list(req, res)
        return res.status(result.status).send(result)
    }
)

module.exports = router;