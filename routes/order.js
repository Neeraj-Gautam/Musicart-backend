const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/placeOrder", verifyToken, orderController.placeOrder);
router.get("/order-details/:orderId", verifyToken, orderController.getOrder);
router.get("/all", verifyToken, orderController.getAllOrdersForUser);

module.exports = router;

