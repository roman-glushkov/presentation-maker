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

  copy(elementIds: string[]): void {
    this.clipboard = [...elementIds];
    sessionStorage.setItem('elementsClipboard', JSON.stringify(elementIds));
  }

  cut(elementIds: string[]): void {
    this.clipboard = [...elementIds];
    sessionStorage.setItem('elementsClipboard', JSON.stringify(elementIds));
  }

  paste(): string[] {
    return [...this.clipboard];
  }

  hasData(): boolean {
    return this.clipboard.length > 0;
  }

  clear(): void {
    this.clipboard = [];
    sessionStorage.removeItem('elementsClipboard');
  }
}

export const clipboardService = ClipboardService.getInstance();
