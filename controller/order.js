const orderModel = require("../model/orderModel");
const { productModel } = require("../model/Product");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

//updateStock

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
// new order
const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  return res.status(201).json({
    success: true,
    order,
  });
});

//get single order
const getAnOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("Order not Found by this Id", 400));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

//get user all order

const getUserOrder = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find({
    user: req.user._id,
  });

  if (!orders) {
    return next(new ErrorHandler("Order not Found by this Id", 400));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

// all order --admin
const getAllOrder = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  return res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update order status --admin
const updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not Found by this Id", 400));
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You Have already delivered this product", 400)
    );
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    order,
  });
});

//delette Order --admin

const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not Found by this Id", 400));
  }

  await order.remove();
  return res.status(200).json({
    success: true,
  });
});
module.exports = {
  newOrder,
  getAnOrder,
  getUserOrder,
  getAllOrder,
  updateOrderStatus,
  deleteOrder,
};
