import React from 'react';
import '../styles/HelpModal.css';

interface HelpSectionProps {
  title: string;
  hotkeys: Array<{
    keys: string[];
    description: string;
  }>;
}

const HelpSection: React.FC<HelpSectionProps> = ({ title, hotkeys }) => {
  return (
    <div className="help-section">
      <h3 className="help-section-title">{title}</h3>
      <div className="help-section-content">
        {hotkeys.map((hotkey, index) => (
          <div key={index} className="help-hotkey-item">
            <div className="help-hotkey-keys">
              {hotkey.keys.map((key, keyIndex) => (
                <React.Fragment key={keyIndex}>
                  <kbd className="help-key">{key}</kbd>
                  {keyIndex < hotkey.keys.length - 1 && <span className="help-key-plus">+</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="help-hotkey-description">{hotkey.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpSection;
