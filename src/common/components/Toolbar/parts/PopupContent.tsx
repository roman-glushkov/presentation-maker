import React, { ReactElement } from 'react';

import ColorSection from './ColorSection';
import TemplatePopup from './TemplatePopup';
import {
  ShapePopup,
  ShapeSmoothingMenu,
  TextShadowMenu,
  FontPopup,
  TextAlignPopup,
  StrokeWidthPopup,
  TextOptionsPopup,
  ListPopup,
} from './PopupMenus';

import { TEXT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants/textOptions';
import { GroupButton } from '../constants/config';

type PopupHandlers = {
  onAction: (action: string) => void;
  onTextAlign: (key: string) => void;
};

export function getPopupContent(
  btn: GroupButton,
  handlers: PopupHandlers
): ReactElement | undefined {
  const { onAction, onTextAlign } = handlers;

  const popupMap: Record<string, ReactElement> = {
    ADD_SLIDE: <TemplatePopup />,

    TEXT_FONT: <FontPopup onSelect={(key) => onAction(`TEXT_FONT:${key}`)} />,

    ADD_SHAPE: <ShapePopup onSelect={(shape) => onAction(`ADD_SHAPE:${shape}`)} />,

    SHAPE_STROKE_WIDTH: (
      <StrokeWidthPopup onSelect={(width) => onAction(`SHAPE_STROKE_WIDTH:${width}`)} />
    ),

    LIST_OPTIONS: <ListPopup onSelect={(key) => onAction(`LIST_TYPE:${key}`)} />,

    TEXT_COLOR: <ColorSection type="text" />,
    SHAPE_FILL: <ColorSection type="fill" />,
    SHAPE_STROKE: <ColorSection type="stroke" />,
    SLIDE_BACKGROUND: <ColorSection type="background" />,

    TEXT_SIZE: (
      <TextOptionsPopup
        options={TEXT_SIZE_OPTIONS.map((o) => o.key)}
        onSelect={(key) => onAction(`TEXT_SIZE:${key}`)}
      />
    ),

    TEXT_ALIGN: <TextAlignPopup onSelect={onTextAlign} />,

    TEXT_LINE_HEIGHT: (
      <TextOptionsPopup
        options={LINE_HEIGHT_OPTIONS.map((o) => o.key)}
        onSelect={(key) => onAction(`TEXT_LINE_HEIGHT:${key}`)}
      />
    ),

    TEXT_SHADOW: <TextShadowMenu onSelect={(key) => onAction(`TEXT_SHADOW:${key}`)} />,

    SHAPE_SMOOTHING: <ShapeSmoothingMenu onSelect={(key) => onAction(`SHAPE_SMOOTHING:${key}`)} />,
  };

  return popupMap[btn.action];
}
