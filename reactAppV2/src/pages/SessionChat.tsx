import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const initialMessages: Record<string, { role: 'bot' | 'user'; text: string }[]> = {
  strong_decision: [
    { role: 'bot', text: 'Привет! Я Антон, твой коуч по аутентичному лидерству. Я помогу тебе принять точное решение через призму твоей аутентичности. Расскажи, какое решение тебе нужно принять?' },
  ],
  strong_position: [
    { role: 'bot', text: 'Привет! Я Антон. Давай подготовим тебя к важной ситуации. Я помогу выстроить сильную позицию, опираясь на твои аутентичные роли. Что за ситуация?' },
  ],
  moral_support: [
    { role: 'bot', text: 'Привет! Я Антон. Я здесь, чтобы поддержать тебя. Расскажи, что происходит, и мы вместе найдём ресурсное состояние через твою аутентичность.' },
  ],
};

const titles: Record<string, string> = {
  strong_decision: 'Точное решение',
  strong_position: 'Сильная позиция',
  moral_support: 'Поддержка',
};

export default function SessionChat() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages[type || 'strong_decision'] || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      console.log('Отправка запроса в API чата...');
      const data = await api.post('/api/chat/send', { 
        message: input, 
        sessionType: type 
      });

      console.log('Ответ от сервера:', data);
      setMessages(prev => [...prev, { role: 'bot' as const, text: data.text || '...' }]);
    } catch (err: any) {
      console.error('Критическая ошибка:', err);
      setMessages(prev => [...prev, { role: 'bot' as const, text: `Не удалось связаться с сервером: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ borderBottom: '1px solid var(--border)' }}>
        <button className="back-btn" onClick={() => navigate('/sessions')}>
          ← Назад
        </button>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{titles[type || ''] || 'Сессия'}</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`} style={{ whiteSpace: 'pre-line' }}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="chat-message bot" style={{ fontStyle: 'italic', opacity: 0.7 }}>
              Антон думает...
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            placeholder="Напишите сообщение..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button className="chat-send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
