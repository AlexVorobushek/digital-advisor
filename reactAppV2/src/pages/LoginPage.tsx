import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, { id: data.id, email: data.email });
        navigate('/');
      } else {
        setError(data.message || 'Ошибка входа');
      }
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ padding: '20px', maxWidth: '400px', margin: '100px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Цифровой Советник</h1>
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Вход</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Пароль</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Нет аккаунта? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}
