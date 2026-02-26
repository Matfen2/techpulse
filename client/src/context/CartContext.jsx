import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('techpulse_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('techpulse_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (listing) => {
    setCartItems((prev) => {
      if (prev.find((item) => item._id === listing._id)) return prev;
      return [...prev, listing];
    });
  };

  const removeFromCart = (listingId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== listingId));
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (listingId) => cartItems.some((item) => item._id === listingId);

  const cartCount = cartItems.length;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const buyerProtection = cartItems.length > 0 ? 2.99 : 0;
  const serviceFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + buyerProtection + serviceFee) * 100) / 100;

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, clearCart,
      isInCart, cartCount, subtotal, buyerProtection, serviceFee, total,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);