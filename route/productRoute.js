const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.post("/products", productController.createProduct);
router.get("/products", productController.getProduct);
router.get("/products/:id", productController.getSingleProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;