const { Op } = require("sequelize");
const Order = require("../../../../../models/Order/order.model");
const OrderList = require("../../../../../models/Order/orderList.model");
const Product = require("../../../../../models/Product/product.model");
const Customer = require("../../../../../models/Customer/customer.model");
const globalError = require("../../../../../errors/global.error");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");

const getAllOrders = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, customer_id } = req.body;

    let CustomerCondition = {
      [Op.and]: {},
    };
    if (customer_id) {
      CustomerCondition[Op.and].push({
        customer_id,
      });
    }

    const { count, rows: orders } = await OrderList.findAndCountAll({
      where: { deleted: false },
      include: [
        {
          model: Order,
          where: { ...CustomerCondition },
        },
        {
          model: Product,
          attributes: ["name", "rating", "price", "image_url"],
        },
      ],
      limit: +pageSize,
      offset: (+pageIndex - 1) * +pageSize,
    });
    if (count === 0) {
      return res.status(200).json({ sucess: true, total: 0, data: [] });
    }

    return res.status(200).json({ sucess: true, total: count, data: orders });
  } catch (error) {
    await Logger.create(
      loggerError(
        "/post",
        "POST",
        error?.message,
        API_Prefix + "/customer/orders"
      )
    );
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getAllOrders,
};
