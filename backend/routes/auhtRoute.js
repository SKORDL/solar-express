const express = require("express");
const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  logoutUser,
  handleRefreshToken,
  getCurrentUser,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("../controller/userController");

router.post("/register", createUser);

router.get("/me", authMiddleware, getCurrentUser);

router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

router.get("/refresh-token", handleRefreshToken);

router.get("/cart", authMiddleware, getCart);
router.post("/cart/add", authMiddleware, addToCart);
router.put("/cart/update", authMiddleware, updateCartItem);
router.delete("/cart/remove", authMiddleware, removeFromCart);

router.get("/all", authMiddleware, isAdmin, getAllUsers);

router.get("/:id", authMiddleware, isAdmin, getSingleUser);

router.delete("/:id", authMiddleware, isAdmin, deleteUser);

router.put("/:id", authMiddleware, isAdmin, updateUser);

router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
