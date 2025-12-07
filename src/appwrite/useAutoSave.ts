// src/appwrite/useAutoSave.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { PresentationService } from './presentation-service';
import { account, AppwriteUser } from './client';

export function useAutoSave(intervalMs = 15000) {
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);
  const lastSaveRef = useRef<number>(Date.now());
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [user, setUser] = useState<AppwriteUser | null>(null);

  // Получаем информацию о пользователе
  useEffect(() => {
    account
      .get<AppwriteUser>()
      .then(setUser)
      .catch(() => {
        console.log('Пользователь не авторизован, автосохранение отключено');
      });
  }, []);

  // Функция сохранения
  const savePresentation = useCallback(async () => {
    if (!user || isSaving) return;

    // Не сохраняем, если нет presentationId (новая презентация еще не сохранена)
    if (!presentationId) {
      console.log('⚠️ Пропускаем сохранение: презентация еще не сохранена');
      alert('Пожалуйста, сначала создайте презентацию');
      return;
    }

    // Не сохраняем, если прошло меньше 2 секунд с последнего сохранения
    if (Date.now() - lastSaveRef.current < 2000) {
      console.log('⚠️ Слишком частое сохранение, пропускаем');
      return;
    }

    setIsSaving(true);

    try {
      const result = await PresentationService.savePresentation(
        presentation,
        user.$id,
        user.name || user.email,
        presentationId
      );

      lastSaveRef.current = Date.now();
      setLastSaved(new Date());
      console.log('✅ Презентация сохранена:', result.id);
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
      alert('Ошибка при сохранении презентации. Проверьте консоль для подробностей.');
    } finally {
      setIsSaving(false);
    }
  }, [presentation, user, isSaving, presentationId]);

  // Настраиваем автосохранение
  useEffect(() => {
    if (!user || !presentationId) return;

    const scheduleSave = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        savePresentation();
      }, intervalMs);
    };

    scheduleSave();

    // Сохраняем при закрытии страницы
    const handleBeforeUnload = () => {
      if (!isSaving && presentationId) {
        savePresentation();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [presentation, user, intervalMs, savePresentation, isSaving, presentationId]);

  return {
    isSaving,
    lastSaved,
    saveNow: savePresentation, // Экспортируем функцию для ручного сохранения
  };
}
