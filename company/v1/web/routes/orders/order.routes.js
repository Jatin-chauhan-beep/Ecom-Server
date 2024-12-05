const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const {
  newOrderRegister,
  bulkCreateOrderList,
} = require("../../controllers/orders/register.controller");
const { getAllOrder } = require("../../controllers/orders/get.controller");

const router = express.Router();

router.post("/register", jwtValidator, newOrderRegister, bulkCreateOrderList);
router.post("/", jwtValidator, getAllOrder);

module.exports = router;
