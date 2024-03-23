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

router.get("/allProducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products fetched");
  res.send(products);
});

module.exports = router;

// router.get("/", async (req, res) => {
//   try {
//     const newProduct = new Product({
//       uuid: uuidv4(),
//       brand: req.body.brand,
//       modelName: req.body.modelName,
//       fullName: req.body.fullName,
//       stars: req.body.stars,
//       about: req.body.about,
//       price: req.body.price,
//       color: req.body.color,
//       headPhoneType: req.body.headPhoneType,
//       imageUrl: req.body.imageUrl,
//     });
//     console.log(newProduct);
//     await newProduct.save();
//     console.log("Saved");
//     res.json({
//       success: true,
//       message: "Product saved successfully",
//     });
//   } catch (error) {
//     console.error("Failed to save product", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to save product",
//     });
//   }
// });
