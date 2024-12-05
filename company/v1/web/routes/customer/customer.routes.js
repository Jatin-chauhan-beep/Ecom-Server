const express = require("express");
const {
  isPasswordValid,
  getCustomerByEmail,
} = require("../../controllers/customer/login");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { getAllOrders } = require("../../controllers/customer/get.controller");

const router = express.Router();

router.post("/login", getCustomerByEmail, isPasswordValid);
router.post("/", jwtValidator, getAllOrders);

module.exports = router;
