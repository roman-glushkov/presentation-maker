// C:\PGTU\FRONT-end\presentation maker\src\appwrite\components\SaveButton.tsx
'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { PresentationService } from '../PresentationService';
import { account, AppwriteUser } from '../client';
import { setPresentationId } from '../../store/editorSlice';

export default function SaveButton({ onSave }: { onSave?: () => void }) {
  const [saving, setSaving] = useState(false);
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      const user = await account.get<AppwriteUser>();
      const userName = user.name || user.email || '';

      setSaving(true);
      const result = await PresentationService.savePresentation(
        presentation,
        user.$id,
        userName,
        presentationId
      );

      if (result.$id) {
        dispatch(setPresentationId(result.$id));
        alert('✅ Презентация сохранена');
      }

      if (onSave) onSave();
    } catch {
      alert('❌ Не удалось сохранить презентацию');
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      style={{
        display: 'none',
        position: 'absolute',
        visibility: 'hidden',
      }}
    >
      Сохранить
    </button>
  );
}
