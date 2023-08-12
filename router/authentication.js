const router = require("express").Router();
const {
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
} = require("../controller/auth");
const { verifyuser, authrizeRoles } = require("../middleware/verifyuser");

router.post("/sign-up", signup);
router.post("/sign-in", signin);

router.post("/forgot-password", forgotPassword);
router.put("/password-reset/:token", resetPassword);

router.get("/get-user-details", verifyuser, getUserDetails);
router.put("/password/update", verifyuser, updatePassword);
router.put("/user/update", verifyuser, updateProfile);
router.get("/sign-ckeck", verifyuser, authrizeRoles("admin"), (req, res) => {
  res.send(req.user);
});

router.get("/admin/all-user", verifyuser, authrizeRoles("admin"), getAllUser);
router.get(
  "/admin/single-user/:id",
  verifyuser,
  authrizeRoles("admin"),
  getUser
);

router.put(
  "/admin/user-role-update/:id",
  verifyuser,
  authrizeRoles("admin"),
  updateUserRole
);
router.delete(
  "/admin/user-delete/:id",
  verifyuser,
  authrizeRoles("admin"),
  deleteUserById
);

router.get("/log-out", verifyuser, logout);
module.exports = router;
