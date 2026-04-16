import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Appointments = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);


  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();

    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  });
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff);
  });
  const [isAddAptModalOpen, setIsAddAptModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({
    date: selectedDate,
    time: '',
    duration: 60,
    clientName: '',
    clientType: 'new',
    serviceName: '',
    specialistName: '',
    specialistAvatar: '/img/image.jpg',
    status: 'pending'
  });

  const handleAptInputChange = (e) => {
    setNewApt({ ...newApt, [e.target.name]: e.target.value });
  };

  const handleToggleStatus = async (apt) => {
    const statuses = ['pending', 'confirmed', 'completed'];
    const nextStatusIndex = (statuses.indexOf(apt.status) + 1) % statuses.length;
    const nextStatus = statuses[nextStatusIndex];

    try {
      const res = await fetch(`http://localhost:5001/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setAppointments(appointments.map(a => a.id === apt.id ? { ...a, status: nextStatus } : a));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteApt = async (id) => {
    if (window.confirm(t('appointments.confirm_delete', 'Are you sure you want to delete this appointment?'))) {
      try {
        await fetch(`http://localhost:5001/appointments/${id}`, { method: 'DELETE' });
        setAppointments(appointments.filter(a => a.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const handleAddApt = async (e) => {
    e.preventDefault();
    const newId = 'apt-' + Date.now();

    let formattedTime = newApt.time;
    if (newApt.time && newApt.time.includes(':')) {
      let [h, m] = newApt.time.split(':');
      let h12 = Number(h);
      let ampm = 'AM';
      if (h12 >= 12) {
        ampm = 'PM';
        if (h12 > 12) h12 -= 12;
      }
      if (h12 === 0) h12 = 12;
      formattedTime = `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
    }

    const aptData = {
      id: newId,
      date: newApt.date,
      time: formattedTime,
      duration: Number(newApt.duration),
      clientName: newApt.clientName,
      clientType: newApt.clientType,
      clientInitials: newApt.clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NA',
      serviceName: newApt.serviceName,
      specialistName: newApt.specialistName,
      specialistAvatar: newApt.specialistAvatar,
      status: newApt.status
    };

    try {
      const res = await fetch('http://localhost:5001/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptData)
      });
      if (res.ok) {
        const addedApt = await res.json();
        setAppointments(prev => [...prev, addedApt]);
        setIsAddAptModalOpen(false);
        setNewApt({ date: selectedDate, time: '', duration: 60, clientName: '', clientType: 'new', serviceName: '', specialistName: '', specialistAvatar: '/img/image.jpg', status: 'pending' });
      }
    } catch (err) {
      console.error('Error adding appointment', err);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5001/appointments').then(res => res.json()),
      fetch('http://localhost:5001/staff').then(res => res.json()),
      fetch('http://localhost:5001/services').then(res => res.json())
    ]).then(([aptData, staffData, srvData]) => {
      setAppointments(aptData);
      setStaffList(staffData);
      setServicesList(srvData || []);
      setMetrics({
        todayCapacity: 84, // Constant placeholder
        todayCapacityTrend: '+12%',
        pendingRequests: aptData.filter(a => a.status === 'pending').length,
        staffOnDuty: staffData.filter(s => s.shift === 'on').length,
        staffTotal: staffData.length
      });
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="dashboard-canvas flex items-center justify-center min-h-[50vh]">
        <div className="text-primary font-medium">Loading Appointments...</div>
      </div>
    );
  }

  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return {
      dateStr,
      dayKey: dayKeys[d.getDay()],
      dateNum: d.getDate()
    };
  });

  const filteredAppointments = appointments.filter(apt => apt.date === selectedDate);

  return (
    <div className="dashboard-canvas">
      <div className="page-header mb-10">
        <div className="page-header-text">
          <h2 className="page-title text-4xl mb-2">{t('appointments.title')}</h2>
          <p className="text-on-surface-variant font-medium">{t('appointments.subtitle')}</p>
        </div>
        <button
          className="btn btn-primary btn-pill with-btn-icon shadow-sm"
          onClick={() => setIsAddAptModalOpen(true)}
        >
          <span className="material-symbols-outlined" data-icon="add">add</span>
          {t('appointments.new_appointment')}
        </button>
      </div>

      <section className="calendar-section">
        <div className="calendar-header">
          <h3 className="calendar-title" style={{ textTransform: 'capitalize' }}>
            {currentWeekStart.toLocaleString(t('locale', 'vi-VN'), { month: 'long', year: 'numeric' })}
          </h3>
          <div className="calendar-nav">
            <button className="calendar-btn" onClick={() => {
              const prev = new Date(currentWeekStart);
              prev.setDate(prev.getDate() - 7);
              setCurrentWeekStart(prev);
            }}>
              <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
            </button>
            <button className="calendar-btn" onClick={() => {
              const next = new Date(currentWeekStart);
              next.setDate(next.getDate() + 7);
              setCurrentWeekStart(next);
            }}>
              <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="calendar-strip">
          {weekDays.map(day => (
            <div
              key={day.dateStr}
              className={`date-card ${selectedDate === day.dateStr ? 'active' : ''}`}
              onClick={() => setSelectedDate(day.dateStr)}
              style={{ cursor: 'pointer' }}
            >
              <span className="date-day">{t(`appointments.days.${day.dayKey}`)}</span>
              <span className="date-number">{day.dateNum}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="appointment-list-card">
        <div className="table-container-scroll">
          <div className="table-header-grid">
            <div className="col-time">{t('appointments.table.time')}</div>
            <div className="col-client">{t('appointments.table.client')}</div>
            <div className="col-service">{t('appointments.table.service')}</div>
            <div className="col-specialist">{t('appointments.table.specialist')}</div>
            <div className="col-status text-right">{t('appointments.table.status')}</div>
          </div>

          <div className="apt-list">
            {filteredAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}>event_available</span>
                <p>{t('appointments.no_appointments', 'Không có lịch hẹn nào vào ngày này.')}</p>
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className={`appointment-row group ${apt.status === 'completed' ? 'opacity-60' : ''} ${apt.status === 'pending' ? 'bg-surface-container-low hover-bg-surface-container' : ''}`}>
                  <div className={`col-time ${apt.status === 'completed' ? 'opacity-50' : ''}`}>
                    <p className={`apt-time-label ${apt.status === 'confirmed' ? 'text-primary' : ''} ${apt.status === 'completed' ? 'line-through' : ''}`}>{apt.time}</p>
                    <p className="apt-duration">{apt.status === 'completed' ? t('appointments.status.completed') : `${apt.duration} ${t('appointments.duration_mins')}`}</p>
                  </div>
                  <div className="col-client flex-row gap-3">
                    <div className={`avatar-circle ${apt.status === 'completed' ? 'bg-outline-variant text-on-surface' : 'badge-secondary'}`}>
                      {apt.clientInitials}
                    </div>
                    <div>
                      <p className="client-name">{apt.clientName}</p>
                      <p className="client-type">{t(`appointments.client_types.${apt.clientType}`)}</p>
                    </div>
                  </div>
                  <div className="col-service">
                    <span className="service-badge">{apt.serviceName}</span>
                  </div>
                  <div className="col-specialist flex-row gap-2">
                    <img alt="Staff" className="staff-img" src={apt.specialistAvatar} />
                    <p className="staff-name">{apt.specialistName}</p>
                  </div>
                  <div className="col-status text-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <span onClick={() => handleToggleStatus(apt)} className={`status-badge status-${apt.status}`} style={{ cursor: 'pointer' }} title="Click to change status">
                      {t(`appointments.status.${apt.status}`)}
                    </span>
                    <button onClick={() => handleDeleteApt(apt.id)} className="icon-btn-small" style={{ opacity: 0 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0} title="Delete">
                      <span className="material-symbols-outlined text-sm" style={{ color: 'var(--error)' }}>delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="appointment-footer">
          <button className="view-all-btn">
            {t('appointments.view_all')}
            <span className="material-symbols-outlined text-sm"
              data-icon="arrow_forward">arrow_forward</span>
          </button>
        </div>
      </section>

      <section className="quick-stats-grid">
        <div className="quick-stat-card border-l-primary">
          <p className="quick-stat-label">{t('appointments.stats.capacity_label')}</p>
          <div className="quick-stat-value-row">
            <h4 className="quick-stat-value">{metrics.todayCapacity}%</h4>
            <span className="quick-stat-meta text-primary">{metrics.todayCapacityTrend}</span>
          </div>
        </div>

        <div className="quick-stat-card border-l-tertiary">
          <p className="quick-stat-label">{t('appointments.stats.pending_label')}</p>
          <div className="quick-stat-value-row">
            <h4 className="quick-stat-value">0{metrics.pendingRequests}</h4>
            <span className="quick-stat-meta">{t('appointments.stats.pending_meta')}</span>
          </div>
        </div>

        <div className="quick-stat-card border-l-secondary">
          <p className="quick-stat-label">{t('appointments.stats.staff_label')}</p>
          <div className="quick-stat-value-row">
            <h4 className="quick-stat-value">{metrics.staffOnDuty}/{metrics.staffTotal}</h4>
            <span className="quick-stat-meta">{t('appointments.stats.staff_meta')}</span>
          </div>
        </div>
      </section>

      {/* Add Appointment Modal */}
      {isAddAptModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '450px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--on-surface)', fontWeight: 600 }}>{t('appointments.new_appointment')}</h3>
            <form onSubmit={handleAddApt} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required name="date" type="date" value={newApt.date} onChange={handleAptInputChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
                <input required name="time" type="time" min="08:00" max="20:00" value={newApt.time} onChange={handleAptInputChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} title="Thời gian từ 08:00 AM đến 08:00 PM" />
              </div>
              <input required name="clientName" value={newApt.clientName} onChange={handleAptInputChange} placeholder={t('appointments.form.client_name')} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <input required name="duration" type="number" min="15" step="15" value={newApt.duration} onChange={handleAptInputChange} placeholder={t('appointments.form.duration')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
              </div>

              <select name="clientType" value={newApt.clientType} onChange={handleAptInputChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }}>
                <option value="new">{t('appointments.client_types.first_time')}</option>
                <option value="regular">{t('appointments.client_types.regular')}</option>
                <option value="vip">{t('appointments.client_types.vip')}</option>
                <option value="first_time">{t('appointments.client_types.first_time')}</option>
                <option value="referred">{t('appointments.client_types.referred')}</option>
              </select>

              <select required name="serviceName" value={newApt.serviceName} onChange={(e) => {
                const srvTitle = e.target.value;
                const selectedSrv = servicesList.find(s => s.title === srvTitle);
                if (selectedSrv) {
                  setNewApt({ ...newApt, serviceName: srvTitle, duration: selectedSrv.duration });
                } else {
                  setNewApt({ ...newApt, serviceName: srvTitle });
                }
              }} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }}>
                <option value="">{t('appointments.form.service_name', 'Tên Dịch Vụ')}</option>
                {servicesList.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>

              <select required onChange={(e) => {
                if (!e.target.value) return;
                const staff = JSON.parse(e.target.value);
                setNewApt({ ...newApt, specialistName: staff.name, specialistAvatar: staff.avatar });
              }} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }}>
                <option value="">{t('appointments.form.specialist_name')}</option>
                {staffList.map(s => (
                  <option key={s.id} value={JSON.stringify({ name: s.name, avatar: s.avatar })}>{s.name} - {s.role}</option>
                ))}
              </select>

              <select name="status" value={newApt.status} onChange={handleAptInputChange} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }}>
                <option value="pending">{t('appointments.status.pending')}</option>
                <option value="confirmed">{t('appointments.status.confirmed')}</option>
                <option value="completed">{t('appointments.status.completed')}</option>
              </select>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAddAptModalOpen(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--outline)', borderRadius: '0.5rem', color: 'var(--on-surface)' }}>{t('appointments.form.cancel')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}>{t('appointments.form.add_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
