import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PresentationService } from '../services/presentationService';
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
        setIsReady(false);
      });
  }, []);

  const savePresentation = useCallback(async () => {
    if (!user || isSaving || !presentationId) {
      return;
    }

    setIsSaving(true);

    try {
      const userName = user.name || user.email || '';
      await PresentationService.savePresentation(presentation, user.$id, userName, presentationId);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, [presentation, user, isSaving, presentationId]);

  useEffect(() => {
    if (!user || !presentationId || !isReady) {
      return;
    }

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
