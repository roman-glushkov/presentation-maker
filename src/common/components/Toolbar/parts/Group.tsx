import { GROUPS, GroupButton, GroupKey } from '../constants/config';
import ColorSection from './ColorSection';
import TextOptionsPopup from './TextOptionsPopup';
import TextAlignPopup from './TextAlignPopup';
import TemplatePopup from './TemplatePopup';
import FontPopup from './FontPopup';
import ShapePopup from './ShapePopup';
import StrokeWidthPopup from './StrokeWidthPopup';
import { TEXT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants/textOptions';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction, addImageWithUrl } from '../../../../store/editorSlice';
import { setActiveTextOption } from '../../../../store/toolbarSlice';
import { useRef, useState } from 'react';
import { ImageService } from '../../../../appwrite/services/imageService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import React from 'react';

// Импортируем уведомления
import { useNotifications } from '../../../../appwrite/hooks/useNotifications';
import {
  IMAGE_NOTIFICATIONS,
  NOTIFICATION_TIMEOUT,
} from '../../../../appwrite/notifications/messages';

export default function ToolbarGroup() {
  const dispatch = useAppDispatch();
  const activeGroup = useAppSelector((state) => state.toolbar.activeGroup) as GroupKey;
  const activeTextOption = useAppSelector((state) => state.toolbar.activeTextOption);

  // Используем систему уведомлений
  const { addNotification } = useNotifications();

  // Для загрузки изображений
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const currentSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

  // Проверяем, что GROUPS[activeGroup] существует
  if (!GROUPS[activeGroup]) {
    console.error(`Неизвестная группа: ${activeGroup}`);
    return <div className="toolbar-group" />;
  }

  const handleButtonClick = (action: string) => {
    if (
      [
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
      ].includes(action)
    ) {
      dispatch(setActiveTextOption(activeTextOption === action ? null : action));
    } else if (action === 'ADD_IMAGE') {
      handleImageButtonClick();
    } else if (action === 'ADD_IMAGE_FROM_URL') {
      handleImageFromUrlButtonClick();
    } else {
      dispatch(handleAction(action));
    }
  };

  // Функция для кнопки "Картинка"
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

  // Функция для кнопки "По ссылке"
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
    setTimeout(() => {
      urlInputRef.current?.focus();
    }, 10);
  };

  // Обработка выбора файла
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification(IMAGE_NOTIFICATIONS.ERROR.NOT_AN_IMAGE, 'error', NOTIFICATION_TIMEOUT.ERROR);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addNotification(IMAGE_NOTIFICATIONS.ERROR.TOO_LARGE, 'error', NOTIFICATION_TIMEOUT.ERROR);
      return;
    }

    setUploading(true);
    setProgress(0);

    addNotification(IMAGE_NOTIFICATIONS.INFO.UPLOADING, 'info', NOTIFICATION_TIMEOUT.INFO);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 20, 90));
    }, 300);

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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Обработка загрузки по URL
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
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
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
              <div className="separator-line"></div>
            </div>
          );
        }

        const isImageButton = btn.action === 'ADD_IMAGE';

        return (
          <div key={btn.action} className="toolbar-button-wrapper">
            <button
              onClick={() => handleButtonClick(btn.action)}
              disabled={isImageButton && uploading}
              style={{ position: 'relative' }}
            >
              {isImageButton && uploading ? (
                <>
                  <span>Загрузка {progress}%</span>
                  <div
                    style={{
                      position: 'absolute',
                      right: '5px',
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                </>
              ) : (
                btn.label
              )}
            </button>

            {/* Попапы для различных опций */}
            {btn.action === 'ADD_SLIDE' && activeTextOption === 'ADD_SLIDE' && <TemplatePopup />}

            {btn.action === 'TEXT_FONT' && activeTextOption === 'TEXT_FONT' && (
              <FontPopup
                onSelect={(key: string) => {
                  dispatch(handleAction(`TEXT_FONT:${key}`));
                  dispatch(setActiveTextOption(null));
                }}
              />
            )}

            {btn.action === 'ADD_SHAPE' && activeTextOption === 'ADD_SHAPE' && (
              <ShapePopup
                onSelect={(shapeType: string) => {
                  dispatch(handleAction(`ADD_SHAPE:${shapeType}`));
                  dispatch(setActiveTextOption(null));
                }}
              />
            )}

            {btn.action === 'SHAPE_STROKE_WIDTH' && activeTextOption === 'SHAPE_STROKE_WIDTH' && (
              <StrokeWidthPopup
                onSelect={(width: number) => {
                  dispatch(handleAction(`SHAPE_STROKE_WIDTH:${width}`));
                  dispatch(setActiveTextOption(null));
                }}
              />
            )}

            {btn.action === 'TEXT_COLOR' && activeTextOption === 'TEXT_COLOR' && (
              <ColorSection type="text" />
            )}
            {btn.action === 'SHAPE_FILL' && activeTextOption === 'SHAPE_FILL' && (
              <ColorSection type="fill" />
            )}
            {btn.action === 'SHAPE_STROKE' && activeTextOption === 'SHAPE_STROKE' && (
              <ColorSection type="stroke" />
            )}
            {btn.action === 'SLIDE_BACKGROUND' && activeTextOption === 'SLIDE_BACKGROUND' && (
              <ColorSection type="background" />
            )}
            {btn.action === 'TEXT_SIZE' && activeTextOption === 'TEXT_SIZE' && (
              <TextOptionsPopup
                options={TEXT_SIZE_OPTIONS.map((o) => o.key)}
                onSelect={(key: string) => {
                  dispatch(handleAction(`TEXT_SIZE:${key}`));
                  dispatch(setActiveTextOption(null));
                }}
              />
            )}
            {btn.action === 'TEXT_ALIGN' && activeTextOption === 'TEXT_ALIGN' && (
              <TextAlignPopup
                onSelect={(key: string) => {
                  if (['left', 'right', 'center', 'justify'].includes(key)) {
                    dispatch(handleAction(`TEXT_ALIGN_HORIZONTAL:${key}`));
                  } else if (['top', 'middle', 'bottom'].includes(key)) {
                    dispatch(handleAction(`TEXT_ALIGN_VERTICAL:${key}`));
                  }
                  dispatch(setActiveTextOption(null));
                }}
              />
            )}
            {btn.action === 'TEXT_LINE_HEIGHT' && activeTextOption === 'TEXT_LINE_HEIGHT' && (
              <TextOptionsPopup
                options={LINE_HEIGHT_OPTIONS.map((o) => o.key)}
                onSelect={(key: string) => {
                  dispatch(handleAction(`TEXT_LINE_HEIGHT:${key}`));
                  dispatch(setActiveTextOption(null));
                }}
              />
            )}

            {/* Поле для ввода URL */}
            {btn.action === 'ADD_IMAGE_FROM_URL' && showUrlInput && (
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
