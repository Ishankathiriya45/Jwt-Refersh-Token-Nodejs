const { responseMsg } = require("../../responses");
const { uploadImg } = require('../../helper/common');
const FileService = require("../../service/file.service");
const { db: { Product, ProductImages }, sequelize } = require("../../models");
const { where, Op, Sequelize } = require("sequelize");
const { isEmpty, generateFileName, getFilterCluse } = require("../../util/common.util");
const ProductService = require("../../service/data/product.service");

class ProductController {
    constructor() {
        this.fileService = new FileService()
        this.productService = new ProductService()
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
            const { page, limit, paginate = true, search } = req.query;

            let options = {
                // include: [
                //     {
                //         model: ProductImages,
                //         as: "product_images",
                //     },
                // ],
                order: [["createdAt", "asc"]],
                distinct: true,
            }

            if (search) {
                options.where = {
                    ...options.where,
                    ...getFilterCluse({
                        fields: ['name'],
                        search,
                    })
                }
            }

            if (paginate) {
                options.page = page;
                options.limit = limit;
                options.paginate = paginate;
            }

            const detail = await this.productService.findAll(options)

            if (detail) {
                // logger.customLogger.log("info", "Success list of product")
                return responseMsg.successCode(1, "Success", detail)
            } else {
                return responseMsg.validationError(0, "Product not found")
            }
        } catch (error) {
            responseMsg.serverError(0, "Something went wrong", error.message)
            // return logger.customLogger.log("error", "Error")
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

    async count(req) {
        const [results] = await sequelize.query(`
            SELECT sum(price) AS product_count FROM product group by rating
            
            SELECT name,
            sum(price) over (partition by category order by rating DESC) AS total_price
            FROM product
        `);

        // let options = {
        //     attributes: {
        //         include: [[
        //             Sequelize.literal(`
        //                 SELECT COUNT(*) AS product_count FROM product
        //                 `),"total_product",
        //         ]]
        //     }
        // }

        // let pro = await Product.findAll(options)

        return responseMsg.successCode(1, "Success", results)
    }
}

module.exports = {
    ProductController,
}