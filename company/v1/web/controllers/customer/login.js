const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../../../../../models/Customer/customer.model");
const globalError = require("../../../../../errors/global.error");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");
const getCustomerByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existCustomer = await Customer.findOne({
      where: { email, deleted: false },
      attributes: [
        "customer_id",
        "name",
        "mobile",
        "email",
        "password",
        "createdAt",
      ],
    });
    if (!existCustomer) {
      return next(globalError(404, "Customer not found"));
    }
    req.customer = existCustomer.toJSON();
    return next();
  } catch (error) {
    await Logger.create(
      loggerError(
        "/post",
        "POST",
        error?.message,
        API_Prefix + "/customer/login"
      )
    );
    return next(globalError(500, "Internal Server Error"));
  }
};

const isPasswordValid = async (req, res, next) => {
  try {
    let isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      req?.customer.password
    );
    if (!isPasswordCorrect) {
      return next(globalError(401, "Invalid Credentials"));
    }
    const { password, ...otherData } = req.customer;
    const token = jwt.sign(
      {
        user: { ...otherData },
        type: "customer",
        authority: ["customer"],
      },
      process.env.PRIVATEKEY,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      success: true,
      token,
      data: { ...otherData },
      authority: ["customer"],
    });
  } catch (error) {
    await Logger.create(
      loggerError(
        "/post",
        "POST",
        error?.message,
        API_Prefix + "/customer/login"
      )
    );
    return next(globalError(500, "Internal Server Error"));
  }
};

module.exports = { getCustomerByEmail, isPasswordValid };
