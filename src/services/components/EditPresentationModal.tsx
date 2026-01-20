'use client';
import React from 'react';
import { usePresentationModal } from '../hooks/usePresentationModal';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/EditPresentationModal.css';

interface EditPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (presentationId: string, newTitle: string) => Promise<void>;
  presentationId: string;
  currentTitle: string;
}

export default function EditPresentationModal({
  isOpen,
  onClose,
  onUpdate,
  presentationId,
  currentTitle,
}: EditPresentationModalProps) {
  const { hasValidationErrors, addNotification } = useNotifications();

  const {
    title,
    loading,
    titleError,
    isChanged,
    validation,
    handleTitleChange,
    handleBlur,
    clearState,
    setLoading,
  } = usePresentationModal({
    mode: 'edit',
    initialTitle: currentTitle,
    presentationId,
    isOpen,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isChanged) {
      onClose();
      return;
    }

    if (!validation.isValid) return;

    setLoading(true);
    try {
      await onUpdate(presentationId, title.trim());
      onClose();
      clearState();
    } catch {
      addNotification('Failed to update presentation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearState();
    onClose();
  };

  if (!isOpen) return null;

  const trimmedTitle = title.trim();

  return (
    <div className="edit-presentation-modal-overlay">
      <div className="edit-presentation-modal">
        <h2 className="edit-presentation-modal-title">Изменить название презентации</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div className="edit-presentation-modal-label-container">
              <label className="edit-presentation-modal-label">Название презентации</label>
            </div>

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              className={`edit-presentation-modal-input ${titleError ? 'error' : ''}`}
              autoFocus
              disabled={loading}
            />

            {titleError && (
              <div className="edit-presentation-modal-error">
                <span>{titleError}</span>
              </div>
            )}
          </div>

          <div className="edit-presentation-modal-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="edit-presentation-modal-cancel"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="edit-presentation-modal-submit"
              disabled={loading || !trimmedTitle || hasValidationErrors() || !isChanged}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
