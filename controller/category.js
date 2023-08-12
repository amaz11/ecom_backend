const { categoryModel, validateCategory } = require("../model/category");

module.exports.createCategory = async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const existCategory = await categoryModel.findOne(req.body);
  if (existCategory) {
    return res.status(400).json({
      error: "Category Already Exist",
    });
  }
  const categorys = new categoryModel(req.body);
  await categorys.save();
  return res.status(201).json(categorys);
};

module.exports.getCategories = async (req, res) => {
  const categories = await categoryModel.find().sort({ category: 1 });
  return res.status(200).json(categories);
};
