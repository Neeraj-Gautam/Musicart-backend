const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {
    const newProduct = new Product({
      uuid: uuidv4(),
      brand: req.body.brand,
      modelName: req.body.modelName,
      fullName: req.body.fullName,
      stars: req.body.stars,
      about: req.body.about,
      price: req.body.price,
      color: req.body.color,
      headPhoneType: req.body.headPhoneType,
      imageUrl: req.body.imageUrl,
    });
    console.log(newProduct);
    await newProduct.save();
    console.log("Saved");
    res.json({
      success: true,
      message: "Product saved successfully",
    });
  } catch (error) {
    console.error("Failed to save product", error);
    res.status(500).json({
      success: false,
      message: "Failed to save product",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log( req.query)
    const headPhoneType = req.query.headPhoneType || "";
    const color = req.query.color || "";
    const company = req.query.company || "";
    const price = req.query.price || "";

    let filter = {};

    if (headPhoneType) {
      filter.headPhoneType = { $regex: headPhoneType, $options: "i" };
    }

    if (color) {
      filter.color = { $regex: color, $options: "i" };
    }

    if (company) {
      filter.color = { $regex: company, $options: "i" };
    }

    if (price) {
      const minPrice = price.split("-")[0];
      const maxPrice = price.split("-")[1];

      filter.price = { $gte: parseInt(minPrice) };
      filter.price = { $lte: parseInt(maxPrice) };
    }

    let products = await Product.find(filter);
    res.send(products);
  } catch (error) {}
});

module.exports = router;

