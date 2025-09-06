const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/database.js");
const brandRoutes = require("./routes/brands.js");
const categoryRoutes = require("./routes/categories.js");
const productRoutes = require("./routes/products.js");
dotenv.config();
connectDB();
const app = express();
app.use(morgan("dev")); 
app.use(cors());   
app.use(express.json()); 
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
