# ShopHub — Buy & Rent Premium Products 🛍️

> **📝 Latest Updates:** All 8 requested features have been implemented! See [QUICK_START.md](./QUICK_START.md) to get started.

A full-stack **MERN** e-commerce platform supporting both product **sales** and **rentals** in **Indian Rupees (₹)**.

## Features

- 🔑 **JWT Authentication** — Secure user registration, login, and profile management
- 🛒 **Buy or Rent** — Purchase permanently or rent by day/week/month with auto price calculation
- 💰 **Indian Rupees** — All prices displayed in ₹ (INR)
- 🔍 **Search & Filters** — By name, category, price, sale/rent type, with sorting and pagination
- 🛍️ **Shopping Cart** — Supports both buy and rental items with quantity/duration controls
- 💳 **Stripe Integration** — Payment gateway ready (demo mode included)
- 📦 **Order Management** — Track orders, delivery status, and rental return dates
- ⭐ **Reviews & Ratings** — Product reviews with star ratings
- ❤️ **Wishlist** — Save favorite products
- 👨‍💼 **Admin Dashboard** — Analytics, product CRUD, order management
- 📱 **Responsive Design** — Mobile, tablet, and desktop support

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS 4      |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Mongoose)                  |
| Auth       | JWT (JSON Web Tokens)               |
| Payment    | Stripe                             |
| Currency   | Indian Rupees (₹)                   |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment
```bash
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and Stripe key
```

### 3. Seed the Database
```bash
cd server && npm run seed
```
This creates:
- **Admin**: admin@shophub.com / admin123
- **User**: rashi@example.com / user1234
- **12 sample products** across Electronics, Cameras, Furniture, Tools

### 4. Run the App
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```
Open **http://localhost:5173**

## Project Structure
```
ShopHub/
├── server/           # Express.js API
│   ├── config/       # Database connection
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── middleware/    # Auth & error handling
│   └── seed.js       # Database seeder
├── client/           # React + Vite SPA
│   └── src/
│       ├── components/  # Navbar, Footer, ProductCard
│       ├── pages/       # All app pages + admin/
│       ├── context/     # Auth & Cart providers
│       └── utils/       # API client & helpers
└── README.md
```
