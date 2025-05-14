// routes/productRoute.js
const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
} = require("../controller/productController");

// Create product route with file upload
router.post("/create", createProduct);

router.get("/", getAllProducts); // GET all products
router.get("/category/:slug", getProductsByCategory);
router.get("/:slug", getProductBySlug); // GET product by ID

module.exports = router;
