const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  createProductReview,
  deleteProductReview,
  getProductReviews,
} = require("../controller/product");
const { verifyuser, authrizeRoles } = require("../middleware/verifyuser");

// router.route("/").post([verifyuser, admin], createProduct).get(getProducts);
// router
//   .route("/id")
//   .post([verifyuser, admin], updateProductById)
//   .delete([verifyuser, admin], deleteProductById)
//   .get(getProductById);

// For All
router.route("/products").get(getProducts);

// User
router.route("/review").put(verifyuser, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(verifyuser, deleteProductReview);

//product/new --- admin
router
  .route("/admin/new")
  .post(verifyuser, authrizeRoles("admin"), createProduct);
router
  .route("admin/product/:id")
  .post(verifyuser, authrizeRoles("admin"), updateProductById)
  .delete(verifyuser, authrizeRoles("admin"), deleteProductById);
router.route("/:id").get(getProductById);
module.exports = router;
