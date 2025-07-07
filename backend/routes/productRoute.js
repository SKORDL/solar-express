// routes/productRoute.js
const express = require("express");
const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  uploadImage,
  resizeProductImage,
  uploadProductFiles,
} = require("../middlewares/uploadProductImage");

const {
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  debog,
  getCategoryFilters,
  uploadImages,
} = require("../controller/productController");

// Create product route with file upload
router.post(
  "/create",
  authMiddleware,
  isAdmin,
  uploadProductFiles,
  createProduct
);

router.post(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadProductFiles,
  uploadImages
);

router.get("/", getAllProducts); // GET all products
router.get("/debog", debog);
router.put(
  "/update/:id",
  authMiddleware,
  isAdmin,
  uploadProductFiles,
  updateProduct
); // Update product by ID
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct); // Update product by ID
router.get("/category/:slug", getProductsByCategory);
router.get("/:slug", getProductBySlug); // GET product by ID
router.get("/filters/:slug", getCategoryFilters);

module.exports = router;
