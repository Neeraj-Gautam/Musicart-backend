const express = require("express");
const router = express.Router();
const checkoutController = require("../controller/checkout");
const { verifyToken } = require("../middlewares/verifyToken");


router.post("/", verifyToken, checkoutController.checkout);

module.exports = router;
