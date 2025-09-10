const express = require("express");
const body  = require("express-validator.js");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");
const AppError = require("./utils/errors");
const authorize = require("../middleware/authorize.js");
const generateToken = require("../utils/generateToken.js");
const validate = require("../middleware/validate.js"); 
const router = express.Router();
router.post(
  "/register",
  auth,
  authorize("super_admin"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["super_admin", "brand_admin"])
      .withMessage("Role must be either super_admin or brand_admin"),
    body("brand").custom((value, { req }) => {
      if (req.body.role === "brand_admin" && !value) {
        throw new Error("Brand ID is required for brand_admin");
      }
      return true;
    }),
  ],
  validate, // checks for validation errors
  async (req, res) => {
    try {
      const { name, email, password, role, brand } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
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
  }
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  async (req, res) => {
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
  }
);
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
