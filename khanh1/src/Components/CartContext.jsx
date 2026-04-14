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
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
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
      dispatch({
        type: 'ADD_ITEM',
        payload: { ...product, quantity: Math.max(1, qty) },
      });
    };

    const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });

    const setQuantity = (id, quantity) =>
      dispatch({ type: 'SET_QUANTITY', payload: { id, quantity } });

    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    return { cart, dispatch, addToCart, removeFromCart, setQuantity, clearCart };
  }, [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
