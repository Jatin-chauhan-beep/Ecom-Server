const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/database");
const bcrypt = require("bcryptjs");

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
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
    tableName: "customers",
    indexes: [
      {
        unique: true,
        fields: ["email"],
        where: {
          deleted: false,
        },
      },
    ],
  }
);

Customer.beforeCreate(async (customer) => {
  const hashedPassword = await bcrypt.hash(customer.password, 10);
  customer.password = hashedPassword;
});

Customer.sync({ alter: false }).then().catch();

module.exports = Customer;
