import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import Rentals from './pages/Rentals';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CODConfirmation from './pages/CODConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px', zIndex: 99999 } }} />
      <Routes>
        {/* User-facing routes with Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/cod-confirmation" element={<ProtectedRoute><CODConfirmation /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        </Route>

        {/* Admin routes with AdminLayout (no Navbar/Footer) */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </>
  );
}
