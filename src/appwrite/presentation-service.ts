// src/appwrite/presentation-service.ts
import { databases, DATABASE_ID, COLLECTION_ID, ID } from './client';
import { Presentation } from '../store/types/presentation';

export interface SavedPresentation extends Presentation {
  id?: string;
  ownerId: string;
  ownerName: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  collaborators?: string[];
  version?: number;
}

export interface StoredPresentation extends SavedPresentation {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
}

export class PresentationService {
  // Сохранить презентацию
  static async savePresentation(
    presentation: Presentation,
    userId: string,
    userName: string,
    presentationId?: string // ← ДОБАВЛЕН ОПЦИОНАЛЬНЫЙ ПАРАМЕТР
  ): Promise<StoredPresentation> {
    try {
      console.log('Saving presentation:', {
        hasId: !!presentationId,
        title: presentation.title,
        slidesCount: presentation.slides?.length,
        userId,
        userName,
      });

      const data: SavedPresentation = {
        title: presentation.title || 'Без названия',
        slides: presentation.slides || [],
        currentSlideId: presentation.currentSlideId || '',
        selectedSlideIds: presentation.selectedSlideIds || [],
        ownerId: userId,
        ownerName: userName,
        updatedAt: new Date().toISOString(),
      };

      // Добавляем ID если есть
      if (presentationId) {
        data.id = presentationId;
      }

      if (presentationId) {
        // Обновляем существующую
        const result = await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          presentationId,
          data
        );

        console.log('✅ Презентация обновлена:', result.$id);
        return {
          ...(result as unknown as StoredPresentation),
          id: result.$id,
          title: data.title,
          slides: data.slides,
          currentSlideId: data.currentSlideId,
          selectedSlideIds: data.selectedSlideIds,
          ownerId: data.ownerId,
          ownerName: data.ownerName,
        };
      } else {
        // Создаем новую
        const result = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
          ...data,
          createdAt: new Date().toISOString(),
        });

        console.log('✅ Новая презентация создана:', result.$id);
        return {
          ...(result as unknown as StoredPresentation),
          id: result.$id,
          title: data.title,
          slides: data.slides,
          currentSlideId: data.currentSlideId,
          selectedSlideIds: data.selectedSlideIds,
          ownerId: data.ownerId,
          ownerName: data.ownerName,
        };
      }
    } catch (error: any) {
      console.error('❌ Ошибка сохранения презентации:', {
        error,
        message: error.message,
        code: error.code,
        type: error.type,
      });
      throw error;
    }
  }

  // Получить все презентации пользователя
  static async getUserPresentations(userId: string): Promise<StoredPresentation[]> {
    try {
      const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        `ownerId=${userId}`,
      ]);

      // Преобразуем в формат, который понимает редактор
      return result.documents.map((doc) => {
        const docData = doc as unknown as Record<string, any>;
        return {
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
          $permissions: doc.$permissions,
          $collectionId: doc.$collectionId,
          $databaseId: doc.$databaseId,
          id: doc.$id,
          title: docData.title || 'Без названия',
          slides: docData.slides || [],
          currentSlideId: docData.currentSlideId || '',
          selectedSlideIds: docData.selectedSlideIds || [],
          ownerId: docData.ownerId || '',
          ownerName: docData.ownerName || '',
          updatedAt: docData.updatedAt || '',
          createdAt: docData.createdAt || '',
        } as StoredPresentation;
      });
    } catch (error) {
      console.error('❌ Ошибка загрузки презентаций:', error);
      return [];
    }
  }

  // Получить одну презентацию по ID
  static async getPresentation(id: string): Promise<StoredPresentation> {
    try {
      const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);

      const docData = doc as unknown as Record<string, any>;
      return {
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        $permissions: doc.$permissions,
        $collectionId: doc.$collectionId,
        $databaseId: doc.$databaseId,
        id: doc.$id,
        title: docData.title || 'Без названия',
        slides: docData.slides || [],
        currentSlideId: docData.currentSlideId || '',
        selectedSlideIds: docData.selectedSlideIds || [],
        ownerId: docData.ownerId || '',
        ownerName: docData.ownerName || '',
        updatedAt: docData.updatedAt || '',
        createdAt: docData.createdAt || '',
      } as StoredPresentation;
    } catch (error) {
      console.error('❌ Ошибка загрузки презентации:', error);
      throw error;
    }
  }

  // Удалить презентацию
  static async deletePresentation(id: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error) {
      console.error('❌ Ошибка удаления презентации:', error);
      throw error;
    }
  }

  // Создать новую пустую презентацию
  static createEmptyPresentation(title = 'Новая презентация'): Presentation {
    const slideId = `slide-${Date.now()}`;
    return {
      title,
      slides: [
        {
          id: slideId,
          background: { type: 'color', value: '#ffffff' },
          elements: [],
        },
      ],
      currentSlideId: slideId,
      selectedSlideIds: [slideId],
    };
  }
}
