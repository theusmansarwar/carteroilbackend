const mongoose = require("mongoose");
require("./benifitsModel");
require("./faqsModel");
require("./subproductsModel");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    short_description: { type: String },
    metaDescription: { type: String, maxlength: 160, trim: true },
    slug: { type: String, unique: true },
    bgImage: { type: String },

    faqs: {
      title: { type: String },
      description: { type: String },
      image: { type: String },
      items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faq" }],
      published: { type: Boolean, default: false },
    },

    benefits: {
      description: { type: String },
      image1: { type: String },
      image2: { type: String },
      items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Benefit" }],
      published: { type: Boolean, default: false },
    },

    subproducts: {
      description: { type: String },
      items: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubProduct" }],
      published: { type: Boolean, default: false },
    },
    performance: {
      title: { type: String },
      description: { type: String },
      published: { type: Boolean, default: false },
    },

    innovation: {
      title: { type: String },
      description: { type: String },
      yearsOfExperience: { type: Number },
      items: [{ type: String }],
      image1: { type: String },
      image2: { type: String },
      rating: { type: Number },
      noOfRatings: { type: Number },
      published: { type: Boolean, default: false },
    },

    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
