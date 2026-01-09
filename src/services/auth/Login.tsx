'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../client';
import { useNotifications } from '../hooks/useNotifications';
import {
  LOGIN_NOTIFICATIONS,
  NOTIFICATION_TIMEOUT,
  TRANSITION_DELAY,
  getFieldValidationMessage,
} from '../notifications';

interface AppwriteError {
  code?: number;
  message?: string;
  type?: string;
}

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

  useEffect(() => {
    const checkExistingSession = async () => {
      await account.get();
      navigate('/presentations');
    };

    checkExistingSession();
  }, [navigate]);

  useEffect(() => {
    if (touchedFields.has('email') && email) {
      const error = getFieldValidationMessage('email', email);
      if (error) {
        addValidationMessage('email', error, 'error');
      } else {
        removeValidationMessage('email');
      }
    }

    if (touchedFields.has('password') && password) {
      const error = getFieldValidationMessage('password', password);
      if (error) {
        addValidationMessage('password', error, 'error');
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

    const emailError = getFieldValidationMessage('email', email);
    if (emailError) {
      addValidationMessage('email', emailError, 'error');
      isValid = false;
    }

    const passwordError = getFieldValidationMessage('password', password);
    if (passwordError) {
      addValidationMessage('password', passwordError, 'error');
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

      setTimeout(() => navigate('/presentations'), TRANSITION_DELAY.AFTER_SUCCESS);
    } catch (error: unknown) {
      let errorMessage = LOGIN_NOTIFICATIONS.ERROR.INVALID_CREDENTIALS;

      const appwriteError = error as AppwriteError;

      if (appwriteError.code === 401 && appwriteError.message?.includes('session is active')) {
        addNotification('Вы уже вошли в систему. Перенаправляем...', 'info', 2000);
        setTimeout(() => navigate('/presentations'), 2000);
      } else {
        addNotification(errorMessage, 'error', NOTIFICATION_TIMEOUT.ERROR);
      }
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
                  title: 'Автосохранение и синхронизация',
                  text: 'Все изменения сохраняются автоматически. Возвращайтесь к работе с любого устройства',
                  icon: (
                    <>
                      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </>
                  ),
                },
                {
                  title: 'Полный контроль над слайдами',
                  text: 'Изменяйте порядок слайдов, дублируйте, нумеруйте и управляйте презентацией',
                  icon: (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </>
                  ),
                },
                {
                  title: 'Drag & Drop и группировка',
                  text: 'Перетаскивайте элементы, группируйте объекты для удобного редактирования',
                  icon: (
                    <>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </>
                  ),
                },
                {
                  title: 'Undo/Redo и правые кнопки',
                  text: 'Отменяйте действия, используйте контекстное меню для быстрого доступа',
                  icon: (
                    <>
                      <path d="M3 6h18" />
                      <path d="M3 12h18" />
                      <path d="M3 18h18" />
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
