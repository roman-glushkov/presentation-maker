export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  autoClose?: boolean;
  timeout?: number;
}

export interface RegisterError {
  code?: number;
  message: string;
  type: 'validation' | 'appwrite' | 'network';
}

export interface ValidationNotification {
  id: number;
  message: string;
  type: NotificationType;
  autoClose: boolean;
  timeout?: number;
  field: string;
}
