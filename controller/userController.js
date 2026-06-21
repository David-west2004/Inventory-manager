const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// create user
exports.createUser = async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;
        if (req.body === null) {
            res.status(400).json({ message: "Please fill all the required fields" });
        }

        // check existing email
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exist" })
        }

        // check existing phone 
        const existingPhone = await User.findOne({ phone: phone });
        if (existingPhone) {
            return res.status(400).json({ message: "Phone already exist" })
        }

        // hash password
        const passwordhash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            phone,
            email,
            password: passwordhash,
            role
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// get all users
exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
}

// get single user
exports.getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
}

// update user
exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
}

// delete user
exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
}

// login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // generate token 
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}