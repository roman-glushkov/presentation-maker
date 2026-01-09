import { useState, useCallback } from 'react';
import type {
  Notification,
  NotificationType,
  ValidationNotification,
} from '../notifications/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [validationMessages, setValidationMessages] = useState<ValidationNotification[]>([]);

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

      if (notification.autoClose && timeout && timeout > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, timeout);
      }

      return id;
    },
    []
  );

  const addValidationMessage = useCallback(
    (field: string, message: string, type: NotificationType = 'error') => {
      const id = Date.now();
      const validationMessage: ValidationNotification = {
        id,
        field,
        message,
        type,
        autoClose: false,
      };

      setValidationMessages((prev) =>
        prev.filter((msg) => msg.field !== field).concat(validationMessage)
      );

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const removeValidationMessage = useCallback((field: string) => {
    setValidationMessages((prev) => prev.filter((msg) => msg.field !== field));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearValidationMessages = useCallback(() => {
    setValidationMessages([]);
  }, []);

  const getValidationMessage = useCallback(
    (field: string): string | undefined => {
      const message = validationMessages.find((msg) => msg.field === field);
      return message?.message;
    },
    [validationMessages]
  );

  const hasValidationErrors = useCallback((): boolean => {
    return validationMessages.length > 0;
  }, [validationMessages]);

  return {
    notifications,
    validationMessages,
    addNotification,
    addValidationMessage,
    removeNotification,
    removeValidationMessage,
    clearNotifications,
    clearValidationMessages,
    getValidationMessage,
    hasValidationErrors,
  };
};
