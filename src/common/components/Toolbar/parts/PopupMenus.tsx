import React from 'react';
import { SHAPE_OPTIONS } from '../constants/shapes';
import {
  SHAPE_SMOOTHING_OPTIONS,
  TEXT_SHADOW_OPTIONS,
  TEXT_ALIGN_OPTIONS,
  TEXT_VERTICAL_ALIGN_OPTIONS,
  FONT_FAMILY_OPTIONS,
} from '../constants/textOptions';

interface PopupItem {
  key: string;
  label: string;
  icon?: string;
  value?: number | string;
}

interface BasePopupProps {
  items: PopupItem[];
  onSelect: (key: string, value?: number | string) => void;
  showIcons?: boolean;
}

function BasePopup({ items, onSelect, showIcons = false }: BasePopupProps) {
  return (
    <div className="text-options-popup">
      {items.map((item) => (
        <button
          key={item.key}
          className="text-option-button"
          onClick={() => onSelect(item.key, item.value)}
          title={item.label}
        >
          {showIcons && item.icon && <span className="popup-icon">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}

export interface ShapePopupProps {
  onSelect: (shapeType: string) => void;
}

export function ShapePopup({ onSelect }: ShapePopupProps) {
  const items = SHAPE_OPTIONS.map((shape) => ({
    key: shape.type,
    label: shape.label,
    icon: shape.icon,
  }));

  return <BasePopup items={items} onSelect={onSelect} showIcons />;
}

export interface ShapeSmoothingMenuProps {
  onSelect: (key: string) => void;
}

export function ShapeSmoothingMenu({ onSelect }: ShapeSmoothingMenuProps) {
  const items = SHAPE_SMOOTHING_OPTIONS.map((option) => ({
    key: option.key,
    label: option.label,
    value: option.value,
  }));

  return <BasePopup items={items} onSelect={(key) => onSelect(key)} />;
}

export interface TextShadowMenuProps {
  onSelect: (key: string) => void;
}

export function TextShadowMenu({ onSelect }: TextShadowMenuProps) {
  const items = TEXT_SHADOW_OPTIONS.map((option) => ({
    key: option.key,
    label: option.label,
  }));

  return <BasePopup items={items} onSelect={onSelect} />;
}

export interface FontPopupProps {
  onSelect: (key: string) => void;
}

export function FontPopup({ onSelect }: FontPopupProps) {
  return (
    <div className="text-options-popup">
      {FONT_FAMILY_OPTIONS.map((font) => (
        <button
          key={font.key}
          className="text-option-button"
          onClick={() => onSelect(font.key)}
          style={{ fontFamily: font.key }}
        >
          {font.label}
        </button>
      ))}
    </div>
  );
}

export interface TextAlignPopupProps {
  onSelect: (key: string) => void;
}

export function TextAlignPopup({ onSelect }: TextAlignPopupProps) {
  return (
    <div className="text-align-popup">
      <div className="align-section">
        <div className="align-title">Горизонтально</div>
        {TEXT_ALIGN_OPTIONS.map((opt) => (
          <button key={opt.key} className="text-option-button" onClick={() => onSelect(opt.key)}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="align-section">
        <div className="align-title">Вертикально</div>
        {TEXT_VERTICAL_ALIGN_OPTIONS.map((opt) => (
          <button key={opt.key} className="text-option-button" onClick={() => onSelect(opt.key)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface StrokeWidthPopupProps {
  onSelect: (width: number) => void;
  currentWidth?: number;
}

export function StrokeWidthPopup({ onSelect }: StrokeWidthPopupProps) {
  const strokeWidthOptions = [1, 2, 3, 4, 5, 6, 8, 10];

  return (
    <div className="text-options-popup">
      {strokeWidthOptions.map((width) => (
        <button
          key={width}
          className="text-option-button stroke-width-option"
          onClick={() => onSelect(width)}
        >
          <div className="stroke-preview" style={{ height: `${width}px` }} />
          {width}px
        </button>
      ))}
    </div>
  );
}

export interface TextOptionsPopupProps {
  options: string[];
  onSelect: (key: string) => void;
}

export function TextOptionsPopup({ options, onSelect }: TextOptionsPopupProps) {
  return (
    <div className="text-options-popup">
      {options.map((opt) => (
        <button key={opt} className="text-option-button" onClick={() => onSelect(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}
