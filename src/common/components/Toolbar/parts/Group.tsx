import React, { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction } from '../../../../store/editorSlice';
import { setActiveTextOption, toggleGrid } from '../../../../store/toolbarSlice';
import { NOTIFICATION_TIMEOUT } from '../../../../services/notifications';
import { GROUPS, GroupButton, GroupKey } from '../constants/config';
import { useNotifications } from '../../../../services/hooks/useNotifications';
import { RootState } from '../../../../store';

import { getPopupContent } from './PopupContent';
import { useImageActions } from '../hooks/useImageActions';

import {
  isButtonAvailable,
  getButtonDisabledReason,
  getSelectionType,
} from '../utils/availabilityUtils';
import '../styles/Group.css';
import '../styles/Popups.css';

const menuActions = [
  'ADD_SLIDE',
  'TEXT_COLOR',
  'SHAPE_FILL',
  'SHAPE_STROKE',
  'SHAPE_STROKE_WIDTH',
  'SLIDE_BACKGROUND',
  'TEXT_SIZE',
  'TEXT_FONT',
  'TEXT_ALIGN',
  'TEXT_LINE_HEIGHT',
  'ADD_SHAPE',
  'TEXT_SHADOW',
  'SHAPE_SMOOTHING',
  'LIST_OPTIONS',
];

export default function ToolbarGroup() {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotifications();

  const activeGroup = useAppSelector((state) => state.toolbar.activeGroup) as GroupKey;
  const activeTextOption = useAppSelector((state) => state.toolbar.activeTextOption);
  const gridVisible = useAppSelector((state) => state.toolbar.gridVisible);
  const currentSlideId = useAppSelector((state: RootState) => state.editor.selectedSlideId);

  const popupRef = useRef<HTMLDivElement>(null);

  const selectedElements = useAppSelector((state: RootState) => {
    const currentSlide = state.editor.presentation.slides.find(
      (slide) => slide.id === state.editor.selectedSlideId
    );
    if (!currentSlide) return [];
    return currentSlide.elements.filter((element) =>
      state.editor.selectedElementIds.includes(element.id)
    );
  });

  const selectionType = getSelectionType(selectedElements);

  const imageActions = useImageActions({
    currentSlideId,
    dispatch,
    addNotification: (message, type, timeout) =>
      addNotification(message, type as 'info' | 'success' | 'warning' | 'error', timeout),
  });
  const {
    showUrlInput,
    setShowUrlInput,
    fileInputRef,
    urlInputRef,
    uploading,
    progress,
    imageUrl,
    setImageUrl,
    handleImageButtonClick,
    handleImageFromUrlButtonClick,
    handleFileSelect,
    handleUrlSubmit,
    handleKeyPress,
  } = imageActions;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (activeTextOption && popupRef.current && !popupRef.current.contains(target)) {
        dispatch(setActiveTextOption(null));
      }

      if (showUrlInput) {
        const urlPopup = document.querySelector('.url-upload-popup');
        if (urlPopup && !urlPopup.contains(target)) {
          setShowUrlInput(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTextOption, showUrlInput, dispatch, setShowUrlInput]);

  const handleButtonClick = (action: string) => {
    if (!isButtonAvailable(selectionType, action)) {
      const reason = getButtonDisabledReason(selectionType, action);
      addNotification(
        reason || 'Это действие недоступно для выбранного элемента',
        'info',
        NOTIFICATION_TIMEOUT.INFO
      );
      return;
    }

    if (action === 'TOGGLE_GRID') {
      dispatch(toggleGrid());
      return;
    }

    if (action.startsWith('DESIGN_')) {
      dispatch(handleAction(action));
      return;
    }

    if (menuActions.includes(action)) {
      dispatch(setActiveTextOption(activeTextOption === action ? null : action));
      return;
    }

    if (action === 'ADD_IMAGE') {
      handleImageButtonClick();
      return;
    }

    if (action === 'ADD_IMAGE_FROM_URL') {
      handleImageFromUrlButtonClick();
      return;
    }

    dispatch(handleAction(action));
  };

  const handlePopupAction = (action: string) => {
    dispatch(handleAction(action));
    dispatch(setActiveTextOption(null));
  };

  const handleTextAlign = (key: string) => {
    if (['left', 'right', 'center', 'justify'].includes(key)) {
      dispatch(handleAction(`TEXT_ALIGN_HORIZONTAL:${key}`));
    }
    if (['top', 'middle', 'bottom'].includes(key)) {
      dispatch(handleAction(`TEXT_ALIGN_VERTICAL:${key}`));
    }
    dispatch(setActiveTextOption(null));
  };

  const renderDesignButton = (btn: GroupButton) => {
    const theme = btn.action.split(':')[1] || 'theme';
    const themeName = theme
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return (
      <div key={btn.action} className="design-button-wrapper">
        <button
          onClick={() => handleButtonClick(btn.action)}
          className="design-button"
          title={themeName}
        >
          {btn.previewImage && (
            <img src={btn.previewImage} alt={themeName} className="design-button-image" />
          )}
          <div className="design-button-label">{themeName}</div>
        </button>
      </div>
    );
  };

  const renderRegularButton = (btn: GroupButton) => {
    const isImageButton = btn.action === 'ADD_IMAGE';
    const popupContent =
      activeTextOption === btn.action
        ? getPopupContent(btn, { onAction: handlePopupAction, onTextAlign: handleTextAlign })
        : null;
    const showUrlPopup = btn.action === 'ADD_IMAGE_FROM_URL' && showUrlInput;
    const isAvailable = isButtonAvailable(selectionType, btn.action);
    const disabledReason = getButtonDisabledReason(selectionType, btn.action);

    return (
      <div key={btn.action} className="toolbar-button-wrapper">
        <button
          onClick={() => handleButtonClick(btn.action)}
          disabled={(isImageButton && uploading) || !isAvailable}
          data-disabled-reason={!isAvailable ? disabledReason : undefined}
          className={!isAvailable ? 'disabled-button' : ''}
        >
          {isImageButton && uploading ? (
            <>
              <span>Загрузка {progress}%</span>
              <div className="upload-progress" />
            </>
          ) : (
            btn.label || ''
          )}
        </button>

        {popupContent && (
          <div ref={popupRef} className="popup-container">
            {popupContent}
          </div>
        )}

        {showUrlPopup && (
          <div ref={popupRef} className="url-upload-popup">
            <div className="url-input-group">
              <input
                ref={urlInputRef}
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Вставьте ссылку на изображение"
                className="url-input"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim()}
                className="url-submit-button"
              >
                Вставить
              </button>
              <button onClick={() => setShowUrlInput(false)} className="url-cancel-button">
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="toolbar-group" ref={popupRef}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {GROUPS[activeGroup].map((btn) => {
        if (btn.action === 'SEPARATOR') {
          return (
            <div key={`separator-${Math.random()}`} className="toolbar-separator">
              <div className="separator-line" />
            </div>
          );
        }

        if (activeGroup === 'view') {
          const isActive = btn.action === 'TOGGLE_GRID' && gridVisible;
          const isAvailable = isButtonAvailable(selectionType, btn.action);
          const disabledReason = getButtonDisabledReason(selectionType, btn.action);

          return (
            <div key={btn.action} className="toolbar-button-wrapper">
              <button
                onClick={() => handleButtonClick(btn.action)}
                className={isActive ? 'active-toggle' : ''}
                data-disabled-reason={!isAvailable ? disabledReason : undefined}
                disabled={!isAvailable}
              >
                {btn.label || ''}
                {isActive && <span className="toggle-indicator">✓</span>}
              </button>
            </div>
          );
        }

        if (activeGroup === 'design') {
          return renderDesignButton(btn);
        }

        return renderRegularButton(btn);
      })}
    </div>
  );
}
