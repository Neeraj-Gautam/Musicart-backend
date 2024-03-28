const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");

router.post("/placeOrder", orderController.placeOrder);

module.exports = router;

