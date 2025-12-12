import { GROUPS, GroupButton, GroupKey } from '../constants/config';
import ColorSection from './ColorSection';
import TextOptionsPopup from './TextOptionsPopup';
import TextAlignPopup from './TextAlignPopup';
import TemplatePopup from './TemplatePopup';
import { TEXT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants/textOptions';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction, addImageWithUrl } from '../../../../store/editorSlice';
import { setActiveTextOption } from '../../../../store/toolbarSlice';
import { useRef, useState, useEffect } from 'react';
import { ImageService } from '../../../../appwrite/image-service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import React from 'react';

export default function ToolbarGroup() {
  const dispatch = useAppDispatch();
  const activeGroup = useAppSelector((state) => state.toolbar.activeGroup) as GroupKey;
  const activeTextOption = useAppSelector((state) => state.toolbar.activeTextOption);

  // Для загрузки изображений
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const currentSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

  // Исправленный useEffect - всегда вызывается
  useEffect(() => {
    if (uploading) {
      // Автоматически скрываем через 5 секунд на всякий случай
      const timer = setTimeout(() => {
        setUploading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploading]);

  // Проверяем, что GROUPS[activeGroup] существует
  if (!GROUPS[activeGroup]) {
    console.error(`Неизвестная группа: ${activeGroup}`);
    // Вместо рендера ошибки, возвращаем пустой div
    return <div className="toolbar-group" />;
  }

  const handleButtonClick = (action: string) => {
    if (
      [
        'ADD_SLIDE',
        'TEXT_COLOR',
        'SHAPE_FILL',
        'SLIDE_BACKGROUND',
        'TEXT_SIZE',
        'TEXT_ALIGN',
        'TEXT_LINE_HEIGHT',
      ].includes(action)
    ) {
      dispatch(setActiveTextOption(activeTextOption === action ? null : action));
    }
    // ОСОБАЯ ОБРАБОТКА ДЛЯ КНОПКИ "КАРТИНКА"
    else if (action === 'ADD_IMAGE') {
      handleImageButtonClick();
    }
    // ОСОБАЯ ОБРАБОТКА ДЛЯ КНОПКИ "ПО ССЫЛКЕ"
    else if (action === 'ADD_IMAGE_FROM_URL') {
      handleImageFromUrlButtonClick();
    } else {
      dispatch(handleAction(action));
    }
  };

  // Функция для кнопки "Картинка" - сразу открывает диалог выбора файла
  const handleImageButtonClick = () => {
    if (!currentSlideId) {
      alert('Выберите слайд для добавления изображения');
      return;
    }

    // Сбрасываем URL инпут если он был открыт
    setShowUrlInput(false);

    // Открываем диалог выбора файла
    fileInputRef.current?.click();
  };

  // Функция для кнопки "По ссылке" - открывает поле для ввода URL
  const handleImageFromUrlButtonClick = () => {
    if (!currentSlideId) {
      alert('Выберите слайд для добавления изображения');
      return;
    }

    setShowUrlInput(true);
    // Фокусируемся на поле ввода URL
    setTimeout(() => {
      urlInputRef.current?.focus();
    }, 10);
  };

  // Обработка выбора файла
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Изображение должно быть меньше 10MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 20, 90));
    }, 300);

    try {
      // Получаем URL и размеры изображения через Appwrite
      const imageData = await ImageService.uploadImage(file);

      clearInterval(progressInterval);
      setProgress(100);

      // Добавляем изображение с размерами
      dispatch(
        addImageWithUrl({
          url: imageData.url,
          width: imageData.width,
          height: imageData.height,
        })
      );

      setTimeout(() => {
        alert('✅ Изображение успешно загружено!');
      }, 100);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Не удалось загрузить изображение';
      alert(`❌ Ошибка: ${errorMessage}`);
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
      alert('✅ Изображение добавлено по ссылке!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  return (
    <div className="toolbar-group">
      {/* Скрытый input для выбора файла */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {GROUPS[activeGroup].map((btn: GroupButton) => {
        // Если это разделитель, отображаем его по-другому
        if (btn.action === 'SEPARATOR') {
          return (
            <div key={`separator-${Date.now()}-${Math.random()}`} className="toolbar-separator">
              <div className="separator-line"></div>
            </div>
          );
        }

        // Если это кнопка загрузки изображения и идет загрузка, показываем индикатор
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
            {btn.action === 'TEXT_COLOR' && activeTextOption === 'TEXT_COLOR' && (
              <ColorSection type="text" />
            )}
            {btn.action === 'SHAPE_FILL' && activeTextOption === 'SHAPE_FILL' && (
              <ColorSection type="fill" />
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

            {/* Поле для ввода URL (появляется рядом с кнопкой "По ссылке") */}
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
                  <button
                    onClick={() => setShowUrlInput(false)}
                    className="url-cancel-button"
                    style={{
                      padding: '6px 12px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
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
