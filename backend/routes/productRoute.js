// routes/productRoute.js
const express = require("express");
const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  debog,
} = require("../controller/productController");

// Create product route with file upload
router.post("/create", authMiddleware, isAdmin, createProduct);

router.get("/", getAllProducts); // GET all products
router.get("/debog", debog);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct); // Update product by ID
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct); // Update product by ID
router.get("/category/:slug", getProductsByCategory);
router.get("/:slug", getProductBySlug); // GET product by ID

module.exports = router;

// suntech-ultra-solar-panel-400w "stock": 100, 6824780ce8de32aca502e628
