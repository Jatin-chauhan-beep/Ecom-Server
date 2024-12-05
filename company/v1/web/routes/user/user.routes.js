const express = require("express");
const {
  isPasswordValid,
  getUserByEmail,
} = require("../../controllers/user/login");

const router = express.Router();

router.post("/login", getUserByEmail, isPasswordValid);

module.exports = router;
