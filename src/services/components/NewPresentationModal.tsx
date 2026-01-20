// src/services/components/NewPresentationModal.tsx
'use client';
import React from 'react';
import { usePresentationModal } from '../hooks/usePresentationModal';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/NewPresentationModal.css';

interface NewPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
  onCancel: () => void;
}

export default function NewPresentationModal({
  isOpen,
  onClose,
  onCreate,
  onCancel,
}: NewPresentationModalProps) {
  const { hasValidationErrors } = useNotifications();

  const {
    title,
    loading,
    existingTitles,
    titleError,
    validation,
    handleTitleChange,
    handleBlur,
    clearState,
    setLoading,
  } = usePresentationModal({
    mode: 'create',
    isOpen,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation.isValid) return;

    setLoading(true);
    try {
      await onCreate(title.trim());
      onClose();
      clearState(); // Очищаем состояние после успешного создания
    } catch (error) {
      // Обработка ошибки, если нужно
      console.error('Failed to create presentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearState();
    onCancel();
  };

  if (!isOpen) return null;

  const trimmedTitle = title.trim();

  return (
    <div className="new-presentation-modal-overlay">
      <div className="new-presentation-modal">
        <h2 className="new-presentation-modal-title">Создать новую презентацию</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div className="new-presentation-modal-label-container">
              <label className="new-presentation-modal-label">Название презентации</label>
            </div>

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              className={`new-presentation-modal-input ${titleError ? 'error' : ''}`}
              autoFocus
              disabled={loading}
            />

            {titleError && (
              <div className="new-presentation-modal-error">
                <span>{titleError}</span>
              </div>
            )}
          </div>

          {existingTitles.length > 0 && (
            <div className="new-presentation-modal-existing-list">
              <div className="new-presentation-modal-existing-title">
                Ваши существующие презентации ({existingTitles.length}):
              </div>
              <div className="new-presentation-modal-existing-items">
                {existingTitles.slice(0, 5).map((existingTitle, index) => (
                  <div key={index} className="new-presentation-modal-existing-item">
                    • {existingTitle}
                  </div>
                ))}
                {existingTitles.length > 5 && (
                  <div className="new-presentation-modal-existing-more">
                    ... и еще {existingTitles.length - 5} презентаций
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="new-presentation-modal-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="new-presentation-modal-cancel"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="new-presentation-modal-submit"
              disabled={loading || !trimmedTitle || hasValidationErrors()}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
