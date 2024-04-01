const express = require("express");
const router = express.Router();
const productController = require("../controller/product");


router.get("/all", productController.getAllProducts);
router.get("/:productId", productController.getProduct);

router.post("/", async (req, res) => {
  try {
    const newProduct = new Product({
      productId: uuidv4(),
      brand: req.body.brand,
      modelName: req.body.modelName,
      fullName: req.body.fullName,
      stars: req.body.stars,
      about: req.body.about,
      price: req.body.price,
      color: req.body.color,
      headPhoneType: req.body.headPhoneType,
      imageUrl: req.body.imageUrl,
      sideViewImages: req.body.sideViewImages
    });
    await newProduct.save();
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


module.exports = router;
