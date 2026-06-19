const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: {
        type: String, required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'salesperson', 'storekeeper'], default: 'salesperson' }
},
    { timestamps: true });

module.exports = mongoose.model("User", UserSchema);