import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [aptRes, staffRes, srvRes] = await Promise.all([
          fetch('http://localhost:5001/appointments'),
          fetch('http://localhost:5001/staff'),
          fetch('http://localhost:5001/services')
        ]);
        const aptData = await aptRes.json();
        const staffData = await staffRes.json();
        const srvData = await srvRes.json();
        
        let monthlyRevenue = 0;
        aptData.forEach(apt => {
           const service = srvData.find(s => s.title === apt.serviceName);
           if (service) monthlyRevenue += service.price;
        });

        const dashboardMetrics = {
           totalAppointments: aptData.length,
           appointmentsTrend: "+12%",
           monthlyRevenue: monthlyRevenue > 0 ? monthlyRevenue : 24850,
           revenueTrend: "+8.4%",
           newCustomers: aptData.filter(a => a.clientType === 'new' || a.clientType === 'first_time').length,
           customersTrend: "+5"
        };
        
        setMetrics(dashboardMetrics);
        setAppointments(aptData);
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
              <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
            </div>
            <span className="metric-badge badge-tertiary">{metrics.appointmentsTrend}</span>
          </div>
          <p className="metric-label">{t('dashboard.metrics.total_appointments')}</p>
          <h4 className="metric-value">{metrics.totalAppointments}</h4>
          <p className="metric-trend">{t('dashboard.metrics.appointments_trend')}</p>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon-box icon-secondary">
              <span className="material-symbols-outlined" data-icon="payments">payments</span>
            </div>
            <span className="metric-badge badge-primary">{metrics.revenueTrend}</span>
          </div>
          <p className="metric-label">{t('dashboard.metrics.monthly_revenue')}</p>
          <h4 className="metric-value">${metrics.monthlyRevenue.toLocaleString()}</h4>
          <p className="metric-trend">{t('dashboard.metrics.revenue_trend')}</p>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon-box icon-tertiary">
              <span className="material-symbols-outlined" data-icon="person_add">person_add</span>
            </div>
            <span className="metric-badge badge-tertiary-alt">{metrics.customersTrend}</span>
          </div>
          <p className="metric-label">{t('dashboard.metrics.new_customers')}</p>
          <h4 className="metric-value">{metrics.newCustomers}</h4>
          <p className="metric-trend">{t('dashboard.metrics.customers_trend')}</p>
        </div>
      </section>

      <section className="appointments-section">
        <div className="appointments-header">
          <h3 className="section-title">{t('dashboard.appointments.title')}</h3>
          <a className="view-all-link" href="#">
            {t('dashboard.appointments.view_all')} <span className="material-symbols-outlined link-icon"
              data-icon="arrow_forward">arrow_forward</span>
          </a>
        </div>
        <div className="table-container">
          <div className="table-responsive">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>{t('dashboard.appointments.cols.time')}</th>
                  <th>{t('dashboard.appointments.cols.client')}</th>
                  <th>{t('dashboard.appointments.cols.service')}</th>
                  <th>{t('dashboard.appointments.cols.staff')}</th>
                  <th>{t('dashboard.appointments.cols.status')}</th>
                  <th className="text-right">{t('dashboard.appointments.cols.action')}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 4).map((apt) => (
                  <tr key={apt.id}>
                    <td className="time-col">{apt.time}</td>
                    <td className="client-col">{apt.clientName}</td>
                    <td>
                      <span className="service-name">{apt.serviceName}</span>
                    </td>
                    <td>
                      <div className="staff-info">
                        {apt.specialistAvatar ? (
                          <img src={apt.specialistAvatar} alt={apt.specialistName} className="w-8 h-8 rounded-full object-cover shadow-sm mr-2 border border-outline-variant" />
                        ) : (
                          <div className="staff-avatar avatar-secondary">{apt.specialistName.substring(0, 2).toUpperCase()}</div>
                        )}
                        <span className="staff-name">{apt.specialistName}</span>
                      </div>
                    </td>
                    <td>
                      {apt.status === 'confirmed' && <span className="status-badge status-confirmed">{t('dashboard.appointments.status_confirmed')}</span>}
                      {apt.status === 'pending' && <span className="status-badge status-pending">{t('dashboard.appointments.status_pending')}</span>}
                      {apt.status === 'completed' && <span className="status-badge status-completed">{t('dashboard.appointments.status_completed')}</span>}
                    </td>
                    <td className="action-col text-right">
                      <button className="action-btn">
                        <span className="material-symbols-outlined"
                          data-icon="more_vert">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bento-secondary">
        <div className="promo-card">
          <img alt="Spa environment" className="promo-bg"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyb-IueenLphJ8Bf-9NEy_-K1dzVvRgAMqazJpdhp_gD0XUcazQ2Sov6zCBccMxfQT0V7PWs80Y6p2fxBfXURZeKgDhjdO9GagG_KMV1APJZHopUAoMnQGiQuycBaRSDEwAHd-VJdM2Jm1Y3RDrGFHiBQMauEt97YmveGxkApR4u_Po7SsYgJXir3R8c8SQxHrOY0gaHLz851Ot5MSREzL_WyfuF21xNx7mfjCGBoR_ub5Kv0vaQqXPb-zIJtFGQ-gMGOWbQ2ozj0G" />
          <div className="promo-content">
            <span className="promo-badge">{t('dashboard.promo.badge')}</span>
            <h4 className="promo-title">{t('dashboard.promo.title')}</h4>
            <p className="promo-desc">{t('dashboard.promo.desc')}</p>
            <button className="promo-btn">{t('dashboard.promo.btn')}</button>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h4 className="chart-title">{t('dashboard.charts.title')}</h4>
            <span className="material-symbols-outlined chart-icon" data-icon="analytics">analytics</span>
          </div>
          <div className="chart-body">
            <div className="chart-row">
              <div className="chart-label-group">
                <span>{t('dashboard.charts.massage')}</span>
                <span>45%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-primary" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-label-group">
                <span>{t('dashboard.charts.facial')}</span>
                <span>32%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill fill-primary-container" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-label-group">
                <span>{t('dashboard.charts.stone')}</span>
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
