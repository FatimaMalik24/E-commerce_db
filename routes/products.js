const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
const auth = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");
router.post("/", auth, authorize("brand_admin"), async (req, res) => {
  try {
    const { name, description, price, discount, sku, deliveryTime, images, category } = req.body;
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc || String(categoryDoc.brand) !== String(req.user.brand)) {
      return res.status(400).json({ message: "Invalid category for this brand" });
    }
    const product = new Product({
      name,
      description,
      price,
      discount,
      sku,
      deliveryTime,
      images,
      brand: req.user.brand,
      category,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/my-products", auth, authorize("brand_admin"), async (req, res) => {
  try {
    const products = await Product.find({ brand: req.user.brand })
      .populate("brand", "name")
      .populate("category", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/:id", auth, authorize("brand_admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || String(product.brand) !== String(req.user.brand)) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }
    if (req.body.category) {
      const categoryDoc = await Category.findById(req.body.category);
      if (!categoryDoc || String(categoryDoc.brand) !== String(req.user.brand)) {
        return res.status(400).json({ message: "Invalid category for this brand" });
      }
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete("/:id", auth, authorize("brand_admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || String(product.brand) !== String(req.user.brand)) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }
    product.isActive = false;
    await product.save();
    res.json({ message: "Product deactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
