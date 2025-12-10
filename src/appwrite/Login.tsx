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
            <h2 className="presentation-side-title">Войдите в SlideCraft</h2>
            <p className="presentation-side-subtitle">Продолжите работу над вашими презентациями</p>

            <div className="presentation-features">
              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>Простой конструктор презентаций</h3>
                  <p>Создавайте слайды с текстом и изображениями, настраивайте цвета и шрифты</p>
                </div>
              </div>

              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>Управление слайдами</h3>
                  <p>
                    Добавляйте, удаляйте и переупорядочивайте слайды, настраивайте фон каждого
                    слайда
                  </p>
                </div>
              </div>

              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>Быстрое редактирование</h3>
                  <p>
                    Изменяйте размер и положение элементов, копируйте стили и настраивайте
                    выравнивание
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Форма входа */}
          <div className="presentation-auth-card">
            <div className="presentation-auth-header">
              <h1 className="presentation-auth-title">Добро пожаловать в SlideCraft</h1>
              <p className="presentation-auth-subtitle">
                Войдите, чтобы продолжить создание впечатляющих презентаций
              </p>
            </div>

            <form onSubmit={login} className="presentation-auth-form">
              {error && <div className="presentation-error">{error}</div>}

              <div className="presentation-form-group">
                <label className="presentation-form-label">Ваш email</label>
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
                <div className="presentation-input-hint">
                  Email, который вы использовали при регистрации
                </div>
              </div>

              <div className="presentation-form-group">
                <label className="presentation-form-label">Ваш пароль</label>
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
                <div className="presentation-input-hint">Введите пароль от вашего аккаунта</div>
              </div>

              <button className="presentation-auth-button" type="submit" disabled={loading}>
                {loading ? (
                  <div className="presentation-button-content">
                    <div className="presentation-spinner"></div>
                    <span>Вход...</span>
                  </div>
                ) : (
                  'Продолжить создание'
                )}
              </button>
            </form>

            <div className="presentation-link-text">
              Нет аккаунта?{' '}
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
