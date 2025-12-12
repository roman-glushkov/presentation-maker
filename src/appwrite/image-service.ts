import { storage, STORAGE_BUCKET_ID, ID } from './client';

export class ImageService {
  static async uploadImage(file: File): Promise<{
    url: string;
    width: number;
    height: number;
    originalName: string;
  }> {
    try {
      console.log('Загружаем изображение...');

      const fileId = ID.unique();

      const result = await storage.createFile(STORAGE_BUCKET_ID, fileId, file, ['read("any")']);

      console.log('✅ Файл загружен:', result);

      const fileUrl = storage.getFileDownload(STORAGE_BUCKET_ID, fileId).toString();

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

  static async deleteImage(fileId: string) {
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    } catch (error) {
      console.error('❌ Ошибка удаления изображения:', error);
      throw error;
    }
  }
}
