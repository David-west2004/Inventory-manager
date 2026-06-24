const Product = require("../models/product");
const cloudinary = require("../config/cloudinaryConfig");

const User = require("../models/user");
const sendEmail = require("../middleware/emailSender");

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

        const admins = await User.find({role: "admin"});
        const adminEmails = admins.map(a => a.email);

        const subject = "New Product Created";
        const message = `
        <h3>New Product Alert </h3>
        <p>A new product has been created: </p>
        <ul>
            <li><strong>Name:</strong> ${product.name}</li>
            <li><strong>Price:</strong> ${product.price}</li>
        </ul>
        `;

        let emailSent = false;
        let emailError = null;

        if (adminEmails.length > 0) {
            try {
                await sendEmail(adminEmails.join(", "), subject, message);
                emailSent = true;
            } catch (emailErr) {
                console.error("Failed to send email notification to admins:", emailErr);
                emailError = emailErr.message;
            }
        }

        return res.status(201).json({
            message: emailSent 
                ? "Product created and admins notified" 
                : `Product created successfully ${emailError ? `(but failed to send email: ${emailError})` : "(no admins to notify)"}`,
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

// sell product
exports.sellProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const quantitySold = Number(req.body.quantitySold) || 1;

        if (quantitySold <= 0) {
            return res.status(400).json({ message: "Quantity sold must be greater than 0" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        if (product.quantity === 0) {
            return res.status(400).json({ message: "Product is sold out" });
        }

        if (product.quantity < quantitySold) {
            return res.status(400).json({
                message: `Insufficient stock. Only ${product.quantity} items remaining.`
            });
        }

        product.quantity -= quantitySold;
        await product.save();

        res.status(200).json({
            message: product.quantity === 0 
                ? "Sale successful. The product is now sold out!" 
                : `Sale successful. ${product.quantity} items remaining.`,
            product
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};