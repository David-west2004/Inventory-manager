# Inventory Manager - Image Upload Fixes & Documentation

This document describes the fixes applied to resolve the image upload issues in the **Inventory Manager** application.

---

## 🔍 The Problems Identified

We identified several critical bugs in the image upload workflow:

1. **Incorrect Storage Constructor (Crash)**
   - *File*: `middleware/imageUpload.js`
   - *Issue*: `multer-storage-cloudinary` version `4.x.x` exports `CloudinaryStorage` (capital **C**), but the code imported it as `cloudinaryStorage` (lowercase **c**). This caused a crash when attempting to instantiate the storage object: `TypeError: cloudinaryStorage is not a constructor`.

2. **Incorrect Multer Parameter Casing (No Storage Assigned)**
   - *File*: `middleware/imageUpload.js`
   - *Issue*: Multer expects the storage object under the lowercase configuration key `storage`. The code passed `{ Storage }` (which evaluates to `{ Storage: Storage }`), meaning multer ignored it and fell back to default local storage behavior instead of Cloudinary storage.

3. **Missing Route Middleware (Upload Ignored)**
   - *File*: `route/productRoute.js`
   - *Issue*: The image upload middleware `upload.single("image")` was never imported or applied to either the product creation (`POST /api/product/products`) or product image update (`PUT /api/product/upload/:id`) routes. As a result, `req.file` was always undefined.

4. **Schema Field Mismatch & Application Crashes**
   - *File*: `controller/productController.js`
   - *Issue*: The Mongoose Product schema defines `imageUrl`, but the controller code attempted to read `product.image.split(" ")[0]` to extract a public ID. Since `product.image` does not exist, this threw `TypeError: Cannot read properties of undefined (reading 'split')`.

5. **Cloudinary Asset Leaks (Orphaned Files)**
   - *File*: `controller/productController.js`
   - *Issue*: Old files were never deleted from Cloudinary upon image updates or product deletions. Additionally, if MongoDB validation failed after uploading a file during product creation, the uploaded image remained orphaned in Cloudinary.

---

## 🛠️ The Solutions Applied

### 1. Fixed Multer & Cloudinary Storage Config
Updated `middleware/imageUpload.js` to correctly import and configure the Cloudinary storage backend:
- Imported `CloudinaryStorage` (Capital **C**).
- Used the correct, lowercase `storage` configuration key when instantiating `multer`.
- Used `"inventory-manager"` as the Cloudinary folder name (no spaces) to keep URL structures clean.

### 2. Enabled Upload Middleware on Routes
Updated `route/productRoute.js` to apply `upload.single("image")` to two routes:
- **`POST /api/product/products`**: For uploading the product image on initial creation.
- **`PUT /api/product/upload/:id`**: For uploading/replacing the image of an existing product.

### 3. Rewrote Controller & Added Image Deletion Utilities
Updated `controller/productController.js` with robust file lifecycle management:
- **Added `extractPublicId(url)`**: A helper function that decodes Cloudinary image URLs and extracts the exact `publicId` (e.g., `inventory-manager/filename`). It safely strips out version paths (like `v12345678/`) and the file extension.
- **Improved `createProduct`**:
  - Assigns `req.file.path` to `req.body.imageUrl`.
  - In case of a database creation failure, it automatically deletes the newly uploaded image from Cloudinary inside the `catch` block to prevent orphaned assets.
- **Improved `updateProductImage`**:
  - Checks if a file was uploaded. If not, returns a validation error.
  - If a file is uploaded, it deletes the old product image from Cloudinary first.
  - Safely deletes the new image from Cloudinary if the product is not found or if the database save fails.
- **Improved `deleteProduct`**:
  - When a product is deleted from the database, its associated image in Cloudinary is automatically destroyed.

---

## ⚙️ Environment Configuration

Ensure that your `.env` file contains the correct Cloudinary credentials:

```env
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_uri
```

---

## 🚀 API Endpoints & Testing

### 1. Create Product (with Image Upload)
- **Method**: `POST`
- **Route**: `/api/product/products`
- **Headers**: 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: multipart/form-data`
- **Body (Form-data)**:
  - `name`: `Awesome Widget`
  - `quantity`: `50`
  - `price`: `19.99`
  - `image`: `[File]` (The image file payload)

### 2. Update Product Image (Direct Update)
- **Method**: `PUT`
- **Route**: `/api/product/upload/:id`
- **Headers**:
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: multipart/form-data`
- **Body (Form-data)**:
  - `image`: `[File]` (The new image file payload)

### 3. Delete Product (Automatic Cloudinary Cleanup)
- **Method**: `DELETE`
- **Route**: `/api/product/products/:id`
- **Headers**:
  - `Authorization: Bearer <your_jwt_token>`
