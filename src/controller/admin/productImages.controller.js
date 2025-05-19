const { db: { ProductImages } } = require("../../models");
const { responseMsg } = require("../../responses");
const FileService = require("../../service/file.service");

class ProductImagesController {
    constructor() {
        this.fileService = new FileService()
    }

    async create(req, res) {
        try {
            const file = req.files.map((file) => ({
                product_imges: file.filename,
            }));

            const detail = await ProductImages.bulkCreate(file)

            if (detail) {
                return responseMsg.successCode(1, "Success", detail)
            } else {
                return responseMsg.validationError(0, "No product images")
            }
        } catch (error) {
            return responseMsg.serverError(0, "Something went wrong", error.message)
        }
    }

    async list(req, res) {
        try {
            const detail = await ProductImages.findAll()
            
            if (detail) {
                return responseMsg.successCode(1, "Success", detail)
            } else {
                return responseMsg.validationError(0, "No product images")
            }
        } catch (error) {
            return responseMsg.serverError(0, "Something went wrong", error.message)
        }
    }
}

module.exports = {
    ProductImagesController,
}