'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';
import { account } from '../client';
import { useNotifications } from '../hooks/useNotifications';
import {
  REGISTER_NOTIFICATIONS,
  NOTIFICATION_TIMEOUT,
  TRANSITION_DELAY,
  getFieldValidationMessage,
} from '../notifications';

interface AppwriteError {
  code?: number;
  message?: string;
  type?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
    hasValidationErrors,
  } = useNotifications();

  useEffect(() => {
    if (touchedFields.has('name') && name) {
      const error = getFieldValidationMessage('name', name);
      if (error) {
        addValidationMessage('name', error, 'error');
      } else {
        removeValidationMessage('name');
      }
    }

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
  }, [name, email, password, touchedFields, addValidationMessage, removeValidationMessage]);

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  const validateForm = (): boolean => {
    clearValidationMessages();
    let isValid = true;

    const nameError = getFieldValidationMessage('name', name);
    if (nameError) {
      addValidationMessage('name', nameError, 'error');
      isValid = false;
    }

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

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearNotifications();

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await account.create(ID.unique(), email, password, name);

      addNotification(
        REGISTER_NOTIFICATIONS.SUCCESS.CREATING_SESSION,
        'info',
        NOTIFICATION_TIMEOUT.INFO
      );

      await account.createEmailPasswordSession(email, password);

      addNotification(
        REGISTER_NOTIFICATIONS.SUCCESS.REGISTRATION_SUCCESS,
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );

      addNotification(
        REGISTER_NOTIFICATIONS.SUCCESS.WELCOME,
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );

      setTimeout(() => navigate('/presentations'), TRANSITION_DELAY.AFTER_SUCCESS);
    } catch (error: unknown) {
      let errorMessage: string = REGISTER_NOTIFICATIONS.ERROR.GENERIC;

      const appwriteError = error as AppwriteError;

      if (appwriteError.code === 409) {
        errorMessage = REGISTER_NOTIFICATIONS.ERROR.USER_EXISTS;
      } else if (appwriteError.code === 401) {
        errorMessage = REGISTER_NOTIFICATIONS.ERROR.INVALID_CREDENTIALS;
      } else if (appwriteError.message?.toLowerCase().includes('password')) {
        errorMessage = REGISTER_NOTIFICATIONS.ERROR.WEAK_PASSWORD;
      } else if (appwriteError.message?.toLowerCase().includes('network')) {
        errorMessage = REGISTER_NOTIFICATIONS.ERROR.NETWORK;
      }

      addNotification(errorMessage, 'error', NOTIFICATION_TIMEOUT.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const nameError = getValidationMessage('name');
  const emailError = getValidationMessage('email');
  const passwordError = getValidationMessage('password');

  const features = [
    {
      id: 'feature1',
      title: 'Текстовые и графические элементы',
      text: 'Добавляйте текст, изображения, фигуры и настраивайте их оформление',
      icon: (
        <>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </>
      ),
    },
    {
      id: 'feature2',
      title: 'Гибкое редактирование слайдов',
      text: 'Изменяйте размер, положение и стиль элементов, перетаскивайте их мышью',
      icon: (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      ),
    },
    {
      id: 'feature3',
      title: 'Управление несколькими слайдами',
      text: 'Создавайте, удаляйте, дублируйте и переупорядочивайте слайды',
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </>
      ),
    },
    {
      id: 'feature4',
      title: 'Сохранение и загрузка проектов',
      text: 'Храните презентации в облаке и возвращайтесь к ним позже',
      icon: (
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </>
      ),
    },
  ];

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
              Регистрация
            </a>
          </div>
        </nav>

        <div className="presentation-auth-container">
          <div className="presentation-sidebar">
            <h2 className="presentation-side-title">Присоединяйтесь к SlideCraft</h2>
            <p className="presentation-side-subtitle">
              Начните создавать презентации с помощью нашего конструктора
            </p>

            <div className="presentation-features">
              {features.map(({ id, title, text, icon }) => (
                <div className="presentation-feature" key={id}>
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
              <h1 className="presentation-auth-title">Создайте аккаунт в SlideCraft</h1>
              <p className="presentation-auth-subtitle">
                Получите доступ ко всем возможностям конструктора презентаций
              </p>
            </div>

            <form onSubmit={register} className="presentation-auth-form">
              <div className="presentation-form-group">
                <label className="presentation-form-label">Как вас зовут?</label>
                <input
                  className={`presentation-form-input ${nameError ? 'presentation-form-input-error' : ''}`}
                  type="text"
                  placeholder="Александр Петров"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={loading}
                />
                {nameError && (
                  <div className="presentation-form-error">
                    <span>{nameError}</span>
                  </div>
                )}
              </div>

              <div className="presentation-form-group">
                <label className="presentation-form-label">Ваш рабочий Email</label>
                <input
                  className={`presentation-form-input ${emailError ? 'presentation-form-input-error' : ''}`}
                  type="email"
                  placeholder="alexander@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
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
                <label className="presentation-form-label">Создайте надежный пароль</label>
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

              <button
                className="presentation-auth-button"
                type="submit"
                disabled={loading || hasValidationErrors()}
              >
                {loading ? (
                  <div className="presentation-button-content">
                    <div className="presentation-spinner" />
                    <span>Создаём аккаунт...</span>
                  </div>
                ) : (
                  'Начать презентацию'
                )}
              </button>
            </form>

            <div className="presentation-link-text">
              Уже есть аккаунт?{' '}
              <a href="#" onClick={handleSwitchToLogin} className="presentation-link">
                Войти
              </a>
            </div>

            <div className="presentation-agreement">
              <p className="presentation-agreement-text">
                Нажимая «Начать создавать презентации», вы соглашаетесь с{' '}
                <a href="#" className="presentation-link">
                  Условиями использования
                </a>{' '}
                и{' '}
                <a href="#" className="presentation-link">
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
