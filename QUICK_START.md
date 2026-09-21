# ShopHub - Quick Start Guide 🚀

## 📌 Before You Start

Make sure you have:
- Node.js installed (v14+)
- MongoDB running locally (or MongoDB Atlas connection)
- Two terminal windows ready

---

## 🔧 Step 1: Install Dependencies

### Terminal 1 - Backend Setup
```bash
cd server
npm install
```

### Terminal 2 - Frontend Setup
```bash
cd client
npm install
```

---

## ⚙️ Step 2: Start the Servers

### Terminal 1 - Start Backend
```bash
cd server
npm start
```

You should see: `🚀 ShopHub API Server running on port 5001`

### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```

You should see: `Local: http://localhost:5173/`

---

## 📊 Step 3: Seed the Database (Optional but Recommended)

Open a **new terminal** and run:
```bash
cd server
node seed.js
```

This will add:
- ✅ 1 Admin user
- ✅ 2 Test users
- ✅ 8 Products with images
- ✅ Sample reviews

---

## 🎯 Step 4: Access the Application

### Customer View
- **URL:** `http://localhost:5173/`
- **Login as User:** 
  - Email: `rashi@example.com`
  - Password: `user1234`

### Admin Panel
- **URL:** `http://localhost:5173/admin`
- **Login as Admin:**
  - Email: `admin@shophub.com`
  - Password: `admin123`

---

## 🎮 What You Can Do

### As a Customer
- 🛍️ Browse products by category (Clothes, Accessories, Footwear, Bags)
- 🔍 Search for products
- ❤️ Add to wishlist
- 🛒 Add to cart
- 💵 Checkout with COD payment
- 📦 Track orders
- ⭐ Write reviews
- 🎟️ Apply coupon codes

### As an Admin
- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 📊 View orders and statistics
- 🔄 Update order status

---

## 📱 Test Credentials

### Admin Account
```
Email: admin@shophub.com
Password: admin123
```

### Regular User Account
```
Email: rashi@example.com
Password: user1234

OR

Email: priya@example.com
Password: user1234
```

### Create Your Own Account
- Click "Sign Up" on login page
- Fill in all details
- Your account will automatically be created with "user" role

---

## 🌐 Key URLs

| Page | URL |
|------|-----|
| Home | `http://localhost:5173/` |
| All Products | `http://localhost:5173/products` |
| Rentals | `http://localhost:5173/rentals` |
| Cart | `http://localhost:5173/cart` |
| Login | `http://localhost:5173/login` |
| Register | `http://localhost:5173/register` |
| My Account | `http://localhost:5173/account` |
| My Orders | `http://localhost:5173/orders` |
| My Wishlist | `http://localhost:5173/wishlist` |
| Admin Dashboard | `http://localhost:5173/admin` |
| Manage Products | `http://localhost:5173/admin/products` |
| Manage Orders | `http://localhost:5173/admin/orders` |

---

## ✨ Recent Updates (What's New)

1. ✅ **Navbar** - Made broader with better spacing
2. ✅ **Footer** - Added "Designed by Rashi, Neha, Anshika"
3. ✅ **Checkout** - Shows COD payment method with warning about payment gateway
4. ✅ **COD Confirmation** - Beautiful page showing order details after checkout
5. ✅ **Rentals** - Cleaner, less cluttered layout with better spacing
6. ✅ **Product Images** - All products now have valid, working images
7. ✅ **Auth** - Login/Register fully functional
8. ✅ **Admin Panel** - Complete admin access with credentials

---

## 🔍 Testing the App

### Test Checkout Flow
1. Login as `rashi@example.com` / `user1234`
2. Go to Products
3. Click on any product
4. Click "Add to Cart"
5. Go to Cart
6. Click "Proceed to Checkout"
7. Fill in address
8. Click "Place Order (COD)"
9. See the new COD Confirmation page!

### Test Admin Functions
1. Login as `admin@shophub.com` / `admin123`
2. Go to Admin Panel: `http://localhost:5173/admin`
3. Try adding a new product
4. Edit an existing product
5. Delete a product
6. View orders

---

## 🐛 Troubleshooting

### Issue: Cannot connect to MongoDB
**Solution:** 
- Make sure MongoDB is running locally
- OR update MONGO_URI in `server/.env` to your MongoDB Atlas connection string

### Issue: Port 5001 already in use
**Solution:**
```bash
# Change port in server/.env
PORT=5002
```

### Issue: Products not showing images
**Solution:**
- Make sure you ran `node seed.js` to populate the database
- Image URLs must start with `https://`

### Issue: CORS errors
**Solution:**
- Make sure backend is running on port 5001
- Make sure frontend proxy in vite.config.js points to `http://localhost:5001`

### Issue: Login not working
**Solution:**
1. Check if backend server is running
2. Check browser console for error messages
3. Try clearing browser cache/localStorage
4. Ensure email and password are correct

---

## 📚 Documentation Files

- **ADMIN_GUIDE.md** - Complete admin guide with setup and API documentation
- **UPDATES_SUMMARY.md** - Summary of all changes made
- **README.md** - Original project documentation

---

## 💡 Tips & Tricks

### Adding Products as Admin
1. Go to `/admin/products`
2. Click "Add Product"
3. Use **valid HTTPS image URLs** from:
   - Unsplash: `https://images.unsplash.com/...`
   - Pexels: `https://images.pexels.com/...`
   - Any public image URL with `https://`

### Finding Product Images
- Category images: Unsplash, Pexels, Pixabay
- Fashion images: Google Images (right-click → Copy Image Link)
- Make sure the link works in a browser before adding

### Testing Coupons
- Coupons need to be added via API or database
- Default test coupons may not exist
- Check database/coupons collection for available codes

---

## 🎨 Design Improvements Made

✅ **Navbar**
- Broader layout with px-12 and px-20 padding
- Better spacing between elements
- More professional appearance

✅ **Footer**
- Added team credits
- Shows "Designed by Rashi, Neha, Anshika"

✅ **Checkout Page**
- Clear COD payment information
- Warning about payment gateway under development
- Button shows "Place Order (COD)"

✅ **COD Confirmation**
- Order ID prominently displayed
- Delivery address shown
- Expected delivery timeline
- Contact information for support
- All items listed with prices

✅ **Rentals Page**
- Reduced hero height for less clutter
- Better spacing in "How It Works" section
- Responsive grid layout (4 cols desktop, 2 cols tablet, 1 col mobile)
- More breathing room between sections

---

## 📞 Support

For issues or questions:
- 📧 Email: support@shophub.in
- 📱 Phone: +91 70796 90128
- 📍 Ranchi, Jharkhand 834001, India

---

**Happy Shopping! 🛍️**  
Made with ❤️ by Rashi, Neha, and Anshika
