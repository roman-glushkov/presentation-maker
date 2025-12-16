// C:\PGTU\FRONT-end\presentation maker\src\appwrite\useAutoSave.ts
import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PresentationService } from '../services/PresentationService';
import { account } from './../client';

export function useAutoSave(intervalMs = 15000) {
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const savePresentation = useCallback(async () => {
    if (isSaving || !presentationId) return;

    try {
      const user = await account.get();
      const userName = user.name || user.email || '';

      setIsSaving(true);
      await PresentationService.savePresentation(presentation, user.$id, userName, presentationId);
      setLastSaved(new Date());
    } catch {
      // Ошибка сохраняется автоматически
    } finally {
      setIsSaving(false);
    }
  }, [presentation, isSaving, presentationId]);

  useEffect(() => {
    if (!presentationId) return;

    const interval = setInterval(savePresentation, intervalMs);
    return () => clearInterval(interval);
  }, [presentationId, intervalMs, savePresentation]);

  return { isSaving, lastSaved, saveNow: savePresentation };
}
