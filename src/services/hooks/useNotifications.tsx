//хук для показа и работы уведомлений
import React, { useState, useCallback, createContext, useContext } from 'react';
import type {
  Notification,
  NotificationType,
  ValidationNotification,
} from '../notifications/types';

interface NotificationsContextType {
  notifications: Notification[];
  validationMessages: ValidationNotification[];
  addNotification: (message: string, type?: NotificationType, timeout?: number) => number;
  addValidationMessage: (field: string, message: string, type?: NotificationType) => number;
  removeNotification: (id: number) => void;
  removeValidationMessage: (field: string) => void;
  clearNotifications: () => void;
  clearValidationMessages: () => void;
  getValidationMessage: (field: string) => string | undefined;
  hasValidationErrors: () => boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [validationMessages, setValidationMessages] = useState<ValidationNotification[]>([]);
  //по какомму принципу добавляется увеломление
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
      //автозакрытие уведомления по таймеру
      if (notification.autoClose && timeout && timeout > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, timeout);
      }

      return id;
    },
    []
  );
  //валидные сообщения
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
  //уведа
  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);
  //валидность
  const removeValidationMessage = useCallback((field: string) => {
    setValidationMessages((prev) => prev.filter((msg) => msg.field !== field));
  }, []);
  //очиста от уведомления
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  //чистим валидности
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

  return (
    //выводим уведомления, так как это глобальные компоненты
    <NotificationsContext.Provider
      value={{
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
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  return context as NotificationsContextType;
};
