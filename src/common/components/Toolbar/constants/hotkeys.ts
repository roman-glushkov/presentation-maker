export interface HotkeyItem {
  keys: string[];
  description: string;
  category: 'general' | 'slides' | 'workspace' | 'elements' | 'navigation';
}

export const hotkeysConfig: HotkeyItem[] = [
  // Навигация по слайдам
  {
    keys: ['← Стрелка влево', '↑ Стрелка вверх'],
    description: 'Перейти к предыдущему слайду',
    category: 'navigation',
  },
  {
    keys: ['→ Стрелка вправо', '↓ Стрелка вниз'],
    description: 'Перейти к следующему слайду',
    category: 'navigation',
  },

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
    keys: ['Shift', 'Клик'],
    description: 'Множественное выделение слайдов',
    category: 'slides',
  },
  {
    keys: ['Перетаскивание'],
    description: 'Изменение порядка слайдов',
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
    keys: ['Delete', 'Backspace'],
    description: 'Удалить элементы',
    category: 'workspace',
  },
  {
    keys: ['Shift', 'Клик'],
    description: 'Множественное выделение элементов',
    category: 'workspace',
  },

  // Элементы
  {
    keys: ['Перетаскивание'],
    description: 'Перемещение элементов',
    category: 'elements',
  },
  {
    keys: ['Alt', 'Перетаскивание'],
    description: 'Принудительное перемещение (без привязки к сетке)',
    category: 'elements',
  },
  {
    keys: ['Ручки ресайза'],
    description: 'Изменение размера элемента',
    category: 'elements',
  },
  {
    keys: ['Shift', 'Ресайз'],
    description: 'Сохранять пропорции при изменении размера',
    category: 'elements',
  },
  {
    keys: ['Двойной клик'],
    description: 'Редактирование текста',
    category: 'elements',
  },
  {
    keys: ['Esc'],
    description: 'Выйти из режима редактирования текста',
    category: 'elements',
  },
  {
    keys: ['Enter'],
    description: 'Создать новый элемент списка',
    category: 'elements',
  },
];

export const hotkeyCategories = {
  slides: 'Панель слайдов',
  workspace: 'Рабочая область',
  elements: 'Рабочая панель',
  navigation: 'Навигация',
};
