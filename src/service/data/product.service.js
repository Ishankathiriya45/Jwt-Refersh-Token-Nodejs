const productRepo = require("../../repository/product.repo")

class ProductService {
    findAll = async (options = {}) => {
        return await productRepo.findAll(options, true)
    }
}

module.exports = ProductService