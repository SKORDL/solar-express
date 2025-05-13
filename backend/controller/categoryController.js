const Category = require("../models/CategoryModel");
const Product = require("../models/ProductsModel");
const Brand = require("../models/BrandModel");
const asyncHandler = require("express-async-handler");

// @desc    Create a category
// @route   POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please provide a category name");
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = new Category({
    name,
    description: description || "",
    image: req.body.image || null,
    icon: req.body.icon || null,
    parentCategory: parentCategory || null,
  });

  await category.save(); // triggers pre-save hook

  res.status(201).json(category);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;
  category.image = req.body.image || category.image;
  category.icon = req.body.icon || category.icon;
  category.isActive =
    req.body.isActive !== undefined ? req.body.isActive : category.isActive;
  category.isFeatured =
    req.body.isFeatured !== undefined
      ? req.body.isFeatured
      : category.isFeatured;

  if (req.body.featuredProducts) {
    category.featuredProducts = req.body.featuredProducts;
  }

  if (req.body.popularBrands) {
    category.popularBrands = req.body.popularBrands;
  }

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.remove();
  res.json({ message: "Category removed" });
});

// @desc    Get category by slug
// @route   GET /api/categories/:slug
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true,
  })
    .populate({
      path: "featuredProducts",
      select: "name slug price originalPrice discountPercentage images",
      match: { isActive: true },
    })
    .populate({
      path: "popularBrands",
      select: "name slug logo",
      match: { isActive: true },
    });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(category);
});

// @desc    Get all main categories
// @route   GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    isActive: true,
    level: 1,
  })
    .select("name slug image icon productCount isFeatured")
    .sort({ name: 1 });

  res.json(categories);
});

// @desc    Get featured categories
// @route   GET /api/categories/featured
const getFeaturedCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    isFeatured: true,
    isActive: true,
    level: 1,
  })
    .select("name slug image icon")
    .limit(6)
    .sort({ name: 1 });

  res.json(categories);
});

// @desc    Get category products
// @route   GET /api/categories/:slug/products
const getCategoryProducts = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug, isActive: true });
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const products = await Product.find({
    category: category._id,
    isActive: true,
  })
    .select(
      "name slug price originalPrice discountPercentage images isFeatured isBestSeller"
    )
    .sort({ name: 1 });

  res.json({
    products,
    category: {
      name: category.name,
      slug: category.slug,
      image: category.image,
    },
  });
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getCategories,
  getFeaturedCategories,
  getCategoryProducts,
};
