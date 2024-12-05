const { Op } = require("sequelize");
const Order = require("../../../../../models/Order/order.model");
const OrderList = require("../../../../../models/Order/orderList.model");
const Customer = require("../../../../../models/Customer/customer.model");
const globalError = require("../../../../../errors/global.error");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");
const { sequelize } = require("../../../../../configs/database");

const newOrderRegister = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      customer_id,
      total_amount,
      payment_status = "pending",
      order_status = "processing",
      delivery_date,
    } = req.body;

    const orderData = {
      customer_id,
      total_amount,
      payment_status,
      order_status,
      delivery_date,
      order_date: new Date(),
    };
    const newOrder = await Order.create(orderData, {
      transaction: t,
    });

    if (!newOrder) {
      await t.rollback();
      return next(globalError(500, "Failed to create the order"));
    }
    req.order = newOrder.toJSON();
    req.t = t;
    return next();
  } catch (error) {
    await t.rollback();
    await Logger.create(
      loggerError(
        "/post",
        "POST",
        error?.message,
        API_Prefix + "/order/register"
      )
    );
    return res.status(500).json(globalError(500, error.message));
  }
};

const bulkCreateOrderList = async (req, res) => {
  const t = req.t;
  try {
    const { orderListData } = req.body;

    const value = orderListData.map((m) => {
      return {
        product_id: m.product_id,
        price: m.price,
        quantity: m.ProductSizes.quantity,
        size: m.ProductSizes.size,
        order_id: req.order.order_id,
      };
    });

    const createdOrderList = await OrderList.bulkCreate(value, {
      transaction: t,
    });
    await t.commit();
    return res.status(201).json({
      message: "Order List created successfully",
      data: createdOrderList,
    });
  } catch (error) {
    await t.rollback();
    await Logger.create(
      loggerError(
        "/post",
        "POST",
        error?.message,
        API_Prefix + "/order/register/list"
      )
    );
    return res.status(500).json(globalError(500, error.message));
  }
};

module.exports = { newOrderRegister, bulkCreateOrderList };
