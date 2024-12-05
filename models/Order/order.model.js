const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/database");
const Customer = require("../Customer/customer.model");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    order_status: {
      type: DataTypes.ENUM("processing", "shipped", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "processing",
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "orders",
  }
);

Order.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Order.sync({ alter: false }).then().catch();

module.exports = Order;
