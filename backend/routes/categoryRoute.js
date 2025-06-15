const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getCategories,
  getFeaturedCategories,
  getCategoryProducts,
} = require("../controller/categoryController");

// Public routes
router.get("/", getCategories);
router.get("/featured", getFeaturedCategories);
router.get("/:slug/products", getCategoryProducts);
router.get("/:slug", getCategoryBySlug);

// Modification routes
router.post("/new/create", authMiddleware, isAdmin, createCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/del/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
