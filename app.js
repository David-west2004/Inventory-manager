require('dotenv').config();

const express = require("express");
const connectDB = require("./config/database");

const productRoute = require("./route/productRoute");
const userRoute = require("./route/userRoute")
const fakestoreroute = require("./route/fakestoreroute")

// express app
const app = express();


// connect to database
connectDB();

// middleware
app.use(express.json());

app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/fakestore", fakestoreroute);


app.get('/', (req, res) => {
    res.send('Inventory Manager API is running...');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});