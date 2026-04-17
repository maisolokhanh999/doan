import { useState, useEffect } from 'react';


const Orders = () => {
  // const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersData = () => {
      setLoading(true);
      fetch('http://localhost:5001/orders')
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error('Failed to fetch orders:', err))
        .finally(() => setLoading(false));
    };
    fetchOrdersData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const orderToUpdate = orders.find(o => o.id === id);
    if (!orderToUpdate) return;
    
    const updatedOrder = { ...orderToUpdate, status: newStatus };
    try {
      const res = await fetch(`http://localhost:5001/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? updatedOrder : o));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-canvas flex items-center justify-center min-h-[50vh]">
        <div className="text-primary font-medium">Đang tải đơn hàng...</div>
      </div>
    );
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, o) => o.status === 'completed' ? sum + o.totalPrice : sum, 0);

  return (
    <div className="dashboard-canvas">
      <section className="page-header" style={{ marginBottom: '2.5rem' }}>
        <div className="page-header-text">
          <span className="page-subtitle text-primary font-medium tracking-wide">Thương Mại & Bán Hàng</span>
          <h2 className="page-title text-4xl mt-1 mb-2">Quản Lý Đơn Hàng</h2>
          <p className="text-on-surface-variant max-w-2xl">Theo dõi và cập nhật trạng thái các đơn đặt hàng từ khách hàng ngoại tuyến.</p>
        </div>
      </section>

      <div className="staff-overview-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Tổng Đơn Hàng</p>
            <h3 className="stat-value text-3xl">{orders.length}</h3>
            <span className="stat-meta text-on-surface-variant mt-2 inline-block">Mọi trạng thái</span>
          </div>
          <div className="stat-icon-box bg-surface-container-high rounded-full p-4">
            <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
          </div>
        </div>
        <div className="stat-card border border-warning/20 bg-warning/5">
          <div className="stat-info">
            <p className="stat-label text-warning">Chờ Xử Lý</p>
            <h3 className="stat-value text-3xl text-warning">{pendingCount}</h3>
            <span className="stat-meta text-warning mt-2 inline-block">Cần giao hàng</span>
          </div>
          <div className="stat-icon-box bg-warning/20 rounded-full p-4">
            <span className="material-symbols-outlined text-warning text-3xl">pending_actions</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">Doanh Thu Đã Thu</p>
            <h3 className="stat-value text-3xl text-primary">${totalRevenue.toLocaleString()}</h3>
            <span className="stat-meta text-primary badge-surface mt-2 inline-block">{completedCount} đơn hoàn thành</span>
          </div>
          <div className="stat-icon-box bg-primary/10 rounded-full p-4">
            <span className="material-symbols-outlined text-primary text-3xl">payments</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, color: 'var(--on-surface)' }}>Danh Sách Đơn Hàng</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: 'var(--surface-container-lowest)', borderBottom: '1px solid var(--outline-variant)', fontSize: '13px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <tr>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Ngày Đặt</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Khách Hàng</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Chi Tiết Món</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Tổng Tiền</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Trạng Thái</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'center' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {orders.sort((a,b) => new Date(b.date) - new Date(a.date)).map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--outline-variant)', backgroundColor: order.status === 'completed' ? 'var(--surface-container-lowest)' : 'transparent' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 500, color: 'var(--on-surface-variant)' }}>#{order.id}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>{new Date(order.date).toLocaleString()}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--on-surface)' }}>{order.customer}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
                      {order.items.map(i => `${i.quantity}x ${i.title.substring(0, 15)}...`).join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--primary)' }}>${order.totalPrice.toLocaleString()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '13px', 
                      fontWeight: 500, 
                      backgroundColor: order.status === 'completed' ? 'rgba(56, 142, 60, 0.1)' : 'rgba(216, 67, 21, 0.1)', 
                      color: order.status === 'completed' ? 'var(--primary)' : 'var(--warning)', 
                      border: `1px solid ${order.status === 'completed' ? 'rgba(56, 142, 60, 0.3)' : 'rgba(216, 67, 21, 0.3)'}` 
                    }}>
                      {order.status === 'completed' ? 'Hoàn Thành' : 'Chờ Xử Lý'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                    {order.status === 'pending' ? (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="btn-primary" 
                        style={{ padding: '0.375rem 0.75rem', fontSize: '13px', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                         Duyệt
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, 'pending')}
                        style={{ padding: '0.375rem 0.75rem', fontSize: '13px', borderRadius: '0.5rem', border: '1px solid var(--outline)', backgroundColor: 'transparent', color: 'var(--on-surface-variant)', cursor: 'pointer' }}
                      >
                        Hoàn Tác
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span className="material-symbols-outlined text-outline mb-2" style={{ fontSize: '2.5rem' }}>inbox</span>
                      <p>Chưa có đơn hàng nào.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
