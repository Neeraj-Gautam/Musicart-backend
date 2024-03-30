const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/details", verifyToken, cartController.getCartDetails);
router.post("/add-product/:productId", verifyToken, cartController.addProductInCart);

module.exports = router;
