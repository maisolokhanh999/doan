import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orderRes, productRes] = await Promise.all([
          fetch('http://localhost:5001/orders'),
          fetch('http://localhost:5001/products')
        ]);
        const orderData = await orderRes.json();
        const productData = await productRes.json();
        
        const totalRevenue = orderData.reduce((sum, order) => sum + order.totalPrice, 0);

        const dashboardMetrics = {
           totalOrders: orderData.length,
           ordersTrend: "+5.2%",
           totalRevenue: totalRevenue,
           revenueTrend: "+12.4%",
           totalProducts: productData.length,
           productsTrend: "+2"
        };
        
        setMetrics(dashboardMetrics);
        setOrders(orderData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="dashboard-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 500 }}>Đang tải Bảng điều khiển...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-canvas">
      <section className="welcome-section">
        <h3 className="welcome-title">{t('dashboard.welcome_title')}</h3>
        <p className="welcome-subtitle">
          {t('dashboard.welcome_subtitle')}
        </p>
      </section>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon-box icon-primary">
              <span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
            </div>
            <span className="metric-badge badge-tertiary">{metrics.ordersTrend}</span>
          </div>
          <p className="metric-label">{t('sidebar.orders', 'Đơn Hàng')}</p>
          <h4 className="metric-value">{metrics.totalOrders}</h4>
          <p className="metric-trend">Tăng trưởng so với tháng trước</p>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon-box icon-secondary">
              <span className="material-symbols-outlined" data-icon="payments">payments</span>
            </div>
            <span className="metric-badge badge-primary">{metrics.revenueTrend}</span>
          </div>
          <p className="metric-label">Doanh Thu Tổng</p>
          <h4 className="metric-value">${metrics.totalRevenue.toLocaleString()}</h4>
          <p className="metric-trend">Thanh toán hoàn tất</p>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon-box icon-tertiary">
              <span className="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
            </div>
            <span className="metric-badge badge-tertiary-alt">{metrics.productsTrend}</span>
          </div>
          <p className="metric-label">{t('sidebar.products', 'Sản Phẩm')}</p>
          <h4 className="metric-value">{metrics.totalProducts}</h4>
          <p className="metric-trend">Mặt hàng đang kinh doanh</p>
        </div>
      </section>

      <section className="appointments-section">
        <div className="appointments-header">
          <h3 className="section-title">Đơn hàng gần đây</h3>
          <a className="view-all-link" href="/admin/orders">
            {t('dashboard.appointments.view_all')} <span className="material-symbols-outlined link-icon"
              data-icon="arrow_forward">arrow_forward</span>
          </a>
        </div>
        <div className="table-container">
          <div className="table-responsive">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ngày Đặt</th>
                  <th>Khách Hàng</th>
                  <th>Số Lượng</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="time-col">#{order.id.toString().substring(0, 8)}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td className="client-col">{order.customer}</td>
                    <td>
                      <span className="service-name">{order.items.length} món</span>
                    </td>
                    <td>
                      <span className="font-semibold text-primary">${order.totalPrice.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                        {order.status === 'completed' ? 'Hoàn Thành' : 'Chờ Xử Lý'}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Chưa có đơn hàng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bento-secondary">
        <div className="promo-card">
          <img alt="Store environment" className="promo-bg"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" />
          <div className="promo-content">
            <span className="promo-badge">QUẢN LÝ</span>
            <h4 className="promo-title">Kho hàng & Đơn hàng</h4>
            <p className="promo-desc">Theo dõi sát sao dòng chảy hàng hóa và doanh thu của bạn.</p>
            <button className="promo-btn" onClick={() => window.location.href='/admin/products'}>Quản lý kho</button>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h4 className="chart-title">Phân tích Sản phẩm</h4>
            <span className="material-symbols-outlined chart-icon" data-icon="analytics">analytics</span>
          </div>
          <div className="chart-body">
            <div className="chart-row">
              <div className="chart-label-group">
                <span>Làm đẹp</span>
                <span>45%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-primary" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-label-group">
                <span>Chăm sóc da</span>
                <span>32%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-primary-container" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-label-group">
                <span>Nước hoa</span>
                <span>23%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-secondary-dim" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
