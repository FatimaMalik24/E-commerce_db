const express = require("express");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");
const generateToken = require("../utils/generateToken.js");
const router = express.Router();
router.post("/register", auth, authorize("super_admin"), async (req, res) => {
  try {
    const { name, email, password, role, brand } = req.body;
    if (role === "brand_admin" && !brand) {
      return res.status(400).json({ error: "Brand ID is required for brand_admin" });
    }
    const user = new User({ name, email, password, role, brand });
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        brand: user.brand || null,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    const token = generateToken({ id: user._id, role: user.role });
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        brand: user.brand || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
