const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../models/ProductsModel");
const Category = require("../models/CategoryModel");

// Define category-specific filter configurations
const CATEGORY_FILTERS = {
  "solar-panels": {
    specifications: [
      { key: "wattage", label: "Wattage (W)", type: "range", unit: "W" },
      { key: "efficiency", label: "Efficiency (%)", type: "range", unit: "%" },
      {
        key: "cell_type",
        label: "Cell Type",
        type: "select",
        options: ["Monocrystalline", "Polycrystalline", "Thin Film"],
      },
      { key: "voltage", label: "Voltage (V)", type: "range", unit: "V" },
      { key: "dimensions", label: "Dimensions", type: "text" },
      {
        key: "warranty_years",
        label: "Warranty (Years)",
        type: "range",
        unit: "years",
      },
    ],
    priceRange: { min: 0, max: 100000 },
    sortOptions: ["price_asc", "price_desc", "wattage_desc", "efficiency_desc"],
  },
  batteries: {
    specifications: [
      { key: "capacity", label: "Capacity (Ah)", type: "range", unit: "Ah" },
      { key: "voltage", label: "Voltage (V)", type: "range", unit: "V" },
      {
        key: "battery_type",
        label: "Battery Type",
        type: "select",
        options: ["Lithium-ion", "Lead Acid", "LiFePO4", "Gel"],
      },
      { key: "cycle_life", label: "Cycle Life", type: "range" },
      {
        key: "depth_of_discharge",
        label: "Depth of Discharge (%)",
        type: "range",
        unit: "%",
      },
      {
        key: "warranty_years",
        label: "Warranty (Years)",
        type: "range",
        unit: "years",
      },
    ],
    priceRange: { min: 0, max: 200000 },
    sortOptions: [
      "price_asc",
      "price_desc",
      "capacity_desc",
      "cycle_life_desc",
    ],
  },
  inverters: {
    specifications: [
      {
        key: "power_rating",
        label: "Power Rating (W)",
        type: "range",
        unit: "W",
      },
      { key: "efficiency", label: "Efficiency (%)", type: "range", unit: "%" },
      {
        key: "inverter_type",
        label: "Type",
        type: "select",
        options: ["Grid-tie", "Off-grid", "Hybrid", "Micro"],
      },
      {
        key: "input_voltage",
        label: "Input Voltage (V)",
        type: "range",
        unit: "V",
      },
      {
        key: "output_voltage",
        label: "Output Voltage (V)",
        type: "range",
        unit: "V",
      },
      {
        key: "warranty_years",
        label: "Warranty (Years)",
        type: "range",
        unit: "years",
      },
    ],
    priceRange: { min: 0, max: 150000 },
    sortOptions: [
      "price_asc",
      "price_desc",
      "power_rating_desc",
      "efficiency_desc",
    ],
  },
  "charge-controllers": {
    specifications: [
      {
        key: "current_rating",
        label: "Current Rating (A)",
        type: "range",
        unit: "A",
      },
      {
        key: "voltage_rating",
        label: "Voltage Rating (V)",
        type: "range",
        unit: "V",
      },
      {
        key: "controller_type",
        label: "Type",
        type: "select",
        options: ["PWM", "MPPT"],
      },
      { key: "efficiency", label: "Efficiency (%)", type: "range", unit: "%" },
      {
        key: "warranty_years",
        label: "Warranty (Years)",
        type: "range",
        unit: "years",
      },
    ],
    priceRange: { min: 0, max: 50000 },
    sortOptions: [
      "price_asc",
      "price_desc",
      "current_rating_desc",
      "efficiency_desc",
    ],
  },
};

// Global filters for all products page
const GLOBAL_FILTERS = {
  priceRange: { min: 0, max: 200000 },
  brands: [], // Will be populated dynamically
  categories: [], // Will be populated dynamically
  features: ["isFeatured", "isBestSeller", "isNewArrival"],
  sortOptions: ["price_asc", "price_desc", "rating_desc", "newest"],
};

// Get available filters for a specific category
const getCategoryFilters = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;

  const category = await Category.findOne({
    slug: categorySlug,
    isActive: true,
  });
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const filters = CATEGORY_FILTERS[categorySlug] || {
    specifications: [],
    priceRange: { min: 0, max: 100000 },
    sortOptions: ["price_asc", "price_desc"],
  };

  // Get available brands for this category
  const availableBrands = await Product.aggregate([
    { $match: { category: category._id, isActive: true } },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brandInfo",
      },
    },
    { $unwind: "$brandInfo" },
    {
      $group: {
        _id: "$brandInfo._id",
        name: { $first: "$brandInfo.name" },
        slug: { $first: "$brandInfo.slug" },
      },
    },
    { $sort: { name: 1 } },
  ]);

  // Get actual price range from products
  const priceStats = await Product.aggregate([
    { $match: { category: category._id, isActive: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  res.json({
    success: true,
    filters: {
      ...filters,
      brands: availableBrands,
      priceRange:
        priceStats.length > 0
          ? {
              min: priceStats[0].minPrice,
              max: priceStats[0].maxPrice,
            }
          : filters.priceRange,
    },
  });
});

// Get global filters for all products page
const getGlobalFilters = asyncHandler(async (req, res) => {
  // Get all active categories
  const categories = await Category.find({ isActive: true }).select(
    "name slug"
  );

  // Get all brands that have products
  const brands = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brandInfo",
      },
    },
    { $unwind: "$brandInfo" },
    {
      $group: {
        _id: "$brandInfo._id",
        name: { $first: "$brandInfo.name" },
        slug: { $first: "$brandInfo.slug" },
      },
    },
    { $sort: { name: 1 } },
  ]);

  // Get global price range
  const priceStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  res.json({
    success: true,
    filters: {
      ...GLOBAL_FILTERS,
      categories,
      brands,
      priceRange:
        priceStats.length > 0
          ? {
              min: priceStats[0].minPrice,
              max: priceStats[0].maxPrice,
            }
          : GLOBAL_FILTERS.priceRange,
    },
  });
});

// Enhanced getAllProducts with advanced filtering
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    isFeatured,
    isBestSeller,
    isNewArrival,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 12,
    search,
    ...specFilters // All remaining query params are treated as specification filters
  } = req.query;

  // Build base query
  let query = { isActive: true };

  // Category filter
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) query.category = categoryDoc._id;
  }

  // Brand filter
  if (brand) {
    query.brand = brand;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Marketing flags
  if (isFeatured === "true") query.isFeatured = true;
  if (isBestSeller === "true") query.isBestSeller = true;
  if (isNewArrival === "true") query.isNewArrival = true;

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  // Specification filters
  const specFilterConditions = [];
  Object.entries(specFilters).forEach(([key, value]) => {
    if (value && value !== "") {
      // Handle range filters (e.g., wattage_min, wattage_max)
      if (key.endsWith("_min")) {
        const specName = key.replace("_min", "");
        specFilterConditions.push({
          "specifications.items": {
            $elemMatch: {
              name: specName,
              value: { $gte: Number(value) },
            },
          },
        });
      } else if (key.endsWith("_max")) {
        const specName = key.replace("_max", "");
        specFilterConditions.push({
          "specifications.items": {
            $elemMatch: {
              name: specName,
              value: { $lte: Number(value) },
            },
          },
        });
      } else {
        // Handle exact match filters
        specFilterConditions.push({
          "specifications.items": {
            $elemMatch: {
              name: key,
              value: Array.isArray(value) ? { $in: value } : value,
            },
          },
        });
      }
    }
  });

  if (specFilterConditions.length > 0) {
    query.$and = specFilterConditions;
  }

  // Build sort object
  let sortObj = {};
  switch (sort) {
    case "price_asc":
      sortObj.price = 1;
      break;
    case "price_desc":
      sortObj.price = -1;
      break;
    case "rating_desc":
      sortObj["reviews.rating"] = -1;
      break;
    case "newest":
      sortObj.createdAt = -1;
      break;
    default:
      sortObj[sort] = order === "asc" ? 1 : -1;
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .select(
        "name slug price originalPrice discountPercentage images specifications isFeatured isBestSeller reviews"
      )
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      current: Number(page),
      pages: Math.ceil(total / limit),
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Enhanced getProductsByCategory with category-specific filtering
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const {
    minPrice,
    maxPrice,
    brand,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 12,
    ...specFilters
  } = req.query;

  // Find category
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  // Build query
  let query = { category: category._id, isActive: true };

  // Apply filters similar to getAllProducts
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (brand) query.brand = brand;

  // Apply specification filters
  const specFilterConditions = [];
  Object.entries(specFilters).forEach(([key, value]) => {
    if (value && value !== "") {
      if (key.endsWith("_min")) {
        const specName = key.replace("_min", "");
        specFilterConditions.push({
          "specifications.items": {
            $elemMatch: {
              name: specName,
              value: { $gte: Number(value) },
            },
          },
        });
      } else if (key.endsWith("_max")) {
        const specName = key.replace("_max", "");
        specFilterConditions.push({
          "specifications.items": {
            $elemMatch: {
              name: specName,
              value: { $lte: Number(value) },
            },
          },
        });
      } else {
        specFilterConditions.push({
          "specifications.items": {
            $elemMatch: {
              name: key,
              value: Array.isArray(value) ? { $in: value } : value,
            },
          },
        });
      }
    }
  });

  if (specFilterConditions.length > 0) {
    query.$and = specFilterConditions;
  }

  // Sort
  let sortObj = {};
  switch (sort) {
    case "price_asc":
      sortObj.price = 1;
      break;
    case "price_desc":
      sortObj.price = -1;
      break;
    case "wattage_desc":
      sortObj = { "specifications.items.value": -1 }; // This would need more specific handling
      break;
    case "efficiency_desc":
      sortObj = { "specifications.items.value": -1 }; // This would need more specific handling
      break;
    default:
      sortObj[sort] = order === "asc" ? 1 : -1;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("brand", "name slug")
      .select(
        "name slug price originalPrice discountPercentage images specifications isFeatured isBestSeller reviews"
      )
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    category: {
      name: category.name,
      slug: category.slug,
      image: category.image,
    },
    products,
    pagination: {
      current: Number(page),
      pages: Math.ceil(total / limit),
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Existing controllers
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

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getCategoryFilters,
  getGlobalFilters,
};
