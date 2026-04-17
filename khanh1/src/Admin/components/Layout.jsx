import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../admin.css';

const Layout = ({ products, setProducts }) => {
  return (
    <div className="app-container admin-dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <Outlet context={{ products, setProducts }} />
        <footer className="main-footer">
          © 2024 Velvet Bloom Digital Sanctuary. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default Layout;