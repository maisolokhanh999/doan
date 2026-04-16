import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import App from './App.jsx'
import './index.css';
<<<<<<< HEAD
=======
import './Admin/i18n';
>>>>>>> a68659edddd68b2900b60e8bc119f559abc8694a
import { CartProvider } from './Components/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>,
)