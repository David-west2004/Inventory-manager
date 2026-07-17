const axios = require('axios');

const baseURL = 'https://fakestoreapi.com';

const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});


// PRODUCTS

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const response = await apiClient.get('/products');

        // save to database
        const products = response.data;
        const savedProducts = await Product.insertMany(products);


        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
    try {
        const response = await apiClient.get(`/products/${req.params.id}`);

        // save to database
        const product = response.data;
        const savedProduct = await Product.create(product);
        console.log('Product saved to database:', savedProduct);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


// create a new product 
exports.createProduct = async (req, res) => {
    try {
        const response = await apiClient.post('/products', req.body);

        // save to database
        const product = response.data;
        const savedProduct = await Product.create(product);
        console.log('Product saved to database:', savedProduct);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const response = await apiClient.put(`/products/${req.params.id}`, req.body);

        // save to database
        const product = response.data;
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, { new: true });
        console.log('Product updated in database:', updatedProduct);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


// delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const response = await apiClient.delete(`/products/${req.params.id}`);

        // save to database
        const product = response.data;
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        console.log('Product deleted from database:', deletedProduct);

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
        const response = await apiClient.get('/carts');

        // save to database
        const carts = response.data;
        const savedCarts = await Cart.insertMany(carts);
        console.log('Carts saved to database:', savedCarts);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET CART BY ID
exports.getCartById = async (req, res) => {
    try {
        const response = await apiClient.get(`/carts/${req.params.id}`);

        // save to database
        const cart = response.data;
        const savedCart = await Cart.findByIdAndUpdate(req.params.id, cart, { new: true });
        console.log('Cart updated in database:', savedCart);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


// create a new cart 
exports.createCart = async (req, res) => {
    try {
        const response = await apiClient.post('/carts', req.body);

        // save to database
        const cart = response.data;
        const savedCart = await Cart.create(cart);
        console.log('Cart created in database:', savedCart);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// update an existing cart
exports.updateCart = async (req, res) => {
    try {
        const response = await apiClient.put(`/carts/${req.params.id}`, req.body);

        // save to database
        const cart = response.data;
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, cart, { new: true });
        console.log('Cart updated in database:', updatedCart);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// delete a cart
exports.deleteCart = async (req, res) => {
    try {
        const response = await apiClient.delete(`/carts/${req.params.id}`);

        // save to database
        const cart = response.data;
        const deletedCart = await Cart.findByIdAndDelete(req.params.id);
        console.log('Cart deleted from database:', deletedCart);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// USER

// GET ALL USER
exports.getAllUsers = async (req, res) => {
    try {
        const response = await apiClient.get('/users');

        // save to database
        const users = response.data;
        const savedUsers = await User.insertMany(users);
        console.log('Users saved to database:', savedUsers);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET USER BY ID
exports.getUserById = async (req, res) => {
    try {
        const response = await apiClient.get(`/users/${req.params.id}`);

        // save to database
        const user = response.data;
        const savedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true });
        console.log('User updated in database:', savedUser);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// create a new user
exports.createUser = async (req, res) => {
    try {
        const response = await apiClient.post('/users', req.body);

        // save to database
        const user = response.data;
        const savedUser = await User.create(user);
        console.log('User created in database:', savedUser);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// update an existing user
exports.updateUser = async (req, res) => {
    try {
        const response = await apiClient.put(`/users/${req.params.id}`, req.body);

        // save to database
        const user = response.data;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true });
        console.log('User updated in database:', updatedUser);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// delete a user
exports.deleteUser = async (req, res) => {
    try {
        const response = await apiClient.delete(`/users/${req.params.id}`);

        // save to database
        const user = response.data;
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        console.log('User deleted from database:', deletedUser);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// AUTH

// LOGIN 
exports.loginUser = async (req, res) => {
    try {
        const response = await apiClient.post('/auth/login', req.body);

        // save to database
        const user = response.data;
        const savedUser = await User.create(user);
        console.log('User created in database:', savedUser);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


module.exports = apiClient


