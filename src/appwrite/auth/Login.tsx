'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../client';
import { useNotifications } from '../hooks/useNotifications';
import {
  LOGIN_NOTIFICATIONS,
  VALIDATION_MESSAGES,
  NOTIFICATION_TIMEOUT,
  TRANSITION_DELAY,
  validateEmail,
  validatePassword,
  validateRequired,
} from '../notifications';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    addValidationMessage,
    removeValidationMessage,
    clearValidationMessages,
    getValidationMessage,
  } = useNotifications();

  // Валидация в реальном времени
  useEffect(() => {
    if (touchedFields.has('email') && email) {
      if (!validateEmail(email)) {
        addValidationMessage('email', VALIDATION_MESSAGES.INVALID_EMAIL, 'error');
      } else {
        removeValidationMessage('email');
      }
    }

    if (touchedFields.has('password') && password) {
      if (!validatePassword(password)) {
        addValidationMessage('password', VALIDATION_MESSAGES.PASSWORD_TOO_SHORT, 'error');
      } else {
        removeValidationMessage('password');
      }
    }
  }, [email, password, touchedFields, addValidationMessage, removeValidationMessage]);

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  const validateForm = (): boolean => {
    clearValidationMessages();
    let isValid = true;

    if (!validateRequired(email)) {
      addValidationMessage('email', 'Введите email адрес', 'error');
      isValid = false;
    } else if (!validateEmail(email)) {
      addValidationMessage('email', VALIDATION_MESSAGES.INVALID_EMAIL, 'error');
      isValid = false;
    }

    if (!validateRequired(password)) {
      addValidationMessage('password', 'Введите пароль', 'error');
      isValid = false;
    } else if (!validatePassword(password)) {
      addValidationMessage('password', VALIDATION_MESSAGES.PASSWORD_TOO_SHORT, 'error');
      isValid = false;
    }

    return isValid;
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearNotifications();

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await account.createEmailPasswordSession(email.trim(), password);

      addNotification(
        LOGIN_NOTIFICATIONS.SUCCESS.LOGIN_SUCCESS,
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );
      addNotification(
        LOGIN_NOTIFICATIONS.SUCCESS.WELCOME_BACK,
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );

      setTimeout(() => navigate('/presentations'), TRANSITION_DELAY.AFTER_SUCCESS);
    } catch (error: any) {
      const message =
        LOGIN_NOTIFICATIONS.ERROR[error?.code as keyof typeof LOGIN_NOTIFICATIONS.ERROR] ??
        LOGIN_NOTIFICATIONS.ERROR.USER_NOT_FOUND;

      addNotification(message, 'error', NOTIFICATION_TIMEOUT.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/register');
  };

  const emailError = getValidationMessage('email');
  const passwordError = getValidationMessage('password');

  return (
    <div className="presentation-body">
      {/* Уведомления (popup) */}
      <div className="presentation-notifications-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`presentation-notification presentation-notification--${type}`}>
            <div className="presentation-notification-content">
              <svg
                className="presentation-notification-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="presentation-notification-message">{message}</span>
            </div>
            <button
              className="presentation-notification-close"
              onClick={() => removeNotification(id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

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
          <div className="presentation-sidebar">
            <h2 className="presentation-side-title">Войдите в SlideCraft</h2>
            <p className="presentation-side-subtitle">Продолжите работу над вашими презентациями</p>

            <div className="presentation-features">
              {[
                {
                  title: 'Продолжайте редактирование',
                  text: 'Вернитесь к вашим незавершенным проектах и продолжите работу с того же места',
                  icon: (
                    <>
                      <path d="M3 6h18" />
                      <path d="M3 12h18" />
                      <path d="M3 18h18" />
                    </>
                  ),
                },
                {
                  title: 'Доступ к сохраненным презентациям',
                  text: 'Все ваши презентации хранятся в облаке и доступны с любого устройства',
                  icon: (
                    <>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </>
                  ),
                },
                {
                  title: 'Синхронизация изменений',
                  text: 'Все изменения автоматически сохраняются, вы никогда не потеряете прогресс',
                  icon: (
                    <>
                      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </>
                  ),
                },
                {
                  title: 'Новые функции и обновления',
                  text: 'Получайте доступ к последним улучшениям конструктора сразу после выхода',
                  icon: (
                    <>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </>
                  ),
                },
              ].map(({ title, text, icon }) => (
                <div className="presentation-feature" key={title}>
                  <div className="presentation-feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {icon}
                    </svg>
                  </div>
                  <div className="presentation-feature-content">
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="presentation-auth-card">
            <div className="presentation-auth-header">
              <h1 className="presentation-auth-title">Добро пожаловать в SlideCraft</h1>
              <p className="presentation-auth-subtitle">
                Войдите, чтобы продолжить создание впечатляющих презентаций
              </p>
            </div>

            <form onSubmit={login} className="presentation-auth-form">
              <div className="presentation-form-group">
                <label className="presentation-form-label">Ваш email</label>
                <input
                  className={`presentation-form-input ${emailError ? 'presentation-form-input-error' : ''}`}
                  type="email"
                  placeholder="work@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  disabled={loading}
                />
                {emailError && (
                  <div className="presentation-form-error">
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              <div className="presentation-form-group">
                <label className="presentation-form-label">Ваш пароль</label>
                <input
                  className={`presentation-form-input ${passwordError ? 'presentation-form-input-error' : ''}`}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                />
                {passwordError && (
                  <div className="presentation-form-error">
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>

              <button className="presentation-auth-button" type="submit" disabled={loading}>
                {loading ? (
                  <div className="presentation-button-content">
                    <div className="presentation-spinner" />
                    <span>Вход...</span>
                  </div>
                ) : (
                  'Продолжить создание'
                )}
              </button>
            </form>

            <div className="presentation-link-text">
              Нет аккаунта?{' '}
              <a href="#" onClick={handleSwitchToRegister} className="presentation-link">
                Зарегистрироваться
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
