const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
// const Joi = require("joi");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      unique: true,
      minlength: [6, "Name should not have less than 6 character "],
      maxlength: [16, "Name should not have more than 16 character"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter valid Email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password should not have less than 6 character"],
      select: false,
    },
    conpassword: { type: String, minlength: 6 },
    avater: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      // enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetpasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.generateJWT = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetpasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const userModel = model("User", userSchema);

module.exports.userModel = userModel;
// module.exports.validateUser = validateUser;
