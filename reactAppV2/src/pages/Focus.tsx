import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { Focus } from '../types';

export default function Focus() {
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  const [items, setItems] = useState<Focus[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFocuses = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/focuses');
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFocuses();
  }, []);

  const filtered = items.filter(f => f.type === tab);

  const toggleTask = async (focusId: number, taskId: number) => {
    const focus = items.find(f => f.id === focusId);
    if (!focus) return;

    const updatedTasks = (focus.tasks || []).map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedFocus = { ...focus, tasks: updatedTasks, progress };

    try {
      await api.post('/api/focuses', updatedFocus);
      await loadFocuses();
    } catch (err) {
      alert('Ошибка при обновлении задачи');
    }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Фокусы</div>
      </div>
      <div className="page-subtitle">Задания и прогресс аутентичности</div>

      <div className="tabs">
        <button className={`tab ${tab === 'weekly' ? 'active' : ''}`} onClick={() => setTab('weekly')}>Неделя</button>
        <button className={`tab ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>Месяц</button>
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          У вас пока нет фокусов на этот период. Антон поможет их сформулировать!
        </div>
      )}

      {filtered.map(focus => (
        <div className="card" key={focus.id}>
          <div className="card-title">{focus.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {focus.startDate} → {focus.endDate}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 13 }}>Прогресс</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>{focus.progress}%</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill primary" style={{ width: `${focus.progress}%` }} />
          </div>

          <div style={{ marginTop: 16 }}>
            {(focus.tasks || []).map(task => (
              <div
                key={task.id}
                className="list-item"
                onClick={() => focus.id && task.id && toggleTask(Number(focus.id), Number(task.id))}
                style={{ cursor: 'pointer' }}
              >
                <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: 12, height: 12 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 13,
                  color: task.completed ? 'var(--text-muted)' : 'var(--text)',
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
