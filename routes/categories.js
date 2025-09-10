const express = require("express");
const router = express.Router();
const Category = require("../models/Category.js");
const auth = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");

// Create Category
router.post("/", auth, authorize("brand_admin"), async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({
      name,
      brand: req.user.brand,
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Categories (super_admin can see all, brand_admin only their brand)
router.get("/", auth, authorize("brand_admin", "super_admin"), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "brand_admin") {
      query.brand = req.user.brand;
    }
    const categories = await Category.find(query).populate("brand", "name");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
