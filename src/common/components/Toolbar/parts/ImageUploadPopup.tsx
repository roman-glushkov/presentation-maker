import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { addImageWithUrl } from '../../../../store/editorSlice';
import { setActiveTextOption } from '../../../../store/toolbarSlice';

export default function ImageUploadPopup() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const imageUrl = URL.createObjectURL(file);

    dispatch(addImageWithUrl(imageUrl));
    dispatch(setActiveTextOption(null));
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      dispatch(addImageWithUrl(imageUrl.trim()));
      dispatch(setActiveTextOption(null));
      setImageUrl('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-popup">
      <div className="upload-option">
        <div className="upload-icon">📁</div>
        <button onClick={handleClick} className="upload-file-button">
          Выбрать из проводника
        </button>
      </div>

      <div className="upload-divider">
        <span>или</span>
      </div>

      <div className="upload-option">
        <div className="upload-icon">🔗</div>
        <div className="url-input-group">
          <input
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
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}
