const express = require("express");
const router = express.Router();

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
router.get("/:slug", getCategoryBySlug);
router.get("/:slug/products", getCategoryProducts);

// Modification routes
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/del/:id", deleteCategory);

module.exports = router;
