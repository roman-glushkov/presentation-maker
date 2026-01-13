export {
  AUTH_NOTIFICATIONS,
  PLAYER_NOTIFICATIONS,
  PRESENTATION_LIST_NOTIFICATIONS,
  REGISTER_NOTIFICATIONS,
  LOGIN_NOTIFICATIONS,
  GENERAL_NOTIFICATIONS,
  PRESENTATION_NOTIFICATIONS,
  IMAGE_NOTIFICATIONS,
  APPWRITE_ERRORS,
} from './messages';

export {
  VALIDATION_MESSAGES,
  LOGIN_VALIDATION_MESSAGES,
  PRESENTATION_VALIDATION_MESSAGES,
} from './validation';

export {
  validateRegisterForm,
  validateEmail,
  validatePassword,
  validateName,
  validateRequired,
  getValidationMessage,
  getFieldValidationMessage,
  validateLoginForm,
  getLoginValidationMessage,
  validateLoginFields,
  validatePresentationTitle,
  validatePresentationTitleLength,
  validatePresentationTitleMaxLength,
  validatePresentationTitleNotEmpty,
  validatePresentationTitleUnique,
  getPresentationValidationMessage,
} from './validation';

export { NOTIFICATION_TIMEOUT } from './constants';
