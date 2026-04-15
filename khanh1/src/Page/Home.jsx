

import Product from './Product';
import ServicePackage from './ServicePackage';

import './Home.css';
const Home = ({ products }) => {
    return (
        <div className="home-container">
            <Product products={products} />
            <ServicePackage />
        </div>
    );
};

export default Home;