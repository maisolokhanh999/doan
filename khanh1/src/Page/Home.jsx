

import Product from './Product';
import ServicePackage from './ServicePackage';

import './Home.css';
const Home = () => {
    return (
        <div className="home-container">
          <Product />
          <ServicePackage />
        </div>
    );
};

export default Home;