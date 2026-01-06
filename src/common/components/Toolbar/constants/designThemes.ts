// constants/designThemes.ts
import IronManBackground from '../assets/wallpaper/Iron_man.jpg';
import BlackAndWhiteBackground from '../assets/wallpaper/Black_and_white.jpg';
import BlueAutumnBackground from '../assets/wallpaper/Blue_autumn.jpg';
import ChristmasBackground from '../assets/wallpaper/Christmas.jpg';
import GraphBackground from '../assets/wallpaper/Graph.jpg';
import GreenBackground from '../assets/wallpaper/Green.jpg';
import GreyBackground from '../assets/wallpaper/Grey.jpg';
import NeiroBackground from '../assets/wallpaper/Neiro.jpg';
import PlaneBackground from '../assets/wallpaper/plane.jpg';
import SchoolBackground from '../assets/wallpaper/School.jpg';

export interface DesignTheme {
  id: string;
  name: string;
  backgroundImage?: string;
  isLocked: boolean;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundColor?: string;
}

export const DESIGN_THEMES: Record<string, DesignTheme> = {
  // НОВАЯ ОПЦИЯ - БЕЗ ДИЗАЙНА (первая в списке)
  no_design: {
    id: 'no_design',
    name: 'Без дизайна',
    backgroundColor: '#ffffff', // Белый фон
    isLocked: false, // Можно сбросить
    // backgroundImage нет - значит чистый белый фон
  },
  // Существующие темы
  iron_man: {
    id: 'iron_man',
    name: 'Iron Man',
    backgroundImage: IronManBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  black_white: {
    id: 'black_white',
    name: 'Черно-белая',
    backgroundImage: BlackAndWhiteBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  blue_autumn: {
    id: 'blue_autumn',
    name: 'Синяя осень',
    backgroundImage: BlueAutumnBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  christmas: {
    id: 'christmas',
    name: 'Рождество',
    backgroundImage: ChristmasBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  graph: {
    id: 'graph',
    name: 'График',
    backgroundImage: GraphBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  green: {
    id: 'green',
    name: 'Зеленая',
    backgroundImage: GreenBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  grey: {
    id: 'grey',
    name: 'Серая',
    backgroundImage: GreyBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  neiro: {
    id: 'neiro',
    name: 'Нейросеть',
    backgroundImage: NeiroBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  plane: {
    id: 'plane',
    name: 'Самолет',
    backgroundImage: PlaneBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  school: {
    id: 'school',
    name: 'Школа',
    backgroundImage: SchoolBackground,
    isLocked: true,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
};

// Вспомогательные функции
export function getThemeById(id: string): DesignTheme | undefined {
  return DESIGN_THEMES[id];
}

export function getAllThemes(): DesignTheme[] {
  return Object.values(DESIGN_THEMES);
}
