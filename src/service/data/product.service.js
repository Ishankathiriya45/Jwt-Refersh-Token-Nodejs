const { ProductRepository } = require("../../repository");

class ProductService {
  findAll = async (options = {}) => {
    return await ProductRepository.findAll(options, true);
  };
}

module.exports = ProductService;
