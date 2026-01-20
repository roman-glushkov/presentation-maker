//хук используют регистр и логинация, он помогает упростить те кода
import { useEffect } from 'react';
import { getFieldValidationMessage } from '../notifications';
import { useNotifications } from './useNotifications';

type NotificationsApi = Pick<
  ReturnType<typeof useNotifications>,
  'addValidationMessage' | 'removeValidationMessage'
>;

interface FieldConfig {
  name: string;
  value: string;
}

interface Params {
  fields: FieldConfig[];
  touchedFields: Set<string>;
  notifications: NotificationsApi;
}

export function useFieldValidation({ fields, touchedFields, notifications }: Params) {
  const { addValidationMessage, removeValidationMessage } = notifications;

  useEffect(() => {
    fields.forEach(({ name, value }) => {
      if (!touchedFields.has(name) || !value) {
        //проверка что пользователь что-то поменял в инпуте
        return;
      }

      const error = getFieldValidationMessage(name, value); //получаем сообщение об ошибке

      if (error) {
        //показываем или скрываем ошибку
        addValidationMessage(name, error, 'error');
      } else {
        removeValidationMessage(name);
      }
    });
  }, [fields, touchedFields, addValidationMessage, removeValidationMessage]);
}
