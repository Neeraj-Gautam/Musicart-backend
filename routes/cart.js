const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const authController = require("../controller/auth");

router.get("/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = authController.verifyToken(token);
    const cart = await Cart.findOne({ userId: decodedToken.userId });
    return res.json(cart);
  } catch (error) {
    console.log(error);
  }
});

router.post("/add/product/:uuid/", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const { token, quantity } = req.body;
    const decodedToken = authController.verifyToken(token);
    const email = decodedToken.userId;

    const userDetails = await User.findOne({ email: email });

    if (!userDetails) {
    }

    const product = await Product.findOne({ uuid: uuid });

    if (!product) {
    }
    let cart = await Cart.findOne({ userId: email });

    if (!cart) {
      cart = new Cart({
        userId: email,
        products: [],
      });
    }

    for (let i = 0; i < cart.products.length; i++) {
      let cartItem = cart.products[i];
      if (cartItem.productId === uuid) {
        if (quantity) {
          cartItem.quantity = quantity;
        } else {
          cartItem.quantity++;
        }

        if (cartItem.quantity > 8) cartItem.quantity = 8;

        await Cart.updateOne(
          { userId: cart.userId },
          { $set: { products: cart.products } }
        );

        return res.json(cart);
      }
    }

    const newCartproduct = {
      productId: product.uuid,
      quantity: 1,
    };

    cart.products.push(newCartproduct);
    cart = await cart.save();

    return res.json(cart);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
