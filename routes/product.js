const express = require("express");
const router = express.Router();
const productController = require("../controller/product");


router.get("/all", productController.getAllProducts);
router.get("/:productId", productController.getProduct);


module.exports = router;
