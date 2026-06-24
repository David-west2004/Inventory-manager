const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }
},
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

productSchema.virtual("status").get(function() {
    return this.quantity === 0 ? "Sold Out" : "In Stock";
});

module.exports = mongoose.model("product", productSchema);