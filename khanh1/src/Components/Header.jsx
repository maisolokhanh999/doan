import { NavLink } from 'react-router';
import { Input } from 'antd';
import SearchBar from './InPut.jsx';
import { useCart } from './CartContext.jsx';
import ProductCost from './ProductCost.jsx';
import { useState } from 'react';
const Header = ({ products }) => {
    const product = products;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const handleSelect = (product) => {
        setSelectedProduct(product);
    };
    if (selectedProduct) {
        return (
            <ProductCost
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
            />
        );
    }
    return (
        <header className="bg-amber-200 py-4">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                <nav>
                    <ul className="flex space-x-4 gap-5">
                        <li><NavLink to="/" className="text-gray-600 hover:text-gray-800">Home</NavLink></li>
                        <li><NavLink to="/Product" className="text-gray-600 hover:text-gray-800">Product</NavLink></li>
                        <li><NavLink to="/ServicePackage" className="text-gray-600 hover:text-gray-800">ServicePackage</NavLink></li>
                        <li><NavLink to="/Login" className="text-gray-600 hover:text-gray-800">Login</NavLink></li>
                    </ul>
                </nav>
                <div className="w-64">
                    <SearchBar products={product} onSelect={handleSelect} />
                </div>
            </div>
        </header>
    );
}

export default Header;
