import { NavLink } from 'react-router';
import { Input } from 'antd';
const Header = () => {
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
                    <Input placeholder="Search..." />
                </div>
            </div>
        </header>
    );
}

export default Header;
