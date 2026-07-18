const axios = require('axios');
// Make sure your Mongoose models are imported correctly at the top
// const Product = require('../models/Product');
// const Cart = require('../models/Cart');
// const User = require('../models/User');

const baseURL = 'https://api.allorigins.win/raw?url=https://fakestoreapi.com';

const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
    }
});

// ==========================================
// PRODUCTS
// ==========================================

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        // 1. Check if products already exist in the database
        const localProducts = await Product.find({});
        
        if (localProducts.length > 0) {
            console.log('Fetching products from local Database...');
            return res.send(localProducts);
        }

        // 2. If database is empty, fetch from external API
        console.log('Database empty. Fetching products from External API...');
        const response = await apiClient.get('/products');
        const products = response.data;

        // 3. Save to database for future requests
        await Product.insertMany(products);
        console.log('Products successfully cached to database.');

        res.send(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
    try {
        // 1. Check if this specific product is in the database (matching fake store's ID)
        const localProduct = await Product.findOne({ id: req.params.id });

        if (localProduct) {
            console.log(`Fetching product ${req.params.id} from local Database...`);
            return res.send(localProduct);
        }

        // 2. If not found locally, fetch from external API
        console.log(`Product ${req.params.id} not found locally. Fetching from External API...`);
        const response = await apiClient.get(`/products/${req.params.id}`);
        const product = response.data;

        // 3. Save to database
        const savedProduct = await Product.create(product);
        console.log('Product saved to database:', savedProduct);

        res.send(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// CREATE A NEW PRODUCT
exports.createProduct = async (req, res) => {
    try {
        const response = await apiClient.post('/products', req.body);
        const product = response.data;

        // Save directly to local database so it is available locally next time
        const savedProduct = await Product.create(product);
        console.log('New product created and saved to database:', savedProduct);

        res.send(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// UPDATE AN EXISTING PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const response = await apiClient.put(`/products/${req.params.id}`, req.body);
        const product = response.data;

        // Sync change into your local database copy
        // Note: Assumes your schema matches by 'id' field from the external API
        const updatedProduct = await Product.findOneAndUpdate({ id: req.params.id }, product, { new: true });
        console.log('Product updated in database:', updatedProduct);

        res.send(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// DELETE A PRODUCT
exports.deleteProduct = async (req, res) => {
    try {
        const response = await apiClient.delete(`/products/${req.params.id}`);
        
        // Remove from local database to keep them synced
        const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
        console.log('Product deleted from database:', deletedProduct);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// ==========================================
// CART
// ==========================================

// GET ALL CARTS
exports.getAllCarts = async (req, res) => {
    try {
        const localCarts = await Cart.find({});
        if (localCarts.length > 0) {
            console.log('Fetching carts from local Database...');
            return res.send(localCarts);
        }

        console.log('Database empty. Fetching carts from External API...');
        const response = await apiClient.get('/carts');
        const carts = response.data;

        await Cart.insertMany(carts);
        console.log('Carts successfully cached to database.');

        res.send(carts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET CART BY ID
exports.getCartById = async (req, res) => {
    try {
        const localCart = await Cart.findOne({ id: req.params.id });
        if (localCart) {
            console.log(`Fetching cart ${req.params.id} from local Database...`);
            return res.send(localCart);
        }

        console.log(`Cart ${req.params.id} not found locally. Fetching from External API...`);
        const response = await apiClient.get(`/carts/${req.params.id}`);
        const cart = response.data;

        await Cart.create(cart);
        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// CREATE A NEW CART
exports.createCart = async (req, res) => {
    try {
        const response = await apiClient.post('/carts', req.body);
        const cart = response.data;

        const savedCart = await Cart.create(cart);
        console.log('Cart created in database:', savedCart);

        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// UPDATE AN EXISTING CART
exports.updateCart = async (req, res) => {
    try {
        const response = await apiClient.put(`/carts/${req.params.id}`, req.body);
        const cart = response.data;

        const updatedCart = await Cart.findOneAndUpdate({ id: req.params.id }, cart, { new: true });
        console.log('Cart updated in database:', updatedCart);

        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// DELETE A CART
exports.deleteCart = async (req, res) => {
    try {
        const response = await apiClient.delete(`/carts/${req.params.id}`);
        
        const deletedCart = await Cart.findOneAndDelete({ id: req.params.id });
        console.log('Cart deleted from database:', deletedCart);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// ==========================================
// USER
// ==========================================

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        const localUsers = await User.find({});
        if (localUsers.length > 0) {
            console.log('Fetching users from local Database...');
            return res.send(localUsers);
        }

        console.log('Database empty. Fetching users from External API...');
        const response = await apiClient.get('/users');
        const users = response.data;

        await User.insertMany(users);
        console.log('Users successfully cached to database.');

        res.send(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// GET USER BY ID
exports.getUserById = async (req, res) => {
    try {
        const localUser = await User.findOne({ id: req.params.id });
        if (localUser) {
            console.log(`Fetching user ${req.params.id} from local Database...`);
            return res.send(localUser);
        }

        console.log(`User ${req.params.id} not found locally. Fetching from External API...`);
        const response = await apiClient.get(`/users/${req.params.id}`);
        const user = response.data;

        await User.create(user);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// CREATE A NEW USER
exports.createUser = async (req, res) => {
    try {
        const response = await apiClient.post('/users', req.body);
        const user = response.data;

        const savedUser = await User.create(user);
        console.log('User created in database:', savedUser);

        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// UPDATE AN EXISTING USER
exports.updateUser = async (req, res) => {
    try {
        const response = await apiClient.put(`/users/${req.params.id}`, req.body);
        const user = response.data;

        const updatedUser = await User.findOneAndUpdate({ id: req.params.id }, user, { new: true });
        console.log('User updated in database:', updatedUser);

        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// DELETE A USER
exports.deleteUser = async (req, res) => {
    try {
        const response = await apiClient.delete(`/users/${req.params.id}`);
        
        const deletedUser = await User.findOneAndDelete({ id: req.params.id });
        console.log('User deleted from database:', deletedUser);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// ==========================================
// AUTH
// ==========================================

// LOGIN 
exports.loginUser = async (req, res) => {
    try {
        const response = await apiClient.post('/auth/login', req.body);
        const user = response.data;

        // Login usually returns a token, you don't always need to create a user here, 
        // but keeping it structural to your previous code pattern
        const savedUser = await User.create(user);
        console.log('User authenticated and saved:', savedUser);

        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = apiClient;