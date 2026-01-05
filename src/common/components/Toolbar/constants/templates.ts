// components/Toolbar/constants/templates.ts
export interface Template {
  label: string;
  key: string;
}

export const TEMPLATES: Template[] = [
  {
    label: '🏆 Титульный слайд',
    key: 'ADD_TITLE_SLIDE',
  },
  {
    label: '🧩 Заголовок и объект',
    key: 'ADD_TITLE_AND_OBJECT_SLIDE',
  },
  {
    label: '🏞️ Заголовок раздела',
    key: 'ADD_SECTION_HEADER_SLIDE',
  },
  {
    label: '💼 Два объекта',
    key: 'ADD_TWO_OBJECTS_SLIDE',
  },
  {
    label: '⚖️ Сравнение',
    key: 'ADD_COMPARISON_SLIDE',
  },
  {
    label: '📰 Только заголовок',
    key: 'ADD_JUST_HEADLINE_SLIDE',
  },
  {
    label: '📄 Пустой слайд',
    key: 'ADD_EMPTY_SLIDE',
  },
  {
    label: '🖋️ Объект с подписью',
    key: 'ADD_OBJECT_WITH_SIGNATURE_SLIDE',
  },
  {
    label: '🌈 Рисунок с подписью',
    key: 'ADD_DRAWING_WITH_CAPTION_SLIDE',
  },
];
