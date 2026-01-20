import IronManPreview from '../assets/wallpaper/Iron_man.jpg';
import BlackAndWhitePreview from '../assets/wallpaper/Black_and_white.jpg';
import BlueAutumnPreview from '../assets/wallpaper/Blue_autumn.jpg';
import ChristmasPreview from '../assets/wallpaper/Christmas.jpg';
import GraphPreview from '../assets/wallpaper/Graph.jpg';
import GreenPreview from '../assets/wallpaper/Green.jpg';
import GreyPreview from '../assets/wallpaper/Grey.jpg';
import NeiroPreview from '../assets/wallpaper/Neiro.jpg';
import PlanePreview from '../assets/wallpaper/plane.jpg';
import SchoolPreview from '../assets/wallpaper/School.jpg';
import FutureBackground from '../assets/wallpaper/blue_white.jpg';

export type GroupKey = 'main' | 'insert' | 'colors' | 'effects' | 'design' | 'view';

export interface GroupButton {
  label?: string;
  action: string;
  previewImage?: string;
  toggleable?: boolean;
}

export const GROUPS: Record<GroupKey, GroupButton[]> = {
  main: [
    { label: '➕ Слайд', action: 'ADD_SLIDE' },
    { label: '⎘ Дублировать', action: 'DUPLICATE_SLIDE' },
    { label: '|', action: 'SEPARATOR' },
    { label: '🔠 Размер', action: 'TEXT_SIZE' },
    { label: '🎨 Шрифт', action: 'TEXT_FONT' },
    { label: '↔️ Выравнивание', action: 'TEXT_ALIGN' },
    { label: '↕️ Интервал', action: 'TEXT_LINE_HEIGHT' },
    { label: '𝐁 Жирный', action: 'TEXT_BOLD' },
    { label: '𝑰 Курсив', action: 'TEXT_ITALIC' },
    { label: 'U Подчеркнутый', action: 'TEXT_UNDERLINE' },
    { label: '📋 Маркеры', action: 'LIST_OPTIONS' },
  ],
  insert: [
    { label: '📝 Текст', action: 'ADD_TEXT' },
    { label: '🖼️ Картинка', action: 'ADD_IMAGE' },
    { label: '🔗 По ссылке', action: 'ADD_IMAGE_FROM_URL' },
    { label: '🔷 Фигуры', action: 'ADD_SHAPE' },
  ],
  colors: [
    { label: '🎨 Фон слайда', action: 'SLIDE_BACKGROUND' },
    { label: '🖍️ Цвет текста', action: 'TEXT_COLOR' },
    { label: '🧱 Заливка фигуры', action: 'SHAPE_FILL' },
    { label: '🖌️ Цвет границы', action: 'SHAPE_STROKE' },
  ],
  effects: [
    { label: '📏 Толщина', action: 'SHAPE_STROKE_WIDTH' },
    { label: '✨ Тень', action: 'TEXT_SHADOW' },
    { label: '🎯 Сглаживание', action: 'SHAPE_SMOOTHING' },
  ],
  design: [
    {
      label: '❌ Без дизайна',
      action: 'DESIGN_THEME:no_design',
    },
    {
      action: 'DESIGN_THEME:iron_man',
      previewImage: IronManPreview,
    },
    {
      action: 'DESIGN_THEME:black_white',
      previewImage: BlackAndWhitePreview,
    },
    {
      action: 'DESIGN_THEME:blue_autumn',
      previewImage: BlueAutumnPreview,
    },
    {
      action: 'DESIGN_THEME:christmas',
      previewImage: ChristmasPreview,
    },
    {
      action: 'DESIGN_THEME:graph',
      previewImage: GraphPreview,
    },
    {
      action: 'DESIGN_THEME:green',
      previewImage: GreenPreview,
    },
    {
      action: 'DESIGN_THEME:grey',
      previewImage: GreyPreview,
    },
    {
      action: 'DESIGN_THEME:neiro',
      previewImage: NeiroPreview,
    },
    {
      action: 'DESIGN_THEME:plane',
      previewImage: PlanePreview,
    },
    {
      action: 'DESIGN_THEME:school',
      previewImage: SchoolPreview,
    },
    {
      action: 'DESIGN_THEME:blue_white',
      previewImage: FutureBackground,
    },
  ],
  view: [
    {
      label: '📐 Сетка',
      action: 'TOGGLE_GRID',
      toggleable: true,
    },
  ],
};

export const TAB_TITLES: { key: GroupKey; name: string }[] = [
  { key: 'main', name: 'Главная' },
  { key: 'insert', name: 'Вставка' },
  { key: 'colors', name: 'Цвета' },
  { key: 'effects', name: 'Эффекты' },
  { key: 'design', name: 'Дизайн' },
  { key: 'view', name: 'Вид' },
];
