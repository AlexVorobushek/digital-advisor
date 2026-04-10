import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import type { SuperResource } from '../types';
import Modal from '../components/Modal';

const categoryColors: Record<string, string> = {
  'Связи': 'tag-primary',
  'Компетенции': 'tag-success',
  'Таланты': 'tag-warning',
  'Практики': 'tag-neutral',
};

const CATEGORIES = ['Связи', 'Компетенции', 'Таланты', 'Практики'];

export default function SuperResourcesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SuperResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Таланты');

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/resources');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const resource = {
      name: name.trim(),
      description: description.trim(),
      category,
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0],
    };

    try {
      await api.post('/api/resources', resource);
      await loadResources();
      setName('');
      setDescription('');
      setCategory('Таланты');
      setShowForm(false);
    } catch (err) {
      alert('Ошибка при сохранении ресурса');
    }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Назад</button>
        <div className="page-title">Суперресурсы</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="page-subtitle">Ваши уникальные ресурсы для принятия решений</div>

      {items.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          У вас пока нет записанных суперресурсов. Добавьте свой первый мощный ресурс!
        </div>
      )}

      {items.map(sr => (
        <div className="card" key={sr.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div className="card-title">{sr.name}</div>
            <span className={`tag ${categoryColors[sr.category] || 'tag-neutral'}`}>{sr.category}</span>
          </div>
          <div className="card-text">{sr.description}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>Использований: <strong style={{ color: 'var(--accent)' }}>{sr.usageCount}</strong></span>
            <span>Последнее: {sr.lastUsed}</span>
          </div>
        </div>
      ))}

      <div style={{ padding: '8px 16px 20px' }}>
        <button className="btn btn-outline" onClick={() => setShowForm(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Добавить суперресурс
        </button>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Новый суперресурс">
        <div className="form-group">
          <label className="form-label">Название</label>
          <input className="form-input" placeholder="Например: Глубокая экспертиза в маркетинге" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea className="form-input" placeholder="В чём суть этого ресурса?" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Категория</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: '8px 16px', borderRadius: 20,
                border: category === c ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: category === c ? 'rgba(34,197,94,0.15)' : 'var(--bg-card)',
                color: category === c ? 'var(--primary-light)' : 'var(--text-secondary)',
                fontSize: 13, cursor: 'pointer',
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Отмена</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!name.trim()}>Сохранить</button>
        </div>
      </Modal>
    </div>
  );
}
