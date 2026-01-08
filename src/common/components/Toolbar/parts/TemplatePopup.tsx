import React from 'react';
import { TEMPLATES } from '../constants/templates';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction } from '../../../../store/editorSlice';
import { setActiveTextOption } from '../../../../store/toolbarSlice';
import TemplateSlidePreview from './TemplatePreview';
import { Slide } from '../../../../store/types/presentation';
import { RootState } from '../../../../store';
import '../styles/TemplatePopup.css';

import {
  slideTitle,
  slideTitleAndObject,
  slideSectionHeader,
  slideTwoObjects,
  slideComparison,
  slideJustHeadline,
  slideEmpty,
  slideObjectWithSignature,
  slideDrawingWithCaption,
} from '../../../../store/templates/slide';

const TEMPLATE_SLIDES: Record<string, Slide> = {
  ADD_TITLE_SLIDE: slideTitle,
  ADD_TITLE_AND_OBJECT_SLIDE: slideTitleAndObject,
  ADD_SECTION_HEADER_SLIDE: slideSectionHeader,
  ADD_TWO_OBJECTS_SLIDE: slideTwoObjects,
  ADD_COMPARISON_SLIDE: slideComparison,
  ADD_JUST_HEADLINE_SLIDE: slideJustHeadline,
  ADD_EMPTY_SLIDE: slideEmpty,
  ADD_OBJECT_WITH_SIGNATURE_SLIDE: slideObjectWithSignature,
  ADD_DRAWING_WITH_CAPTION_SLIDE: slideDrawingWithCaption,
};

export default function TemplatePopup() {
  const dispatch = useAppDispatch();
  const presentation = useAppSelector((state: RootState) => state.editor.presentation);

  const handleSelect = (templateKey: string) => {
    dispatch(handleAction(templateKey));
    dispatch(setActiveTextOption(null));
  };

  const findActiveDesign = () => {
    const slideWithLockedBg = presentation.slides.find(
      (slide) =>
        slide.background.type !== 'none' &&
        'isLocked' in slide.background &&
        slide.background.isLocked
    );

    return slideWithLockedBg ? slideWithLockedBg.background : null;
  };

  const getTemplateWithDesign = (templateKey: string) => {
    const templateSlide = TEMPLATE_SLIDES[templateKey];
    if (!templateSlide) return null;

    const activeDesign = findActiveDesign();
    if (activeDesign) {
      return {
        ...templateSlide,
        background: { ...activeDesign },
      };
    }

    return templateSlide;
  };

  return (
    <div className="template-popup">
      {TEMPLATES.map((template) => {
        const slide = getTemplateWithDesign(template.key);

        return (
          <div
            key={template.key}
            className="template-item"
            onClick={() => handleSelect(template.key)}
          >
            <div className="template-preview">
              {slide ? (
                <TemplateSlidePreview slide={slide} scale={0.2} />
              ) : (
                <div className="template-no-preview">Нет превью</div>
              )}
            </div>
            <div className="template-label">{template.label}</div>
          </div>
        );
      })}
    </div>
  );
}
