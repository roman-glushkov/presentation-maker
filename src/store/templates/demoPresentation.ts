import { Presentation } from '../types/presentation';
import { DESIGN_THEMES } from '../../common/components/Toolbar/constants/designThemes'; // путь к вашим константам
import logoImage from '../../common/components/Toolbar/assets/presentation/logo.png';
import thinkimage from '../../common/components/Toolbar/assets/presentation/think.jpg';

export const demoPresentation: Presentation = {
  title: 'SlideCraft — Демонстрация',
  slides: [
    {
      id: 'slide1',
      background: {
        type: 'image',
        value: DESIGN_THEMES.blue_white.backgroundImage!,
        size: DESIGN_THEMES.blue_white.backgroundSize,
        position: DESIGN_THEMES.blue_white.backgroundPosition,
        isLocked: DESIGN_THEMES.blue_white.isLocked,
      },
      elements: [
        {
          id: 'title1',
          type: 'text',
          content: 'SlideCraft:',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'bottom',
          bold: true,
          position: { x: 50, y: 170 },
          size: { width: 180, height: 50 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'text1',
          type: 'text',
          content: 'Создавайте',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'bottom',
          bold: false,
          position: { x: 230, y: 170 },
          size: { width: 270, height: 50 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'text2',
          type: 'text',
          content: 'впечатляющие презентации',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'bottom',
          bold: false,
          position: { x: 50, y: 220 },
          size: { width: 500, height: 50 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'text3',
          type: 'text',
          content:
            'Здравствуйте! Сегодня я рад представить вам SlideCraft - инновационное веб-приложение для созадния современных и интерактивных презентаций прямо в браузере',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#012060',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 50, y: 300 },
          size: { width: 550, height: 100 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          type: 'image',
          id: 'object',
          src: logoImage,
          position: { x: 600, y: 170 },
          size: { width: 350, height: 230 },
          smoothing: 10, // скругленные углы
        },
        {
          id: 'text4',
          type: 'text',
          content: 'Выполнил работу: Глушков Роман ПС - 22',
          fontSize: 20,
          font: "'Times New Roman', serif",
          color: '#000000ff',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 50, y: 500 },
          size: { width: 550, height: 50 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
      ],
    },

    // Следующий слайд с ТОЙ ЖЕ ТЕМОЙ
    {
      id: 'slide2',
      background: {
        type: 'image',
        value: DESIGN_THEMES.blue_white.backgroundImage!, // тот же фон
        size: 'cover',
        position: 'center',
      },
      elements: [
        {
          id: 'title2',
          type: 'text',
          content: 'Почему SlideCraft?',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'bottom',
          bold: true,
          position: { x: 400, y: 50 },
          size: { width: 400, height: 50 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'rect1',
          type: 'shape',
          shapeType: 'rectangle', // тип фигуры
          fill: 'transparent', // цвет заливки (синий)
          stroke: '#81c6d5', // цвет контура (темно-синий)
          strokeWidth: 2, // толщина контура в px
          position: { x: 410, y: 115 }, // позиция
          size: { width: 260, height: 180 }, // размер
        },
        {
          id: 'rect2',
          type: 'shape',
          shapeType: 'rectangle', // тип фигуры
          fill: '#81c6d5', // цвет заливки (синий)
          stroke: '#81c6d5', // цвет контура (темно-синий)
          strokeWidth: 1, // толщина контура в px
          position: { x: 410, y: 115 }, // позиция
          size: { width: 10, height: 180 }, // размер
        },
        {
          id: 'text5',
          type: 'text',
          content: 'Перегруженные интсрументы',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          underline: true,
          position: { x: 430, y: 135 },
          size: { width: 220, height: 60 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'text6',
          type: 'text',
          content: 'Сложные, но негибкие для быстрого редактирования.',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 430, y: 200 },
          size: { width: 220, height: 70 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '2rect1',
          type: 'shape',
          shapeType: 'rectangle', // тип фигуры
          fill: 'transparent', // цвет заливки (синий)
          stroke: '#81c6d5', // цвет контура (темно-синий)
          strokeWidth: 2, // толщина контура в px
          position: { x: 680, y: 115 }, // позиция
          size: { width: 260, height: 180 }, // размер
        },
        {
          id: '2rect2',
          type: 'shape',
          shapeType: 'rectangle', // тип фигуры
          fill: '#81c6d5', // цвет заливки (синий)
          stroke: '#81c6d5', // цвет контура (темно-синий)
          strokeWidth: 1, // толщина контура в px
          position: { x: 680, y: 115 }, // позиция
          size: { width: 10, height: 180 }, // размер
        },
        {
          id: '2text5',
          type: 'text',
          content: 'Неудобная работа',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          underline: true,
          position: { x: 700, y: 135 },
          size: { width: 220, height: 60 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '2text6',
          type: 'text',
          content: 'Отсутствие горячих клавиш, гибкой стилизации.',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 700, y: 200 },
          size: { width: 220, height: 70 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '3rect1',
          type: 'shape',
          shapeType: 'rectangle', // тип фигуры
          fill: 'transparent', // цвет заливки (синий)
          stroke: '#81c6d5', // цвет контура (темно-синий)
          strokeWidth: 2, // толщина контура в px
          position: { x: 410, y: 305 }, // позиция
          size: { width: 260, height: 180 }, // размер
        },
        {
          id: '3rect2',
          type: 'shape',
          shapeType: 'rectangle', // тип фигуры
          fill: '#81c6d5', // цвет заливки (синий)
          stroke: '#81c6d5', // цвет контура (темно-синий)
          strokeWidth: 1, // толщина контура в px
          position: { x: 410, y: 305 }, // позиция
          size: { width: 10, height: 180 }, // размер
        },
        {
          id: '3text5',
          type: 'text',
          content: 'Проблема с сохранением',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          underline: true,
          verticalAlign: 'top',
          bold: false,
          position: { x: 430, y: 325 },
          size: { width: 220, height: 60 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '3text6',
          type: 'text',
          content: 'Нет надежного автосохранения, риск потери данных',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 430, y: 390 },
          size: { width: 220, height: 70 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '4text1',
          type: 'text',
          content:
            'SlideCraft решает эти проблемы, объединяя удобство, функциональность и современный интерфейс.',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#012060',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          italic: true,
          position: { x: 680, y: 305 },
          size: { width: 220, height: 170 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          type: 'image',
          id: 'object1',
          src: thinkimage,
          position: { x: 20, y: 10 },
          size: { width: 350, height: 520 },
          smoothing: 10, // скругленные углы
        },
      ],
    },

    // Все остальные слайды с blue_white темой
  ],
  currentSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
};
