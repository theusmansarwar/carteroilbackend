const Benifits = require("../Models/benifitsModel");
const Product = require("../Models/productModel");


// ✅ Add Benefit and link to Product
const addBenefit = async (req, res) => {
  try {
    let { title, description, productid } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!productid) return res.status(400).json({ message: "Product ID is required" });

    const newBenefit = new Benifits({ title, description });
    const savedBenefit = await newBenefit.save();

    // Link to product
    const updatedProduct = await Product.findByIdAndUpdate(
      productid,
      { $push: { "benefits.items": savedBenefit._id } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found to link Benefit" });
    }

    res.status(201).json({
      status: 201,
      message: "Benefit added and linked to product successfully",
      benefit: savedBenefit,
      linkedProduct: updatedProduct._id,
    });
  } catch (error) {
    console.error("Error adding Benefit:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Benefit
const updateBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const updated = await Benifits.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Benefit not found" });

    res.status(200).json({
      status: 200,
      message: "Benefit updated successfully",
      benefit: updated,
    });
  } catch (error) {
    console.error("Error updating Benefit:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete single Benefit
const deleteBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Benifits.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Benefit not found" });

    res.status(200).json({
      status: 200,
      message: "Benefit deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete multiple Benifits
const deleteAllBenifits = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid request. Provide Benefit IDs." });
    }

    const result = await Benifits.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: 200,
      message: "Benifits deleted successfully",
      deletedCount: result.deletedCount,
      deletedIds: ids,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBenefit,
  updateBenefit,
  deleteBenefit,
  deleteAllBenifits,
};
