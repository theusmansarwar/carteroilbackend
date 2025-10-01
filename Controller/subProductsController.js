

const Product = require("../Models/productModel");
const SubProduct = require("../Models/subproductsModel");

// ✅ Add SubProduct and link to Product
const addSubProduct = async (req, res) => {
  try {
    let { title, description, productid,image } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!productid) return res.status(400).json({ message: "Product ID is required" });

    const newSubProduct = new SubProduct({ title, description ,image});
    const savedSubProduct = await newSubProduct.save();

    // Link to product
    const updatedProduct = await Product.findByIdAndUpdate(
      productid,
      { $push: { "subproducts.items": savedSubProduct._id } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found to link SubProduct" });
    }

    res.status(201).json({
      status: 201,
      message: "SubProduct added and linked to product successfully",
      subProduct: savedSubProduct,
      linkedProduct: updatedProduct._id,
    });
  } catch (error) {
    console.error("Error adding SubProduct:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update SubProduct
const updateSubProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description,image } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const updated = await SubProduct.findByIdAndUpdate(
      id,
      { title, description , image},
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "SubProduct not found" });

    res.status(200).json({
      status: 200,
      message: "SubProduct updated successfully",
      subProduct: updated,
    });
  } catch (error) {
    console.error("Error updating SubProduct:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete single SubProduct
const deleteSubProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SubProduct.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "SubProduct not found" });

    res.status(200).json({
      status: 200,
      message: "SubProduct deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete multiple SubProducts
const deleteAllSubProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid request. Provide SubProduct IDs." });
    }

    const result = await SubProduct.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: 200,
      message: "SubProducts deleted successfully",
      deletedCount: result.deletedCount,
      deletedIds: ids,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addSubProduct,
  updateSubProduct,
  deleteSubProduct,
  deleteAllSubProducts,
};
