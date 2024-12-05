const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/database");
const Order = require("./order.model");
const Product = require("../Product/product.model");

const OrderList = sequelize.define(
  "OrderList",
  {
    order_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "order_list",
    indexes: [
      {
        fields: ["product_id"],
      },
      {
        fields: ["order_id"],
      },
    ],
  }
);
Product.hasMany(OrderList, {
  foreignKey: "product_id",
});
Order.hasMany(OrderList, {
  foreignKey: "order_id",
});
OrderList.belongsTo(Product, {
  foreignKey: "product_id",
});
OrderList.belongsTo(Order, {
  foreignKey: "order_id",
});

OrderList.sync({ alter: false }).then().catch();

module.exports = OrderList;
