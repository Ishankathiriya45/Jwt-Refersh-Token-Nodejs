const { responseMsg } = require("../../responses");
const { uploadImg } = require('../../helper/common');
const FileService = require("../../service/file.service");
const { db: { Product }, sequelize } = require("../../models");
const { where } = require("sequelize");
const { isEmpty, generateFileName } = require("../../util/common.util");

class ProductController {
    constructor() {
        this.fileService = new FileService()
    }

    async create(req) {
        let t = await sequelize.transaction()
        try {
            const { categoryId } = req.params;
            const { name, price, rating } = req.body;
            const image = req.file;
            // let imgFileName = generateFileName(req.file.originalname)

            let imageName = null;
            if (image) {
                const uploadFile = await this.fileService.uploadFile(
                    image,
                    "product",
                    "disk",
                )
                imageName = uploadFile.fileName;
            }

            const productData = {
                name: name,
                category: categoryId,
                price: price,
                rating: rating,
                product_img: imageName,
            }

            const detail = await Product.create(productData, { transaction: t })

            if (detail) {
                // uploadImg(imgFileName, req.file.buffer)
                await t.commit()
                return responseMsg.successCode(1, "Success", detail)
            } else {
                return responseMsg.validationError(0, "No product added")
            }
        } catch (error) {
            await t.rollback()
            return responseMsg.serverError(0, "Something went wrong", error.message)
        }
    }

    async list(req) {
        try {
            const detail = await Product.findAll()

            if (detail) {
                return responseMsg.successCode(1, "Success", detail)
            } else {
                return responseMsg.validationError(0, "Product not found")
            }
        } catch (error) {
            return responseMsg.serverError(0, "Something went wrong", error.message)
        }

    }

    async update(req) {
        try {
            const { productId } = req.params;
            const { name, price, rating } = req.body;
            const file = req.file;
            let imageName;

            const getProduct = await Product.findByPk(productId)
            if (isEmpty(getProduct)) {
                return responseMsg.validationError(0, "product not found")
            }

            if (file) {
                const uploadImage = await this.fileService.uploadFile(
                    file,
                    "product",
                    "disk",
                )

                await this.fileService.unlinkFile(
                    getProduct.dataValues.product_img,
                    "product",
                    "disk",
                )
                imageName = uploadImage.fileName;
            }

            const productRequestPaylod = {
                ...(name && { name: name }),
                ...(price && { price: price }),
                ...(rating && { rating: rating }),
                ...(imageName && { product_img: imageName }),
            }

            // const updateData = {}
            // name ? (updateData.name = name) : null;

            const detail = await Product.update(productRequestPaylod,
                { where: { id: productId } })

            if (detail) {
                return responseMsg.successCode(1, "Success", detail)
            } else {
                return responseMsg.validationError(0, "No product updated")
            }
        } catch (error) {
            return responseMsg.serverError(0, "Something went wrong", error.message)
        }
    }

    async delete(req) {
        try {
            const { productId } = req.params;

            const getProduct = await Product.findByPk(productId)
            if (isEmpty(getProduct)) {
                return responseMsg.validationError(0, "product not found")
            }

            await this.fileService.unlinkFile(
                getProduct.dataValues.product_img,
                "product",
                "disk",
            )

            const detail = await Product.destroy({ where: { id: productId } })

            if (detail) {
                return responseMsg.successCode(1, "Success", detail)
            } else {
                return responseMsg.validationError(0, "No product deleted")
            }
        } catch (error) {
            return responseMsg.serverError(0, "Something went wrong", error.message)
        }
    }
}

module.exports = {
    ProductController,
}