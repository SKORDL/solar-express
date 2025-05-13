const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    // Brand Presentation
    tagline: {
      type: String,
      default: "Distributor",
    },
    description: {
      type: String,
      required: true,
    },

    // Visual Assets
    logo: {
      type: String, // URL to logo image (PNG recommended)
      required: true,
    },
    banner: {
      type: String, // URL to banner image (PNG/GIF)
      required: true,
    },
    thumbnail: {
      type: String, // Optional smaller version for listings
    },

    // Brand Information
    establishedYear: {
      type: Number,
    },
    headquarters: {
      type: String,
    },

    // Products Section
    featuredProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    productCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    allProductCount: {
      type: Number,
      default: 0,
    },

    // Status Flags
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Administration
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);
