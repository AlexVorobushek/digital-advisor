import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import type { BusinessModel } from '../types';

export default function BusinessModelPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BusinessModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get('/api/business-models');
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Назад</button>
        <div className="page-title">Бизнес-модель</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="page-subtitle">Персональная ролевая модель выполнения бизнес-функций</div>

      {items.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Бизнес-модель еще не заполнена. Антон поможет распределить роли по процессам!
        </div>
      )}

      {items.map(bm => (
        <div className="bm-card" key={bm.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div className="card-title">{bm.block}</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-light)' }}>{bm.progress}%</span>
          </div>
          <div className="card-text">{bm.description}</div>

          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill primary" style={{ width: `${bm.progress}%` }} />
          </div>

          <div className="bm-roles">
            {(bm.roles || []).map(role => (
              <span className="tag tag-primary" key={role}>🎭 {role}</span>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
        Расставляйте сильные роли по бизнес-процессам и отслеживайте, как аутентичность влияет на результаты
      </div>
    </div>
  );
}
