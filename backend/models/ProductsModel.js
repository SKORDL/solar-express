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
          min: 0,
        },
        price: {
          type: Number,
          min: 0,
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
  }
);

// Middleware
productSchema.pre("save", function (next) {
  // Slug generation
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      replacement: "-",
      trim: true,
    });
  }

  // Update timestamp
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }

  // Calculate discount percentage if not set
  if (this.isModified("price") || this.isModified("originalPrice")) {
    if (this.originalPrice && this.originalPrice > this.price) {
      this.discountPercentage = Math.round(
        ((this.originalPrice - this.price) / this.originalPrice) * 100
      );
    }
  }

  next();
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
