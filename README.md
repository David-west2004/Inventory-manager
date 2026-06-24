# Inventory Manager

A Node.js & Express RESTful API for inventory management with Role-Based Access Control (RBAC), image upload integration to Cloudinary, and admin email alerts on product creation.

---

## 📋 Summary of the Project

The **Inventory Manager** is a Node.js & Express RESTful API designed for comprehensive inventory management. It features Role-Based Access Control (RBAC), image upload integration to Cloudinary, and automated admin email alerts.

### Key Capabilities:
- **Role-Based Access Control (RBAC)**: Supports roles (`admin`, `salesperson`, `storekeeper`) to secure and restrict product and user management operations.
- **Product & Stock Management**: Complete product CRUD actions along with sales processing (`POST /products/:id/sell`) that handles real-time stock deductions and dynamic status calculation (`In Stock` / `Sold Out`).
- **Cloud-Integrated Media**: Seamless product image uploads and updates using Multer and Cloudinary storage with automatic asset deletion when products are updated or removed.
- **Resilient Notification System**: Alerts administrator emails upon product creation, designed with error isolation so that SMTP delivery failures do not block product registration or delete uploaded media assets.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=your_port
MONGO_URI=your_mongo_db_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

> [!IMPORTANT]
> If you are using Gmail for email notifications, you **must use a Gmail App Password** (16 characters) instead of your regular password. Remove the spaces when inserting it into `.env` (e.g. `EMAIL_PASSWORD=xxxxxxxxxxxxxxxx`).

---

## 🚀 API Endpoint Testing Guide & Parameter Reference

### 1. User Management & Auth (`/api/user`)

#### A. Create User (Register)
- **Method**: `POST`
- **Route**: `/api/user/user`
- **Content-Type**: `application/json`
- **Body (JSON Parameters)**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | String | Yes | Name of the user. |
  | `phone` | String | Yes | Unique phone number. |
  | `email` | String | Yes | Unique email address (valid email format). |
  | `password` | String | Yes | Plaintext password (will be hashed). |
  | `role` | String | No | Enum: `admin`, `salesperson`, `storekeeper`. Default: `salesperson`. |

#### B. Login User
- **Method**: `POST`
- **Route**: `/api/user/user/login`
- **Content-Type**: `application/json`
- **Body (JSON Parameters)**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Email address of the user. |
  | `password` | String | Yes | Password of the user. |
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "...", "role": "..." }
  }
  ```

#### C. Get All Users
- **Method**: `GET`
- **Route**: `/api/user/user`

#### D. Get Single User
- **Method**: `GET`
- **Route**: `/api/user/user/:id`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the user.

#### E. Update User
- **Method**: `PUT`
- **Route**: `/api/user/user/:id`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the user.
- **Body (JSON Parameters)**:
  - Any user fields to update (`name`, `phone`, `email`, `password`, `role`).

#### F. Delete User
- **Method**: `DELETE`
- **Route**: `/api/user/user/:id`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the user.

---

### 2. Product Management (`/api/product`)
*All endpoints below require a JWT token passed in the header: `Authorization: Bearer <your_jwt_token>`.*

#### A. Create Product (Admin Only)
- **Method**: `POST`
- **Route**: `/api/product/products`
- **Content-Type**: `multipart/form-data`
- **Body (Form-data Parameters)**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | String | Yes | Product name. |
  | `quantity` | Number | Yes | Stock quantity. |
  | `price` | Number | Yes | Unit price. |
  | `image` | File | Yes | Image file (jpg, jpeg, png format). Uploaded to Cloudinary. |

#### B. Get All Products (Admin, Salesperson, Storekeeper)
- **Method**: `GET`
- **Route**: `/api/product/products`

#### C. Get Single Product (Admin, Salesperson, Storekeeper)
- **Method**: `GET`
- **Route**: `/api/product/products/:id`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product.

#### D. Update Product Metadata (Admin, Storekeeper)
- **Method**: `PUT`
- **Route**: `/api/product/products/:id`
- **Content-Type**: `application/json`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product.
- **Body (JSON Parameters)**:
  - Any product fields to update (`name`, `quantity`, `price`). *(Note: Cannot update the image via this endpoint)*.

#### E. Update Product Image (Admin, Storekeeper)
- **Method**: `PUT`
- **Route**: `/api/product/upload/:id`
- **Content-Type**: `multipart/form-data`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product.
- **Body (Form-data Parameters)**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `image` | File | Yes | New image file (jpg, jpeg, png format). Replaces old Cloudinary asset. |

#### F. Delete Product (Admin Only)
- **Method**: `DELETE`
- **Route**: `/api/product/products/:id`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product. *(This automatically destroys the linked image asset in Cloudinary)*.

#### G. Sell Product (Admin, Salesperson)
- **Method**: `POST`
- **Route**: `/api/product/products/:id/sell`
- **Content-Type**: `application/json`
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product to sell.
- **Body (JSON Parameters)**:
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `quantitySold` | Number | No | The number of items sold. Defaults to `1`. Must be greater than 0 and less than or equal to the available stock. |
- **Example Response (200 OK)**:
  ```json
  {
    "message": "Sale successful. 4 items remaining.",
    "product": {
      "_id": "6a3c220cd6f309a401c5f4b7",
      "name": "excavator",
      "quantity": 4,
      "price": 40000000,
      "imageUrl": "https://...",
      "status": "In Stock",
      "createdAt": "2026-06-24T18:31:40.910Z",
      "updatedAt": "2026-06-24T18:35:10.120Z",
      "__v": 0
    }
  }
  ```

