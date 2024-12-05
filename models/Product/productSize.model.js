const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/database");
const Product = require("./product.model");

const ProductSizes = sequelize.define(
  "ProductSizes",
  {
    product_sizes_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
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
    tableName: "products_sizes",
  }
);

Product.hasMany(ProductSizes, { foreignKey: "product_id" });
ProductSizes.belongsTo(Product, { foreignKey: "product_id" });
ProductSizes.sync({ alter: false }).then().catch();

module.exports = ProductSizes;
