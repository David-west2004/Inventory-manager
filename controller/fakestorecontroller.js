const apiAdapter = require('../config/fakestoreadapter')

// get all products
exports.getAllProducts = async (req, res) => {
    try {
        const response = await apiAdapter.get('/products');
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// get product by id
exports.getProductById = async (req, res) => {
    try {
        const response = await apiAdapter.get(`/products/${req.params.id}`);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// get category by name
exports.getCategoryByName = async (req, res) => {
    try {
        const response = await apiAdapter.get(`/products/category/${req.params.name}`);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// create a new product
exports.createProduct = async (req, res) => {
    try {
        const response = await apiAdapter.post('/products', req.body);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const response = await apiAdapter.put(`/products/${req.params.id}`, req.body);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const response = await apiAdapter.delete(`/products/${req.params.id}`);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


// CART

// GET ALL CART 
exports.getAllCarts = async (req, res) => {
    try {
        const response = await apiAdapter.get('/carts');
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET CART BY ID
exports.getCartById = async (req, res) => {
    try {
        const response = await apiAdapter.get(`/carts/${req.params.id}`);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


// create a new cart 
exports.createCart = async (req, res) => {
    try {
        const response = await apiAdapter.post('/carts', req.body);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// update an existing cart
exports.updateCart = async (req, res) => {
    try {
        const response = await apiAdapter.put(`/carts/${req.params.id}`, req.body);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// delete a cart
exports.deleteCart = async (req, res) => {
    try {
        const response = await apiAdapter.delete(`/carts/${req.params.id}`);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// USER

// GET ALL USER 
exports.getAllUser = async (req, res) => {
    try {
        const response = await apiAdapter.get('/users');
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET USER BY ID
exports.getUserById = async (req, res) => {
    try {
        const response = await apiAdapter.get(`/users/${req.params.id}`);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// create a new user 
exports.createUser = async (req, res) => {
    try {
        const response = await apiAdapter.post('/users', req.body);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// update an existing user
exports.updateUser = async (req, res) => {
    try {
        const response = await apiAdapter.put(`/users/${req.params.id}`, req.body);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// delete a user
exports.deleteUser = async (req, res) => {
    try {
        const response = await apiAdapter.delete(`/users/${req.params.id}`);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// AUTH

// LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const response = await apiAdapter.post('/auth/login', req.body);
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}