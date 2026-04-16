import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newSrv, setNewSrv] = useState({ title: '', description: '', category: 'facial', price: 0, duration: 60, image: '', status: 'published', badge: '' });

  useEffect(() => {
    fetch('http://localhost:5001/services')
      .then(res => res.json())
      .then(srvData => {
        setServices(srvData);
        setMetrics({
          activeCount: srvData.length,
          avgPrice: srvData.length > 0 ? Math.round(srvData.reduce((acc, s) => acc + s.price, 0) / srvData.length) : 0,
          categoriesCount: new Set(srvData.map(s => s.category)).size
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(t('services.confirm_delete', 'Are you sure you want to delete this service?'))) {
      try {
        await fetch(`http://localhost:5001/services/${id}`, { method: 'DELETE' });
        setServices(services.filter(s => s.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    const payload = { ...newSrv, id: `srv-${Date.now()}`, price: Number(newSrv.price), duration: Number(newSrv.duration) };
    try {
      const res = await fetch('http://localhost:5001/services', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (res.ok) {
        setServices([...services, await res.json()]);
        setIsAddModalOpen(false);
      }
    } catch(err) { console.error(err); }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const payload = { ...editingService, price: Number(editingService.price), duration: Number(editingService.duration) };
    try {
      const res = await fetch(`http://localhost:5001/services/${payload.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (res.ok) {
        const updated = await res.json();
        setServices(services.map(s => s.id === payload.id ? updated : s));
        setIsEditModalOpen(false);
      }
    } catch(err) { console.error(err); }
  };

  if (loading || !metrics) {
    return (
      <div className="dashboard-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 500 }}>Loading Services...</div>
      </div>
    );
  }


  const categoriesMap = {
    facial: services.filter(s => s.category === 'facial'),
    massage: services.filter(s => s.category === 'massage'),
    body: services.filter(s => s.category === 'body')
  };

  return (
    <div className="dashboard-canvas">
      <section className="page-header">
        <div className="page-header-text">
          <span className="page-subtitle">{t('services.page_subtitle')}</span>
          <h2 className="page-title">{t('services.page_title')}</h2>
        </div>
        <button onClick={() => { setNewSrv({ title: '', description: '', category: 'facial', price: 0, duration: 60, image: '', status: 'published', badge: '' }); setIsAddModalOpen(true); }} className="btn btn-primary btn-pill with-icon shadow-sm">
          <span className="material-symbols-outlined">add</span>
          {t('services.add_new')}
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">{t('services.stats.active')}</p>
            <h3 className="stat-value">{metrics.activeCount}</h3>
          </div>
          <div className="stat-icon-box bg-primary-light">
            <span className="material-symbols-outlined text-primary" data-icon="spa">spa</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">{t('services.stats.avg_price')}</p>
            <h3 className="stat-value">${metrics.avgPrice}</h3>
          </div>
          <div className="stat-icon-box bg-secondary-light">
            <span className="material-symbols-outlined text-secondary" data-icon="payments">payments</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">{t('services.stats.categories')}</p>
            <h3 className="stat-value">{metrics.categoriesCount}</h3>
          </div>
          <div className="stat-icon-box bg-tertiary-light">
            <span className="material-symbols-outlined text-tertiary" data-icon="category">category</span>
          </div>
        </div>
      </section>

      <div className="services-list">
        {Object.entries(categoriesMap).map(([category, items]) => {
          if (items.length === 0) return null;
          
          return (
            <section className="category-section" key={category}>
              <div className="category-header">
                <h4 className="category-title">{t(`services.categories.${category}`)}</h4>
                <div className="category-line"></div>
              </div>
              <div className="services-grid">
                {items.map(srv => (
                  <div className="service-card" key={srv.id}>
                    <div className="service-image-container">
                      <img alt={srv.title} className="service-image" src={srv.image} />
                      <div className={`service-actions ${srv.status === 'draft' ? 'z-20' : ''}`}>
                        <button onClick={() => { setEditingService(srv); setIsEditModalOpen(true); }} className="action-btn-circle" title="Edit">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onClick={() => handleDelete(srv.id)} className="action-btn-circle icon-error" title="Delete" style={{ color: 'var(--error)' }}>
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                        <button className={`action-btn-circle ${srv.status === 'draft' ? 'icon-muted' : 'icon-tertiary-color'}`}>
                          <span className="material-symbols-outlined text-sm"
                            style={srv.status !== 'draft' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                            {srv.status === 'draft' ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      {srv.status === 'draft' && (
                        <div className="service-overlay">
                          <span className="badge badge-inverse">{t('services.meta.draft')}</span>
                        </div>
                      )}
                    </div>
                    <div className={`service-info ${srv.status === 'draft' ? 'opacity-medium' : ''}`}>
                      <div className="service-title-row">
                        <h5 className="service-title">{srv.title}</h5>
                        <span className="service-price">${srv.price}</span>
                      </div>
                      <p className="service-desc">{srv.description}</p>
                      <div className="service-meta">
                        <div className="service-duration">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span className="duration-text">{srv.duration} {t('services.meta.duration')}</span>
                        </div>
                        {srv.badge && srv.badge !== 'draft' && (
                          <span className={`badge ${srv.badge === 'bestseller' ? 'badge-secondary' : 'badge-surface'}`}>
                            {t(`services.meta.${srv.badge}`)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </section>
          );
        })}
      </div>

      <div className="page-footer-actions">
        <p className="footer-meta-text">{t('services.footer.text')}</p>
        <div className="footer-buttons">
          <button className="btn-text">{t('services.footer.export')}</button>
          <button className="btn-text">{t('services.footer.bulk')}</button>
        </div>
      </div>

      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '450px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--on-surface)', fontWeight: 600 }}>{t('services.add_new', 'Thêm Dịch Vụ Mới')}</h3>
            <form onSubmit={submitAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required value={newSrv.title} onChange={e => setNewSrv({...newSrv, title: e.target.value})} placeholder={t('services.form.title', 'Tên Dịch Vụ')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <textarea required value={newSrv.description} onChange={e => setNewSrv({...newSrv, description: e.target.value})} placeholder={t('services.form.desc', 'Mô tả')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <input value={newSrv.image} onChange={e => setNewSrv({...newSrv, image: e.target.value})} placeholder={t('services.form.image', 'URL Ảnh')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required type="number" min="0" value={newSrv.price} onChange={e => setNewSrv({...newSrv, price: e.target.value})} placeholder={t('services.form.price', 'Giá ($)')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }} />
                <input required type="number" min="0" value={newSrv.duration} onChange={e => setNewSrv({...newSrv, duration: e.target.value})} placeholder={t('services.form.duration', 'Phút')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select value={newSrv.category} onChange={e => setNewSrv({...newSrv, category: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }}>
                  <option value="facial">{t('services.categories.facial')}</option>
                  <option value="massage">{t('services.categories.massage')}</option>
                  <option value="body">{t('services.categories.body')}</option>
                </select>
                <select value={newSrv.status} onChange={e => setNewSrv({...newSrv, status: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <input value={newSrv.badge} onChange={e => setNewSrv({...newSrv, badge: e.target.value})} placeholder={t('services.form.badge', 'Badge (e.g. bestseller)')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--outline)', borderRadius: '0.5rem', color: 'var(--on-surface)' }}>{t('services.form.cancel', 'Hủy')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}>{t('services.form.add_btn', 'Thêm')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingService && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '450px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--on-surface)', fontWeight: 600 }}>{t('services.edit_service', 'Sửa Dịch Vụ')}</h3>
            <form onSubmit={submitEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} placeholder={t('services.form.title', 'Tên Dịch Vụ')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }} />
              <textarea required value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} placeholder={t('services.form.desc', 'Mô tả')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }} />
              <input value={editingService.image} onChange={e => setEditingService({...editingService, image: e.target.value})} placeholder={t('services.form.image', 'URL Ảnh')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required type="number" min="0" value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} placeholder={t('services.form.price', 'Giá')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }} />
                <input required type="number" min="0" value={editingService.duration} onChange={e => setEditingService({...editingService, duration: e.target.value})} placeholder={t('services.form.duration', 'Phút')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select value={editingService.category} onChange={e => setEditingService({...editingService, category: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }}>
                  <option value="facial">{t('services.categories.facial')}</option>
                  <option value="massage">{t('services.categories.massage')}</option>
                  <option value="body">{t('services.categories.body')}</option>
                </select>
                <select value={editingService.status} onChange={e => setEditingService({...editingService, status: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)' }}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <input value={editingService.badge} onChange={e => setEditingService({...editingService, badge: e.target.value})} placeholder={t('services.form.badge', 'Badge (e.g. bestseller)')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--outline)', borderRadius: '0.5rem', color: 'var(--on-surface)' }}>{t('services.form.cancel', 'Hủy')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}>{t('services.form.save_btn', 'Lưu')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
