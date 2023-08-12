const { Schema, model } = require("mongoose");
const { ObjectId } = Schema;

const Joi = require("joi");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
      maxlength: [20, "Description can not more than 20 words"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [4000, "Description can not more than 4000 words"],
      required: [true, "Please Add Description of this Product"],
    },
    price: {
      type: Number,
      maxlength: [8, "Description can not more than 8 Number"],
      required: [true, "Please Add Prize for the product"],
    },
    discount: {
      type: String,
      maxlength: [4, "Discount can not be more than 4 number"],
    },
    color: { type: String },
    size: { type: String },
    ratings: {
      type: String,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please Add a category"],
    },
    Stock: {
      type: Number,
      required: [true, "Please Add some stock to your Product"],
      maxlength: [3, "Discount can not be more than 3 number"],
    },
    numofReviwes: {
      type: Number,
      default: 0,
    },
    reviwes: [
      {
        user: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
        time: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const productModel = model("Product", productSchema);

module.exports.productModel = productModel;
// module.exports.validateProduct = (product) => {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(50).required(),
//     description: Joi.string().max(50).required(),
//     price: Joi.number().required(),
//     quantity: Joi.number().required(),
//     category: Joi.string().required(),
//     // photo: Joi.string().required(),
//   });
//   return schema.validate(product);
// };
