import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { api } from '../utils/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, r] = await Promise.all([
          api.get('/api/dashboard/metrics'),
          api.get('/api/roles')
        ]);
        setMetrics(m);
        setRoles(r);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !metrics) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;
  }

  const initials = (metrics.name || 'U').split(' ').map((n: string) => n[0]).join('');

  const weeklyEnergyData = metrics.weeklyEnergy || [];
  const monthlyProgressData = metrics.monthlyProgress || [];

  return (
    <div className="fade-in">
      {/* Profile Header */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="avatar avatar-lg">{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{metrics.name || 'Пользователь'}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Уровень {metrics.level}</div>
        </div>
        <div className="streak-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ width: 16, height: 16 }}>
            <path d="M12 2c.5 4-2 6-2 10 0 2 1 4 2 4s2-2 2-4c0-4-2.5-6-2-10z"/>
          </svg>
          {metrics.streak || 0} дней
        </div>
      </div>

      {/* Energy & Points */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-value">{metrics.totalEnergy}</div>
          <div className="metric-label">Общая энергия</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">+{(metrics.weeklyEnergy || []).reduce((s: number, d: any) => s + (d.energy || 0), 0)}</div>
          <div className="metric-label">За неделю</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.totalVictories}</div>
          <div className="metric-label">Всего побед</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.activeRoles}/{roles.length || 0}</div>
          <div className="metric-label">Активных ролей</div>
        </div>
      </div>

      {/* Monthly Progress */}
      <div className="section-title">Прогресс месяца</div>
      <div className="card" style={{ margin: '0 16px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13 }}>Личный рост</span>
          <span style={{ fontSize: 13, color: 'var(--primary-light)' }}>{monthlyProgressData[monthlyProgressData.length - 1]?.personal || 0}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill primary" style={{ width: `${monthlyProgressData[monthlyProgressData.length - 1]?.personal || 0}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, marginTop: 12 }}>
          <span style={{ fontSize: 13 }}>Деятельность</span>
          <span style={{ fontSize: 13, color: 'var(--accent)' }}>{monthlyProgressData[monthlyProgressData.length - 1]?.activity || 0}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill accent" style={{ width: `${monthlyProgressData[monthlyProgressData.length - 1]?.activity || 0}%` }} />
        </div>
      </div>

      {/* Weekly Energy Chart */}
      <div className="section-title">Энергия за неделю</div>
      <div className="card" style={{ margin: '0 16px 12px' }}>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weeklyEnergyData}>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="energy" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Progress Chart */}
      <div className="card" style={{ margin: '0 16px 12px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Динамика месяца</div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={monthlyProgressData}>
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
            />
            <Area type="monotone" dataKey="personal" stroke="#22c55e" fill="rgba(34,197,94,0.2)" strokeWidth={2} />
            <Area type="monotone" dataKey="activity" stroke="#f59e0b" fill="rgba(245,158,11,0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--primary-light)' }}>● Личный рост</span>
          <span style={{ fontSize: 11, color: 'var(--accent)' }}>● Деятельность</span>
        </div>
      </div>

      {/* Top Roles */}
      <div className="section-title">Топ ролей</div>
      {roles.slice(0, 3).map(role => (
        <Link to="/roles" key={role.id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">{role.name}</div>
              <div className="score-badge">{role.score}</div>
            </div>
            <div className="progress-bar" style={{ marginTop: 8 }}>
              <div
                className={`progress-fill ${role.score >= 70 ? 'success' : role.score >= 50 ? 'primary' : 'accent'}`}
                style={{ width: `${role.score}%` }}
              />
            </div>
          </div>
        </Link>
      ))}

      {/* Quick Actions */}
      <div className="section-title">Быстрые действия</div>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <Link to="/victories" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, textAlign: 'center', padding: '20px 12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ width: 28, height: 28, margin: '0 auto 6px' }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Победа!</div>
          </div>
        </Link>
        <Link to="/reflections" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, textAlign: 'center', padding: '20px 12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="2" style={{ width: 28, height: 28, margin: '0 auto 6px' }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Рефлексия</div>
          </div>
        </Link>
        <Link to="/focus" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, textAlign: 'center', padding: '20px 12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" style={{ width: 28, height: 28, margin: '0 auto 6px' }}>
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Фокусы</div>
          </div>
        </Link>
        <Link to="/sessions" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, textAlign: 'center', padding: '20px 12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" style={{ width: 28, height: 28, margin: '0 auto 6px' }}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Поддержка</div>
          </div>
        </Link>
      </div>

      {/* More sections */}
      <div className="section-title">Ещё</div>
      <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link to="/metatest" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🧬</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Метатест</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Карта талантов и слабых сторон</div>
            </div>
          </div>
        </Link>
        <Link to="/blocking" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🔓</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Блокирующие процессы</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Диагностика и разблокировка</div>
            </div>
          </div>
        </Link>
        <Link to="/resources" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>💎</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Суперресурсы</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ваши уникальные ресурсы</div>
            </div>
          </div>
        </Link>
        <Link to="/business-model" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Бизнес-модель</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Персональная модель для менторов</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
