const {
  db: { ProductImages },
} = require("../../models");
const {
  ApiResponse: { successCode, serverError, validationError },
} = require("../../responses");
const { FileService } = require("../../service");

class ProductImagesController {
  constructor() {
    this.fileService = new FileService();
  }

  async create(req, res) {
    try {
      const file = req.files.map((file) => ({
        product_imges: file.filename,
      }));

      const detail = await ProductImages.bulkCreate(file);

      if (detail) {
        return successCode(1, "Success", detail);
      } else {
        return validationError(0, "No product images");
      }
    } catch (error) {
      return serverError(0, "Something went wrong", error.message);
    }
  }

  async list(req, res) {
    try {
      const detail = await ProductImages.findAll();

      if (detail) {
        return successCode(1, "Success", detail);
      } else {
        return validationError(0, "No product images");
      }
    } catch (error) {
      return serverError(0, "Something went wrong", error.message);
    }
  }
}

module.exports = {
  ProductImagesController,
};
