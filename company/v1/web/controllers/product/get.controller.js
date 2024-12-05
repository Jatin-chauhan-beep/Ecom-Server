const { Op } = require("sequelize");
const Products = require("../../../../../models/Product/product.model");
const ProductSizes = require("../../../../../models/Product/productSize.model");
const globalError = require("../../../../../errors/global.error");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");
const getAllProducts = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;

    const { count, rows: products } = await Products.findAndCountAll({
      where: { deleted: false },
      attributes: [
        "product_id",
        "name",
        "image_url",
        "description",
        "price",
        "rating",
      ],
      include: [
        {
          model: ProductSizes,
          attributes: ["product_sizes_id", "product_id", "size", "quantity"],
        },
      ],
      limit: +pageSize,
      offset: (+pageIndex - 1) * +pageSize,
    });
    if (count === 0) {
      return res.status(200).json({ sucess: true, total: 0, data: [] });
    }

    return res.status(200).json({ sucess: true, total: count, data: products });
  } catch (error) {
    await Logger.create(
      loggerError("/post", "POST", error?.message, API_Prefix + "/product")
    );
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getAllProducts,
};
