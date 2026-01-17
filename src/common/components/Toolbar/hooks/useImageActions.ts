import { useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import { addImageWithUrl } from '../../../../store/editorSlice';
import { IMAGE_NOTIFICATIONS, NOTIFICATION_TIMEOUT } from '../../../../services/notifications';
import { ImageService } from '../../../../services/services/ImageService';
import type { Dispatch } from '@reduxjs/toolkit';

type Params = {
  currentSlideId: string | null;
  dispatch: Dispatch;
  addNotification: (message: string, type: string, timeout: number) => void;
};

export function useImageActions({ currentSlideId, dispatch, addNotification }: Params) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

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

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification(IMAGE_NOTIFICATIONS.ERROR.NOT_AN_IMAGE, 'error', NOTIFICATION_TIMEOUT.ERROR);
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
      const message = error instanceof Error ? error.message : 'Не удалось загрузить изображение';

      addNotification(
        `${IMAGE_NOTIFICATIONS.ERROR.UPLOAD_FAILED}: ${message}`,
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
    if (!imageUrl.trim()) return;

    dispatch(addImageWithUrl(imageUrl.trim()));
    setImageUrl('');
    setShowUrlInput(false);

    addNotification(IMAGE_NOTIFICATIONS.SUCCESS.UPLOADED, 'success', NOTIFICATION_TIMEOUT.SUCCESS);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleUrlSubmit();
  };

  return {
    fileInputRef,
    urlInputRef,

    uploading,
    progress,
    showUrlInput,
    imageUrl,

    setShowUrlInput,
    setImageUrl,

    handleImageButtonClick,
    handleImageFromUrlButtonClick,
    handleFileSelect,
    handleUrlSubmit,
    handleKeyPress,
  };
}
