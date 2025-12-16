import { storage, STORAGE_BUCKET_ID, ID } from '../client';

export class ImageService {
  static async uploadImage(file: File): Promise<{
    url: string;
    width: number;
    height: number;
    originalName: string;
  }> {
    const fileId = ID.unique();

    await storage.createFile(STORAGE_BUCKET_ID, fileId, file, ['read("any")']);

    const fileUrl = storage.getFileDownload(STORAGE_BUCKET_ID, fileId).toString();

    const dimensions = await this.getImageDimensions(file);

    return {
      url: fileUrl,
      width: dimensions.width,
      height: dimensions.height,
      originalName: file.name,
    };
  }

  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
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
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    });
  }

  static async deleteImage(fileId: string) {
    await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
  }
}
