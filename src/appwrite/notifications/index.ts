export { REGISTER_NOTIFICATIONS } from './messages';
export { LOGIN_NOTIFICATIONS } from './messages';
export { GENERAL_NOTIFICATIONS } from './messages';
export { PRESENTATION_NOTIFICATIONS } from './messages';
export { IMAGE_NOTIFICATIONS } from './messages';
export { APPWRITE_ERRORS } from './messages';
export { NOTIFICATION_TIMEOUT } from './messages';

export { VALIDATION_MESSAGES, PRESENTATION_VALIDATION_MESSAGES } from './validation';

export {
  validateRegisterForm,
  validateEmail,
  validatePassword,
  validateName,
  validateRequired,
  getValidationMessage,
  validatePresentationTitle,
  validatePresentationTitleLength,
  validatePresentationTitleMaxLength,
  validatePresentationTitleNotEmpty,
  validatePresentationTitleUnique,
  getPresentationValidationMessage,
} from './validation';

export { TRANSITION_DELAY } from './constants';
