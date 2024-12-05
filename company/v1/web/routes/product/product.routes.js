const express = require("express");
const jwtValidator = require("../../../../../utils/validators/token.validator");
const { getAllProducts } = require("../../controllers/product/get.controller");

const router = express.Router();

router.post("/", getAllProducts);

module.exports = router;
