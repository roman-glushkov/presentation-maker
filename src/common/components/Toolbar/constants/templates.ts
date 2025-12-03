import titlePreview from '../assets/title-preview.png';
import titleObjectPreview from '../assets/title-object-preview.png';
import sectionPreview from '../assets/section-preview.png';
import twoObjectsPreview from '../assets/two-objects-preview.png';
import comparisonPreview from '../assets/comparison-preview.png';
import titleOnlyPreview from '../assets/title-only-preview.png';
import blankPreview from '../assets/blank-preview.png';
import objectCaptionPreview from '../assets/object-caption-preview.png';
import imageCaptionPreview from '../assets/image-caption-preview.png';

export interface Template {
  label: string;
  key: string;
  preview: string;
}

export const TEMPLATES: Template[] = [
  {
    label: '🏆 Титульный слайд',
    key: 'ADD_TITLE_SLIDE',
    preview: titlePreview,
  },
  {
    label: '🧩 Заголовок и объект',
    key: 'ADD_TITLE_AND_OBJECT_SLIDE',
    preview: titleObjectPreview,
  },
  {
    label: '🏞️ Заголовок раздела',
    key: 'ADD_SECTION_HEADER_SLIDE',
    preview: sectionPreview,
  },
  {
    label: '💼 Два объекта',
    key: 'ADD_TWO_OBJECTS_SLIDE',
    preview: twoObjectsPreview,
  },
  {
    label: '⚖️ Сравнение',
    key: 'ADD_COMPARISON_SLIDE',
    preview: comparisonPreview,
  },
  {
    label: '📰 Только заголовок',
    key: 'ADD_JUST_HEADLINE_SLIDE',
    preview: titleOnlyPreview,
  },
  {
    label: '📄 Пустой слайд',
    key: 'ADD_EMPTY_SLIDE',
    preview: blankPreview,
  },
  {
    label: '🖋️ Объект с подписью',
    key: 'ADD_OBJECT_WITH_SIGNATURE_SLIDE',
    preview: objectCaptionPreview,
  },
  {
    label: '🌈 Рисунок с подписью',
    key: 'ADD_DRAWING_WITH_CAPTION_SLIDE',
    preview: imageCaptionPreview,
  },
];
