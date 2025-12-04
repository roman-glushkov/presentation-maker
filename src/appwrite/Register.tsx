// src/appwrite/Register.tsx
'use client';
import React from 'react';
import { useState } from 'react';
import { account, AppwriteError } from './client';
import { ID } from 'appwrite';

interface RegisterProps {
  onSuccess: () => void;
  switchToLogin: () => void;
}

export default function Register({ onSuccess, switchToLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password || !name) {
      setError('Все поля обязательны для заполнения');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Введите корректный email адрес (например: user@company.com)');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      setLoading(false);
      return;
    }

    if (name.length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      setLoading(false);
      return;
    }

    try {
      console.log('Регистрация с данными:', {
        email,
        passwordLength: password.length,
        name,
      });

      const userId = ID.unique();
      console.log('Создан userId:', userId);

      await account.create(userId, email, password, name);
      console.log('Пользователь создан успешно');

      const session = await account.createEmailPasswordSession(email, password);
      console.log('Сессия создана:', session);

      onSuccess();
    } catch (err: unknown) {
      console.error('Полная информация об ошибке:', err);
      const error = err as AppwriteError;

      if (error.code === 400) {
        if (error.message.includes('email')) {
          setError('Некорректный email адрес. Проверьте формат');
        } else if (error.message.includes('password')) {
          setError('Пароль не соответствует требованиям безопасности');
        } else {
          setError('Некорректные данные. Проверьте все поля');
        }
      } else if (error.code === 409) {
        setError('Пользователь с таким email уже существует');
      } else if (error.message?.includes('Network Error')) {
        setError('Проблемы с соединением. Проверьте интернет');
      } else {
        setError(`Ошибка регистрации: ${error.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    switchToLogin();
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
              Регистрация
            </a>
          </div>
        </nav>

        <div className="presentation-auth-container">
          {/* Боковая панель с преимуществами */}
          <div className="presentation-sidebar">
            <h2 className="presentation-side-title">
              Начните создавать презентации нового поколения
            </h2>
            <p className="presentation-side-subtitle">
              Присоединяйтесь к сообществу профессионалов, которые уже создали более 100,000
              презентаций
            </p>

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
                  <h3>Умные шаблоны</h3>
                  <p>Адаптируются под ваш контент автоматически</p>
                </div>
              </div>

              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>ИИ-аналитика</h3>
                  <p>Анализ структуры и рекомендации по улучшению</p>
                </div>
              </div>

              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>Без рекламы</h3>
                  <p>Полностью чистый интерфейс для максимальной концентрации</p>
                </div>
              </div>

              <div className="presentation-feature">
                <div className="presentation-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="presentation-feature-content">
                  <h3>Экспорт в любом формате</h3>
                  <p>PDF, PowerPoint, Keynote, Google Slides и даже видео</p>
                </div>
              </div>
            </div>
          </div>

          {/* Форма регистрации */}
          <div className="presentation-auth-card">
            <div className="presentation-auth-header">
              <h1 className="presentation-auth-title">Создайте аккаунт</h1>
              <p className="presentation-auth-subtitle">Начните создавать презентации за минуты</p>
            </div>

            <form onSubmit={register} className="presentation-auth-form">
              {error && <div className="presentation-error">{error}</div>}

              <div className="presentation-form-group">
                <label className="presentation-form-label">Ваше имя</label>
                <input
                  className="presentation-form-input"
                  type="text"
                  placeholder="Александр Петров"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  disabled={loading}
                  pattern=".{2,}"
                  title="Минимум 2 символа"
                />
                <div className="presentation-input-hint">Как к вам обращаться</div>
              </div>

              <div className="presentation-form-group">
                <label className="presentation-form-label">Рабочий Email</label>
                <input
                  className="presentation-form-input"
                  type="email"
                  placeholder="alexander@company.com"
                  onChange={(e) => setEmail(e.target.value.trim())}
                  value={email}
                  required
                  disabled={loading}
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Введите корректный email"
                  autoComplete="email"
                />
                <div className="presentation-input-hint">
                  Используйте рабочий email для лучших возможностей
                </div>
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
                />
                <div className="presentation-input-hint">
                  Минимум 8 символов, используйте буквы и цифры
                </div>
              </div>

              <button className="presentation-auth-button" type="submit" disabled={loading}>
                {loading ? (
                  <div className="presentation-button-content">
                    <div className="presentation-spinner"></div>
                    <span>Создаём аккаунт...</span>
                  </div>
                ) : (
                  'Создать аккаунт'
                )}
              </button>
            </form>

            <div className="presentation-link-text">
              Уже есть аккаунт?{' '}
              <a
                href="#"
                onClick={handleSwitchToLogin}
                className="presentation-link"
                tabIndex={loading ? -1 : 0}
              >
                Войти
              </a>
            </div>

            <div className="presentation-agreement">
              <p className="presentation-agreement-text">
                Нажимая "Создать аккаунт", вы соглашаетесь с
                <a href="#" className="presentation-link">
                  {' '}
                  Условиями использования
                </a>{' '}
                и
                <a href="#" className="presentation-link">
                  {' '}
                  Политикой конфиденциальности
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
