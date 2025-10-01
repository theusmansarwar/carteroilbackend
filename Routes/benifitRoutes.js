const express = require("express");
const router = express.Router();

const {
 addBenefit,
  updateBenefit,
  deleteBenefit,
  deleteAllBenifits,
} = require("../Controller/benefitsController");

const authMiddleware = require("../Middleware/authMiddleware");
router.post("/add", addBenefit);
router.put("/update/:id",  updateBenefit);
router.delete("delete/:id",  deleteBenefit);
router.delete("/delete-many",  deleteAllBenifits);



module.exports = router;
