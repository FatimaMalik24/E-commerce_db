const AppError = require("../utils/errors.js");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized: No user data", 401, "UNAUTHORIZED"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden: Access denied", 403, "FORBIDDEN"));
    }

    next();
  };
};

module.exports = authorize;
