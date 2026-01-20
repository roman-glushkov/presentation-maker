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
  title: string;
  setTitle: (title: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  existingTitles: string[];
  touched: boolean;
  setTouched: (touched: boolean) => void;

  titleError: string | undefined;
  isChanged: boolean;
  validation: {
    isValid: boolean;
    error?: string;
    message?: string;
  };

  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  clearState: () => void;

  generateDefaultTitle: (existingTitles: string[]) => string;
}

export function usePresentationModal({
  mode,
  initialTitle = '',
  presentationId,
  isOpen,
}: UsePresentationModalOptions): UsePresentationModalReturn {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const {
    addValidationMessage,
    removeValidationMessage,
    clearValidationMessages,
    getValidationMessage,
  } = useNotifications();

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

  useEffect(() => {
    if (!isOpen) return;

    const loadExistingTitles = async () => {
      try {
        const currentUser = await account.get<AppwriteUser>();
        const presentations = await PresentationService.getUserPresentations(currentUser.$id);

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

        if (mode === 'create') {
          const defaultTitle = generateDefaultTitle(titles);
          setTitle(defaultTitle);
        }
      } catch {
        addValidationMessage('presentations', 'Failed to load presentations', 'error');
        setExistingTitles([]);
      }
    };

    loadExistingTitles();
    clearValidationMessages();
    setTouched(false);
  }, [
    isOpen,
    mode,
    presentationId,
    clearValidationMessages,
    generateDefaultTitle,
    addValidationMessage,
  ]);

  useEffect(() => {
    if (!touched) return;

    const trimmedTitle = title.trim();
    removeValidationMessage('title');

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

  const trimmedTitle = title.trim();
  const titleError = getValidationMessage('title');
  const isChanged = trimmedTitle.toLowerCase() !== initialTitle.toLowerCase();
  const validation = validatePresentationTitle(title, existingTitles);

  return {
    title,
    setTitle,
    loading,
    setLoading,
    existingTitles,
    touched,
    setTouched,

    titleError,
    isChanged,
    validation,

    handleTitleChange,
    handleBlur,
    clearState,

    generateDefaultTitle,
  };
}
