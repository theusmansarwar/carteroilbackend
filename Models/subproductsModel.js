const mongoose = require("mongoose");

const SubProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const SubProduct = mongoose.model("SubProduct", SubProductSchema);
module.exports = SubProduct;
