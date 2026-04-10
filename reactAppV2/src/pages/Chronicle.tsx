import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { ChronicleEntry, AuthenticRole } from '../types';
import Modal from '../components/Modal';

const typeIcons: Record<string, string> = {
  text: '📝', photo: '📸', video: '🎬', audio: '🎙️',
};

const typeLabels: Record<string, string> = {
  text: 'Текст', photo: 'Фото', video: 'Видео', audio: 'Аудио',
};

export default function Chronicle() {
  const [items, setItems] = useState<ChronicleEntry[]>([]);
  const [roles, setRoles] = useState<AuthenticRole[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ChronicleEntry | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChronicleEntry['type']>('text');
  const [linkedRole, setLinkedRole] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [cData, rData] = await Promise.all([
        api.get('/api/chronicle'),
        api.get('/api/roles')
      ]);
      setItems(cData);
      setRoles(rData);
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
    setTitle(''); setDescription(''); setType('text'); setLinkedRole(''); setTagsStr('');
    setShowModal(true);
  };

  const openEdit = (item: ChronicleEntry) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setType(item.type);
    setLinkedRole(item.linkedRole || '');
    setTagsStr((item.tags || []).join(', '));
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!editingItem || !window.confirm('Удалить эту запись из летописи?')) return;
    try {
      await api.delete(`/api/chronicle/${editingItem.id}`);
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
      type,
      linkedRole: linkedRole || null,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      await api.post('/api/chronicle', data);
      await loadData();
      setShowModal(false);
    } catch (err) {
      alert('Ошибка при сохранении');
    }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="fade-in">
      <div className="page-header"><div className="page-title">Летопись</div></div>

      {items.map(entry => (
        <div className="card" key={entry.id} onClick={() => openEdit(entry)} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{typeIcons[entry.type] || '📝'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{entry.date}</div>
              <div className="card-title">{entry.title}</div>
              <div className="card-text" style={{ marginTop: 6 }}>{entry.description}</div>
              {entry.linkedRole && <div style={{ marginTop: 8 }}><span className="tag tag-primary">{entry.linkedRole}</span></div>}
              {entry.tags && entry.tags.length > 0 && (
                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {entry.tags.map(tag => <span className="tag tag-neutral" key={tag}>#{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div style={{ padding: 16 }}>
        <button className="btn btn-primary" onClick={openCreate}>Добавить запись</button>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingItem ? "Редактировать запись" : "Новая запись"}>
        <div className="form-group">
          <label className="form-label">Тип записи</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['text', 'photo', 'video', 'audio'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                flex: 1, padding: '10px 6px', borderRadius: 8,
                border: type === t ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: type === t ? 'rgba(34,197,94,0.1)' : 'transparent',
                color: 'white', cursor: 'pointer', textAlign: 'center'
              }}>
                <div style={{ fontSize: 20 }}>{typeIcons[t]}</div>
                <div style={{ fontSize: 10 }}>{typeLabels[t]}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Заголовок</label>
          <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Связь с ролью</label>
          <select className="form-select" value={linkedRole} onChange={e => setLinkedRole(e.target.value)}>
            <option value="">Не выбрано</option>
            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Теги (через запятую)</label>
          <input className="form-input" value={tagsStr} onChange={e => setTagsStr(e.target.value)} />
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
