import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { Reflection } from '../types';
import Modal from '../components/Modal';

export default function Reflections() {
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  const [items, setItems] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [whatWorked, setWhatWorked] = useState('');
  const [whatDidnt, setWhatDidnt] = useState('');
  const [insights, setInsights] = useState('');
  const [focusStr, setFocusStr] = useState('');
  const [overallScore, setOverallScore] = useState(7);

  const loadReflections = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/reflections');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReflections();
  }, []);

  const filtered = items.filter(r => r.type === tab);

  const handleSubmit = async () => {
    if (!whatWorked.trim() && !whatDidnt.trim()) return;
    const ref = {
      date: new Date().toISOString().split('T')[0],
      type: tab,
      whatWorked: whatWorked.trim(),
      whatDidnt: whatDidnt.trim(),
      insights: insights.trim(),
      focusAreas: focusStr.split(',').map(f => f.trim()).filter(Boolean),
      overallScore,
    };

    try {
      await api.post('/api/reflections', ref);
      await loadReflections();
      setWhatWorked('');
      setWhatDidnt('');
      setInsights('');
      setFocusStr('');
      setOverallScore(7);
      setShowForm(false);
    } catch (err) {
      alert('Ошибка при сохранении рефлексии');
    }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Рефлексия</div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'weekly' ? 'active' : ''}`} onClick={() => setTab('weekly')}>Еженедельная</button>
        <button className={`tab ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>Ежемесячная</button>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>Нет записей рефлексии</p>
          <p style={{ marginTop: 8, fontSize: 13 }}>Время провести {tab === 'weekly' ? 'еженедельную' : 'ежемесячную'} рефлексию!</p>
        </div>
      )}

      {filtered.map(ref => (
        <div className="card" key={ref.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ref.date}</span>
            <span className="tag tag-primary">Оценка: {ref.overallScore}/10</span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', marginBottom: 4 }}>✓ Что сработало</div>
            <div className="card-text">{ref.whatWorked}</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>✗ Что не сработало</div>
            <div className="card-text">{ref.whatDidnt}</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-light)', marginBottom: 4 }}>Инсайты</div>
            <div className="card-text">{ref.insights}</div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Фокусы</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(ref.focusAreas || []).map(area => (
                <span className="tag tag-warning" key={area}>{area}</span>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div style={{ padding: '8px 16px 20px' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Провести {tab === 'weekly' ? 'еженедельную' : 'ежемесячную'} рефлексию
        </button>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={`${tab === 'weekly' ? 'Еженедельная' : 'Ежемесячная'} рефлексия`}>
        <div className="form-group">
          <label className="form-label">✓ Что сработало?</label>
          <textarea className="form-input" placeholder="Какие роли сработали? Где был в потоке?" value={whatWorked} onChange={e => setWhatWorked(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">✗ Что не сработало?</label>
          <textarea className="form-input" placeholder="Где были сложности? Что помешало?" value={whatDidnt} onChange={e => setWhatDidnt(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Инсайты</label>
          <textarea className="form-input" placeholder="Какие выводы? Что осознал?" value={insights} onChange={e => setInsights(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Фокусы на следующий период (через запятую)</label>
          <input className="form-input" placeholder="Работа с конфликтами, Публичные выступления" value={focusStr} onChange={e => setFocusStr(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Общая оценка: {overallScore}/10</label>
          <input type="range" min="1" max="10" value={overallScore} onChange={e => setOverallScore(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
        </div>

        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Отмена</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Сохранить</button>
        </div>
      </Modal>
    </div>
  );
}
