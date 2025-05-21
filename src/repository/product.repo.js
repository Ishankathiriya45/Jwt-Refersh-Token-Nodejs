const { db: { Product } } = require("../models");
const { fetchRecord } = require("../util/common.util");

class ProductRepo {
    findAll = async (options, unscoped = false) => {
        return await fetchRecord(Product, options, options.paginate, unscoped)
    }
}

module.exports = new ProductRepo()