const { verifyToken } = require("../utils/generateToken");
const User = require("../models/User.js");
const AppError = require("../utils/errors.js"); // ✅ corrected path

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new AppError("No token provided", 401, "NO_TOKEN"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new AppError("User not found", 401, "USER_NOT_FOUND"));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new AppError("Unauthorized: " + err.message, 401, "UNAUTHORIZED"));
  }
};

module.exports = auth;
