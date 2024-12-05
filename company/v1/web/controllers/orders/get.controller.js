const { Op } = require("sequelize");
const Order = require("../../../../../models/Order/order.model");
const Customer = require("../../../../../models/Customer/customer.model");
const globalError = require("../../../../../errors/global.error");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");

const getAllOrder = async (req, res, next) => {
  try {
    const { pageIndex = 1, pageSize = 10, query = "" } = req.body;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { deleted: false },
      attributes: [
        "order_id",
        "customer_id",
        "order_date",
        "total_amount",
        "payment_status",
        "order_status",
        "delivery_date",
        "shipping_address",
      ],
      include: [
        {
          model: Customer,
          attributes: ["name", "mobile"],
        },
      ],
      raw: true,
      limit: +pageSize,
      offset: (+pageIndex - 1) * +pageSize,
    });
    if (count === 0) {
      return res.status(200).json({ sucess: true, total: 0, data: [] });
    }

    return res.status(200).json({ sucess: true, total: count, data: orders });
  } catch (error) {
    await Logger.create(
      loggerError("/post", "POST", error?.message, API_Prefix + "/order")
    );
    return next(globalError(500, error.message));
  }
};

module.exports = {
  getAllOrder,
};
