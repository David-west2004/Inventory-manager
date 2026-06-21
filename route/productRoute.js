const express = require("express");
const router1 = express.Router();
const productController = require("../controller/productController");

const { protect } = require("../middleware/authmiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");


router1.use(protect)

router1.post("/products", authorizeRoles("admin"), productController.createProduct);
router1.get("/products", authorizeRoles("admin", "salesperson", "storekeeper"), productController.getProduct);
router1.get("/products/:id", authorizeRoles("admin", "salesperson", "storekeeper"), productController.getSingleProduct);
router1.put("/products/:id", authorizeRoles("admin", "storekeeper"), productController.updateProduct);
router1.delete("/products/:id", authorizeRoles("admin"), productController.deleteProduct);

module.exports = router1;