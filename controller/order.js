const express = require("express");
const Cart = require("../models/cart");
const User = require("../models/user");
const Order = require("../models/order");
const cartController = require("../controller/cart");
const Product = require("../models/product");

const placeOrder = async (req, res) => {
  try {
    const { address, deliveryCharge, paymentMethod } = req.body;
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
      paymentMethod: paymentMethod,
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

const getOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    let order = await Order.findOne({ _id: orderId });
    order = order.toObject();
    let productMap = new Map();
    for (let i = 0; i < order.products.length; i++) {
      productMap.set(order.products[i].productId, null);
    }
    const productIds = [...productMap.keys()];
    const products = await Product.find({
      productId: { $in: productIds },
    });
    for (let i = 0; i < products.length; i++) {
      const {productId , brand, modelName, price, color, imageUrl} = products[i];
      productMap.set(products[i].productId, {productId , brand, modelName, price, color, imageUrl});
    }

   

    for (let i = 0; i < order.products.length; i++) {
      order.products[i].product = productMap.get(order.products[i].productId);
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while getting product" });
  }
};

module.exports = { placeOrder, getAllOrdersForUser, getOrder };
