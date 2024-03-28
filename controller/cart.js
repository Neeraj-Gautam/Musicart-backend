const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getProductsInfoFromCart = async (cart) => {
  try {
    let productIdToQuantityMap = new Map();

    for(let i=0;i<cart.products.length;i++) {
      const cartItem = cart.products[i];
      productIdToQuantityMap.set(cartItem.productId, cartItem.quantity);

    }
 
    const products = await Product.find({
      uuid: { $in: [...productIdToQuantityMap.keys()] },
    });

    let data = [];

    for (let i = 0; i < products.length; i++) {
      console.log(products[i])
      data.push({
        product: products[i],
        quantity: productIdToQuantityMap.get(products[i].uuid),
      });
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getProductsInfoFromCart };
