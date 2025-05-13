const express = require("express");

const {
  getBrandBySlug,
  getAllBrands,
  getFeaturedBrands,
  getBrandProducts,
  createBrand,
} = require("../controller/brandController");

const router = express.Router();

router.post("/create", createBrand);
router.get("/", getAllBrands);
router.get("/featured", getFeaturedBrands);
router.get("/:slug", getBrandBySlug);
router.get("/:slug/products", getBrandProducts);

module.exports = router;
