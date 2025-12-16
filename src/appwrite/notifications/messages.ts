// appwrite/notifications/messages.ts
export const REGISTER_NOTIFICATIONS = {
  SUCCESS: {
    CREATING_SESSION: 'Создаём сессию...',
    REGISTRATION_SUCCESS: 'Регистрация завершена успешно!',
    WELCOME: 'Добро пожаловать в SlideCraft!',
  },
  ERROR: {
    GENERIC: 'Произошла ошибка при регистрации. Попробуйте еще раз.',
    NETWORK: 'Проблемы с соединением. Проверьте интернет',
    USER_EXISTS: 'Пользователь с таким email уже существует',
    INVALID_CREDENTIALS: 'Некорректные данные. Проверьте все поля',
    INVALID_EMAIL: 'Некорректный email адрес',
    WEAK_PASSWORD: 'Пароль не соответствует требованиям',
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

// Добавляем константу для ошибок Appwrite
export const APPWRITE_ERRORS = {
  400: 'Некорректные данные',
  409: 'Пользователь уже существует',
  401: 'Неавторизованный доступ',
  500: 'Внутренняя ошибка сервера',
} as const;
