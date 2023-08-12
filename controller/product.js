const { productModel } = require("../model/Product");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Features = require("../utils/Features");
const { default: mongoose } = require("mongoose");
const { Types } = mongoose;
//createProduct --- admin
module.exports.createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id;
  const product = await productModel.create(req.body);

  return res.status(201).json({
    success: true,
    product,
  });
});

module.exports.getProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 3;
  const productsCount = await productModel.countDocuments();
  const feature = new Features(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await feature.query;
  return res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
  });
});

module.exports.getProductById = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
    // res.status(500).json({
    //   success: false,
    //   message: "Product not found",
    // });
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

//updateProductById ---admin
module.exports.updateProductById = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useUnified: false,
  });
  return res.status(200).json({
    success: true,
    product,
  });
});

//deleteProductById ---admin
module.exports.deleteProductById = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await productModel.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Product Deleted",
  });
});

// create product review
module.exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);
  const isReview = await product.reviwes.find(
    (revId) => revId.user.toString() === req.user.id.toString()
  );
  if (isReview) {
    product.reviwes.forEach((element) => {
      if (revId.user.toString() === req.user.id.toString()) {
        (element.rating = rating), (element.comment = comment);
      }
    });
  } else {
    product.reviwes.push(review);
    product.numofReviwes = product.reviwes.length;
    let avg = 0;
    product.reviwes.forEach((element) => {
      avg += element.rating;
    });
    product.ratings = avg / product.reviwes.length;

    await product.save({ validateBeforeSave: false });
  }
  return res.status(200).json({
    success: true,
  });
});

//Get all review of a product
module.exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  return res.status(200).json({
    success: true,
    reviews: product.reviwes,
  });
});

//delete review
module.exports.deleteProductReview = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  let reviwes = product.reviwes.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviwes.forEach((element) => {
    avg += element.rating;
  });
  const ratings = avg / reviwes.length;
  const numofReviwes = reviwes.length;

  await productModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviwes,
      ratings,
      numofReviwes,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
  });
});
