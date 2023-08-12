const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");

const { userModel } = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");

exports.verifyuser = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new ErrorHandler("Not athurize", 401));
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decode.id);
  next();
});

exports.authrizeRoles = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new ErrorHandler("Forbbiden For You", 403));
    }
    next();
  };
};
