const fakestorecontroller = require('../controller/fakestorecontroller');
const express = require('express');
const router = express.Router();

// get all products
router.get('/products', fakestorecontroller.getAllProducts);

// get product by id
router.get('/products/:id', fakestorecontroller.getProductById);

// get category by name
router.get('/products/category/:name', fakestorecontroller.getCategoryByName);

// create a new product
router.post('/products', fakestorecontroller.createProduct);

// update an existing product
router.put('/products/:id', fakestorecontroller.updateProduct);

// delete a product
router.delete('/products/:id', fakestorecontroller.deleteProduct);

// get all carts
router.get('/carts', fakestorecontroller.getAllCarts);

// get cart by id
router.get('/carts/:id', fakestorecontroller.getCartById);

// create a new cart
router.post('/carts', fakestorecontroller.createCart);

// update an existing cart
router.put('/carts/:id', fakestorecontroller.updateCart);

// delete a cart
router.delete('/carts/:id', fakestorecontroller.deleteCart);

// get all users
router.get('/users', fakestorecontroller.getAllUser);

// get user by id
router.get('/users/:id', fakestorecontroller.getUserById);

// create a new user
router.post('/users', fakestorecontroller.createUser);

// update an existing user
router.put('/users/:id', fakestorecontroller.updateUser);

// delete a user
router.delete('/users/:id', fakestorecontroller.deleteUser);

// login user
router.post('/auth/login', fakestorecontroller.loginUser);

module.exports = router;