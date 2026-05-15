const express = require("express");
const router = express.Router();

const { createProduct, getProducts, deleteProduct } = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, createProduct);
router.get("/", verifyToken, getProducts);
router.delete("/:id", verifyToken, deleteProduct); // ✅ Fix 2: ruta DELETE
 
module.exports = router;