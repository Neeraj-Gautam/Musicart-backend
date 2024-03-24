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
    console.log(req.query);
    const headPhoneType = req.query.headPhoneType || "";
    const company = req.query.company || "";
    const color = req.query.color || "";
    const price = req.query.price || "";
    const sortBy = req.query.sortBy || "";
    const sortType = req.query.sortType || "";
    const search = req.query.search || "";

    let filter = {};

    if (headPhoneType) {
      filter.headPhoneType = { $regex: headPhoneType, $options: "i" };
    }

    if (company) {
      filter.brand = { $regex: company, $options: "i" };
    }

    if (color) {
      filter.color = { $regex: color, $options: "i" };
    }

    if (search) {
      filter.search = { $regex: color, $options: "i" };
    }

    if (price) {
      const minPrice = price.split("-")[0];
      const maxPrice = price.split("-")[1];
      console.log(minPrice, maxPrice);
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }
    console.log(sortBy, sortType);
    let products = await Product.find(filter);
    if (sortBy && sortType) {
      switch (sortBy) {
        case "price":
          {
            if (sortType === "asc") {
              products.sort((a, b) => {
                return a[sortBy] - b[sortBy];
              });
            } else if (sortType === "desc") {
              products.sort((a, b) => {
                return b[sortBy] - a[sortBy];
              });
            }
          }

          break;

        case "name":
          {
            if (sortType === "asc") {
              products.sort((a, b) => {
                const name1 = (a.brand + a.modelName).toLowerCase();
                const name2 = (b.brand + b.modelName).toLowerCase();
                if (name1 < name2) return -1;
                if (name1 > name2) return 1;
                return 0;
              });
            } else if (sortType === "desc") {
              products.sort((a, b) => {
                const name1 = (a.brand + a.modelName).toLowerCase();
                const name2 = (b.brand + b.modelName).toLowerCase();
                if (name1 < name2) return 1;
                if (name1 > name2) return -1;
                return 0;
              });
            }
          }

          break;
      }
    }

    console.log(products);
    res.send(products);
  } catch (error) {}
});

module.exports = router;
