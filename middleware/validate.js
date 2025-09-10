const { validationResult } = require("express-validator");
const AppError = require("../utils/errors.js");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new AppError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        }))
      )
    );
  }

  next();
};

module.exports = validate;
