const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/database.js");
dotenv.config();
connectDB();
const app = express();
app.use(morgan("dev")); 
app.use(cors());   
app.use(express.json()); 

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
