// C:\PGTU\FRONT-end\presentation maker\src\common\utils\clipboardService.ts

class ClipboardService {
  private static instance: ClipboardService;
  private clipboard: string[] = [];

  private constructor() {}

  static getInstance(): ClipboardService {
    if (!ClipboardService.instance) {
      ClipboardService.instance = new ClipboardService();
    }
    return ClipboardService.instance;
  }

  // Копирование элементов
  copy(elementIds: string[]): void {
    this.clipboard = [...elementIds];
    // Также сохраняем в sessionStorage для совместимости
    sessionStorage.setItem('elementsClipboard', JSON.stringify(elementIds));
  }

  // Вырезание элементов
  cut(elementIds: string[]): void {
    this.clipboard = [...elementIds];
    sessionStorage.setItem('elementsClipboard', JSON.stringify(elementIds));
  }

  // Получение элементов из буфера
  paste(): string[] {
    return [...this.clipboard];
  }

  // Проверка, есть ли данные в буфере
  hasData(): boolean {
    return this.clipboard.length > 0;
  }

  // Очистка буфера
  clear(): void {
    this.clipboard = [];
    sessionStorage.removeItem('elementsClipboard');
  }
}

export const clipboardService = ClipboardService.getInstance();
