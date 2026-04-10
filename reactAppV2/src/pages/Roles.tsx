import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { AuthenticRole, RoleEvent } from '../types';
import Modal from '../components/Modal';

export default function Roles() {
  const [roles, setRoles] = useState<AuthenticRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  
  const [editingEventIdx, setEditingEventIdx] = useState<number | null>(null);

  // Forms
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventScore, setEventScore] = useState(4);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/roles');
      setRoles(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const role = roles.find(r => String(r.id) === String(selectedRole));

  // Role Actions
  const openCreateRole = () => {
    setRoleName(''); setRoleDesc('');
    setShowRoleModal(true);
  };

  const openEditRole = () => {
    if (!role) return;
    setRoleName(role.name); setRoleDesc(role.description);
    setShowRoleModal(true);
  };

  const handleRoleSubmit = async () => {
    if (!roleName.trim()) return;
    const data = role ? { ...role, name: roleName, description: roleDesc } : {
      name: roleName, description: roleDesc, score: 0, maxScore: 100, events: [],
      lastActive: new Date().toISOString().split('T')[0]
    };
    try {
      await api.post('/api/roles', data);
      await loadRoles();
      setShowRoleModal(false);
    } catch (err) { alert('Ошибка'); }
  };

  const handleDeleteRole = async () => {
    if (!role || !window.confirm('Удалить роль?')) return;
    try {
      await api.delete(`/api/roles/${role.id}`);
      await loadRoles();
      setSelectedRole(null);
      setShowRoleModal(false);
    } catch (err) { alert('Ошибка'); }
  };

  // Event Actions
  const openCreateEvent = () => {
    setEditingEventIdx(null);
    setEventDesc(''); setEventScore(4);
    setShowEventModal(true);
  };

  const openEditEvent = (idx: number) => {
    const ev = role?.events[idx];
    if (!ev) return;
    setEditingEventIdx(idx);
    setEventDesc(ev.description);
    setEventScore(ev.score);
    setShowEventModal(true);
  };

  const handleEventSubmit = async () => {
    if (!role || !eventDesc.trim()) return;
    const newEvent = {
      date: editingEventIdx !== null ? role.events[editingEventIdx].date : new Date().toISOString().split('T')[0],
      description: eventDesc.trim(),
      score: eventScore,
    };
    
    let updatedEvents = [...(role.events || [])];
    if (editingEventIdx !== null) {
      updatedEvents[editingEventIdx] = newEvent;
    } else {
      updatedEvents = [newEvent, ...updatedEvents];
    }

    const newScore = updatedEvents.reduce((sum, e) => sum + (e.score || 0), 0);
    const updatedRole = { ...role, events: updatedEvents, score: Math.min(100, newScore) };
    
    try {
      await api.post('/api/roles', updatedRole);
      await loadRoles();
      setShowEventModal(false);
    } catch (err) { alert('Ошибка'); }
  };

  const handleDeleteEvent = async () => {
    if (!role || editingEventIdx === null || !window.confirm('Удалить событие?')) return;
    const updatedEvents = role.events.filter((_, i) => i !== editingEventIdx);
    const newScore = updatedEvents.reduce((sum, e) => sum + (e.score || 0), 0);
    const updatedRole = { ...role, events: updatedEvents, score: Math.min(100, newScore) };
    try {
      await api.post('/api/roles', updatedRole);
      await loadRoles();
      setShowEventModal(false);
    } catch (err) { alert('Ошибка'); }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  if (role) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <button className="back-btn" onClick={() => setSelectedRole(null)}>← Назад</button>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="score-badge">{role.score}/{role.maxScore}</div>
            <button onClick={openEditRole} className="tag tag-primary" style={{ border: 'none', cursor: 'pointer' }}>⚙️ Редактировать</button>
          </div>
        </div>
        <div style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{role.name}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{role.description}</p>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className={`progress-fill ${role.score >= 70 ? 'success' : 'primary'}`} style={{ width: `${role.score}%` }} />
          </div>
        </div>

        <div className="section-title">События ({(role.events || []).length})</div>
        {(role.events || []).map((event, idx) => (
          <div className="card" key={idx} onClick={() => openEditEvent(idx)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{event.date}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{event.description}</div>
              </div>
              <div className="score-badge">+{event.score}</div>
            </div>
          </div>
        ))}

        <div style={{ padding: '16px' }}>
          <button className="btn btn-primary" onClick={openCreateEvent}>Добавить событие</button>
        </div>

        <Modal open={showRoleModal} onClose={() => setShowRoleModal(false)} title="Редактировать роль">
          <div className="form-group">
            <label className="form-label">Название</label>
            <input className="form-input" value={roleName} onChange={e => setRoleName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea className="form-input" value={roleDesc} onChange={e => setRoleDesc(e.target.value)} />
          </div>
          <div className="form-actions" style={{ flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary" onClick={handleRoleSubmit} style={{ width: '100%' }}>Сохранить</button>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button className="btn btn-outline" onClick={() => setShowRoleModal(false)} style={{ flex: 1 }}>Отмена</button>
              <button className="btn btn-danger" onClick={handleDeleteRole} style={{ flex: 1, background: 'var(--danger)', border: 'none' }}>Удалить роль</button>
            </div>
          </div>
        </Modal>

        <Modal open={showEventModal} onClose={() => setShowEventModal(false)} title={editingEventIdx !== null ? "Редактировать событие" : "Новое событие"}>
          <div className="form-group">
            <label className="form-label">Что произошло?</label>
            <textarea className="form-input" value={eventDesc} onChange={e => setEventDesc(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Баллы</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 4, 16, 64].map(s => (
                <button key={s} onClick={() => setEventScore(s)} style={{
                  flex: 1, padding: 10, borderRadius: 8,
                  border: eventScore === s ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: eventScore === s ? 'rgba(245,158,11,0.1)' : 'transparent',
                  color: 'white', cursor: 'pointer'
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="form-actions" style={{ flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary" onClick={handleEventSubmit} style={{ width: '100%' }}>Сохранить</button>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button className="btn btn-outline" onClick={() => setShowEventModal(false)} style={{ flex: 1 }}>Отмена</button>
              {editingEventIdx !== null && (
                <button className="btn btn-danger" onClick={handleDeleteEvent} style={{ flex: 1, background: 'var(--danger)', border: 'none' }}>Удалить</button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header"><div className="page-title">Книга уникальности</div></div>
      {roles.map(r => (
        <div className="card" key={r.id} onClick={() => setSelectedRole(String(r.id))} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div className="card-title">{r.name}</div>
            <div className="score-badge">{r.score}</div>
          </div>
          <div className="card-text">{r.description}</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className={`progress-fill ${r.score >= 70 ? 'success' : 'primary'}`} style={{ width: `${r.score}%` }} />
          </div>
        </div>
      ))}
      <div style={{ padding: 16 }}>
        <button className="btn btn-outline" onClick={openCreateRole}>Добавить роль</button>
      </div>
      <Modal open={showRoleModal} onClose={() => setShowRoleModal(false)} title="Новая роль">
        <div className="form-group">
          <label className="form-label">Название</label>
          <input className="form-input" value={roleName} onChange={e => setRoleName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea className="form-input" value={roleDesc} onChange={e => setRoleDesc(e.target.value)} />
        </div>
        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => setShowRoleModal(false)}>Отмена</button>
          <button className="btn btn-primary" onClick={handleRoleSubmit}>Создать</button>
        </div>
      </Modal>
    </div>
  );
}
