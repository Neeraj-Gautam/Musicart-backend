const express = require("express");
const Product = require("../models/product");
const Cart = require("../models/cart");

const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    let productMap = new Map();
    console.log(cart.products);

    for (let i = 0; i < cart.products.length; i++) {
      const cartItem = cart.products[i];
      productMap.set(cartItem.productId, cartItem.quantity);
    }
    const productIds = [...productMap.keys()];
    const products = await Product.find({
      productId: { $in: productIds },
    });

    let data = [];

    for (let i = 0; i < products.length; i++) {
      console.log(products[i]);
      data.push({
        product: products[i],
        quantity: productMap.get(products[i].productId),
      });
    }
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { checkout };
