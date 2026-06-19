require('dotenv').config();

const express = require("express");
const connectDB = require("./config/database");

const productRoute = require("./route/productRoute");
const userRoute = require("./route/userRoute")

// express app
const app = express();


// connect to database
connectDB();

// middleware
app.use(express.json());

app.use("/api/product", productRoute);
app.use("/api/user", userRoute);

app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
});