// src/appwrite/components/AutoSaveIndicator.tsx
'use client';
import React, { CSSProperties } from 'react';
import { useAutoSave } from '../useAutoSave';

// Стили в виде объекта
const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    color: 'white',
    borderRadius: '12px',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
  },
  spinner: {
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Добавляем стили в документ
const addStylesToDocument = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'autosave-styles';
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

export default function AutoSaveIndicator() {
  const { isSaving, lastSaved } = useAutoSave();

  React.useEffect(() => {
    addStylesToDocument();
  }, []);

  if (!lastSaved && !isSaving) return null;

  const containerStyle = {
    ...styles.container,
    background: isSaving
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  };

  return (
    <div style={containerStyle}>
      {isSaving ? (
        <>
          <div style={styles.spinner} />
          <span>Сохранение...</span>
        </>
      ) : (
        <>
          <span>✓</span>
          <span>Сохранено: {lastSaved?.toLocaleTimeString()}</span>
        </>
      )}
    </div>
  );
}
