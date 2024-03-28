const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Cart = require("../models/cart");

router.get("/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = authController.verifyToken(token);
    const cart = await Cart.findOne({ userId: decodedToken.userId });

    let productMap = new Map();
    console.log(cart.products)

    for(let i=0;i<cart.products.length;i++) {
      const cartItem = cart.products[i];
      productMap.set(cartItem.productId, cartItem.quantity);

    }
    const productIds = [...productMap.keys()];
    const products = await Product.find({
      uuid: { $in: productIds },
    });

    let data = [];

    for (let i = 0; i < products.length; i++) {
      console.log(products[i])
      data.push({
        product: products[i],
        quantity: productMap.get(products[i].uuid),
      });
    }
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
