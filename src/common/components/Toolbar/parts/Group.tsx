import React, { useRef, useState, ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction, addImageWithUrl } from '../../../../store/editorSlice';
import { setActiveTextOption } from '../../../../store/toolbarSlice';
import { GROUPS, GroupButton, GroupKey } from '../constants/config';
import { useNotifications } from '../../../../appwrite/hooks/useNotifications';
import {
  IMAGE_NOTIFICATIONS,
  NOTIFICATION_TIMEOUT,
} from '../../../../appwrite/notifications/messages';
import { ImageService } from '../../../../appwrite/services/imageService';
import { RootState } from '../../../../store';

import ColorSection from './ColorSection';
import TemplatePopup from './TemplatePopup';
import {
  ShapePopup,
  ShapeSmoothingMenu,
  TextShadowMenu,
  TextReflectionMenu,
  FontPopup,
  TextAlignPopup,
  StrokeWidthPopup,
  TextOptionsPopup,
} from './PopupMenus';

import { TEXT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants/textOptions';

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
  'TEXT_REFLECTION',
];

export default function ToolbarGroup() {
  const dispatch = useAppDispatch();
  const activeGroup = useAppSelector((state) => state.toolbar.activeGroup) as GroupKey;
  const activeTextOption = useAppSelector((state) => state.toolbar.activeTextOption);
  const currentSlideId = useAppSelector((state: RootState) => state.editor.selectedSlideId);
  const { addNotification } = useNotifications();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  if (!GROUPS[activeGroup]) {
    return <div className="toolbar-group" />;
  }

  const handleButtonClick = (action: string) => {
    if (action.startsWith('DESIGN_')) {
      dispatch(handleAction(action));
      return;
    }

    if (menuActions.includes(action)) {
      dispatch(setActiveTextOption(activeTextOption === action ? null : action));
    } else if (action === 'ADD_IMAGE') {
      handleImageButtonClick();
    } else if (action === 'ADD_IMAGE_FROM_URL') {
      handleImageFromUrlButtonClick();
    } else {
      dispatch(handleAction(action));
    }
  };

  const handleImageButtonClick = () => {
    if (!currentSlideId) {
      addNotification(
        IMAGE_NOTIFICATIONS.ERROR.NO_SLIDE_SELECTED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
      return;
    }
    setShowUrlInput(false);
    fileInputRef.current?.click();
  };

  const handleImageFromUrlButtonClick = () => {
    if (!currentSlideId) {
      addNotification(
        IMAGE_NOTIFICATIONS.ERROR.NO_SLIDE_SELECTED,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
      return;
    }
    setShowUrlInput(true);
    setTimeout(() => urlInputRef.current?.focus(), 10);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification(IMAGE_NOTIFICATIONS.ERROR.NOT_AN_IMAGE, 'error', NOTIFICATION_TIMEOUT.ERROR);
      return;
    }

    setUploading(true);
    setProgress(0);
    addNotification(IMAGE_NOTIFICATIONS.INFO.UPLOADING, 'info', NOTIFICATION_TIMEOUT.INFO);

    const progressInterval = setInterval(() => setProgress((prev) => Math.min(prev + 20, 90)), 300);

    try {
      const imageData = await ImageService.uploadImage(file);
      clearInterval(progressInterval);
      setProgress(100);

      dispatch(
        addImageWithUrl({
          url: imageData.url,
          width: imageData.width,
          height: imageData.height,
        })
      );

      addNotification(
        IMAGE_NOTIFICATIONS.SUCCESS.UPLOADED,
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Не удалось загрузить изображение';
      addNotification(
        `${IMAGE_NOTIFICATIONS.ERROR.UPLOAD_FAILED}: ${errorMessage}`,
        'error',
        NOTIFICATION_TIMEOUT.ERROR
      );
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      dispatch(addImageWithUrl(imageUrl.trim()));
      setImageUrl('');
      setShowUrlInput(false);
      addNotification(
        IMAGE_NOTIFICATIONS.SUCCESS.UPLOADED,
        'success',
        NOTIFICATION_TIMEOUT.SUCCESS
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUrlSubmit();
  };

  const renderDesignButton = (btn: GroupButton) => {
    const theme = btn.action.split(':')[1] || 'theme';
    const themeName = theme
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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

  const handlePopupAction = (action: string) => {
    dispatch(handleAction(action));
    dispatch(setActiveTextOption(null));
  };

  const handleTextAlign = (key: string) => {
    if (['left', 'right', 'center', 'justify'].includes(key)) {
      dispatch(handleAction(`TEXT_ALIGN_HORIZONTAL:${key}`));
    } else if (['top', 'middle', 'bottom'].includes(key)) {
      dispatch(handleAction(`TEXT_ALIGN_VERTICAL:${key}`));
    }
    dispatch(setActiveTextOption(null));
  };

  const getPopupContent = (btn: GroupButton) => {
    const popupMap: Record<string, ReactElement> = {
      ADD_SLIDE: <TemplatePopup />,
      TEXT_FONT: <FontPopup onSelect={(key: string) => handlePopupAction(`TEXT_FONT:${key}`)} />,
      ADD_SHAPE: (
        <ShapePopup onSelect={(shapeType: string) => handlePopupAction(`ADD_SHAPE:${shapeType}`)} />
      ),
      SHAPE_STROKE_WIDTH: (
        <StrokeWidthPopup
          onSelect={(width: number) => handlePopupAction(`SHAPE_STROKE_WIDTH:${width}`)}
        />
      ),
      TEXT_COLOR: <ColorSection type="text" />,
      SHAPE_FILL: <ColorSection type="fill" />,
      SHAPE_STROKE: <ColorSection type="stroke" />,
      SLIDE_BACKGROUND: <ColorSection type="background" />,
      TEXT_SIZE: (
        <TextOptionsPopup
          options={TEXT_SIZE_OPTIONS.map((o) => o.key)}
          onSelect={(key: string) => handlePopupAction(`TEXT_SIZE:${key}`)}
        />
      ),
      TEXT_ALIGN: <TextAlignPopup onSelect={handleTextAlign} />,
      TEXT_LINE_HEIGHT: (
        <TextOptionsPopup
          options={LINE_HEIGHT_OPTIONS.map((o) => o.key)}
          onSelect={(key: string) => handlePopupAction(`TEXT_LINE_HEIGHT:${key}`)}
        />
      ),
      TEXT_SHADOW: (
        <TextShadowMenu onSelect={(key: string) => handlePopupAction(`TEXT_SHADOW:${key}`)} />
      ),
      SHAPE_SMOOTHING: (
        <ShapeSmoothingMenu
          onSelect={(key: string) => handlePopupAction(`SHAPE_SMOOTHING:${key}`)}
        />
      ),
      TEXT_REFLECTION: (
        <TextReflectionMenu
          onSelect={(key: string, value: number) =>
            handlePopupAction(`TEXT_REFLECTION:${key}:${value}`)
          }
        />
      ),
    };

    return popupMap[btn.action];
  };

  return (
    <div className="toolbar-group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {GROUPS[activeGroup].map((btn: GroupButton) => {
        if (btn.action === 'SEPARATOR') {
          return (
            <div key={`separator-${Date.now()}-${Math.random()}`} className="toolbar-separator">
              <div className="separator-line" />
            </div>
          );
        }

        if (activeGroup === 'design') {
          return renderDesignButton(btn);
        }

        const isImageButton = btn.action === 'ADD_IMAGE';
        const showPopup = activeTextOption === btn.action && getPopupContent(btn);
        const showUrlPopup = btn.action === 'ADD_IMAGE_FROM_URL' && showUrlInput;

        return (
          <div key={btn.action} className="toolbar-button-wrapper">
            <button
              onClick={() => handleButtonClick(btn.action)}
              disabled={isImageButton && uploading}
              title={btn.label || ''}
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
            {showPopup}
            {showUrlPopup && (
              <div className="url-upload-popup">
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
      })}
    </div>
  );
}
