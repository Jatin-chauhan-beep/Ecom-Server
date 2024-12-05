const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../../../../models/User/user.model");
const globalError = require("../../../../../errors/global.error");
const API_Prefix = require("../../../constants/constant");
const Logger = require("../../../../../models/logger.model");
const loggerError = require("../../../../../errors/logger.error");
const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existUser = await User.findOne({
      where: { email, deleted: false },
      attributes: [
        "user_id",
        "name",
        "mobile",
        "email",
        "password",
        "createdAt",
      ],
    });

    if (!existUser) {
      return next(globalError(404, "User not found"));
    }
    req.user = existUser.toJSON();
    return next();
  } catch (error) {
    await Logger.create(
      loggerError("/post", "POST", error?.message, API_Prefix + "/user/login")
    );
    return next(globalError(500, error.message));
  }
};

const isPasswordValid = async (req, res, next) => {
  try {
    let isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      req?.user.password
    );
    if (!isPasswordCorrect) {
      return next(globalError(401, "Invalid Credentials"));
    }
    const { password, ...otherData } = req.user;
    const token = jwt.sign(
      {
        user: { ...otherData },
        type: otherData.type,
        authority: [otherData.type],
      },
      process.env.PRIVATEKEY,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      success: true,
      token,
      data: { ...otherData },
      authority: [otherData.type],
    });
  } catch (error) {
    await Logger.create(
      loggerError("/post", "POST", error?.message, API_Prefix + "/user/login")
    );
    return next(globalError(500, error.message));
  }
};

module.exports = { getUserByEmail, isPasswordValid };
