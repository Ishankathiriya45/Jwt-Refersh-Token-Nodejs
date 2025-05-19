'use strict';
const {
  Model
} = require('sequelize');
const { getFileUrl } = require('../util/common.util');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    category: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    rating: DataTypes.INTEGER,

    product_img: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue("product_img")
          ? getFileUrl("product", this.getDataValue("product_img"))
          : getFileUrl("product", "default.png")
      }
    },
  }, {
    timestamps: true,
    sequelize,
    modelName: 'Product',
    tableName: 'product'
  });
  return Product;
};