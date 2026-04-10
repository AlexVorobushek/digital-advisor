import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import type { BlockingProcess } from '../types';

const statusLabels: Record<string, string> = {
  active: 'Активный',
  in_progress: 'В работе',
  resolved: 'Решён',
};

const statusTags: Record<string, string> = {
  active: 'tag-danger',
  in_progress: 'tag-warning',
  resolved: 'tag-success',
};

export default function BlockingPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BlockingProcess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get('/api/blocking');
        setItems(data.items || []);
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
        <div className="page-title">Блокирующие</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="page-subtitle">Диагностика и примеры разблокировки процессов</div>

      {items.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          У вас пока нет записанных блокирующих процессов. Антон поможет их выявить в чате!
        </div>
      )}

      {items.map(bp => (
        <div className="card" key={bp.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div className="card-title">{bp.name}</div>
            <span className={`tag ${statusTags[bp.status] || 'tag-primary'}`}>{statusLabels[bp.status] || bp.status}</span>
          </div>
          <div className="card-text" style={{ marginBottom: 12 }}>{bp.description}</div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
            Серьёзность: <span className={`severity-${bp.severity}`}>
              {bp.severity === 'high' ? 'Высокая' : bp.severity === 'medium' ? 'Средняя' : 'Низкая'}
            </span>
          </div>

          {(bp.unlockExamples || []).length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Способы разблокировки:</div>
              {bp.unlockExamples.map((example, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--success)' }}>→</span>
                  {example}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
