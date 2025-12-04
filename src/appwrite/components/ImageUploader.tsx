// src/appwrite/components/ImageUploader.tsx
'use client';
import React, { useRef, useState, CSSProperties, useEffect } from 'react';
import { ImageService } from '../image-service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addImageWithUrl } from '../../store/editorSlice';

// Стили в виде объектов
const styles: { [key: string]: CSSProperties } = {
  button: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
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

  const styleId = 'image-uploader-styles';
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

export default function ImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const currentSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

  useEffect(() => {
    addStylesToDocument();
  }, []);

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

    if (!currentSlideId) {
      alert('Выберите слайд для добавления изображения');
      return;
    }

    setUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 20, 90));
    }, 300);

    try {
      // Получаем URL и размеры изображения
      const imageData = await ImageService.uploadImage(file);

      clearInterval(progressInterval);
      setProgress(100);

      // Диспатчим с размерами
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
    } catch (error: any) {
      alert(`❌ Ошибка: ${error.message || 'Не удалось загрузить изображение'}`);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const buttonStyle = {
    ...styles.button,
    cursor: uploading || !currentSlideId ? 'not-allowed' : 'pointer',
    opacity: !currentSlideId ? 0.5 : 1,
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <button
        onClick={triggerFileInput}
        disabled={uploading || !currentSlideId}
        style={buttonStyle}
      >
        {uploading ? (
          <>
            <span>Загрузка... {progress}%</span>
            <div style={styles.spinner} />
          </>
        ) : (
          '📷 Вставить изображение'
        )}
      </button>
    </div>
  );
}
