const {
  db: { Product },
} = require("../models");
const { fetchRecords } = require("../util/common.util");

class ProductRepo {
  findAll = async (options, unscoped = false) => {
    return await fetchRecords(Product, options, options?.is_paginate, unscoped);
  };
}

module.exports = new ProductRepo();
