// src/common/components/Toolbar/parts/ColorSection.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction } from '../../../../store/editorSlice';
import ColorPicker from '../../../shared/ColorPicker';
import '../styles/ColorSection.css';

interface Props {
  type: 'text' | 'fill' | 'stroke' | 'background';
}

export default function ColorSection({ type }: Props) {
  const dispatch = useAppDispatch();
  const selectedElementIds = useAppSelector((state) => state.editor.selectedElementIds);

  const onSelectColor = (color: string) => {
    switch (type) {
      case 'text':
        if (selectedElementIds.length > 0) dispatch(handleAction(`TEXT_COLOR:${color}`));
        break;
      case 'fill':
        if (selectedElementIds.length > 0) dispatch(handleAction(`SHAPE_FILL:${color}`));
        break;
      case 'stroke':
        if (selectedElementIds.length > 0) dispatch(handleAction(`SHAPE_STROKE:${color}`));
        break;
      case 'background':
        dispatch(handleAction(`SLIDE_BACKGROUND:${color}`));
        break;
    }
  };

  return (
    <div className="color-picker-popup">
      <ColorPicker type={type} onSelectColor={onSelectColor} showCancelButton={false} />
    </div>
  );
}
