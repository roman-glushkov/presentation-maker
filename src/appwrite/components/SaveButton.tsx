'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { PresentationService } from '../presentation-service';
import { account, AppwriteUser } from '../client';
import { setPresentationId } from '../../store/editorSlice';

export default function SaveButton({ onSave }: { onSave?: () => void }) {
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);
  const dispatch = useDispatch();

  useEffect(() => {
    account
      .get<AppwriteUser>()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleSave = async () => {
    if (!user || saving) return;

    setSaving(true);
    try {
      const result = await PresentationService.savePresentation(
        presentation,
        user.$id,
        user.name || user.email,
        presentationId
      );

      if (result.id) {
        dispatch(setPresentationId(result.id));
        console.log('✅ Презентация сохранена, ID:', result.id);
      }

      if (onSave) {
        onSave();
      }
    } catch (error: any) {
      console.error('❌ Ошибка сохранения:', error);

      if (error.message?.includes('longer than')) {
        alert('❌ Ошибка: Презентация слишком большая. Попробуйте удалить некоторые элементы.');
      } else {
        alert(`❌ Не удалось сохранить презентацию: ${error.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving || !user}
      style={{
        display: 'none',
        position: 'absolute',
        visibility: 'hidden',
      }}
      className="save-button"
    >
      Сохранить
    </button>
  );
}
