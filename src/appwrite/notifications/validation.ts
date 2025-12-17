// appwrite/notifications/validation.ts

// Общие сообщения валидации
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: 'Все поля обязательны для заполнения',
  INVALID_EMAIL: 'Введите корректный email адрес (например: user@company.com)',
  PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 8 символов',
  NAME_TOO_SHORT: 'Имя должно содержать минимум 2 символа',
} as const;

// Сообщения валидации для презентаций
export const PRESENTATION_VALIDATION_MESSAGES = {
  REQUIRED: 'Введите название презентации',
  TOO_SHORT: 'Название должно содержать минимум 2 символа',
  TOO_LONG: 'Название должно быть не длиннее 100 символов',
  ONLY_SPACES: 'Название не может состоять только из пробелов',
  DUPLICATE: (title: string) =>
    `У вас уже есть презентация с названием "${title}". Придумайте уникальное название.`,
} as const;

export type ValidationError = keyof typeof VALIDATION_MESSAGES;
export type PresentationValidationError = keyof typeof PRESENTATION_VALIDATION_MESSAGES;

// Валидационные функции для формы регистрации
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateName = (name: string): boolean => {
  return name.length >= 2;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const getValidationMessage = (error: ValidationError): string => {
  return VALIDATION_MESSAGES[error];
};

export const validateRegisterForm = (
  email: string,
  password: string,
  name: string
): { isValid: boolean; error?: ValidationError } => {
  if (!validateRequired(email) || !validateRequired(password) || !validateRequired(name)) {
    return { isValid: false, error: 'REQUIRED_FIELDS' };
  }

  if (!validateEmail(email)) {
    return { isValid: false, error: 'INVALID_EMAIL' };
  }

  if (!validatePassword(password)) {
    return { isValid: false, error: 'PASSWORD_TOO_SHORT' };
  }

  if (!validateName(name)) {
    return { isValid: false, error: 'NAME_TOO_SHORT' };
  }

  return { isValid: true };
};

// Валидационные функции для названия презентации
export const validatePresentationTitleLength = (title: string): boolean => {
  return title.length >= 2;
};

export const validatePresentationTitleMaxLength = (title: string): boolean => {
  return title.length <= 100;
};

export const validatePresentationTitleNotEmpty = (title: string): boolean => {
  return title.trim().length > 0;
};

export const validatePresentationTitleNoOnlySpaces = (title: string): boolean => {
  return title.trim().length > 0 || !title.includes('  ');
};

export const validatePresentationTitleUnique = (
  title: string,
  existingTitles: string[]
): boolean => {
  return !existingTitles.includes(title.toLowerCase().trim());
};

export const getPresentationValidationMessage = (
  error: PresentationValidationError,
  title?: string
): string => {
  const message = PRESENTATION_VALIDATION_MESSAGES[error];
  return typeof message === 'function' ? message(title || '') : message;
};

export const validatePresentationTitle = (
  title: string,
  existingTitles: string[]
): {
  isValid: boolean;
  error?: PresentationValidationError;
  message?: string;
} => {
  const trimmedTitle = title.trim();

  if (!validatePresentationTitleNotEmpty(title)) {
    return { isValid: false, error: 'REQUIRED' };
  }

  if (!validatePresentationTitleNoOnlySpaces(title)) {
    return { isValid: false, error: 'ONLY_SPACES' };
  }

  if (!validatePresentationTitleLength(trimmedTitle)) {
    return { isValid: false, error: 'TOO_SHORT' };
  }

  if (!validatePresentationTitleMaxLength(trimmedTitle)) {
    return { isValid: false, error: 'TOO_LONG' };
  }

  if (!validatePresentationTitleUnique(trimmedTitle, existingTitles)) {
    return {
      isValid: false,
      error: 'DUPLICATE',
      message: getPresentationValidationMessage('DUPLICATE', trimmedTitle),
    };
  }

  return { isValid: true };
};
