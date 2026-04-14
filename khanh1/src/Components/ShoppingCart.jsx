import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 🛒 thêm sản phẩm
  const addToCart = (product) => {
    const exist = cart.find(item => item.id === product.id);

    if (exist) {
      // nếu đã có → tăng số lượng
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // nếu chưa có → thêm mới
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // ❌ xoá sản phẩm
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // ➕ ➖ tăng giảm số lượng
  const updateQuantity = (id, type) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        if (type === "inc") {
          return { ...item, quantity: item.quantity + 1 };
        }
        if (type === "dec" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    }));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
export const useCart = () => useContext(CartContext);