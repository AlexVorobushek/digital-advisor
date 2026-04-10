import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { Victory, AuthenticRole, SuperResource } from '../types';
import Modal from '../components/Modal';

const SCORE_OPTIONS = [1, 4, 16, 64];

export default function Victories() {
  const [items, setItems] = useState<Victory[]>([]);
  const [roles, setRoles] = useState<AuthenticRole[]>([]);
  const [resources, setResources] = useState<SuperResource[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Victory | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState(4);
  const [linkedRole, setLinkedRole] = useState('');
  const [linkedResource, setLinkedResource] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [vData, rData, resData] = await Promise.all([
        api.get('/api/victories'),
        api.get('/api/roles'),
        api.get('/api/resources')
      ]);
      setItems(vData);
      setRoles(rData);
      setResources(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setTitle(''); setDescription(''); setScore(4);
    setLinkedRole(''); setLinkedResource('');
    setShowModal(true);
  };

  const openEdit = (item: Victory) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setScore(item.score);
    setLinkedRole(item.linkedRole || '');
    setLinkedResource(item.linkedResource || '');
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!editingItem || !window.confirm('Удалить эту победу? Баллы будут вычтены.')) return;
    try {
      await api.delete(`/api/victories/${editingItem.id}`);
      await loadData();
      setShowModal(false);
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const data = {
      id: editingItem?.id,
      date: editingItem?.date || new Date().toISOString().split('T')[0],
      title: title.trim(),
      description: description.trim(),
      score,
      linkedRole: linkedRole || null,
      linkedResource: linkedResource || null,
    };
    try {
      await api.post('/api/victories', data);
      await loadData();
      setShowModal(false);
    } catch (err) {
      alert('Ошибка при сохранении');
    }
  };

  const totalScore = items.reduce((sum, v) => sum + (v.score || 0), 0);

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Победы</div>
        <div className="score-badge">⚡ {totalScore}</div>
      </div>

      {items.map(victory => (
        <div className="card" key={victory.id} onClick={() => openEdit(victory)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{victory.date}</div>
              <div className="card-title" style={{ marginTop: 2 }}>{victory.title}</div>
            </div>
            <div className="score-badge">+{victory.score}</div>
          </div>
          <div className="card-text" style={{ marginTop: 8 }}>{victory.description}</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {victory.linkedRole && <span className="tag tag-primary">🎭 {victory.linkedRole}</span>}
            {victory.linkedResource && <span className="tag tag-success">💎 {victory.linkedResource}</span>}
          </div>
        </div>
      ))}

      <div style={{ padding: 16 }}>
        <button className="btn btn-primary" onClick={openCreate}>Записать победу</button>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingItem ? "Редактировать победу" : "Новая победа"}>
        <div className="form-group">
          <label className="form-label">Заголовок</label>
          <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Баллы</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {SCORE_OPTIONS.map(s => (
              <button key={s} onClick={() => setScore(s)} style={{
                flex: 1, padding: 10, borderRadius: 8,
                border: score === s ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: score === s ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: 'white', cursor: 'pointer'
              }}>{s}</button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Связь с ролью</label>
          <select className="form-select" value={linkedRole} onChange={e => setLinkedRole(e.target.value)}>
            <option value="">Не выбрано</option>
            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>

        <div className="form-actions" style={{ flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%' }}>Сохранить</button>
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Отмена</button>
            {editingItem && (
              <button className="btn btn-danger" onClick={handleDelete} style={{ flex: 1, background: 'var(--danger)', border: 'none' }}>Удалить</button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
