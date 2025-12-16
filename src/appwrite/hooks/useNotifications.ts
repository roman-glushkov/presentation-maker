// hooks/useNotifications.ts
import { useState, useCallback } from 'react';
import type { Notification, NotificationType } from '../notifications/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = 'success', timeout?: number) => {
      const id = Date.now();
      const notification: Notification = {
        id,
        message,
        type,
        autoClose: true,
        timeout,
      };

      setNotifications((prev) => [notification, ...prev]);

      // Автоматическое удаление уведомления если autoClose = true
      if (notification.autoClose && timeout && timeout > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, timeout);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};
