const router = require("express").Router();
const { createCategory, getCategories } = require("../controller/category");
const admin = require("../middleware/admin");
const verifyuser = require("../middleware/verifyuser");

// router.route("/").post([verifyuser, admin], createCategory).get(getCategories);
module.exports = router;
