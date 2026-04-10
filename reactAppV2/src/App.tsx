import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Roles from './pages/Roles';
import Sessions from './pages/Sessions';
import SessionChat from './pages/SessionChat';
import Chronicle from './pages/Chronicle';
import Victories from './pages/Victories';
import Reflections from './pages/Reflections';
import Focus from './pages/Focus';
import MetaTestPage from './pages/MetaTestPage';
import BlockingPage from './pages/BlockingPage';
import BusinessModelPage from './pages/BusinessModelPage';
import SuperResourcesPage from './pages/SuperResourcesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const hideNav = location.pathname.startsWith('/session/') || !isAuthenticated || ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="app">
      {isAuthenticated && !hideNav && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}>
          <button onClick={logout} className="tag tag-danger" style={{ border: 'none', cursor: 'pointer' }}>Выйти</button>
        </div>
      )}
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="/session/:type" element={<ProtectedRoute><SessionChat /></ProtectedRoute>} />
        <Route path="/chronicle" element={<ProtectedRoute><Chronicle /></ProtectedRoute>} />
        <Route path="/victories" element={<ProtectedRoute><Victories /></ProtectedRoute>} />
        <Route path="/reflections" element={<ProtectedRoute><Reflections /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
        <Route path="/metatest" element={<ProtectedRoute><MetaTestPage /></ProtectedRoute>} />
        <Route path="/blocking" element={<ProtectedRoute><BlockingPage /></ProtectedRoute>} />
        <Route path="/business-model" element={<ProtectedRoute><BusinessModelPage /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><SuperResourcesPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNav && (
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Дашборд
          </NavLink>
          <NavLink to="/roles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
            Роли
          </NavLink>
          <NavLink to="/sessions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Советник
          </NavLink>
          <NavLink to="/chronicle" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            Летопись
          </NavLink>
          <NavLink to="/victories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Победы
          </NavLink>
        </nav>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
