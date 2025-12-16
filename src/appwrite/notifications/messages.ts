// appwrite/notifications/messages.ts
export const REGISTER_NOTIFICATIONS = {
  SUCCESS: {
    CREATING_SESSION: 'Создаём сессию...',
    REGISTRATION_SUCCESS: 'Регистрация завершена успешно!',
    WELCOME: 'Добро пожаловать в SlideCraft!',
    LOGOUT_SUCCESS: 'Вы успешно вышли из системы',
  },
  ERROR: {
    GENERIC: 'Произошла ошибка при регистрации. Попробуйте еще раз.',
    NETWORK: 'Проблемы с соединением. Проверьте интернет',
    USER_EXISTS: 'Пользователь с таким email уже существует',
    INVALID_CREDENTIALS: 'Некорректные данные. Проверьте все поля',
    INVALID_EMAIL: 'Некорректный email адрес',
    WEAK_PASSWORD: 'Пароль не соответствует требованиям',
    LOGOUT_FAILED: 'Ошибка при выходе из системы',
  },
} as const;

export const LOGIN_NOTIFICATIONS = {
  INFO: {
    LOGGING_IN: 'Выполняем вход...',
  },
  SUCCESS: {
    LOGIN_SUCCESS: 'Вход выполнен успешно!',
    WELCOME_BACK: 'С возвращением в SlideCraft!',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Неверный email или пароль',
    USER_NOT_FOUND: 'Пользователь не найден',
  },
} as const;

export const GENERAL_NOTIFICATIONS = {
  SUCCESS: {
    SAVED: 'Презентация успешно сохранена',
    LOGOUT_SUCCESS: 'Вы успешно вышли из системы',
  },
  ERROR: {
    SAVE_FAILED: 'Ошибка при сохранении презентации',
    LOGOUT_FAILED: 'Ошибка при выходе из системы',
  },
} as const;

// Добавляем константу для ошибок Appwrite
export const APPWRITE_ERRORS = {
  400: 'Некорректные данные',
  409: 'Пользователь уже существует',
  401: 'Неавторизованный доступ',
  500: 'Внутренняя ошибка сервера',
} as const;

// Таймауты уведомлений
export const NOTIFICATION_TIMEOUT = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 2000,
} as const;
