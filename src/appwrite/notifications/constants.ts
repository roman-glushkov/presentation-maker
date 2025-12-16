// appwrite/notifications/constants.ts
export const NOTIFICATION_TIMEOUT = {
  SUCCESS: 5000, // 5 секунд
  ERROR: 7000, // 7 секунд
  INFO: 4000, // 4 секунды
  LOADING: -1, // Не удаляется автоматически
} as const;

export const TRANSITION_DELAY = {
  AFTER_SUCCESS: 4000, // 4 секунды после успешной регистрации
  BEFORE_NAVIGATION: 1000, // 1 секунда перед навигацией
} as const;
