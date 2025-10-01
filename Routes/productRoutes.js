const express = require("express");
const router = express.Router();



const authMiddleware = require("../Middleware/authMiddleware");
const {  createProduct,
  updateProduct,
  listProductsAdmin,
  listProducts,
  getProductById,
  getProductBySlug,
  deleteAllProducts,
  getProductsSlugs,} = require("../Controller/productsController");

// ✅ Product routes
router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.get("/get/:id", getProductById);
router.get("/list", listProducts);
router.get("/listbyadmin", listProductsAdmin);
router.delete("/delete-many", deleteAllProducts);
router.get('/view/:slug', getProductBySlug);
router.get('/slugs', getProductsSlugs);


module.exports = router;
