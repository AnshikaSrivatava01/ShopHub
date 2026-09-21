import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shophub_cart') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('shophub_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, type = 'sale', quantity = 1, rentalDuration = 1, rentalUnit = 'day', size = '') => {
    setItems(prev => {
      const normalizedSize = String(size || '').trim();
      const key = `${product._id}-${type}-${rentalUnit}-${normalizedSize || 'nosize'}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        key,
        product,
        size: normalizedSize,
        type,
        quantity,
        rentalDuration: type === 'rent' ? rentalDuration : 0,
        rentalUnit: type === 'rent' ? rentalUnit : '',
      }];
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeItem(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const updateRentalDuration = (key, rentalDuration) => {
    setItems(prev => prev.map(i => i.key === key ? { ...i, rentalDuration: Math.max(1, rentalDuration) } : i));
  };

  const removeItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const clearCart = () => setItems([]);

  const getItemPrice = (item) => {
    const baseSale = item.product.salePrice || item.product.price || 0;
    if (item.type === 'sale') return baseSale * item.quantity;
    
    const day = item.product.rentPricePerDay || item.product.price || 0;
    const week = item.product.rentPricePerWeek || day * 7;
    const month = item.product.rentPricePerMonth || day * 30;
    const unitPrices = { day, week, month };
    
    return (unitPrices[item.rentalUnit] || 0) * item.rentalDuration * item.quantity;
  };

  const cartSubtotal = items.reduce((sum, item) => sum + getItemPrice(item), 0);
  const securityDeposit = items.reduce((sum, item) => sum + (item.type === 'rent' ? 1000 * item.quantity : 0), 0);
  const totalPrice = cartSubtotal + securityDeposit;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, updateRentalDuration, removeItem, clearCart, getItemPrice, cartSubtotal, securityDeposit, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}
