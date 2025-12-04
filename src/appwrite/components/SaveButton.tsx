// src/appwrite/components/SaveButton.tsx
'use client';
import React, { useState, useEffect, CSSProperties } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { PresentationService } from '../presentation-service';
import { account, AppwriteUser } from '../client';
import { setPresentationId } from '../../store/editorSlice';

// Стили в виде объектов
const styles: { [key: string]: CSSProperties } = {
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Добавляем стили в документ
const addStylesToDocument = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'save-button-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

export default function SaveButton() {
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState<Date | null>(null);
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const presentationId = useSelector((state: RootState) => state.editor.presentationId);
  const dispatch = useDispatch();

  useEffect(() => {
    addStylesToDocument();
  }, []);

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

      // ВАЖНО: Сохраняем ID презентации в Redux store
      if (result.id) {
        dispatch(setPresentationId(result.id));
        console.log('✅ ID презентации сохранен в store:', result.id);
      }

      setLastSave(new Date());
      alert('✅ Презентация успешно сохранена!');
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={handleSave}
        disabled={saving || !user}
        style={{
          padding: '10px 20px',
          background: saving
            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: saving ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: !user ? 0.5 : 1,
        }}
      >
        {saving ? (
          <>
            <div style={styles.spinner} />
            <span>Сохранение...</span>
          </>
        ) : (
          <>
            <span>💾</span>
            <span>Сохранить</span>
          </>
        )}
      </button>

      {lastSave && (
        <span
          style={{
            fontSize: '12px',
            color: '#64748b',
            fontStyle: 'italic',
          }}
        >
          Последнее сохранение: {lastSave.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
