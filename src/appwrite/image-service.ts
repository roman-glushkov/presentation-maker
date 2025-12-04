// appwrite/image-service.ts
import { storage, STORAGE_BUCKET_ID, ID } from './client';

export class ImageService {
  // Загрузить картинку и получить её размеры
  static async uploadImage(file: File): Promise<{
    url: string;
    width: number;
    height: number;
    originalName: string;
  }> {
    try {
      console.log('Загружаем изображение...');

      const fileId = ID.unique();

      // Загружаем файл
      const result = await storage.createFile(STORAGE_BUCKET_ID, fileId, file, ['read("any")']);

      console.log('✅ Файл загружен:', result);

      // Получаем URL
      const fileUrl = storage.getFileDownload(STORAGE_BUCKET_ID, fileId).toString();

      // Получаем размеры изображения
      const dimensions = await this.getImageDimensions(file);

      return {
        url: fileUrl,
        width: dimensions.width,
        height: dimensions.height,
        originalName: file.name,
      };
    } catch (error: any) {
      console.error('❌ Ошибка при загрузке изображения:', error);
      throw error;
    }
  }

  // Вспомогательный метод для получения размеров изображения
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        reject(new Error('Не удалось определить размеры изображения'));
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    });
  }

  // Удалить картинку
  static async deleteImage(fileId: string) {
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    } catch (error) {
      console.error('❌ Ошибка удаления изображения:', error);
      throw error;
    }
  }
}
