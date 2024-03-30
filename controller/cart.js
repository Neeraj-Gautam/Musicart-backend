const express = require("express");
const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getProductsInfoFromCart = async (cart) => {
  try {
    let productIdToQuantityMap = new Map();

    for (let i = 0; i < cart.products.length; i++) {
      const cartItem = cart.products[i];
      productIdToQuantityMap.set(cartItem.productId, cartItem.quantity);
    }

    const products = await Product.find({
      uuid: { $in: [...productIdToQuantityMap.keys()] },
    });

    let data = [];

    for (let i = 0; i < products.length; i++) {
      console.log(products[i]);
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

const getCartDetails = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    return res.json(cart);
  } catch (error) {
    console.log(error);
  }
};

const addProductInCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { token, quantity } = req.body;
    const decodedToken = authController.verifyToken(token);
    const email = decodedToken.userId;

    const userDetails = await User.findOne({ email: email });

    if (!userDetails) {
    }

    const product = await Product.findOne({ uuid: productId });

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
      if (cartItem.productId === productId) {
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
};

module.exports = { getProductsInfoFromCart, addProductInCart, getCartDetails};
