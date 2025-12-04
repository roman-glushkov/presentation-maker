// src/appwrite/AuthWrapper.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { account } from './../client';
import Login from './../Login'; // ← если Login в той же папке appwrite
import Register from './../Register'; // ← если Register в той же папке appwrite
import PresentationList from './../components/PresentationList';
import { useAutoSave } from './../useAutoSave';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState<'login' | 'register' | 'presentations'>('login');
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);

  const { isSaving, lastSaved } = useAutoSave();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const u = await account.get();
      setUser(u);
      setIsAuthenticated(true);
      setPage('presentations');
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setPage('login');
    } finally {
      setAuthChecked(true);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAuthenticated(false);
    setUser(null);
    setPage('login');
    setCurrentPresentationId(null);
  };

  const handleAuthSuccess = () => {
    checkAuth();
  };

  const handleSelectPresentation = () => {
    setCurrentPresentationId('current');
  };

  if (!authChecked) {
    return (
      <div className="presentation-loading-container">
        <div className="presentation-loading-content">
          <div className="presentation-loading-logo">SlideCraft</div>
          <div className="presentation-loading-dots">
            <div className="presentation-loading-dot"></div>
            <div className="presentation-loading-dot"></div>
            <div className="presentation-loading-dot"></div>
          </div>
          <p className="presentation-loading-text">Загружаем вашу презентацию...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return page === 'login' ? (
      <Login onSuccess={handleAuthSuccess} switchToRegister={() => setPage('register')} />
    ) : (
      <Register onSuccess={handleAuthSuccess} switchToLogin={() => setPage('login')} />
    );
  }

  // Показываем список презентаций или редактор
  if (!currentPresentationId) {
    return (
      <div className="presentation-body">
        <div className="presentation-user-panel">
          <div className="presentation-user-badge">
            {user?.name || user?.email || 'Презентатор'}
          </div>
          <button onClick={handleLogout} className="presentation-logout-button">
            Выйти
          </button>
        </div>

        <PresentationList onSelect={handleSelectPresentation} />
      </div>
    );
  }

  // Показываем редактор
  return (
    <div className="presentation-body">
      <div className="presentation-user-panel">
        <div className="presentation-user-badge">{user?.name || user?.email || 'Презентатор'}</div>

        {isSaving ? (
          <div style={{ color: '#f59e0b', marginRight: '10px' }}>💾 Сохранение...</div>
        ) : lastSaved ? (
          <div style={{ color: '#10b981', marginRight: '10px', fontSize: '14px' }}>
            💾 Сохранено: {lastSaved.toLocaleTimeString()}
          </div>
        ) : null}

        <button
          onClick={() => setCurrentPresentationId(null)}
          style={{
            padding: '6px 16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px',
          }}
        >
          📁 Мои презентации
        </button>

        <button onClick={handleLogout} className="presentation-logout-button">
          Выйти
        </button>
      </div>

      {children}
    </div>
  );
}
