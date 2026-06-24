const express = require("express");
const router1 = express.Router();
const productController = require("../controller/productController");

const { protect } = require("../middleware/authmiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/imageUpload");

router1.use(protect)

const handleImageUpload = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            if (err.code === "EAI_AGAIN" || err.message.includes("getaddrinfo")) {
                return res.status(503).json({
                    message: "Cloud storage service (Cloudinary) is unreachable. Please check your internet connection or DNS configuration.",
                    error: err.message
                });
            }
            return res.status(400).json({
                message: "Image upload failed",
                error: err.message
            });
        }
        next();
    });
};

router1.post("/products", authorizeRoles("admin"), handleImageUpload, productController.createProduct);
router1.get("/products", authorizeRoles("admin", "salesperson", "storekeeper"), productController.getProduct);
router1.get("/products/:id", authorizeRoles("admin", "salesperson", "storekeeper"), productController.getSingleProduct);
router1.put("/products/:id", authorizeRoles("admin", "storekeeper"), productController.updateProduct);
router1.delete("/products/:id", authorizeRoles("admin"), productController.deleteProduct);
router1.put('/upload/:id', handleImageUpload, productController.updateProductImage);
router1.post("/products/:id/sell", authorizeRoles("admin", "salesperson"), productController.sellProduct);

module.exports = router1;