const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "inventory-manager",
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({ storage });

module.exports = upload;