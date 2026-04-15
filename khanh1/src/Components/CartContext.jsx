import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext();

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingIndex = state.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        return state.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);
    case 'SET_QUANTITY':
      return state
        .map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

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
