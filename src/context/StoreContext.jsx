import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export const FREE_SHIPPING_FROM = 1000000;
export const SHIPPING_FEE = 30000;

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('luxe_cart')) || [];
  } catch {
    return [];
  }
};

// Gộp giỏ hàng, đăng nhập và thông báo toast vào một context cho gọn
export function StoreProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!localStorage.getItem('luxe_token')) {
      setAuthReady(true);
      return;
    }
    api('/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('luxe_token'))
      .finally(() => setAuthReady(true));
  }, []);

  const toast = useCallback((message, type = 'success') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback((product, { size = null, quantity = 1 } = {}) => {
    const key = `${product.id}-${size || ''}`;
    setCart((items) => {
      const found = items.find((i) => i.key === key);
      if (found) return items.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i));
      return [
        ...items,
        {
          key,
          product_id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image_url,
          stock: product.stock,
          color: product.color,
          size,
          quantity,
        },
      ];
    });
    setCartOpen(true);
  }, []);

  const updateQty = (key, quantity) =>
    setCart((items) =>
      items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 99)) } : i))
    );
  const removeFromCart = (key) => setCart((items) => items.filter((i) => i.key !== key));
  const clearCart = () => setCart([]);

  const login = (token, user) => {
    localStorage.setItem('luxe_token', token);
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem('luxe_token');
    setUser(null);
    toast('Đã đăng xuất');
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    return { subtotal, count, shipping, total: subtotal + shipping };
  }, [cart]);

  const value = {
    cart, totals, cartOpen, setCartOpen, addToCart, updateQty, removeFromCart, clearCart,
    user, authReady, login, logout, toast, toasts,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
