import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PresentationService } from '../services/PresentationService';
import { account, AppwriteUser, AccountUser } from '../client';

export function useAutoSave(intervalMs = 15000) {
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    account
      .get<AppwriteUser>()
      .then((userData) => {
        setUser(userData as AccountUser);
        setIsReady(true);
      })
      .catch(() => {
        console.log('Пользователь не авторизован');
        setIsReady(false);
      });
  }, []);

  const savePresentation = useCallback(async () => {
    if (!user || isSaving || !presentationId) {
      console.log('Не могу сохранить:', {
        hasUser: !!user,
        isSaving,
        presentationId,
      });
      return;
    }

    setIsSaving(true);
    console.log('🔄 Сохраняем презентацию...', presentationId);

    try {
      const userName = user.name || user.email || '';

      const result = await PresentationService.savePresentation(
        presentation,
        user.$id,
        userName,
        presentationId
      );

      setLastSaved(new Date());
      console.log('✅ Сохранено успешно:', result.id);
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
    } finally {
      setIsSaving(false);
    }
  }, [presentation, user, isSaving, presentationId]);

  useEffect(() => {
    if (!user || !presentationId || !isReady) {
      console.log('Автосохранение не активно:', {
        hasUser: !!user,
        hasPresentationId: !!presentationId,
        isReady,
      });
      return;
    }

    console.log('✅ Автосохранение активно для:', presentationId);

    const interval = setInterval(() => {
      savePresentation();
    }, intervalMs);

    const handleBeforeUnload = () => {
      if (presentationId) {
        savePresentation();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [presentation, user, presentationId, isReady, intervalMs, savePresentation]);

  return {
    isSaving,
    lastSaved,
    saveNow: savePresentation,
  };
}
