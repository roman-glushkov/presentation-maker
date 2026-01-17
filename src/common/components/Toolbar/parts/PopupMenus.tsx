import React from 'react';
import { SHAPE_OPTIONS } from '../constants/shapes';
import {
  SHAPE_SMOOTHING_OPTIONS,
  TEXT_SHADOW_OPTIONS,
  TEXT_ALIGN_OPTIONS,
  TEXT_VERTICAL_ALIGN_OPTIONS,
  FONT_FAMILY_OPTIONS,
  LIST_OPTIONS,
  STROKE_WIDTH_OPTIONS,
  PopupOption,
} from '../constants/textOptions';

interface BasePopupProps {
  options: PopupOption[];
  onSelect: (key: string, value?: string | number) => void;
  showPrefix?: boolean;
}

function BasePopup({ options, onSelect, showPrefix = false }: BasePopupProps) {
  return (
    <div className="text-options-popup">
      {options.map((option) => (
        <button
          key={option.key}
          className="text-option-button"
          onClick={() => onSelect(option.key, option.value)}
          title={option.label}
        >
          {showPrefix && option.prefix && <span className="option-prefix">{option.prefix}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}

export interface ShapePopupProps {
  onSelect: (shapeType: string) => void;
}

export function ShapePopup({ onSelect }: ShapePopupProps) {
  return <BasePopup options={SHAPE_OPTIONS} onSelect={onSelect} showPrefix />;
}

export interface ShapeSmoothingMenuProps {
  onSelect: (key: string) => void;
}

export function ShapeSmoothingMenu({ onSelect }: ShapeSmoothingMenuProps) {
  return <BasePopup options={SHAPE_SMOOTHING_OPTIONS} onSelect={onSelect} />;
}

export interface TextShadowMenuProps {
  onSelect: (key: string) => void;
}

export function TextShadowMenu({ onSelect }: TextShadowMenuProps) {
  return <BasePopup options={TEXT_SHADOW_OPTIONS} onSelect={onSelect} />;
}

export interface ListPopupProps {
  onSelect: (key: string) => void;
}

export function ListPopup({ onSelect }: ListPopupProps) {
  return <BasePopup options={LIST_OPTIONS} onSelect={onSelect} showPrefix />;
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

export function StrokeWidthPopup({ onSelect, currentWidth }: StrokeWidthPopupProps) {
  return (
    <div className="text-options-popup">
      {STROKE_WIDTH_OPTIONS.map((option) => {
        const width = option.value as number;
        const isSelected = currentWidth === width;
        return (
          <button
            key={option.key}
            className={`text-option-button stroke-width-option ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(width)}
            title={option.label}
          >
            <div className="stroke-preview" style={{ height: `${width}px` }} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TextOptionsPopupProps {
  options: string[];
  onSelect: (key: string) => void;
}

export function TextOptionsPopup({ options, onSelect }: TextOptionsPopupProps) {
  const popupOptions: PopupOption[] = options.map((opt) => ({
    key: opt,
    label: opt,
  }));
  return <BasePopup options={popupOptions} onSelect={onSelect} />;
}
