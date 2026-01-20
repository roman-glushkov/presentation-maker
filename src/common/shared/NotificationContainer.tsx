import React, { useEffect } from 'react';
import { useNotifications } from '../../services/hooks/useNotifications';
import './styles/NotificationContainer.css';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  useEffect(() => {
    const timers: number[] = [];

    notifications.forEach((notification) => {
      if (notification.autoClose && notification.timeout) {
        const timer = window.setTimeout(() => {
          removeNotification(notification.id);
        }, notification.timeout);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-content">
            <div className="notification-message">{notification.message}</div>
            <button
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              aria-label="Закрыть уведомление"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
