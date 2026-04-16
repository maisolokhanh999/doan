import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Staff = () => {
  const { t } = useTranslation();
  const [staff, setStaff] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    skills: '',
    avatar: '',
    shift: 'off'
  });

  const handleInputChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleToggleShift = async (member) => {
    const shifts = ['on', 'break', 'off'];
    const nextShift = shifts[(shifts.indexOf(member.shift) + 1) % shifts.length];
    
    try {
      const res = await fetch(`http://localhost:5000/staff/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shift: nextShift })
      });
      if (res.ok) {
        setStaff(staff.map(s => s.id === member.id ? { ...s, shift: nextShift } : s));
      }
    } catch(err) { console.error(err); }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm(t('staff.confirm_delete', 'Are you sure you want to remove this staff member?'))) {
      try {
        await fetch(`http://localhost:5000/staff/${id}`, { method: 'DELETE' });
        setStaff(staff.filter(s => s.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    const newId = 'stf-' + Date.now();
    const parsedSkills = newStaff.skills.split(',').map(s => s.trim()).filter(s => s);
    
    const staffData = {
      id: newId,
      name: newStaff.name,
      role: newStaff.role,
      skills: parsedSkills,
      avatar: newStaff.avatar || '/img/image.jpg',
      shift: newStaff.shift
    };
    
    try {
      const res = await fetch('http://localhost:5000/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData)
      });
      if(res.ok) {
        const addedStaff = await res.json();
        setStaff(prev => [...prev, addedStaff]);
        setIsModalOpen(false);
        setNewStaff({ name: '', role: '', skills: '', avatar: '', shift: 'off' });
      }
    } catch(err) {
      console.error('Error adding staff', err);
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/staff')
      .then(res => res.json())
      .then(stfData => {
        setStaff(stfData);
        setMetrics({
          activeSpecialists: stfData.length,
          teamRating: 4.9,
          onShiftToday: stfData.filter(s => s.shift === 'on').length
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="dashboard-canvas flex items-center justify-center min-h-[50vh]">
        <div className="text-primary font-medium">Loading Staff...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-canvas">
      <section className="page-header mb-8">
        <div className="page-header-text">
          <span className="page-subtitle text-primary font-medium tracking-wide">{t('staff.page_title')}</span>
          <h2 className="page-title text-4xl mt-1 mb-2">Velvet Specialists</h2>
          <p className="text-on-surface-variant max-w-2xl">{t('staff.page_subtitle')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary btn-pill shadow-sm flex items-center gap-2 px-4 py-2"
        >
          <span className="material-symbols-outlined pb-1">person_add</span>
          {t('staff.add_member')}
        </button>
      </section>

      <div className="staff-overview-grid mb-10">
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">{t('staff.stats.active')}</p>
            <h3 className="stat-value text-3xl">{metrics.activeSpecialists}</h3>
            <span className="stat-meta text-primary badge-surface mt-2 inline-block">{t('staff.stats.active_meta')}</span>
          </div>
          <div className="stat-icon-box bg-surface-container-high rounded-full p-4">
            <span className="material-symbols-outlined text-on-surface text-3xl" data-icon="groups">groups</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">{t('staff.stats.rating')}</p>
            <h3 className="stat-value text-3xl flex items-center gap-2">{metrics.teamRating} <span
              className="text-tertiary text-xl">★</span></h3>
            <span className="stat-meta text-on-surface-variant mt-2 inline-block">Based on 1,204 reviews</span>
          </div>
          <div className="stat-icon-box bg-surface-container-high rounded-full p-4">
            <span className="material-symbols-outlined text-tertiary text-3xl" data-icon="star_rate">star_rate</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <p className="stat-label">{t('staff.stats.on_shift')}</p>
            <h3 className="stat-value text-3xl">0{metrics.onShiftToday}</h3>
            <span className="stat-meta text-on-surface-variant mt-2 inline-block">4 arriving at 12:00 PM</span>
          </div>
          <div className="stat-icon-box bg-surface-container-high rounded-full p-4">
            <span className="material-symbols-outlined text-secondary text-3xl"
              data-icon="schedule">schedule</span>
          </div>
        </div>
      </div>

      <div className="staff-content-layout">
        <div className="staff-directory-section">
          <div className="directory-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h3 className="text-2xl font-semibold" style={{ fontSize: '1.5rem', fontWeight: 600 }}>{t('staff.directory.title')}</h3>
            <div className="directory-filters" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="filter-chip active">{t('staff.directory.filter_all')}</button>
              <button className="filter-chip">{t('staff.directory.filter_therapists')}</button>
              <button className="filter-chip">{t('staff.directory.filter_technicians')}</button>
            </div>
          </div>

          <div className="staff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {staff.map((member) => (
              <div key={member.id} className={`staff-card border border-outline-variant rounded-2xl p-5 bg-surface hover-bg-surface-container-lowest transition-colors relative overflow-visible group ${member.shift === 'off' ? 'opacity-80 backdrop-grayscale-[0.5]' : ''}`}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 20 }}>
                  <button onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)} className="icon-btn-small bg-surface-container blur-bg w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
                  </button>
                  {activeDropdown === member.id && (
                    <div style={{ position: 'absolute', top: '2.5rem', right: 0, backgroundColor: 'var(--surface)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', padding: '0.5rem 0', zIndex: 50, border: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', minWidth: '140px' }}>
                      <button onClick={() => { handleDeleteStaff(member.id); setActiveDropdown(null); }} style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--error)', fontSize: '0.875rem', fontWeight: 500, width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'transparent', border: 'none' }}>
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="relative mb-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => handleToggleShift(member)} title={t('staff.card.click_to_shift', 'Click to toggle shift')}>
                    <img alt={member.name} className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-sm" src={member.avatar} />
                    <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-surface ${member.shift === 'on' ? 'bg-primary' : member.shift === 'break' ? 'bg-secondary' : 'bg-outline'}`} 
                          title={member.shift === 'on' ? t('staff.card.shift_on') : member.shift === 'break' ? t('staff.card.shift_break') : t('staff.card.shift_off')}>
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.25rem' }}>{member.name}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 500, marginBottom: '0.75rem' }}>{member.role}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {member.skills.map((skill, index) => (
                      <span key={index} className="badge-surface" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>{skill}</span>
                    ))}
                  </div>
                  <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--outline-variant)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <button className="btn-text text-sm py-2">{t('staff.card.see_schedule')}</button>
                    <button className="btn-outline-primary py-2 text-sm rounded-lg" disabled={member.shift === 'off'}>
                      {member.shift === 'off' ? t('staff.card.shift_off') : t('staff.card.details')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-outline-secondary btn-pill" style={{ padding: '0.5rem 2rem', fontWeight: 500 }}>Load More Staff</button>
          </div>
        </div>

        <aside className="staff-insights-sidebar" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '20rem' }}>
          <div className="performance-card rounded-2xl p-6 relative overflow-hidden text-surface">
            <div className="absolute inset-0 bg-primary opacity-90 z-0"></div>
            <img alt="Leaves pattern" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay z-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyb-IueenLphJ8Bf-9NEy_-K1dzVvRgAMqazJpdhp_gD0XUcazQ2Sov6zCBccMxfQT0V7PWs80Y6p2fxBfXURZeKgDhjdO9GagG_KMV1APJZHopUAoMnQGiQuycBaRSDEwAHd-VJdM2Jm1Y3RDrGFHiBQMauEt97YmveGxkApR4u_Po7SsYgJXir3R8c8SQxHrOY0gaHLz851Ot5MSREzL_WyfuF21xNx7mfjCGBoR_ub5Kv0vaQqXPb-zIJtFGQ-gMGOWbQ2ozj0G" />
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2">{t('staff.performance.title')}</h3>
              <p className="text-surface-container opacity-80 text-sm mb-6">{t('staff.performance.desc')}</p>

              <div className="bg-surface text-on-surface rounded-xl p-4 mb-4 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-tertiary">{t('staff.performance.star_performer')}</span>
                  <span className="material-symbols-outlined text-tertiary">workspace_premium</span>
                </div>
                <div className="flex items-center gap-3">
                  <img alt="Elena M." className="w-12 h-12 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaG2O-rXm7t_y9rZ5m1_Y-Qp-zGzE_W8sXN_B-_JkZ17y796nQ960K36mZ_eU1gU91v-4nS37vF79t00jA1h4x-_-_E-qA3D1sFv9W5r7E_A9m-B6n7-W9g0v0-_G0y-_R5W6bNXZbK5z17_E_-8y_-W09_E0R-O7v0F7zC8W6yE8_eF_-4y9Ww1V8e7K4V5L7H1Q2K_" />
                  <div>
                    <h5 className="font-semibold text-lg leading-tight">Elena M.</h5>
                    <p className="text-xs text-on-surface-variant">{t('staff.performance.star_bookings')}</p>
                  </div>
                </div>
              </div>

              <div className="gap-2 flex flex-col pt-2">
                <div className="flex justify-between text-sm">
                  <span>{t('staff.performance.efficiency')}</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 opacity-50">
                  <div className="bg-surface h-1.5 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <button className="w-full mt-6 py-3 border border-surface text-surface rounded-xl hover:bg-surface hover:text-primary transition-colors font-medium">
                {t('staff.performance.view_data')}
              </button>
            </div>
          </div>
        </aside>
      </div>
      {/* Add Staff Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--on-surface)', fontWeight: 600 }}>{t('staff.add_member')}</h3>
            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required name="name" value={newStaff.name} onChange={handleInputChange} placeholder={t('staff.form.name')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <input required name="role" value={newStaff.role} onChange={handleInputChange} placeholder={t('staff.form.role')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <input name="skills" value={newStaff.skills} onChange={handleInputChange} placeholder={t('staff.form.skills')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <input name="avatar" value={newStaff.avatar} onChange={handleInputChange} placeholder={t('staff.form.avatar')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              <select name="shift" value={newStaff.shift} onChange={handleInputChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }}>
                <option value="on">{t('staff.form.shift_on')}</option>
                <option value="off">{t('staff.form.shift_off')}</option>
                <option value="break">{t('staff.form.shift_break')}</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--outline)', borderRadius: '0.5rem', color: 'var(--on-surface)' }}>{t('staff.form.cancel')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}>{t('staff.form.add_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
