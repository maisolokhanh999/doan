import { NavLink } from 'react-router';
import { useCart } from './CartContext.jsx';
import { Input } from 'antd';
import SearchBar from './InPut.jsx';
import ProductCost from './ProductCost.jsx';
import { useState } from 'react';
import ShoppingCart from './ShoppingCart.jsx';
const Header = ({ products }) => {
    const { totalQuantity, } = useCart();
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

                    <div className="relative">
                        <div
                            className="cursor-pointer text-xl"
                            onClick={() => setOpenCart(!openCart)}
                        >
                            🛒
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {totalQuantity}
                                </span>
                            )}
                        </div>

                        {/* DROPDOWN CART */}
                        {openCart && (
                            <div className="absolute right-0 mt-3 w-[400px] bg-white shadow-lg rounded-lg p-3 z-50">
                                <ShoppingCart />
                            </div>
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
