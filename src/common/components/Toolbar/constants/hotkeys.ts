export interface HotkeyItem {
  keys: string[];
  description: string;
  category: 'general' | 'slides' | 'workspace' | 'workspace' | 'slides';
}

export const hotkeysConfig: HotkeyItem[] = [
  // Панель слайдов
  {
    keys: ['Ctrl/Cmd', 'C'],
    description: 'Копировать слайд',
    category: 'slides',
  },
  {
    keys: ['Ctrl/Cmd', 'V'],
    description: 'Вставить скопированный слайд',
    category: 'slides',
  },
  {
    keys: ['Ctrl/Cmd', 'D'],
    description: 'Дублировать слайд',
    category: 'slides',
  },
  {
    keys: ['Delete'],
    description: 'Удалить выделенный слайд',
    category: 'slides',
  },
  {
    keys: ['Ctrl', 'Клик'],
    description: 'Множественное выделение слайдов',
    category: 'slides',
  },
  {
    keys: ['Перетаскивание'],
    description: 'Изменение порядка слайдов',
    category: 'slides',
  },
  // Навигация по слайдам
  {
    keys: ['← или ↑'],
    description: 'Перейти к предыдущему слайду',
    category: 'slides',
  },
  {
    keys: ['→ или ↓'],
    description: 'Перейти к следующему слайду',
    category: 'slides',
  },

  // Рабочая область
  {
    keys: ['Ctrl/Cmd', 'C'],
    description: 'Копировать элементы',
    category: 'workspace',
  },
  {
    keys: ['Ctrl/Cmd', 'V'],
    description: 'Вставить элементы',
    category: 'workspace',
  },
  {
    keys: ['Ctrl/Cmd', 'D'],
    description: 'Дублировать элементы',
    category: 'workspace',
  },
  {
    keys: ['Delete или Backspace'],
    description: 'Удалить элементы',
    category: 'workspace',
  },
  {
    keys: ['Ctrl', 'Клик'],
    description: 'Множественное выделение элементов',
    category: 'workspace',
  },

  // Элементы
  {
    keys: ['Перетаскивание'],
    description: 'Перемещение элементов',
    category: 'workspace',
  },
  {
    keys: ['Ручки ресайза'],
    description: 'Изменение размера элемента',
    category: 'workspace',
  },
  {
    keys: ['Shift', 'Ресайз'],
    description: 'Сохранять пропорции при изменении размера',
    category: 'workspace',
  },
  {
    keys: ['Двойной клик'],
    description: 'Редактирование текста',
    category: 'workspace',
  },
  {
    keys: ['Esc'],
    description: 'Выйти из режима редактирования текста',
    category: 'workspace',
  },
  {
    keys: ['Enter'],
    description: 'Создать новый элемент списка',
    category: 'workspace',
  },
];

export const hotkeyCategories = {
  slides: 'Панель слайдов',
  workspace: 'Рабочая область',
};
