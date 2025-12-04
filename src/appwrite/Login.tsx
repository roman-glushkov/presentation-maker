// src/appwrite/Login.tsx
'use client';
import React, { useState } from 'react';
import { account, AppwriteError } from './client';

interface LoginProps {
  onSuccess: () => void;
  switchToRegister: () => void;
}

export default function Login({ onSuccess, switchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email.trim())) {
      setError('Введите корректный email адрес (например: user@example.com)');
      return;
    }

    if (!password || password.length < 8) {
      setError('Введите пароль (минимум 8 символов)');
      return;
    }

    setLoading(true);

    try {
      // Убираем generic тип <AppwriteSession>
      const session = await account.createEmailPasswordSession(email.trim(), password);
      console.log('Сессия создана:', session);
      onSuccess();
    } catch (err: unknown) {
      console.error('Ошибка входа:', err);
      const error = err as AppwriteError;

      if (error.code === 401) {
        setError('Неверный email или пароль');
      } else if (error.code === 429) {
        setError('Слишком много попыток. Попробуйте позже');
      } else if (error.message?.includes('Network Error')) {
        setError('Проблемы с соединением. Проверьте интернет');
      } else {
        setError(`Ошибка входа: ${error.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!loading) {
      switchToRegister();
    }
  };

  return (
    <div className="presentation-body">
      <div className="presentation-container">
        <nav className="presentation-navbar">
          <div>
            <div className="presentation-logo">SlideCraft</div>
            <span className="presentation-tagline">Создавай впечатляющие презентации</span>
          </div>
          <div className="presentation-nav-links">
            <a href="#" className="presentation-nav-link active">
              Вход
            </a>
          </div>
        </nav>

        <div className="presentation-auth-container">
          {/* Боковая панель с преимуществами */}
          <div className="presentation-sidebar">
            <h2 className="presentation-side-title">Создавайте презентации, которые запомнятся</h2>
            <p className="presentation-side-subtitle">
              Профессиональные шаблоны, умные анимации и коллаборация в реальном времени
            </p>

            <div className="presentation-features">
              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>Более 100+ шаблонов</h3>
                  <p>Профессиональные макеты для любых целей</p>
                </div>
              </div>

              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>ИИ-помощник</h3>
                  <p>Автоматическое создание контента и дизайна</p>
                </div>
              </div>

              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 010 7.75"></path>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>Командная работа</h3>
                  <p>Редактируйте презентации вместе с коллегами</p>
                </div>
              </div>
            </div>
          </div>

          {/* Форма входа */}
          <div className="presentation-auth-card">
            <div className="presentation-auth-header">
              <h1 className="presentation-auth-title">Войдите в SlideCraft</h1>
              <p className="presentation-auth-subtitle">Продолжите создавать шедевры</p>
            </div>

            <form onSubmit={login} className="presentation-auth-form">
              {error && <div className="presentation-error">{error}</div>}

              <div className="presentation-form-group">
                <label className="presentation-form-label">Email</label>
                <input
                  className="presentation-form-input"
                  type="email"
                  placeholder="work@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  disabled={loading}
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Введите корректный email"
                  autoComplete="email"
                />
                <div className="presentation-input-hint">Используйте рабочий email</div>
              </div>

              <div className="presentation-form-group">
                <label className="presentation-form-label">Пароль</label>
                <input
                  className="presentation-form-input"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  disabled={loading}
                  minLength={8}
                  pattern=".{8,}"
                  title="Минимум 8 символов"
                  autoComplete="current-password"
                />
                <div className="presentation-input-hint">Минимум 8 символов</div>
              </div>

              <button className="presentation-auth-button" type="submit" disabled={loading}>
                {loading ? (
                  <div className="presentation-button-content">
                    <div className="presentation-spinner"></div>
                    <span>Вход...</span>
                  </div>
                ) : (
                  'Войти в аккаунт'
                )}
              </button>
            </form>

            <div className="presentation-link-text">
              Ещё нет аккаунта?{' '}
              <a
                href="#"
                onClick={handleSwitchToRegister}
                className="presentation-link"
                tabIndex={loading ? -1 : 0}
              >
                Зарегистрироваться
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
