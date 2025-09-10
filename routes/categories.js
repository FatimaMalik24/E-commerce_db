const express = require("express");
const router = express.Router();
const Category = require("../models/Category.js");
const auth = require("../middleware/auth.js");
const AppError = require("./utils/errors");
const authorize = require("../middleware/authorize.js");
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
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, "NOT_FOUND"));
});
app.use((err, req, res, next) => {
  console.error("Error:", err.message); 

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
  });
});

module.exports = router;
