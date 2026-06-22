const Product = require("../models/product");
const cloudinary = require("../config/cloudinaryConfig");

// Helper to extract Cloudinary public ID from an image URL
const extractPublicId = (url) => {
    try {
        if (!url) return null;
        const parts = url.split('/image/upload/');
        if (parts.length < 2) return null;

        // Remove version string (e.g. v12345678/) if it exists
        let publicIdWithPath = parts[1].replace(/^v\d+\//, '');

        // Strip the file extension (e.g. .jpg, .png)
        const dotIndex = publicIdWithPath.lastIndexOf('.');
        if (dotIndex !== -1) {
            publicIdWithPath = publicIdWithPath.substring(0, dotIndex);
        }

        return decodeURIComponent(publicIdWithPath);
    } catch (err) {
        return null;
    }
};

// update image
exports.updateProductImage = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            if (req.file && req.file.filename) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            return res.status(404).json({ message: "Product not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        if (product.imageUrl) {
            const publicId = extractPublicId(product.imageUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        product.imageUrl = req.file.path;

        await product.save();

        res.status(200).json({
            message: "Image uploaded successfully",
            product,
        });
    }
    catch (err) {
        if (req.file && req.file.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (destroyErr) {
                console.error("Failed to delete uploaded image on error:", destroyErr);
            }
        }
        res.status(500).json({ error: err.message });
    }
}


//create
exports.createProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.imageUrl = req.file.path;
        }
        const product = await Product.create(req.body);
        res.status(201).json(product);
    }
    catch (err) {
        if (req.file && req.file.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (destroyErr) {
                console.error("Failed to delete uploaded image on error:", destroyErr);
            }
        }
        res.status(500).json({ error: err.message });
    }
}

// get all
exports.getProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// get one 
exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// update
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// delete
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        if (product.imageUrl) {
            const publicId = extractPublicId(product.imageUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};