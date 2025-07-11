const Brand = require("../models/BrandModel");
const asyncHandler = require("express-async-handler");
const Product = require("../models/ProductsModel");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

const createBrand = asyncHandler(async (req, res) => {
  try {
    // Upload logo
    let logoUrl = req.body.logo;
    if (req.files && req.files.logo && req.files.logo[0]) {
      const uploadRes = await cloudinaryUploadImage(
        `data:${
          req.files.logo[0].mimetype
        };base64,${req.files.logo[0].buffer.toString("base64")}`,
        "image"
      );
      logoUrl = uploadRes.url;
    }

    // Upload banner
    let bannerUrl = req.body.banner;
    if (req.files && req.files.banner && req.files.banner[0]) {
      const uploadRes = await cloudinaryUploadImage(
        `data:${
          req.files.banner[0].mimetype
        };base64,${req.files.banner[0].buffer.toString("base64")}`,
        "image"
      );
      bannerUrl = uploadRes.url;
    }

    // Upload thumbnail (optional)
    let thumbnailUrl = req.body.thumbnail;
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const uploadRes = await cloudinaryUploadImage(
        `data:${
          req.files.thumbnail[0].mimetype
        };base64,${req.files.thumbnail[0].buffer.toString("base64")}`,
        "image"
      );
      thumbnailUrl = uploadRes.url;
    }

    const {
      name,
      slug,
      tagline,
      description,
      establishedYear,
      headquarters,
      featuredProducts,
      productCategories,
      isFeatured,
      isActive,
      createdBy,
    } = req.body;

    const brandExists = await Brand.findOne({ slug });
    if (brandExists) {
      res.status(400);
      throw new Error("Brand with this slug already exists");
    }

    const brand = await Brand.create({
      name,
      slug,
      tagline,
      description,
      logo: logoUrl,
      banner: bannerUrl,
      thumbnail: thumbnailUrl,
      establishedYear,
      headquarters,
      featuredProducts,
      productCategories,
      isFeatured,
      isActive,
      createdBy,
    });

    res.status(201).json(brand);
  } catch (err) {
    console.error("Brand Creation Error:", err);
    res.status(500).json({ success: false, message: "Brand creation failed" });
  }
});

// @desc    Get brand by slug
// @route   GET /api/brands/:slug
// @access  Public
const getBrandBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const brand = await Brand.findOne({ slug })
    .populate({
      path: "featuredProducts",
      select:
        "name slug price originalPrice discountPercentage images specifications",
      match: { isActive: true }, // Only include active products
    })
    .populate({
      path: "productCategories",
      select: "name slug",
    });

  if (!brand || !brand.isActive) {
    res.status(404);
    throw new Error("Brand not found");
  }

  // Get all products count for this brand
  const productCount = await Product.countDocuments({
    brand: brand._id,
    ...(typeof Product.schema.paths.isActive !== "undefined"
      ? { isActive: true }
      : {}),
  });

  // Update the product count if different
  if (brand.allProductCount !== productCount) {
    brand.allProductCount = productCount;
    await brand.save();
  }

  // Get best sellers from this brand (optional)
  const bestSellers = await Product.find({
    brand: brand._id,
    isBestSeller: true,
    ...(typeof Product.schema.paths.isActive !== "undefined"
      ? { isActive: true }
      : {}),
  })
    .select("name slug price images")
    .limit(4);

  res.json({
    ...brand.toObject(),
    bestSellers,
    banner: brand.banner || getDefaultBanner(brand.name),
  });
});

// @desc    Get all active brands
// @route   GET /api/brands
// @access  Public
const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true })
    .select("name slug logo thumbnail allProductCount")
    .sort({ name: 1 });

  res.json(brands);
});

// @desc    Get featured brands
// @route   GET /api/brands/featured
// @access  Public
const getFeaturedBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({
    isFeatured: true,
    isActive: true,
  })
    .select("name slug logo thumbnail")
    .limit(8)
    .sort({ name: 1 });

  res.json(brands);
});

// @route   GET /api/brands/:slug/products
// @access  Public
const getBrandProducts = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  console.log("Fetching brand products for slug:", slug);

  // 1. Find brand by slug
  const brand = await Brand.findOne({ slug, isActive: true });
  if (!brand) {
    console.error("Brand not found for slug:", slug);
    return res.status(404).json({ success: false, message: "Brand not found" });
  }

  console.log("Brand found:", brand);

  // 2. Build query with a check for isActive field existence
  const query = {
    brand: brand._id,
    ...(typeof Product.schema.paths.isActive !== "undefined"
      ? { isActive: true }
      : {}),
  };

  console.log("Query for products:", query);

  // 3. Fetch all products without pagination
  const products = await Product.find(query)
    .select("name slug price originalPrice discountPercentage images")
    .sort("-createdAt");

  console.log("Products fetched:", products);

  // 4. Return response
  res.status(200).json({
    success: true,
    products,
    brand: {
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
    },
    total: products.length,
  });
});

// @desc    Update an existing brand
// @route   PUT /api/brands/:slug
// @access  Public
const updateBrand = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    // Find the brand by slug
    const brand = await Brand.findOne({ slug });
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    // Upload new logo if provided
    if (req.files && req.files.logo && req.files.logo[0]) {
      const uploadRes = await cloudinaryUploadImage(
        `data:${
          req.files.logo[0].mimetype
        };base64,${req.files.logo[0].buffer.toString("base64")}`,
        "image"
      );
      brand.logo = uploadRes.url;
    }

    // Upload new banner if provided
    if (req.files && req.files.banner && req.files.banner[0]) {
      const uploadRes = await cloudinaryUploadImage(
        `data:${
          req.files.banner[0].mimetype
        };base64,${req.files.banner[0].buffer.toString("base64")}`,
        "image"
      );
      brand.banner = uploadRes.url;
    }

    // Upload new thumbnail if provided
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const uploadRes = await cloudinaryUploadImage(
        `data:${
          req.files.thumbnail[0].mimetype
        };base64,${req.files.thumbnail[0].buffer.toString("base64")}`,
        "image"
      );
      brand.thumbnail = uploadRes.url;
    }

    // Update other fields if provided in req.body
    const updatableFields = [
      "name",
      "tagline",
      "description",
      "establishedYear",
      "headquarters",
      "featuredProducts",
      "productCategories",
      "isFeatured",
      "isActive",
      "createdBy",
    ];
    updatableFields.forEach((field) => {
      if (typeof req.body[field] !== "undefined") {
        brand[field] = req.body[field];
      }
    });

    // If slug is being updated, check for uniqueness
    if (req.body.slug && req.body.slug !== brand.slug) {
      const slugExists = await Brand.findOne({ slug: req.body.slug });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Brand with this slug already exists",
        });
      }
      brand.slug = req.body.slug;
    }

    await brand.save();

    res.status(200).json({ success: true, brand });
  } catch (err) {
    console.error("Brand Update Error:", err);
    res.status(500).json({ success: false, message: "Brand update failed" });
  }
});

// Helper function for default banner
const getDefaultBanner = (brandName) => {
  // Implement your default banner logic or use a placeholder
  return `/images/default-banners/${brandName
    .toLowerCase()
    .replace(/\s+/g, "-")}.jpg`;
};

module.exports = {
  getBrandBySlug,
  getAllBrands,
  getFeaturedBrands,
  getBrandProducts,
  createBrand,
  updateBrand,
};
