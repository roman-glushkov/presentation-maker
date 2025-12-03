import React from 'react';
import { TEMPLATES } from '../constants/templates';
import { useAppDispatch } from '../../../../store/hooks';
import { handleAction } from '../../../../store/editorSlice';
import { setActiveTextOption } from '../../../../store/toolbarSlice';

export default function TemplatePopup() {
  const dispatch = useAppDispatch();

  const handleSelect = (templateKey: string) => {
    dispatch(handleAction(templateKey));
    dispatch(setActiveTextOption(null));
  };

  return (
    <div className="template-popup">
      {TEMPLATES.map((template) => (
        <div
          key={template.key}
          className="template-item"
          onClick={() => handleSelect(template.key)}
        >
          <div className="template-preview">
            <img
              src={template.preview}
              alt={template.label}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="template-fallback">
              <span>{template.label}</span>
            </div>
          </div>
          <div className="template-label">{template.label}</div>
        </div>
      ))}
    </div>
  );
}
