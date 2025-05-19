'use strict';
const {
  Model
} = require('sequelize');
const { getFileUrl } = require('../util/common.util');
module.exports = (sequelize, DataTypes) => {
  class ProductImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductImages.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    product_imges: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue("product_imges")
          ? getFileUrl("productimages", this.getDataValue("product_imges"))
          : getFileUrl("productimages", "default.jpg")
      }
    }
  }, {
    timestamps: true,
    sequelize,
    modelName: 'ProductImages',
    tableName: "productimages",
  });
  return ProductImages;
};