const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/database.js");
const authRoutes = require("./routes/auth.js");
const brandRoutes = require("./routes/brands.js");
const categoryRoutes = require("./routes/categories.js");
const productRoutes = require("./routes/products.js");
const AppError = require("./utils/errors.js");
connectDB();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, "NOT_FOUND"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
