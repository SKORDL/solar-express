const express = require("express");
const asyncHandler = require("express-async-handler");

const Product = require("../models/ProductsModel");
const Category = require("../models/CategoryModel"); // Added missing import

// Wrap all controllers with asyncHandler for consistent error handling
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug, // optional, will be auto-generated if not sent
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
      createdBy, // required
    } = req.body;

    // Fixed: Removed backticks that were wrapping the code
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

const getAllProducts = asyncHandler(async (req, res) => {
  // Fixed: Removed try/catch since asyncHandler will handle it
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

// Fetch specific product by Slug
const getProductBySlug = asyncHandler(async (req, res) => {
  // Fixed: Removed try/catch since asyncHandler will handle it
  const { slug } = req.params;
  const product = await Product.findOne({ slug });

  // Fixed: Removed backticks that were wrapping the code
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
});

// Fetch products by category
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // 1. Find category by slug
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  // 2. Find products in this category
  const products = await Product.find({
    category: category._id, // Use the ObjectId of the category to find products
    isActive: true,
  }).select(
    "name slug price originalPrice discountPercentage images specifications isFeatured isBestSeller"
  );

  // 3. Return the result without pagination
  res.status(200).json({
    success: true,
    category: {
      name: category.name,
      slug: category.slug,
      image: category.image,
    },
    products,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
};
