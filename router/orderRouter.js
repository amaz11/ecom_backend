const router = require("express").Router();
const {
  newOrder,
  getAnOrder,
  getUserOrder,
  getAllOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/order");
const { verifyuser, authrizeRoles } = require("../middleware/verifyuser");

// User
router.route("new").post(verifyuser, newOrder);
router.route(":id").get(verifyuser, getAnOrder);
router.route("order").get(verifyuser, getUserOrder);

// admin
router.use(verifyuser, authrizeRoles("admin"));
router.route("admin/orders").get(getAllOrder);
router.route("admin/order/:id").put(updateOrderStatus).delete(deleteOrder);
module.exports = router;
