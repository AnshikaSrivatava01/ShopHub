import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isRentals = location.pathname === '/rentals';

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-900 font-sans">
      <Navbar />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      {!isRentals && <Footer />}
    </div>
  );
}
