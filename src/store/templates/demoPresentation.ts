import { Presentation } from '../types/presentation';
import { DESIGN_THEMES } from '../../common/components/Toolbar/constants/designThemes'; // путь к вашим константам
import logoImage from '../../common/components/Toolbar/assets/presentation/logo.png';
import thinkImage from '../../common/components/Toolbar/assets/presentation/think.jpg';
import workerImage from '../../common/components/Toolbar/assets/presentation/worker.jpg';
import templatesImage from '../../common/components/Toolbar/assets/presentation/templates.png';
import keyboardImage from '../../common/components/Toolbar/assets/presentation/keyboard.jpg';
import reactImage from '../../common/components/Toolbar/assets/presentation/react.jpg';

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
          size: { width: 550, height: 35 },
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
          font: 'Arial, sans-serif',
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
          font: 'Arial, sans-serif',
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
          font: 'Arial, sans-serif',
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
          font: 'Arial, sans-serif',
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
          src: thinkImage,
          position: { x: 20, y: 10 },
          size: { width: 350, height: 520 },
          smoothing: 10,
        },
      ],
    },
    {
      id: 'slide3',
      background: {
        type: 'image',
        value: DESIGN_THEMES.blue_white.backgroundImage!,
        size: 'cover',
        position: 'center',
      },
      elements: [
        {
          id: 'tt31',
          type: 'text',
          content: 'Что такое SlideCraft?',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'bottom',
          bold: true,
          position: { x: 50, y: 170 },
          size: { width: 400, height: 50 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          type: 'image',
          id: '31',
          src: workerImage,
          position: { x: 520, y: 120 },
          size: { width: 400, height: 329 },
          smoothing: 10,
        },
        {
          id: 'tt32',
          type: 'text',
          content: 'SlideCraft',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#81c6d5',
          align: 'left',
          verticalAlign: 'top',
          bold: true,
          position: { x: 50, y: 270 },
          size: { width: 90, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'tt33',
          type: 'text',
          content: '- это полноценный онлайн-редактор прзентаций.',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 140, y: 270 },
          size: { width: 450, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'tt34',
          type: 'text',
          content:
            '• Создавайте, редактируйте, оформляйте\n• Показывайте презентации без установки ПО\n• Идеален для учебных и рабочих задач',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          lineHeight: 2,
          position: { x: 50, y: 330 },
          size: { width: 450, height: 120 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
      ],
    },
    {
      id: 'slide4',
      background: {
        type: 'image',
        value: DESIGN_THEMES.blue_white.backgroundImage!,
        size: 'cover',
        position: 'center',
      },
      elements: [
        {
          id: 'tt41',
          type: 'text',
          content: 'Мощный Редактор Презентаций',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'bottom',
          bold: true,
          position: { x: 360, y: 50 },
          size: { width: 400, height: 100 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'tt42',
          type: 'text',
          content: '1',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'center',
          verticalAlign: 'middle',
          bold: false,
          backgroundColor: '#81c6d5',
          position: { x: 360, y: 170 },
          size: { width: 270, height: 25 },
        },
        {
          id: 'tt43',
          type: 'text',
          content: 'Панель слайдов',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 370, y: 210 },
          size: { width: 250, height: 25 },
        },
        {
          id: 'tt44',
          type: 'text',
          content: 'Интерактивные миниатюры, визуальная индикация, hover-эффекты.',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 370, y: 245 },
          size: { width: 250, height: 80 },
        },
        {
          id: 'tt45',
          type: 'text',
          content: '2',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'center',
          verticalAlign: 'middle',
          bold: false,
          backgroundColor: '#81c6d5',
          position: { x: 650, y: 170 },
          size: { width: 270, height: 25 },
        },
        {
          id: 'tt46',
          type: 'text',
          content: 'Гибкое управление',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 660, y: 210 },
          size: { width: 250, height: 25 },
        },
        {
          id: 'tt47',
          type: 'text',
          content: 'Drag & drop, множественное выделение, дублирование, удаление, буфер обмена.',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 660, y: 245 },
          size: { width: 250, height: 80 },
        },
        {
          id: 'tt48',
          type: 'text',
          content: '3',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'center',
          verticalAlign: 'middle',
          bold: false,
          backgroundColor: '#81c6d5',
          position: { x: 360, y: 360 },
          size: { width: 550, height: 25 },
        },
        {
          id: 'tt49',
          type: 'text',
          content: 'Готовые шаблоны',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 370, y: 400 },
          size: { width: 530, height: 25 },
        },
        {
          id: 'tt410',
          type: 'text',
          content: '9 типов слайдов: от титульных до сравнительных.',
          fontSize: 18,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 370, y: 435 },
          size: { width: 530, height: 30 },
        },
        {
          type: 'image',
          id: '41',
          src: templatesImage,
          position: { x: 50, y: 50 },
          size: { width: 242, height: 450 },
          smoothing: 10,
        },
      ],
    },
    {
      id: 'slide5',
      background: {
        type: 'image',
        value: DESIGN_THEMES.blue_white.backgroundImage!,
        size: 'cover',
        position: 'center',
      },
      elements: [
        {
          id: 'tt51',
          type: 'text',
          content: 'Быстрая Навигация и Удобство',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: true,
          position: { x: 360, y: 50 },
          size: { width: 560, height: 50 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '1rect5',
          type: 'shape',
          shapeType: 'hexagon', // тип фигуры
          fill: '#daedf3', // цвет заливки (синий)
          stroke: '#0071c2', // цвет контура (темно-синий)
          strokeWidth: 4, // толщина контура в px
          position: { x: 360, y: 130 }, // позиция
          size: { width: 80, height: 100 }, // размер
        },
        {
          id: 'tt52',
          type: 'text',
          content: '1',
          fontSize: 28,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'center',
          verticalAlign: 'middle',
          bold: false,
          position: { x: 360, y: 130 },
          size: { width: 80, height: 100 },
        },
        {
          id: 'tt55',
          type: 'text',
          content: 'Стрелочные клавиши',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 460, y: 145 },
          size: { width: 400, height: 30 },
        },
        {
          id: 'tt56',
          type: 'text',
          content: 'Мгновенное перемещение.',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 460, y: 185 },
          size: { width: 400, height: 30 },
        },
        {
          id: '2rect5',
          type: 'shape',
          shapeType: 'hexagon', // тип фигуры
          fill: '#daedf3', // цвет заливки (синий)
          stroke: '#0071c2', // цвет контура (темно-синий)
          strokeWidth: 4, // толщина контура в px
          position: { x: 360, y: 230 }, // позиция
          size: { width: 80, height: 100 }, // размер
        },
        {
          id: 'tt53',
          type: 'text',
          content: '2',
          fontSize: 28,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'center',
          verticalAlign: 'middle',
          bold: false,
          position: { x: 360, y: 230 },
          size: { width: 80, height: 100 },
        },
        {
          id: 'tt57',
          type: 'text',
          content: 'Smart-scrolling',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 460, y: 245 },
          size: { width: 400, height: 30 },
        },
        {
          id: 'tt58',
          type: 'text',
          content: 'Плавная прокрутка.',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 460, y: 285 },
          size: { width: 400, height: 30 },
        },
        {
          id: '3rect5',
          type: 'shape',
          shapeType: 'hexagon', // тип фигуры
          fill: '#daedf3', // цвет заливки (синий)
          stroke: '#0071c2', // цвет контура (темно-синий)
          strokeWidth: 4, // толщина контура в px
          position: { x: 360, y: 330 }, // позиция
          size: { width: 80, height: 130 }, // размер
        },
        {
          id: 'tt54',
          type: 'text',
          content: '3',
          fontSize: 28,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'center',
          verticalAlign: 'middle',
          bold: false,
          position: { x: 360, y: 330 },
          size: { width: 80, height: 130 },
        },
        {
          id: 'tt59',
          type: 'text',
          content: 'Без отвлечений',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 460, y: 345 },
          size: { width: 400, height: 30 },
        },
        {
          id: 'tt510',
          type: 'text',
          content: 'Игнорирование навигации во время редактирования текста.',
          fontSize: 20,
          font: 'Arial, sans-serif',
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 460, y: 385 },
          size: { width: 400, height: 60 },
        },
        {
          type: 'image',
          id: '51',
          src: keyboardImage,
          position: { x: 30, y: 120 },
          size: { width: 300, height: 300 },
          smoothing: 10,
        },
      ],
    },
    {
      id: 'slide6',
      background: {
        type: 'image',
        value: DESIGN_THEMES.blue_white.backgroundImage!,
        size: 'cover',
        position: 'center',
      },
      elements: [
        {
          id: 'tt61',
          type: 'text',
          content: 'Разнообразные Элементы Слайдов',
          fontSize: 36,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: true,
          position: { x: 420, y: 50 },
          size: { width: 500, height: 100 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '1rect6',
          type: 'shape',
          shapeType: 'circle', // тип фигуры
          fill: '#daedf3', // цвет заливки (синий)
          stroke: '#0071c2', // цвет контура (темно-синий)
          strokeWidth: 4, // толщина контура в px
          position: { x: 420, y: 170 }, // позиция
          size: { width: 50, height: 50 }, // размер
        },
        {
          id: 'tt62',
          type: 'text',
          content: 'Текст',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 420, y: 220 },
          size: { width: 500, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'tt63',
          type: 'text',
          content: 'Шрифт, размер, цвет, выравнивание, тени, фон.',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 420, y: 250 },
          size: { width: 500, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '2rect6',
          type: 'shape',
          shapeType: 'circle', // тип фигуры
          fill: '#daedf3', // цвет заливки (синий)
          stroke: '#0071c2', // цвет контура (темно-синий)
          strokeWidth: 4, // толщина контура в px
          position: { x: 420, y: 290 }, // позиция
          size: { width: 50, height: 50 }, // размер
        },
        {
          id: 'tt64',
          type: 'text',
          content: 'Изображения',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 420, y: 340 },
          size: { width: 500, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'tt65',
          type: 'text',
          content: 'Загрузка, эффекты, тени, скругление.',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 420, y: 370 },
          size: { width: 500, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '3rect6',
          type: 'shape',
          shapeType: 'circle', // тип фигуры
          fill: '#daedf3', // цвет заливки (синий)
          stroke: '#0071c2', // цвет контура (темно-синий)
          strokeWidth: 4, // толщина контура в px
          position: { x: 420, y: 410 }, // позиция
          size: { width: 50, height: 50 }, // размер
        },
        {
          id: 'tt66',
          type: 'text',
          content: 'Фигуры',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 420, y: 460 },
          size: { width: 500, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: 'tt67',
          type: 'text',
          content: '8 типов, SVG-рендеринг, полная стилизация.',
          fontSize: 18,
          font: "'Trebuchet MS', sans-serif",
          color: '#203864',
          align: 'left',
          verticalAlign: 'top',
          bold: false,
          position: { x: 420, y: 490 },
          size: { width: 500, height: 30 },
          shadow: {
            color: '0',
            blur: 0,
          },
        },
        {
          id: '4rect6',
          type: 'shape',
          shapeType: 'rectangle', // тип фигуры
          fill: '#c00000', // цвет заливки (синий)
          stroke: '#843e0d', // цвет контура (темно-синий)
          strokeWidth: 10, // толщина контура в px
          position: { x: 10, y: 10 }, // позиция
          size: { width: 85, height: 80 }, // размер
          shadow: {
            color: 'rgba(0, 0, 0, 0.5)',
            blur: 8,
          },
        },
        {
          id: '5rect6',
          type: 'shape',
          shapeType: 'circle', // тип фигуры
          fill: '#ff0101', // цвет заливки (синий)
          stroke: '#bf9100', // цвет контура (темно-синий)
          strokeWidth: 8, // толщина контура в px
          position: { x: 115, y: 10 }, // позиция
          size: { width: 85, height: 80 }, // размер
          shadow: {
            color: 'rgba(255, 0, 0, 0.5)',
            blur: 6,
          },
        },
        {
          id: '6rect6',
          type: 'shape',
          shapeType: 'triangle', // тип фигуры
          fill: '#febe00', // цвет заливки (синий)
          stroke: '#7e6000', // цвет контура (темно-синий)
          strokeWidth: 6, // толщина контура в px
          position: { x: 220, y: 10 }, // позиция
          size: { width: 85, height: 80 }, // размер
          shadow: {
            color: 'rgba(0, 123, 255, 0.5)',
            blur: 6,
          },
        },
        {
          id: '7rect6',
          type: 'shape',
          shapeType: 'star', // тип фигуры
          fill: '#ffc000', // цвет заливки (синий)
          stroke: '#2e75b5', // цвет контура (темно-синий)
          strokeWidth: 5, // толщина контура в px
          position: { x: 325, y: 10 }, // позиция
          size: { width: 85, height: 80 }, // размер
          shadow: {
            color: 'rgba(0, 128, 0, 0.5)',
            blur: 6,
          },
        },
        {
          id: '8rect6',
          type: 'shape',
          shapeType: 'hexagon', // тип фигуры
          fill: '#8fd04e', // цвет заливки (синий)
          stroke: '#a7d08c', // цвет контура (темно-синий)
          strokeWidth: 4, // толщина контура в px
          position: { x: 10, y: 90 }, // позиция
          size: { width: 85, height: 90 }, // размер
          shadow: {
            color: 'rgba(255, 215, 0, 0.7)',
            blur: 10,
          },
        },
        {
          id: '9rect6',
          type: 'shape',
          shapeType: 'cloud', // тип фигуры
          fill: '#00af50', // цвет заливки (синий)
          stroke: '#012060', // цвет контура (темно-синий)
          strokeWidth: 3, // толщина контура в px
          position: { x: 115, y: 100 }, // позиция
          size: { width: 85, height: 80 }, // размер
          shadow: {
            color: 'rgba(128, 0, 128, 0.6)',
            blur: 8,
          },
        },
        {
          id: '10rect6',
          type: 'shape',
          shapeType: 'callout', // тип фигуры
          fill: '#01b0f1', // цвет заливки (синий)
          stroke: '#222834', // цвет контура (темно-синий)
          strokeWidth: 2, // толщина контура в px
          position: { x: 220, y: 100 }, // позиция
          size: { width: 85, height: 80 }, // размер
          shadow: {
            color: 'rgba(255, 105, 180, 0.5)',
            blur: 6,
          },
        },
        {
          id: '11rect6',
          type: 'shape',
          shapeType: 'heart', // тип фигуры
          fill: '#7030a0', // цвет заливки (синий)
          stroke: '#bdd7ee', // цвет контура (темно-синий)
          strokeWidth: 1, // толщина контура в px
          position: { x: 325, y: 100 }, // позиция
          size: { width: 85, height: 80 }, // размер
          shadow: {
            color: 'rgba(0, 0, 0, 0.15)',
            blur: 3,
          },
        },
        {
          id: 'tt68',
          type: 'text',
          content: 'Шрифт',
          fontSize: 96,
          font: 'Impact, sans-serif',
          color: '#ffffffff',
          backgroundColor: '#000000ff',
          align: 'center',
          verticalAlign: 'middle',
          bold: true,
          italic: true,
          underline: true,
          position: { x: 10, y: 190 },
          size: { width: 400, height: 170 },
          smoothing: 100,
          shadow: {
            color: 'rgba(255, 255, 255, 0.8)',
            blur: 12,
          },
        },
        {
          type: 'image',
          id: '61',
          src: reactImage,
          position: { x: 70, y: 370 },
          size: { width: 280, height: 140 },
          smoothing: 50,
          shadow: {
            color: 'rgba(0, 123, 255, 0.5)',
            blur: 6,
          },
        },
      ],
    },
  ],
  currentSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
};
