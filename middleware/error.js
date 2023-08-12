const ErrorHandler = require("../utils/ErrorHandler");
module.exports.error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  if (err.name === "CastError") {
    const message = `Resource Not found with this Id...invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = `${err.message}...invalid`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Dublicat ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `JsonWeb Token invalid signature`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `JsonWeb Token is Expired`;
    err = new ErrorHandler(message, 400);
  }
  return res
    .status(err.statusCode)
    .json({ success: false, message: err.message, name: err.name });
  // return res.status(500).send("Something Went Wrong");
};
