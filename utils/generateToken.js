const jwt = require("jsonwebtoken");
const JWT_key = process.env.JWT_key;
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_key, { expiresIn: "7d" });
};
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_key);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
module.exports = { generateToken, verifyToken };
