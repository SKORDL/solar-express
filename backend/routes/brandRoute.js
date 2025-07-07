const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadBrandFiles } = require("../middlewares/uploadBrandImage");

const {
  getBrandBySlug,
  getAllBrands,
  getFeaturedBrands,
  getBrandProducts,
  createBrand,
  updateBrand,
} = require("../controller/brandController");

const router = express.Router();

router.post(
  "/new/create",
  authMiddleware,
  isAdmin,
  uploadBrandFiles,
  createBrand
);
router.put(
  "/update/:slug",
  authMiddleware,
  isAdmin,
  uploadBrandFiles,
  updateBrand
);
router.get("/", getAllBrands);
router.get("/featured", getFeaturedBrands);
router.get("/:slug/products", getBrandProducts);
router.get("/:slug", getBrandBySlug);

module.exports = router;

// 683ec87a4025d8111fcfc2d9
