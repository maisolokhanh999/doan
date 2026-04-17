import { useEffect, useMemo, useReducer } from 'react';
import { cartReducer } from './cartReducer';
import { CartContext } from './CartContext';



export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const value = useMemo(() => {
    const addToCart = (product, quantity = 0) => {
      const qty = Number.isFinite(quantity) ? quantity : parseInt(quantity, 10) || 1;
      if (qty <= 0) return; // 🔥 không thêm nếu = 0

      dispatch({
        type: 'ADD_ITEM',
        payload: { ...product, quantity: qty },
      });
    };

    const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    const increaseQuantity = (id) => {
      const item = cart.find(i => i.id === id);
      if (item) {
        dispatch({
          type: 'SET_QUANTITY',
          payload: { id, quantity: item.quantity + 1 },
        });
      }
    };

    const decreaseQuantity = (id) => {
      const item = cart.find(i => i.id === id);
      if (item) {
        dispatch({
          type: 'SET_QUANTITY',
          payload: { id, quantity: item.quantity - 1 },
        });
      }
    };

    const setQuantity = (id, quantity) =>
      dispatch({ type: 'SET_QUANTITY', payload: { id, quantity } });

    const clearCart = () => dispatch({ type: 'CLEAR_CART' });
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { cart, dispatch, addToCart, removeFromCart, setQuantity, clearCart, increaseQuantity, decreaseQuantity, totalQuantity };
  }, [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
