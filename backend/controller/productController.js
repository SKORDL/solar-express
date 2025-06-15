const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../models/ProductsModel");
const Category = require("../models/CategoryModel");
const categoryFilters = require("../utils/categoryFilters");

// Helper to get sort object from query
function getSortObject(sort) {
  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "popularity":
      return { viewCount: -1 }; // or use reviews.count if you prefer
    case "top_selling":
      return { "variants.sold": -1 }; // assumes you track sold in variants
    case "newest":
      return { createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
}

// Get all products with sorting
const getAllProducts = asyncHandler(async (req, res) => {
  const sort = req.query.sort || "newest";
  const sortObj = getSortObject(sort);

  let query = {};

  // Universal filters
  if (req.query.brand) query.brand = req.query.brand;
  if (req.query.isFeatured) query.isFeatured = req.query.isFeatured === "true";
  if (req.query.isBestSeller) query.isBestSeller = req.query.isBestSeller === "true";
  if (req.query.price_min || req.query.price_max) {
    query.price = {};
    if (req.query.price_min) query.price.$gte = Number(req.query.price_min);
    if (req.query.price_max) query.price.$lte = Number(req.query.price_max);
  }
  if (req.query.rating_min || req.query.rating_max) {
    query["reviews.rating"] = {};
    if (req.query.rating_min) query["reviews.rating"].$gte = Number(req.query.rating_min);
    if (req.query.rating_max) query["reviews.rating"].$lte = Number(req.query.rating_max);
  }

  // Dynamic specification filters
  Object.entries(req.query).forEach(([key, value]) => {
    if (
      ![
        "brand",
        "isFeatured",
        "isBestSeller",
        "price_min",
        "price_max",
        "rating_min",
        "rating_max",
        "sort",
        "category"
      ].includes(key)
    ) {
      // For range: field_min/field_max, for select: field=value
      if (key.endsWith("_min")) {
        const field = key.replace("_min", "");
        query["specifications.items"] = { $elemMatch: { name: field, value: { $gte: Number(value) } } };
      } else if (key.endsWith("_max")) {
        const field = key.replace("_max", "");
        query["specifications.items"] = { $elemMatch: { name: field, value: { $lte: Number(value) } } };
      } else {
        query["specifications.items"] = { $elemMatch: { name: key, value: value } };
      }
    }
  });

  // Category filter (optional)
  if (req.query.category) query.category = req.query.category;

  const products = await Product.find(query)
    .populate("brand", "name slug")
    .populate("category", "name slug")
    .select(
      "name slug price originalPrice discountPercentage images specifications isFeatured isBestSeller reviews viewCount variants"
    )
    .sort(sortObj);

  res.json({
    success: true,
    products,
  });
});

// Get products by category with sorting
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const sort = req.query.sort || "newest";
  const sortObj = getSortObject(sort);

  // Find category
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  let query = { category: category._id };

  // Universal filters
  if (req.query.brand) query.brand = req.query.brand;
  if (req.query.isFeatured) query.isFeatured = req.query.isFeatured === "true";
  if (req.query.isBestSeller) query.isBestSeller = req.query.isBestSeller === "true";
  if (req.query.price_min || req.query.price_max) {
    query.price = {};
    if (req.query.price_min) query.price.$gte = Number(req.query.price_min);
    if (req.query.price_max) query.price.$lte = Number(req.query.price_max);
  }
  if (req.query.rating_min || req.query.rating_max) {
    query["reviews.rating"] = {};
    if (req.query.rating_min) query["reviews.rating"].$gte = Number(req.query.rating_min);
    if (req.query.rating_max) query["reviews.rating"].$lte = Number(req.query.rating_max);
  }

  // Dynamic specification filters
  Object.entries(req.query).forEach(([key, value]) => {
    if (
      ![
        "brand",
        "isFeatured",
        "isBestSeller",
        "price_min",
        "price_max",
        "rating_min",
        "rating_max",
        "sort"
      ].includes(key)
    ) {
      if (key.endsWith("_min")) {
        const field = key.replace("_min", "");
        query["specifications.items"] = { $elemMatch: { name: field, value: { $gte: Number(value) } } };
      } else if (key.endsWith("_max")) {
        const field = key.replace("_max", "");
        query["specifications.items"] = { $elemMatch: { name: field, value: { $lte: Number(value) } } };
      } else {
        query["specifications.items"] = { $elemMatch: { name: key, value: value } };
      }
    }
  });

  const products = await Product.find(query)
    .populate("brand", "name slug")
    .select(
      "name slug price originalPrice discountPercentage images specifications isFeatured isBestSeller reviews viewCount variants"
    )
    .sort(sortObj);

  res.json({
    success: true,
    category: {
      name: category.name,
      slug: category.slug,
      image: category.image,
    },
    products,
  });
});

// Create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug,
      brand,
      category,
      subCategory,
      price,
      originalPrice,
      stock,
      description,
      keyFeatures,
      specifications,
      variants,
      documents,
      images,
      videos,
      tags,
      shippingInfo,
      createdBy,
    } = req.body;

    const newProduct = new Product({
      name,
      slug,
      brand,
      category,
      subCategory,
      price,
      originalPrice,
      stock,
      description,
      keyFeatures,
      specifications,
      variants,
      documents,
      images,
      videos,
      tags,
      shippingInfo,
      createdBy,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error("Product Creation Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Product creation failed" });
  }
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, product: updatedProduct });
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

// Get product by slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug })
    .populate("brand", "name slug")
    .populate("category", "name slug")
    .populate("subCategory", "name slug");

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
});

// Get available filters for a specific category
const getCategoryFilters = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const filters = categoryFilters[slug] || categoryFilters["default"];
  res.json({ success: true, filters });
});

// Debug endpoint
const debog = asyncHandler(async (req, res) => {
  try {
    const allProducts = await Product.find({}).limit(10);
    res.json({
      rawProducts: allProducts,
      count: allProducts.length,
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getCategoryFilters,
  debog,
};
