# ShopHub Admin & Setup Guide

## 🔐 Admin Panel Access

### Admin Credentials
- **Email:** `admin@shophub.com`
- **Password:** `admin123`

### How to Access Admin Panel
1. First, ensure you're logged in with the admin account
2. Once logged in, navigate to: `http://localhost:5173/admin`
3. You'll see the Dashboard with options to:
   - Manage Products
   - Manage Orders
   - View Statistics

### Admin Routes
- Dashboard: `/admin`
- Manage Products: `/admin/products`
- Manage Orders: `/admin/orders`

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or use MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables (.env already configured):**
   - `PORT=5001`
   - `MONGO_URI=mongodb://localhost:27017/shophub`
   - `JWT_SECRET=shophub_jwt_secret_dev_key_2026`
   - `STRIPE_SECRET_KEY=sk_test_placeholder`

4. **Seed Database (Optional - to add demo data):**
   ```bash
   npm run seed
   ```
   Or run: `node seed.js`

5. **Start Server:**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

---

## 👥 User Accounts (Pre-seeded)

### Admin Account
- Email: `admin@shophub.com`
- Password: `admin123`

### Sample User Accounts (if seed ran)
- Email: `rashi@example.com` | Password: `user1234`
- Email: `priya@example.com` | Password: `user1234`

---

## 📝 Product Image Configuration

### Important: Image URLs
- **For Online Images:** Use full URLs starting with `https://`
  - Example: `https://images.unsplash.com/photo-1234567890?w=600`
- **For Local Images:** Place images in `public/images/` folder
  - Reference as: `/images/product-name.png`

### Adding Products via Admin Panel
1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in details:
   - Name
   - Category (Clothes, Accessories, Footwear, Bags)
   - Description
   - **Image URLs** (must be valid HTTP/HTTPS URLs)
   - Price & Rental rates
   - Stock
4. Click "Add Product"

### Fixing Product Images
If products are not showing images:
1. Check if image URLs are valid and accessible
2. Ensure URLs start with `https://` for external images
3. For local images, ensure they're in `public/images/` folder
4. Update product with correct image URLs via Admin Panel

---

## 🛍️ Features

### Customer Features
- ✅ Browse products by category, gender, price
- ✅ Add to cart and wishlist
- ✅ Rental options (1 day, 1 week, 1 month)
- ✅ Order checkout with COD (Cash on Delivery)
- ✅ Track orders
- ✅ View order history
- ✅ Apply coupons

### Admin Features
- ✅ Add/Edit/Delete products
- ✅ Manage orders
- ✅ View analytics
- ✅ Control user access

---

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

---

## 🎨 Recent Updates

1. ✅ **Navbar:** Made broader with improved spacing (padding increased from px-8 to px-12/px-20)
2. ✅ **Footer:** Added "Designed by Rashi, Neha, Anshika" to copyright
3. ✅ **Checkout:** Added COD payment gateway message
4. ✅ **New Page:** COD Confirmation page after checkout (shows order details)
5. ⏳ **Rental Page:** Cleaning up layout for better spacing
6. 🔄 **Auth:** Login/Register fully functional with JWT authentication
7. 🖼️ **Product Images:** Ensure image URLs are valid before adding products

---

## 🆘 Troubleshooting

### Login/Register Not Working
- Ensure MongoDB is running
- Check server is running on port 5001
- Check browser console for errors
- Verify JWT_SECRET is set in .env

### Products Not Showing
- Check product image URLs are valid
- Ensure products exist in database
- Try seeding the database: `npm run seed`

### Admin Panel Access Denied
- Verify you're logged in with admin@shophub.com
- Check that user role is set to 'admin' in database
- Clear localStorage and re-login

### CORS Errors
- Ensure server is running
- Check vite proxy config points to localhost:5001
- Restart both frontend and backend

---

## 📱 Contact & Credits

- **Designed by:** Rashi, Neha, Anshika
- **Email:** support@shophub.in
- **Phone:** +91 70796 90128
- **Location:** Ranchi, Jharkhand 834001, India

---

Last Updated: April 3, 2026
