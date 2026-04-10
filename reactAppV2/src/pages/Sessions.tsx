import { useNavigate } from 'react-router-dom';

const sessionTypes = [
  {
    id: 's1',
    type: 'strong_decision',
    title: 'Принять точное решение',
    description: 'Диагностика ситуации и выбор пути, исходя из ваших аутентичных ролей и ресурсов.',
    icon: 'target',
  },
  {
    id: 's2',
    type: 'strong_position',
    title: 'Подготовка к ситуации',
    description: 'Формирование сильной позиции для переговоров или выступления на основе вашей уникальности.',
    icon: 'shield',
  },
  {
    id: 's3',
    type: 'moral_support',
    title: 'Моральная поддержка',
    description: 'Когда нужно восстановить энергию и вернуться в ресурсное состояние аутентичности.',
    icon: 'heart',
  },
];

export default function Sessions() {
  const navigate = useNavigate();

  const icons: Record<string, React.ReactNode> = {
    target: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Советник</div>
      </div>
      <div className="page-subtitle">Выберите тип сессии с вашим цифровым советником</div>

      {sessionTypes.map(session => (
        <div
          className="session-card"
          key={session.id}
          onClick={() => navigate(`/session/${session.type}`)}
        >
          <div className={`session-icon ${session.icon}`}>
            {icons[session.icon]}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{session.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{session.description}</div>
          </div>
        </div>
      ))}

      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
        Советник учитывает ваши аутентичные роли, суперресурсы и историю побед для персональных рекомендаций
      </div>
    </div>
  );
}
