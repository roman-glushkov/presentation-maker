Слайд 1 — Титульный
Здравствуйте! Меня зовут Глушков Роман, группа ПС-22.
Сегодня я с гордостью представляю вам свой проект — SlideCraft.
Это инновационное веб-приложение для создания современных, интерактивных и стильных презентаций прямо в вашем браузере.
Наша цель — сделать этот процесс максимально быстрым, интуитивно понятным и визуально впечатляющим, без необходимости установки какого-либо дополнительного ПО.

**Файлы, используемые для реализации основного интерфейса:**

- `src/App.tsx` - главный компонент приложения
- `src/main.tsx` - точка входа в приложение
- `src/services/auth/AuthWrapper.tsx` - основной контейнер приложения с защитой роутов
- `src/services/styles/AuthWrapper.css` - стили основного интерфейса
- `src/common/view/styles.css` - глобальные стили приложения
- `src/store/index.ts` - корневой файл хранилища
- `src/store/hooks.ts` - хуки доступа к хранилищу
- `src/store/editorSlice.ts` - основной слайс редактора
- `src/store/toolbarSlice.ts` - слайс состояния тулбара

Слайд 2 — Почему SlideCraft?
Перед созданием SlideCraft я глубоко изучил существующие на рынке решения и выделил три ключевые проблемы, с которыми сталкиваются пользователи.
Во-первых, перегруженные интерфейсы: сложные инструменты часто мешают быстрому и гибкому редактированию.
Во-вторых, неудобство в работе: отсутствие горячих клавиш, интуитивного управления и гибкой стилизации.
И в-третьих, ненадёжное сохранение: риск потери данных из-за сбоев или отсутствия автосохранения.
SlideCraft был создан как ответ на все эти вызовы, объединив в себе простоту, мощь и современный подход.

**Файлы, используемые для решения проблем с интерфейсом и сохранением:**

- `src/common/components/Toolbar/index.tsx` - основной тулбар с интеллектуальной блокировкой
- `src/common/components/Toolbar/parts/*` - компоненты частей тулбара
- `src/common/components/Toolbar/styles/*` - стили тулбара
- `src/common/components/Toolbar/utils/availabilityUtils.ts` - утилиты для интеллектуальной блокировки
- `src/common/components/Toolbar/constants/availability.ts` - константы доступности функций
- `src/services/hooks/useAutoSave.ts` - хук автосохранения
- `src/services/notifications/messages.ts` - сообщения об автосохранении
- `src/common/shared/hooks/useKeyboardShortcuts.ts` - обработка горячих клавиш

Слайд 3 — Что такое SlideCraft?
Итак, что же такое SlideCraft? Это полноценный онлайн-редактор презентаций.
Вы можете создавать слайды с нуля, редактировать их, применяя профессиональные стили, и сразу же переходить в режим презентации.
Он идеально подходит для учебных проектов, рабочих отчётов, докладов и любых других задач, где важна визуальная коммуникация. Всё, что вам нужно — это браузер.

**Файлы, используемые для основного функционала редактора:**

- `src/services/auth/Player.tsx` - режим слайд-шоу
- `src/services/styles/Player.css` - стили режима презентации
- `src/common/shared/SlideRenderer.tsx` - универсальный рендерер слайдов
- `src/common/components/Workspace/index.tsx` - основная рабочая область
- `src/common/components/Workspace/parts/WorkspaceCore.tsx` - ядро рабочей области
- `src/common/components/SlidesPanel/index.tsx` - панель слайдов
- `src/store/types/presentation.ts` - типы данных презентации

Слайд 4 — Мощный редактор презентаций
Давайте заглянем «под капот». В основе SlideCraft лежит мощный и продуманный редактор.
Интерактивная панель слайдов с миниатюрами, hover-эффектами и визуальной индикацией.
Гибкое управление: drag & drop, множественный выбор, дублирование, удаление и работа с буфером обмена.
Библиотека шаблонов: 9 готовых типов слайдов — от титульных до сравнительных, что ускоряет создание структуры.

**Файлы, используемые для панели слайдов и шаблонов:**

- `src/common/components/SlidesPanel/index.tsx` - основной компонент панели слайдов
- `src/common/components/SlidesPanel/parts/Container.tsx` - контейнер слайдов
- `src/common/components/SlidesPanel/parts/Row.tsx` - строка слайдов
- `src/common/components/SlidesPanel/parts/PreviewWorkspace.tsx` - превью слайда
- `src/common/components/SlidesPanel/hooks/useSlidesActions.ts` - действия с слайдами
- `src/common/components/SlidesPanel/hooks/useSlidesDrag.ts` - drag & drop слайдов
- `src/common/components/SlidesPanel/hooks/useSlidesNavigation.ts` - навигация по слайдам
- `src/store/templates/slide.ts` - шаблоны слайдов
- `src/store/helperseditor/slide.ts` - обработчик действий со слайдами
- `src/store/functions/presentation.ts` - функции работы с презентацией
- `src/common/components/Toolbar/parts/TemplatePopup.tsx` - всплывающее окно шаблонов
- `src/common/components/Toolbar/parts/TemplatePreview.tsx` - превью шаблона

Слайд 5 — Разнообразные элементы слайдов
SlideCraft предлагает богатый набор инструментов для визуализации:
Текст с полным контролем: шрифты, размер, цвет, выравнивание, тени и фон.
Изображения с поддержкой загрузки, эффектами скругления и теней.
Фигуры — целых 8 типов, от классических прямоугольников и кругов до звёзд, облаков и сердец. Все они рендерятся через SVG и полностью настраиваются.

**Файлы, используемые для работы с элементами слайдов:**

- `src/common/components/Workspace/parts/TextElement.tsx` - текстовый элемент
- `src/common/components/Workspace/parts/ImageElement.tsx` - элемент изображения
- `src/common/components/Workspace/parts/ShapeElement.tsx` - элемент фигуры
- `src/common/components/Workspace/parts/BaseElement.tsx` - базовый элемент
- `src/common/shared/textStyles.ts` - стили текста
- `src/common/shared/imageStyles.ts` - стили изображений
- `src/common/shared/shapeRenderer.tsx` - рендерер фигур
- `src/common/components/Toolbar/hooks/useImageActions.ts` - действия с изображениями
- `src/services/services/ImageService.ts` - сервис загрузки изображений
- `src/store/helperseditor/text.ts` - обработчик действий с текстом
- `src/store/helperseditor/shape.ts` - обработчик действий с фигурами
- `src/common/components/Toolbar/constants/shapes.ts` - типы фигур
- `src/common/components/Toolbar/constants/textOptions.ts` - опции текста

Слайд 6 — Умные списки
Работа с текстом стала ещё удобнее благодаря «умным» спискам.
Доступно 6 стилей маркеров — от классических точек и галочек до стрелок и звёзд.
Система поддерживает автоформатирование: нажмите Enter — список продолжится; измените стиль — он мгновенно применится ко всем элементам.
Шрифты и цвета автоматически согласуются с выбранной темой.

**Файлы, используемые для умных списков:**

- `src/common/components/Workspace/parts/TextElement.tsx` - реализация логики списков
- `src/store/helperseditor/text.ts` - обработка действий со списками
- `src/store/functions/presentation.ts` - функции изменения списка
- `src/common/components/Toolbar/constants/textOptions.ts` - опции списков (маркеры, стили)
- `src/store/templates/presentation.ts` - шаблоны элементов с поддержкой списков

Слайд 7 — Дизайн и стилизация
Чтобы ваша презентация сразу выглядела профессионально, мы добавили мощные инструменты дизайна.
В вашем распоряжении 11 готовых тем оформления и 10 цветовых палитр для быстрого старта.
Все элементы подчиняются единому стилю: тени, скругления углов, согласованные цвета — это создаёт целостный и аккуратный вид каждого слайда.

**Файлы, используемые для дизайна и стилизации:**

- `src/common/components/Toolbar/constants/designThemes.ts` - темы оформления
- `src/common/components/Toolbar/constants/colors.ts` - цветовые палитры
- `src/common/shared/ColorPicker.tsx` - палитра выбора цвета
- `src/common/shared/ColorSwatchButton.tsx` - кнопка выбора цвета
- `src/common/shared/slideBackground.ts` - работа с фоном слайдов
- `src/common/components/Toolbar/parts/ColorSection.tsx` - секция выбора цвета
- `src/store/helperseditor/design.ts` - обработчик действий с дизайном
- `src/common/components/Workspace/parts/ColorPickerContext.tsx` - контекстный выбор цвета
- `src/common/shared/hooks/useKeyboardShortcuts.ts` - горячие клавиши для дизайна

Слайд 8 — Умный интерфейс
В SlideCraft реализован контекстно-зависимый интерфейс, который адаптируется под ваши задачи.
Контекстное меню по правой кнопке мыши показывает только нужные операции: для текста — редактирование, для фигур — заливку, для изображений — эффекты.
Верхняя панель инструментов также интеллектуально блокирует недоступные функции — например, при выделении текста инструменты работы с изображениями становятся неактивными.

**Файлы, используемые для умного интерфейса:**

- `src/common/components/Toolbar/index.tsx` - основной тулбар с интеллектуальной логикой
- `src/common/components/Toolbar/utils/availabilityUtils.ts` - утилиты доступности
- `src/common/components/Toolbar/constants/availability.ts` - константы доступности
- `src/common/components/Workspace/parts/WorkspaceContextMenu.tsx` - контекстное меню
- `src/common/components/Workspace/hooks/useWorkspaceContextMenu.ts` - хук контекстного меню
- `src/common/components/Toolbar/parts/PopupMenus.tsx` - всплывающие меню
- `src/common/components/Toolbar/parts/PopupContent.tsx` - содержимое всплывающих меню
- `src/common/components/Toolbar/parts/Tabs.tsx` - вкладки тулбара
- `src/common/components/Toolbar/parts/Group.tsx` - группы кнопок
- `src/services/hooks/useNotifications.ts` - уведомления об ограничениях

Слайд 9 — Горячие клавиши и Undo/Redo
Для опытных пользователей реализован полный набор горячих клавиш для максимальной скорости работы.
Ctrl/Cmd+C/V для копирования и вставки.
Ctrl/Cmd+Z/Y для отмены и повтора действий.
Delete для удаления.
Все остальные комбинации клавиш можно посмотреть в справке, доступной в правом верхнем углу интерфейса.

**Файлы, используемые для горячих клавиш и истории изменений:**

- `src/common/shared/hooks/useKeyboardShortcuts.ts` - основной хук обработки горячих клавиш
- `src/common/components/Workspace/hooks/useWorkspaceKeyboard.ts` - обработка клавиш в рабочей области
- `src/common/components/Workspace/hooks/useUndoRedoHotkeys.ts` - горячие клавиши отмены/повтора
- `src/common/components/Workspace/utils/elementActions.ts` - действия с элементами (копирование, вставка, удаление)
- `src/common/components/Workspace/utils/clipboardService.ts` - сервис работы с буфером обмена
- `src/store/editorSlice.ts` - слайс с историей изменений
- `src/store/helperseditor/history.ts` - функции работы с историей
- `src/common/components/Toolbar/constants/hotkeys.ts` - константы горячих клавиш
- `src/services/auth/HelpModal.tsx` - модальное окно справки по горячим клавишам
- `src/services/auth/HelpSection.tsx` - секция справки

Слайд 10 — Быстрая навигация и удобство
Скорость работы — наш приоритет. Мы реализовали несколько функций для этого:
Стрелочные клавиши для мгновенного перемещения между слайдами и элементами.
«Умная» прокрутка (Smart-scrolling) для плавной навигации по рабочей области.
Фокус на редактировании: когда вы работаете с текстом, навигационные клавиши временно отключаются, чтобы не отвлекать вас.

**Файлы, используемые для быстрой навигации:**

- `src/common/shared/hooks/useKeyboardShortcuts.ts` - обработка клавиш навигации
- `src/common/components/SlidesPanel/hooks/useSlidesNavigation.ts` - навигация по слайдам
- `src/common/components/Workspace/parts/WorkspaceContent.tsx` - контент рабочей области
- `src/common/components/Workspace/parts/WorkspaceCore.tsx` - ядро рабочей области
- `src/common/shared/hooks/domUtils.ts` - утилиты для работы с DOM и фокусом
- `src/common/components/Workspace/hooks/useWorkspaceKeyboard.ts` - клавиатурные события в рабочей области
- `src/common/components/Workspace/parts/TextElement.tsx` - специальная обработка клавиш при редактировании текста

Слайд 11 — Точность и выравнивание
Для безупречного дизайна критически важна точность. В SlideCraft реализованы сетка и интеллектуальное прилипание (Snap to Grid).
Слабо видимая сетка с шагом в 10 пикселей и умное выравнивание при перетаскивании или изменении размера элементов обеспечивают профессиональную точность компоновки.

**Файлы, используемые для точности и выравнивания:**

- `src/common/components/Workspace/parts/GridOverlay.tsx` - оверлей сетки
- `src/common/components/Workspace/hooks/useDrag.ts` - хук перетаскивания с сеткой
- `src/common/components/Workspace/hooks/useResize.ts` - хук изменения размера с сеткой
- `src/store/toolbarSlice.ts` - состояние видимости сетки
- `src/common/shared/hooks/useKeyboardShortcuts.ts` - клавиатурные функции сетки
- `src/common/components/Toolbar/constants/config.ts` - конфигурация сетки

Слайд 12 — Интерактивный интерфейс
Рабочая область SlideCraft — это живое пространство для творчества.
Поддерживается интерактивное выделение элементов, множественный выбор для групповых операций.
Элементы можно свободно перетаскивать и изменять их размер с помощью 8 контрольных точек для максимальной точности.
А редактирование текста происходит прямо на слайде (inline), без лишних окон и диалогов.

**Файлы, используемые для интерактивного интерфейса:**

- `src/common/components/Workspace/index.tsx` - основная рабочая область
- `src/common/components/Workspace/parts/WorkspaceContent.tsx` - контент рабочей области
- `src/common/components/Workspace/parts/WorkspaceCore.tsx` - ядро рабочей области
- `src/common/components/Workspace/parts/BaseElement.tsx` - базовый элемент с возможностью выделения
- `src/common/components/Workspace/parts/ResizeHandle.tsx` - ручки изменения размера
- `src/common/components/Workspace/hooks/useDrag.ts` - перетаскивание элементов
- `src/common/components/Workspace/hooks/useResize.ts` - изменение размера
- `src/common/components/Workspace/parts/TextElement.tsx` - inline-редактирование текста
- `src/common/components/Workspace/utils/elementActions.ts` - действия с элементами
- `src/common/components/Workspace/utils/clipboardService.ts` - работа с буфером обмена

Слайд 13 — Автосохранение и надёжность
Мы понимаем, как важно не потерять результаты работы. Поэтому в SlideCraft реализована система автосохранения.
Все ваши изменения сохраняются автоматически и централизованно.
Дополнительный уровень надёжности обеспечивает система уведомлений, которая информирует о статусе сохранения. Ваши данные всегда в безопасности.

**Файлы, используемые для автосохранения и надёжности:**

- `src/services/hooks/useAutoSave.ts` - основной хук автосохранения
- `src/services/services/PresentationService.ts` - сервис сохранения презентаций
- `src/services/client.ts` - клиент для взаимодействия с сервером
- `src/services/notifications/messages.ts` - сообщения об автосохранении
- `src/services/notifications/types.ts` - типы уведомлений
- `src/services/hooks/useNotifications.ts` - хук управления уведомлениями
- `src/services/styles/Notification.css` - стили уведомлений
- `src/common/components/Toolbar/index.tsx` - кнопка ручного сохранения
- `src/store/editorSlice.ts` - слайс для отслеживания состояния сохранения

Слайд 14 — Экспорт и публикация
Когда презентация готова, её можно экспортировать в PDF.
Наш рендерер сохраняет все стили, визуальные эффекты и тени, создавая готовый к печати или публикации документ высокого качества.
Это позволяет легко делиться своей работой вне платформы.

**Файлы, используемые для экспорта в PDF:**

- `src/export/usePdfExport.tsx` - хук для экспорта в PDF
- `src/export/PdfSlide.tsx` - компонент слайда для PDF
- `src/common/shared/SlideRenderer.tsx` - универсальный рендерер слайдов (используется и для PDF)
- `src/store/types/presentation.ts` - типы данных для экспорта
- `src/services/components/PresentationList.tsx` - кнопка экспорта в списке презентаций
- `src/services/notifications/messages.ts` - сообщения об экспорте
- `src/services/notifications/validation.ts` - валидация перед экспортом

Слайд 15 — Режим презентации
Когда презентация готова, одним кликом можно перейти в полноэкранный режим показа.
Управление интуитивно: переключение слайдов с клавиатуры или кликом мыши.
Главное — в этом режиме точно сохраняются все пропорции и стили, поэтому ваш дизайн будет выглядеть именно так, как вы задумали, на любом экране.

**Файлы, используемые для режима презентации:**

- `src/services/auth/Player.tsx` - основной компонент режима презентации
- `src/services/styles/Player.css` - стили режима презентации
- `src/common/shared/SlideRenderer.tsx` - рендерер слайдов для презентации
- `src/store/types/presentation.ts` - типы данных для презентации
- `src/common/shared/hooks/useKeyboardShortcuts.ts` - обработка клавиш в режиме презентации
- `src/services/notifications/messages.ts` - сообщения в режиме презентации

Слайд 16 — Спасибо за внимание!
Спасибо за внимание!
Подводя итог, SlideCraft — это современный, функциональный и ориентированный на пользователя инструмент.
Он объединяет простоту интерфейса, мощь редактора, внимание к дизайну и надёжность хранения данных.
Я готов ответить на ваши вопросы.

**Общие файлы, используемые во всем проекте:**

- `src/store/index.ts` - корень хранилища
- `src/store/hooks.ts` - общие хуки хранилища
- `src/common/shared/hooks/domUtils.ts` - общие утилиты DOM
