import { NavLink } from 'react-router';
import { useCart } from './CartContext.jsx';
import { Input } from 'antd';
import SearchBar from './InPut.jsx';
import ProductCost from './ProductCost.jsx';
import { useState } from 'react';
const Header = ({ products }) => {
    const { cart, totalQuantity, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const [openCart, setOpenCart] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const handleSelect = (product) => {
        setSelectedProduct(product);
    };
    if (selectedProduct) {
        return (
            <>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/" className="text-gray-600 hover:text-gray-800">
                                Home
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <ProductCost
                    product={selectedProduct}
                    onBack={() => setSelectedProduct(null)}
                />
            </>
        );
    }
    return (
        <>
            <header className="bg-amber-200 py-4">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                    <nav>
                        <ul className="flex space-x-4 gap-5">
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/Product">Product</NavLink></li>
                            <li><NavLink to="/ServicePackage">ServicePackage</NavLink></li>
                            <li><NavLink to="/Login">Login</NavLink></li>
                        </ul>
                    </nav>

                    <div className="w-64">
                        <SearchBar products={products} onSelect={handleSelect} />
                    </div>

                    {/* 🛒 CART */}
                    <div
                        className="relative cursor-pointer"
                        onClick={() => setOpenCart(!openCart)}
                    >
                        🛒
                        {totalQuantity > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {totalQuantity}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* 🔥 HIỂN THỊ CHI TIẾT */}
            {selectedProduct && (
                <ProductCost
                    product={selectedProduct}
                    onBack={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}

export default Header;
