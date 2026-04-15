import './App.css';
import { Route, Routes, Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Page/Home';
import Product from './Page/Product';
import ServicePackage from './Page/ServicePackage';
import Login from './Components/Login';
import NotFound from './Page/NotFound';
import SignUp from './Components/SignUp';
import { useState, useEffect } from 'react';
import ProductCostWrapper from './Components/ProductCostWrapper';
import ShoppingCart from './Components/ShoppingCart.jsx';
import ProtectedRoute from './Components/ProtectedRoute';

import AdminLayout from './Admin/components/Layout';
import Dashboard from './Admin/pages/Dashboard';
import Appointments from './Admin/pages/Appointments';
import AdminServices from './Admin/pages/Services';
import AdminProducts from './Admin/pages/Products';
import AdminOrders from './Admin/pages/Orders';
import Staff from './Admin/pages/Staff';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.log(err));
  }, []);
  return (
    <Routes>
      {/* Client Routes */}
      <Route
        path="/"
        element={
          <div className="flex flex-col min-h-screen">
            <Header products={products} />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        }
      >
        <Route index element={<Home products={products} />} />
        <Route path="Product" element={<Product products={products} />} />
        <Route path="ServicePackage" element={<ServicePackage />} />
        <Route path="Login" element={<Login />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="product/:id" element={<ProductCostWrapper products={products} />} />
        <Route path="ShoppingCart" element={<ShoppingCart />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout products={products} setProducts={setProducts} /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="staff" element={<Staff />} />
      </Route>
    </Routes>
  );
}

export default App;
