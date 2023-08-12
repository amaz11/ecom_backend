//package
const bcrypt = require("bcryptjs");
// node build in
const crypto = require("crypto");

const { userModel } = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendEmail = require("../utils/sendEmail");
// hassPasswor
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//token funtion

const sendToken = (user, statusCode, res) => {
  const token = user.generateJWT();
  const options = {
    httpOnly: true,
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
  user.password = undefined;
  return res.status(statusCode).cookie("jwt", token, options).json({
    success: true,
    message: "Success",
    user,
  });
};
//signup
const signup = catchAsyncError(async (req, res, next) => {
  const { name, email, password, conpassword } = req.body;
  if ((!name, !email || !password, !conpassword)) {
    return next(new ErrorHandler("Fill The Form", 400));
  }
  if (password === conpassword) {
    const user = await new userModel({
      name,
      email,
      password,
      avater: {
        public_id: "this is sample id",
        url: "sample url",
      },
    });
    user.password = await hashPassword(user.password);
    await user.save();
    sendToken(user, 201, res);
  } else {
    return next(new ErrorHandler("Password Not Match", 400));
  }
});

//signin
const signin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Fill The Form", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (user) {
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      sendToken(user, 201, res);
    } else {
      return next(new ErrorHandler("Invalid Info or Need Registretion", 400));
    }
  } else {
    return next(new ErrorHandler("Invalid Info or Need Registretion", 400));
  }
});

//Logout
const logout = catchAsyncError(async (req, res, next) => {
  return res
    .status(200)
    .clearCookie("jwt", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged oUt",
    });
});

// Forgot Password
const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Fouund", 400));
  }
  const reseteToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password-reset/${reseteToken}`;

  const message = `Your Reset url: \n\n ${resetPasswordUrl} \n\n If not then ignor it `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce password Recovery",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    return next(new ErrorHandler(error.massage, 500));
  }
});

//reset Password
const resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Something wrong Try again", 400));
  }

  if (req.body.password !== req.body.conpassword) {
    return next(new ErrorHandler("Password not match", 400));
  }
  user.password = req.body.password;
  user.password = await hashPassword(user.password);
  user.resetPasswordToken = undefined;
  user.resetpasswordExpire = undefined;
  user.save();
  sendToken(user, 201, res);
});

//User details
const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  return res.status(200).json({
    success: true,
    user,
  });
});

//Update Password
const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select("+password");
  const passwordCheck = await bcrypt.compare(
    req.body.oldpassword,
    user.password
  );
  if (!passwordCheck) {
    return next(new ErrorHandler("old Password incorrect", 400));
  }

  if (req.body.newpassword !== req.body.conpassword) {
    return next(new ErrorHandler("Password not match", 400));
  }

  user.password = req.body.newpassword;
  user.password = await hashPassword(user.password);
  await user.save();
  sendToken(user, 201, res);
});

//Update Profile
const updateProfile = catchAsyncError(async (req, res, next) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };
  await userModel.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
  });
});

// get all user --admin

const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await userModel.find();
  return res.status(200).json({
    success: true,
    users,
  });
});

const getUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 400));
  }
  return res.status(200).json({
    success: true,
    user,
  });
});

//Update User Role
const updateUserRole = catchAsyncError(async (req, res, next) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  await userModel.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
  });
});

const deleteUserById = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("Product not found", 404));
  }
  user = await userModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
    message: "User Deleted",
  });
});

module.exports = {
  signup,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getUser,
  updateUserRole,
  deleteUserById,
};
