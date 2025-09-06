const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand.js");
const auth = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");
router.post("/", auth, authorize("super_admin"), async (req, res) => {
  try {
    const { name, description, logoUrl } = req.body;
    const brand = new Brand({ name, description, logoUrl });
    await brand.save();

    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/", auth, authorize("super_admin"), async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/:id", auth, authorize("super_admin"), async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/:id", auth, authorize("super_admin"), async (req, res) => {
  try {
    const { name, description, logoUrl, isActive } = req.body;

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description, logoUrl, isActive },
      { new: true, runValidators: true }
    );
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete("/:id", auth, authorize("super_admin"), async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    brand.isActive = false;
    await brand.save();
    res.json({ message: "Brand deactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
