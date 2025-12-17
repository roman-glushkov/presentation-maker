'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { PresentationService } from '../services/PresentationService';
import { account, AppwriteUser, AccountUser } from '../client';
import { setPresentationId } from '../../store/editorSlice';

export default function SaveButton({ onSave }: { onSave?: () => void }) {
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<AccountUser | null>(null);
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);
  const dispatch = useDispatch();

  useEffect(() => {
    account.get<AppwriteUser>().then((userData) => setUser(userData as AccountUser));
  }, []);

  const handleSave = async () => {
    if (!user || saving) return;

    setSaving(true);
    const userName = user.name || user.email || '';

    const result = await PresentationService.savePresentation(
      presentation,
      user.$id,
      userName,
      presentationId
    );

    if (result.id) {
      dispatch(setPresentationId(result.id));
    }

    if (onSave) {
      onSave();
    }

    setSaving(false);
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
