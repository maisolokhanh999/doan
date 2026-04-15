import './App.css';
import { Route, Routes } from 'react-router';
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
function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.log(err));
  }, []);
  return (
    <div className="flex flex-col min-h-screen  ">
      <Header products={products} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/Product" element={<Product products={products} />} />
          <Route path="/ServicePackage" element={<ServicePackage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/product/:id" element={<ProductCostWrapper products={products} />} />
           <Route path="/ShoppingCart" element={<ShoppingCart />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
