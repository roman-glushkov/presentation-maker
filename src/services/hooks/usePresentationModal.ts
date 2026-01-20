import React, { useState, useEffect, useCallback } from 'react';
import { PresentationService } from '../services/PresentationService';
import { account, AppwriteUser } from '../client';
import { useNotifications } from './useNotifications';
import {
  validatePresentationTitle,
  getPresentationValidationMessage,
} from '../notifications/validation';

interface UsePresentationModalOptions {
  mode: 'create' | 'edit';
  initialTitle?: string;
  presentationId?: string;
  isOpen: boolean;
}

interface UsePresentationModalReturn {
  // Состояния
  title: string;
  setTitle: (title: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  existingTitles: string[];
  touched: boolean;
  setTouched: (touched: boolean) => void;

  // Валидация
  titleError: string | undefined;
  isChanged: boolean;
  validation: {
    isValid: boolean;
    error?: string;
    message?: string;
  };

  // Обработчики
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  clearState: () => void;

  // Утилиты
  generateDefaultTitle: (existingTitles: string[]) => string;
}

export function usePresentationModal({
  mode,
  initialTitle = '',
  presentationId,
  isOpen,
}: UsePresentationModalOptions): UsePresentationModalReturn {
  // Состояния
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  // Хуки
  const {
    addValidationMessage,
    removeValidationMessage,
    clearValidationMessages,
    getValidationMessage,
  } = useNotifications();

  // Генерация дефолтного названия
  const generateDefaultTitle = useCallback((titles: string[]): string => {
    const baseName = 'моя презентация';
    let maxNumber = 0;

    titles.forEach((title) => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.startsWith(baseName)) {
        const match = lowerTitle.match(new RegExp(`^${baseName}\\s*(\\d+)$`));
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNumber) maxNumber = num;
        }
      }
    });

    return `Моя презентация ${maxNumber + 1}`;
  }, []);

  // Загрузка существующих названий
  useEffect(() => {
    if (!isOpen) return;

    const loadExistingTitles = async () => {
      try {
        const currentUser = await account.get<AppwriteUser>();
        const presentations = await PresentationService.getUserPresentations(currentUser.$id);

        // Фильтрация в зависимости от режима
        const filteredPresentations = presentations.filter((p) => {
          if (mode === 'edit' && presentationId) {
            return (p.id || p.$id) !== presentationId;
          }
          return true;
        });

        const titles = filteredPresentations
          .map((p) => p.title?.toLowerCase().trim() || '')
          .filter((t) => t);

        setExistingTitles(titles);

        // Автогенерация названия для режима создания
        if (mode === 'create') {
          const defaultTitle = generateDefaultTitle(titles);
          setTitle(defaultTitle);
        }
      } catch (error) {
        console.error('Failed to load presentations:', error);
        setExistingTitles([]);
      }
    };

    loadExistingTitles();
    clearValidationMessages();
    setTouched(false);
  }, [isOpen, mode, presentationId, clearValidationMessages, generateDefaultTitle]);

  // Валидация при изменении title
  useEffect(() => {
    if (!touched) return;

    const trimmedTitle = title.trim();
    removeValidationMessage('title');

    // Для редактирования: если не изменилось - не валидируем
    if (mode === 'edit' && trimmedTitle.toLowerCase() === initialTitle.toLowerCase()) {
      return;
    }

    const validation = validatePresentationTitle(title, existingTitles);
    if (!validation.isValid && validation.error) {
      const message = getPresentationValidationMessage(validation.error, trimmedTitle);
      addValidationMessage('title', message, 'error');
    }
  }, [
    title,
    touched,
    existingTitles,
    initialTitle,
    mode,
    addValidationMessage,
    removeValidationMessage,
  ]);

  // Обработчики
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!touched) setTouched(true);
  };

  const handleBlur = () => {
    if (!touched) setTouched(true);
  };

  const clearState = () => {
    setTitle(mode === 'create' ? '' : initialTitle);
    setLoading(false);
    setTouched(false);
    clearValidationMessages();
  };

  // Вычисляемые значения
  const trimmedTitle = title.trim();
  const titleError = getValidationMessage('title');
  const isChanged = trimmedTitle.toLowerCase() !== initialTitle.toLowerCase();
  const validation = validatePresentationTitle(title, existingTitles);

  return {
    // Состояния
    title,
    setTitle,
    loading,
    setLoading,
    existingTitles,
    touched,
    setTouched,

    // Валидация
    titleError,
    isChanged,
    validation,

    // Обработчики
    handleTitleChange,
    handleBlur,
    clearState,

    // Утилиты
    generateDefaultTitle,
  };
}
