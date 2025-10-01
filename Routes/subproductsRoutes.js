const express = require("express");
const router = express.Router();

const {
   addSubProduct,
  updateSubProduct,
  deleteSubProduct,
  deleteAllSubProducts,
} = require("../Controller/subProductsController");

const authMiddleware = require("../Middleware/authMiddleware");
router.post("/add", addSubProduct);
router.put("/update/:id",  updateSubProduct);
router.delete("delete/:id",  deleteSubProduct);
router.delete("/deleteMultiple",  deleteAllSubProducts);



module.exports = router;
