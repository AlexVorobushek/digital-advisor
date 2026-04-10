import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import type { MetaTest } from '../types';

export default function MetaTestPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MetaTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get('/api/metatests');
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = [...new Set(items.map(t => t.category))];

  const getColor = (score: number) => {
    if (score >= 70) return 'var(--success)';
    if (score >= 50) return 'var(--primary-light)';
    return 'var(--danger)';
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Назад</button>
        <div className="page-title">Метатест</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="page-subtitle">Карта стратегических талантов, слабых сторон и зон компенсации</div>

      {items.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Результаты теста еще не загружены. Антон поможет проанализировать ваши таланты!
        </div>
      )}

      {categories.map(cat => (
        <div key={cat}>
          <div className="section-title">{cat}</div>
          {items
            .filter(t => t.category === cat)
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .map(talent => (
              <div className="card" key={talent.id}>
                <div className="talent-bar-container">
                  <div className="talent-bar-header">
                    <span className="talent-bar-name">{talent.talentName}</span>
                    <span className="talent-bar-score" style={{ color: getColor(talent.score || 0) }}>{talent.score}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${talent.score}%`, background: getColor(talent.score || 0) }}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{talent.description}</div>
                  {(talent.score || 0) < 50 && (
                    <div className="tag tag-danger" style={{ marginTop: 6 }}>Нужен компенсатор</div>
                  )}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
