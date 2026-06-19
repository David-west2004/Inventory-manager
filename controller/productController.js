const Product = require("../models/product");


//create
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// get all
exports.getProduct = async (req, res) => {
    const products = await Product.find();
    res.json(products);
}


// get one 
exports.getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(400).json({ message: "Product not found" });
    }

    res.json(product);
};

// update
exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!product) {
        return res.status(400).json({ message: "Product not found" });
    }

    res.json(product);
};

// delete
exports.deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(400).json({ message: "Product not found" });
    }

    res.json(product);
};  