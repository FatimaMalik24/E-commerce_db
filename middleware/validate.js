const AppError = require("./utils/errors.js");
const validationResult = require("express-validator");
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
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
module.exports = validate;
