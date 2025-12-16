// appwrite/notifications/types.ts
export type NotificationType = 'success' | 'error' | 'info' | 'loading';

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
