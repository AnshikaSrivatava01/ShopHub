# 🔧 ShopHub Configuration Guide

## ✅ What's Already Configured

Good news! Most settings are already configured. Here's what you need to know:

---

## 📋 Current Configuration Status

### ✅ Backend (.env file)
```properties
PORT=5001
MONGO_URI=mongodb://localhost:27017/shophub
JWT_SECRET=shophub_jwt_secret_dev_key_2026
STRIPE_SECRET_KEY=sk_test_placeholder
```

### ✅ Frontend (vite.config.js)
```javascript
port: 5173
proxy: '/api' → 'http://localhost:5001'
```

### ✅ Database (config/db.js)
- Uses MONGO_URI from .env
- Auto-connects on server start

---

## 🔑 What You Need to Change (If Required)

### Option 1: Running Locally (Recommended for Development)
**No changes needed!** Everything is pre-configured for local development.

Just make sure:
- ✅ MongoDB is running on `localhost:27017`
- ✅ Port 5001 is available for backend
- ✅ Port 5173 is available for frontend

### Option 2: Using MongoDB Atlas (Cloud Database)
If you want to use MongoDB Atlas instead of local MongoDB:

**Step 1:** Create MongoDB Atlas account
- Go to: https://www.mongodb.com/cloud/atlas
- Create a free cluster

**Step 2:** Get connection string
- In Atlas, click "Connect" → "Drivers"
- Copy your connection string

**Step 3:** Update .env
```bash
# Change this line in server/.env:
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shophub?retryWrites=true&w=majority
```

Replace:
- `username` - Your Atlas username
- `password` - Your Atlas password
- `cluster0.xxxxx` - Your cluster URL

### Option 3: Using Stripe (For Real Payments)
The app is in **demo mode** with COD (Cash on Delivery). If you want real Stripe payments:

**Step 1:** Create Stripe account
- Go to: https://stripe.com
- Sign up for free

**Step 2:** Get API keys
- In Stripe Dashboard → Developers → API Keys
- Copy your Secret Key

**Step 3:** Update .env
```bash
# Change this line in server/.env:
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_STRIPE_KEY
```

---

## 📝 Complete Configuration Checklist

### Before Running Backend

- [ ] MongoDB running (local or Atlas)
- [ ] `server/.env` configured
- [ ] Check PORT is 5001 (or available)
- [ ] Node.js and npm installed

### Before Running Frontend

- [ ] Node.js and npm installed
- [ ] Port 5173 available
- [ ] vite.config.js points to correct backend (http://localhost:5001)

---

## 🛠️ Step-by-Step Setup

### Step 1: Configure Backend

```bash
cd server
```

**Check .env file:**
```properties
PORT=5001                                          # ✅ Good for local
MONGO_URI=mongodb://localhost:27017/shophub       # ✅ Good for local
JWT_SECRET=shophub_jwt_secret_dev_key_2026        # ✅ Keep this (dev key)
STRIPE_SECRET_KEY=sk_test_placeholder             # ✅ Good for COD only
```

**If using MongoDB Atlas, change:**
```properties
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shophub
```

### Step 2: Install Backend Dependencies

```bash
npm install
```

### Step 3: Configure Frontend

```bash
cd ../client
```

**Check vite.config.js:**
```javascript
server: {
  port: 5173,                                    # ✅ Good
  proxy: {
    '/api': {
      target: 'http://localhost:5001',          # ✅ Matches backend port
      changeOrigin: true,
    },
  },
}
```

**If backend is on different port, update the target URL above.**

### Step 4: Install Frontend Dependencies

```bash
npm install
```

### Step 5: Start Everything

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Should see: 🚀 ShopHub API Server running on port 5001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Should see: Local: http://localhost:5173/
```

---

## ⚙️ Default Configurations Explained

### JWT_SECRET
```
Current: shophub_jwt_secret_dev_key_2026
Purpose: Sign JWT tokens for authentication
For Production: Change to a long random string
```

**Generate a new one (Optional):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### STRIPE_SECRET_KEY
```
Current: sk_test_placeholder
Status: Demo mode (COD only)
For Real Payments: Get from Stripe dashboard
```

### MONGO_URI
```
Current: mongodb://localhost:27017/shophub
For Local Dev: Works as-is
For Production: Use MongoDB Atlas
For Docker: mongodb://mongo:27017/shophub
```

---

## 🚀 Quick Start Commands

### All defaults (local MongoDB):
```bash
# Terminal 1
cd server
npm install
npm start

# Terminal 2
cd client
npm install
npm run dev

# Optional - Terminal 3 (seed data)
cd server
node seed.js
```

### With MongoDB Atlas:
1. Update `server/.env` with your Atlas URI
2. Then run same commands above

### With Stripe:
1. Update `server/.env` with your Stripe key
2. Then follow implementation in frontend
3. Currently, app uses COD only - no changes needed to run

---

## 🔍 Verification Checklist

After setup, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can visit http://localhost:5173
- [ ] Can login with test account
- [ ] Can view products
- [ ] Can checkout
- [ ] API calls work (no 404 errors)

---

## 🆘 Troubleshooting

### "MongoDB connection failed"
**Solution:** 
- Make sure MongoDB is running: `mongod`
- OR update MONGO_URI to MongoDB Atlas

### "Port 5001 already in use"
**Solution:**
```bash
# Change PORT in server/.env to 5002 (or another free port)
PORT=5002
```

Then update frontend vite.config.js:
```javascript
target: 'http://localhost:5002'
```

### "Port 5173 already in use"
**Solution:**
```bash
# Change port in client/vite.config.js
port: 5174  // or another free port
```

### "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### "CORS errors"
**Solution:**
- Backend running on correct port? (5001)
- Frontend proxy correctly configured? (vite.config.js)
- Both servers running? (check terminals)

---

## 🔐 Security Notes

### For Development:
✅ Current setup is fine for local testing

### For Production:
⚠️ Change these:
1. **JWT_SECRET** - Use strong random key
2. **STRIPE_SECRET_KEY** - Use real Stripe key
3. **MONGO_URI** - Use secure MongoDB Atlas
4. **NODE_ENV** - Set to "production"
5. **API Port** - Use non-standard port (not 5001)
6. **CORS** - Restrict to your domain

---

## 📊 Default Accounts

These are pre-configured in seed data:

### Admin
```
Email: admin@shophub.com
Password: admin123
```

### Regular Users
```
Email: rashi@example.com
Password: user1234

Email: priya@example.com
Password: user1234
```

Change these in `server/seed.js` before seeding if needed.

---

## ✨ Summary

### What's Pre-Configured:
- ✅ Backend port (5001)
- ✅ Frontend port (5173)
- ✅ Proxy setup
- ✅ JWT secret
- ✅ Test accounts
- ✅ Database name

### What You May Need to Configure:
- ❓ MongoDB URI (if not local)
- ❓ Stripe key (if real payments)
- ❓ JWT secret (change for production)
- ❓ Ports (if conflicts)

### Quick Decision:
- **Local Development?** → Run as-is, no changes needed ✅
- **Cloud MongoDB?** → Update MONGO_URI only
- **Real Stripe?** → Update STRIPE_SECRET_KEY + implement payment UI
- **Production?** → Change all secrets and use secure database

---

## 🎯 Next Steps

1. Make sure MongoDB is running locally
2. Run backend: `npm start` from `server/` folder
3. Run frontend: `npm run dev` from `client/` folder
4. Visit http://localhost:5173
5. Login with test account
6. Test the app!

---

**Everything is ready to run!** 🚀
