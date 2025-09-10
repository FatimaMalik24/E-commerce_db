const express = require("express");
const { body } = require("express-validator");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");
const { generateToken } = require("../utils/generateToken.js");
const validate = require("../middleware/validate.js"); 

const router = express.Router();

// Register user
router.post(
  "/register",
  auth,
  authorize("super_admin"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["super_admin", "brand_admin"]).withMessage("Role must be super_admin or brand_admin"),
    body("brand").custom((value, { req }) => {
      if (req.body.role === "brand_admin" && !value) {
        throw new Error("Brand ID is required for brand_admin");
      }
      return true;
    }),
  ],
  validate,
  async (req, res, next) => {
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
      next(err); // pass to global error handler
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  async (req, res, next) => {
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
      next(err);
    }
  }
);

module.exports = router;
