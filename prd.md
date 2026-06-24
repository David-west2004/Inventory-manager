# Product Requirement Document (PRD) - Inventory Manager

## 1. Executive Summary
The **Inventory Manager** is a backend RESTful service designed to manage product catalogs and control user access using Role-Based Access Control (RBAC). It integrates with cloud storage (Cloudinary) for handling media uploads and implements email notifications (Nodemailer) to alert administrators of critical actions, such as product creation.

---

## 2. Roles & Permissions System
The system distinguishes users into three distinct roles. Each role has specific access levels across endpoints:

| Role | Permissions | Responsibilities |
| :--- | :--- | :--- |
| **Admin** | Read/write access to all resources; User creation/management; Product creation/deletion. | Full control of inventory and system users. |
| **Storekeeper** | Read access to products; Write access to update product metadata (e.g. quantities). | Managing stock levels and incoming/outgoing inventory details. |
| **Salesperson** | Read access to products; Write access to record product sales (`sell`). | Verifying product availability, stock checks, pricing, and recording items sold. |

---

## 3. Core Features

### 3.1. User Authentication & Directory
- **Creation & Roles**: Admins or registration processes can create users, assigning them one of the three roles (`admin`, `salesperson`, `storekeeper`).
- **Secure Credentials**: Passwords are securely hashed using `bcrypt` (10 rounds) before being saved.
- **Session Tokens**: Login returns a JWT containing the user ID and role, valid for 1 hour. This token must be passed in the `Authorization` header for subsequent requests.

### 3.2. Product Catalog Management
- **Media Uploads**: Product creation and product image updates accept image files (`jpg`, `jpeg`, `png`). These are automatically uploaded to Cloudinary, and the resulting cloud URL is stored in the database.
- **Dynamic Deletion**: When a product is deleted from the inventory, its image asset is automatically deleted from Cloudinary, keeping storage clean and cost-efficient.
- **Non-blocking Notifications**: When a new product is added, administrators are automatically notified via email. SMTP or email sending failures are handled gracefully without failing the product creation process.
- **Stock Tracking & Status Detection**: Products store an available quantity. The system automatically computes a dynamic `status` virtual field (`"In Stock"` or `"Sold Out"`). Processing a sale deducts from this quantity, enforcing bounds checks to prevent selling below zero.

---

## 4. Technical Architecture
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose Object Modeling)
- **File Upload Handler**: Multer + `multer-storage-cloudinary`
- **Cloud Storage**: Cloudinary v2
- **Mailing Client**: Nodemailer
- **Authentication**: JWT (JSON Web Tokens)

---

## 5. Endpoints Specifications

All inventory endpoints require a Bearer token: `Authorization: Bearer <JWT_TOKEN>`.

### 5.1. Authentication & Users (`/api/user`)
- `POST /user` (Create User): Public/Open signup.
- `POST /user/login` (Login): Exchange credentials for a JWT.
- `GET /user` (List Users): View all user accounts.
- `GET /user/:id` (Get User): View specific user details.
- `PUT /user/:id` (Update User): Update name, phone, password, or role.
- `DELETE /user/:id` (Delete User): Remove a user.

### 5.2. Inventory Products (`/api/product`)
- `POST /products` (Create Product): Admin only. Requires image file.
- `GET /products` (List Products): Admin, Storekeeper, Salesperson.
- `GET /products/:id` (Get Product): Admin, Storekeeper, Salesperson.
- `PUT /products/:id` (Update Product Metadata): Admin, Storekeeper.
- `DELETE /products/:id` (Delete Product): Admin only.
- `PUT /upload/:id` (Update Product Image): Enforces image replacement.
- `POST /products/:id/sell` (Sell Product): Admin, Salesperson. Decrements product quantity.
