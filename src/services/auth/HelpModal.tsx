import React from 'react';
import { hotkeysConfig, hotkeyCategories } from '../../common/components/Toolbar/constants/hotkeys';
import HelpSection from './HelpSection';
import '../styles/HelpModal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const groupedHotkeys = Object.entries(hotkeyCategories)
    .map(([categoryKey, categoryTitle]) => ({
      title: categoryTitle,
      hotkeys: hotkeysConfig
        .filter((hotkey) => hotkey.category === categoryKey)
        .map(({ keys, description }) => ({ keys, description })),
    }))
    .filter((group) => group.hotkeys.length > 0);

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <h2 className="help-modal-title">📋 Справка по горячим клавишам</h2>
          <button className="help-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="help-modal-content">
          <div className="help-modal-intro">
            <p>Используйте эти сочетания клавиш для быстрой работы в редакторе:</p>
          </div>

          <div className="help-sections">
            {groupedHotkeys.map((group, index) => (
              <HelpSection key={index} title={group.title} hotkeys={group.hotkeys} />
            ))}
          </div>

          <div className="help-modal-footer">
            <p className="help-note">
              <strong>Примечание:</strong> Для Mac используйте Cmd вместо Ctrl
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
