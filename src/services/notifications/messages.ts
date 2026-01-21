export const AUTH_NOTIFICATIONS = {
  INFO: {
    ALREADY_LOGGED_IN: 'Вы уже вошли в систему. Перенаправляем...',
  },
} as const;

export const PLAYER_NOTIFICATIONS = {
  INFO: {
    LOADING: 'Загружаем презентацию...',
  },
  ERROR: {
    NOT_FOUND: 'Презентация не найдена',
    LOAD_FAILED: 'Не удалось загрузить презентацию',
  },
} as const;

export const PRESENTATION_LIST_NOTIFICATIONS = {
  SUCCESS: {
    RENAMED: 'Название презентации успешно изменено',
    DELETED: 'Презентация успешно удалена',
    EXPORTED: (title: string) => `Презентация "${title}" успешно экспортирована в PDF!`,
    EXPORT_STARTED: 'Начинаем экспорт презентации в PDF...',
  },

  ERROR: {
    RENAME_FAILED: 'Не удалось изменить название презентации',
    DELETE_FAILED: 'Не удалось удалить презентацию',
    EXPORT_FAILED: 'Не удалось экспортировать презентацию в PDF',
    PRESENTATION_NOT_FOUND: 'Презентация не найдена',
  },

  INFO: {
    EXPORTING: 'Экспорт в PDF...',
  },
} as const;

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
    WEAK_PASSWORD: 'Пароль не соответствует требованиям',
  },
} as const;

export type RegisterErrorType = keyof typeof REGISTER_NOTIFICATIONS.ERROR;

export const LOGIN_NOTIFICATIONS = {
  SUCCESS: {
    LOGIN_SUCCESS: 'Вход выполнен успешно!',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Неверный email или пароль',
  },
} as const;

export const GENERAL_NOTIFICATIONS = {
  SUCCESS: {
    SAVED: 'Презентация успешно сохранена',
  },
  ERROR: {
    SAVE_FAILED: 'Ошибка при сохранении презентации',
  },
} as const;

export const IMAGE_NOTIFICATIONS = {
  ERROR: {
    NOT_AN_IMAGE: 'Файл не является изображением',
    NO_SLIDE_SELECTED: 'Выберите слайд для добавления изображения',
    UPLOAD_FAILED: 'Ошибка при загрузке изображения',
  },
  SUCCESS: {
    UPLOADED: 'Изображение успешно загружено',
  },
  INFO: {
    UPLOADING: 'Загружаем изображение...',
  },
} as const;

export const PRESENTATION_NOTIFICATIONS = {
  SUCCESS: {
    LOADED: (count: number) => {
      if (count === 1) return `Загружена ${count} корректная презентация`;
      if (count >= 2 && count <= 4) return `Загружены ${count} корректных презентации`;
      return `Загружено ${count} корректных презентаций`;
    },
    CREATED: '🎉 Презентация успешно создана',
    PRESENTATION_LOADED: (title: string) => `📂 Презентация "${title}" загружена`,
  },

  INFO: {
    LOADING: 'Загружаем ваши презентации...',
    NO_PRESENTATIONS: '📭 У вас пока нет презентаций. Создайте новую!',
    DEMO_LOADED: '🎭 Демо-презентация загружена',
  },

  ERROR: {
    LOAD_FAILED: 'Не удалось загрузить презентации',
    CREATE_FAILED: 'Не удалось создать презентацию',
  },
} as const;
