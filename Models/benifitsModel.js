const mongoose = require("mongoose");

const BenefitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

const Benefit = mongoose.model("Benefit", BenefitSchema);
module.exports = Benefit;
