const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    // Categories and Branding
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      index: true,
    },

    // Pricing and Inventory
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    // Flexible Specifications (as array of groups)
    specifications: [
      {
        groupName: {
          type: String,
          required: true,
        },
        items: [
          {
            name: String,
            value: mongoose.Schema.Types.Mixed, // Can be String, Number, Boolean
            unit: String, // Optional unit of measurement
            icon: String, // Optional icon class
          },
        ],
      },
    ],

    // Document Attachments
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["manual", "datasheet", "warranty", "certificate", "other"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        size: Number, // in KB
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Variants
    variants: [
      {
        label: {
          type: String,
          required: true,
        },
        sku: String,
        stock: {
          type: Number,
          required: true,
          min: 1,
        },
        sold: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          min: 0,
        },
        originalPrice: {
          type: Number,
          min: 0,
        },
        discountPercentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },

        images: [String],
        specifications: [
          // Variant-specific specs
          {
            groupName: String,
            items: [
              {
                name: String,
                value: mongoose.Schema.Types.Mixed,
                unit: String,
              },
            ],
          },
        ],
      },
    ],

    // Content and Media
    description: {
      type: String,
      trim: true,
    },
    keyFeatures: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [String],
    videos: [String],

    // Shipping and Policies
    shippingInfo: {
      freeShipping: Boolean,
      estimatedDelivery: String,
      returnPolicy: String,
      warrantyService: String,
    },

    // Reviews and Ratings
    reviews: {
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
      reviewIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
    },

    // Marketing Flags
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: [String],

    // Relationships
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Middleware
// Add this pre-save hook to update related Brand & Category
productSchema.pre("save", async function (next) {
  // Update slug if name changes
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  // Update discount percentage
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }

  // If this is a new product, update Brand & Category
  if (this.isNew) {
    await Promise.all([
      mongoose.model("Brand").updateProductCount(this.brand),
      mongoose.model("Category").updateProductCount(this.category),
      mongoose.model("Category").updatePopularBrands(this.category),
    ]);
  }

  next();
});

// Update counts when a product is deleted
productSchema.post("remove", async function (doc) {
  await Promise.all([
    mongoose.model("Brand").updateProductCount(doc.brand),
    mongoose.model("Category").updateProductCount(doc.category),
    mongoose.model("Category").updatePopularBrands(doc.category),
  ]);
});

// Indexes
productSchema.index({
  name: "text",
  description: "text",
  keyFeatures: "text",
  tags: "text",
});
productSchema.index({ isFeatured: 1, isBestSeller: 1, isNewArrival: 1 });
productSchema.index({ brand: 1, category: 1, subCategory: 1 });

module.exports = mongoose.model("Product", productSchema);
