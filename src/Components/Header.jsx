import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import SearchBar from './InPut.jsx';
import ProductCost from './ProductCost.jsx';
import { useState } from 'react';
const Header = ({ products }) => {
    const navigate = useNavigate();
    const { totalQuantity, } = useCart();
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
                                Trang Chủ
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
            <header className="bg-primary-light py-4 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                    <nav>
                        <ul className="flex space-x-4 gap-5">
                            <li><NavLink to="/">Trang Chủ</NavLink></li>
                            <li><NavLink to="/Product">Sản Phẩm</NavLink></li>
                            <li><NavLink to="/ServicePackage">Gói Dịch Vụ</NavLink></li>
                            {localStorage.getItem('token') ? (
                                <li>
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        navigate('/Login');
                                    }}>Đăng Xuất ({JSON.parse(localStorage.getItem('user') || '{}').name || 'Người dùng'})</a>
                                </li>
                            ) : (
                                <li><NavLink to="/Login">Đăng Nhập</NavLink></li>
                            )}
                        </ul>
                    </nav>

                    <div className="w-64">
                        <SearchBar products={products} onSelect={handleSelect} />
                    </div>

                    <div className="relative">
                        <div
                            className="cursor-pointer text-xl relative"
                            onClick={() => navigate("/ShoppingCart")}
                        >
                            🛒
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {totalQuantity}
                                </span>
                            )}
                        </div>
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
