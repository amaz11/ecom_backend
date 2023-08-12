const { Schema, model } = require("mongoose");
const Joi = require("joi");

const categorySchema = new Schema(
  {
    category: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const validateCategory = (categorys) => {
  const schema = Joi.object({
    category: Joi.string().min(6).max(50).required(),
  });
  return schema.validate(categorys);
};
const categoryModel = model("Category", categorySchema);

module.exports.categoryModel = categoryModel;
module.exports.validateCategory = validateCategory;
