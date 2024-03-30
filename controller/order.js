const express = require("express");
const Cart = require("../models/cart");
const User = require("../models/user");
const Order = require("../models/order");
const cartController = require("../controller/cart");
const authController = require("../controller/auth");
const jwt = require("jsonwebtoken");

const placeOrder = async (req, res) => {
  try {
    const { address, deliveryCharge } = req.body;
    const userId = req.userId;

    const userDetails = await User.findOne({ email: userId });
    if (!userDetails) {
      return res.status(409).json({ message: "User does not exists" });
    }

    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(409).json({ message: "Cart is empty" });
    }

    const cartProducts = await cartController.getProductsInfoFromCart(cart);
    let totalItemPrice = 0;
    for (let i = 0; i < cartProducts.length; i++) {
      totalItemPrice +=
        cartProducts[i].product.price * cartProducts[i].quantity;
    }

    const orderData = new Order({
      userId: userDetails.email,
      name: userDetails.name,
      address: address,
      products: cart.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      })),
      totalItemPrice: totalItemPrice,
      deliveryCharge: deliveryCharge,
      createdAt: new Date(),
    });

    const order = await orderData.save();
    const deletecart = await Cart.deleteOne({ userId: userId });
    res.status(201).json({
      message: "Order Placed Successfully",
      email: userDetails.email,
      name: userDetails.name,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while placing order" });
  }
};

const getAllOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.json(orders); 
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error occurred while getting orders" });
  }
};

module.exports = { placeOrder, getAllOrdersForUser };
