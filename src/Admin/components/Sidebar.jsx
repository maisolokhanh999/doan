import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-brand">
        <h1 className="brand-title">{t('sidebar.brand_title')}</h1>
        <p className="brand-subtitle">{t('sidebar.brand_subtitle')}</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <span className="material-symbols-outlined nav-icon" data-icon="dashboard">dashboard</span>
          <span className="nav-text">{t('sidebar.dashboard')}</span>
        </NavLink>
        {/* <NavLink to="/admin/appointments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined nav-icon" data-icon="calendar_month">calendar_month</span>
          <span className="nav-text">{t('sidebar.appointments')}</span>
        </NavLink> */}
        <NavLink to="/admin/services" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined nav-icon" data-icon="spa">spa</span>
          <span className="nav-text">{t('sidebar.services')}</span>
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined nav-icon" data-icon="inventory_2">inventory_2</span>
          <span className="nav-text">{t('sidebar.products')}</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined nav-icon" data-icon="receipt_long">receipt_long</span>
          <span className="nav-text">{t('sidebar.orders')}</span>
        </NavLink>
        {/* <NavLink to="/admin/staff" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined nav-icon" data-icon="group">group</span>
          <span className="nav-text">{t('sidebar.staff')}</span>
        </NavLink> */}
      </nav>
      {/* <div className="sidebar-action">
        <button className="btn btn-primary btn-block">
          {t('sidebar.book_appointment')}
        </button>
      </div> */}
      <div className="sidebar-footer">
        <a className="footer-link" href="#">
          <span className="material-symbols-outlined" data-icon="help">help</span>
          <span className="footer-text">{t('sidebar.help_center')}</span>
        </a>
        <a className="footer-link" href="#" onClick={handleLogout}>
          <span className="material-symbols-outlined" data-icon="logout">logout</span>
          <span className="footer-text">{t('sidebar.sign_out')}</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
