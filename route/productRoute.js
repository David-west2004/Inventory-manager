const express = require("express");
const router1 = express.Router();
const productController = require("../controller/productController");

const { protect } = require("../middleware/authmiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/imageUpload");

router1.use(protect)

router1.post("/products", authorizeRoles("admin"), upload.single("image"), productController.createProduct);
router1.get("/products", authorizeRoles("admin", "salesperson", "storekeeper"), productController.getProduct);
router1.get("/products/:id", authorizeRoles("admin", "salesperson", "storekeeper"), productController.getSingleProduct);
router1.put("/products/:id", authorizeRoles("admin", "storekeeper"), productController.updateProduct);
router1.delete("/products/:id", authorizeRoles("admin"), productController.deleteProduct);
router1.put('/upload/:id', upload.single("image"), productController.updateProductImage)

module.exports = router1;