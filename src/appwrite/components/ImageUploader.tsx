'use client';
import React, { useRef, useState } from 'react';
import { ImageService } from '../image-service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addImageWithUrl } from '../../store/editorSlice';
import './ImageUploader.css';

export default function ImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const currentSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

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

  return (
    <div className="image-uploader-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="image-uploader-input"
      />

      <button
        onClick={triggerFileInput}
        disabled={uploading || !currentSlideId}
        className={`image-uploader-button ${!currentSlideId ? 'opacity-half' : ''}`}
      >
        {uploading ? (
          <>
            <span>Загрузка... {progress}%</span>
            <div className="image-uploader-spinner" />
          </>
        ) : (
          '📷 Вставить изображение'
        )}
      </button>
    </div>
  );
}
