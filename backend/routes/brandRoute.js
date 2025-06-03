const express = require("express");

const {
  getBrandBySlug,
  getAllBrands,
  getFeaturedBrands,
  getBrandProducts,
  createBrand,
} = require("../controller/brandController");

const router = express.Router();

router.post("/new/create", createBrand);
router.get("/", getAllBrands);
router.get("/featured", getFeaturedBrands);
router.get("/:slug/products", getBrandProducts);
router.get("/:slug", getBrandBySlug);

module.exports = router;

// 683ec87a4025d8111fcfc2d9
