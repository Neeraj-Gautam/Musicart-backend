const express = require("express");
const Product = require("../models/product");

const getProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId: productId });
    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while getting product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
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
      filter.$or = [
        { modelName: { $regex: search, $options: "i" } }, 
        { brand: { $regex: search, $options: "i" } } 
      ];
    }

    if (price) {
      const minPrice = price.split("-")[0];
      const maxPrice = price.split("-")[1];
      console.log(minPrice, maxPrice);
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }
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

    res.json(products);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while getting all products" });
  }
};

module.exports = { getAllProducts, getProduct };
