const AppError = require("../utils/errors.js");
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user data" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};
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
module.exports = authorize;
