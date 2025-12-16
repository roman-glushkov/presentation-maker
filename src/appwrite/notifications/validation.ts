// appwrite/notifications/validation.ts
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: 'Все поля обязательны для заполнения',
  INVALID_EMAIL: 'Введите корректный email адрес (например: user@company.com)',
  PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 8 символов',
  NAME_TOO_SHORT: 'Имя должно содержать минимум 2 символа',
} as const;

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

export type ValidationError = keyof typeof VALIDATION_MESSAGES;

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
